import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Menu,
  Check,
  X,
  AlertTriangle,
  Link as LinkIcon,
  Layers,
  Sparkles,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Heading from "../../../components/backend/Heading";

interface SubMenuItem {
  _id?: string;
  name: string;
  href: string;
  desc?: string;
  isHighlight?: boolean;
  order: number;
  isActive?: boolean;
  openInNewTab?: boolean;
}

interface MenuItemData {
  _id: string;
  name: string;
  href: string;
  order: number;
  isActive: boolean;
  openInNewTab?: boolean;
  hasDropdown: boolean;
  dropdownItems?: SubMenuItem[];
  createdAt?: string;
  updatedAt?: string;
}

export default function MenuNavbarManager() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingReorder, setSavingReorder] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Fields State
  const [formName, setFormName] = useState<string>("");
  const [formHref, setFormHref] = useState<string>("");
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formOpenInNewTab, setFormOpenInNewTab] = useState<boolean>(false);
  const [formHasDropdown, setFormHasDropdown] = useState<boolean>(false);
  const [formSubItems, setFormSubItems] = useState<SubMenuItem[]>([]);

  // Sub-item quick add in form
  const [newSubName, setNewSubName] = useState<string>("");
  const [newSubHref, setNewSubHref] = useState<string>("");
  const [newSubDesc, setNewSubDesc] = useState<string>("");
  const [newSubIsHighlight, setNewSubIsHighlight] = useState<boolean>(false);

  // Reset Confirmation Modal
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<MenuItemData | null>(null);

  // Fetch data
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/navbars?all=true");
      if (res.data?.success && Array.isArray(res.data.items)) {
        const sorted = [...res.data.items].sort((a, b) => (a.order || 0) - (b.order || 0));
        setItems(sorted);
      }
    } catch (err: any) {
      console.error("Error fetching navbar menu:", err);
      toast.error(err.response?.data?.message || "Không thể tải danh sách Menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormHref("");
    setFormOrder(items.length > 0 ? Math.max(...items.map((i) => i.order || 0)) + 1 : 1);
    setFormIsActive(true);
    setFormOpenInNewTab(false);
    setFormHasDropdown(false);
    setFormSubItems([]);
    setNewSubName("");
    setNewSubHref("");
    setNewSubDesc("");
    setNewSubIsHighlight(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: MenuItemData) => {
    setEditingItem(item);
    setFormName(item.name || "");
    setFormHref(item.href || "");
    setFormOrder(item.order || 1);
    setFormIsActive(item.isActive !== false);
    setFormOpenInNewTab(Boolean(item.openInNewTab));
    setFormHasDropdown(Boolean(item.hasDropdown));
    setFormSubItems(
      item.dropdownItems
        ? [...item.dropdownItems].sort((a, b) => (a.order || 0) - (b.order || 0))
        : []
    );
    setNewSubName("");
    setNewSubHref("");
    setNewSubDesc("");
    setNewSubIsHighlight(false);
    setIsModalOpen(true);
  };

  // Add sub-item inside form
  const handleAddSubItemToForm = () => {
    if (!newSubName.trim() || !newSubHref.trim()) {
      toast.warning("Vui lòng nhập tên và đường dẫn mục con");
      return;
    }

    const newSub: SubMenuItem = {
      name: newSubName.trim(),
      href: newSubHref.trim(),
      desc: newSubDesc.trim(),
      isHighlight: newSubIsHighlight,
      order: formSubItems.length + 1,
      isActive: true,
      openInNewTab: false,
    };

    setFormSubItems([...formSubItems, newSub]);
    setNewSubName("");
    setNewSubHref("");
    setNewSubDesc("");
    setNewSubIsHighlight(false);
  };

  const handleRemoveSubItemFromForm = (index: number) => {
    const updated = formSubItems.filter((_, i) => i !== index);
    const reordered = updated.map((sub, i) => ({ ...sub, order: i + 1 }));
    setFormSubItems(reordered);
  };

  const handleMoveSubItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formSubItems.length) return;

    const newSubs = [...formSubItems];
    const temp = newSubs[index];
    newSubs[index] = newSubs[targetIndex];
    newSubs[targetIndex] = temp;

    const reordered = newSubs.map((sub, idx) => ({ ...sub, order: idx + 1 }));
    setFormSubItems(reordered);
  };

  // Submit Modal Form (Create / Edit)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formHref.trim()) {
      toast.warning("Vui lòng nhập tên và đường dẫn cho menu");
      return;
    }

    const payload = {
      name: formName.trim(),
      href: formHref.trim(),
      order: Number(formOrder) || 1,
      isActive: formIsActive,
      openInNewTab: formOpenInNewTab,
      hasDropdown: formHasDropdown,
      dropdownItems: formHasDropdown ? formSubItems : [],
    };

    try {
      setSubmitting(true);
      if (editingItem) {
        const res = await axios.put(`/api/navbars/${editingItem._id}`, payload);
        if (res.data?.success) {
          toast.success("Cập nhật menu thành công!");
          setIsModalOpen(false);
          await fetchMenuItems();
        }
      } else {
        const res = await axios.post("/api/navbars", payload);
        if (res.data?.success) {
          toast.success("Thêm menu mới thành công!");
          setIsModalOpen(false);
          await fetchMenuItems();
        }
      }
    } catch (err: any) {
      console.error("Error saving menu:", err);
      toast.error(err.response?.data?.message || "Không thể lưu thông tin menu");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status directly
  const handleToggleActive = async (item: MenuItemData) => {
    const newStatus = !item.isActive;
    setItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, isActive: newStatus } : i))
    );

    try {
      await axios.put(`/api/navbars/${item._id}`, { isActive: newStatus });
      toast.success(newStatus ? `Đã bật "${item.name}"` : `Đã ẩn "${item.name}"`);
    } catch (err: any) {
      console.error("Error toggling active:", err);
      toast.error("Lỗi khi cập nhật trạng thái");
      await fetchMenuItems();
    }
  };

  // Move Menu Left (Up) or Right (Down)
  const handleMoveOrder = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reorderedList = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setItems(reorderedList);

    try {
      setSavingReorder(true);
      await axios.put("/api/navbars", {
        action: "reorder",
        items: reorderedList.map((it) => ({ _id: it._id, order: it.order })),
      });
      toast.success("Đã lưu thứ tự menu!");
    } catch (err: any) {
      console.error("Error saving reorder:", err);
      toast.error("Không thể lưu thứ tự menu");
      await fetchMenuItems();
    } finally {
      setSavingReorder(false);
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSubmitting(true);
      const res = await axios.delete(`/api/navbars/${deleteTarget._id}`);
      if (res.data?.success) {
        toast.success(`Đã xóa menu "${deleteTarget.name}"`);
        setDeleteTarget(null);
        await fetchMenuItems();
      }
    } catch (err: any) {
      console.error("Error deleting menu:", err);
      toast.error(err.response?.data?.message || "Không thể xóa menu");
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm and Reset Default
  const handleConfirmReset = async () => {
    try {
      setSubmitting(true);
      const res = await axios.put("/api/navbars", { action: "reset-default" });
      if (res.data?.success) {
        toast.success("Đã khôi phục danh sách Menu mặc định!");
        setShowResetConfirm(false);
        await fetchMenuItems();
      }
    } catch (err: any) {
      console.error("Error resetting default menu:", err);
      toast.error(err.response?.data?.message || "Không thể khôi phục menu mặc định");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Sub-item active status directly
  const handleToggleSubActive = async (parentItem: MenuItemData, subIndex: number) => {
    const updatedSubs = [...(parentItem.dropdownItems || [])];
    if (!updatedSubs[subIndex]) return;

    updatedSubs[subIndex] = {
      ...updatedSubs[subIndex],
      isActive: updatedSubs[subIndex].isActive === false ? true : false,
    };

    try {
      await axios.put(`/api/navbars/${parentItem._id}`, {
        dropdownItems: updatedSubs,
      });
      toast.success("Đã cập nhật mục con");
      await fetchMenuItems();
    } catch (err: any) {
      console.error("Error toggling sub active:", err);
      toast.error("Lỗi khi cập nhật");
    }
  };

  // Move Sub-item Left / Right directly
  const handleMoveSubDirectly = async (
    parentItem: MenuItemData,
    subIndex: number,
    direction: "left" | "right"
  ) => {
    const subs = [...(parentItem.dropdownItems || [])];
    const targetIdx = direction === "left" ? subIndex - 1 : subIndex + 1;
    if (targetIdx < 0 || targetIdx >= subs.length) return;

    const temp = subs[subIndex];
    subs[subIndex] = subs[targetIdx];
    subs[targetIdx] = temp;

    const reorderedSubs = subs.map((s, idx) => ({ ...s, order: idx + 1 }));

    try {
      await axios.put(`/api/navbars/${parentItem._id}`, {
        dropdownItems: reorderedSubs,
      });
      toast.success("Đã lưu thứ tự mục con");
      await fetchMenuItems();
    } catch (err: any) {
      console.error("Error moving sub item:", err);
      toast.error("Lỗi khi lưu thứ tự");
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = items.length;
    const activeCount = items.filter((i) => i.isActive !== false).length;
    const inactiveCount = total - activeCount;
    const hasDropdownCount = items.filter((i) => i.hasDropdown).length;
    return { total, activeCount, inactiveCount, hasDropdownCount };
  }, [items]);

  return (
    <AdminLayout title="Quản lý Menu Navbar - BT Academy">
      <Head>
        <title>Quản lý Menu Navbar | BT Academy Admin</title>
      </Head>

      <div className="p-3 sm:p-5 container max-w-full mx-auto space-y-4">
        {/* Compact Header */}
        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-[#22c55e] rounded-lg">
              <Menu className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Quản lý Menu Navbar
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  {stats.total} mục
                </span>
              </div>
              {/* Mini Inline Stats */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>{stats.activeCount} hiển thị</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>{stats.inactiveCount} ẩn</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-500 inline-block" />
                  <span>{stats.hasDropdownCount} dropdown</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/60 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Khôi phục về menu mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Khôi phục mặc định</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#22c55e] hover:bg-[#16a34a] rounded-lg shadow-sm transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm Menu Mới</span>
            </button>
          </div>
        </div>

        {/* 1. VISUAL HORIZONTAL NAVBAR STRIP (Sơ đồ Menu hàng ngang trực quan) */}
        <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide text-[11px]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Sơ đồ vị trí Menu theo hàng ngang (Thứ tự từ Trái sang Phải)</span>
            </div>
            <span className="text-[11px] text-gray-400 italic hidden sm:inline">
              Bấm nút ◄ hoặc ► để đổi chỗ trực tiếp sang Trái/Phải
            </span>
          </div>

          {loading ? (
            <div className="py-6 text-center text-xs text-gray-400">Đang tải menu...</div>
          ) : items.length === 0 ? (
            <div className="py-4 text-center text-xs text-gray-400">Chưa có menu nào</div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
              {items.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === items.length - 1;
                const subCount = item.dropdownItems?.length || 0;

                return (
                  <div
                    key={item._id}
                    className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${item.isActive
                      ? "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-sm text-gray-900 dark:text-white"
                      : "bg-gray-100 dark:bg-gray-900 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 opacity-70"
                      }`}
                  >
                    {/* Move Left */}
                    <button
                      type="button"
                      disabled={isFirst || savingReorder}
                      onClick={() => handleMoveOrder(index, "left")}
                      title="Di chuyển sang trái"
                      className="p-1 rounded text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Badge STT */}
                    <span className="font-mono text-[11px] font-bold text-gray-400 w-4 text-center">
                      #{item.order || index + 1}
                    </span>

                    {/* Name */}
                    <span className="font-semibold whitespace-nowrap">{item.name}</span>

                    {/* Dropdown badge */}
                    {item.hasDropdown && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-medium">
                        {subCount}
                      </span>
                    )}

                    {/* Move Right */}
                    <button
                      type="button"
                      disabled={isLast || savingReorder}
                      onClick={() => handleMoveOrder(index, "right")}
                      title="Di chuyển sang phải"
                      className="p-1 rounded text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed transition"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[#22c55e] text-[#22c55e] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. COMPACT HORIZONTAL TABLE (Danh sách chi tiết dạng bảng hàng ngang) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/90 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 px-3 w-28 text-center">Thứ tự</th>
                  <th className="py-2.5 px-3 min-w-[160px]">Tên Menu</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Đường dẫn (URL / Slug)</th>
                  <th className="py-2.5 px-3 w-40">Mục con (Dropdown)</th>
                  <th className="py-2.5 px-3 w-24 text-center">Hiển thị</th>
                  <th className="py-2.5 px-3 w-24 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Đang tải danh sách menu...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Chưa có menu nào. Nhấn &quot;Thêm Menu Mới&quot; để tạo.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === items.length - 1;
                    const isExpanded = Boolean(expandedItems[item._id]);
                    const subItems = item.dropdownItems || [];

                    return (
                      <React.Fragment key={item._id}>
                        <tr
                          className={`hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors ${!item.isActive ? "opacity-60 bg-gray-50/40 dark:bg-gray-900/20" : ""
                            }`}
                        >
                          {/* Order & Horizontal Controls */}
                          <td className="py-2 px-3 text-center">
                            <div className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700/60 px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-600">
                              <button
                                type="button"
                                disabled={isFirst || savingReorder}
                                onClick={() => handleMoveOrder(index, "left")}
                                title="Đưa sang trái (lên trước)"
                                className="p-0.5 text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                              <span className="font-mono font-bold text-[11px] text-gray-700 dark:text-gray-200 min-w-[18px]">
                                #{item.order || index + 1}
                              </span>
                              <button
                                type="button"
                                disabled={isLast || savingReorder}
                                onClick={() => handleMoveOrder(index, "right")}
                                title="Đưa sang phải (về sau)"
                                className="p-0.5 text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-20 transition"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          {/* Name */}
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 dark:text-white text-sm">
                                {item.name}
                              </span>
                              {item.openInNewTab && (
                                <span className="text-[10px] px-1 py-0.2 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-medium">
                                  Tab mới
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Href */}
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                              <LinkIcon className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate max-w-xs">{item.href}</span>
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-[#22c55e]"
                                title="Mở thử link"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>

                          {/* Dropdown column */}
                          <td className="py-2 px-3">
                            {item.hasDropdown ? (
                              <button
                                type="button"
                                onClick={() => toggleExpand(item._id)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition ${isExpanded
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100"
                                  }`}
                              >
                                <Layers className="w-3 h-3" />
                                <span>{subItems.length} mục con</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            ) : (
                              <span className="text-gray-400 text-[11px] italic">Không</span>
                            )}
                          </td>

                          {/* Toggle Active */}
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleActive(item)}
                              title={item.isActive ? "Bấm để ẩn" : "Bấm để hiển thị"}
                              className={`p-1 rounded-md transition ${item.isActive
                                ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100"
                                : "text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200"
                                }`}
                            >
                              {item.isActive ? (
                                <Eye className="w-3.5 h-3.5" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>

                          {/* Actions: Edit & Delete */}
                          <td className="py-2 px-3 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(item)}
                                title="Chỉnh sửa menu"
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(item)}
                                title="Xóa menu"
                                className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Inline Expand for Dropdown sub-items (Horizontal Cards Row) */}
                        {item.hasDropdown && isExpanded && (
                          <tr className="bg-blue-50/40 dark:bg-blue-950/20">
                            <td colSpan={6} className="px-4 py-2.5 border-t border-b border-blue-100 dark:border-blue-900/40">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs text-blue-900 dark:text-blue-300 font-semibold">
                                  <span>Mục thả xuống của &quot;{item.name}&quot; ({subItems.length})</span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(item)}
                                    className="text-[11px] text-[#22c55e] hover:underline font-medium"
                                  >
                                    + Thêm / Sửa mục con trong Form
                                  </button>
                                </div>

                                {subItems.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic py-1">
                                    Chưa có mục con nào. Nhấn Sửa để thêm.
                                  </p>
                                ) : (
                                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    {subItems.map((sub, sIdx) => (
                                      <div
                                        key={sub._id || sIdx}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs bg-white dark:bg-gray-800 transition ${sub.isActive !== false
                                          ? "border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                                          : "border-gray-200 dark:border-gray-800 opacity-50 line-through"
                                          }`}
                                      >
                                        <button
                                          type="button"
                                          disabled={sIdx === 0}
                                          onClick={() => handleMoveSubDirectly(item, sIdx, "left")}
                                          className="text-gray-400 hover:text-gray-800 disabled:opacity-20"
                                          title="Sang trái"
                                        >
                                          <ArrowLeft className="w-3 h-3" />
                                        </button>
                                        <span className="font-mono text-[10px] text-gray-400 font-bold">
                                          #{sub.order || sIdx + 1}
                                        </span>
                                        <span className="font-semibold">{sub.name}</span>
                                        {sub.isHighlight && (
                                          <span className="text-[9px] px-1 rounded bg-emerald-100 text-emerald-800 font-bold">
                                            Hot
                                          </span>
                                        )}
                                        <button
                                          type="button"
                                          disabled={sIdx === subItems.length - 1}
                                          onClick={() => handleMoveSubDirectly(item, sIdx, "right")}
                                          className="text-gray-400 hover:text-gray-800 disabled:opacity-20"
                                          title="Sang phải"
                                        >
                                          <ArrowRight className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleSubActive(item, sIdx)}
                                          className={`p-0.5 ${sub.isActive !== false ? "text-emerald-600" : "text-gray-400"
                                            }`}
                                          title={sub.isActive !== false ? "Ẩn" : "Hiện"}
                                        >
                                          {sub.isActive !== false ? (
                                            <Eye className="w-3 h-3" />
                                          ) : (
                                            <EyeOff className="w-3 h-3" />
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Create / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden text-xs">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Menu className="w-4 h-4 text-[#22c55e]" />
                  <span>{editingItem ? "Chỉnh sửa Menu" : "Thêm Menu Mới"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tên Menu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Khóa học, Blog, Giới thiệu..."
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#22c55e] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Thứ tự (#)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formOrder}
                      onChange={(e) => setFormOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Đường dẫn (URL / Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: /, /khoa-hoc, /lich-khai-giang, /#giang-vien, hoặc https://..."
                    value={formHref}
                    onChange={(e) => setFormHref(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-[#22c55e] focus:outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-gray-50 dark:bg-gray-900/60 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#22c55e] focus:ring-[#22c55e]"
                    />
                    <span>Hiển thị</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-800 dark:text-gray-200">
                    <input
                      type="checkbox"
                      checked={formOpenInNewTab}
                      onChange={(e) => setFormOpenInNewTab(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#22c55e] focus:ring-[#22c55e]"
                    />
                    <span>Tab mới</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    <input
                      type="checkbox"
                      checked={formHasDropdown}
                      onChange={(e) => setFormHasDropdown(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#22c55e] focus:ring-[#22c55e]"
                    />
                    <span>Menu Dropdown</span>
                  </label>
                </div>

                {formHasDropdown && (
                  <div className="border border-blue-200 dark:border-blue-900/70 bg-blue-50/20 dark:bg-blue-950/20 rounded-xl p-3 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-300">
                      <span>Cấu hình các mục thả xuống ({formSubItems.length})</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          placeholder="Tên mục con (VD: MC Nâng cao)"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          className="px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-xs bg-white dark:bg-gray-900"
                        />
                        <input
                          type="text"
                          placeholder="Đường dẫn (VD: /khoa-hoc/mc-nang-cao)"
                          value={newSubHref}
                          onChange={(e) => setNewSubHref(e.target.value)}
                          className="px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-xs font-mono bg-white dark:bg-gray-900"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        <input
                          type="text"
                          placeholder="Mô tả ngắn (tùy chọn)"
                          value={newSubDesc}
                          onChange={(e) => setNewSubDesc(e.target.value)}
                          className="sm:col-span-2 px-2.5 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-xs bg-white dark:bg-gray-900"
                        />
                        <div className="flex items-center justify-between gap-1">
                          <label className="flex items-center gap-1 text-[11px] text-gray-600 dark:text-gray-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newSubIsHighlight}
                              onChange={(e) => setNewSubIsHighlight(e.target.checked)}
                              className="w-3.5 h-3.5 text-[#22c55e]"
                            />
                            <span>Hot</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleAddSubItemToForm}
                            className="px-2.5 py-1 bg-[#22c55e] text-white text-xs font-medium rounded-md hover:bg-[#16a34a] transition"
                          >
                            + Thêm
                          </button>
                        </div>
                      </div>
                    </div>

                    {formSubItems.length === 0 ? (
                      <p className="text-[11px] text-gray-400 text-center py-1 italic">
                        Chưa có mục con nào.
                      </p>
                    ) : (
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {formSubItems.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between p-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span className="font-mono text-gray-400 font-bold">#{sIdx + 1}</span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                                {sub.name}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono truncate">
                                ({sub.href})
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={sIdx === 0}
                                onClick={() => handleMoveSubItem(sIdx, "up")}
                                className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={sIdx === formSubItems.length - 1}
                                onClick={() => handleMoveSubItem(sIdx, "down")}
                                className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveSubItemFromForm(sIdx)}
                                className="p-0.5 text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#22c55e] hover:bg-[#16a34a] rounded-lg shadow-sm transition disabled:opacity-50"
                  >
                    {submitting ? "Đang lưu..." : editingItem ? "Lưu thay đổi" : "Tạo Menu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-4 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Xác nhận xóa menu?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Bạn có chắc muốn xóa menu &quot;{deleteTarget.name}&quot; không?
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmDelete}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow"
                >
                  {submitting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Default Confirm Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-sm w-full p-4 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-3 text-xs">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Khôi phục menu mặc định?
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Đưa toàn bộ danh sách menu về cấu hình ban đầu của BT Academy.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 text-xs text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmReset}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow"
                >
                  {submitting ? "Đang khôi phục..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
