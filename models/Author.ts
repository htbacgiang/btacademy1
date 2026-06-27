import { Schema, models, model, Model, ObjectId } from "mongoose";

export interface AuthorModelSchema {
  _id: ObjectId;
  name: string;
  avatar?: { url: string; public_id?: string | null };
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<AuthorModelSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Author = models?.Author || model("Author", AuthorSchema);
export default Author as Model<AuthorModelSchema>;
