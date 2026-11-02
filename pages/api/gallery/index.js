import db from "../../../utils/db";
import GalleryImage from "../../../models/GalleryImage";
import { DEFAULT_GALLERY_IMAGES } from "../../../data/defaultGalleryImages";

export default async function handler(req, res) {
  try {
    await db.connectDb();
  } catch (dbError) {
    console.error("Gallery API DB connection error:", dbError);
    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        images: DEFAULT_GALLERY_IMAGES,
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

        // Kiểm tra xem đã có dữ liệu chưa, nếu chưa có thì tự động seed dữ liệu mẫu
        const count = await GalleryImage.countDocuments();
        if (count === 0) {
          try {
            const seedData = DEFAULT_GALLERY_IMAGES.map((img, idx) => ({
              src: img.src,
              alt: img.alt || "",
              row: img.row || (idx < 17 ? "top" : "bottom"),
              order: img.order || (idx < 17 ? idx + 1 : idx - 16),
              isActive: img.isActive !== undefined ? img.isActive : true,
            }));
            await GalleryImage.insertMany(seedData);
          } catch (seedError) {
            console.error("Error auto-seeding gallery images:", seedError);
          }
        }

        const filter = {};
        if (all !== "true" && all !== "1") {
          filter.isActive = true;
        }

        const images = await GalleryImage.find(filter)
          .sort({ row: -1, order: 1, createdAt: 1 })
          .lean();

        return res.status(200).json({
          success: true,
          images: images.length > 0 ? images : DEFAULT_GALLERY_IMAGES,
        });
      }

      case "POST": {
        const { src, alt, row, order, isActive } = req.body;

        if (!src || typeof src !== "string" || !src.trim()) {
          return res.status(400).json({
            success: false,
            message: "Đường dẫn ảnh (URL hoặc đường dẫn file) là bắt buộc",
          });
        }

        const targetRow = row === "bottom" ? "bottom" : "top";

        // Tự động tính số thứ tự lớn nhất trong hàng tương ứng nếu không truyền order
        let itemOrder = Number(order);
        if (isNaN(itemOrder) || itemOrder <= 0) {
          const maxOrderItem = await GalleryImage.findOne({ row: targetRow })
            .sort({ order: -1 })
            .lean();
          itemOrder =
            maxOrderItem && typeof maxOrderItem.order === "number"
              ? maxOrderItem.order + 1
              : 1;
        }

        const newImage = new GalleryImage({
          src: src.trim(),
          alt: (alt || "").trim(),
          row: targetRow,
          order: itemOrder,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        });

        await newImage.save();

        return res.status(201).json({
          success: true,
          image: newImage,
          message: `Thêm ảnh vào ${targetRow === "top" ? "hàng trên" : "hàng dưới"} thành công`,
        });
      }

      case "PUT": {
        const { action, topItems, bottomItems, items } = req.body;

        // Khôi phục danh sách mặc định 33 ảnh
        if (action === "reset-default") {
          await GalleryImage.deleteMany({});
          const seedData = DEFAULT_GALLERY_IMAGES.map((img, idx) => ({
            src: img.src,
            alt: img.alt || "",
            row: img.row || (idx < 17 ? "top" : "bottom"),
            order: img.order || (idx < 17 ? idx + 1 : idx - 16),
            isActive: img.isActive !== undefined ? img.isActive : true,
          }));
          await GalleryImage.insertMany(seedData);

          const reloaded = await GalleryImage.find()
            .sort({ row: -1, order: 1, createdAt: 1 })
            .lean();
          return res.status(200).json({
            success: true,
            images: reloaded,
            message: "Đã khôi phục 33 ảnh mẫu mặc định cho cả 2 hàng thành công",
          });
        }

        // Cập nhật lại thứ tự và hàng khi kéo thả 2 dòng (Drag & Drop)
        if (action === "reorder-rows") {
          const updates = [];

          if (Array.isArray(topItems)) {
            topItems.forEach((item, index) => {
              if (item) {
                const query = item._id ? { _id: item._id } : { src: item.src };
                updates.push(
                  GalleryImage.findOneAndUpdate(
                    query,
                    {
                      $set: {
                        row: "top",
                        order: index + 1,
                      },
                    },
                    { new: true, upsert: true }
                  )
                );
              }
            });
          }

          if (Array.isArray(bottomItems)) {
            bottomItems.forEach((item, index) => {
              if (item) {
                const query = item._id ? { _id: item._id } : { src: item.src };
                updates.push(
                  GalleryImage.findOneAndUpdate(
                    query,
                    {
                      $set: {
                        row: "bottom",
                        order: index + 1,
                      },
                    },
                    { new: true, upsert: true }
                  )
                );
              }
            });
          }

          await Promise.all(updates);

          return res.status(200).json({
            success: true,
            message: "Cập nhật vị trí và thứ tự 2 dòng thành công",
          });
        }

        // Cập nhật mảng items chung
        if (action === "reorder" && Array.isArray(items)) {
          const updates = items.map((item, index) => {
            const query = item._id ? { _id: item._id } : { src: item.src };
            const updateFields = { order: index + 1 };
            if (item.row) updateFields.row = item.row;
            return GalleryImage.findOneAndUpdate(query, { $set: updateFields }, { new: true });
          });
          await Promise.all(updates);

          return res.status(200).json({
            success: true,
            message: "Cập nhật thứ tự ảnh thành công",
          });
        }

        return res.status(400).json({
          success: false,
          message: "Hành động không hợp lệ",
        });
      }

      default:
        return res.status(405).json({
          success: false,
          message: "Method not allowed",
        });
    }
  } catch (error) {
    console.error("Gallery API error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Có lỗi xảy ra khi xử lý ảnh thư viện",
    });
  }
}
