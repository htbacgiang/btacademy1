"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import VoiceTestPopup from "./VoiceTestPopup";

const HeroBanner = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="relative min-h-screen hero-bg-gradient full-screen-bg overflow-hidden md:py-16 py-10 lg:py-0 lg:flex lg:items-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Background Decorative Elements */}
      <div className="h-[60px] md:h-[80px] lg:hidden"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400/15 to-emerald-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto w-full px-4 sm:px-6 lg:px-8 lg:justify-center grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-8 text-center lg:text-left">
          {/* Main Heading */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-[1.5rem] md:text-3xl font-bold leading-tight">
              <span className="text-green-700 drop-shadow-lg">
                BT Academy
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Đào Tạo MC -{" "}
              </span>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Kỹ Năng Giao Tiếp
              </span>
            </p>
            {/* Course Benefits Card */}
            <div className="bg-white/40 backdrop-blur-md border border-green-200 rounded-3xl p-4 shadow-2xl max-w-full mx-auto lg:mx-0">
              <div className="flex items-center gap-3 mb-3">
               
                <h3 className="text-xl font-bold text-gray-800">
                  BT Academy sẽ giúp bạn những gì?
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-white/80 border border-green-100 rounded-xl p-3 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <span className="text-gray-800 font-semibold text-sm">Cải thiện giọng nói</span>
                </div>
                
                <div className="bg-white/80 border border-green-100 rounded-xl p-3 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <span className="text-gray-800 font-semibold text-sm">Giải phóng hình thể</span>
                </div>
                
                <div className="bg-white/80 border border-green-100 rounded-xl p-3 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <span className="text-gray-800 font-semibold text-sm">Tự tin trước đám đông</span>
                </div>
                
                <div className="bg-white/80 border border-green-100 rounded-xl p-3 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <span className="text-gray-800 font-semibold text-sm">Xử lý tình huống giao tiếp</span>
                </div>
                
                <div className="bg-white/80 border border-green-100 rounded-xl p-3 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <span className="text-gray-800 font-semibold text-sm ">Xây dựng hình ảnh chuyên nghiệp</span>
                </div>
                
                <div className="bg-white/80 border border-green-100 rounded-xl p-3 hover:bg-green-50 transition-all duration-300 shadow-sm hover:shadow-md">
                  <span className="text-gray-800 font-semibold text-sm">Thực hành trước camera</span>
                </div>
              </div>
              
              {/* Contact Card */}
              <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl p-4 sm:p-3 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 mx-2 sm:mx-0">
                <div className="space-y-2">
                  {/* Hotline */}
                  <div className="bg-white/80 rounded-xl p-4 sm:p-3 hover:bg-white transition-all duration-200 border border-green-100">
                    <p className="text-sm sm:text-base text-gray-500 font-medium">Hotline</p>
                    <a href="tel:0988027494" className="text-green-700 font-bold text-base hover:text-green-800 transition-colors">
                      0988 02 7494
                    </a>
                  </div>

                  {/* Addresses */}
                  <div className="bg-white/60 rounded-xl p-4 sm:p-3 hover:bg-white/80 transition-all duration-200 border border-green-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm sm:text-base text-green-700 font-semibold">CS1 - Hà Nội</p>
                        <p className="text-sm text-gray-600 leading-relaxed">19 Nguyễn Gia Thiều, Hoàn Kiếm</p>
                      </div>
                      
                      <div>
                        <p className="text-sm sm:text-base text-emerald-700 font-semibold">CS2 - Thái Nguyên</p>
                        <p className="text-sm text-gray-600 leading-relaxed">Tòa nhà Viettel, Số 4 Hoàng Văn Thụ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

       

          {/* Student Testimonials */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex -space-x-3">
              {students.map((student) => (
                <div key={student.id} className="relative">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-lg"
                  />
                </div>
              ))}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-3 border-white flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base sm:text-sm">+</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-gray-900 font-semibold text-base sm:text-base">Tham gia cùng 500+ Học viên</p>
              <p className="text-gray-600 text-base sm:text-base">Nâng cao kỹ năng giao tiếp mỗi tuần 📈</p>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex grid-cols-2 sm:flex-row gap-3 pt-3">
            <button 
              onClick={handleOpenPopup}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 md:px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl flex-1"
            >
           Test Giọng Ngay
            </button>
            
            <Link href="/khoa-hoc" className="flex-1">
              <button className="w-full bg-white border-2 border-green-200 hover:border-green-300 text-gray-700 hover:text-green-600 px-4 md:px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">
                Tìm hiểu khóa học
              </button>
            </Link>
          </div>

      
        </div>

        {/* Right Content - Images Grid */}
        <div className="relative flex flex-row gap-4 h-auto lg:h-[500px] mt-8 lg:mt-0">
          {/* Left Section - Main Image */}
          <div className="w-1/2 relative">
            <div className="relative rounded-3xl h-[350px] lg:h-full shadow-xl overflow-hidden">
              <Image
                src="/images/mc-bich-thuy.jpg"
                alt="MC Bích Thủy - Giảng viên chuyên nghiệp"
                width={400}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-4 right-4">
                <div className="bg-white/90 rounded-2xl p-3 opacity-80">
                  <p className="text-gray-800 font-bold text-sm">BTV/MC Bích Thủy</p>
                  <p className="text-gray-600 text-xs hidden md:block">Giảng viên chuyên nghiệp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Two Stacked Images */}
          <div className="w-1/2 flex flex-col gap-4">
            {/* Top Right Image */}
            <div className="relative rounded-3xl flex-1 h-[100px] lg:h-auto shadow-lg overflow-hidden">
              <Image
                src="/images/bt-academy.jpg"
                alt="BT Academy - Môi trường học tập"
                width={300}
                height={250}
                className="w-full h-full object-cover"
              />
            
            </div>

            {/* Bottom Right Image */}
            <div className="relative rounded-3xl flex-1 h-[100px] lg:h-auto shadow-lg overflow-hidden">
              <Image
                src="/images/gallery/hoc-vien-bt-06.jpg"
                alt="Học viên BT Academy"
                width={300}
                height={250}
                className="w-full h-full object-cover"
              />
              
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 -left-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-full p-3 shadow-lg animate-bounce">
              <span className="text-white">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-400 rounded-full opacity-60 animate-ping"></div>
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-green-500 rounded-full opacity-60 animate-ping delay-75"></div>
      <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-green-300 rounded-full opacity-60 animate-ping delay-150"></div>
      
      {/* Voice Test Popup */}
      <VoiceTestPopup 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default HeroBanner;
