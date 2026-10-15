import React, { useState } from "react";
import { FaqItem } from "../../utils/types";

interface Props {
  faq: FaqItem[];
  title?: string;
}

const PostFaqAccordion: React.FC<Props> = ({
  faq,
  title = "Câu hỏi thường gặp",
}) => {
  // Mặc định mở câu hỏi đầu tiên
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  if (!faq || faq.length === 0) return null;

  const toggleItem = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (openIndices.length === faq.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(faq.map((_, i) => i));
    }
  };

  const isAllOpen = openIndices.length === faq.length;

  return (
    <section
      className="mt-12 pt-8 border-t border-gray-150 dark:border-gray-700 faq-section"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#105d97] dark:text-blue-300 flex items-center justify-center font-bold text-lg shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Giải đáp nhanh các thắc mắc phổ biến nhất về chủ đề này
            </p>
          </div>
        </div>

        {faq.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-semibold text-[#105d97] dark:text-blue-400 hover:underline self-start sm:self-center px-3 py-1.5 rounded-lg bg-blue-50/70 dark:bg-blue-900/30 transition"
          >
            {isAllOpen ? "Thu gọn tất cả" : "Mở tất cả"}
          </button>
        )}
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {faq.map((item, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-[#105d97]/40 bg-blue-50/20 dark:bg-blue-900/10 shadow-sm"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {/* Question button */}
              <button
                type="button"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 select-none group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-[#105d97] text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-blue-100 group-hover:text-[#105d97]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <h3
                    itemProp="name"
                    className={`font-semibold text-base sm:text-lg transition-colors leading-snug ${
                      isOpen
                        ? "text-[#105d97] dark:text-blue-400"
                        : "text-gray-800 dark:text-gray-200 group-hover:text-[#105d97] dark:group-hover:text-blue-300"
                    }`}
                  >
                    {item.question}
                  </h3>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen
                      ? "transform rotate-180 bg-blue-100 dark:bg-blue-900/50 text-[#105d97] dark:text-blue-300"
                      : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Answer content */}
              {isOpen && (
                <div
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className="px-5 pb-5 pt-1 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base border-t border-blue-100/60 dark:border-gray-700/60"
                >
                  <p itemProp="text" className="whitespace-pre-line">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PostFaqAccordion;
