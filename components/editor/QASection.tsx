import React from "react";
import { FiZap } from "react-icons/fi";
import { FaqItem } from "../../utils/types";

interface Props {
  value: FaqItem[];
  onChange: (faq: FaqItem[]) => void;
  onGenerateAi?: () => void;
  isGenerating?: boolean;
}

const QASection: React.FC<Props> = ({
  value = [],
  onChange,
  onGenerateAi,
  isGenerating = false,
}) => {
  const handleAddFaq = () => {
    onChange([...value, { question: "", answer: "" }]);
  };

  const handleUpdate = (index: number, field: "question" | "answer", val: string) => {
    const updated = value.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === value.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...value];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const addQuickTemplate = (templateQuestion: string, templateAnswer: string = "") => {
    onChange([...value, { question: templateQuestion, answer: templateAnswer }]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-[#105d97] font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Hỏi đáp thường gặp (Q&A / FAQ)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Chuẩn GEO & AIO
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Tự động xuất Schema <strong>FAQPage</strong> cho Google AI Overviews, Perplexity & Bing Copilot và hiển thị Accordion trực quan tại giao diện bài viết.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onGenerateAi && (
            <button
              type="button"
              onClick={onGenerateAi}
              disabled={isGenerating}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              title="Dùng Gemini AI tự động đọc bài viết và tạo 3-5 câu hỏi thường gặp"
            >
              <FiZap
                size={14}
                className={isGenerating ? "animate-spin text-purple-600" : "text-purple-600"}
              />
              <span>{isGenerating ? "Đang tạo FAQ..." : "✨ Tạo FAQ với Gemini"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#105d97] hover:bg-[#0d4d7c] text-white text-sm font-medium rounded-lg transition-colors shadow-sm shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm câu hỏi
          </button>
        </div>
      </div>

      {/* Quick Suggestion Pills */}
      <div className="pt-3 pb-2">
        <span className="text-xs font-medium text-gray-500 mr-2">Gợi ý câu hỏi nhanh:</span>
        <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
          {[
            "Khóa học phù hợp với những ai?",
            "Thời gian và lịch học như thế nào?",
            "Học xong có được cấp chứng chỉ không?",
            "Học phí và ưu đãi đăng ký sớm ra sao?",
          ].map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addQuickTemplate(suggestion)}
              className="text-xs bg-gray-100 hover:bg-blue-50 hover:text-[#105d97] hover:border-blue-200 border border-transparent text-gray-700 px-2.5 py-1 rounded-md transition-all"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="mt-4 space-y-4">
        {value.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#105d97] flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-800">Chưa có câu hỏi thường gặp nào</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
              Các bài viết có phần Q&A đạt tỷ lệ xuất hiện trên Google AI Overviews và các công cụ tìm kiếm AI (Perplexity, ChatGPT Search) cao hơn đến 40%.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {onGenerateAi && (
                <button
                  type="button"
                  onClick={onGenerateAi}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <FiZap size={14} className={isGenerating ? "animate-spin" : ""} />
                  <span>{isGenerating ? "Đang tạo bằng Gemini..." : "✨ Tự động tạo bằng Gemini AI"}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition"
              >
                + Thêm thủ công
              </button>
            </div>
          </div>
        ) : (
          value.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/40 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#105d97] text-white text-xs font-bold flex items-center justify-center">
                    Q{index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Câu hỏi #{index + 1}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Move Up */}
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMove(index, "up")}
                    title="Di chuyển lên"
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 rounded transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>

                  {/* Move Down */}
                  <button
                    type="button"
                    disabled={index === value.length - 1}
                    onClick={() => handleMove(index, "down")}
                    title="Di chuyển xuống"
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-400 rounded transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    title="Xóa câu hỏi này"
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition ml-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Câu hỏi:
                </label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => handleUpdate(index, "question", e.target.value)}
                  placeholder="VD: Học kỹ năng thuyết trình tại BT Academy mất bao lâu?"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none transition"
                />
              </div>

              {/* Answer Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Câu trả lời trực diện:
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {item.answer ? `${item.answer.trim().split(/\s+/).filter(Boolean).length} từ` : "0 từ"} (Khuyến nghị 40-70 từ cho GEO/AIO)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => handleUpdate(index, "answer", e.target.value)}
                  placeholder="VD: Khóa học thuyết trình tại BT Academy kéo dài từ 8 đến 12 buổi học thực hành chuyên sâu. Học viên sẽ được giảng viên cầm tay chỉ việc, rèn luyện kỹ năng làm chủ sân khấu và tự tin giao tiếp trước đám đông..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none transition resize-y"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* GEO & AIO Optimization Guide Footer */}
      <div className="mt-5 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
        <div className="font-semibold flex items-center gap-1.5 text-[#105d97] mb-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Mẹo tối ưu GEO & AIO (Generative Engine & AI Optimization):
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-gray-700 pl-1">
          <li>
            <strong>Câu hỏi:</strong> Sử dụng văn phong truy vấn tự nhiên (ai, ở đâu, khi nào, có nên, chi phí bao nhiêu...).
          </li>
          <li>
            <strong>Câu trả lời:</strong> Trả lời trực diện vào câu hỏi ngay ở 1-2 câu đầu tiên, sau đó mở rộng giải thích chi tiết.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QASection;
