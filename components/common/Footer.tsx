import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaClock,
  FaAward,
  FaArrowRight
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Giới thiệu", href: "/gioi-thieu" },
      { name: "Lịch khai giảng", href: "/lich-khai-giang" },
      { name: "Đội ngũ giảng viên", href: "/nha-sang-lap" },
      { name: "Tin tức & Sự kiện", href: "/bai-viet" }
    ],
    courses: [
      { name: "Đào tạo MC Nhí", href: "/khoa-hoc/mc-nhi" },
      { name: "Khóa học MC Cơ bản", href: "/khoa-hoc/mc-co-ban" },
      { name: "MC Nâng cao", href: "/khoa-hoc/mc-nang-cao" },
      { name: "Kỹ năng Thuyết trình", href: "/khoa-hoc/giao-tiep-thuyet-trinh" }
    ],
    support: [
      { name: "Liên hệ", href: "/lien-he" },
      { name: "Quy định học phí", href: "/chinh-sach-khoa-hoc-hoc-phi" },
      { name: "Điều khoản khóa học", href: "/dieu-khoan-khoa-hoc" },

    ]
  };

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: FaFacebookF, 
      href: "https://www.facebook.com/profile.php?id=61564432965502",
      color: "hover:bg-blue-600"
    },
    { 
      name: "Zalo", 
      icon: SiZalo, 
      href: "https://zalo.me/0988027494",
      color: "hover:bg-blue-500"
    },
    { 
      name: "Instagram", 
      icon: FaInstagram, 
      href: "https://www.instagram.com/daotaomc",
      color: "hover:bg-pink-600"
    },
    { 
      name: "YouTube", 
      icon: FaYoutube, 
      href: "https://www.youtube.com/@BíchThủy-h2r",
      color: "hover:bg-red-600"
    },
  ];

  return (
    <footer className="bg-black/90 text-white relative overflow-hidden mt-10">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/mc-co-ban-thai-nguyen.jpg"
          alt="Footer background"
          fill
          className="object-cover opacity-30"
          priority={false}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/80"></div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-white/35 rounded-full animate-pulse delay-3000"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="mb-2 group">
                  <Link href="/" className="inline-block">
                    <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                      <div className="w-20 h-20  p-2">
                        <Image
                          src="/logobt.png"
                          alt="BT Academy Logo"
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-2xl font-bold group-hover:text-green-400 transition-colors duration-300">BT Academy</div>
                        <div className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Khai phóng giọng nói</div>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  BT Academy là trung tâm đào tạo MC chuyên nghiệp, giúp học viên phát triển kỹ năng giao tiếp, tự tin và bản lĩnh sân khấu để tự tin tỏa sáng.
                </p>

                {/* Awards & Certifications */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <FaAward className="text-green-500" />
                    <span className="text-sm text-gray-300">Đơn vị đào tạo MC uy tín hàng đầu</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaAward className="text-green-500" />
                    <span className="text-sm text-gray-300">Hàng nghìn học viên đã tốt nghiệp</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {/* Company */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-white hover:text-green-400 transition-colors duration-300 border-b border-gray-800 pb-2">Thông tin</p>
                    <ul className="space-y-3">
                      {footerLinks.company.map((link, index) => (
                        <li key={index}>
                          <Link 
                            href={link.href}
                            className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center group"
                          >
                            <FaArrowRight className="w-2 h-2 mr-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Courses */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-white hover:text-green-400 transition-colors duration-300 border-b border-gray-800 pb-2">Khóa học</p>
                    <ul className="space-y-3">
                      {footerLinks.courses.map((link, index) => (
                        <li key={index}>
                          <Link 
                            href={link.href}
                            className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center group"
                          >
                            <FaArrowRight className="w-2 h-2 mr-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-white hover:text-green-400 transition-colors duration-300 border-b border-gray-800 pb-2">Hỗ trợ</p>
                    <ul className="space-y-3">
                      {footerLinks.support.map((link, index) => (
                        <li key={index}>
                          <Link 
                            href={link.href}
                            className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center group"
                          >
                            <FaArrowRight className="w-2 h-2 mr-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-1">
                <p className="text-lg font-bold mb-6 text-white hover:text-green-400 transition-colors duration-300 border-b border-gray-800 pb-2">Liên hệ</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-gray-100 font-semibold mb-1">CS1 - Hà Nội:</p>
                      <p className="text-gray-300">19 Nguyễn Gia Thiều, Hoàn Kiếm</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-gray-100 font-semibold mb-1">CS2 - Thái Nguyên:</p>
                      <p className="text-gray-300">Tòa nhà Viettel, 4 Hoàng Văn Thụ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-green-500 flex-shrink-0" />
                    <div>
                      <a 
                        href="tel:0988027494" 
                        className="text-gray-300 hover:text-green-400 transition-colors"
                      >
                        0988 02 7494
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-green-500 flex-shrink-0" />
                    <div>
                      <a 
                        href="mailto:contact@btacademy.com.vn" 
                        className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                      >
                        contact@btacademy.com.vn
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaClock className="text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm">
                        T2-T7: 8:00 - 20:00<br />
                        CN: 9:00 - 20:00
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <p className="font-bold mb-4 text-white">Kết nối với chúng tôi</p>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:transform hover:scale-110 hover:shadow-lg group ${social.color}`}
                          aria-label={social.name}
                        >
                          <Icon className="text-white transition-colors duration-300" size={18} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">
                  © {currentYear} BT Academy. Tất cả quyền được bảo lưu.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-end space-x-6">
                <Link 
                  href="/chinh-sach-bao-mat" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-xs"
                >
                  Chính sách bảo mật
                </Link>
                <Link 
                  href="/api/sitemap.xml" 
                  className="text-gray-400 hover:text-green-400 transition-colors text-xs"
                >
                  Sơ đồ trang web
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Company Brand Statement */}
        <div className="border-t border-gray-800 py-4 bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-600 text-xs">
                BT Academy - Trung tâm đào tạo MC, Thuyết trình, Giọng nói chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
