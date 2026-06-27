import db from '../../../utils/db';
import Subscription from '../../../models/Subscription';
import Course from '../../../models/Course';
import { subscriptionEmailTemplate } from '../../../emails/subscriptionEmailTemplate';
import { sendEmail } from '../../../utils/sendEmails';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === 'POST') {
    try {
      const { 
        email, 
        name, 
        age, 
        phone, 
        purpose, 
        courseSlug,
        source = 'website', 
        ipAddress, 
        userAgent 
      } = req.body;

      // Validate email
      if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email không hợp lệ' 
        });
      }

      // Check if email already exists (only if email is provided)
      let existingSubscription = null;
      if (email && email.trim()) {
        existingSubscription = await Subscription.findOne({ 
          email: email.toLowerCase() 
        });
      }

      if (existingSubscription) {
        if (existingSubscription.status === 'active') {
          // Update existing subscription with new information
          existingSubscription.name = name || existingSubscription.name;
          existingSubscription.age = age || existingSubscription.age;
          existingSubscription.phone = phone || existingSubscription.phone;
          existingSubscription.purpose = purpose || existingSubscription.purpose;
          existingSubscription.courseSlug = courseSlug || existingSubscription.courseSlug;
          existingSubscription.source = source;
          existingSubscription.ipAddress = ipAddress;
          existingSubscription.userAgent = userAgent;
          
          await existingSubscription.save();
          
          return res.status(200).json({ 
            success: true, 
            message: 'Cập nhật thông tin đăng ký thành công!' 
          });
        } else {
          // Reactivate subscription with new information
          existingSubscription.status = 'active';
          existingSubscription.unsubscribedAt = null;
          existingSubscription.name = name || existingSubscription.name;
          existingSubscription.age = age || existingSubscription.age;
          existingSubscription.phone = phone || existingSubscription.phone;
          existingSubscription.purpose = purpose || existingSubscription.purpose;
          existingSubscription.courseSlug = courseSlug || existingSubscription.courseSlug;
          existingSubscription.source = source;
          existingSubscription.ipAddress = ipAddress;
          existingSubscription.userAgent = userAgent;
          
          await existingSubscription.save();
          
          // Send welcome back email (only if email is provided)
          if (email && email.trim()) {
            await sendSubscriptionEmail(email);
          }
          
          return res.status(200).json({ 
            success: true, 
            message: 'Đăng ký lại thành công! Chào mừng bạn quay trở lại.' 
          });
        }
      }

      // Create new subscription
      const subscription = new Subscription({
        email: email ? email.toLowerCase() : null,
        name: name || null,
        age: age || null,
        phone: phone || null,
        purpose: purpose || null,
        courseSlug: courseSlug || null,
        source,
        ipAddress,
        userAgent
      });

      await subscription.save();

      // Send welcome email (only if email is provided)
      if (email && email.trim()) {
        await sendSubscriptionEmail(email);
      }

      res.status(201).json({ 
        success: true, 
        message: email && email.trim() 
          ? 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.' 
          : 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
      });

    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra, vui lòng thử lại sau' 
      });
    }
  } else if (req.method === 'GET') {
    try {
      // Authenticate admin
      const session = await getServerSession(req, res, authOptions);
      if (!session || session.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập thông tin này'
        });
      }

      const { page = 1, limit = 10, status, search } = req.query;
      
      const query = {};
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (page - 1) * limit;
      
      const subscriptions = await Subscription.find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v')
        .lean();

      // Get course names for subscriptions with courseSlug
      const courseSlugs = subscriptions
        .filter(sub => sub.courseSlug)
        .map(sub => sub.courseSlug);
      
      const courses = await Course.find({ slug: { $in: courseSlugs } })
        .select('title slug')
        .lean();
      
      const courseMap = {};
      courses.forEach(course => {
        courseMap[course.slug] = course.title;
      });

      // Add course name to subscriptions
      const subscriptionsWithCourseNames = subscriptions.map(sub => ({
        ...sub,
        courseName: sub.courseSlug ? courseMap[sub.courseSlug] || 'Khóa học không tìm thấy' : null
      }));

      const total = await Subscription.countDocuments(query);

      res.status(200).json({
        success: true,
        data: subscriptionsWithCourseNames,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          totalItems: total
        }
      });

    } catch (error) {
      console.error('Get subscriptions error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Có lỗi xảy ra khi lấy danh sách đăng ký' 
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Authenticate admin
      const session = await getServerSession(req, res, authOptions);
      if (!session || session.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền thực hiện hành động này'
        });
      }

      const { id } = req.query;
      const bodyId = req.body && req.body.id;
      const targetId = id || bodyId;

      if (!targetId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu ID đăng ký cần xóa'
        });
      }

      const deletedSubscription = await Subscription.findByIdAndDelete(targetId);

      if (!deletedSubscription) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đăng ký'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Xóa đăng ký thành công'
      });

    } catch (error) {
      console.error('Delete subscription error:', error);
      res.status(500).json({
        success: false,
        message: 'Có lỗi xảy ra khi xóa đăng ký'
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} Not Allowed` 
    });
  }
}

async function sendSubscriptionEmail(email) {
  try {
    const emailContent = subscriptionEmailTemplate(email);
    const url = 'https://ecobacgiang.vn'; // URL for the button in email
    
    // Send email using the existing sendEmail utility (same as signup API)
    await sendEmail(email, url, "Đăng ký nhận bản tin thành công", "🎉 Đăng ký nhận bản tin thành công - Eco Bắc Giang", emailContent);
    
    console.log(`Subscription email sent to: ${email}`);
    
  } catch (error) {
    console.error('Error sending subscription email:', error);
    // Don't throw error to avoid breaking the subscription process
  }
}
