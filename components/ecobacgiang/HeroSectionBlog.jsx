import React from 'react';

const HeroSectionBlog = ({ label = 'Blog BT Academy', heading = '' }) => {
  return (
    <section
      className="py-8 px-4 flex flex-col items-center justify-center "
      aria-labelledby="hero-heading"
    >
      {/* Label */}
      <div className="text-green-700 uppercase text-lg md:text-xl font-bold tracking-wider mb-6 bg-slate-100 px-6 py-2 rounded-full shadow-xl">
        {label}
      </div>
    </section>
  );
};

export default HeroSectionBlog;