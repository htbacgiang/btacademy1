import Image from "next/image";
import { FC, useState } from "react";
import { PostDetail as BasePostDetail } from "../../utils/types";
import Link from "next/link";
import { trimText } from "../../utils/helper";

// Mở rộng kiểu dữ liệu PostDetail gốc để thêm các thuộc tính mới
interface ExtendedPostDetail extends BasePostDetail {
  category: string; // Thêm danh mục
  createdAt: string; // Thêm ngày tạo
}

interface Props {
  post: ExtendedPostDetail;
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void;
}

const PostCard: FC<Props> = ({
  controls = false,
  post,
  busy,
  onDeleteClick,
}): JSX.Element => {
  const { title, slug, meta, thumbnail, category, createdAt } = post;
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    if (onDeleteClick) {
      onDeleteClick();
    }
    setShowModal(false);
  };

  return (
    <>
      {/* Responsive design - Mobile & Desktop optimized */}
      <div className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100/50 dark:border-gray-700/50 hover:border-blue-300/60 dark:hover:border-blue-500/60 backdrop-blur-sm">

        {/* Responsive layout: Mobile horizontal, Desktop vertical */}
        <div className="flex flex-col sm:flex-row lg:flex-col">
          {/* Thumbnail - Responsive sizing */}
          <div className="relative w-full sm:w-32 md:w-40 lg:w-full h-52 sm:h-32 md:h-40 lg:h-52 xl:h-56 overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            {!thumbnail ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Không có hình ảnh</p>
                </div>
              </div>
            ) : (
              <Image
                src={thumbnail}
                layout="fill"
                alt={title}
                objectFit="cover"
                className="group-hover:scale-105 transition-all duration-700 ease-out filter group-hover:brightness-110 group-hover:saturate-110"
              />
            )}
            {/* Enhanced overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>

          {/* Content - Enhanced responsive layout */}
          <div className="p-4 sm:p-3 md:p-4 lg:p-5 xl:p-6 flex flex-col flex-1 min-w-0">
            {/* Category & Date - Responsive visibility */}
            <div className="flex items-center justify-between mb-3 lg:mb-4 flex-wrap gap-2">
              {/* Mobile/Tablet: Show category, Desktop: Hidden (shown on image) */}
              <span className="lg:hidden inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {category || "Tin tức"}
              </span>

              {/* Date - Always visible on desktop, responsive on mobile */}
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs lg:text-sm">
                <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span className="hidden sm:inline">
                  {new Date(createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
                <span className="sm:hidden">
                  {new Date(createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Title - Enhanced responsive typography */}
            <Link href={`/bai-viet/${slug}`} className="group/title mb-2">
              <h2 className="text-base  md:text-xl font-bold text-gray-900 dark:text-white group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors duration-300 line-clamp-2 lg:line-clamp-3 leading-tight lg:leading-snug">
                {title}
              </h2>
            </Link>

          </div>
        </div>

        {/* Controls (Edit/Delete) - Mobile optimized */}
        {controls && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <Link
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
              href={`/dashboard/bai-viet/update/${slug}`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Sửa
            </Link>
            <button
              disabled={busy}
              onClick={() => setShowModal(true)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Xóa
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Xác nhận xóa</h2>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                disabled={busy}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
