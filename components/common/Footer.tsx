import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGraduationCap, FaBookOpen, FaUsers, FaAward, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const [location, setLocation] = useState({ ip: "", city: "", country: "" });
  useEffect(() => {
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => setLocation(data))
      .catch(() => setLocation({ ip: "Không xác định", city: "N/A", country: "N/A" }));
  }, []);

  const features = [
    {
      title: "Giáo dục chất lượng cao",
      description: "Đào tạo chuyên nghiệp",
      icon: <FaGraduationCap className="text-blue-600" />,
    },
    {
      title: "Chương trình đa dạng",
      description: "Từ cơ bản đến nâng cao",
      icon: <FaBookOpen className="text-blue-600" />,
    },
    {
      title: "Giảng viên kinh nghiệm",
      description: "Đội ngũ chuyên gia",
      icon: <FaUsers className="text-blue-600" />,
    },
    {
      title: "Chứng chỉ uy tín",
      description: "Được công nhận rộng rãi",
      icon: <FaAward className="text-blue-600" />,
    },
  ];

  return (
    <div className="bg-white">

      {/* Main Footer */}
      <footer className="bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="container mx-auto  px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-3">
              <Link href="/" className="inline-block mb-2">
                <div className="flex items-center">
                <Image 
                    src="/logobtacademy.png" 
                    alt="BT Academy Logo" 
                    width={120} 
                    height={80}
                    className="object-contain"
                  />
                </div>
              </Link>
              <p className="text-gray-700 leading-relaxed text-base">
                BT Academy là trung tâm đào tạo hàng đầu với các khóa học chất lượng cao, giúp học viên phát triển kỹ năng và nâng cao trình độ chuyên môn
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
            
                {/* Hotline chung */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                    <FaPhone className="text-white text-base" />
                  </div>
                  <span className="text-gray-700 text-base font-medium">0988 02 7494</span>
                </div>

                {/* Email chung */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white text-base" />
                  </div>
                  <span className="text-gray-700 text-base font-medium">contact@btacademy.com.vn</span>
                </div>
              </div>
{/* 
              <div className="pt-4">
                <Image
                  src="/thongbaoBCT.png"
                  alt="Bộ Công Thương Logo"
                  width={120}
                  height={40}
                  className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div> */}
            </div>

            {/* About Us */}
            <div className="space-y-6">
              <p className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 inline-block">
                Về chúng tôi
              </p>
              <ul className="space-y-3">
                {[
                  { href: "/gioi-thieu", label: "Về BT Academy" },
                  { href: "/khoa-hoc", label: "Khóa học" },
                  { href: "/lich-khai-giang", label: "Lịch khai giảng" },
                  { href: "/lien-he", label: "Liên hệ" }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 font-medium text-base transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

   
            {/* Policies */}
            <div className="space-y-6">
              <p className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 inline-block">
                Chính sách
              </p>
              <ul className="space-y-3">
                {[
                  { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
                  { href: "/chinh-sach-khoa-hoc-hoc-phi", label: "Khóa học & học phí" },
             
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 font-medium text-base transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Google Maps */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-600 pb-2 inline-block">
                Vị trí các cơ sở
              </h2>
              
              {/* CS1 - Hà Nội Map */}
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-800">CS1 - Hà Nội: <br /> 19 Nguyễn Gia Thiều, Hoàn Kiếm</h3>
                <div className="w-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.309861592884!2d105.84330317559623!3d21.020284180626888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9a62f8ad67%3A0xc0d673a4940ea1d6!2zQlQgQWNhZGVteSAtIMSQw6BvIHThuqFvIGdp4buNbmcgbsOzaSB2w6AgdGjhuqduIHRow6FpIGRvYW5oIG5naGnhu4dw!5e0!3m2!1svi!2s!4v1757508252499!5m2!1svi!2s" 
                    width="100%" 
                    height="150" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-md"
                  ></iframe>
                </div>
              </div>

              {/* CS2 - Thái Nguyên Map */}
              <div className="space-y-3">
                <h3 className="font-semibold text-green-800">CS2 - Thái Nguyên: <br /> Toa nhà Viettel, Số 4 Hoàng Văn Thụ</h3>
                <div className="w-full">
                  <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.7792792051196!2d105.8367287!3d21.594537100000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135271ea3d9bd6b%3A0xfaa8f55caebc0043!2zVmlldHRlbCBUaMOhaSBOZ3V5w6puIC0gQ2hpIG5ow6FuaCBU4bqtcCDEkW_DoG4gQ8O0bmcgbmdoaeG7h3AgLSBWaeG7hW4gdGjhu5FuZyBRdcOibiDEkeG7mWk!5e0!3m2!1svi!2s!4v1758653790741!5m2!1svi!2s" 
                    width="100%" 
                    height="150" 
                    style={{border:0}} 
                    allowFullScreen={true}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-md"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-200 bg-white">
          <div className="container mx-auto  px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-base text-gray-600">
                <span>Vị trí: <span className="font-semibold text-blue-600">{location.city}, {location.country}</span></span>
              </div>
              <div className="text-base text-gray-600">
                © 2026 <span className="font-semibold text-blue-600">btacademy.com.vn</span>. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
