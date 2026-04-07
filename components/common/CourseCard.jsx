"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toCloudinaryUrl } from '../../utils/cloudinary';


const CourseCard = ({ 
  course, 
  showFullFeatures = true,
  variant = 'default', // 'default', 'compact', 'minimal'
  className = '',

}) => {
  // Destructuring thông tin khóa học từ props
  const {
    id,
    title,
    description,
    category,
    lessons,
    videos,
    students,
    rating = 5,
    reviews,
    image,
    badge,
    slug
  } = course;

  // ==================== HELPER FUNCTIONS ====================
  

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <svg 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ));
  };


  const getCourseTypeStyle = (courseType) => {
    const styles = {
      offline: {
        bgClass: 'bg-green-600',
        textClass: 'text-green-700',
        bgLightClass: 'bg-green-100',
        text: '🏫 Trực tiếp tại lớp',
        shortText: '🏫 Offline'
      },
      online: {
        bgClass: 'bg-green-600',
        textClass: 'text-green-700', 
        bgLightClass: 'bg-green-100',
        text: '💻 Học online',
        shortText: '💻 Online'
      },
      hybrid: {
        bgClass: 'bg-green-600',
        textClass: 'text-green-700',
        bgLightClass: 'bg-green-100', 
        text: '🔄 Hybrid (Online + Offline)',
        shortText: '🔄 Hybrid'
      }
    };
    return styles[courseType] || styles.online;
  };


  if (variant === 'compact') {
    const courseTypeStyle = getCourseTypeStyle(course.courseType);
    
    return (
      <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-green-100 ${className}`}>
        <div className="flex flex-col sm:flex-row">
          {/* ===== PHẦN HÌNH ẢNH ===== */}
          <div className="relative w-full sm:w-64 h-48 sm:h-40 flex-shrink-0 overflow-hidden">
            <Image
              src={toCloudinaryUrl(image)}
              alt={title}
              width={256}
              height={160}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
            
            {/* Overlay hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-emerald-600/0 group-hover:from-green-600/20 group-hover:to-emerald-600/20 transition-all duration-500"></div>
            
            {/* Badge loại khóa học */}
            {badge && (
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-2 rounded-md text-xs font-semibold uppercase text-white ${courseTypeStyle.bgClass} shadow-sm`}>
                  {badge}
                </span>
              </div>
            )}
          </div>
          
          {/* ===== PHẦN NỘI DUNG ===== */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="flex-1">
              {/* Tiêu đề khóa học */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors cursor-pointer line-clamp-2 group-hover:text-green-600">
                {slug ? (
                  <Link href={`/khoa-hoc/${slug}`}>
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h3>

              {/* Mô tả khóa học */}
              {description && (
                <p className="text-gray-600 mb-3 leading-relaxed line-clamp-2 text-sm">
                  {description}
                </p>
              )}

              {/* Thông tin loại khóa học - Compact */}
              {course.courseType && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    {course.duration && (
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                        <span className="mr-1">⏱️</span>
                        <span>{course.duration}</span>
                      </div>
                    )}
                    {course.schedule && (
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                        <span className="mr-1">📅</span>
                        <span className="truncate max-w-32">{course.schedule}</span>
                      </div>
                    )}
                    {(course.location || course.platform) && (
                      <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                        <span className="mr-1">{course.location ? '📍' : '💻'}</span>
                        <span className="truncate max-w-32">{course.location || course.platform}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ===== PHẦN BOTTOM - NÚT VÀ THÔNG TIN ===== */}
            <div className="flex items-center justify-between mt-auto pt-3">
              {/* Nút hành động - bên trái */}
              <Link href={`/khoa-hoc/${slug || id}`}>
                <button className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
                  Xem chi tiết
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (variant === 'minimal') {
    return (
      <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-green-100 ${className}`}>
        {/* ===== PHẦN HÌNH ẢNH ===== */}
        <div className="relative h-40 overflow-hidden">
          <Image
            src={toCloudinaryUrl(image)}
            alt={title}
            width={300}
            height={160}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          
          {/* Overlay hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/20 group-hover:to-black/5 transition-all duration-500"></div>
        </div>
        
        {/* ===== PHẦN NỘI DUNG ===== */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-green-600 transition-colors cursor-pointer line-clamp-2 group-hover:text-green-600">
            {slug ? (
              <Link href={`/khoa-hoc/${slug}`}>
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          
          {/* Thông tin cơ bản */}
          <div className="flex items-center justify-between">
            {category && (
              <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-1 rounded">
                {category}
              </span>
            )}
            
          </div>
        </div>
      </div>
    );
  }

 
  const courseTypeStyle = getCourseTypeStyle(course.courseType);
  
  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-green-100 ${className}`}>
      {/* ===== PHẦN HÌNH ẢNH ===== */}
      <div className="relative">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={toCloudinaryUrl(image)}
            alt={title}
            width={400}
            height={250}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
          />
          
          {/* Overlay hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 group-hover:from-black/30 group-hover:via-transparent group-hover:to-black/10 transition-all duration-500"></div>
          
          {/* Badge loại khóa học */}
          {badge && (
            <div className="absolute top-4 left-4">
              <span className={`text-white px-3 py-1 rounded-full text-xs font-semibold uppercase ${courseTypeStyle.bgClass} shadow-lg`}>
                {badge}
              </span>
            </div>
          )}
          
        </div>
      </div>

      {/* ===== PHẦN NỘI DUNG ===== */}
      <div className="p-6">
        {/* Tiêu đề khóa học */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors cursor-pointer">
          {slug ? (
            <Link href={`/khoa-hoc/${slug}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>

        {/* Mô tả khóa học */}
        {description && (
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Thông tin loại khóa học và lịch trình */}
        {showFullFeatures && course.courseType && (
          <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg">
            {/* Grid thông tin chi tiết */}
            <div className="space-y-1">
              {course.schedule && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">📅 Lịch học:</span> {course.schedule}
                </div>
              )}
              
              {course.locations && course.locations.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">📍 Địa điểm:</span>
                  <div className="mt-1 space-y-1">
                    {course.locations.map((location, index) => (
                      <div key={index} className="text-xs bg-green-50 border border-green-200 px-2 py-1 rounded">
                        {location}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {course.platform && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">💻 Nền tảng:</span> {course.platform}
                </div>
              )}
            </div>
          </div>
        )}


        {/* ===== NÚT HÀNH ĐỘNG ===== */}
        <div className="flex justify-center">
          <Link href={`/khoa-hoc/${slug || id}`} className="w-full">
            <button className="w-full px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
              Xem chi tiết khóa học
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

CourseCard.defaultProps = {
  showFullFeatures: true,    // Hiển thị đầy đủ tính năng
  variant: 'default',        // Sử dụng variant mặc định
  className: '',             // Không có CSS class bổ sung
  course: {
    rating: 5,               // Rating mặc định là 5 sao
    reviews: 0              // Không có đánh giá
  }
};

export default CourseCard;
