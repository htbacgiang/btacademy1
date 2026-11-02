import multiparty from 'multiparty';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import db from '../../utils/db';
import VoiceTestSubmission from '../../models/VoiceTestSubmission';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Helper to parse JSON body when bodyParser is false
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handlePost(req, res);
  } else if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'PATCH' || req.method === 'PUT') {
    return handlePatch(req, res);
  } else if (req.method === 'DELETE') {
    return handleDelete(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

// ──────────────────────────────────────────────
// POST: Submit voice test (Public)
// ──────────────────────────────────────────────
async function handlePost(req, res) {
  try {
    const form = new multiparty.Form({
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
    });

    const result = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { fields, files } = result;
    const email = fields.email?.[0]?.trim() || '';
    const phone = fields.phone?.[0]?.trim() || '';
    const audioFile = files.audioFile?.[0];

    // Validate required fields
    if (!email && !phone) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp email hoặc số điện thoại',
      });
    }

    if (!audioFile) {
      return res.status(400).json({
        message: 'Vui lòng tải lên file audio',
      });
    }

    const timestamp = Date.now();
    const originalFilename = audioFile.originalFilename || 'voice-test.wav';
    const fileExtension = originalFilename.split('.').pop() || 'wav';
    const fileName = `voice-test-${timestamp}.${fileExtension}`;

    // Upload audio to Cloudinary or save locally
    let audioUrl = '';
    try {
      if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
        const uploadResult = await cloudinary.v2.uploader.upload(audioFile.path, {
          folder: `${process.env.CLOUDINARY_FOLDER || 'btacademy'}/voice-tests`,
          resource_type: 'auto',
          public_id: `voice_${timestamp}`,
        });
        audioUrl = uploadResult.secure_url;
      }
    } catch (uploadError) {
      console.warn('Cloudinary upload warning:', uploadError?.message || uploadError);
    }

    // Fallback: if Cloudinary didn't return URL, copy file locally to public/uploads/voice-tests/
    if (!audioUrl) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'voice-tests');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localDest = path.join(uploadsDir, fileName);
        fs.copyFileSync(audioFile.path, localDest);
        audioUrl = `/uploads/voice-tests/${fileName}`;
      } catch (localErr) {
        console.warn('Local audio save warning:', localErr?.message || localErr);
      }
    }

    // Save record to MongoDB database
    let savedSubmission = null;
    try {
      await db.connectDb();
      savedSubmission = await VoiceTestSubmission.create({
        email,
        phone,
        audioUrl,
        fileName,
        originalFilename,
        fileSize: audioFile.size || 0,
        status: 'pending',
        submittedAt: new Date(),
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || '',
      });
    } catch (dbError) {
      console.error('Error saving VoiceTestSubmission to DB:', dbError);
    }

    // Send email notification to admin with attachment
    try {
      await sendEmailNotification({
        email,
        phone,
        fileName,
        filePath: audioFile.path,
        originalFilename,
        audioUrl,
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
    }

    // Clean up temporary multiparty file
    try {
      if (fs.existsSync(audioFile.path)) {
        fs.unlinkSync(audioFile.path);
      }
    } catch (cleanupError) {
      console.warn('Could not clean up temporary file:', cleanupError);
    }

    return res.status(200).json({
      success: true,
      message: 'Bài test giọng đã được gửi thành công!',
      submissionId: savedSubmission?._id || timestamp,
      data: savedSubmission,
    });
  } catch (error) {
    console.error('Error processing voice test submission:', error);
    return res.status(500).json({
      message: 'Có lỗi xảy ra khi xử lý bài test. Vui lòng thử lại.',
    });
  }
}

// ──────────────────────────────────────────────
// GET: List submissions (Admin only)
// ──────────────────────────────────────────────
async function handleGet(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập thông tin này',
      });
    }

    await db.connectDb();

    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ email: regex }, { phone: regex }, { note: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [submissions, totalItems, pendingCount, contactedCount, completedCount] =
      await Promise.all([
        VoiceTestSubmission.find(query)
          .sort({ submittedAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        VoiceTestSubmission.countDocuments(query),
        VoiceTestSubmission.countDocuments({ status: 'pending' }),
        VoiceTestSubmission.countDocuments({ status: 'contacted' }),
        VoiceTestSubmission.countDocuments({ status: { $in: ['reviewed', 'completed'] } }),
      ]);

    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    return res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalPages,
        totalItems,
      },
      stats: {
        total: await VoiceTestSubmission.countDocuments({}),
        pending: pendingCount,
        contacted: contactedCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error('Error fetching voice test submissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi tải danh sách bài test',
    });
  }
}

