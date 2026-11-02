"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlineMenu } from "react-icons/hi";
import { Search, ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import ResponsiveNavbarV2 from "./ResponsiveNavbarV2";
import RegistrationPopup from "../common/RegistrationPopup";
import { DEFAULT_NAV_MENU_ITEMS } from "../../data/defaultNavMenuItems";

const NavbarV2 = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState(DEFAULT_NAV_MENU_ITEMS);

  // Fetch dynamic menu from API with fallback
  useEffect(() => {
    let isMounted = true;
    const fetchNavItems = async () => {
      try {
        const res = await fetch("/api/navbars");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.success && Array.isArray(data.items) && data.items.length > 0) {
            setMenuItems(data.items);
          }
        }
      } catch (err) {
        // Fallback to default items on failure
        console.warn("Could not load dynamic navbars, using default fallback:", err);
      }
    };

    fetchNavItems();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const currentPath = router.pathname || "";

  // Check if current route matches menu or any of its sub-items
  const checkIsItemActive = (item) => {
    if (item.href === "/" && (currentPath === "/" || router.asPath === "/")) {
      return true;
    }

    if (item.href && item.href !== "/" && item.href !== "#" && !item.href.startsWith("/#")) {
      if (currentPath === item.href || currentPath.startsWith(item.href + "/")) {
        return true;
      }
    }

    if (item.hasDropdown && Array.isArray(item.dropdownItems)) {
      return item.dropdownItems.some((sub) => {
        if (!sub.href || sub.href === "#" || sub.href.startsWith("/#")) return false;
        return currentPath === sub.href || currentPath.startsWith(sub.href + "/");
      });
    }

    return false;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-[9990] w-full bg-white transition-all duration-200 ${
          isScrolled ? "border-b border-gray-100 shadow-sm" : ""
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
              {menuItems.map((item, index) => {
                const isActive = checkIsItemActive(item);
                const dropdownKey = item._id || item.name || `menu-${index}`;
                const subItems = Array.isArray(item.dropdownItems)
                  ? item.dropdownItems.filter((sub) => sub.isActive !== false)
                  : [];
                const hasValidDropdown = item.hasDropdown && subItems.length > 0;

                return (
                  <div
                    key={dropdownKey}
                    className="relative group py-6"
                    onMouseEnter={() => {
                      if (hasValidDropdown) setActiveDropdown(dropdownKey);
                    }}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {hasValidDropdown ? (
                      <button
                        type="button"
                        className={`relative flex items-center gap-1 text-[15px] font-semibold transition-colors duration-200 ${
                          isActive ? "text-[#22c55e]" : "text-[#111827] hover:text-[#22c55e]"
                        }`}
                        aria-expanded={activeDropdown === dropdownKey}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === dropdownKey
                              ? "rotate-180 text-[#22c55e]"
                              : "text-gray-400 group-hover:text-[#22c55e]"
                          }`}
                        />
                        {/* Active Indicator Underline */}
                        {isActive && (
                          <span className="absolute -bottom-2 left-0 w-full h-[2.5px] bg-[#22c55e] rounded-full" />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                        className={`relative flex items-center gap-1 text-[15px] font-semibold transition-colors duration-200 ${
                          isActive ? "text-[#22c55e]" : "text-[#111827] hover:text-[#22c55e]"
                        }`}
                      >
                        <span>{item.name}</span>
                        {item.openInNewTab && <ExternalLink className="w-3.5 h-3.5 text-gray-400" />}
                        {/* Active Indicator Underline */}
                        {isActive && (
                          <span className="absolute -bottom-2 left-0 w-full h-[2.5px] bg-[#22c55e] rounded-full" />
                        )}
                      </Link>
                    )}

                    {/* Dropdown Menu */}
                    {hasValidDropdown && activeDropdown === dropdownKey && (
                      <div
                        className="absolute top-full left-0 mt-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-2 z-50 animate-in fade-in duration-150"
                        onMouseEnter={() => setActiveDropdown(dropdownKey)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="space-y-1">
                          {subItems.map((subItem, sIdx) => (
                            <Link
                              key={subItem._id || subItem.href || sIdx}
                              href={subItem.href}
                              target={subItem.openInNewTab ? "_blank" : undefined}
                              rel={subItem.openInNewTab ? "noopener noreferrer" : undefined}
                              className={`block px-4 py-2.5 rounded-xl transition-all duration-150 ${
                                subItem.isHighlight
                                  ? "bg-[#f0fdf4] text-[#15803d] font-semibold text-sm hover:bg-[#dcfce7] mt-1"
                                  : "hover:bg-[#f0fdf4] text-gray-800 hover:text-[#16a34a]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{subItem.name}</span>
                                {subItem.openInNewTab && (
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                              {subItem.desc && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                  {subItem.desc}
                                </p>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
        menuItems={menuItems}
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
