import { useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'BT Academy đào tạo những khóa học nào?',
      answer:
        'BT Academy hiện đào tạo 3 mảng chính:\n• MC & Thuyết trình: cho trẻ em, sinh viên và người lớn.\n• Kỹ năng mềm cho cá nhân: giao tiếp, tự tin trước đám đông, xử lý tình huống.\n• Kỹ năng mềm cho doanh nghiệp: thuyết trình nội bộ, kỹ năng lãnh đạo, làm việc nhóm, chăm sóc khách hàng.',
    },
    {
      question: 'Ai là người trực tiếp giảng dạy?',
      answer:
        'Các lớp học được giảng dạy trực tiếp bởi ThS. Bích Thủy – giảng viên Báo chí ĐH KHXH&NV và là MC của Đài truyền hình VTC, cùng đội ngũ giảng viên có kinh nghiệm trong đào tạo kỹ năng và sân khấu.',
    },
    {
      question: 'Khóa học dành cho độ tuổi nào?',
      answer:
        'BT Academy có chương trình riêng phù hợp cho từng nhóm:\n• Trẻ em (6–15 tuổi): rèn sự tự tin, kỹ năng nói và biểu cảm trước đám đông.\n• Sinh viên – người lớn: tập trung vào kỹ năng thuyết trình, MC, phỏng vấn xin việc.\n• Doanh nghiệp: thiết kế theo nhu cầu riêng (training nội bộ, workshop).',
    },
    {
      question: 'Tôi không có năng khiếu MC thì có học được không?',
      answer:
        'Có. Chương trình của BT Academy không chỉ đào tạo MC chuyên nghiệp mà còn giúp bất kỳ ai rèn luyện sự tự tin, giọng nói và kỹ năng giao tiếp. Ai cũng có thể tiến bộ nếu được hướng dẫn đúng phương pháp.',
    },
    {
      question: 'Học tại BT Academy có khác gì so với học online trên mạng?',
      answer:
        'Điểm khác biệt là thực hành & kèm cặp trực tiếp:\n• Học viên được luyện tập ngay trên sân khấu, micro, camera.\n• Được chuyên gia chỉnh sửa từng chi tiết: giọng nói, ánh mắt, phong thái.\n• Được tham gia sự kiện, talkshow thực tế để áp dụng kỹ năng.',
    },
    {
      question: 'Khóa học kéo dài bao lâu?',
      answer:
        'Thông thường, một khóa học cơ bản kéo dài từ 8–12 buổi (2–3 buổi/tuần). Ngoài ra, BT Academy còn có các khóa cấp tốc (4–6 buổi) và khóa chuyên sâu (16–20 buổi) tùy mục tiêu học viên.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-white flex items-center " aria-labelledby="faq-heading">
      <div className="container mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: FAQ Section */}
          <div className="space-y-8">
            <div>
              <p className="text-gray-600 text-sm uppercase tracking-widest mb-4 font-medium">
                FAQ&apos;S
              </p>
              <h2 id="faq-heading" className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                Câu Hỏi{' '}
                <span className="relative">
                  Thường Gặp
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                    <path d="M2 8C20 4 40 2 60 6C80 10 100 8 120 4C140 0 160 2 180 6C198 10" stroke="#22C55E" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>{' '}
                Về BT Academy
            </h2>
             
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-tl-lg rounded-br-lg"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left focus:outline-none"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </h3>
                    {openIndex === index ? (
                      <FaChevronUp className="text-green-600 text-xl flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-green-600 text-xl flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div id={`faq-answer-${index}`} className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Images Section */}
          <div className="relative flex items-start justify-center gap-4 mt-8 pb-20">
            {/* Left Image - Higher position */}
            <div className="relative w-72 h-96 -mt-8 group">
              <Image
                src="/images/gallery/bt-23.jpg"
                alt="Student studying"
                fill
                className="object-cover shadow-lg rounded-tr-3xl rounded-bl-3xl transition-transform duration-300 group-hover:scale-105"
              />
              {/* Decorative dotted line */}
              <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:-translate-x-2 group-hover:-translate-y-3">
                <div className="w-6 h-1 bg-green-400 opacity-60" style={{
                  backgroundImage: 'radial-gradient(circle, #22C55E 1px, transparent 1px)',
                  backgroundSize: '6px 3px'
                }}></div>
              </div>
              <div className="absolute -top-3 -right-3 w-12 h-12 border-2 border-emerald-400 border-dashed rounded-full opacity-60 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
            </div>

            {/* Right Image - Lower position */}
            <div className="relative w-60 h-80 mt-12 group">
              <Image
                src="/images/gallery/bt-22.jpg"
                alt="Student writing"
                fill
                className="object-cover shadow-lg rounded-tl-3xl rounded-br-3xl transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -top-3 -right-3 w-10 h-10 border-2 border-emerald-400 border-dotted rounded-full opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"></div>
              <div className="absolute -left-6 top-6 w-12 h-12 bg-green-200 rounded-full opacity-40 transition-transform duration-300 group-hover:-translate-x-2 group-hover:translate-y-1"></div>
            </div>

            {/* Wavy line decoration */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
              <svg width="80" height="16" viewBox="0 0 80 16" fill="none">
                <path d="M2 8C8 4 16 12 24 8C32 4 40 12 48 8C56 4 64 12 72 8C76 6 78 8" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
