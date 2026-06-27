import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import DefaultLayout from '../../components/layout/DefaultLayout';
import { Target, Rocket, Gem, CheckCircle, MessageCircle, Users, Mic, FileText, Star, Building, Smartphone, BarChart3, Award, Home, ChevronRight, Search, Video, Camera } from 'lucide-react';
import Link from 'next/link';
import VoiceTestPopup from '../../components/common/VoiceTestPopup';
import { ScrollingGallery } from '../../components/gallery';

const HocMCThuyetTrinhThaiNguyenPage = () => {
  const [isVoiceTestOpen, setIsVoiceTestOpen] = useState(false);
  const meta = {
    title: "Đào tạo MC & Giọng nói chuyên nghiệp tại Thái Nguyên - BT Academy",
    description: "Trung tâm đào tạo MC BT Academy Thái Nguyên - Chuyên đào tạo MC, chữa ngọng, luyện giọng nói truyền cảm, kỹ năng thuyết trình với phương pháp 'Cầm tay chỉ việc' từ giảng viên BTV/MC thực chiến.",
    keywords: "đào tạo MC Thái Nguyên, luyện giọng Thái Nguyên, chữa ngọng Thái Nguyên, khóa học MC cơ bản, BT Academy Thái Nguyên, MC chuyên nghiệp",
    ogTitle: "Đào tạo MC & Giọng nói chuyên nghiệp tại Thái Nguyên - BT Academy",
    ogDescription: "Trung tâm đào tạo MC BT Academy Thái Nguyên - Chuyên đào tạo MC, chữa ngọng, luyện giọng nói truyền cảm với phương pháp 'Cầm tay chỉ việc' từ giảng viên BTV/MC thực chiến.",
    ogImage: "/images/banner-bta.jpg",
    ogUrl: "https://btacademy.com.vn/khoa-hoc/hoc-mc-thuyet-trinh-tai-thai-nguyen",
    twitterCard: "summary_large_image"
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "BT Academy Thái Nguyên",
    "alternateName": "Trung tâm Đào tạo MC BT Academy - Cơ sở Thái Nguyên",
    "url": "https://btacademy.com.vn/khoa-hoc/hoc-mc-thuyet-trinh-tai-thai-nguyen",
    "logo": "https://btacademy.com.vn/logobtacademy.png",
    "description": "Trung tâm đào tạo MC và kỹ năng giao tiếp chuyên nghiệp tại Thái Nguyên.",
    "founder": {
      "@type": "Person",
      "name": "Lê Bích Thủy",
      "jobTitle": "Nhà sáng lập BT Academy"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tầng 3, Tòa nhà Viettel, Số 4 Hoàng Văn Thụ",
      "addressLocality": "TP. Thái Nguyên",
      "addressRegion": "Thái Nguyên",
      "addressCountry": "VN"
    },
    "telephone": "0988027494",
    "email": "contacts@btacademy.com.vn"
  };

  const courseCards = [
    {
      title: 'Đào tạo MC Nhí (BT Kids)',
      accent: 'BT Kids',
      badge: '4-15 tuổi',
      summary: 'Ươm mầm tự tin',
      description: 'Giúp trẻ mạnh dạn trình bày ý tưởng, làm chủ ngôn ngữ cơ thể và giao tiếp trước đám đông.',
      duration: '10 buổi nền tảng',
      audience: 'Phù hợp 4-15 tuổi',
      image: '/images/hoc-vien-bt-23.jpg',
      icon: Award
    },
    {
      title: 'MC Cơ Bản & Nâng Cao',
      accent: 'Thực chiến',
      badge: 'Từ cơ bản đến nâng cao',
      summary: 'Chinh phục nghề cầm mic',
      description: 'Lộ trình học từ dẫn sự kiện, Gala Dinner đến kỹ năng dẫn truyền hình và xây dựng nhân hiệu.',
      duration: '10-11 buổi chuyên sâu',
      audience: 'Dành cho người mới và người đi làm',
      image: '/images/mc-bich-thut-1.jpg',
      icon: Mic
    },
    {
      title: 'Chữa Ngọng & Luyện Giọng',
      accent: 'Cá nhân hóa',
      badge: '1:1 phản hồi',
      summary: 'Giọng nói truyền cảm',
      description: 'Khắc phục nói ngọng L/N, giảm giọng địa phương và tăng độ rõ, ấm, chắc cho giọng nói.',
      duration: '10 buổi điều chỉnh',
      audience: 'Phù hợp mọi lứa tuổi',
      image: '/images/hoc-vien-bt-25.jpg',
      icon: MessageCircle
    },
    {
      title: 'Thuyết Trình & Giao Tiếp Đỉnh Cao',
      accent: 'Nổi bật',
      badge: 'Storytelling ứng dụng',
      summary: 'Làm chủ thần thái',
      description: 'Nâng cấp khả năng trình bày, kể chuyện và chinh phục khách hàng, đối tác trong công việc.',
      duration: '10 buổi ứng dụng',
      audience: 'Dành cho sale, quản lý, chủ doanh nghiệp',
      image: '/images/hoc-vien-bt-24.jpg',
      icon: BarChart3
    }
  ];

  return (
    <DefaultLayout meta={meta}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="author" content="MC Bích Thủy" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:url" content="https://btacademy.com.vn/khoa-hoc/hoc-mc-thuyet-trinh-tai-thai-nguyen" />
        <meta property="og:site_name" content="BT Academy" />

        <meta name="twitter:card" content={meta.twitterCard} />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.ogDescription} />
        <meta name="twitter:image" content={meta.ogImage} />

        <link rel="canonical" href="https://btacademy.com.vn/khoa-hoc/hoc-mc-thuyet-trinh-tai-thai-nguyen" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div className='h-[80px]'></div>



      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes pulse-soft {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 10px); }
          100% { transform: translate(0, 0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }
        .animate-drift {
          animation: drift 8s ease-in-out infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 z-10">
              <div className="inline-block px-4 py-1.5 bg-green-50 rounded-full">
                <span className="text-green-600 font-bold tracking-wider uppercase text-xs md:text-sm">
                  ĐÀO TẠO KỸ NĂNG MỀM HÀNG ĐẦU TẠI THÁI NGUYÊN
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-[1.15]">
                Khai phóng <span className="text-green-600">Giọng nói</span> & <br />
                Định hình <span className="text-blue-600">Bản sắc</span> cá nhân
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                Trung tâm đào tạo MC BT Academy Thái Nguyên tự hào mang đến giải pháp giúp bạn sở hữu thần thái &quot;chuẩn truyền hình&quot; ngay tại quê hương.
              </p>
              <div className="flex flex-wrap gap-4 md:pt-4 pt-1">
                <button
                  onClick={() => setIsVoiceTestOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center mx-auto md:mx-0 gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Đăng ký Test giọng miễn phí
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/2 relative mt-2 lg:mt-0">
              {/* Background Decorative Shape */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-50 rounded-3xl -z-10 rotate-12 opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-green-50 rounded-full -z-10 opacity-60"></div>

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden z-20">
                <Image
                  src="/images/mc-co-ban-thai-nguyen.jpg"
                  alt="Đào tạo MC & Giọng nói chuyên nghiệp tại Thái Nguyên"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Rating Card */}
              <div className="absolute -bottom-6 -left-4 md:-left-10 bg-gray-50 p-5 rounded-2xl flex items-center gap-4 border border-solid border-[1px] border-gray-100 z-30 animate-float">
                <div className="bg-green-600 text-white font-black px-3 py-3 rounded-xl text-lg shadow-lg shadow-yellow-100">
                  4.9
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Đánh giá </p>
                  <p className="text-xs text-gray-500 font-medium">5.000+ Học viên tin tưởng</p>
                </div>
              </div>

              {/* Decorative Dots Pattern */}
              <div className="absolute -bottom-12 -right-8 grid grid-cols-6 gap-3 opacity-30 z-10">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto">
        <div className="prose prose-lg blog max-w-none px-4 py-4">
          <div className="bg-white rounded-2xl mb-12">
            <div className="space-y-4 max-w-4xl">
              <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-green-500 pl-6 py-2">
                Bạn đang tìm kiếm một địa chỉ uy tín để cải thiện giọng nói, chữa ngọng, hay khát khao trở thành một MC chuyên nghiệp sở hữu thần thái &quot;chuẩn truyền hình&quot; ngay tại Thái Nguyên?
              </p>
              <p className="text-lg text-gray-600">
                <strong className="text-green-700">Trung tâm đào tạo MC BT Academy Thái Nguyên</strong> tự hào là đơn vị đào tạo kỹ năng mềm tiên phong, mang đến giải pháp khai phóng giọng nói và định hình bản sắc cá nhân cho hàng nghìn học viên tại khu vực.
              </p>
            </div>
          </div>

          <section className="mb-8">
            <div className="bg-white rounded-lg">
              <h2 style={{ fontWeight: 'bold' }}>
                I. Tầm Nhìn & Triết Lý Đào Tạo &quot;Vững Chãi&quot;
              </h2>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 my-4">
                <p className="italic text-lg">
                  &quot;Xây dựng kỹ năng giao tiếp cũng giống như xây một ngôi nhà, đừng mải mê chọn màu sơn (vẻ ngoài) trước khi làm móng (nội lực).&quot;
                </p>
              </div>

              <p className="mb-4">
                Khác với những khóa đào tạo ngắn hạn chỉ dạy bề nổi, lộ trình tại <strong className="text-green-700">BT Academy Thái Nguyên</strong> tập trung gia cố phần &quot;móng&quot; cho học viên:
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <strong className="text-green-700">Làm chủ hơi thở & Khẩu hình:</strong>
                    <p>Kỹ thuật lấy hơi bụng và giải phóng cơ hàm để giọng nói nội lực, truyền cảm.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <strong className="text-green-700">Tư duy biên tập:</strong>
                    <p>Cách xây dựng kịch bản thông minh, logic và lôi cuốn.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <strong className="text-green-700">Bản lĩnh sân khấu:</strong>
                    <p>Vượt qua nỗi sợ đám đông, làm chủ ống kính và micro.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section III: Expert Team */}
          <section className="mb-6">
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1" style={{ fontWeight: 'bold' }}>
                II. Đội Ngũ Giảng Viên Chuyên Nghiệp
              </h2>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Lợi thế cạnh tranh lớn nhất của Trung tâm MC BT Academy nằm ở đội ngũ giảng viên. Họ không chỉ là những nhà giáo dục, mà còn là những chuyên gia, Biên tập viên (BTV) đang hoạt động và có thâm niên trong ngành Truyền hình và Sự kiện.
            </p>
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mt-6 p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[30%]">
                  <div className="w-full rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/gallery/bt-22.jpg"
                      alt="MC Lê Bích Thủy"
                      width={400}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-[70%] flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    MC Bích Thủy
                  </h3>
                  <p className="text-green-700 font-semibold mb-4 text-base md:text-lg border-l-4 border-green-600 pl-3 py-1 bg-green-50 rounded-r">
                    (Nhà sáng lập BT Academy | Nhà báo | BTV Truyền hình)
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4 text-base">
                    Giảng viên Lê Bích Thủy là Nhà sáng lập và là linh hồn trong việc định hình triết lý đào tạo tại BT Academy. Với nền tảng học vấn bài bản và kinh nghiệm thực chiến dày dặn tại các cơ quan báo chí, truyền hình lớn, cô mang đến phương pháp đào tạo chuẩn mực, giúp học viên khai phóng giọng nói và phong thái tự tin nhất.
                  </p>
                  <ul className="space-y-2.5 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Kinh nghiệm Báo chí - Truyền hình (10 năm):</strong> Từng công tác và giữ các vị trí quan trọng tại các cơ quan Báo chí và Đài truyền hình uy tín. Nhà báo có tư duy sắc bén trong biên tập nội dung và dẫn dắt chương trình chuyên sâu.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thế mạnh đào tạo:</strong> Đào tạo MC chuyên nghiệp (Truyền hình, sự kiện), Luyện giọng nói truyền cảm, Kỹ năng Thuyết trình đỉnh cao và Tư vấn xây dựng Thương hiệu cá nhân (Personal Branding).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thành tích thực chiến:</strong>
                        <ul className="list-disc list-inside mt-2 -ml-[1.75rem] space-y-1">
                          <li>10 năm kinh nghiệm dẫn dắt & sản xuất: Trực tiếp tham gia sản xuất và dẫn các bản tin thời sự, phóng sự điều tra, chương trình tọa đàm và talkshow chuyên sâu.</li>
                          <li>Chuyên gia huấn luyện phong thái: Đã đào tạo thành công cho hàng nghìn học viên là trẻ em, người đi làm và lãnh đạo doanh nghiệp, giúp họ làm chủ sân khấu và tỏa sáng trước ống kính.</li>
                          <li>Trình độ chuyên môn: Thạc sĩ chuyên ngành Báo chí, đảm bảo nền tảng kiến thức lý luận và thực hành chuẩn mực nhất.</li>
                        </ul>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Instructor 1: Hồng Quyên */}
            {/* <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mt-5 p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[30%]">
                  <div className="w-full rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/images/mc-hong-quyen-1.webp"
                      alt="Giảng viên - MC/BTV Hồng Quyên"
                      width={400}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-[70%] flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Giảng viên - MC/BTV Hồng Quyên
                  </h3>
                 
                  <p className="text-gray-700 leading-relaxed mb-1 text-base">
                    Giảng viên Hồng Quyên với nền tảng vững chắc từ các Đài Truyền hình quốc gia, cô mang đến phương pháp đào tạo chuẩn mực và thực tế nhất.
                  </p>
                  <ul className="space-y-2.5 text-gray-700">
                  
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Kinh nghiệm Truyền hình (8 năm):</strong> Từng là Biên tập viên tại Đài Truyền hình Kỹ thuật số VTC và Truyền hình Quốc hội Việt Nam. Cộng tác viên dẫn trải nghiệm và thể hiện lời bình trên sóng VTV.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thế mạnh đào tạo:</strong> Đào tạo MC chuyên nghiệp (sân khấu, truyền hình), Kỹ năng ứng biến, Thuyết trình chuyên sâu và Chương trình Sửa ngọng hiệu quả cao.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 font-bold">•</span>
                      <span><strong className="text-gray-800">Thành tích thực chiến:</strong>
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                          <li>7 năm kinh nghiệm dẫn truyền hình: Bản tin thời sự, phóng sự, chương trình trải nghiệm, Livestream chuyên nghiệp.</li>
                          <li>8 năm kinh nghiệm dẫn sự kiện: Các sự kiện quy mô lớn như Khai trương, Gala Dinner, Year End Party...</li>
                        </ul>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}
          </section>

          <section className="mb-10 relative overflow-hidden py-8">

            <div className="absolute bottom-5 right-5 opacity-50 pointer-events-none hidden md:block">
              <div className="relative h-28 w-28">
                <div className="absolute bottom-1 right-1 grid grid-cols-4 gap-2">
                  {[...Array(12)].map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-5xl">
                <h2 className="mb-2 text-sm font-bold ">
                  III. Các Khóa Học MC Tại Thái Nguyên
                </h2>
                <p className="mt-3 text-base text-gray-600 md:text-lg">
                  BT Academy thiết kế 4 nhóm khóa học nổi bật để đáp ứng từng độ tuổi, mục tiêu và nhu cầu phát triển kỹ năng giao tiếp.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {courseCards.map((course) => {
                const Icon = course.icon;

                return (
                  <div
                    key={course.title}
                    className="group rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="relative mx-auto h-32 w-32 flex-shrink-0 sm:mx-0">

                        <div className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={220}
                          height={220}
                          className="h-32 w-32 rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="mb-2 text-lg font-bold text-green-600">{course.accent}</p>
                        <h3 className="text-xl font-bold leading-snug text-gray-900">
                          {course.title}
                        </h3>
                        <p className="mt-2 text-sm font-medium text-gray-500">
                          {course.summary}
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-yellow-400">
                          <span className="text-sm font-medium text-gray-600">
                            {course.description}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                          <span className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            {course.audience}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-20 relative overflow-hidden py-10">
            {/* Decorative Dots Pattern top right */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
              <div className="grid grid-cols-6 gap-2">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                ))}
              </div>
            </div>

            <div className="text-center mb-16 px-4">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
                  Thực Hành – Thu Hình – Phản Hồi
                </h2>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-3 opacity-80">

                </div>
              </div>
              <p className="text-gray-500 max-w-3xl mx-auto text-lg mt-6 leading-relaxed">
                Học viên tại Thái Nguyên sẽ được trải nghiệm quy trình đào tạo chuẩn Studio hiện đại.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 px-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-purple-100 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                    <Search className="w-10 h-10 text-purple-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-purple-600 font-bold border border-purple-50">1</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Đánh giá</h4>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">Test giọng miễn phí và tư vấn lộ trình học tập phù hợp nhất.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-pink-100 rounded-[50%_50%_30%_70%/50%_70%_30%_50%] flex items-center justify-center transition-transform duration-500 group-hover:-rotate-12">
                    <Video className="w-10 h-10 text-pink-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-pink-600 font-bold border border-pink-50">2</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">Thực hành</h4>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">80% thời lượng là thực hành trực tiếp tại Studio chuyên nghiệp.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-emerald-100 rounded-[70%_30%_50%_50%/30%_50%_50%_70%] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <Camera className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-emerald-600 font-bold border border-emerald-50">3</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">Ghi hình</h4>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">Mỗi buổi học đều có video thực hành để theo dõi sự thay đổi.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-yellow-100 rounded-[40%_60%_70%_30%/40%_40%_60%_60%] flex items-center justify-center transition-transform duration-500 group-hover:-translate-y-2">
                    <Users className="w-10 h-10 text-yellow-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-yellow-600 font-bold border border-yellow-50">4</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">Coaching</h4>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">Phản hồi 1-1 từ giảng viên chuyên nghiệp về ưu và nhược điểm.</p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-cyan-100 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] flex items-center justify-center transition-transform duration-500 group-hover:rotate-6">
                    <Award className="w-10 h-10 text-cyan-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-cyan-600 font-bold border border-cyan-50">5</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">Tốt nghiệp</h4>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">Nhận chứng chỉ và hỗ trợ kết nối các show dẫn thực tế.</p>
              </div>
            </div>
          </section>
          {/* Section V: Proof and Achievements */}
          <section className="">
            <div className="">
              <h2 className="text-xl md:text-2xl text-gray-800 mb-1" style={{ fontWeight: 'bold' }}>
                IV. Minh Chứng Và Thành Tự
              </h2>
            </div>

            <p className="mb-4 mx-auto">
              Những thành quả đạt được là lời khẳng định rõ ràng nhất cho chất lượng đào tạo và sự tận tâm của Trung tâm Đào tạo MC BT Academy. Chúng tôi tự hào đồng hành cùng sự thay đổi của hàng trăm học viên.
            </p>

            {/* Proof Image */}
            <div className="mb-6">
              <Image
                src="/images/hoc-vien-pt-03.jpg"
                alt="Thành tựu và minh chứng của BT Academy"
                width={1200}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Testimonials */}
            <div className="mb-4">
              <h3 className="mb-2 flex items-center">
                1. Cảm Nhận Từ Học Viên & Phụ Huynh
              </h3>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <h4 className="mb-2">Cảm nhận từ Phụ huynh có con học MC Nhí</h4>
                  <p className="italic mb-1">
                    &quot;Bé nhà tôi 7 tuổi, trước đây rất nhút nhát và sợ nói trước lớp. Sau Khóa MC Nhí Cơ Bản BT Academy của cô Bích Thủy, bé đã biết cách kể chuyện cuốn hút, tự tin lên sân khấu tổng kết cuối năm và thậm chí còn đòi quay video giới thiệu sách. Sự thay đổi này thật sự ngoài mong đợi!&quot;
                  </p>
                  <p>— Chị Lan Anh (Phụ huynh bé Minh Đức, Thái Nguyên)</p>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <h4 className="mb-2">Phản hồi từ Học viên Người lớn </h4>
                  <p className="italic mb-1">
                    &quot; Cảm giác tự hào nhất chính là khoảnh khắc nhìn thấy nỗ lực của mình được &apos;kết tinh&apos; trên sóng truyền hình quốc gia!
                    Đứng trước ống kính VTV, mình mới thấy giá trị của những ngày trui rèn tại BT Academy. Cảm ơn cô Bích Thủy đã mài giũa cho mình từ cách lấy hơi, ánh mắt đến bản lĩnh xử lý bản tin thực tế. Đây không chỉ là một kỷ niệm, mà là cột mốc khẳng định sự trưởng thành của mình trên hành trình theo đuổi nghề cầm Mic chuyên nghiệp. &quot;
                  </p>
                  <p>— Bạn Vân Anh (Khóa MC Nâng cao tại Thái Nguyên)</p>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="mb-12">
              <h3 className="mb-2 flex items-center">
                2. Hình Ảnh Thành Quả Thực Chiến
              </h3>
              <div className="not-prose">
                <ScrollingGallery />
              </div>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Bộ sưu tập ảnh &quot;TRƯỚC &amp; SAU&quot;:</strong> Hình ảnh học viên trước và sau khóa học (nếu có sự đồng ý).</li>
                <li><strong>Video Sản phẩm MC Nhí:</strong> Trích đoạn clip MC nhí tự tin dẫn chương trình, làm phóng sự.</li>
                <li><strong>Hình ảnh Ghi hình Chuyên nghiệp:</strong> Ảnh học viên Khóa MC Pro thực hành ghi hình tại studio hoặc ngoại cảnh.</li>
                <li><strong>Chứng nhận/Thành tựu:</strong> Ảnh chụp chứng chỉ tốt nghiệp, hoặc bằng khen/giải thưởng (nếu có).</li>
              </ul>
            </div>

            {/* Professional Credibility */}
            <div className="mb-4">
              <h3 className="mb-2 flex items-center">
                3. Uy Tín Chuyên Môn (Thành tích của Giảng viên)
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Kinh nghiệm Phát thanh - Truyền hình:</strong> Đội ngũ giảng viên có kinh nghiệm thực tế tại VTC, VTV, Truyền hình Quốc hội Việt Nam.</li>
                <li><strong>Sản phẩm Thể hiện Giọng:</strong> Giảng viên BT Academy thường xuyên thực hiện các dự án lồng tiếng, đọc lời bình, và voice-over quảng cáo cho các doanh nghiệp, chứng minh chất lượng giọng nói ở mức chuyên nghiệp nhất.</li>
              </ul>
            </div>
          </section>

          {/* Section VI: Conclusion and CTA */}
          <section className="">
            <div className="">
              <h2 style={{ fontWeight: 'bold' }}>
                VI. Kết Luận
              </h2>
            </div>

            <p className="mb-6">
              BT Academy cam kết là người bạn đồng hành tin cậy, giúp bạn và con bạn kiến tạo kỹ năng giao tiếp bền vững tại Hà Nội, Thái Nguyên. Đừng để sự tự ti cản trở thành công của bạn!
            </p>

            {/* CTA Box */}
            <div className="bg-green-50 p-8 rounded-lg border-l-4 border-green-600 text-center">
              <p className="text-xl font-bold text-green-700 mb-4">
                📢 GỌI NGAY để được tư vấn lộ trình phù hợp!
              </p>
              <p className="text-gray-700 mb-6 font-medium">
                BT Academy sẵn sàng đánh giá miễn phí khả năng giọng nói và giao tiếp của bạn hoặc con bạn.
              </p>
              <a href="tel:0988027494">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg">
                  HOTLINE TƯ VẤN TRỰC TIẾP: 098 802 7494
                </button>
              </a>
              <div className="mt-6">
                <Link href="/lich-khai-giang">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
                    XEM LỊCH KHAI GIẢNG TẠI THÁI NGUYÊN
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="mt-4 mb-4">
            <div className="bg-white p-4 rounded-lg">

              <div className="space-y-1.5">
                <p><strong>Trung Tâm Đào Tạo MC BT Academy</strong> – Đào tạo MC, Luyện Giọng & Kỹ năng giao tiếp</p>
                <p><strong>📍 Trụ sở chính:</strong> 19 Nguyễn Gia Thiều, Quận Hoàn Kiếm, Hà Nội.</p>
                <p><strong>📍 Cơ sở Thái Nguyên:</strong>Tòa nhà Viettel, 4 Hoàng Văn Thụ, Thái Nguyên.</p>
                <p><strong>📞 Hotline tư vấn:</strong> <a href="tel:0988027494">098 802 7494</a></p>
                <p><strong>📧 Email:</strong> <a href="mailto:contacts@btacademy.com.vn">contacts@btacademy.com.vn</a></p>
              </div>
            </div>
          </section>

        </div>
      </div>
      <VoiceTestPopup isOpen={isVoiceTestOpen} onClose={() => setIsVoiceTestOpen(false)} />
    </DefaultLayout>
  );
};

export default HocMCThuyetTrinhThaiNguyenPage;
