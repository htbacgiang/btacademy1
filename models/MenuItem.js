import mongoose from "mongoose";

const subMenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên mục con là bắt buộc"],
      trim: true,
    },
    href: {
      type: String,
      required: [true, "Đường dẫn mục con là bắt buộc"],
      trim: true,
    },
    desc: {
      type: String,
      default: "",
      trim: true,
    },
    isHighlight: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    openInNewTab: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên menu là bắt buộc"],
      trim: true,
    },
    href: {
      type: String,
      required: [true, "Đường dẫn là bắt buộc"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    openInNewTab: {
      type: Boolean,
      default: false,
    },
    hasDropdown: {
      type: Boolean,
      default: false,
    },
    dropdownItems: {
      type: [subMenuItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);