// ──────────────────────────────────────────────
// PATCH: Update status & note (Admin only)
// ──────────────────────────────────────────────
async function handlePatch(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này',
      });
    }

    const body = await parseJsonBody(req);
    const { id, status, note } = body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu ID bài test',
      });
    }

    await db.connectDb();
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (note !== undefined) updateData.note = note;

    const updated = await VoiceTestSubmission.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài test',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating voice test submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi cập nhật',
    });
  }
}

// ──────────────────────────────────────────────
// DELETE: Delete submission (Admin only)
// ──────────────────────────────────────────────
async function handleDelete(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này',
      });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu ID bài test cần xóa',
      });
    }

    await db.connectDb();
    const deleted = await VoiceTestSubmission.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài test để xóa',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Xóa bài test thành công',
    });
  } catch (error) {
    console.error('Error deleting voice test submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi xóa bài test',
    });
  }
}

// ──────────────────────────────────────────────
// Email notification helper
// ──────────────────────────────────────────────
async function sendEmailNotification({ email, phone, fileName, filePath, originalFilename, audioUrl }) {
  try {
    const host = process.env.SMTP_HOST || 'smtp-relay.brevo.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const senderEmail = process.env.EMAIL_FROM || user;
    const isBrevoOrCustom = Boolean(process.env.SMTP_PASS || process.env.SMTP_HOST);

    const transporter = nodemailer.createTransport(
      isBrevoOrCustom
        ? {
            host,
            port,
            secure: port === 465,
            auth: {
              user,
              pass,
            },
          }
        : {
            service: 'gmail',
            auth: {
              user,
              pass,
            },
          }
    );

    const contactInfo = email ? `Email: ${email}` : `Số điện thoại: ${phone}`;
    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim()).filter(Boolean)
      : process.env.ADMIN_EMAIL
      ? [process.env.ADMIN_EMAIL]
      : [];

    if (adminEmails.length === 0) {
      console.warn('No admin email configured, skipping email notification');
      return;
    }

    const audioUrlHtml = audioUrl
      ? `<p><strong>Link nghe trực tiếp:</strong> <a href="${audioUrl}" target="_blank">${audioUrl}</a></p>`
      : '';

    const mailOptions = {
      from: `"BT Academy" <${senderEmail}>`,
      to: adminEmails,
      subject: `Bài Test Giọng MC Mới từ ${email || phone} - BT Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Bài Test Giọng MC Mới</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Thông tin người đăng ký:</h3>
            <p><strong>${contactInfo}</strong></p>
            ${phone ? `<p><strong>Số điện thoại:</strong> ${phone}</p>` : ''}
            ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
            <p><strong>Thời gian gửi:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0;">File Audio:</h4>
            <p><strong>Tên file gốc:</strong> ${originalFilename}</p>
            <p><strong>File đính kèm:</strong> ${fileName}</p>
            ${audioUrlHtml}
          </div>

          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #065f46; margin-top: 0;">Hướng dẫn xử lý:</h4>
            <p>1. <strong>Tải file audio</strong> đính kèm hoặc truy cập dashboard để nghe đánh giá</p>
            <p>2. <strong>Liên hệ ngay</strong> với người đăng ký qua ${contactInfo}</p>
            <p>3. <strong>Tư vấn</strong> và đưa ra lộ trình phát triển giọng nói</p>
            <p>4. <strong>Cập nhật</strong> trạng thái trong trang quản trị Dashboard</p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px;">
              Email này được gửi tự động từ hệ thống BT Academy
            </p>
          </div>
        </div>
      `,
      attachments: fs.existsSync(filePath)
        ? [
            {
              filename: fileName,
              path: filePath,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email notification sent successfully to ${adminEmails.length} recipient(s)`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}
