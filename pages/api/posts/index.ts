import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import { formatPosts, readFile, readPostsFromDb } from "../../../lib/utils";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";
import { IncomingPost } from "../../../utils/types";
import { normalizePostCategory } from "../../../utils/postCategories";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return readPosts(req, res);
    case "POST":
      return createNewPost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createNewPost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập để đăng bài!" });
  }

  try {
    const { files, body } = await readFile<IncomingPost>(req);
    let tags: string[] = [];
    try {
      tags = body.tags ? JSON.parse(body.tags as string) : [];
    } catch {
      tags = [];
    }

    // Kiểm tra dữ liệu đầu vào
    const error = validateSchema(postValidationSchema, { ...body, tags });
    if (error) return res.status(400).json({ error });

    const { title, content, slug, meta, category } = body;
    const normalizedCategory = normalizePostCategory(category);

    await db.connectDb();

    const existingPostId =
      ((body as any).postId || (body as any).id || "").toString().trim();

    // Nếu frontend gửi kèm id/postId, coi đây là luồng cập nhật thay vì tạo mới
    if (existingPostId) {
      const existingPost = await Post.findById(existingPostId);
      if (!existingPost) {
        return res.status(404).json({ error: "Không tìm thấy bài viết cần cập nhật!" });
      }

      const isAdmin = session.user.role === "admin";
      const isOwner = existingPost.author && existingPost.author.toString() === session.user.sub;
      if (!isAdmin && !isOwner) {
        return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này!" });
      }

      const uniqueSlug = await ensureUniqueSlug(
        slug && slug.trim() ? slug.trim() : title || undefined,
        existingPostId
      );

      const isFeaturedValue = (body as any).isFeatured;
      const isFeatured =
        isFeaturedValue === "true" ||
        isFeaturedValue === true ||
        isFeaturedValue === "1";
      const isDraftValue = (body as any).isDraft;
      const parsedIsDraft =
        isDraftValue === true ||
        isDraftValue === "true" ||
        isDraftValue === "1"
          ? true
          : isDraftValue === false ||
              isDraftValue === "false" ||
              isDraftValue === "0"
            ? false
            : undefined;

      existingPost.title = title;
      existingPost.content = content;
      existingPost.slug = uniqueSlug;
      existingPost.meta = meta;
      existingPost.tags = tags;
      existingPost.category = normalizedCategory;
      existingPost.isFeatured = isFeatured;
      if (typeof parsedIsDraft === "boolean") {
        existingPost.isDraft = parsedIsDraft;
      }

      const thumbnailUrl = (body as any).thumbnail as string | undefined;
      const thumbnailFile = files.thumbnail as formidable.File | undefined;
      if (thumbnailFile) {
        const { secure_url: url, public_id } = await cloudinary.uploader.upload(
          thumbnailFile.filepath,
          { folder: process.env.CLOUDINARY_FOLDER || "btacademy" }
        );

        const oldPublicId = existingPost.thumbnail?.public_id;
        if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);

        existingPost.thumbnail = { url, public_id };
      } else if (
        thumbnailUrl &&
        thumbnailUrl.trim() &&
        thumbnailUrl !== existingPost.thumbnail?.url
      ) {
        existingPost.thumbnail = { url: thumbnailUrl.trim() };
      }

      await existingPost.save();
      return res.json({ post: existingPost, message: "Cập nhật bài viết thành công!" });
    }

    // Đảm bảo slug luôn duy nhất để tránh lỗi duplicate key
    const uniqueSlug = await ensureUniqueSlug(
      slug && slug.trim() ? slug.trim() : title || undefined
    );

    // Lấy isFeatured từ body (có thể là string 'true' hoặc boolean)
    const isFeaturedValue = (body as any).isFeatured;
    const isFeatured = isFeaturedValue === 'true' || isFeaturedValue === true || isFeaturedValue === '1';

    // Tạo bài viết mới
    const newPost = new Post({
      title,
      content,
      slug: uniqueSlug,
      meta,
      tags,
      category: normalizedCategory,
      author: session.user.sub,
      isDraft: false, // Bài viết được đăng sẽ không phải là nháp
      isFeatured: isFeatured || false, // Bài viết nổi bật
    });

    // Xử lý thumbnail: có thể là file mới upload hoặc URL từ gallery
    const thumbnailUrl = (body as any).thumbnail as string | undefined;
    const thumbnailFile = files.thumbnail as formidable.File | undefined;
    
    if (thumbnailFile) {
      // File mới upload - upload lên Cloudinary
      const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET;
      
      if (!cloudName || !apiKey || !apiSecret) {
        console.error("Lỗi tạo bài viết: Cloudinary chưa được cấu hình. Vui lòng kiểm tra các biến môi trường CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET");
        return res.status(500).json({ 
          error: "Cấu hình Cloudinary chưa đầy đủ. Vui lòng liên hệ quản trị viên." 
        });
      }
      
      try {
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
          thumbnailFile.filepath,
        { folder: process.env.CLOUDINARY_FOLDER || "btacademy" }
      );
      newPost.thumbnail = { url, public_id };
      } catch (cloudinaryError: any) {
        console.error("Lỗi upload thumbnail lên Cloudinary:", cloudinaryError);
        return res.status(500).json({ 
          error: cloudinaryError.message || "Lỗi upload ảnh thumbnail. Vui lòng thử lại." 
        });
      }
    } else if (thumbnailUrl && thumbnailUrl.trim()) {
      // URL từ gallery - lưu trực tiếp URL (không cần upload lại)
      const trimmedUrl = thumbnailUrl.trim();
      console.log("📸 Lưu thumbnail từ gallery:", trimmedUrl);
      // Lưu object với url, không có public_id (vì không upload lên Cloudinary)
      newPost.thumbnail = { url: trimmedUrl };
    }

    await newPost.save();
    console.log("✅ Bài viết đã được lưu với thumbnail:", newPost.thumbnail);
    res.json({ post: newPost });
  } catch (error: any) {
    console.error("Lỗi tạo bài viết:", error);
    // Trả về thông báo lỗi chi tiết hơn để dễ debug
    const errorMessage = error.message || "Lỗi máy chủ!";
    if (errorMessage.includes("api_key") || errorMessage.includes("Must supply")) {
      return res.status(500).json({ 
        error: "Cấu hình Cloudinary chưa đầy đủ. Vui lòng kiểm tra các biến môi trường CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET trên VPS." 
      });
    }
    res.status(500).json({ error: errorMessage });
  } finally {
    await db.disconnectDb();
  }
};

