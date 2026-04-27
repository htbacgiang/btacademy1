import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaCalendarAlt, FaUsers, FaClock, FaMapMarkerAlt, FaUser, FaTag } from 'react-icons/fa';
import { toCloudinaryUrl } from '../../../utils/cloudinary';

export default function ClassScheduleListPage() {
  const [allSchedules, setAllSchedules] = useState([]);
  const [displayedSchedules, setDisplayedSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const limit = 10;

  const tableContainerRef = useRef(null);


  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get('/api/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/class-schedules');
      const schedules = response.data.data?.classSchedules || [];
      console.log('Schedules from API:', schedules);
      setAllSchedules(schedules);
      setTotalPages(Math.ceil(schedules.length / limit));
      setDisplayedSchedules(schedules.slice(0, limit));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Không thể tải danh sách lịch khai giảng', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchCourses();
    fetchSchedules();
  }, [fetchCourses, fetchSchedules]);

  // Filter schedules based on search term and selected filters
  const filteredSchedules = useCallback(() => {
    let filtered = allSchedules;
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(schedule => 
        schedule.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.courseId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.instructor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(schedule => 
        schedule.status === selectedStatus
      );
    }
    
    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter(schedule => 
        schedule.courseId?._id === selectedCourse
      );
    }
    
    return filtered;
  }, [allSchedules, searchTerm, selectedStatus, selectedCourse]);

  useEffect(() => {
    const filtered = filteredSchedules();
    setTotalPages(Math.ceil(filtered.length / limit));
    setPage(1); // Reset to first page when filtering
  }, [filteredSchedules, limit]);

  useEffect(() => {
    const filtered = filteredSchedules();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedSchedules(filtered.slice(startIndex, endIndex));

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page, filteredSchedules, limit]);

  const handleDelete = async () => {
    if (!scheduleToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/class-schedules/${scheduleToDelete}`);
      toast.success('Lịch khai giảng đã được xóa thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      const updatedSchedules = allSchedules.filter((schedule) => schedule._id !== scheduleToDelete);
      setAllSchedules(updatedSchedules);
      setTotalPages(Math.ceil(updatedSchedules.length / limit));
      if (updatedSchedules.length > 0 && displayedSchedules.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Không thể xóa lịch khai giảng', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setScheduleToDelete(null);
    }
  };

  const confirmDelete = (id) => {
    setScheduleToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setScheduleToDelete(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sắp khai giảng':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Đang tuyển sinh':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Đang diễn ra':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Đã đầy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Đã kết thúc':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'Tạm hoãn':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push(ellipsis);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Trước
        </button>
        {pageNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => typeof num === 'number' && setPage(num)}
            disabled={num === ellipsis}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
              num === page
                ? 'bg-blue-600 text-white shadow-lg'
                : num === ellipsis
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-blue-300'
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <AdminLayout title="Quản lý lịch khai giảng">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="p-6 w-full mx-auto">
          {/* Header Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Quản lý lịch khai giảng
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Quản lý và theo dõi tất cả lịch khai giảng trong hệ thống
                </p>
              </div>
              <Link href="/dashboard/lich-khai-giang/them-moi">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg flex items-center gap-2">
                  <FaPlus className="text-sm" />
                  Thêm lịch khai giảng
                </button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 mb-3 border border-gray-100 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm lịch khai giảng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="Sắp khai giảng">Sắp khai giảng</option>
                  <option value="Đang tuyển sinh">Đang tuyển sinh</option>
                  <option value="Đang diễn ra">Đang diễn ra</option>
                  <option value="Đã đầy">Đã đầy</option>
                  <option value="Đã kết thúc">Đã kết thúc</option>
                  <option value="Tạm hoãn">Tạm hoãn</option>
                </select>
              </div>
              <div className="relative">
                <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Tất cả khóa học</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Filter Status and Clear Button */}
            {(searchTerm || selectedStatus || selectedCourse) && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-600">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Kết quả tìm kiếm:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {filteredSchedules().length} lịch khai giảng
                  </span>
                  {searchTerm && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                      &quot;{searchTerm}&quot;
                    </span>
                  )}
                  {selectedStatus && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                      {selectedStatus}
                    </span>
                  )}
                  {selectedCourse && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                      {courses.find(c => c._id === selectedCourse)?.title}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('');
                    setSelectedCourse('');
                  }}
                  className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Schedules Table Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
            {loading && allSchedules.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : filteredSchedules().length === 0 && (searchTerm || selectedStatus || selectedCourse) ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Không tìm thấy lịch khai giảng</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('');
                      setSelectedCourse('');
                    }}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            ) : (
             <div ref={tableContainerRef} className="overflow-x-auto">
               <table className="w-full" role="grid" aria-label="Danh sách lịch khai giảng">
                 <thead>
                   <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 border-b border-gray-200 dark:border-slate-600">
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       STT
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Lớp học
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Khóa học
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Lịch học
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Giảng viên
                     </th>
                   
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Trạng thái
                     </th>
                     <th className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider" scope="col">
                       Hành động
                     </th>
                   </tr>
                 </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                  {displayedSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                          <div className="text-6xl mb-4">📅</div>
                          <p className="text-xl font-medium mb-2">Không có lịch khai giảng nào</p>
                          <p className="text-sm">Hãy thêm lịch khai giảng đầu tiên để bắt đầu</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                   displayedSchedules.map((schedule, index) => (
                     <tr
                       key={schedule._id}
                       className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
                       role="row"
                     >
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                           {(page - 1) * limit + index + 1}
                         </span>
                       </td>
                       <td className="px-6 py-4">
                         <div className="max-w-xs">
                           <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                             {schedule.className || 'N/A'}
                           </div>
                           <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                             ID: {schedule._id?.slice(-8) || 'N/A'}
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center">
                           <div className="flex-shrink-0 h-12 w-12 mr-3">
                             <Image
                               src={toCloudinaryUrl(schedule.courseId?.image || '')}
                               alt={schedule.courseId?.title || 'Khóa học'}
                               width={48}
                               height={48}
                               loading="lazy"
                               className="rounded-lg object-cover w-full h-full shadow-sm"
                             />
                           </div>
                           <div className="max-w-xs">
                             <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                               {schedule.courseId?.title || 'N/A'}
                             </div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">
                               {schedule.courseId?.level || 'N/A'}
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm text-gray-900 dark:text-white space-y-1">
                           <div className="flex items-center gap-1">
                             <FaCalendarAlt className="text-gray-400 text-xs" />
                             <span className="text-xs">{formatDate(schedule.startDate)}</span>
                           </div>
                           <div className="flex items-center gap-1">
                             <FaClock className="text-gray-400 text-xs" />
                             <span className="text-xs">{schedule.schedule}</span>
                           </div>
                           <div className="flex items-center gap-1">
                             <FaMapMarkerAlt className="text-gray-400 text-xs" />
                             <span className="text-xs line-clamp-1">{schedule.location}</span>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="flex items-center">
                          
                           <div>
                             <div className="text-sm font-medium text-gray-900 dark:text-white">
                               {schedule.instructor?.name || 'N/A'}
                             </div>
                           
                           </div>
                         </div>
                       </td>
                  
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                           {schedule.status || 'N/A'}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center space-x-3">
                           <Link href={`/dashboard/lich-khai-giang/sua/${schedule._id}`}>
                             <button
                               className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors duration-200"
                               aria-label={`Sửa lịch khai giảng ${schedule.className || 'Lịch khai giảng'}`}
                             >
                               <FaEdit className="mr-1" />
                               Sửa
                             </button>
                           </Link>
                           <button
                             onClick={() => confirmDelete(schedule._id)}
                             className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors duration-200"
                             aria-label={`Xóa lịch khai giảng ${schedule.className || 'Lịch khai giảng'}`}
                           >
                             <FaTrash className="mr-1" />
                             Xóa
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
         )}
       </div>

       {/* Pagination */}
       {totalPages > 1 && (
         <div className="mt-6">
           {renderPagination()}
         </div>
       )}

       {/* Delete Confirmation Modal */}
       {isModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
             <div className="p-6">
               <div className="flex items-center mb-4">
                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                   <FaTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
                 </div>
               </div>
               <h3 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
                 Xác nhận xóa
               </h3>
               <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                 Bạn có chắc muốn xóa lịch khai giảng này? Hành động này không thể hoàn tác.
               </p>
               <div className="flex justify-center gap-3">
                 <button
                   onClick={closeModal}
                   className="px-6 py-3 bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-400 dark:hover:bg-slate-500 transition-colors duration-200 font-medium"
                 >
                   Hủy
                 </button>
                 <button
                   onClick={handleDelete}
                   className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                   disabled={loading}
                 >
                   {loading ? (
                     <div className="flex items-center">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                       Đang xóa...
                     </div>
                   ) : (
                     'Xóa'
                   )}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

       <ToastContainer />
     </div>
   </div>
 </AdminLayout>
);
}
