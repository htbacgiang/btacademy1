import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: [true, "Đường dẫn ảnh là bắt buộc"],
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
      default: "",
    },
    row: {
      type: String,
      enum: ["top", "bottom"],
      default: "top",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GalleryImage || mongoose.model("GalleryImage", galleryImageSchema);
