"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlineMenu } from "react-icons/hi";
import { Search, ArrowRight, ChevronDown, X } from "lucide-react";
import ResponsiveNavbarV2 from "./ResponsiveNavbarV2";
import RegistrationPopup from "../common/RegistrationPopup";

const NavbarV2 = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenPopup = () => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "navbar_cta_click");
    }
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleToggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);
    if (nextState && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "mobile_menu_open");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/bai-viet?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentPath = router.pathname;

  const isCourseActive = currentPath.startsWith("/khoa-hoc");
  const isBlogActive = currentPath.startsWith("/bai-viet") || currentPath.startsWith("/video-hoc-vien");
  const isAboutActive = currentPath === "/gioi-thieu" || currentPath === "/nha-sang-lap";

  const navigationItems = [
    {
      name: "Trang chủ",
      href: "/",
      isActive: currentPath === "/",
      hasDropdown: false,
    },
    {
      name: "Khóa học",
      href: "/khoa-hoc",
      isActive: isCourseActive,
      hasDropdown: true,
      dropdownItems: [
        { name: "Làm chủ giọng nói (Cơ bản)", href: "/khoa-hoc/khoa-hoc-mc-co-ban", desc: "Sửa ngọng, luyện hơi, phát âm chuẩn" },
        { name: "MC Nâng cao", href: "/khoa-hoc/mc-nang-cao", desc: "Kỹ năng sân khấu, xử lý tình huống" },
        { name: "Giao tiếp & Thuyết trình", href: "/khoa-hoc/giao-tiep-thuyet-trinh", desc: "Tự tin đàm phán, trình bày trước đám đông" },
        { name: "MC Nhí Cơ bản", href: "/khoa-hoc/mc-nhi-co-ban", desc: "Ươm mầm tài năng, rèn luyện sự tự tin" },
        { name: "MC Nhí Nâng cao", href: "/khoa-hoc/mc-nhi-nang-cao", desc: "Kỹ năng chuyên sâu cho bé tỏa sáng" },
        { name: "Xem tất cả khóa học →", href: "/khoa-hoc", isHighlight: true },
      ],
    },
    {
      name: "Giảng viên",
      href: "/#giang-vien",
      isActive: false,
      hasDropdown: false,
    },
    {
      name: "Lịch khai giảng",
      href: "/lich-khai-giang",
      isActive: currentPath === "/lich-khai-giang",
      hasDropdown: false,
    },
    {
      name: "Blog",
      href: "/bai-viet",
      isActive: isBlogActive,
      hasDropdown: true,
      dropdownItems: [
        { name: "Bài viết & Tin tức", href: "/bai-viet", desc: "Kiến thức MC, luyện giọng và kỹ năng mềm" },
        { name: "Video học viên", href: "/video-hoc-vien", desc: "Xem quá trình lột xác và thực hành của học viên" },
      ],
    },
    {
      name: "Giới thiệu",
      href: "/gioi-thieu",
      isActive: isAboutActive,
      hasDropdown: true,
      dropdownItems: [
        { name: "Giới thiệu BT Academy", href: "/gioi-thieu", desc: "Tầm nhìn, sứ mệnh và phương pháp đào tạo" },
        { name: "Nhà sáng lập", href: "/nha-sang-lap", desc: "BTV/MC Bích Thủy và ban cố vấn chuyên môn" },
      ],
    },
    {
      name: "Liên hệ",
      href: "/lien-he",
      isActive: currentPath === "/lien-he",
      hasDropdown: false,
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-[9990] w-full bg-white transition-all duration-200 ${isScrolled ? "border-b border-gray-100 shadow-sm" : ""
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[76px]">
            {/* 1. Left — Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/logobtacademy.png"
                  alt="BT Academy - Học viện Đào tạo MC & Giọng nói"
                  width={140}
                  height={50}
                  priority
                  className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            {/* 2. Center — Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center space-x-7" aria-label="Main Navigation">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group py-6"
                  onMouseEnter={() => {
                    if (item.hasDropdown) setActiveDropdown(item.name);
                  }}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.hasDropdown ? (
                    <button
                      type="button"
                      className={`relative flex items-center gap-1 text-[15px] font-semibold transition-colors duration-200 ${item.isActive ? "text-[#22c55e]" : "text-[#111827] hover:text-[#22c55e]"
                        }`}
                      aria-expanded={activeDropdown === item.name}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.name ? "rotate-180 text-[#22c55e]" : "text-gray-400 group-hover:text-[#22c55e]"
                          }`}
                      />
                      {/* Active Indicator Underline */}
                      {item.isActive && (
                        <span className="absolute -bottom-2 left-0 w-full h-[2.5px] bg-[#22c55e] rounded-full" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative flex items-center text-[15px] font-semibold transition-colors duration-200 ${item.isActive ? "text-[#22c55e]" : "text-[#111827] hover:text-[#22c55e]"
                        }`}
                    >
                      <span>{item.name}</span>
                      {/* Active Indicator Underline */}
                      {item.isActive && (
                        <span className="absolute -bottom-2 left-0 w-full h-[2.5px] bg-[#22c55e] rounded-full" />
                      )}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 mt-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-2 z-50 animate-in fade-in duration-150"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="space-y-1">
                        {item.dropdownItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block px-4 py-2.5 rounded-xl transition-all duration-150 ${subItem.isHighlight
                              ? "bg-[#f0fdf4] text-[#15803d] font-semibold text-sm hover:bg-[#dcfce7] mt-1"
                              : "hover:bg-[#f0fdf4] text-gray-800 hover:text-[#16a34a]"
                              }`}
                          >
                            <div className="text-sm font-semibold">{subItem.name}</div>
                            {subItem.desc && (
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{subItem.desc}</p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* 3. Right — Action Area */}
            <div className="flex items-center gap-3">

              {/* Main Desktop CTA Button */}
              <button
                type="button"
                onClick={handleOpenPopup}
                className="hidden sm:inline-flex items-center gap-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-sm active:scale-[0.98]"
              >
                <span>Đăng ký học thử</span>
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#22c55e]">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={handleToggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:text-[#22c55e] hover:bg-[#f0fdf4] transition-colors focus:outline-none"
              >
                <HiOutlineMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive Mobile Drawer */}
      <ResponsiveNavbarV2
        isOpen={isMobileMenuOpen}
        toggleMenu={handleToggleMobileMenu}
        onRegisterClick={handleOpenPopup}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Course Registration Popup */}
      <RegistrationPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        source="navbar_cta"
        title="Đăng Ký Học Thử Miễn Phí"
        subtitle="Để lại thông tin, chuyên viên BT Academy sẽ liên hệ tư vấn và xếp lịch học thử phù hợp nhất cho bạn!"
      />
    </>
  );
};

export default NavbarV2;

