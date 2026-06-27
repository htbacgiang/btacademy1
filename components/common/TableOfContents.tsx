import React, { useState } from "react";

export interface HeadingItem {
  text: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default

  if (!headings || headings.length === 0) return null;

  return (
    <div className="mb-8 border border-gray-200 rounded-xl bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 transition-all duration-300 shadow-sm overflow-hidden not-prose">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 font-bold text-gray-800 dark:text-gray-200 text-base md:text-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2.5">
          <svg
            className="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          Mục lục bài viết
        </span>
        <span className="bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-700 rounded-full p-1 shadow-sm transition-transform duration-300">
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[800px] border-t border-gray-150 dark:border-slate-800 p-4" : "max-h-0"
        }`}
      >
        <ul className="space-y-2.5 text-base text-gray-700 dark:text-gray-300 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent m-0 p-0">
          {headings.map((heading) => {
            const isH3 = heading.level === 3;
            return (
              <li
                key={heading.id}
                className={`${
                  isH3
                    ? "pl-6 border-l border-gray-200 dark:border-slate-800 ml-2"
                    : ""
                } list-none m-0 p-0`}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(heading.id);
                    if (element) {
                      const offset = 100; // Space for fixed header
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                      
                      // Highlight effect for the target heading briefly
                      element.classList.add("bg-gray-100/50", "dark:bg-slate-800/50", "transition-colors", "duration-500");
                      setTimeout(() => {
                        element.classList.remove("bg-gray-100/50", "dark:bg-slate-800/50");
                      }, 2000);
                    }
                  }}
                  className={
                    isH3
                      ? "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors block py-0.5 text-sm not-italic font-normal"
                      : "text-gray-800 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white hover:underline transition-colors block py-0.5 font-semibold not-italic"
                  }
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
