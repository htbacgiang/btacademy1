import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { FaRegUser, FaHeart, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { HiOutlineSearch, HiOutlineHome, HiOutlineBookOpen, HiOutlineDocumentText, HiOutlinePhone, HiOutlineCalendar } from "react-icons/hi";
import logo from "../../public/logobtacademy.png";

const ResponsiveMenu = ({ isOpen, toggleMenu, onRegisterClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems = [
    { name: "Trang chủ", link: "/", icon: HiOutlineHome, hasDropdown: false },
    { name: "Về chúng tôi", link: "#", icon: FaRegUser, hasDropdown: true },
    { name: "Khóa học", link: "/khoa-hoc", icon: HiOutlineBookOpen, hasDropdown: true },
    { name: "Lịch khai giảng", link: "/lich-khai-giang", icon: HiOutlineCalendar, hasDropdown: false },
    { name: "Bài viết", link: "/bai-viet", icon: HiOutlineDocumentText, hasDropdown: false },
    { name: "Liên hệ", link: "/lien-he", icon: HiOutlinePhone, hasDropdown: false },
  ];

  return (
    <>
      {/* Modern Overlay with BT Academy styling */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-green-950/35 via-emerald-950/30 to-green-950/25 backdrop-blur-md z-[99999] transition-all duration-700 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Modern Sidebar Menu with BT Academy design */}
      <div
        className={`fixed top-0 left-0 w-[80%] max-w-md h-full bg-white/95 backdrop-blur-xl shadow-2xl z-[999999] transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-700 ease-out overflow-hidden border-r border-gray-100`}
      >
        {/* BT Academy Header with gradient */}
        <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 p-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gradient-histudy-logo flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">BT</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl">Academy</span>
                <p className="text-white/80 text-xs">Học tập thông minh</p>
              </div>
            </div>
            <button
              onClick={toggleMenu}
              className="p-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 group border border-white/20"
            >
              <AiOutlineClose
                size={20}
                className="text-white group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Modern Search with BT Academy styling */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="w-full px-4 py-4 pl-14 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-lg transition-all duration-300 text-gray-700 placeholder-gray-400"
            />
            <HiOutlineSearch
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <HiOutlineSearch className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Menu Items with BT Academy styling */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-6 py-1">
            {menuItems.map((item, index) => (
              <li key={index} className="group">
                <div className="flex items-center">
                  {item.hasDropdown ? (
                    <button 
                      className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 font-semibold transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg border border-transparent hover:border-emerald-100 flex-1"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mr-4 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">
                        <item.icon 
                          size={20} 
                          className="text-green-700 group-hover:text-white transition-colors duration-300" 
                        />
                      </div>
                      <span className="text-lg uppercase">{item.name}</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                      </div>
                    </button>
                  ) : (
                    <Link 
                      href={item.link} 
                      className="flex items-center px-4 py-2 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 font-semibold transition-all duration-300 group-hover:translate-x-2 group-hover:shadow-lg border border-transparent hover:border-emerald-100 flex-1"
                      onClick={toggleMenu}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mr-4 group-hover:from-green-600 group-hover:to-emerald-600 transition-all duration-300">
                        <item.icon 
                          size={20} 
                          className="text-green-700 group-hover:text-white transition-colors duration-300" 
                        />
                      </div>
                      <span className="text-lg uppercase">{item.name}</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                      </div>
                    </Link>
                  )}
                  
                  {/* Dropdown Toggle Button */}
                  {item.hasDropdown && (
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-2 rounded-xl hover:bg-emerald-50 transition-all duration-300 ml-2 group/btn"
                    >
                      {activeDropdown === index ? (
                        <HiChevronUp className="w-5 h-5 text-gray-600 group-hover/btn:text-emerald-700 transition-colors duration-300" />
                      ) : (
                        <HiChevronDown className="w-5 h-5 text-gray-600 group-hover/btn:text-emerald-700 transition-colors duration-300" />
                      )}
                    </button>
                  )}
                </div>
                
                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="ml-4 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.name === "Về chúng tôi" ? (
                      <>
                        <Link 
                          href="/gioi-thieu-bt-academy" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">Giới thiệu BT Academy</span>
                        </Link>
                        <Link 
                          href="/nha-sang-lap" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">Nhà sáng lập</span>
                        </Link>
                     
                      </>
                    ) : item.name === "Khóa học" ? (
                      <>
                        <Link 
                          href="/khoa-hoc/khoa-hoc-mc-co-ban" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">Làm chủ giọng nói</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/mc-nang-cao" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">MC Nâng cao</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/giao-tiep-thuyet-trinh" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">Giao tiếp & Thuyết trình</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/mc-nhi-co-ban" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">MC Nhí Cơ bản</span>
                        </Link>
                        
                        <Link 
                          href="/khoa-hoc/mc-nhi-nang-cao" 
                          className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-200 group/item"
                          onClick={toggleMenu}
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-3 group-hover/item:scale-125 transition-transform duration-200"></div>
                          <span className="font-bold text-sm uppercase">MC Nhí Nâng cao</span>
                        </Link>
                      </>
                    ) : null}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Modern Social Media & CTA Section */}
        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          {/* Call to Action Button */}
          <div className="mb-6">
            <button 
              onClick={() => {
                onRegisterClick();
                toggleMenu();
              }}
              className="w-full bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 hover:from-green-800 hover:via-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-2xl font-bold text-center block transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Đăng ký ngay
            </button>
          </div>
          
          {/* Social Media Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">
              Theo dõi chúng tôi
            </h3>
            <div className="flex justify-center space-x-4">
              {[
                { icon: FaFacebook, color: "hover:bg-emerald-600", href: "#" },
                { icon: FaTwitter, color: "hover:bg-emerald-600", href: "#" },
                { icon: FaLinkedin, color: "hover:bg-emerald-600", href: "#" },
                { icon: FaInstagram, color: "hover:bg-emerald-600", href: "#" }
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className={`p-3 bg-white rounded-2xl shadow-lg text-gray-600 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-xl hover:text-white border border-gray-100`}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
