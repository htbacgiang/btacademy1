import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";
import DashboardPostCard from "../../../components/common/DashboardPostCard";
import Pagination from "../../../components/common/Pagination";
import { formatPosts, readPostsFromDb } from "../../../lib/utils";
import { PostDetail } from "../../../utils/types";
import Post from "../../../models/Post";
import db from "../../../utils/db";
import styles from "../../../styles/posts.module.css";

const limit = 12;
const MAX_FEATURED = 4;

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ initialPosts, totalPages }) => {
  const [posts, setPosts] = useState<PostDetail[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Featured state
  const [featuredPosts, setFeaturedPosts] = useState<PostDetail[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [showFeaturedPicker, setShowFeaturedPicker] = useState(false);

  // Drag & drop state
  const [draggingId, setDraggingId] = useState<string | null>(null);   // id đang kéo
  const [draggingFrom, setDraggingFrom] = useState<"featured" | "list" | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null); // slot index đang hover

  // ── Fetch featured posts ──
  const fetchFeatured = useCallback(async () => {
    setFeaturedLoading(true);
    try {
      const { data } = await axios.get("/api/posts/featured");
      // Sort tăng dần theo featuredOrder
      const sorted = (data.posts || []).sort(
        (a: PostDetail, b: PostDetail) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999)
      );
      setFeaturedPosts(sorted);
    } catch {
      // ignore
    } finally {
      setFeaturedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  // ── Remove from featured ──
  const handleRemoveFeatured = async (postId: string) => {
    try {
      await axios.put("/api/posts/featured", { action: "remove", postId });
      toast.success("Đã xóa khỏi danh sách nổi bật");
      fetchFeatured();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isFeatured: false, featuredOrder: null } : p))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  // ── Save reorder to API ──
  const saveReorder = async (newList: PostDetail[]) => {
    try {
      await axios.put("/api/posts/featured", {
        action: "reorder",
        items: newList.map((p, i) => ({ postId: p.id, order: i + 1 })),
      });
    } catch {
      toast.error("Không thể lưu thứ tự mới");
      fetchFeatured();
    }
  };

  // ── Add to featured ──
  const handleAddFeatured = async (postId: string) => {
    if (featuredPosts.length >= MAX_FEATURED) {
      toast.error("Đã đủ 4 bài nổi bật!");
      return;
    }
    try {
      await axios.put("/api/posts/featured", { action: "add", postId });
      toast.success("Đã thêm vào danh sách nổi bật");
      setShowFeaturedPicker(false);
      fetchFeatured();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isFeatured: true } : p))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Có lỗi xảy ra");
    }
  };

  // ──────────────────────────────────────────────────────
  // DRAG & DROP — HTML5 native
  // ──────────────────────────────────────────────────────

  // Kéo trong vùng featured: reorder
  const handleFeaturedDragStart = (e: React.DragEvent, postId: string) => {
    setDraggingId(postId);
    setDraggingFrom("featured");
    e.dataTransfer.effectAllowed = "move";
  };

  // Kéo từ danh sách bài viết xuống vùng featured
  const handleListDragStart = (e: React.DragEvent, postId: string) => {
    setDraggingId(postId);
    setDraggingFrom("list");
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleSlotDragOver = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggingFrom === "list" ? "copy" : "move";
    setDragOverSlot(slotIdx);
  };

  const handleSlotDrop = async (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!draggingId) return;

    if (draggingFrom === "list") {
      // Thêm bài mới vào slot cụ thể (nếu slot trống)
      if (featuredPosts.length >= MAX_FEATURED) {
        toast.error("Đã đủ 4 bài nổi bật!");
        return;
      }
      await handleAddFeatured(draggingId);
      setDraggingId(null);
      setDraggingFrom(null);
      return;
    }

    // Kéo trong featured: swap vị trí
    if (draggingFrom === "featured") {
      const fromIdx = featuredPosts.findIndex((p) => p.id === draggingId);
      if (fromIdx === -1 || fromIdx === slotIdx) {
        setDraggingId(null);
        setDraggingFrom(null);
        return;
      }
      const newList = [...featuredPosts];
      const [moved] = newList.splice(fromIdx, 1);
      newList.splice(slotIdx, 0, moved);
      setFeaturedPosts(newList); // optimistic
      await saveReorder(newList);
    }

    setDraggingId(null);
    setDraggingFrom(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDraggingFrom(null);
    setDragOverSlot(null);
  };

  // ──────────────────────────────────────────────────────

  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      setCurrentPage(page);
      const skip = (page - 1) * limit;
      const { data } = await axios.get(`/api/posts?limit=${limit}&skip=${skip}&includeDrafts=true`);
      setPosts(data.posts);
    } catch {
      toast.error("Có lỗi xảy ra khi tải dữ liệu!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      if (featuredPosts.some((p) => p.id === postId)) fetchFeatured();
      toast.success("Bài viết đã được xóa thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Có lỗi xảy ra khi xóa bài viết!");
    }
  };

  const handleToggleStatus = async (postId: string, isDraft: boolean) => {
    try {
      await axios.put("/api/posts/draft", { postId, isDraft });
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isDraft } : p))
      );
      toast.success(isDraft ? "Bài viết đã chuyển về nháp!" : "Bài viết đã công khai!");
    } catch {
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái bài viết!");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Bài có thể chọn làm featured (từ picker modal)
  const pickablePosts = posts.filter((p) => !p.isFeatured && !p.isDraft);

  // Bài chưa featured, không nháp — có thể kéo thả từ danh sách
  const draggableListPosts = filteredPosts.filter((p) => !p.isFeatured && !p.isDraft);

  return (
    <AdminLayout title="Quản lý bài viết">
      <div className={styles.postsContainer}>

        {/* ══════════════════════════════════════════════════
            FEATURED MANAGER
        ══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="text-amber-400 text-xl">★</span>
                Bài viết nổi bật
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                  {featuredPosts.length}/{MAX_FEATURED}
                </span>
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Kéo thả thẻ để sắp xếp thứ tự · Vị trí 1 hiển thị đầu tiên trên trang /bai-viet
              </p>
            </div>
            <button
              onClick={() => setShowFeaturedPicker(true)}
              disabled={featuredPosts.length >= MAX_FEATURED}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                featuredPosts.length >= MAX_FEATURED
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              }`}
              title={featuredPosts.length >= MAX_FEATURED ? "Đã đủ 4 bài nổi bật" : ""}
            >
              <span className="text-base leading-none">+</span>
              Thêm bài
            </button>
          </div>

          {/* 4 slots hiển thị dạng card ngang */}
          {featuredLoading ? (
            <div className="flex gap-4">
              {[...Array(MAX_FEATURED)].map((_, i) => (
                <div key={i} className="flex-1 h-40 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(MAX_FEATURED)].map((_, slotIdx) => {
                const post = featuredPosts[slotIdx];
                const isOver = dragOverSlot === slotIdx;
                const isDraggingThis = post && draggingId === post.id;

                return (
                  <div
                    key={slotIdx}
                    onDragOver={(e) => handleSlotDragOver(e, slotIdx)}
                    onDrop={(e) => handleSlotDrop(e, slotIdx)}
                    onDragLeave={() => setDragOverSlot(null)}
                    className={`relative rounded-xl border-2 transition-all duration-200 min-h-[160px] ${
                      post
                        ? isDraggingThis
                          ? "border-amber-300 bg-amber-50 opacity-50"
                          : isOver
                          ? "border-amber-400 bg-amber-50 shadow-lg scale-[1.02]"
                          : "border-amber-200 bg-white shadow-sm hover:shadow-md"
                        : isOver
                        ? "border-amber-400 bg-amber-50 scale-[1.02] shadow-lg"
                        : "border-dashed border-gray-200 bg-gray-50"
                    }`}
                  >
                    {/* Số thứ tự */}
                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                      post ? "bg-amber-400 text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                      {slotIdx + 1}
                    </div>

                    {post ? (
                      <div
                        draggable
                        onDragStart={(e) => handleFeaturedDragStart(e, post.id)}
                        onDragEnd={handleDragEnd}
                        className="flex flex-col h-full cursor-grab active:cursor-grabbing select-none"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full aspect-video rounded-t-xl overflow-hidden bg-gray-100">
                          {post.thumbnail ? (
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">📝</div>
                          )}
                          {/* Remove button */}
                          <button
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); handleRemoveFeatured(post.id); }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors z-20"
                            title="Xóa khỏi nổi bật"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Info */}
                        <div className="p-2 flex-1">
                          <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{post.title}</p>
                          <p className="text-xs text-gray-400 mt-1 truncate">{post.category || "—"}</p>
                        </div>

                        {/* Drag hint */}
                        <div className="px-2 pb-2 text-xs text-gray-300 flex items-center gap-1">
                          <span>⠿</span> Kéo để đổi vị trí
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center gap-2">
                        <span className="text-3xl text-gray-200">☆</span>
                        <p className="text-xs text-gray-400">Kéo bài viết vào đây</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL PICKER */}
        {showFeaturedPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Chọn bài viết nổi bật</h3>
                <button
                  onClick={() => setShowFeaturedPicker(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
                >✕</button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-2">
                {pickablePosts.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">Không có bài viết nào để chọn</p>
                ) : (
                  pickablePosts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleAddFeatured(post.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-left"
                    >
                      {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-9 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs">📝</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                        <p className="text-xs text-gray-400">{post.category || "Không có danh mục"}</p>
                      </div>
                      <span className="text-amber-500 text-sm flex-shrink-0 font-semibold">+ Thêm</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            HEADER + SEARCH + POSTS LIST (draggable from here)
        ══════════════════════════════════════════════════ */}
        <div className={styles.header}>
          <h1 className={styles.title}>Danh sách bài viết</h1>
          <p className={styles.subtitle}>
            Kéo bài viết vào ô nổi bật phía trên để thêm nhanh
            <span className={styles.postCount}>
              &nbsp;({posts.length} bài · trang {currentPage}/{totalPages})
            </span>
          </p>
        </div>

        <div className={styles.actionsBar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={styles.addButton}
              onClick={() => router.push("/dashboard/bai-viet/trash")}
              style={{ backgroundColor: "#6b7280" }}
            >
              🗑️ Thùng rác
            </button>
            <button className={styles.addButton} onClick={() => router.push("/dashboard/them-bai-viet")}>
              <span>+</span>
              Thêm bài viết mới
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingState}><div className={styles.spinner}></div></div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3 className={styles.emptyTitle}>Không có bài viết nào</h3>
            <p className={styles.emptyDescription}>
              {searchTerm ? "Không tìm thấy bài viết phù hợp." : "Bắt đầu tạo bài viết đầu tiên."}
            </p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {filteredPosts.map((post) => {
              const canDrag = !post.isFeatured && !post.isDraft && featuredPosts.length < MAX_FEATURED;
              return (
                <div
                  key={post.slug}
                  draggable={canDrag}
                  onDragStart={canDrag ? (e) => handleListDragStart(e, post.id) : undefined}
                  onDragEnd={handleDragEnd}
                  className={`relative ${canDrag ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {/* Drag badge */}
                  {canDrag && (
                    <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-amber-400 text-white text-xs rounded font-semibold pointer-events-none select-none">
                      ⠿ Kéo lên
                    </div>
                  )}
                  <DashboardPostCard
                    key={post.slug}
                    post={post}
                    onDeleteClick={() => handleDelete(post.id)}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.paginationSection}>
            <div className={styles.paginationInfo}>
              <span>Trang {currentPage} / {totalPages}</span>
              <span>•</span>
              <span>{posts.length} bài viết trên trang này</span>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  initialPosts: PostDetail[];
  totalPages: number;
}> = async () => {
  try {
    await db.connectDb();
    const filter = {
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    };
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);
    const posts = await Post.find(filter).sort({ createdAt: -1 }).skip(0).limit(limit).lean();
    const formattedPosts = formatPosts(posts as any);
    return { props: { initialPosts: formattedPosts, totalPages } };
  } catch {
    return { notFound: true };
  }
};

export default Posts;
