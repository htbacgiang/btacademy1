import React, { useState, useEffect, useMemo, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Image as ImageIcon,
  RefreshCw,
  X,
  ExternalLink,
  UploadCloud,
  Check,
  AlertTriangle,
  FolderPlus,
  ArrowUpRight,
  Layers,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  GripVertical,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Heading from "../../../components/backend/Heading";
import R2ImageModal, { R2ImageSelectionResult } from "../../../components/editor/R2ImageModal";

interface GalleryImageItem {
  _id?: string;
  id?: number | string;
  src: string;
  alt?: string;
  row?: "top" | "bottom";
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Upload trực tiếp 1 file lên album 'gallery' trên Cloudflare R2
async function uploadToR2Gallery(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; key: string }> {
  try {
    const { data: presignedData } = await axios.post("/api/r2/upload", {
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      folder: "gallery",
    });

    try {
      await axios.put(presignedData.uploadUrl, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      });
      return { url: presignedData.publicUrl, key: presignedData.key };
    } catch (directErr) {
      console.warn("Direct upload thất bại, fallback sang proxy:", directErr);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "gallery");
      const { data: proxyData } = await axios.post("/api/r2/upload-proxy", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      });
      return { url: proxyData.publicUrl, key: proxyData.key };
    }
  } catch (err: any) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "gallery");
    const { data: proxyData } = await axios.post("/api/r2/upload-proxy", fd, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return { url: proxyData.publicUrl, key: proxyData.key };
  }
}

