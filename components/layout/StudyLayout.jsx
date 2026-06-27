import React from "react";
import Head from "next/head";
import ModernNavbar from "../header/ModernNavbar";

const StudyLayout = ({ children, meta = {} }) => {
  const {
    title = "HiStudy - Innovative Language Academic Platform",
    description = "Join over 3000+ students in our innovative language learning platform. Master new languages with our cutting-edge academic approach designed for your career growth.",
    keywords = "language learning, education, academic platform, career development, online courses",
    robots = "index, follow",
    author = "HiStudy Team",
    canonical = "",
    og = {},
    twitter = {},
  } = meta;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content={robots} />
        <meta name="author" content={author} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={og.title || title} />
        <meta property="og:description" content={og.description || description} />
        <meta property="og:type" content={og.type || "website"} />
        <meta property="og:url" content={og.url || canonical} />
        <meta property="og:image" content={og.image || "/images/og-image.jpg"} />
        <meta property="og:image:width" content={og.imageWidth || "1200"} />
        <meta property="og:image:height" content={og.imageHeight || "630"} />
        
        {/* Twitter */}
        <meta name="twitter:card" content={twitter.card || "summary_large_image"} />
        <meta name="twitter:title" content={twitter.title || title} />
        <meta name="twitter:description" content={twitter.description || description} />
        <meta name="twitter:image" content={twitter.image || "/images/og-image.jpg"} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-white">
        <ModernNavbar />
        <main>{children}</main>
      </div>
    </>
  );
};

export default StudyLayout;
