import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Heart, Sparkles } from 'lucide-react';
import styles from './October20Popup.module.css';
import {
  CAMPAIGN_2010_CONFIG,
  IMAGES_2010_CONFIG,
  CONTENT_2010_CONFIG,
  isCampaignActive,
  CampaignConfig,
  ImagesConfig,
  ContentConfig,
} from './october20Config';

interface October20PopupProps {
  /** Ghi đè cấu hình chiến dịch nếu muốn (optional) */
  campaignConfig?: Partial<CampaignConfig>;
  /** Ghi đè cấu hình hình ảnh nếu muốn (optional) */
  imagesConfig?: Partial<ImagesConfig>;
  /** Ghi đè cấu hình nội dung nếu muốn (optional) */
  contentConfig?: Partial<ContentConfig>;
  /** Callback khi popup được mở */
  onOpen?: () => void;
  /** Callback khi popup được đóng */
  onClose?: () => void;
  /** Ép hiển thị popup để kiểm thử giao diện */
  forceShow?: boolean;
}

export const October20Popup: React.FC<October20PopupProps> = ({
  campaignConfig: customCampaign,
  imagesConfig: customImages,
  contentConfig: customContent,
  onOpen,
  onClose,
  forceShow = false,
}) => {
  const config = { ...CAMPAIGN_2010_CONFIG, ...customCampaign };
  const images = { ...IMAGES_2010_CONFIG, ...customImages };
  const content = { ...CONTENT_2010_CONFIG, ...customContent };

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [countdown, setCountdown] = useState<number>(Math.round(config.autoCloseMs / 1000) || 90);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Hiệu ứng bắn pháo hoa hoa bay tung tóe khi bấm "Gửi ngàn lời chúc"
  const triggerConfetti = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      // @ts-ignore
      const confettiModule = await import('canvas-confetti');
      const confetti: any = confettiModule.default;

      // Tạo các hình dạng hoa thực tế (hoa anh đào, hoa hồng, hoa dâm bụt, trái tim)
      const scalar = 2.4;
      const flower1 = confetti.shapeFromText ? confetti.shapeFromText({ text: '🌸', scalar }) : 'circle';
      const flower2 = confetti.shapeFromText ? confetti.shapeFromText({ text: '🌹', scalar }) : 'circle';
      const flower3 = confetti.shapeFromText ? confetti.shapeFromText({ text: '🌺', scalar }) : 'circle';
      const flower4 = confetti.shapeFromText ? confetti.shapeFromText({ text: '💐', scalar }) : 'circle';
      const heart = confetti.shapeFromText ? confetti.shapeFromText({ text: '❤️', scalar }) : 'circle';

      const flowerShapes = [flower1, flower2, flower3, flower4, heart];
      const festiveColors = ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#d97706', '#ec4899', '#ffffff'];

      // 1. Loạt đạn đầu tiên: Hoa bay tung tóe cực mạnh từ giữa màn hình lên cao
      confetti({
        particleCount: 70,
        spread: 130,
        startVelocity: 55,
        origin: { x: 0.5, y: 0.75 },
        shapes: flowerShapes,
        scalar,
        zIndex: 100005,
      });

      confetti({
        particleCount: 90,
        spread: 110,
        startVelocity: 60,
        origin: { x: 0.5, y: 0.75 },
        colors: festiveColors,
        zIndex: 100005,
      });

      // 2. Chuỗi pháo hoa liên hoàn hai bên và giữa nổ tung trong 2.5 giây
      const duration = 2500;
      const animationEnd = Date.now() + duration;

      const interval: number = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          window.clearInterval(interval);
          return;
        }

        const count = 35 * (timeLeft / duration);

        // Bắn hoa bên trái góc 60 độ bay lên
        confetti({
          particleCount: Math.floor(count * 0.9),
          angle: 60,
          spread: 80,
          startVelocity: 52,
          origin: { x: 0.1, y: 0.8 },
          shapes: flowerShapes,
          scalar,
          zIndex: 100005,
        });

        // Bắn hoa bên phải góc 120 độ bay lên
        confetti({
          particleCount: Math.floor(count * 0.9),
          angle: 120,
          spread: 80,
          startVelocity: 52,
          origin: { x: 0.9, y: 0.8 },
          shapes: flowerShapes,
          scalar,
          zIndex: 100005,
        });

        // Nổ hoa 360 độ pháo hoa trên cao
        confetti({
          particleCount: 25,
          spread: 360,
          startVelocity: 35,
          origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.35 + 0.15 },
          colors: festiveColors,
          zIndex: 100005,
        });
      }, 250);
    } catch (e) {
      console.error('[October20Popup] Confetti error:', e);
    }
  }, []);

  // Đóng popup và ghi nhớ vào storage nếu được cấu hình chỉ hiện lần đầu
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (typeof window !== 'undefined' && config.sessionStorageKey) {
      if (config.onlyFirstVisit || config.oncePerSession) {
        try {
          localStorage.setItem(config.sessionStorageKey, 'true');
          sessionStorage.setItem(config.sessionStorageKey, 'true');
        } catch (err) {
          // Tránh lỗi bảo mật trên một số trình duyệt khi cookie/storage bị chặn
        }
      }
    }
    // Trả lại focus cho phần tử trước đó
    if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
      previousActiveElementRef.current.focus();
    }
    onClose?.();
  }, [config.onlyFirstVisit, config.oncePerSession, config.sessionStorageKey, onClose]);

  // Đếm ngược và tự động đóng popup sau thời gian autoCloseMs (mặc định 90 giây = 90s)
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const initialSeconds = Math.round(config.autoCloseMs / 1000) || 90;
    setCountdown(initialSeconds);

    if (config.autoCloseMs && config.autoCloseMs > 0) {
      const interval = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            window.clearInterval(interval);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => window.clearInterval(interval);
    }
  }, [isOpen, config.autoCloseMs, handleClose]);

  // Kiểm tra điều kiện mở popup sau delay
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Kiểm tra loại trừ trang quản trị
    const currentPath = router?.asPath || router?.pathname || '';
    if (config.excludeRoutes?.some((route) => currentPath.startsWith(route))) {
      return;
    }

    if (forceShow) {
      const timer = window.setTimeout(() => {
        setIsOpen(true);
        onOpen?.();
      }, 500);
      return () => window.clearTimeout(timer);
    }

    // Kiểm tra xem chiến dịch có hợp lệ không (trong vòng 3 ngày: 19/10 đến 21/10)
    if (!isCampaignActive(config)) {
      return;
    }

    // Nếu cấu hình chỉ hiện lần đầu tiên vào web: kiểm tra cả localStorage và sessionStorage
    if (config.onlyFirstVisit || config.oncePerSession) {
      try {
        const shownInLocal = localStorage.getItem(config.sessionStorageKey);
        const shownInSession = sessionStorage.getItem(config.sessionStorageKey);
        if (shownInLocal === 'true' || shownInSession === 'true') {
          return;
        }
      } catch (err) {
        // Bỏ qua lỗi truy cập storage
      }
    }

    // Hẹn giờ tự động hiển thị sau delayMs (mặc định 3 giây = 3s)
    const timer = window.setTimeout(() => {
      // Lưu lại phần tử đang focus trước khi modal mở
      if (document.activeElement instanceof HTMLElement) {
        previousActiveElementRef.current = document.activeElement;
      }
      setIsOpen(true);

      // Đánh dấu đã hiển thị ngay khi mở để tránh mở lại khi người dùng reload hoặc chuyển trang
      if (config.onlyFirstVisit || config.oncePerSession) {
        try {
          localStorage.setItem(config.sessionStorageKey, 'true');
          sessionStorage.setItem(config.sessionStorageKey, 'true');
        } catch (err) {
          // Bỏ qua lỗi storage
        }
      }

      onOpen?.();
    }, config.delayMs);

    return () => window.clearTimeout(timer);
  }, [config, forceShow, onOpen, router]);

  // Quản lý phím Escape, click ra ngoài và focus trap
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    // Focus vào nút đóng khi modal vừa mở
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    // Khóa cuộn trang khi mở popup (cả body và html)
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Chặn triệt để hành động cuộn chuột (wheel) hoặc vuốt chạm (touchmove) bên ngoài thiệp popup
    const preventOutsideScroll = (e: WheelEvent | TouchEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventOutsideScroll, { passive: false });
    window.addEventListener('touchmove', preventOutsideScroll, { passive: false });

    // Bắt phím Escape và Focus Trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Ngăn các phím cuộn trang (PageUp, PageDown, Space, ArrowUp, ArrowDown) tác động ra ngoài
      if (['PageUp', 'PageDown', 'Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
          e.preventDefault();
        }
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('wheel', preventOutsideScroll);
      window.removeEventListener('touchmove', preventOutsideScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Tương tác nút "Gửi yêu thương"
  const handleHeartClick = () => {
    setHasCelebrated(true);
    triggerConfetti();
  };

  // Mảng vị trí ngẫu nhiên cho cánh hoa rơi trang trí
  const petals = [
    { left: '8%', delay: '0s', duration: '8.5s', size: 14 },
    { left: '22%', delay: '2.1s', duration: '9.2s', size: 18 },
    { left: '38%', delay: '4.3s', duration: '8s', size: 12 },
    { left: '55%', delay: '1.2s', duration: '10s', size: 16 },
    { left: '72%', delay: '3.4s', duration: '8.8s', size: 15 },
    { left: '88%', delay: '0.8s', duration: '9.5s', size: 13 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm overflow-hidden overscroll-none"
          onClick={handleClose}
          aria-hidden="false"
        >
          {/* Cánh hoa hồng rơi nhẹ nhàng */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {petals.map((petal, index) => (
              <span
                key={index}
                className={styles.petal}
                style={{
                  left: petal.left,
                  animationDelay: petal.delay,
                  animationDuration: petal.duration,
                  width: `${petal.size}px`,
                  height: `${petal.size}px`,
                }}
              />
            ))}
          </div>

          {/* Hộp thiệp chúc mừng */}
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 14 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className={`relative w-full max-w-6xl max-h-[92vh] sm:max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${styles.cardContainer}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="october20-title"
            aria-describedby="october20-wishes"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng (×) sang trọng ở góc trên bên phải */}
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 p-2.5 sm:p-3 rounded-full bg-white/60 hover:bg-white text-stone-600 hover:text-rose-700 shadow-lg ring-1  transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 "
              type="button"
              aria-label="Đóng thiệp chúc mừng ngày 20/10"
            >
              <X size={22} aria-hidden="true" />
            </button>

            {/* Khung nội dung có thể cuộn linh hoạt trên mobile */}
            <div className={`overflow-y-auto overscroll-contain ${styles.customScrollbar} flex-1`}>
              {/* PHẦN TRÊN: 1 ảnh nền banner duy nhất (không nền xanh) */}
              <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden bg-stone-100">
                <Image
                  src={images.floralBanner}
                  alt="Tập thể cô trò và học viên nữ BT Academy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover object-center"
                  priority
                />
                {/* Lớp chuyển tiếp sắc thái mềm mại vào thân thiệp - nền trắng ấm, không dùng màu xanh */}
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* PHẦN GIỮA VÀ DƯỚI: Typography gọn gàng, trang nhã */}
              <div className="px-5 sm:px-10 md:px-12 pb-6 pt-2 text-center max-w-6xl mx-auto">
                {/* 1. Dòng chữ viết tay "Chúc mừng" */}
                <p className={`${styles.dancingScript} text-2xl sm:text-3xl font-bold text-rose-700 tracking-wide mb-0.5`}>
                  {content.scriptTagline}
                </p>

                {/* 2. Tiêu đề lớn "PHỤ NỮ VIỆT NAM" */}
                <h2
                  id="october20-title"
                  className={`${styles.playfairDisplay} ${styles.textGradientRuby} text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wider uppercase mb-1 drop-shadow-sm`}
                >
                  {content.mainTitle}
                </h2>

                {/* 3. Dòng phụ "20 THÁNG 10" */}
                <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-2.5">
                  <span className="h-[1px] w-6 sm:w-14 bg-gradient-to-r from-transparent to-amber-500/80" aria-hidden="true"></span>
                  <span className="text-amber-700 font-bold text-xs sm:text-sm tracking-[0.22em] uppercase font-serif">
                    ✦ {content.dateSubtitle} ✦
                  </span>
                  <span className="h-[1px] w-6 sm:w-14 bg-gradient-to-l from-transparent to-amber-500/80" aria-hidden="true"></span>
                </div>

                {/* 4. Lời tri ân gửi đến cô Bích Thủy và các học viên */}
                <p className="text-rose-900 font-bold text-sm sm:text-xl mb-2.5 max-w-2xl mx-auto leading-snug">
                  {content.recipientGreeting}
                </p>

                {/* Đường viền trang trí vàng champagne */}
                <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-rose-200 via-amber-400 to-rose-200 mx-auto mb-3 rounded-full" aria-hidden="true"></div>

                {/* 5. Nội dung lời chúc chi tiết - cỡ chữ gọn gàng, thoáng mắt */}
                <div id="october20-wishes" className="text-stone-700 text-xs sm:text-sm md:text-xl leading-relaxed space-y-1 mx-auto text-justify sm:text-center font-normal">
                  {content.wishes.map((paragraph, idx) => (
                    <p key={idx} className="transition-opacity duration-200">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* 6. Phần chữ ký và Logo chính thức của BT Academy */}
                <div className="mt-4 pt-3 border-t border-rose-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    <Image
                      src={images.logo}
                      alt={images.logoAlt}
                      width={120}
                      height={32}
                      className="h-6 sm:h-7 w-auto object-contain opacity-95"
                    />
                  </div>
                  <p className={`${styles.dancingScript} text-lg sm:text-xl md:text-2xl font-bold text-rose-800 tracking-wide`}>
                    {content.signature}
                  </p>
                </div>

                {/* 7. Khu vực nút hành động tương tác */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleHeartClick}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 shadow-md shadow-rose-600/30 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    <Heart size={16} className={`transition-transform ${hasCelebrated ? 'fill-white scale-125' : ''}`} />
                    <span>{hasCelebrated ? 'Bắn thêm pháo hoa chúc mừng 🌸' : 'Gửi ngàn lời chúc yêu thương 🌸'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 ring-1 ring-rose-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <span>Khép lại thiệp ({countdown}s)</span>
                  </button>
                </div>

                <p className="mt-3 text-[11px] text-stone-400">
                  Nhấn <kbd className="px-1.5 py-0.5 text-[10px] bg-stone-100 border border-stone-200 rounded font-mono">Esc</kbd> hoặc nhấn ra ngoài để đóng thiệp
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default October20Popup;