export default function GalleryManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dữ liệu 2 hàng
  const [topItems, setTopItems] = useState<GalleryImageItem[]>([]);
  const [bottomItems, setBottomItems] = useState<GalleryImageItem[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Drag & drop state
  const [draggedItem, setDraggedItem] = useState<GalleryImageItem | null>(null);
  const [dragSourceRow, setDragSourceRow] = useState<"top" | "bottom" | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    row: "top" | "bottom";
    index?: number;
  } | null>(null);

  // Modal thêm/sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImageItem | null>(null);
  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    row: "top" as "top" | "bottom",
    order: 0,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Upload trực tiếp
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadingDirect, setUploadingDirect] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Upload
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkStatus, setBulkStatus] = useState({ current: 0, total: 0, filename: "" });

  // Modal R2 Picker
  const [showR2Modal, setShowR2Modal] = useState(false);

  // Modal Xóa
  const [deleteTarget, setDeleteTarget] = useState<GalleryImageItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Modal Reset
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/dang-nhap");
      return;
    }

    if ((session.user as any)?.role !== "admin") {
      router.push("/");
      return;
    }

    fetchImages();
  }, [session, status, router]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/gallery?all=true");
      if (response.data?.success) {
        const rawImages: GalleryImageItem[] = response.data.images || [];
        setImages(rawImages);

        // Phân loại thành 2 hàng theo thứ tự
        const top = rawImages
          .filter((img, idx) => img.row === "top" || (!img.row && idx < Math.ceil(rawImages.length / 2)))
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        const bottom = rawImages
          .filter((img, idx) => img.row === "bottom" || (!img.row && idx >= Math.ceil(rawImages.length / 2)))
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setTopItems(top);
        setBottomItems(bottom);
      } else {
        toast.error("Không thể tải danh sách ảnh thư viện");
      }
    } catch (error: any) {
      console.error("Lỗi tải ảnh gallery:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tải ảnh thư viện");
    } finally {
      setLoading(false);
    }
  };

  const getItemId = (item: GalleryImageItem) => String(item._id || item.id || item.src);

  // Lưu thứ tự 2 hàng vào database
  const saveRowsOrder = async (newTop: GalleryImageItem[], newBottom: GalleryImageItem[]) => {
    setIsSavingOrder(true);
    try {
      const res = await axios.put("/api/gallery", {
        action: "reorder-rows",
        topItems: newTop,
        bottomItems: newBottom,
      });
      if (res.data?.success) {
        toast.success("Đã cập nhật thứ tự ảnh!");
      }
    } catch (err: any) {
      console.error("Lỗi khi lưu vị trí 2 dòng:", err);
      toast.error("Lỗi khi lưu thứ tự ảnh");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Drag & drop handlers chuẩn HTML5
  const handleDragStart = (e: React.DragEvent, item: GalleryImageItem, row: "top" | "bottom", index: number) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", getItemId(item));

    setDraggedItem(item);
    setDragSourceRow(row);
    setDragSourceIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, row: "top" | "bottom", index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget({ row, index });
  };

  const handleDragEnter = (e: React.DragEvent, row: "top" | "bottom", index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTarget({ row, index });
  };

  const handleDrop = (e: React.DragEvent, targetRow: "top" | "bottom", targetIndex?: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || !dragSourceRow) {
      setDraggedItem(null);
      setDragSourceRow(null);
      setDragOverTarget(null);
      return;
    }

    const draggedId = getItemId(draggedItem);
    let updatedTop = [...topItems];
    let updatedBottom = [...bottomItems];

    // 1. Gỡ bỏ item khỏi hàng nguồn
    if (dragSourceRow === "top") {
      updatedTop = updatedTop.filter((i) => getItemId(i) !== draggedId);
    } else {
      updatedBottom = updatedBottom.filter((i) => getItemId(i) !== draggedId);
    }

    // 2. Chèn item vào hàng đích
    const itemToInsert: GalleryImageItem = { ...draggedItem, row: targetRow };

    if (targetRow === "top") {
      let insertAt = typeof targetIndex === "number" ? targetIndex : updatedTop.length;
      insertAt = Math.max(0, Math.min(insertAt, updatedTop.length));
      updatedTop.splice(insertAt, 0, itemToInsert);
    } else {
      let insertAt = typeof targetIndex === "number" ? targetIndex : updatedBottom.length;
      insertAt = Math.max(0, Math.min(insertAt, updatedBottom.length));
      updatedBottom.splice(insertAt, 0, itemToInsert);
    }

    // 3. Đánh số lại thứ tự
    const reorderedTop = updatedTop.map((item, idx) => ({ ...item, row: "top" as const, order: idx + 1 }));
    const reorderedBottom = updatedBottom.map((item, idx) => ({ ...item, row: "bottom" as const, order: idx + 1 }));

    setTopItems(reorderedTop);
    setBottomItems(reorderedBottom);
    setImages([...reorderedTop, ...reorderedBottom]);

    setDraggedItem(null);
    setDragSourceRow(null);
    setDragSourceIndex(null);
    setDragOverTarget(null);

    // Lưu vào database
    saveRowsOrder(reorderedTop, reorderedBottom);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedItem(null);
    setDragSourceRow(null);
    setDragSourceIndex(null);
    setDragOverTarget(null);
  };

  // Nút 1-click chuyển hàng nhanh (Top <-> Bottom)
  const handleQuickMoveRow = (item: GalleryImageItem, targetRow: "top" | "bottom") => {
    let newTop = [...topItems];
    let newBottom = [...bottomItems];
    const itemId = getItemId(item);

    if (targetRow === "bottom") {
      newTop = newTop.filter((i) => getItemId(i) !== itemId);
      newBottom.push({ ...item, row: "bottom" });
    } else {
      newBottom = newBottom.filter((i) => getItemId(i) !== itemId);
      newTop.push({ ...item, row: "top" });
    }

    const reorderedTop = newTop.map((it, idx) => ({ ...it, row: "top" as const, order: idx + 1 }));
    const reorderedBottom = newBottom.map((it, idx) => ({ ...it, row: "bottom" as const, order: idx + 1 }));

    setTopItems(reorderedTop);
    setBottomItems(reorderedBottom);
    setImages([...reorderedTop, ...reorderedBottom]);
    saveRowsOrder(reorderedTop, reorderedBottom);
  };

  // Di chuyển vị trí trong hàng bằng nút mũi tên (Trái / Phải)
  const handleShiftPosition = (row: "top" | "bottom", index: number, direction: -1 | 1) => {
    const list = row === "top" ? [...topItems] : [...bottomItems];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const reordered = list.map((it, idx) => ({ ...it, order: idx + 1 }));

    if (row === "top") {
      setTopItems(reordered);
      setImages([...reordered, ...bottomItems]);
      saveRowsOrder(reordered, bottomItems);
    } else {
      setBottomItems(reordered);
      setImages([...topItems, ...reordered]);
      saveRowsOrder(topItems, reordered);
    }
  };

  // Mở modal thêm ảnh (chỉ định sẵn hàng top hoặc bottom)
  const handleOpenAddModal = (targetRow: "top" | "bottom" = "top") => {
    setEditingImage(null);
    const currentList = targetRow === "top" ? topItems : bottomItems;
    const maxOrder = currentList.reduce((max, img) => Math.max(max, Number(img.order) || 0), 0);

    setFormData({
      src: "",
      alt: "",
      row: targetRow,
      order: maxOrder + 1,
      isActive: true,
    });
    setUploadedFileName("");
    setUploadProgress(0);
    setShowManualUrl(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryImageItem) => {
    setEditingImage(item);
    setFormData({
      src: item.src || "",
      alt: item.alt || "",
      row: item.row || "top",
      order: item.order !== undefined ? item.order : 0,
      isActive: item.isActive !== undefined ? item.isActive : true,
    });
    setUploadedFileName("");
    setUploadProgress(0);
    setShowManualUrl(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setUploadedFileName("");
    setUploadProgress(0);
    setUploadingDirect(false);
  };

  const handleDirectFileSelected = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF)!");
      return;
    }

    setUploadingDirect(true);
    setUploadProgress(5);
    setUploadedFileName(file.name);

    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();

    try {
      const result = await uploadToR2Gallery(file, (p) => setUploadProgress(p));
      setFormData((prev) => ({
        ...prev,
        src: result.url,
        alt: prev.alt ? prev.alt : cleanName,
      }));
      setUploadProgress(100);
      toast.success("Đã tải ảnh lên album gallery trên R2!");
    } catch (error: any) {
      console.error("Lỗi upload file lên R2:", error);
      toast.error(error.message || "Không thể tải ảnh lên R2. Vui lòng thử lại!");
      setUploadedFileName("");
    } finally {
      setUploadingDirect(false);
    }
  };

  // Upload nhiều file cùng lúc từ máy
  const handleBulkFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileList.length === 0) {
      toast.error("Không có file hình ảnh hợp lệ nào được chọn!");
      return;
    }

    setIsBulkUploading(true);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setBulkStatus({
        current: i + 1,
        total: fileList.length,
        filename: file.name,
      });

      try {
        const result = await uploadToR2Gallery(file);
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .trim();

        const targetRow = i % 2 === 0 ? "top" : "bottom";

        await axios.post("/api/gallery", {
          src: result.url,
          alt: cleanName,
          row: targetRow,
          order: 999,
          isActive: true,
        });
        successCount++;
      } catch (err: any) {
        console.error(`Lỗi upload file ${file.name}:`, err);
      }
    }

    setIsBulkUploading(false);
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";

    toast.success(`Đã tải lên và thêm thành công ${successCount}/${fileList.length} ảnh!`);
    fetchImages();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.src.trim()) {
      toast.error("Vui lòng tải ảnh lên từ máy hoặc nhập đường dẫn ảnh!");
      return;
    }

    setSubmitting(true);
    try {
      if (editingImage?._id) {
        const res = await axios.put(`/api/gallery/${editingImage._id}`, formData);
        if (res.data?.success) {
          toast.success("Cập nhật ảnh thành công!");
          handleCloseModal();
          fetchImages();
        } else {
          toast.error(res.data?.message || "Cập nhật ảnh thất bại!");
        }
      } else {
        const res = await axios.post("/api/gallery", formData);
        if (res.data?.success) {
          toast.success("Thêm ảnh vào thư viện thành công!");
          handleCloseModal();
          fetchImages();
        } else {
          toast.error(res.data?.message || "Thêm ảnh thất bại!");
        }
      }
    } catch (error: any) {
      console.error("Lỗi khi lưu ảnh:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu ảnh!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;

    setDeleting(true);
    try {
      const res = await axios.delete(`/api/gallery/${deleteTarget._id}`);
      if (res.data?.success) {
        toast.success("Đã xóa ảnh thành công!");
        setDeleteTarget(null);
        fetchImages();
      } else {
        toast.error(res.data?.message || "Xóa ảnh thất bại!");
      }
    } catch (error: any) {
      console.error("Lỗi khi xóa ảnh:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa ảnh!");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (item: GalleryImageItem) => {
    if (!item._id) return;
    try {
      const newActive = !item.isActive;
      const res = await axios.put(`/api/gallery/${item._id}`, {
        isActive: newActive,
      });
      if (res.data?.success) {
        const updater = (prevList: GalleryImageItem[]) =>
          prevList.map((img) => (img._id === item._id ? { ...img, isActive: newActive } : img));
        setTopItems(updater);
        setBottomItems(updater);
        setImages((prev) =>
          prev.map((img) => (img._id === item._id ? { ...img, isActive: newActive } : img))
        );
        toast.success(newActive ? "Đã bật hiển thị ảnh" : "Đã ẩn ảnh");
      }
    } catch (error: any) {
      toast.error("Không thể thay đổi trạng thái ảnh!");
    }
  };

  const handleResetToDefault = async () => {
    setResetting(true);
    try {
      const res = await axios.put("/api/gallery", { action: "reset-default" });
      if (res.data?.success) {
        toast.success("Đã khôi phục 33 ảnh mẫu ban đầu thành công!");
        setShowResetConfirm(false);
        fetchImages();
      } else {
        toast.error(res.data?.message || "Khôi phục thất bại!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi khôi phục ảnh!");
    } finally {
      setResetting(false);
    }
  };

  const handleR2Select = (result: R2ImageSelectionResult) => {
    setFormData((prev) => ({
      ...prev,
      src: result.src,
      alt: prev.alt || result.altText || result.caption || "",
    }));
    setUploadedFileName(result.src.split("/").pop() || "R2 Image");
    setShowR2Modal(false);
    toast.success("Đã chọn ảnh từ album R2!");
  };

  const filterList = (list: GalleryImageItem[]) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (img) => (img.alt || "").toLowerCase().includes(term) || (img.src || "").toLowerCase().includes(term)
    );
  };

  const visibleTopItems = useMemo(() => filterList(topItems), [topItems, searchTerm]);
  const visibleBottomItems = useMemo(() => filterList(bottomItems), [bottomItems, searchTerm]);

  if (status === "loading" || loading) {
    return (
      <AdminLayout title="Quản lý Gallery - Đang tải...">
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
            <p className="text-gray-600 font-medium">Đang tải dữ liệu thư viện ảnh...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Thẻ ảnh dạng Compact Card với Drag & Drop hoàn chỉnh
  const renderCompactCard = (item: GalleryImageItem, row: "top" | "bottom", index: number) => {
    const itemId = getItemId(item);
    const isDraggingThis = draggedItem && getItemId(draggedItem) === itemId;
    const isOverThis = dragOverTarget?.row === row && dragOverTarget?.index === index;

    return (
      <div
        key={itemId}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, item, row, index)}
        onDragOver={(e) => handleDragOver(e, row, index)}
        onDragEnter={(e) => handleDragEnter(e, row, index)}
        onDrop={(e) => handleDrop(e, row, index)}
        onDragEnd={handleDragEnd}
        className={`group relative bg-white dark:bg-gray-800 rounded-xl border p-1.5 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-all select-none ${
          isDraggingThis
            ? "opacity-30 scale-95 border-dashed border-green-500 bg-green-50/20"
            : isOverThis
            ? "border-green-500 ring-2 ring-green-400 scale-105 shadow-md bg-green-50/10 z-10"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-400 hover:shadow-sm"
        }`}
      >
        {/* Thumbnail Preview */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 pointer-events-none">
          <img
            src={item.src}
            alt={item.alt || "Gallery image"}
            draggable={false}
            className="w-full h-full object-cover select-none pointer-events-none"
            onError={(e: any) => {
              e.target.src =
                "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80";
            }}
          />

          {/* Badge số thứ tự */}
          <div className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
            #{index + 1}
          </div>

          {/* Trạng thái ẩn */}
          {item.isActive === false && (
            <div className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded shadow">
              Ẩn
            </div>
          )}

          {/* Grip Icon Drag Hint */}
          <div className="absolute bottom-1 right-1 p-0.5 bg-black/50 text-white/80 rounded backdrop-blur-sm">
            <GripVertical className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Chú thích & Tác vụ nhanh */}
        <div className="mt-1 flex items-center justify-between gap-1">
          <p
            className="text-[10px] text-gray-700 dark:text-gray-300 font-medium truncate flex-1 pointer-events-none"
            title={item.alt || item.src}
          >
            {item.alt || <span className="italic text-gray-400">Không có mô tả</span>}
          </p>

          {/* Nút thao tác nhanh */}
          <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Shift left */}
            <button
              type="button"
              onClick={() => handleShiftPosition(row, index, -1)}
              disabled={index === 0}
              className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"
              title="Dịch sang trái"
            >
              <ArrowLeft className="w-2.5 h-2.5" />
            </button>

            {/* Shift right */}
            <button
              type="button"
              onClick={() => handleShiftPosition(row, index, 1)}
              disabled={index === (row === "top" ? topItems.length - 1 : bottomItems.length - 1)}
              className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"
              title="Dịch sang phải"
            >
              <ArrowRight className="w-2.5 h-2.5" />
            </button>

            {/* Chuyển dòng */}
            {row === "top" ? (
              <button
                type="button"
                onClick={() => handleQuickMoveRow(item, "bottom")}
                className="p-0.5 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition"
                title="Chuyển xuống Dòng 2"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleQuickMoveRow(item, "top")}
                className="p-0.5 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                title="Chuyển lên Dòng 1"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
            )}

            {/* Sửa ảnh */}
            <button
              type="button"
              onClick={() => handleOpenEditModal(item)}
              className="p-0.5 text-gray-400 hover:text-blue-600"
              title="Sửa ảnh"
            >
              <Edit3 className="w-2.5 h-2.5" />
            </button>

            {/* Xóa ảnh */}
            <button
              type="button"
              onClick={() => setDeleteTarget(item)}
              className="p-0.5 text-gray-400 hover:text-red-600"
              title="Xóa ảnh"
            >
              <Trash2 className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Ô nút "+" thêm ảnh ở cuối hàng (đồng thời là Drop Zone để thả ảnh xuống cuối hàng)
  const renderAddSlotCard = (row: "top" | "bottom") => {
    const listLength = row === "top" ? topItems.length : bottomItems.length;
    const isOverAdd = dragOverTarget?.row === row && dragOverTarget?.index === listLength;

    return (
      <div
        onDragOver={(e) => handleDragOver(e, row, listLength)}
        onDragEnter={(e) => handleDragEnter(e, row, listLength)}
        onDrop={(e) => handleDrop(e, row, listLength)}
        onClick={() => handleOpenAddModal(row)}
        className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group p-2 text-center select-none ${
          isOverAdd
            ? "border-green-500 bg-green-50/50 scale-105 ring-2 ring-green-400"
            : "border-gray-300 dark:border-gray-700 hover:border-green-500 hover:bg-green-50/30"
        }`}
        title={`Thêm ảnh vào ${row === "top" ? "Dòng 1: Hàng trên" : "Dòng 2: Hàng dưới"}`}
      >
        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-green-600 group-hover:text-white text-gray-500 transition-colors flex items-center justify-center mb-1 pointer-events-none">
          <Plus className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-green-600 transition-colors pointer-events-none">
          + Thêm ảnh
        </span>
      </div>
    );
  };

  return (
    <AdminLayout title="Sắp xếp Scrolling Gallery 2 Dòng">
      <Head>
        <title>Sắp xếp Scrolling Gallery 2 Dòng | Dashboard BT Academy</title>
      </Head>

      <Heading title="Sắp xếp thứ tự ảnh Scrolling Gallery (2 Dòng)" />

      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
        <input
          ref={bulkFileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleBulkFilesSelected}
        />

        {/* Thanh công cụ gọn nhẹ đầu trang */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Sắp xếp thứ tự ảnh 2 dòng (Kéo thả)
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kéo thả các thẻ ảnh để hoán đổi vị trí, hoặc bấm các nút mũi tên. Ô cuối cùng là nút <strong>+ Thêm ảnh</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isSavingOrder && (
              <span className="text-xs text-green-600 font-semibold flex items-center gap-1 mr-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang lưu...
              </span>
            )}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg transition flex items-center gap-1"
              title="Khôi phục lại 33 ảnh mẫu ban đầu"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Mẫu gốc
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg transition flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Xem web
            </Link>
            <button
              onClick={() => bulkFileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-lg transition flex items-center gap-1"
              title="Tải lên cùng lúc nhiều ảnh từ máy tính vào album gallery trên R2"
            >
              <Layers className="w-3.5 h-3.5" /> Tải nhiều ảnh
            </button>
            <button
              onClick={() => handleOpenAddModal("top")}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Thêm ảnh
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm nhanh */}
        <div className="mb-5 relative max-w-md">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm nhanh theo mô tả (alt) hoặc link ảnh..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
          />
        </div>

        {/* 2 DÒNG SẮP XẾP GỌN GÀNG */}
        <div className="space-y-5">
          {/* DÒNG 1: HÀNG TRÊN */}
          <div
            onDragOver={(e) => handleDragOver(e, "top")}
            onDragEnter={(e) => handleDragEnter(e, "top")}
            onDrop={(e) => handleDrop(e, "top")}
            className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all ${
              dragOverTarget?.row === "top"
                ? "border-blue-500 shadow-md bg-blue-50/10"
                : "border-gray-200 dark:border-gray-700 shadow-sm"
            }`}
          >
            {/* Header Hàng Trên */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  DÒNG 1: HÀNG TRÊN
                  <span className="text-[11px] font-normal text-gray-500">
                    (Chạy từ Phải sang Trái ➡️⬅️)
                  </span>
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {topItems.length} ảnh
                </span>
              </div>
            </div>

            {/* Danh sách ảnh Hàng Trên dạng lưới gọn */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2">
              {visibleTopItems.map((item, idx) => renderCompactCard(item, "top", idx))}
              {/* Ô cuối cùng là nút + thêm ảnh vào hàng trên */}
              {renderAddSlotCard("top")}
            </div>
          </div>

          {/* DÒNG 2: HÀNG DƯỚI */}
          <div
            onDragOver={(e) => handleDragOver(e, "bottom")}
            onDrop={(e) => handleDrop(e, "bottom")}
            className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-all ${
              dragOverTarget?.row === "bottom"
                ? "border-emerald-500 shadow-md bg-emerald-50/10"
                : "border-gray-200 dark:border-gray-700 shadow-sm"
            }`}
          >
            {/* Header Hàng Dưới */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  DÒNG 2: HÀNG DƯỚI
                  <span className="text-[11px] font-normal text-gray-500">
                    (Chạy từ Trái sang Phải ⬅️➡️)
                  </span>
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  {bottomItems.length} ảnh
                </span>
              </div>
            </div>

            {/* Danh sách ảnh Hàng Dưới dạng lưới gọn */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-2">
              {visibleBottomItems.map((item, idx) => renderCompactCard(item, "bottom", idx))}
              {/* Ô cuối cùng là nút + thêm ảnh vào hàng dưới */}
              {renderAddSlotCard("bottom")}
            </div>
          </div>
        </div>

        {/* Modal Thêm / Sửa ảnh */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 max-h-[90vh] flex flex-col">
              <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-green-600" />
                  {editingImage ? "Chỉnh sửa ảnh" : "Thêm ảnh vào Gallery"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
                {/* Vị trí Hàng */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">
                    Hàng hiển thị:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, row: "top" })}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs font-semibold flex items-center gap-2 ${
                        formData.row === "top"
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100"
                          : "border-gray-200 dark:border-gray-700 text-gray-600"
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                      Dòng 1: Hàng trên
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, row: "bottom" })}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs font-semibold flex items-center gap-2 ${
                        formData.row === "bottom"
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100"
                          : "border-gray-200 dark:border-gray-700 text-gray-600"
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                      Dòng 2: Hàng dưới
                    </button>
                  </div>
                </div>

                {/* Upload ảnh trực tiếp lên R2 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <UploadCloud className="w-3.5 h-3.5 text-green-600" />
                      Tải ảnh từ máy tính (Album: <span className="font-bold text-green-600">gallery</span> trên R2)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowR2Modal(true)}
                      className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <FolderPlus className="w-3 h-3" /> Chọn từ kho R2
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleDirectFileSelected(e.target.files[0])}
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingFile(false);
                      if (e.dataTransfer.files?.[0]) handleDirectFileSelected(e.dataTransfer.files[0]);
                    }}
                    onClick={() => !uploadingDirect && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDraggingFile
                        ? "border-green-500 bg-green-50/50"
                        : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                    }`}
                  >
                    {uploadingDirect ? (
                      <div className="py-2">
                        <RefreshCw className="w-6 h-6 text-green-600 animate-spin mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                          Đang tải lên album gallery trên R2: {uploadProgress}%
                        </p>
                      </div>
                    ) : formData.src ? (
                      <div className="flex items-center gap-3 text-left">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img src={formData.src} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-green-600 text-[11px] font-semibold">
                            <Check className="w-3.5 h-3.5" /> Đã lưu vào album: gallery (R2)
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 font-mono truncate">
                            {uploadedFileName || formData.src}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          <span className="text-green-600 font-semibold underline">Nhấp để chọn ảnh</span> hoặc kéo thả file vào đây
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShowManualUrl(!showManualUrl)}
                      className="text-gray-500 hover:text-gray-700 underline"
                    >
                      {showManualUrl ? "Ẩn ô nhập URL thủ công" : "Nhập link URL ảnh thủ công"}
                    </button>
                    {formData.src && (
                      <a
                        href={formData.src}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:underline inline-flex items-center gap-0.5"
                      >
                        Mở link gốc <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {showManualUrl && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 block">
                      URL ảnh (publicUrl):
                    </label>
                    <input
                      type="text"
                      value={formData.src}
                      onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                      placeholder="https://img.btacademy.com.vn/gallery/..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                )}

                {/* Mô tả ảnh / Alt */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Mô tả ảnh (Alt text khi phóng to):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    placeholder="Ví dụ: Học viên thực hành dẫn chương trình tại Studio BT Academy..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                {/* Thứ tự & Trạng thái */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Thứ tự trong hàng:
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                      Trạng thái:
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer mt-1.5">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-xs text-gray-700 dark:text-gray-300">Cho phép hiển thị</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingDirect || !formData.src}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    {editingImage ? "Lưu thay đổi" : "Thêm vào Gallery"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Xóa ảnh */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Xóa ảnh khỏi Gallery?</h3>
              </div>

              {deleteTarget.src && (
                <div className="my-2.5 aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img src={deleteTarget.src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
                Bạn có chắc chắn muốn xóa ảnh này khỏi danh sách?
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center gap-1"
                >
                  {deleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Xóa ảnh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Khôi phục 33 ảnh mẫu */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 text-amber-600 mb-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Khôi phục 33 ảnh mẫu gốc?</h3>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
                Đặt lại toàn bộ Gallery về 33 ảnh mẫu ban đầu (17 ảnh Hàng Trên, 16 ảnh Hàng Dưới).
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  disabled={resetting}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  disabled={resetting}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm flex items-center gap-1"
                >
                  {resetting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Khôi phục ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bulk Upload */}
        {isBulkUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl text-center">
              <UploadCloud className="w-10 h-10 text-green-600 mx-auto mb-2 animate-bounce" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Đang tải ảnh lên R2...</h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{bulkStatus.filename}</p>
              <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-600 h-full transition-all duration-300"
                  style={{
                    width: `${Math.round((bulkStatus.current / (bulkStatus.total || 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {bulkStatus.current} / {bulkStatus.total} ({Math.round((bulkStatus.current / (bulkStatus.total || 1)) * 100)}%)
              </p>
            </div>
          </div>
        )}

        {/* Modal R2 Picker */}
        <R2ImageModal
          visible={showR2Modal}
          onClose={() => setShowR2Modal(false)}
          onSelect={handleR2Select}
          initialFolder="gallery"
          initialTab="manage"
        />
      </div>
    </AdminLayout>
  );
}
