import db from "../../../utils/db";
import MenuItem from "../../../models/MenuItem";
import { DEFAULT_NAV_MENU_ITEMS } from "../../../data/defaultNavMenuItems";

export default async function handler(req, res) {
  try {
    await db.connectDb();
  } catch (dbError) {
    console.error("Navbar API DB connection error:", dbError);
    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        items: DEFAULT_NAV_MENU_ITEMS,
        isFallback: true,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Không thể kết nối cơ sở dữ liệu",
    });
  }

  try {
    switch (req.method) {
      case "GET": {
        const { all } = req.query;

        // Tự động seed menu mặc định nếu DB chưa có dữ liệu
        const count = await MenuItem.countDocuments();
        if (count === 0) {
          try {
            await MenuItem.insertMany(DEFAULT_NAV_MENU_ITEMS);
          } catch (seedError) {
            console.error("Error auto-seeding navbar menu items:", seedError);
          }
        }

        const filter = {};
        if (all !== "true" && all !== "1") {
          filter.isActive = true;
        }

        let items = await MenuItem.find(filter)
          .sort({ order: 1, createdAt: 1 })
          .lean();

        // Nếu client bình thường (không phải admin all=true), lọc bớt dropdownItems bị ẩn và sort theo order
        if (all !== "true" && all !== "1") {
          items = items.map((item) => {
            if (item.dropdownItems && Array.isArray(item.dropdownItems)) {
              item.dropdownItems = item.dropdownItems
                .filter((sub) => sub.isActive !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            }
            return item;
          });
        }

        return res.status(200).json({
          success: true,
          items: items.length > 0 ? items : DEFAULT_NAV_MENU_ITEMS,
        });
      }

      case "POST": {
        const { name, href, order, isActive, openInNewTab, hasDropdown, dropdownItems } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
          return res.status(400).json({
            success: false,
            message: "Tên menu là bắt buộc",
          });
        }

        if (!href || typeof href !== "string" || !href.trim()) {
          return res.status(400).json({
            success: false,
            message: "Đường dẫn (URL/slug) là bắt buộc",
          });
        }

        let itemOrder = Number(order);
        if (isNaN(itemOrder) || itemOrder <= 0) {
          const maxOrderItem = await MenuItem.findOne({}).sort({ order: -1 }).lean();
          itemOrder = maxOrderItem && typeof maxOrderItem.order === "number" ? maxOrderItem.order + 1 : 1;
        }

        const formattedDropdownItems = Array.isArray(dropdownItems)
          ? dropdownItems.map((sub, index) => ({
              name: (sub.name || "").trim(),
              href: (sub.href || "").trim(),
              desc: (sub.desc || "").trim(),
              isHighlight: Boolean(sub.isHighlight),
              order: Number(sub.order) || index + 1,
              isActive: sub.isActive !== undefined ? Boolean(sub.isActive) : true,
              openInNewTab: Boolean(sub.openInNewTab),
            }))
          : [];

        const newMenuItem = new MenuItem({
          name: name.trim(),
          href: href.trim(),
          order: itemOrder,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          openInNewTab: Boolean(openInNewTab),
          hasDropdown: Boolean(hasDropdown),
          dropdownItems: formattedDropdownItems,
        });

        await newMenuItem.save();

        return res.status(201).json({
          success: true,
          item: newMenuItem,
          message: "Thêm menu thành công",
        });
      }

      case "PUT": {
        const { action, items, id, name, href, order, isActive, openInNewTab, hasDropdown, dropdownItems } =
          req.body;

        // 1. Reset về danh sách menu mặc định
        if (action === "reset-default") {
          await MenuItem.deleteMany({});
          await MenuItem.insertMany(DEFAULT_NAV_MENU_ITEMS);

          const resetItems = await MenuItem.find({}).sort({ order: 1, createdAt: 1 }).lean();
          return res.status(200).json({
            success: true,
            items: resetItems,
            message: "Đã khôi phục danh sách Menu Navbar về mặc định",
          });
        }

        // 2. Cập nhật thứ tự nhiều menu (reorder)
        if (action === "reorder") {
          if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
              success: false,
              message: "Danh sách items cập nhật thứ tự không hợp lệ",
            });
          }

          const bulkOps = items.map((it, idx) => ({
            updateOne: {
              filter: { _id: it._id || it.id },
              update: { $set: { order: typeof it.order === "number" ? it.order : idx + 1 } },
            },
          }));

          await MenuItem.bulkWrite(bulkOps);

          const updatedItems = await MenuItem.find({}).sort({ order: 1, createdAt: 1 }).lean();
          return res.status(200).json({
            success: true,
            items: updatedItems,
            message: "Cập nhật thứ tự menu thành công",
          });
        }

        // 3. Cập nhật 1 menu theo ID truyền trong body
        if (id) {
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

        return res.status(400).json({
          success: false,
          message: "Thao tác không được hỗ trợ",
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error("Navbar API Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi máy chủ nội bộ",
    });
  }
}

