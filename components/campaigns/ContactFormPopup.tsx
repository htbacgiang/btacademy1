"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import {
  isAnyPopupOpen,
  openGlobalPopup,
  closeGlobalPopup,
  hasAnyPopupOpenedThisPageLoad,
  cancelPendingAutoPopups,
} from "../../lib/popup-manager";

export interface ContactFormPopupProps {
  source?: string;
  isModal?: boolean;
  isOpen?: boolean;
  autoCloseSeconds?: number;
  delayMs?: number;
  pauseOnInteraction?: boolean;
  title?: string;
  subtitle?: string;
  forceShow?: boolean;
  courseSlug?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onInteract?: () => void;
  storageKey?: string;
  displayFrequency?: "always" | "once_per_session";
}

let hasDismissedThisPageLoad = false;
let hasOpenedThisPageLoad = false;

if (typeof window !== "undefined") {
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      hasDismissedThisPageLoad = false;
      hasOpenedThisPageLoad = false;
    }
  });
}

export const ContactFormPopup: React.FC<ContactFormPopupProps> = ({
  source = "homepage_popup_modal",
  isModal = true,
  isOpen,
  autoCloseSeconds = 20,
  delayMs = 2000,
  pauseOnInteraction = true,
  title = "Đăng ký tư vấn khóa học BT Academy",
  subtitle = "Nhận ưu đãi 20% học phí, giáo trình độc quyền & tư vấn miễn phí trong 15 phút!",
  forceShow = false,
  courseSlug,
  onOpen,
  onClose,
  onInteract,
  storageKey = "btacademy_contact_popup_dismissed",
  displayFrequency = "always",
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isCurrentlyOpen = typeof isOpen === "boolean" ? isOpen : internalOpen;

  // Phân biệt popup tự động lần đầu vào trang (20s) và popup người dùng tự ấn (không giới hạn thời gian mở)
  const isManual = typeof isOpen === "boolean";
  const effectiveAutoCloseSeconds = isManual
    ? (autoCloseSeconds && autoCloseSeconds !== 20 ? autoCloseSeconds : 0)
    : (autoCloseSeconds ?? 20);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  // Turnstile state & ref
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileError, setTurnstileError] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAFk7BErWJX8MNwUU";

  // Countdown & Interaction state
  const [countdown, setCountdown] = useState<number>(effectiveAutoCloseSeconds);
  const [isInteracted, setIsInteracted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const resetTurnstile = () => {
    setTurnstileToken("");
    try {
      turnstileRef.current?.reset();
    } catch (e) {
      // ignore
    }
  };

  const handleClose = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    hasDismissedThisPageLoad = true;
    setInternalOpen(false);
    closeGlobalPopup(isManual ? "manual_contact_form" : "auto_contact_form");

    if (typeof window !== "undefined" && storageKey && displayFrequency === "once_per_session") {
      try {
        sessionStorage.setItem(storageKey, "true");
      } catch {
        // Ignore storage errors
      }
    }
    onClose?.();
  }, [displayFrequency, storageKey, onClose, isManual]);

  const handleUserInteraction = useCallback(() => {
    onInteract?.();
    if (!pauseOnInteraction) return;
    if (!isInteracted) {
      setIsInteracted(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [pauseOnInteraction, isInteracted, onInteract]);

  // Quản lý popup khi người dùng chủ động bấm mở (controlled mode)
  useEffect(() => {
    if (typeof isOpen === "boolean") {
      if (isOpen) {
        // Khi người dùng bấm mở popup từ nút -> Ngay lập tức hủy mọi popup tự động
        cancelPendingAutoPopups();
        openGlobalPopup("manual_contact_form", { force: true });
        setSubmitted(false);
        setStatus("");
        setCountdown(effectiveAutoCloseSeconds);
        setIsInteracted(false);
        onOpen?.();
      } else {
        closeGlobalPopup("manual_contact_form");
      }
    }
  }, [isOpen, effectiveAutoCloseSeconds, onOpen]);

  // Quản lý popup tự động xuất hiện sau delay (uncontrolled mode)
  useEffect(() => {
    if (!isModal || typeof window === "undefined" || typeof isOpen === "boolean") return;

    if (forceShow) {
      const openTimer = setTimeout(() => {
        if (openGlobalPopup("auto_contact_form", { force: true })) {
          setInternalOpen(true);
          setSubmitted(false);
          setCountdown(effectiveAutoCloseSeconds);
          setIsInteracted(false);
          onOpen?.();
        }
      }, 200);
      return () => clearTimeout(openTimer);
    }

    if (displayFrequency === "once_per_session") {
      try {
        if (sessionStorage.getItem(storageKey) === "true") return;
      } catch {
        // ignore
      }
    }

    // Nếu đã có popup mở hoặc từng có popup mở trên trang này -> HỦY popup tự động
    if (
      hasAnyPopupOpenedThisPageLoad() ||
      isAnyPopupOpen() ||
      hasDismissedThisPageLoad ||
      internalOpen ||
      hasOpenedThisPageLoad
    ) {
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    // Lắng nghe tín hiệu: nếu người dùng bấm mở form từ nút bấm -> Hủy ngay timer đếm ngược
    const handleCancelAuto = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    window.addEventListener("bta:popup:opened", handleCancelAuto);
    window.addEventListener("bta:popup:cancel_auto", handleCancelAuto);

    timer = setTimeout(() => {
      // Trước khi mở, kiểm tra lại nếu có popup nào đang mở
      if (hasAnyPopupOpenedThisPageLoad() || isAnyPopupOpen() || hasDismissedThisPageLoad) {
        return;
      }

      if (openGlobalPopup("auto_contact_form")) {
        setInternalOpen(true);
        hasOpenedThisPageLoad = true;
        setCountdown(effectiveAutoCloseSeconds);
        onOpen?.();
      }
    }, delayMs);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("bta:popup:opened", handleCancelAuto);
      window.removeEventListener("bta:popup:cancel_auto", handleCancelAuto);
    };
  }, [isModal, forceShow, isOpen, displayFrequency, storageKey, internalOpen, effectiveAutoCloseSeconds, delayMs, onOpen]);

  // Countdown timer (Chỉ kích hoạt nếu effectiveAutoCloseSeconds > 0)
  useEffect(() => {
    if (!isCurrentlyOpen || typeof window === "undefined" || effectiveAutoCloseSeconds <= 0) return;
    if (isInteracted && pauseOnInteraction) return;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isCurrentlyOpen, effectiveAutoCloseSeconds, isInteracted, pauseOnInteraction, handleClose]);

  // Trap Escape key & prevent scroll
  useEffect(() => {
    if (!isCurrentlyOpen || typeof window === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCurrentlyOpen, handleClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleUserInteraction();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên của bạn";
    const cleanPhone = formData.phone.trim().replace(/\s/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(cleanPhone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng (10 số)";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email không hợp lệ";
    }

    if (siteKey && !turnstileToken) {
      newErrors.turnstile = "Vui lòng xác minh bảo vệ Cloudflare Turnstile.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUserInteraction();

    if (!validateForm()) return;

    setStatus("Đang gửi...");

    try {
      const fullPurpose = `[Ưu đãi 20% học phí]${courseSlug ? ` [Khóa: ${courseSlug}]` : ""} ${formData.message.trim() || "Đăng ký tư vấn khóa học từ Popup website"
        }`;

      const response = await fetch("/api/course-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim().replace(/\s/g, ""),
          email: formData.email.trim(),
          courseSlug: courseSlug || undefined,
          purpose: fullPurpose,
          source: source || (courseSlug ? `course_${courseSlug}_popup` : "homepage_simple_popup"),
          turnstileToken: turnstileToken,
          "cf-turnstile-response": turnstileToken,
        }),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.data || result._id || !result.message?.includes("thất bại"))) {
        setSubmitted(true);
        setStatus("");
        resetTurnstile();
        setTimeout(() => {
          handleClose();
        }, 3500);
      } else {
        setStatus(`Lỗi: ${result.message || "Không thể gửi yêu cầu"}`);
        resetTurnstile();
      }
    } catch (err: any) {
      setStatus("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
      resetTurnstile();
    }
  };

  const inputBase =
    "w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00502b] focus:ring-1 focus:ring-[#00502b] transition-colors";

  const progressPercent =
    effectiveAutoCloseSeconds > 0
      ? Math.max(0, Math.min(100, (countdown / effectiveAutoCloseSeconds) * 100))
      : 100;

  const formBody = (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.45fr] gap-6 md:gap-8 items-start">
      {/* ── CỘT TRÁI: HÌNH ẢNH GIẢNG VIÊN ĐƠN GIẢN ── */}
      <div className="hidden md:flex flex-col gap-3">
        <div className="relative rounded-xl overflow-hidden aspect-[3/4] border border-gray-200 bg-gray-50">
          <Image
            src="/images/mc-bich-thuy-banner.jpg"
            alt="BTV/MC Lê Bích Thủy"
            fill
            sizes="(max-width: 1100px) 35vw, 380px"
            className="object-cover object-top"
            priority
          />

        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-800">BTV/MC Lê Bích Thủy</p>
          <p className="text-[11px] text-gray-500">Nhà sáng lập & Giảng viên BT Academy</p>
        </div>
      </div>

      {/* ── CỘT PHẢI: FORM ĐIỀN ĐƠN GIẢN ── */}
      <div>
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-[#00502b] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-gray-900">
                Đăng ký nhận ưu đãi thành công!
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Cảm ơn bạn <span className="font-semibold text-gray-800">{formData.name}</span>. BT Academy đã lưu ưu đãi 20% cho số điện thoại <span className="font-semibold text-gray-800">{formData.phone}</span> và sẽ liên hệ hỗ trợ bạn sớm nhất!
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-lg bg-[#00502b] hover:bg-[#003820] text-white text-xs font-medium transition"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            role="form"
            className="flex flex-col gap-3 sm:gap-3.5"
          >
            {/* Hàng 1: Họ và Tên + Điện thoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="name"
                  className="text-xs sm:text-[13px] font-medium text-gray-700"
                >
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleUserInteraction}
                  onClick={handleUserInteraction}
                  placeholder="Nguyễn Văn A"
                  className={`${inputBase} ${errors.name ? "border-red-400" : ""}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="phone"
                  className="text-xs sm:text-[13px] font-medium text-gray-700"
                >
                  Điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={handleUserInteraction}
                  onClick={handleUserInteraction}
                  placeholder="0987 654 321"
                  className={`${inputBase} ${errors.phone ? "border-red-400" : ""}`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Hàng 2: Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-xs sm:text-[13px] font-medium text-gray-700"
              >
                Email (Tùy chọn)
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleUserInteraction}
                onClick={handleUserInteraction}
                placeholder="btacademy@gmail.com"
                className={`${inputBase} ${errors.email ? "border-red-400" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Hàng 3: Lời nhắn */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="message"
                className="text-xs sm:text-[13px] font-medium text-gray-700"
              >
                Lời nhắn
              </label>
              <textarea
                id="message"
                name="message"
                rows={2}
                value={formData.message}
                onChange={handleChange}
                onFocus={handleUserInteraction}
                onClick={handleUserInteraction}
                placeholder="Nhập yêu cầu tư vấn khóa học, mục tiêu học tập..."
                className={`${inputBase} resize-none`}
              />
            </div>

            {/* Thông báo ưu đãi 20% đơn sắc */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-gray-700 flex items-center justify-between gap-2">
              <span className="leading-snug">
                Ưu đãi: <strong>Giảm 20% học phí</strong> & tặng 01 buổi học thử miễn phí khi gửi đăng ký.
              </span>

            </div>

            {/* Cloudflare Turnstile Widget (Giống UniVi) */}
            <div className="flex flex-col gap-1 min-h-[65px] justify-center py-1">
              {siteKey ? (
                <Turnstile
                  ref={turnstileRef}
                  siteKey={siteKey}
                  onSuccess={(token) => {
                    setTurnstileToken(token);
                    setTurnstileError("");
                    if (errors.turnstile) {
                      setErrors((prev) => ({ ...prev, turnstile: "" }));
                    }
                  }}
                  onError={() => {
                    setTurnstileToken("");
                    setTurnstileError("Xác minh thất bại. Vui lòng thử lại.");
                  }}
                  onExpire={() => {
                    setTurnstileToken("");
                  }}
                  options={{
                    theme: "light",
                    size: "normal",
                    language: "vi",
                  }}
                />
              ) : null}

              {errors.turnstile && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.turnstile}
                </p>
              )}
              {turnstileError && !errors.turnstile && (
                <p className="text-xs text-red-500 font-medium">
                  {turnstileError}
                </p>
              )}
            </div>

            {/* Hàng 4: Chú thích & Nút Gửi CTA đơn sắc */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-1 gap-2">
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                * Thông tin bắt buộc
              </span>
              <div className="w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={status === "Đang gửi..." || (Boolean(siteKey) && !turnstileToken)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-gray-800 border-2 border-gray-300 rounded-full px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold cursor-pointer transition-colors hover:border-[#00502b] hover:text-[#00502b] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm group"
                >
                  <span>
                    {status === "Đang gửi..."
                      ? "Đang gửi..."
                      : "Đăng ký nhận ưu đãi 20%"}
                  </span>
                  {status !== "Đang gửi..." && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00502b] text-white flex-shrink-0">
                      <ArrowRight size={13} />
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Thông báo trạng thái / lỗi */}
            {status && status !== "Đang gửi..." && (
              <p
                className={`text-xs font-medium px-3 py-2 rounded border-l-4 flex items-center gap-2 ${status.includes("thành công")
                  ? "bg-green-50 border-green-600 text-green-700"
                  : "bg-red-50 border-red-500 text-red-700"
                  }`}
              >
                <AlertCircle size={14} className="shrink-0" />
                <span>{status}</span>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );

  if (!isCurrentlyOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Tư vấn khóa học BT Academy"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[96vh] sm:max-h-[92vh] flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh đếm ngược tiến trình ở mép trên cùng - Chỉ hiện khi có đếm ngược tự đóng (popup lần đầu) */}
        {effectiveAutoCloseSeconds > 0 && (
          <div className="w-full bg-gray-100 h-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 linear ${isInteracted ? "bg-[#00502b] w-full" : "bg-[#00502b]"
                }`}
              style={{ width: isInteracted ? "100%" : `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Header Modal BT Academy - Màu xanh lá đơn sắc */}
        <div className="relative px-3 sm:px-6 py-3 bg-[#00502b] text-white flex items-center justify-between gap-3 shadow-sm shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Logo BT Academy */}
            <div className="relative hidden md:block w-20 sm:w-24 h-7 sm:h-8 shrink-0">
              <Image
                src="/logobt.png"
                alt="BT Academy"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-white leading-tight truncate sm:whitespace-normal">
                {title}
              </h3>
              <p className="text-xs text-emerald-100 hidden sm:block truncate mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Huy hiệu đếm ngược - Chỉ hiện với popup tự động lần đầu */}
            {effectiveAutoCloseSeconds > 0 && (
              isInteracted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                  <CheckCircle2 size={12} />
                  <span>Đang điền</span>
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white"
                  title="Sẽ tự động đóng sau khi hết đếm ngược nếu chưa điền form"
                >
                  <Clock size={12} />
                  <span>
                    <span className="hidden sm:inline">Tự đóng sau </span>
                    <strong>{countdown}s</strong>
                  </span>
                </span>
              )
            )}

            {/* Nút đóng góc phải */}
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Đóng popup"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Thanh ghi chú nhanh bảo mật & hỗ trợ */}
        <div className="bg-gray-50 px-3 py-1.5 sm:px-4 sm:py-2 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600 gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[#00502b] font-medium truncate">
            <ShieldCheck size={14} className="shrink-0" />
            <span className="truncate">Bảo mật 100% • Ưu đãi 20% học phí • Hotline: 0988 02 7494</span>
          </div>
          {effectiveAutoCloseSeconds > 0 ? (
            isInteracted ? (
              <span className="text-[#00502b] font-medium shrink-0">
                ✓ Đã dừng đếm ngược
              </span>
            ) : (
              <span className="text-gray-400 shrink-0 hidden sm:inline">
                Chạm vào ô nhập để giữ popup
              </span>
            )
          ) : (
            <span className="text-gray-400 shrink-0 hidden sm:inline">
              Hỗ trợ tư vấn 24/7
            </span>
          )}
        </div>

        {/* Thân Form ContactForm */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5 md:p-6 bg-gray-50">
          <div className="bg-white rounded-xl p-3 sm:p-5 md:p-6 border border-gray-200">
            {formBody}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup;
