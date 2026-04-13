import React from "react";
import TeacherCard from "./TeacherCard";

const TeachersSection = ({ teachers, title = "Đội ngũ giảng viên", subtitle = "Những chuyên gia hàng đầu trong lĩnh vực MC và truyền thông" }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <section
          className="py-8 px-4 flex flex-col items-center justify-center "
          aria-labelledby="hero-heading"
        >
          {/* Label */}
          <div className="text-green-700 uppercase text-lg md:text-xl font-bold tracking-wider mb-6 bg-slate-100 px-6 py-2 rounded-full shadow-xl">
            {title}
          </div>
        </section>

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
