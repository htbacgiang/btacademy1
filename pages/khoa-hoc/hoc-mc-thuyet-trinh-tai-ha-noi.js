import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import DefaultLayout from '../../components/layout/DefaultLayout';
import { Award, BarChart3, Camera, ChevronLeft, ChevronRight, FileText, MessageCircle, Mic, Search, Star, Users, Video } from 'lucide-react';
import Link from 'next/link';
import VoiceTestPopup from '../../components/common/VoiceTestPopup';
import { ScrollingGallery } from '../../components/gallery';
import VideoGallery from '../../components/common/VideoGallery';
import { toCloudinaryUrl } from '../../utils/cloudinary';

const HocMCThuyetTrinhHaNoiPage = () => {
  const [isVoiceTestOpen, setIsVoiceTestOpen] = useState(false);
  const [activeHeroCard, setActiveHeroCard] = useState(0);
  const [heroCourseCards, setHeroCourseCards] = useState([
    {
      id: 'du-phong-1',
      slug: '',
      tag: 'KHÓA HỌC NỔI BẬT',
      cover: '/images/hoc-vien-bt-24.jpg',
      videos: '48 Video',
      classCount: '12 Lớp',
      lessons: '10 Buổi',
      students: '120 Học viên',
      title: 'MC Cơ Bản Chuyên Nghiệp',
      description: 'Lộ trình thực hành giúp bạn tự tin dẫn dắt chương trình và làm chủ micro.',
      price: 'Liên hệ',
      reviews: '(0 đánh giá)',
      rating: 5
    },
    {
      id: 'du-phong-2',
      slug: '',
      tag: 'KHÓA HỌC NỔI BẬT',
      cover: '/images/hoc-vien-bt-25.jpg',
      videos: '36 Video',
      classCount: '10 Lớp',
      lessons: '8 Buổi',
      students: '85 Học viên',
      title: 'Luyện Giọng Truyền Cảm',
      description: 'Cải thiện chất giọng, phát âm rõ ràng và tăng sức thuyết phục khi giao tiếp.',
      price: 'Liên hệ',
      reviews: '(0 đánh giá)',
      rating: 5
    },
    {
      id: 'du-phong-3',
      slug: '',
      tag: 'KHÓA HỌC NỔI BẬT',
      cover: '/images/hoc-vien-bt-23.jpg',
      videos: '52 Video',
      classCount: '14 Lớp',
      lessons: '12 Buổi',
      students: '150 Học viên',
      title: 'Thuyết Trình Đỉnh Cao',
      description: 'Ứng dụng storytelling, làm chủ ngôn ngữ cơ thể và thuyết trình trước đám đông.',
      price: 'Liên hệ',
      reviews: '(0 đánh giá)',
      rating: 5
    }
  ]);

  const meta = {
    title: 'Đào tạo MC & Giọng nói chuyên nghiệp tại Hà Nội - BT Academy',
    description: "Trung tâm đào tạo MC BT Academy Hà Nội - Chuyên đào tạo MC, chữa ngọng, luyện giọng nói truyền cảm, kỹ năng thuyết trình với phương pháp 'Cầm tay chỉ việc' từ giảng viên BTV/MC thực chiến.",
    keywords: 'đào tạo MC Hà Nội, luyện giọng Hà Nội, chữa ngọng Hà Nội, khóa học MC cơ bản, BT Academy Hà Nội, MC chuyên nghiệp',
    ogTitle: 'Đào tạo MC & Giọng nói chuyên nghiệp tại Hà Nội - BT Academy',
    ogDescription: "Trung tâm đào tạo MC BT Academy Hà Nội - Chuyên đào tạo MC, chữa ngọng, luyện giọng nói truyền cảm với phương pháp 'Cầm tay chỉ việc' từ giảng viên BTV/MC thực chiến.",
    ogImage: '/images/banner-bta.jpg',
    ogUrl: 'https://btacademy.com.vn/khoa-hoc/hoc-mc-thuyet-trinh-tai-ha-noi',
    twitterCard: 'summary_large_image'
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "BT Academy Hà Nội",
    "alternateName": "Trung tâm Đào tạo MC BT Academy - Trụ sở Hà Nội",
    "url": "https://btacademy.com.vn/khoa-hoc/hoc-mc-thuyet-trinh-tai-ha-noi",
    "logo": "https://btacademy.com.vn/logobtacademy.png",
    "description": "Trung tâm đào tạo MC và kỹ năng giao tiếp chuyên nghiệp tại Hà Nội.",
    "founder": {
      "@type": "Person",
      "name": "Lê Bích Thủy",
      "jobTitle": "Nhà sáng lập BT Academy"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "19 Nguyễn Gia Thiều, Quận Hoàn Kiếm",
      "addressLocality": "Hà Nội",
      "addressRegion": "Hà Nội",
      "addressCountry": "VN"
    },
    "telephone": "0988027494",
    "email": "contact@btacademy.com.vn"
  };

  const courseCards = [
    {
      title: 'Đào tạo MC Nhí (BT Kids)',
      accent: 'BT Kids',
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
      summary: 'Làm chủ thần thái',
      description: 'Nâng cấp khả năng trình bày, kể chuyện và chinh phục khách hàng, đối tác trong công việc.',
      duration: '10 buổi ứng dụng',
      audience: 'Dành cho sale, quản lý, chủ doanh nghiệp',
      image: '/images/hoc-vien-bt-24.jpg',
      icon: BarChart3
    }
  ];

  useEffect(() => {
    let isMounted = true;

    const loadHeroCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        const data = await response.json();
        const apiCourses = Array.isArray(data?.courses) ? data.courses : [];

        if (!response.ok || apiCourses.length === 0) return;

        const mappedCourses = apiCourses.slice(0, 4).map((course, idx) => {
          const cover = toCloudinaryUrl(course.image);

          const safeRating = Number.isFinite(course.rating) ? Math.max(0, Math.min(5, Number(course.rating))) : 5;
          const reviews = Number.isFinite(course.reviews) ? Number(course.reviews) : 0;
          const students = Number.isFinite(course.students) ? Number(course.students) : 0;
          const sessions = Number.isFinite(course.sessions) ? Number(course.sessions) : 0;

          return {
            id: course._id || `api-course-${idx}`,
            slug: course.slug || '',
            tag: (course.level || 'Khóa học nổi bật').toString().toUpperCase(),
            cover,
            videos: `${Math.max(sessions * 4, 12)} Video`,
            classCount: `${Math.max(Math.ceil(sessions / 2), 1)} Lớp`,
            lessons: `${sessions || 1} Buổi`,
            students: `${students || 0} Học viên`,
            title: course.title || 'Khóa học BT Academy',
            description: (course.subtitle || course.description || 'Khóa học thực hành chuyên sâu tại BT Academy.').toString().slice(0, 120),
            price: 'Liên hệ',
            reviews: `(${reviews} đánh giá)`,
            rating: safeRating
          };
        });

        if (isMounted && mappedCourses.length > 0) {
          setHeroCourseCards(mappedCourses);
          setActiveHeroCard((prev) => (prev >= mappedCourses.length ? 0 : prev));
        }
      } catch (error) {
        console.error('Không thể tải dữ liệu heroCourseCards từ API:', error);
      }
    };

    loadHeroCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const goToPrevHeroCard = () => {
    setActiveHeroCard((prev) => (prev - 1 + heroCourseCards.length) % heroCourseCards.length);
  };

  const goToNextHeroCard = () => {
    setActiveHeroCard((prev) => (prev + 1) % heroCourseCards.length);
  };

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
        <meta property="og:url" content={meta.ogUrl} />
        <meta property="og:site_name" content="BT Academy" />

        <meta name="twitter:card" content={meta.twitterCard} />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.ogDescription} />
        <meta name="twitter:image" content={meta.ogImage} />

        <link rel="canonical" href={meta.ogUrl} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="h-[80px]" />

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

      <section className="relative hero-bg-gradient full-screen-bg overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 pb-8 pt-10 md:pb-10 md:pt-14">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#c7f5dc] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#dcffe9] opacity-40 blur-3xl" />

        <div className="container mx-auto -translate-y-2 md:-translate-y-6">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr_0.9fr]">
            <div className="z-20 space-y-7 lg:-translate-y-8">
              <div className="inline-block px-4 py-1.5 bg-green-50 rounded-full">
                <span className="text-green-600 font-bold tracking-wider uppercase text-xs md:text-sm">
                  TRUNG TÂM ĐÀO TẠO MC HÀNG ĐẦU TẠI HÀ NỘI
                </span>
              </div>

              <h1 className="text-3xl md:text-3xl font-bold text-gray-900 leading-[1.15]">
                Khai phóng <span className="text-green-600">Giọng nói</span> & <br />
                Định hình <span className="text-blue-600">Bản sắc</span> cá nhân
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                Trung tâm đào tạo MC BT Academy tự hào mang đến giải pháp giúp bạn sở hữu thần thái &quot;chuẩn truyền hình&quot;
              </p>

              <div className="flex flex-row items-center gap-4 pt-1">
                <button
                  onClick={() => setIsVoiceTestOpen(true)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-[#4f46e5] to-[#4338ca] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/60 transition-all hover:-translate-y-0.5"
                >
                  Tất cả khóa học
                  <ChevronRight className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {['/images/hoc-vien-01.jpg', '/images/hoc-vien-02.jpg', '/images/hoc-vien-03.jpg'].map((avatar, idx) => (
                      <div key={avatar} className={`relative h-9 w-9 overflow-hidden rounded-full border-2 border-white shadow-sm ${idx === 0 ? '' : '-ml-2'}`}>
                        <Image src={avatar} alt={`Học viên ${idx + 1}`} fill sizes="36px" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#131a53] ">500+ học viên</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-[520px] items-end justify-center  md:min-h-[620px]">
              <Image
                src="/images/mc-bich-thuy.webp"
                alt="MC presentation student"
                width={640}
                height={840}
                className="relative z-10 hidden md:block w-auto translate-y-10 object-cover md:h-[640px] md:translate-y-14"
                priority
              />
            </div>

            <div className="relative z-20 mx-auto w-full max-w-[330px] lg:translate-y-2">
              <div className="relative h-[540px]">
                {heroCourseCards.map((card, index) => {
                  const stackPosition = (index - activeHeroCard + heroCourseCards.length) % heroCourseCards.length;

                  if (stackPosition > 3) return null;

                  const transforms = [
                    'translate(0px, 0px) rotate(0deg) scale(1)',
                    'translate(-10px, 12px) rotate(-7deg) scale(0.97)',
                    'translate(10px, 24px) rotate(7deg) scale(0.94)',
                    'translate(-8px, 34px) rotate(-5deg) scale(0.91)'
                  ];

                  const opacities = [1, 0.88, 0.76, 0.64];
                  const isActive = stackPosition === 0;

                  return (
                    <div
                      key={card.id}
                      className="absolute left-0 right-0 rounded-[18px] border border-[#d6f4e5] bg-white p-3 shadow-[0_25px_60px_rgba(29,95,56,0.18)] transition-all duration-500"
                      style={{
                        zIndex: 40 - stackPosition,
                        transform: transforms[stackPosition],
                        opacity: opacities[stackPosition],
                        transformOrigin: '50% 50%'
                      }}
                    >
                      <div className="relative overflow-hidden">
                        <div className="mt-3">
                          <div className="relative h-36 w-full overflow-hidden rounded-lg bg-white/20">
                            <Image
                              src={card.cover}
                              alt={card.title}
                              fill
                              sizes="(max-width: 768px) 90vw, 320px"
                              className="object-cover"
                            />
                          </div>
                        </div>

                      </div>

                      <div className="mt-4 flex items-center gap-4 text-xs text-[#8a94ae]">
                        <span className="inline-flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          {card.lessons}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {card.students}
                        </span>
                      </div>

                      <h3 className="mt-3 text-base font-bold leading-tight text-[#101d43]">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#667293]">
                        {card.description}...
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xl font-bold text-[#14532d]">{card.price}</p>
                        {card.slug ? (
                          <Link href={`/khoa-hoc/${card.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-[#166534]">
                            Xem chi tiết
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <button className="inline-flex items-center gap-1 text-sm font-semibold text-[#166534]">
                            Xem chi tiết
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {isActive && (
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {heroCourseCards.map((dot, dotIndex) => (
                              <button
                                key={dot.id}
                                onClick={() => setActiveHeroCard(dotIndex)}
                                className={`h-2.5 rounded-full transition-all ${dotIndex === activeHeroCard ? 'w-5 bg-[#16a34a]' : 'w-2.5 bg-[#cdebd8]'}`}
                                aria-label={`Chuyển đến khóa học ${dotIndex + 1}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={goToPrevHeroCard}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cdebd8] text-[#166534] transition hover:bg-[#effcf4]"
                              aria-label="Card trước"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={goToNextHeroCard}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cdebd8] text-[#166534] transition hover:bg-[#effcf4]"
                              aria-label="Card sau"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-[110px] left-1/2 z-[14] h-[210px] w-[130%] -translate-x-1/2 rounded-[50%] bg-white md:-bottom-[130px] md:h-[230px]" />
      </section>

      <div className="container mx-auto">
        <div className="prose prose-lg blog max-w-none px-4 py-4">
          <div className="bg-white rounded-2xl mb-12">
            <div className="space-y-4 max-w-7xl">
              <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-green-500 pl-6 py-2">
                Bạn đang tìm kiếm một địa chỉ uy tín để cải thiện giọng nói, chữa ngọng, hay khát khao trở thành một MC chuyên nghiệp sở hữu thần thái &quot;chuẩn truyền hình&quot; ngay tại Hà Nội?
              </p>
              <p className="text-lg text-gray-600">
                <strong className="text-green-700">Trung tâm đào tạo MC BT Academy Hà Nội</strong> mang đến giải pháp khai phóng giọng nói và định hình bản sắc cá nhân cho học viên ở mọi độ tuổi.
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
                Khác với những khóa đào tạo ngắn hạn chỉ dạy bề nổi, lộ trình tại <strong className="text-green-700">BT Academy Hà Nội</strong> tập trung gia cố phần &quot;móng&quot; cho học viên:
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
                <h2 className="mb-2 text-sm font-bold">
                  III. Các Khóa Học MC Tại Hà Nội
                </h2>
                <p className="mt-3 text-base text-gray-600 md:text-lg">
                  BT Academy thiết kế 4 nhóm khóa học nổi bật để đáp ứng từng độ tuổi, mục tiêu và nhu cầu phát triển kỹ năng giao tiếp.
                </p>
              </div>
              <button
                onClick={() => setIsVoiceTestOpen(true)}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                Nhận tư vấn khóa học
                <ChevronRight className="h-4 w-4" />
              </button>
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
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
              <div className="grid grid-cols-6 gap-2">
                {[...Array(36)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                ))}
              </div>
            </div>

            <div className="text-center mb-16 px-4">
              <div className="relative inline-block">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
                  Thực Hành – Thu Hình – Phản Hồi
                </h2>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-3 opacity-80" />
              </div>
              <p className="text-gray-500 max-w-3xl mx-auto text-lg mt-6 leading-relaxed">
                Học viên tại Hà Nội sẽ được trải nghiệm quy trình đào tạo chuẩn Studio hiện đại.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 px-4">
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

          <section>
            <div>
              <h2 className="text-xl md:text-2xl text-gray-800 mb-1" style={{ fontWeight: 'bold' }}>
                IV. Minh Chứng Và Thành Tự
              </h2>
            </div>

            <p className="mb-4 mx-auto">
              Những thành quả đạt được là lời khẳng định rõ ràng nhất cho chất lượng đào tạo và sự tận tâm của Trung tâm Đào tạo MC BT Academy. Chúng tôi tự hào đồng hành cùng sự thay đổi của hàng trăm học viên.
            </p>

            <div className="not-prose mb-6">
              <VideoGallery
                maxVideos={3}
                showTitle={false}
                showDescription={false}
                showPagination={false}
              />
            </div>

            <div className="mb-4">
              <h3 className="mb-2 flex items-center">
                1. Cảm Nhận Từ Học Viên & Phụ Huynh
              </h3>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <h4 className="mb-2">Cảm nhận từ Phụ huynh có con học MC Nhí</h4>
                  <p className="italic mb-1">
                    &quot;Bé nhà tôi 8 tuổi, vốn rất ngại giao tiếp và thường lúng túng khi đứng trước đám đông. Sau khóa MC Nhí tại cơ sở Nguyễn Gia Thiều, tôi thực sự bất ngờ khi thấy con chủ động xung phong làm ban cán sự lớp và tự tin dẫn chương trình văn nghệ ở trường. Phương pháp dạy thực chiến tại Studio của cô Bích Thủy đã giúp con không còn sợ ống kính, biết cách sắp xếp ý tưởng và diễn đạt mạch lạc hơn rất nhiều &quot;                  </p>
                  <p>— Chị Thu Hương (Phụ huynh bé Gia Bảo, Quận Hoàn Kiếm, Hà Nội)</p>
                </div>

                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <h4 className="mb-2">Phản hồi từ Học viên Người lớn</h4>
                  <p className="italic mb-1">
                    &quot;Là một quản lý dự án, tôi thường xuyên phải thuyết trình trước đối tác nhưng lại gặp vấn đề về giọng nói thiếu lực và ngôn ngữ hình thể chưa chuyên nghiệp. Khóa Luyện giọng & Kỹ năng giao tiếp đã giúp tôi 'gia cố' lại toàn bộ nền tảng. Giảng viên mài giũa cho tôi từng cách ngắt nghỉ, thần thái ánh mắt cho đến bản lĩnh xử lý tình huống. Bây giờ, tôi hoàn toàn tự tin khi đứng trước hội đồng quản trị và các đối tác lớn.&quot;
                  </p>
                  <p>— Anh Quốc Anh (Học viên khóa Kỹ năng Giao tiếp chuyên sâu, Hà Nội)</p>
                </div>
              </div>
            </div>

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

          <section>
            <div>
              <h2 style={{ fontWeight: 'bold' }}>
                VI. Kết Luận
              </h2>
            </div>

            <p className="mb-6">
              BT Academy cam kết là người bạn đồng hành tin cậy, giúp bạn và con bạn kiến tạo kỹ năng giao tiếp bền vững tại Hà Nội. Đừng để sự tự ti cản trở thành công của bạn!
            </p>

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
                    XEM LỊCH KHAI GIẢNG TẠI HÀ NỘI
                  </button>
                </Link>
              </div>
            </div>
          </section>

          <section className="mt-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="space-y-1.5">
                <p><strong>Trung Tâm Đào Tạo MC BT Academy</strong> – Đào tạo MC, Luyện Giọng & Kỹ năng giao tiếp</p>
                <p><strong>📍 Trụ sở chính:</strong> 19 Nguyễn Gia Thiều, Quận Hoàn Kiếm, Hà Nội.</p>
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

export default HocMCThuyetTrinhHaNoiPage;
