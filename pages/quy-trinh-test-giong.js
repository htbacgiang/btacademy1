import { useState } from 'react';
import Head from 'next/head';
import DefaultLayout from '../components/layout/DefaultLayout';
import VoiceTestPopup from '../components/common/VoiceTestPopup';

const QuyTrinhTestGiong = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Đăng ký test giọng",
      icon: "📞",
      description: "Liên hệ với BT Academy qua hotline, Zalo hoặc điền form đăng ký",
      details: [
        "Gọi hotline: 0909.123.456",
        "Nhắn tin Zalo: 0909.123.456", 
        "Điền form đăng ký trên website",
        "Chuyên viên tư vấn sẽ liên lạc trong vòng 15 phút"
      ],
      tips: [
        "Chuẩn bị sẵn thông tin cá nhân",
        "Chọn thời gian phù hợp để nhận cuộc gọi",
        "Có thể đăng ký bất kỳ lúc nào trong ngày"
      ]
    },
    {
      id: 2,
      title: "Nhận bài test",
      icon: "📋",
      description: "Nhận bài test giọng độc quyền từ BT Academy",
      details: [
        "Bài test được thiết kế riêng cho từng loại giọng",
        "Bao gồm các đoạn văn bản đa dạng",
        "Có hướng dẫn chi tiết cách đọc",
        "Thời gian hoàn thành: 10-15 phút"
      ],
      tips: [
        "Đọc kỹ hướng dẫn trước khi bắt đầu",
        "Chuẩn bị môi trường yên tĩnh",
        "Có thể thực hiện nhiều lần để có kết quả tốt nhất"
      ]
    },
    {
      id: 3,
      title: "Ghi âm bài test",
      icon: "🎤",
      description: "Ghi âm hoặc quay video bài test và gửi lại",
      details: [
        "Sử dụng điện thoại hoặc máy tính để ghi âm",
        "Đảm bảo chất lượng âm thanh rõ ràng",
        "Đọc với tốc độ bình thường, tự nhiên",
        "Gửi file qua Zalo, email hoặc upload trực tiếp"
      ],
      tips: [
        "Chọn nơi yên tĩnh, không có tiếng ồn",
        "Giữ khoảng cách 15-20cm từ micro",
        "Đọc với giọng tự nhiên, không cố gắng thay đổi",
        "Có thể ghi âm nhiều lần và chọn bản tốt nhất"
      ]
    },
    {
      id: 4,
      title: "Đánh giá và tư vấn",
      icon: "📊",
      description: "Nhận kết quả đánh giá và lộ trình phát triển",
      details: [
        "Phân tích chi tiết về chất giọng của bạn",
        "Đánh giá điểm mạnh và điểm cần cải thiện",
        "Đưa ra lộ trình học tập phù hợp",
        "Tư vấn về các khóa học phù hợp"
      ],
      tips: [
        "Lắng nghe kỹ phần phân tích",
        "Đặt câu hỏi nếu có thắc mắc",
        "Thảo luận về mục tiêu học tập",
        "Chuẩn bị câu hỏi về lộ trình phát triển"
      ]
    }
  ];

  const faqs = [
    {
      question: "Test giọng có mất phí không?",
      answer: "Hoàn toàn miễn phí! BT Academy cung cấp dịch vụ test giọng miễn phí để giúp bạn hiểu rõ về chất giọng của mình."
    },
    {
      question: "Mất bao lâu để có kết quả?",
      answer: "Thông thường, bạn sẽ nhận được kết quả đánh giá trong vòng 24-48 giờ sau khi gửi bài test."
    },
    {
      question: "Cần chuẩn bị gì trước khi test giọng?",
      answer: "Bạn chỉ cần chuẩn bị một môi trường yên tĩnh, thiết bị ghi âm (điện thoại/máy tính) và khoảng 15-20 phút thời gian."
    },
    {
      question: "Có thể test giọng nhiều lần không?",
      answer: "Có, bạn có thể thực hiện test giọng nhiều lần để có kết quả tốt nhất. Chúng tôi khuyến khích bạn ghi âm nhiều lần và chọn bản tốt nhất."
    },
    {
      question: "Kết quả test giọng có chính xác không?",
      answer: "Kết quả được đánh giá bởi các chuyên gia có kinh nghiệm trong lĩnh vực giọng nói và phát thanh truyền hình, đảm bảo độ chính xác cao."
    }
  ];

  return (
    <DefaultLayout>
      <Head>
        <title>Quy Trình Test Giọng Miễn Phí - BT Academy</title>
        <meta name="description" content="Hướng dẫn chi tiết quy trình test giọng miễn phí tại BT Academy. Đăng ký ngay để được đánh giá chuyên nghiệp về chất giọng của bạn." />
        <meta name="keywords" content="test giọng, đánh giá giọng nói, BT Academy, phát thanh viên, voice test" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
          </div>
    
        </section>

        {/* Process Section */}
        <section id="process-section" className="py-20">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                4 Bước Đơn Giản
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quy trình test giọng tại BT Academy được thiết kế đơn giản, dễ thực hiện và hoàn toàn miễn phí
              </p>
            </div>

            {/* All Steps Content */}
            <div className="max-w-4xl mx-auto space-y-12">
              {steps.map((step, index) => (
                <div key={step.id} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                  <div className="flex items-start space-x-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-blue-600">{step.id}</span>
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-4">{step.icon}</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {step.title}
                        </h3>
                      </div>
                      
                      <p className="text-lg text-gray-600 mb-6">
                        {step.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                            Chi tiết thực hiện
                          </h4>
                          <ul className="space-y-3">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-600">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                            Mẹo hay
                          </h4>
                          <ul className="space-y-3">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start">
                                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-gray-600">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="w-1 h-12 bg-gradient-to-b from-blue-200 to-indigo-200 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Tại Sao Nên Test Giọng Tại BT Academy?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Chuyên nghiệp</h3>
                <p className="text-gray-600">
                  Đánh giá bởi các chuyên gia có kinh nghiệm trong lĩnh vực phát thanh truyền hình
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Miễn phí</h3>
                <p className="text-gray-600">
                  Hoàn toàn miễn phí, không có chi phí ẩn hay điều kiện ràng buộc
                </p>
              </div>

              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Nhanh chóng</h3>
                <p className="text-gray-600">
                  Nhận kết quả trong 24-48 giờ với lộ trình phát triển cụ thể
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-xl text-gray-600">
                Những thắc mắc phổ biến về quy trình test giọng
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="container mx-auto px-6 lg:px-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Sẵn Sàng Khám Phá Tiềm Năng Giọng Nói?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Đăng ký test giọng miễn phí ngay hôm nay và nhận đánh giá chuyên nghiệp từ các chuyên gia BT Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Đăng ký test giọng ngay
              </button>
              <a 
                href="tel:0909123456"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300"
              >
                Gọi hotline: 0909.123.456
              </a>
            </div>
          </div>
        </section>

        {/* Voice Test Popup */}
        <VoiceTestPopup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
        />
      </div>
    </DefaultLayout>
  );
};

export default QuyTrinhTestGiong;
