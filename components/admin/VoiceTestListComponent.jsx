import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Mic,
  Phone,
  Mail,
  Calendar,
  Clock,
  Trash2,
  Search,
  RefreshCw,
  Play,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Edit3,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xử lý',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  contacted: {
    label: 'Đã liên hệ',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  reviewed: {
    label: 'Đã đánh giá',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-500',
  },
  completed: {
    label: 'Hoàn thành',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
};

const VoiceTestListComponent = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    completed: 0,
  });

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Edit note modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [noteValue, setNoteValue] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchSubmissions();
      } else {
        setCurrentPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      });

      const response = await fetch(`/api/voice-test-submission?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubmissions(data.data || []);
        setTotalPages(data.pagination.total || 1);
        setTotalItems(data.pagination.totalItems || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi tải danh sách');
      }
    } catch (error) {
      console.error('Error fetching voice tests:', error);
      toast.error('Không thể kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch('/api/voice-test-submission', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Cập nhật trạng thái thành công');
        setSubmissions((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
        );
        // Refresh stats
        fetchSubmissions();
      } else {
        toast.error(data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleOpenNoteModal = (item) => {
    setEditingItem(item);
    setNoteValue(item.note || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!editingItem) return;
    try {
      setIsSavingNote(true);
      const response = await fetch('/api/voice-test-submission', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingItem._id, note: noteValue }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Lưu ghi chú thành công');
        setSubmissions((prev) =>
          prev.map((item) =>
            item._id === editingItem._id ? { ...item, note: noteValue } : item
          )
        );
        setIsNoteModalOpen(false);
      } else {
        toast.error(data.message || 'Lưu ghi chú thất bại');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Có lỗi xảy ra');
    } finally {
      setIsSavingNote(false);
    }
  };

  const confirmDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await fetch(`/api/voice-test-submission?id=${itemToDelete._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('Xóa bài test thành công');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        if (submissions.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchSubmissions();
        }
      } else {
        toast.error(data.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const copyToClipboard = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}: ${text}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 container max-w-full mx-auto space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mic className="w-7 h-7 text-green-600" />
            Quản lý Bài Test Giọng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi, nghe file ghi âm và xử lý các bài test giọng từ học viên
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng bài test</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Chờ xử lý</p>
              <p className="text-2xl font-bold text-amber-600 mt-0.5">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Đã liên hệ</p>
              <p className="text-2xl font-bold text-blue-600 mt-0.5">{stats.contacted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hoàn thành</p>
              <p className="text-2xl font-bold text-emerald-600 mt-0.5">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo số điện thoại, email, ghi chú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Lọc trạng thái:</span>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ xử lý' },
            { id: 'contacted', label: 'Đã liên hệ' },
            { id: 'completed', label: 'Hoàn thành' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${statusFilter === tab.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Submissions Table ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Người gửi</th>
                <th className="py-3.5 px-4">File Audio</th>
                <th className="py-3.5 px-4">Thời gian gửi</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Ghi chú</th>
                <th className="py-3.5 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <div className="inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-green-600" />
                      <span>Đang tải danh sách bài test...</span>
                    </div>
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <Mic className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    Không tìm thấy bài test giọng nào
                  </td>
                </tr>
              ) : (
                submissions.map((item) => {
                  const statusInfo = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Người gửi */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          {item.phone && (
                            <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                              <Phone className="w-3.5 h-3.5 text-green-600 shrink-0" />
                              <a
                                href={`tel:${item.phone}`}
                                className="hover:text-green-600 hover:underline"
                                title="Bấm để gọi"
                              >
                                {item.phone}
                              </a>
                              <button
                                onClick={() => copyToClipboard(item.phone, 'SĐT')}
                                title="Sao chép SĐT"
                                className="text-gray-400 hover:text-gray-600 text-[10px] ml-1 px-1 py-0.5 rounded bg-gray-100"
                              >
                                Copy
                              </button>
                            </div>
                          )}
                          {item.email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <a
                                href={`mailto:${item.email}`}
                                className="hover:text-blue-600 hover:underline truncate max-w-[200px]"
                                title={item.email}
                              >
                                {item.email}
                              </a>
                            </div>
                          )}
                          {!item.phone && !item.email && (
                            <span className="text-xs text-gray-400 italic">Chưa có thông tin</span>
                          )}
                        </div>
                      </td>

                      {/* File Audio */}
                      <td className="py-4 px-4 align-top min-w-[240px]">
                        {item.audioUrl ? (
                          <div className="space-y-1.5">
                            <audio
                              controls
                              className="h-8 w-60 rounded"
                              src={item.audioUrl}
                              preload="metadata"
                            >
                              Trình duyệt không hỗ trợ nghe trực tiếp.
                            </audio>
                            <div className="flex items-center gap-2 text-xs">
                              <a
                                href={item.audioUrl}
                                target="_blank"
                                rel="noreferrer"
                                download={item.originalFilename || 'voice-test.wav'}
                                className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Mở / Tải file
                              </a>
                              <span className="text-gray-400">|</span>
                              <span className="text-gray-500 truncate max-w-[140px]" title={item.originalFilename}>
                                {item.originalFilename || item.fileName || 'voice-test.wav'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                            <FileAudio className="w-4 h-4" />
                            <span>Đã gửi qua email admin</span>
                          </div>
                        )}
                      </td>

                      {/* Thời gian gửi */}
                      <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {item.submittedAt
                              ? new Date(item.submittedAt).toLocaleDateString('vi-VN')
                              : '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {item.submittedAt
                              ? new Date(item.submittedAt).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                              : ''}
                          </span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-4 align-top">
                        <select
                          value={item.status || 'pending'}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`text-xs font-medium rounded-md px-2.5 py-1 border cursor-pointer focus:outline-none transition-colors ${statusInfo.badgeClass}`}
                        >
                          <option value="pending">Chờ xử lý</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="reviewed">Đã đánh giá</option>
                          <option value="completed">Hoàn thành</option>
                        </select>
                      </td>

                      {/* Ghi chú */}
                      <td className="py-4 px-4 align-top max-w-[200px]">
                        <div
                          onClick={() => handleOpenNoteModal(item)}
                          className="cursor-pointer group p-1.5 rounded hover:bg-gray-100 transition-colors"
                          title="Bấm để chỉnh sửa ghi chú"
                        >
                          {item.note ? (
                            <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
                              {item.note}
                            </p>
                          ) : (
                            <span className="text-xs text-gray-400 italic flex items-center gap-1 group-hover:text-green-600">
                              <Edit3 className="w-3 h-3" />
                              Thêm ghi chú...
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Hành động */}
                      <td className="py-4 px-4 align-top text-center">
                        <button
                          onClick={() => confirmDelete(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa bài test này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {!loading && submissions.length > 0 && (
          <div className="py-3 px-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div>
              Hiển thị <span className="font-semibold">{submissions.length}</span> trên tổng số{' '}
              <span className="font-semibold">{totalItems}</span> bài test
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <span className="px-3 py-1.5 font-medium">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Note Modal ── */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Ghi chú bài test giọng
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Người gửi:{' '}
              <span className="font-semibold text-gray-700">
                {editingItem?.phone || editingItem?.email}
              </span>
            </div>
            <textarea
              rows="4"
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              placeholder="Nhập nhận xét về giọng nói, kết quả test, nội dung trao đổi..."
              className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSavingNote ? 'Đang lưu...' : 'Lưu ghi chú'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Xác nhận xóa?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Hành động này sẽ xóa vĩnh viễn bài test của{' '}
                <span className="font-semibold text-gray-700">
                  {itemToDelete?.phone || itemToDelete?.email || 'người này'}
                </span>
                . Bạn có chắc chắn không?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceTestListComponent;