const ensureUniqueSlug = async (
  rawSlug?: string,
  excludePostId?: string
): Promise<string> => {
  const baseSlug = (rawSlug && rawSlug.trim()) ? rawSlug.trim() : `post-${Date.now()}`;
  let candidate = baseSlug;
  let suffix = 1;

  while (
    await Post.findOne({
      slug: candidate,
      ...(excludePostId ? { _id: { $ne: excludePostId } } : {}),
    })
  ) {
    candidate = `${baseSlug}-${suffix++}`;
  }

  return candidate;
};

const readPosts: NextApiHandler = async (req, res) => {
  try {
    const { limit, pageNo, skip, includeDrafts } = req.query as {
      limit: string;
      pageNo: string;
      skip: string;
      includeDrafts?: string;
    };
    
    console.log("API /posts request params:", { limit, pageNo, skip, includeDrafts });
    
    // Chỉ admin mới có thể xem draft
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    const isAdmin = session?.user?.role === 'admin';
    const shouldIncludeDrafts = includeDrafts === 'true' && isAdmin;
    
    const posts = await readPostsFromDb(
      limit ? parseInt(limit) : undefined,
      pageNo ? parseInt(pageNo) : undefined,
      skip ? parseInt(skip) : undefined,
      shouldIncludeDrafts
    );
    
    console.log(`Returning ${posts.length} posts from API`);
    res.json({ posts: formatPosts(posts) });
  } catch (error: any) {
    console.error("Error in readPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
