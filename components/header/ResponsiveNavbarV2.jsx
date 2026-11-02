"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineX, HiChevronDown, HiOutlinePhone } from "react-icons/hi";
import { ArrowRight, Search, ExternalLink } from "lucide-react";
import { DEFAULT_NAV_MENU_ITEMS } from "../../data/defaultNavMenuItems";

const ResponsiveNavbarV2 = ({
  isOpen,
  toggleMenu,
  onRegisterClick,
  onOpenSearch,
  menuItems = DEFAULT_NAV_MENU_ITEMS,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Prevent background scrolling without causing page layout shift / jump
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchMove = (e) => {
      const target = e.target;
      if (target && !target.closest?.('[role="dialog"]')) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        toggleMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleMenu]);

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const displayItems = Array.isArray(menuItems) && menuItems.length > 0
    ? menuItems
    : DEFAULT_NAV_MENU_ITEMS;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 w-[85%] max-w-sm h-full bg-white z-[9999] shadow-xl flex flex-col justify-between ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          transform: isOpen ? "translate3d(0, 0, 0)" : "translate3d(-100%, 0, 0)",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" onClick={toggleMenu} className="flex items-center">
            <Image
              src="/logobtacademy.png"
              alt="BT Academy Logo"
              width={110}
              height={40}
              className="object-contain h-9 w-auto"
            />
          </Link>
          <button
            onClick={toggleMenu}
            aria-label="Đóng menu"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {/* Search Trigger */}
          {onOpenSearch && (
            <button
              onClick={() => {
                toggleMenu();
                onOpenSearch();
              }}
              className="w-full mb-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 text-sm border border-gray-200"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>Tìm kiếm khóa học, bài viết...</span>
            </button>
          )}

          {/* Dynamic Menu Items */}
          {displayItems.map((item, index) => {
            const dropdownKey = item._id || item.name || `menu-${index}`;
            const isDropdownOpen = openDropdown === dropdownKey;
            const subItems = Array.isArray(item.dropdownItems)
              ? item.dropdownItems.filter((sub) => sub.isActive !== false)
              : [];

            if (item.hasDropdown && subItems.length > 0) {
              return (
                <div key={dropdownKey} className="border-b border-gray-50 pb-1">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(dropdownKey)}
                    className="w-full flex items-center justify-between py-3 px-3 rounded-lg text-base font-semibold text-gray-900 hover:text-[#22c55e] transition-colors"
                  >
                    <span>{item.name}</span>
                    <HiChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-[#22c55e]" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="pl-4 pr-2 py-1 space-y-1 bg-[#f0fdf4]/50 rounded-xl mb-2">
                      {subItems.map((sub, sIdx) => (
                        <Link
                          key={sub._id || sub.href || sIdx}
                          href={sub.href}
                          onClick={toggleMenu}
                          target={sub.openInNewTab ? "_blank" : undefined}
                          rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                          className={`block py-2 px-3 text-sm rounded-lg transition-colors ${
                            sub.isHighlight
                              ? "font-semibold text-[#16a34a] hover:bg-white"
                              : "text-gray-700 hover:text-[#22c55e] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{sub.name}</span>
                            {sub.openInNewTab && <ExternalLink className="w-3 h-3 text-gray-400" />}
                          </div>
                          {sub.desc && (
                            <p className="text-xs text-gray-500 font-normal mt-0.5 line-clamp-1">
                              {sub.desc}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={dropdownKey}
                href={item.href}
                onClick={toggleMenu}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                className="flex items-center justify-between py-3 px-3 rounded-lg text-base font-semibold text-gray-900 hover:text-[#22c55e] hover:bg-[#f0fdf4] transition-colors"
              >
                <span>{item.name}</span>
                {item.openInNewTab && <ExternalLink className="w-4 h-4 text-gray-400" />}
              </Link>
            );
          })}
        </div>

        {/* Drawer Footer CTA */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
          <button
            onClick={() => {
              toggleMenu();
              if (onRegisterClick) onRegisterClick();
            }}
            className="w-full py-3.5 px-5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors active:scale-[0.98]"
          >
            <span>Đăng ký học thử miễn phí</span>
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#22c55e]">
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </div>
          </button>

          <a
            href="tel:0988027494"
            className="flex items-center justify-center gap-2 text-xs text-gray-600 hover:text-[#16a34a] py-1 font-medium"
          >
            <HiOutlinePhone className="w-4 h-4 text-[#22c55e]" />
            <span>Hotline tư vấn: 0988 02 7494</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default ResponsiveNavbarV2;
