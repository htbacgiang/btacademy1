import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getToken } from "next-auth/jwt";
import { readFile } from "../../../lib/utils";
import Author from "../../../models/Author";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "PATCH":
    case "PUT":
      return updateAuthor(req, res);
    case "DELETE":
      return deleteAuthor(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const updateAuthor: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user || (session.user as any).role !== "admin") {
    return res.status(401).json({ error: "Bạn không có quyền thực hiện chức năng này!" });
  }

  const { authorId } = req.query;

  try {
    const { files, body } = await readFile<{ name: string; bio?: string }>(req);
    const { name, bio } = body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tên tác giả không được để trống!" });
    }

    await db.connectDb();

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "Không tìm thấy tác giả!" });
    }

    author.name = name.trim();
    author.bio = bio ? bio.trim() : "";

    const avatarFile = files.avatar as formidable.File | undefined;
    if (avatarFile) {
      // Upload new avatar
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        avatarFile.filepath,
        { folder: "btacademy/authors" }
      );
      
      // Delete old avatar from Cloudinary if exists
      if (author.avatar?.public_id) {
        await cloudinary.uploader.destroy(author.avatar.public_id);
      }

      author.avatar = { url, public_id };
    }

    await author.save();
    res.json({ author, message: "Cập nhật tác giả thành công!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ!" });
  } finally {
    await db.disconnectDb();
  }
};

const deleteAuthor: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user || (session.user as any).role !== "admin") {
    return res.status(401).json({ error: "Bạn không có quyền thực hiện chức năng này!" });
  }

  const { authorId } = req.query;

  try {
    await db.connectDb();

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: "Không tìm thấy tác giả!" });
    }

    // Kiểm tra xem tác giả có bài viết nào không
    const postsCount = await Post.countDocuments({ author: authorId });
    if (postsCount > 0) {
      return res.status(400).json({
        error: `Không thể xóa tác giả này vì đã có ${postsCount} bài viết gắn liền với họ!`,
      });
    }

    // Xóa avatar trên Cloudinary nếu có
    if (author.avatar?.public_id) {
      await cloudinary.uploader.destroy(author.avatar.public_id);
    }

    await Author.findByIdAndDelete(authorId);
    res.json({ message: "Xóa tác giả thành công!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ!" });
  } finally {
    await db.disconnectDb();
  }
};

export default handler;
