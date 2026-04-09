"use client";

import { useState, useEffect, useRef } from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import ContactForm from "../header/BTContactForm";

export default function CTABannerSection() {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);
  const prevFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    const focusables = modal?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];

    const onEscape = (e) => e.key === "Escape" && setOpen(false);
    const onTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) e.preventDefault(), last?.focus();
      else if (!e.shiftKey && document.activeElement === last) e.preventDefault(), first?.focus();
    };

    prevFocusRef.current = document.activeElement;
    if (first && typeof first.focus === "function") {
      try {
        first.focus({ preventScroll: true });
      } catch {
        first.focus();
      }
    }
    window.addEventListener("keydown", onEscape);
    modal?.addEventListener("keydown", onTab);
    return () => {
      window.removeEventListener("keydown", onEscape);
      modal?.removeEventListener("keydown", onTab);
    };
  }, [open]);

  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "contain";
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "contain";
      document.body.style.touchAction = "none";
    } else {
      html.style.overflow = "";
      html.style.overscrollBehavior = "";
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.touchAction = "";
      const prev = prevFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        try {
          prev.focus({ preventScroll: true });
        } catch {
          prev.focus();
        }
      }
    }
  }, [open]);

  return (
    <section
      className="relative min-h-[30vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat py-6 md:py-12"
      style={{
        backgroundImage: "url('/images/hoc-vien-bt-19.jpg')",
        backgroundAttachment: "fixed",
      }}
      aria-label="Kêu gọi hành động - Đặt lịch tư vấn"
    >
      {/* Overlay để chữ trắng dễ đọc */}
      <div className="absolute inset-0 z-[1] bg-black/60 md:bg-black/50" aria-hidden />

      {/* Nội dung */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Trái: Tiêu đề + mô tả */}
          <div className="lg:col-span-7">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
              Chinh phục kỹ năng dẫn chương trình cùng <span className="text-green-400">BT Academy!</span>
            </h2>
            <p className="text-gray-200 text-base md:text-base leading-relaxed max-w-2xl mb-8">
              Khám phá tiềm năng giọng nói và bản lĩnh sân khấu cùng đội ngũ chuyên gia hàng đầu. BT Academy đồng hành cùng bạn trên con đường trở thành MC chuyên nghiệp và tự tin tỏa sáng.
            </p>
            <div className="flex flex-wrap gap-6 md:gap-10">
              <a
                href="tel:0988027494"
                className="flex items-center gap-4 group"
              >
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white group-hover:bg-green-700 transition-colors shadow-lg">
                  <FaPhone className="w-5 h-5" />
                </span>
                <span className="block">
                  <span className="block text-white font-bold text-lg">0988 027 494</span>
                  <span className="block text-gray-300 text-sm">Hotline tư vấn</span>
                </span>
              </a>
              <a
                href="mailto:lienhe@btacademy.com.vn"
                className="flex items-center gap-4 group"
              >
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white group-hover:bg-green-700 transition-colors shadow-lg">
                  <FaEnvelope className="w-5 h-5" />
                </span>
                <span className="block">
                  <span className="block text-white font-bold text-lg">lienhe@btacademy.com.vn</span>
                  <span className="block text-gray-300 text-sm">Liên hệ email</span>
                </span>
              </a>
            </div>
          </div>

          {/* Phải: Nút CTA */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 w-full max-w-md">
              <h3 className="text-white text-xl font-bold mb-6 text-center lg:text-left">Bạn đã sẵn sàng để thay đổi?</h3>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full px-8 py-4 bg-green-600 text-white font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-green-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-green-900/20"
                aria-haspopup="dialog"
                aria-expanded={open}
              >
                Đăng ký tư vấn ngay
              </button>
              <p className="text-gray-300 text-sm mt-6 text-center lg:text-left">
                * Nhận ngay bộ tài liệu luyện giọng miễn phí khi đăng ký tư vấn hôm nay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          >
            <div className="sticky top-0 z-50 flex justify-end p-4 bg-white/95 backdrop-blur border-b">
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white transition-all focus:outline-none"
                onClick={() => setOpen(false)}
                aria-label="Đóng popup"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 md:p-8">
              
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
