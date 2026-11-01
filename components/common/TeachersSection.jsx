import React from "react";
import TeacherCard from "./TeacherCard";

const TeachersSection = ({
  teachers,
  badge,
  title = "Đội ngũ giảng viên",
  highlightTitle = "chuyên gia hàng đầu",
  suffixTitle = "của BT Academy",
  subtitle = "Những chuyên gia hàng đầu trong lĩnh vực MC và truyền thông"
}) => {
  return (
    <section id="giang-vien" className="py-8 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-left">
          <div className="flex items-center gap-1.5 text-xl md:text-xl font-semibold tracking-wider text-gray-500 uppercase mb-2">
            <span>{badge || title || "ĐỘI NGŨ GIẢNG VIÊN"}</span>
            <span className="text-gray-400 font-normal text-base leading-none">→</span>
          </div>

        </div>

        {/* Teachers Grid */}
        {teachers && teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <TeacherCard key={teacher.id || index} teacher={teacher} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Đang cập nhật thông tin giảng viên...</p>
          </div>
        )}


      </div>
    </section>
  );
};

export default TeachersSection;
