import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import DefaultLayout from '../components/layout/DefaultLayout';
import { Target, Rocket, Gem, CheckCircle, MessageCircle, Users, Mic, FileText, Star, Building, Smartphone, BarChart3, Award } from 'lucide-react';
import Link from 'next/link';

const AboutBTAcademyPage = () => {
  // SEO meta data
  const meta = {
    title: "Giới Thiệu BT Academy - Nơi Khai Phóng Giọng Nói, Nâng Tầm Giá Trị Bản Thân",
    description: "BT Academy - Học viện đào tạo MC, kỹ năng giao tiếp và thương hiệu cá nhân chuyên nghiệp. Phương pháp độc quyền 'Thực hành - Thu hình - Phản hồi' giúp bạn tự tin tỏa sáng.",
    keywords: "BT Academy, đào tạo MC, kỹ năng giao tiếp, luyện giọng nói, thuyết trình, thương hiệu cá nhân, Lê Bích Thủy",
    ogTitle: "BT Academy - Nơi Khai Phóng Giọng Nói, Nâng Tầm Giá Trị Bản Thân",
    ogDescription: "Học viện đào tạo MC và kỹ năng giao tiếp chuyên nghiệp với phương pháp độc quyền",
    ogImage: "/images/bt-academy-about-og.jpg",
    twitterCard: "summary_large_image"
  };

  // JSON-LD Schema cho tổ chức giáo dục
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "BT Academy",
    alternateName: "Học viện BT Academy",
    url: "https://btacademy.vn/gioi-thieu-bt-academy",
    logo: "https://btacademy.vn/logo.png",
    description: "BT Academy - Nơi khai phóng giọng nói, nâng tầm giá trị bản thân. Đào tạo MC, kỹ năng giao tiếp và thương hiệu cá nhân chuyên nghiệp.",
    founder: {
      "@type": "Person",
      name: "Lê Bích Thủy",
      jobTitle: "Nhà sáng lập BT Academy",
      description: "Nhà báo - ThS với hơn 10 năm kinh nghiệm trong lĩnh vực Báo chí - Truyền hình"
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressLocality: "Hà Nội"
    },
    offers: {
      "@type": "Offer",
      description: "Đào tạo MC chuyên nghiệp, luyện giọng nói, kỹ năng thuyết trình và xây dựng thương hiệu cá nhân",
      category: "Education"
    }
  };

  return (
    <DefaultLayout meta={meta}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="author" content="Lê Bích Thủy" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:url" content="https://btacademy.vn/gioi-thieu-bt-academy" />
        <meta property="og:site_name" content="BT Academy" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={meta.twitterCard} />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.ogDescription} />
        <meta name="twitter:image" content={meta.ogImage} />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://btacademy.vn/gioi-thieu-bt-academy" />
        
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out;
          }
          
          .animate-fadeInLeft {
            animation: fadeInLeft 0.8s ease-out;
          }
          
          .animate-fadeInRight {
            animation: fadeInRight 0.8s ease-out;
          }
          
          .animate-delay-200 {
            animation-delay: 0.2s;
            animation-fill-mode: both;
          }
          
          .animate-delay-400 {
            animation-delay: 0.4s;
            animation-fill-mode: both;
          }
          
          .hover-lift:hover {
            transform: translateY(-5px);
          }
          
          .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.9);
          }
        `}</style>
      </Head>
      <div className='h-[50px]'></div>
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl mb-12 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-2xl"></div>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white text-2xl font-bold">BT</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xl text-gray-700 mb-0 leading-relaxed">
                  <strong className="text-blue-700 text-2xl">BT Academy</strong> được sáng lập bởi <Link href="/gioi-thieu-bt-academy" className="text-blue-700 underline">Nhà báo - ThS Lê Bích Thủy</Link>, một người đã dành hơn 10 năm kinh nghiệm trong lĩnh vực Báo chí - Truyền hình để tìm ra con đường giúp mọi người tự tin tỏa sáng.
                </p>
              </div>
            </div>
          </div>

           {/* Vision Mission Values Section */}
           <section className="mb-20">
             <div className="text-center mb-12">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                 TẦM NHÌN - SỨ MỆNH - GIÁ TRỊ CỐT LÕI
               </h2>
               <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
               <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
                 Những giá trị cốt lõi định hướng sứ mệnh và tầm nhìn phát triển của BT Academy
               </p>
             </div>
             
             {/* Vision */}
             <div className="mb-10">
               <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                 <div className="flex items-center mb-6">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                     <Target className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-800">
                     Tầm nhìn (Vision)
                   </h3>
                 </div>
                 <p className="text-gray-700 leading-relaxed text-lg">
                   BT Academy đặt mục tiêu trở thành <strong className="text-blue-700">Học viện đào tạo kỹ năng chuyên nghiệp hàng đầu Việt Nam</strong>, là địa chỉ tin cậy cho các cá nhân, doanh nghiệp và tổ chức giáo dục. Với sự chuyên môn hóa cao trong lĩnh vực MC, Thuyết trình, Kỹ năng mềm, Xây dựng thương hiệu cá nhân và Truyền thông số, chúng tôi cam kết kiến tạo một thế hệ những người Việt Nam tự tin làm chủ ngôn từ và tỏa sáng.
                 </p>
               </div>
             </div>

             {/* Mission */}
             <div className="mb-10">
               <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                 <div className="flex items-center mb-6">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                     <Rocket className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-800">
                     Sứ mệnh (Mission)
                   </h3>
                 </div>
                 <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                   Sứ mệnh của <Link href="/nha-sang-lap" className="text-blue-700">BT Academy</Link> là truyền cảm hứng và nâng tầm giá trị con người. Chúng tôi không chỉ trang bị kiến thức và kỹ năng. Chúng tôi tạo ra một môi trường thúc đẩy sự thay đổi tích cực, giúp mỗi học viên:
                 </p>
                 <div className="grid md:grid-cols-1 gap-4">
                   <div className="flex items-start">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                       <CheckCircle className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-gray-700 leading-relaxed">Làm chủ kỹ năng giao tiếp và thuyết trình để truyền tải thông điệp một cách hiệu quả nhất.</span>
                   </div>
                   <div className="flex items-start">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                       <CheckCircle className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-gray-700 leading-relaxed">Xây dựng phong thái chuyên nghiệp và bản sắc thương hiệu cá nhân độc đáo.</span>
                   </div>
                   <div className="flex items-start">
                     <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                       <CheckCircle className="w-4 h-4 text-white" />
                     </div>
                     <span className="text-gray-700 leading-relaxed">Tự tin vươn lên và tạo ra những giá trị bền vững cho cộng đồng.</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* Core Values */}
             <div className="mb-10">
               <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                 <div className="flex items-center mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                     <Gem className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-800">
                     Giá trị cốt lõi (Core Values)
                   </h3>
                 </div>
                 <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
                     <div className="flex items-center mb-4">
                       <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 font-bold">
                         1
                       </div>
                       <h4 className="font-bold text-gray-800 text-lg">Chuyên môn & Chuẩn mực</h4>
                     </div>
                     <p className="text-gray-600 leading-relaxed">
                       Chúng tôi cam kết mang đến chất lượng đào tạo cao nhất, lấy chuẩn mực của ngành truyền hình và tiêu chuẩn quốc tế làm kim chỉ nam. Mọi phương pháp và giáo trình đều được đúc kết từ kinh nghiệm thực chiến, đảm bảo tính ứng dụng cao.
                     </p>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
                     <div className="flex items-center mb-4">
                       <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 font-bold">
                         2
                       </div>
                       <h4 className="font-bold text-gray-800 text-lg">Chính trực & Tử tế</h4>
                     </div>
                     <p className="text-gray-600 leading-relaxed">
                       Chúng tôi hoạt động dựa trên sự chính trực và tận tâm. Mỗi lời khuyên, mỗi bài giảng đều xuất phát từ tinh thần trách nhiệm cao nhất, tôn trọng và đồng hành cùng sự phát triển của học viên.
                     </p>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
                     <div className="flex items-center mb-4">
                       <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 font-bold">
                         3
                       </div>
                       <h4 className="font-bold text-gray-800 text-lg">Can đảm & Vươn lên</h4>
                     </div>
                     <p className="text-gray-600 leading-relaxed">
                       BT Academy là nơi khuyến khích sự bứt phá. Chúng tôi truyền cảm hứng để học viên dám đối mặt với nỗi sợ hãi, vượt qua giới hạn của bản thân và kiên trì theo đuổi mục tiêu.
                     </p>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
                     <div className="flex items-center mb-4">
                       <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center mr-3 font-bold">
                         4
                       </div>
                       <h4 className="font-bold text-gray-800 text-lg">Hiệu quả & Truyền cảm hứng</h4>
                     </div>
                     <p className="text-gray-600 leading-relaxed">
                       Mục tiêu cuối cùng của chúng tôi là sự thay đổi. Chúng tôi không chỉ đo lường hiệu quả qua kiến thức, mà còn qua sự tự tin và khả năng tạo ra giá trị thực tế của mỗi học viên.
                     </p>
                   </div>
                 </div>
               </div>
             </div>

           </section>

          {/* Training Areas Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Các Lĩnh Vực Đào Tạo
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
            </div>
            
            <p className="text-lg text-gray-700 mb-12 leading-relaxed text-center max-w-4xl mx-auto">
              BT Academy tự hào là một học viện đa năng, chuyên đào tạo các khóa học chất lượng cao, từ cơ bản đến chuyên sâu, phù hợp với mọi lứa tuổi và nhu cầu:
            </p>

            {/* Training Areas Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* MC Training */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/mc-training.jpg"
                    alt="Đào tạo MC chuyên nghiệp"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      MC
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Đào tạo MC chuyên nghiệp
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Dành cho người lớn và trẻ em, từ MC sự kiện, MC truyền hình đến MC livestream.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                    <span>Khám phá ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Voice Training */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/voice-training.jpg"
                    alt="Luyện giọng nói, chữa ngọng"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      <Mic className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Luyện giọng nói, Chữa ngọng
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Khắc phục các lỗi về phát âm, giúp học viên có một giọng nói chuẩn mực, truyền cảm và tự tin.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                    <span>Khám phá ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Presentation Skills */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/presentation-skills.jpg"
                    alt="Kỹ năng thuyết trình"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Kỹ năng thuyết trình
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Rèn luyện sự tự tin, làm chủ ngôn ngữ cơ thể và kỹ năng đặt câu hỏi, giúp bạn trở thành một diễn giả lôi cuốn.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                    <span>Khám phá ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Personal Branding */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/personal-branding.jpg"
                    alt="Kỹ năng mềm và xây dựng thương hiệu cá nhân"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      <Star className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Kỹ năng mềm và Xây dựng thương hiệu cá nhân
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Trang bị cho học viên những kỹ năng cốt lõi để thành công, giúp họ định hình và phát triển thương hiệu cá nhân một cách bền vững trên mọi nền tảng.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                    <span>Khám phá ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Corporate Training */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/corporate-training.jpg"
                    alt="Đào tạo cho doanh nghiệp"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      <Building className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Đào tạo cho doanh nghiệp
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cung cấp các khóa học chuyên biệt về kỹ năng giao tiếp, phong thái, thần thái và kỹ năng bán hàng để nâng cao năng lực cho đội ngũ.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                    <span>Khám phá ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Digital Communication */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/digital-communication.jpg"
                    alt="Truyền thông số và Content Creation"
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      <Smartphone className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    Truyền thông số & Content Creation
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Đào tạo kỹ năng tạo nội dung, livestream, podcast và sử dụng hiệu quả các nền tảng số để xây dựng thương hiệu cá nhân mạnh mẽ.
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                    <span>Khám phá ngay</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Method Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-200">
              Phương Pháp Đào Tạo
            </h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Với kinh nghiệm của đội ngũ chuyên gia, chúng tôi mang đến những phương pháp giảng dạy đa dạng, hiện đại, linh hoạt giúp học viên có thể tiếp thu kiến thức một cách hào hứng, chủ động và áp dụng được ngay các kiến thức, kỹ năng vào thực tế.
            </p>

            {/* 5C Communication Principles */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Nguyên tắc giao tiếp 5C
              </h3>
              <div className="grid md:grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    C1
                  </div>
                  <p className="text-base font-semibold text-gray-800">Clear</p>
                  <p className="text-base text-gray-600">(rõ ràng)</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    C2
                  </div>
                  <p className="text-base font-semibold text-gray-800">Complete</p>
                  <p className="text-base text-gray-600">(hoàn chỉnh)</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    C3
                  </div>
                  <p className="text-base font-semibold text-gray-800">Concise</p>
                  <p className="text-base text-gray-600">(súc tích)</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    C4
                  </div>
                  <p className="text-base font-semibold text-gray-800">Correct</p>
                  <p className="text-base text-gray-600">(chính xác)</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    C5
                  </div>
                  <p className="text-base font-semibold text-gray-800">Courteous</p>
                  <p className="text-base text-gray-600">(lịch sự)</p>
                </div>
              </div>
            </div>

            {/* Interactive Activities */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Các hoạt động tương tác
              </h3>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="flex items-center">
                   <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                     <MessageCircle className="w-4 h-4" />
                   </div>
                   <span className="text-gray-700">Trao đổi, thảo luận (Brain Storming)</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                     <Users className="w-4 h-4" />
                   </div>
                   <span className="text-gray-700">Làm việc nhóm (Teamwork)</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                     <Mic className="w-4 h-4" />
                   </div>
                   <span className="text-gray-700">Thuyết trình (Presentation)</span>
                 </div>
                 <div className="flex items-center">
                   <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                     <FileText className="w-4 h-4" />
                   </div>
                   <span className="text-gray-700">Giải quyết bài tập tình huống thực tế</span>
                 </div>
               </div>
            </div>

            {/* Practical Training */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Thực hành thực tế
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Thực hành dẫn tại trường quay ảo, sử dụng giáo cụ trực quan để học viên có trải nghiệm chân thật nhất.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Phương pháp học: <span className="text-blue-700">&quot;Thực hành - Thu hình - Phản hồi&quot;</span>
            </h3>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              Mỗi học viên sẽ được ghi lại quá trình thực hành và nhận phản hồi chi tiết từ giảng viên để khắc phục điểm yếu và phát huy điểm mạnh. Đây là phương pháp đã giúp MC Bích Thủy thành công, và giờ đây, nó sẽ là &quot;công thức&quot; giúp học viên tự tin hơn mỗi ngày.
            </p>

            {/* Method Steps */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Thực hành</h3>
                <p className="text-gray-600 text-sm">
                  Được trải nghiệm các tình huống thực tế, đứng trước ống kính và sân khấu ngay tại lớp học.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Thu hình</h3>
                <p className="text-gray-600 text-sm">
                  Toàn bộ quá trình thực hành được ghi lại, giúp học viên có thể tự mình xem lại và đánh giá sự tiến bộ.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Phản hồi</h3>
                <p className="text-gray-600 text-sm">
                  Nhận được những góp ý chi tiết, chuyên sâu từ giảng viên để khắc phục điểm yếu và phát huy điểm mạnh.
                </p>
              </div>
            </div>

            {/* Method Highlight Box */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bằng Chứng Thành Công</h3>
                  <p className="text-blue-100 italic leading-relaxed">
                    Chúng tôi tin rằng, bằng chứng rõ ràng nhất cho sự thành công chính là sự tiến bộ của mỗi học viên.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-blue-200">
              BT Academy - Nói Hay, Tỏa Sáng
            </h2>
            
            {/* Final Images */}
            <div className="grid md:grid-cols-2 gap-6 mb-3">
              <div>
                <Image
                  src="/images/gallery/hoc-vien-bt.jpg"
                  alt="Học viên thành công tại BT Academy"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md w-full"
                />
                <p className="text-base text-gray-500 mt-1 text-center">
                  Học viên tại BT Academy
                </p>
              </div>
              <div>
                <Image
                  src="/images/gallery/mc-nhi-bt-02.jpg"
                  alt="Lễ tốt nghiệp BT Academy"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md w-full"
                />
                <p className="text-base text-gray-500 mt-1 text-center">
                  Lễ tốt nghiệp
                </p>
              </div>
            </div>
            
            <p className="text-gray-700  leading-relaxed">
              Hơn cả một nơi học tập, BT Academy là một môi trường truyền cảm hứng, nơi mỗi học viên được khuyến khích vượt qua giới hạn của bản thân. Hãy để chúng tôi đồng hành cùng bạn trên hành trình khám phá và phát triển, để mỗi lời nói đều mang sức mạnh và mỗi lần xuất hiện đều là một lần tỏa sáng.
            </p>
                 {/* Contact Information Section */}
          <section className="mt-8 mb-8">
            <div className=" ">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Thông tin liên hệ :
              </h2>
              
              <div className="space-y-3 text-gray-700">
                <p><strong>BT Academy</strong> – Trung tâm đào tạo giọng nói, MC, thuyết trình & kỹ năng mềm</p>
                <p><strong>Hotline/Zalo:</strong> <a href="tel:0988027494" className="text-blue-600 hover:text-blue-700">0988 02 7494</a></p>
                <p><strong>CS1 - Hà Nội:</strong> 19 Nguyễn Gia Thiều, Hoàn Kiếm, Hà Nội</p>
                <p><strong>CS2 - Thái Nguyên:</strong> Tòa nhà Viettel, Số 4 Hoàng Văn Thụ, Thái Nguyên</p>
                <p><strong>Website:</strong> <a href="https://btacademy.com.vn" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">btacademy.com.vn</a></p>
              </div>
            </div>
          </section>
         
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AboutBTAcademyPage;
