import db from "../../../utils/db";
import GalleryImage from "../../../models/GalleryImage";

export default async function handler(req, res) {
  try {
    await db.connectDb();
  } catch (dbError) {
    console.error("Gallery item API DB connection error:", dbError);
    return res.status(500).json({
      success: false,
      message: "Không thể kết nối cơ sở dữ liệu",
    });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID ảnh là bắt buộc",
    });
  }

  try {
    switch (req.method) {
      case "GET": {
        const image = await GalleryImage.findById(id).lean();

        if (!image) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy ảnh",
          });
        }

        return res.status(200).json({
          success: true,
          image,
        });
      }

      case "PUT": {
        const { src, alt, row, order, isActive } = req.body;

        const imageToUpdate = await GalleryImage.findById(id);

        if (!imageToUpdate) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy ảnh để cập nhật",
          });
        }

        if (src !== undefined) {
          if (!src || !src.trim()) {
            return res.status(400).json({
              success: false,
              message: "Đường dẫn ảnh không được để trống",
            });
          }
          imageToUpdate.src = src.trim();
        }

        if (alt !== undefined) {
          imageToUpdate.alt = (alt || "").trim();
        }

        if (row !== undefined) {
          imageToUpdate.row = row === "bottom" ? "bottom" : "top";
        }

        if (order !== undefined) {
          const num = Number(order);
          if (!isNaN(num)) {
            imageToUpdate.order = num;
          }
        }

        if (isActive !== undefined) {
          imageToUpdate.isActive = Boolean(isActive);
        }

        await imageToUpdate.save();

        return res.status(200).json({
          success: true,
          image: imageToUpdate,
          message: "Cập nhật ảnh thành công",
        });
      }

      case "DELETE": {
        const imageToDelete = await GalleryImage.findById(id);

        if (!imageToDelete) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy ảnh để xóa",
          });
        }

        await GalleryImage.findByIdAndDelete(id);

        return res.status(200).json({
          success: true,
          message: "Xóa ảnh thành công",
        });
      }

      default:
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
        });
    }
  } catch (error) {
    console.error("Gallery item API error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Có lỗi xảy ra khi xử lý thao tác với ảnh",
    });
  }
}
