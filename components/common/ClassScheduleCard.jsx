import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toCloudinaryUrl } from '../../utils/cloudinary';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaUsers, FaTag } from 'react-icons/fa';
import RegistrationPopup from './RegistrationPopup';

const ClassScheduleCard = ({ schedule }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    return time.slice(0, 5); // Remove seconds if present
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sắp khai giảng':
        return 'bg-blue-100 text-blue-800';
      case 'Đang tuyển sinh':
        return 'bg-green-100 text-green-800';
      case 'Đã đầy':
        return 'bg-red-100 text-red-800';
      case 'Đã kết thúc':
        return 'bg-gray-100 text-gray-800';
      case 'Tạm hoãn':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const slug = schedule?.courseId?.slug;
  const computedSlug = slug || (schedule?.courseId?.title ? schedule.courseId.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : '');

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Course Image */}
      <div className="relative h-48 w-full">
        <Image
          src={toCloudinaryUrl(schedule.courseId?.image)}
          alt={schedule.courseId?.title || 'Khóa học'}
          fill
          className="object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
            {schedule.status}
          </span>
        </div>
        {schedule.discountPrice && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{schedule.discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {schedule.courseId?.title || 'Khóa học'}
        </h3>
        
        {/* Class Name */}
        <h4 className="text-md font-medium text-gray-700 mb-3">
          {schedule.className}
        </h4>

        {/* Schedule Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className="mr-2 text-green-600" />
            <span>Khai giảng: {formatDate(schedule.startDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-2 text-green-600" />
            <span>{schedule.schedule}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-green-600" />
            <span>{schedule.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaUser className="mr-2 text-green-600" />
            <span>{schedule.instructor.name}</span>
          </div>
        </div>

        {/* Time Slots */}
        {schedule.timeSlots && schedule.timeSlots.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Lịch học:</h5>
            <div className="space-y-1">
              {schedule.timeSlots.map((slot, index) => (
                <div key={index} className="flex justify-between text-xs text-gray-600">
                  <span>{slot.dayOfWeek}</span>
                  <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaUsers className="mr-2 text-green-600" />
            <span>{schedule.currentStudents}/{schedule.maxStudents} học viên</span>
          </div>
          <div className="text-sm text-gray-500">
            Còn {schedule.availableSpots} chỗ
          </div>
        </div>

        {/* Price hidden as requested */}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            href={`/khoa-hoc/${computedSlug}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Xem chi tiết
          </Link>
          <button
            onClick={handleOpenPopup}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
      
      {/* Registration Popup */}
      <RegistrationPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
        courseSlug={schedule?.courseId?.slug}
      />
    </div>
  );
};

export default ClassScheduleCard;
