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
    case "GET":
      return getAuthors(req, res);
    case "POST":
      return createAuthor(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const getAuthors: NextApiHandler = async (req, res) => {
  try {
    await db.connectDb();
    const authors = await Author.find({}).sort({ name: 1 }).lean();
    
    const authorsWithPostCount = await Promise.all(
      authors.map(async (author) => {
        const postCount = await Post.countDocuments({ 
          author: author._id, 
          $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] 
        });
        return {
          ...author,
          postCount,
        };
      })
    );

    res.json({ authors: authorsWithPostCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    await db.disconnectDb();
  }
};

const createAuthor: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user || (session.user as any).role !== "admin") {
    return res.status(401).json({ error: "Bạn không có quyền thực hiện chức năng này!" });
  }

  try {
    const { files, body } = await readFile<{ name: string; bio?: string }>(req);
    const { name, bio } = body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tên tác giả không được để trống!" });
    }

    await db.connectDb();

    const newAuthor = new Author({
      name: name.trim(),
      bio: bio ? bio.trim() : "",
    });

    const avatarFile = files.avatar as formidable.File | undefined;
    if (avatarFile) {
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        avatarFile.filepath,
        { folder: "btacademy/authors" }
      );
      newAuthor.avatar = { url, public_id };
    }

    await newAuthor.save();
    res.status(201).json({ author: newAuthor, message: "Tạo tác giả thành công!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ!" });
  } finally {
    await db.disconnectDb();
  }
};

export default handler;
