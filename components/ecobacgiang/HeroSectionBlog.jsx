import React from 'react';
import Link from 'next/link';

const HeroSectionBlog = ({
  label,
  badge = 'TIN TỨC & SỰ KIỆN',
  heading,
  highlightText = 'mới nhất',
  suffixText = 'tại BT Academy',
  showViewAll = true,
  viewAllLink = '/bai-viet',
  viewAllText = 'Xem tất cả bài viết',
}) => {
  const displayBadge = label ? label.toUpperCase() : badge;

  return (
    <section className="py-6 bg-white" aria-labelledby="blog-heading">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-left">
          {displayBadge && (
            <div className="flex items-center gap-1.5 text-xl md:text-xl font-semibold tracking-wider text-gray-500 uppercase mb-2">
              <span>{displayBadge}</span>
              <span className="text-gray-400 font-normal text-base leading-none">→</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h2 id="blog-heading" className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              {heading ? (
                heading
              ) : (
                <>
                  Bài viết & tin tức{" "}
                  <span className="text-green-600">
                    {highlightText}
                  </span>{" "}
                  {suffixText}
                </>
              )}
            </h2>

            {showViewAll && (
              <Link
                href={viewAllLink}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm md:text-base font-semibold text-green-600 hover:text-green-700 transition-colors whitespace-nowrap group"
              >
                <span>{viewAllText}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionBlog;
