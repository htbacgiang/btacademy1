import db from "../../../utils/db";
import MenuItem from "../../../models/MenuItem";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID menu là bắt buộc",
    });
  }

  try {
    await db.connectDb();
  } catch (dbError) {
    console.error("Navbar [id] API DB connection error:", dbError);
    return res.status(500).json({
      success: false,
      message: "Không thể kết nối cơ sở dữ liệu",
    });
  }

  try {
    switch (req.method) {
      case "GET": {
        const item = await MenuItem.findById(id).lean();
        if (!item) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy menu",
          });
        }
        return res.status(200).json({
          success: true,
          item,
        });
      }

      case "PUT": {
        const { name, href, order, isActive, openInNewTab, hasDropdown, dropdownItems } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = String(name).trim();
        if (href !== undefined) updateData.href = String(href).trim();
        if (order !== undefined) updateData.order = Number(order);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        if (openInNewTab !== undefined) updateData.openInNewTab = Boolean(openInNewTab);
        if (hasDropdown !== undefined) updateData.hasDropdown = Boolean(hasDropdown);
        if (dropdownItems !== undefined && Array.isArray(dropdownItems)) {
          updateData.dropdownItems = dropdownItems.map((sub, index) => ({
            ...(sub._id ? { _id: sub._id } : {}),
            name: (sub.name || "").trim(),
            href: (sub.href || "").trim(),
            desc: (sub.desc || "").trim(),
            isHighlight: Boolean(sub.isHighlight),
            order: Number(sub.order) || index + 1,
            isActive: sub.isActive !== undefined ? Boolean(sub.isActive) : true,
            openInNewTab: Boolean(sub.openInNewTab),
          }));
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedItem) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy menu để cập nhật",
          });
        }

        return res.status(200).json({
          success: true,
          item: updatedItem,
          message: "Cập nhật menu thành công",
        });
      }

      case "DELETE": {
        const deletedItem = await MenuItem.findByIdAndDelete(id);
        if (!deletedItem) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy menu để xóa",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Đã xóa menu thành công",
        });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error("Navbar [id] API Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi máy chủ nội bộ",
    });
  }
}

