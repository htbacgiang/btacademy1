"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mic, ArrowRight, Star, GraduationCap, Users, PhoneCall, MapPin } from "lucide-react";
import RegistrationPopup from "./RegistrationPopup";
import VoiceTestPopup from "./VoiceTestPopup";

const HeroBannerV2 = () => {
  const [isVoiceTestOpen, setIsVoiceTestOpen] = useState(false);
  const [popupState, setPopupState] = useState({
    isOpen: false,
    title: "Đăng Ký Học Thử Miễn Phí",
    subtitle: "Trải nghiệm phương pháp đào tạo MC & Giọng nói thực chiến tại BT Academy hoàn toàn miễn phí!",
    source: "hero_cta_trial",
  });

  const handleOpenVoiceTest = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "hero_cta_voice_test_click");
    }
    setIsVoiceTestOpen(true);
  };

  const handleOpenTrialPopup = (source = "hero_cta_trial") => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "hero_cta_trial_click");
    }
    setPopupState({
      isOpen: true,
      title: "Đăng Ký Học Thử Miễn Phí",
      subtitle: "Để lại thông tin, chuyên viên BT Academy sẽ liên hệ tư vấn và xếp lịch học thử phù hợp nhất cho bạn!",
      source,
    });
  };

  const handleOpenConsultPopup = (source = "hero_cta_consult") => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "hero_cta_consult_click");
    }
    setPopupState({
      isOpen: true,
      title: "Nhận Tư Vấn Lộ Trình Đào Tạo",
      subtitle: "Chuyên gia BT Academy sẽ kiểm tra giọng nói và tư vấn lộ trình học tối ưu riêng cho bạn!",
      source,
    });
  };

  const handleClosePopup = () => {
    setPopupState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <section className="relative w-full bg-white overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* ======================================================== */}
          {/* CỘT TRÁI — NỘI DUNG (Mobile: Hiển thị trước)             */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start space-y-6 sm:space-y-7 text-left">
            {/* 1. Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0fdf4] border border-[#dcfce7] text-[#15803d]"
            >
              <Mic className="w-4 h-4 text-[#22c55e] stroke-[2.2]" />
              <span className="text-xs sm:text-[13px] font-bold tracking-wider uppercase">
                Học viện Đào tạo MC Chuyên nghiệp
              </span>
            </motion.div>

            {/* 2. Heading H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-bold text-[#111827] leading-[1.12] tracking-tight"
            >
              <span>Làm Chủ Giọng Nói,</span>
              <br />
              <span>Tự Tin </span>
              <span className="relative inline-block text-[#22c55e]">
                Tỏa Sáng
                {/* Green Artistic Swoosh Underline with Left-to-Right Draw Animation */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#22c55e] overflow-visible pointer-events-none"
                  viewBox="0 0 250 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 4 14 C 65 4, 165 4, 246 11"
                    stroke="#22c55e"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      pathLength: { duration: 0.9, delay: 0.35, ease: [0.65, 0, 0.35, 1] },
                      opacity: { duration: 0.15, delay: 0.35 },
                    }}
                  />
                  {/* Subtle dynamic secondary taper */}
                  <motion.path
                    d="M 40 17 C 110 9, 190 9, 235 14"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{
                      pathLength: { duration: 0.7, delay: 0.55, ease: [0.65, 0, 0.35, 1] },
                      opacity: { duration: 0.2, delay: 0.55 },
                    }}
                  />
                </svg>
              </span>
            </motion.h1>

            {/* 3. Mô tả */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#4b5563] text-base sm:text-lg lg:text-[19px] leading-relaxed max-w-[620px]"
            >
              Đào tạo MC, luyện giọng nói, thuyết trình và kỹ năng giao tiếp cho trẻ em, học sinh, sinh viên và người đi làm tại Hà Nội và Thái Nguyên
            </motion.p>

            {/* 4. Thông tin liên hệ: Hotline & Cơ sở đào tạo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-[620px] rounded-2xl bg-[#f9fafb] border border-[#e5e7eb] p-3.5 sm:p-4"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Hotline */}
                <div className="flex items-center gap-3 md:min-w-[190px]">
                  <div className="w-10 h-10 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center text-[#22c55e] flex-shrink-0">
                    <PhoneCall className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Hotline
                    </span>
                    <a
                      href="tel:0988027494"
                      className="text-base sm:text-lg font-bold text-[#15803d] hover:text-[#16a34a] transition-colors leading-none"
                    >
                      0988 02 7494
                    </a>
                  </div>
                </div>

                {/* Đường kẻ ngăn cách */}
                <div className="hidden md:block w-px h-10 bg-[#e5e7eb]" />

                {/* 2 Cơ sở đào tạo - Mỗi cơ sở 1 dòng */}
                <div className="flex-1 flex flex-col gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {/* Dòng 1: CS1 - Hà Nội */}
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-[#22c55e] flex-shrink-0 stroke-[2.2]" />
                    <span className="font-bold text-[#111827] flex-shrink-0">
                      CS1 - Hà Nội:
                    </span>
                    <span className="text-[#4b5563]">
                      19 Nguyễn Gia Thiều, Hoàn Kiếm
                    </span>
                  </div>

                  {/* Dòng 2: CS2 - Thái Nguyên */}
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-4 h-4 text-[#22c55e] flex-shrink-0 stroke-[2.2]" />
                    <span className="font-bold text-[#111827] flex-shrink-0">
                      CS2 - Thái Nguyên:
                    </span>
                    <span className="text-[#4b5563]">
                      Tòa nhà Viettel, Số 4 Hoàng Văn Thụ
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 5. CTA Buttons - Cùng 1 dòng trên cả mobile & desktop */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full sm:w-auto flex flex-row items-center gap-2.5 sm:gap-3.5 pt-2"
            >
              {/* Nút chính */}
              <button
                type="button"
                onClick={() => handleOpenTrialPopup("hero_cta_trial")}
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs sm:text-base px-3.5 sm:px-7 py-3 sm:py-3.5 rounded-full transition-all duration-200 shadow-sm active:scale-[0.98] whitespace-nowrap"
              >
                <span>Đăng ký ngay</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center text-[#22c55e] flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>
              </button>

              {/* Nút Test giọng ngay */}
              <button
                type="button"
                onClick={handleOpenVoiceTest}
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-3 bg-white hover:bg-[#f0fdf4] text-[#16a34a] border border-[#22c55e] font-bold text-xs sm:text-base px-3.5 sm:px-7 py-3 sm:py-3.5 rounded-full transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
              >
                <span>Test giọng ngay</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#22c55e] flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
                  <Mic className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>
              </button>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* CỘT PHẢI — CÁC LAYER HÌNH ẢNH & THẺ THỐNG KÊ CHUYỂN ĐỘNG */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center relative mt-4 lg:mt-0 select-none">
            <div className="relative w-full max-w-[580px] lg:max-w-none flex justify-center">
              {/* LAYER 1: ẢNH NỀN VÒNG TRÒN VÀ NHÂN VẬT ĐÃ TÁCH KHỎI THẺ */}
              <div className="relative w-full">
                {/* Ma trận dấu chấm trang trí phía sau bên trái (Left Dot Matrix) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 0.85, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 w-36 h-48 sm:w-44 sm:h-56 z-0 pointer-events-none"
                >
                  <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="dot-matrix-v2-left" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#22c55e" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dot-matrix-v2-left)" />
                  </svg>
                </motion.div>

                {/* Ma trận dấu chấm trang trí phía sau bên phải (Right Dot Matrix) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.75, 0.4] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/4 -right-4 sm:-right-8 w-28 h-40 z-0 pointer-events-none"
                >
                  <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="dot-matrix-v2-right" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#22c55e" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dot-matrix-v2-right)" />
                  </svg>
                </motion.div>

                <Image
                  src="/images/banner-bt.webp"
                  alt="BT Academy - Đội ngũ giảng viên và học viên MC chuyên nghiệp"
                  width={1128}
                  height={888}
                  priority
                  className="w-full h-auto object-contain max-h-[460px] sm:max-h-[520px] lg:max-h-[560px] select-none pointer-events-none relative z-10"
                />

                {/* LAYER 2: CÁC THẺ THỐNG KÊ NỔI (BUTTONS/CARDS) VỚI HIỆU ỨNG CHUYỂN ĐỘNG */}
                {/* ---------------------------------------------------- */}
                {/* THẺ 1 (Góc trên trái: 10+ năm kinh nghiệm)            */}
                {/* ---------------------------------------------------- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: [0, -9, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.4 },
                    y: {
                      duration: 4.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenVoiceTest}
                  role="button"
                  tabIndex={0}
                  aria-label="10+ năm kinh nghiệm đào tạo - Test giọng ngay"
                  className="absolute top-[8%] left-[2%] sm:left-[4%] z-20 cursor-pointer bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl shadow-gray-200/80 border border-gray-100 p-2 sm:p-2.5 md:p-3 flex items-center gap-2 sm:gap-3 transition-shadow duration-200 scale-90 sm:scale-95 md:scale-100 origin-top-left"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-[2.2]" />
                  </div>
                  <div className="text-left leading-tight pr-1">
                    <div className="text-xs sm:text-sm md:text-base font-bold text-[#111827]">
                      10+ năm
                    </div>
                    <div className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium">
                      Kinh nghiệm đào tạo
                    </div>
                  </div>
                </motion.div>

                {/* ---------------------------------------------------- */}
                {/* THẺ 2 (Desktop: Góc trên phải | Mobile: Góc dưới trái) */}
                {/* ---------------------------------------------------- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: [0, 9, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.6 },
                    y: {
                      duration: 4.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    },
                  }}
                  whileHover={{ scale: 1.05, y: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenTrialPopup("hero_stat_1000students")}
                  role="button"
                  tabIndex={0}
                  aria-label="1000+ Học viên đã tham gia"
                  className="absolute bottom-[16%] left-[2%] right-auto top-auto sm:top-[6%] sm:right-[3%] sm:bottom-auto sm:left-auto z-20 cursor-pointer bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl shadow-gray-200/80 border border-gray-100 p-2 sm:p-2.5 md:p-3 flex items-center gap-2 sm:gap-3 transition-shadow duration-200 scale-90 sm:scale-95 md:scale-100 origin-bottom-left sm:origin-top-right"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 stroke-[2.2]" />
                  </div>
                  <div className="text-left leading-tight pr-1">
                    <div className="text-xs sm:text-sm md:text-base font-bold text-[#111827]">
                      1000+
                    </div>
                    <div className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium">
                      Học viên đã tham gia
                    </div>
                  </div>
                </motion.div>

                {/* ---------------------------------------------------- */}
                {/* THẺ 3 (Góc dưới phải: 98% học viên hài lòng)          */}
                {/* ---------------------------------------------------- */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: [0, -7, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.8 },
                    y: {
                      duration: 4.0,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    },
                  }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenTrialPopup("hero_stat_98satisfied")}
                  role="button"
                  tabIndex={0}
                  aria-label="98% Học viên hài lòng"
                  className="absolute bottom-[20%] sm:bottom-[22%] right-[2%] sm:right-[4%] z-20 cursor-pointer bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl shadow-gray-200/80 border border-gray-100 p-2 sm:p-2.5 md:p-3 flex items-center gap-2 sm:gap-3 transition-shadow duration-200 scale-90 sm:scale-95 md:scale-100 origin-bottom-right"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-white stroke-none" />
                  </div>
                  <div className="text-left leading-tight pr-1">
                    <div className="text-xs sm:text-sm md:text-base font-bold text-[#111827]">
                      98%
                    </div>
                    <div className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 font-medium">
                      Học viên hài lòng
                    </div>
                  </div>
                </motion.div>

                {/* LAYER 3: CÁC CHI TIẾT TRANG TRÍ CHUYỂN ĐỘNG NHẸ (FLOATING ACCENTS) */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/3 left-2 w-3 h-3 rounded-full bg-[#22c55e] pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-[#16a34a]/60 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Popup Modal */}
      <RegistrationPopup
        isOpen={popupState.isOpen}
        onClose={handleClosePopup}
        source={popupState.source}
        title={popupState.title}
        subtitle={popupState.subtitle}
      />

      {/* Voice Test Popup Modal */}
      <VoiceTestPopup
        isOpen={isVoiceTestOpen}
        onClose={() => setIsVoiceTestOpen(false)}
      />
    </section>
  );
};

export default HeroBannerV2;
