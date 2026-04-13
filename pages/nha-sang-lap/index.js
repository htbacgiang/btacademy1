import React from 'react';
import Head from 'next/head';
import FounderProfile from '../../components/about/FounderProfile';
import EducationExperience from '../../components/about/EducationExperience';
import MediaCoverage from '../../components/about/MediaCoverage';
import PhotoGallery from '../../components/about/PhotoGallery';
import DefaultLayout from '../../components/layout/DefaultLayout';

const FounderPage = () => {
  const meta = {
    title: 'Lê Bích Thủy - Nhà sáng lập BT Academy',
    description:
      'Tìm hiểu về Nhà báo - ThS Lê Bích Thủy, Nhà sáng lập BT Academy, với hơn 10 năm kinh nghiệm trong lĩnh vực Báo chí - Truyền hình và đào tạo kỹ năng giao tiếp.',
    keywords:
      'Lê Bích Thủy, Nhà sáng lập BT Academy, BT Academy, đào tạo MC, kỹ năng giao tiếp, luyện giọng, thuyết trình, personal branding',
    canonical: 'https://btacademy.com.vn/nha-sang-lap',
    og: {
      title: 'Lê Bích Thủy - Nhà sáng lập BT Academy',
      description:
        'Tìm hiểu về Nhà báo - ThS Lê Bích Thủy, Nhà sáng lập BT Academy, với hơn 10 năm kinh nghiệm Báo chí - Truyền hình.',
      type: 'profile',
      image: 'https://btacademy.com.vn/images/mc-bich-thuy.jpg',
      url: 'https://btacademy.com.vn/nha-sang-lap',
      siteName: 'BT Academy',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lê Bích Thủy - Nhà sáng lập BT Academy',
      description:
        'Tìm hiểu về Nhà báo - ThS Lê Bích Thủy, Nhà sáng lập BT Academy, với hơn 10 năm kinh nghiệm Báo chí - Truyền hình.',
      image: 'https://btacademy.com.vn/images/mc-bich-thuy.jpg',
    },
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: meta.title,
    description: meta.description,
    url: meta.canonical,
    mainEntity: {
      '@type': 'Person',
      name: 'Lê Bích Thủy',
      jobTitle: 'Nhà sáng lập BT Academy',
      worksFor: {
        '@type': 'EducationalOrganization',
        name: 'BT Academy',
        url: 'https://btacademy.com.vn',
      },
      image: meta.og.image,
    },
  };

  return (
    <DefaultLayout title={meta.title} desc={meta.description} thumbnail={meta.og.image}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="author" content="Lê Bích Thủy" />

        <link rel="canonical" href={meta.canonical} />

        <meta property="og:title" content={meta.og.title} />
        <meta property="og:description" content={meta.og.description} />
        <meta property="og:type" content={meta.og.type} />
        <meta property="og:image" content={meta.og.image} />
        <meta property="og:url" content={meta.og.url} />
        <meta property="og:site_name" content={meta.og.siteName} />

        <meta name="twitter:card" content={meta.twitter.card} />
        <meta name="twitter:title" content={meta.twitter.title} />
        <meta name="twitter:description" content={meta.twitter.description} />
        <meta name="twitter:image" content={meta.twitter.image} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div className="h-[80px] bg-white"></div>
      
      <h1 className="visually-hidden">{meta.title}</h1>
      <FounderProfile />
      <EducationExperience />
      <PhotoGallery />
      <MediaCoverage />
    </DefaultLayout>
  );
};

export default FounderPage;
