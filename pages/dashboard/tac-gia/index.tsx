import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useState, useEffect, useRef, ChangeEventHandler } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../../../components/layout/AdminLayout";

interface Author {
  _id: string;
  name: string;
  avatar?: { url: string; public_id?: string | null };
  bio?: string;
  postCount?: number;
}

const AuthorsManagement: NextPage = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/authors");
      setAuthors(data.authors || []);
    } catch (error: any) {
      toast.error("Không thể tải danh sách tác giả!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAvatarChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setName("");
    setBio("");
    setAvatar(null);
    setAvatarPreview("");
    setEditingAuthor(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setName(author.name);
    setBio(author.bio || "");
    setAvatarPreview(author.avatar?.url || "");
    setAvatar(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Tên tác giả không được để trống!");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      if (editingAuthor) {
        // Update
        const { data } = await axios.put(`/api/authors/${editingAuthor._id}`, formData);
        toast.success(data.message || "Cập nhật tác giả thành công!");
      } else {
        // Create
        const { data } = await axios.post("/api/authors", formData);
        toast.success(data.message || "Tạo tác giả thành công!");
      }
      resetForm();
      fetchAuthors();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra!";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (authorId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tác giả này?")) return;

    try {
      const { data } = await axios.delete(`/api/authors/${authorId}`);
      toast.success(data.message || "Xóa tác giả thành công!");
      fetchAuthors();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Có lỗi xảy ra!";
      toast.error(errorMessage);
    }
  };

  return (
    <AdminLayout title="Quản lý Tác giả">
      <div className="p-6 min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý tác giả</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý danh sách tác giả viết bài trên hệ thống
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Authors - 2/3 width */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Danh sách tác giả ({authors.length})
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#105d97]"></div>
              </div>
            ) : authors.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>Chưa có tác giả nào. Hãy tạo tác giả đầu tiên bên tay phải!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Tác giả</th>
                      <th className="py-3 px-4">Giới thiệu</th>
                      <th className="py-3 px-4 text-center">Số bài viết</th>
                      <th className="py-3 px-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                    {authors.map((author) => (
                      <tr key={author._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-750 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                            {author.avatar?.url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={author.avatar.url}
                                alt={author.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-sm bg-gray-200 dark:bg-gray-700">
                                {author.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {author.name}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-550 dark:text-gray-400 max-w-xs truncate">
                          {author.bio || <span className="text-gray-300 dark:text-gray-600">Không có giới thiệu</span>}
                        </td>
                        <td className="py-4 px-4 text-center font-medium text-gray-900 dark:text-white">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                            {author.postCount || 0} bài
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(author)}
                            className="text-[#105d97] hover:text-[#0e4d7a] font-medium text-sm transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(author._id)}
                            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Form Create/Edit - 1/3 width */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editingAuthor ? "Cập nhật tác giả" : "Thêm tác giả mới"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ảnh đại diện (Avatar)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border border-gray-250 dark:border-gray-600">
                    {avatarPreview ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      ref={fileInputRef}
                      id="avatar-input"
                    />
                    <label
                      htmlFor="avatar-input"
                      className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Chọn ảnh
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>

              {/* Author name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Họ và tên tác giả *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: MC Bích Thủy"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none text-sm"
                  required
                />
              </div>

              {/* Bio description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Giới thiệu ngắn (Bio)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Thông tin giới thiệu ngắn về tác giả..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none text-sm resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-grow flex items-center justify-center px-4 py-2 bg-[#105d97] hover:bg-[#0e4d7a] text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-70"
                >
                  {submitting ? "Đang lưu..." : editingAuthor ? "Cập nhật" : "Thêm mới"}
                </button>
                {editingAuthor && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-105 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium text-sm"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuthorsManagement;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/dang-nhap", permanent: false },
    };
  }

  return { props: {} };
}
