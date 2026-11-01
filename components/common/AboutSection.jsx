"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, PhoneCall, Mail, Award, Users } from "lucide-react";

const AboutSection = () => {
  const benefits = [
    { title: "Cải thiện giọng nói" },
    { title: "Giải phóng hình thể" },
    { title: "Tự tin trước đám đông" },
    { title: "Xử lý tình huống giao tiếp" },
    { title: "Xây dựng hình ảnh chuyên nghiệp" },
    { title: "Thực hành trước camera" },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ======================================================== */}
          {/* CỘT TRÁI: 2 HÌNH ẢNH HỌC VIÊN + THẺ THỐNG KÊ NỔI        */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 relative">
            {/* Ma trận dấu chấm trang trí phía trên bên trái (Dot Matrix) */}
            <div className="absolute -top-7 -left-7 w-36 h-44 z-0 pointer-events-none opacity-60">
              <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="about-dot-matrix" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2.5" cy="2.5" r="2.5" fill="#22c55e" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#about-dot-matrix)" />
              </svg>
            </div>

            {/* Bố cục 2 ảnh ghép so le (Staggered Image Cards) */}
            <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6 items-center max-w-[540px] mx-auto lg:max-w-none">
              {/* Ảnh 1 - Bên trái */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4] group">
                <Image
                  src="/images/hoc-vien-bt-23.png"
                  alt="Học viên luyện giọng tại BT Academy"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Ảnh 2 - Bên phải (Hơi so le xuống) */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[3/4] mt-6 sm:mt-10 group">
                <Image
                  src="/images/hoc-vien-bt-26.jpg"
                  alt="Học viên thực hành MC tại BT Academy"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CỘT PHẢI: NỘI DUNG VỀ BT ACADEMY & 6 LỢI ÍCH             */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col space-y-6 sm:space-y-7 text-left">
            {/* 1. Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0fdf4] border border-[#dcfce7] text-[#15803d] w-fit">
              <GraduationCap className="w-4 h-4 text-[#22c55e] stroke-[2.2]" />
              <span className="text-xs sm:text-[13px] font-bold tracking-wider uppercase">
                Về Chúng Tôi - BT Academy
              </span>
            </div>

            {/* 2. Main Heading */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] leading-[1.2] tracking-tight">
                BT Academy Sẽ Giúp Bạn Những Gì?
              </h2>
              <p className="text-[#4b5563] text-sm sm:text-base lg:text-lg leading-relaxed max-w-[620px]">
                Với lộ trình thực chiến chuyên sâu cùng đội ngũ giảng viên truyền hình giàu kinh nghiệm, BT Academy đồng hành giúp bạn bứt phá giọng nói và hoàn thiện kỹ năng giao tiếp đỉnh cao.
              </p>
            </div>

            {/* 3. 6 Lợi ích cốt lõi (2 Cột x 3 Dòng) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 pt-1 pb-2">
              {benefits.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#22c55e] flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-[#111827] group-hover:text-[#16a34a] transition-colors">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            {/* 4. Vách ngăn ngang */}
            <div className="w-full h-px bg-gray-100" />

            {/* 5. Khối liên hệ chân mục: Hotline & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Hotline */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#22c55e] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <PhoneCall className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Hotline tư vấn:
                  </span>
                  <a
                    href="tel:0988027494"
                    className="text-base sm:text-lg font-bold text-[#111827] hover:text-[#16a34a] transition-colors leading-none"
                  >
                    0988 02 7494
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#22c55e] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <Mail className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Hỗ trợ & Đăng ký:
                  </span>
                  <a
                    href="mailto:daotaogiongnoi@gmail.com"
                    className="text-sm sm:text-base font-bold text-[#111827] hover:text-[#16a34a] transition-colors leading-none"
                  >
                    daotaogiongnoi@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
