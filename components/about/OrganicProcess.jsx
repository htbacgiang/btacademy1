"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import VoiceTestPopup from "../common/VoiceTestPopup";

const OrganicProcess = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const containerRef = useRef(null);

  const steps = [
    {
      step: 1,
      label: "BƯỚC 1",
      title: "Mở form đăng ký",
      desc: "Chuyên viên tư vấn sẽ liên lạc với bạn ngay lập tức để hỗ trợ đăng ký test giọng.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
    },
    {
      step: 2,
      label: "BƯỚC 2",
      title: "Nhận bài test",
      desc: "Bài test giọng ĐỘC QUYỀN để chúng tôi phân tích giọng nói của bạn một cách chuyên nghiệp.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      step: 3,
      label: "BƯỚC 3",
      title: "Ghi âm và gửi lại",
      desc: "Chọn nơi yên tĩnh để ghi âm hoặc quay video và gửi lại cho tư vấn viên để đánh giá.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      step: 4,
      label: "BƯỚC 4",
      title: "Đánh giá và tư vấn",
      desc: "Giáo viên, Chuyên gia sẽ Phân tích, Đánh giá và Đưa ra lộ trình phát triển giọng nói cho riêng bạn.",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
  ];

  const containerInView = useInView(containerRef, { once: true, amount: 0.2 });

  const stepVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section ref={containerRef} className="relative py-8 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-1.5 text-xl md:text-xl font-semibold tracking-wider text-gray-500 uppercase mb-1">
            <span>QUY TRÌNH TEST GIỌNG MIỄN PHÍ</span>
            <span className="text-gray-400 font-normal text-base leading-none">→</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-gray-600 text-sm md:text-base mt-2 max-w-4xl">
                Quy trình 4 bước khoa học giúp phát hiện khuyết điểm và xây dựng lộ trình cải thiện giọng nói hiệu quả cho riêng bạn.
              </p>
            </div>

          </div>
        </div>

        {/* Mobile View: 2 columns */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:hidden">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              className="w-full text-center py-5 px-3 bg-white/70 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center"
              custom={index}
              initial="hidden"
              animate={containerInView ? "visible" : "hidden"}
              variants={stepVariants}
            >
              <div className="mb-3.5 flex justify-center">
                <div className="w-13 h-13 p-3 rounded-2xl bg-green-50 text-green-700 border border-green-100/80 flex items-center justify-center shadow-xs">
                  {item.icon}
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5 text-green-700">
                {item.label}
              </p>
              <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Desktop View: Horizontal Flex with Arrows */}
        <div className="hidden md:flex items-stretch justify-center gap-3 lg:gap-6">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              className="flex flex-row items-center flex-1"
              custom={index}
              initial="hidden"
              animate={containerInView ? "visible" : "hidden"}
              variants={stepVariants}
            >
              <div className="flex-1 w-full text-center py-6 px-4 rounded-2xl bg-white hover:bg-green-50/40 transition-colors duration-300 border border-transparent hover:border-green-100/70">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-700 border border-green-100 flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105">
                    {item.icon}
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-700">
                  {item.label}
                </p>
                <h3 className="text-base lg:text-lg font-bold text-gray-900 leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Arrow Connector between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex items-center justify-center flex-shrink-0 px-1 lg:px-2 text-green-600"
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: containerInView ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: (index + 0.5) * 0.12 }}
                >
                  <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="text-center mt-12 md:mt-16">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsPopupOpen(true);
              }}
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
            >
              <span>Đăng ký test giọng ngay</span>
            </button>
          </div>
        </div>

        {/* Voice Test Popup Modal */}
        <VoiceTestPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </div>
    </section>
  );
};

export default OrganicProcess;
