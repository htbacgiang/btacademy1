import { Schema, models, model, ObjectId, Model } from "mongoose";
import "./Author";

// title, content, slug, tags, thumbnail, meta, author, date
export interface PostModelSchema {
  _id: ObjectId;
  title: string;
  slug: string;
  meta: string;
  content: string;
  category: string;
  tags: string[];
  thumbnail?: { url: string; public_id?: string | null };
  author: ObjectId;
  isDraft: boolean;
  isFeatured?: boolean;
  featuredOrder?: number; // Thứ tự hiển thị trong section nổi bật (1-4)
  deletedAt?: Date | null;
  createdAt: Date;
  isDirectPost?: boolean;
}

const PostSchema = new Schema<PostModelSchema>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
  },
    meta: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
    },
    thumbnail: {
      type: Object,
      url: String,
      public_id: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredOrder: {
      type: Number,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isDirectPost: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Recompile model in dev to reflect schema changes
if (process.env.NODE_ENV === "development" && models?.Post) {
  delete (models as any).Post;
}

const Post = models?.Post || model("Post", PostSchema);

export default Post as Model<PostModelSchema>;

