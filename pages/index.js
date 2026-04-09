// pages/index.js
import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";
import HeroBanner from "../components/common/HeroBanner";
import AboutSection from "../components/common/AboutSection";
import OrganicProcess from "../components/about/OrganicProcess";
import PostCard from "../components/common/PostCard";
import { readPostsFromDb, formatPosts } from "../lib/utils";
import HeroSectionBlog from "../components/ecobacgiang/HeroSectionBlog";
import FQSection from "../components/btacademy/FAQSection";
import NewsletterSignup from "../components/ecobacgiang/NewsletterSignup";
import FeaturedCourses from '../components/common/FeaturedCourses';
import TeachersSection from '../components/common/TeachersSection';
import teachersData from '../data/teachers.json';
import { ScrollingGallery } from '../components/gallery';
import VideoGallery from '../components/common/VideoGallery';

export default function Home({ posts, meta }) {
  // JSON-LD Schema.org cho BT Academy
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "BT Academy",
    alternateName: "Trung tâm đào tạo MC BT Academy",
    url: "https://btacademy.com.vn",
    logo: "https://btacademy.com.vn/logobtacademy.png",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61564432965502",
      "https://www.youtube.com/@BíchThủy-h2r",
      "https://www.instagram.com/daotaomc",
    ],
    description:
      "BT Academy - Trung tâm đào tạo MC, Thuyết trình, Giọng nói hàng đầu tại Hà Nội và Thái Nguyên với đội ngũ giảng  viên giàu kinh nghiệm.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "VN",
      addressLocality: "Hà Nội",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+84-988027494",
      contactType: "customer service",
    },
    offers: {
      "@type": "Offer",
      description: "Khóa học đào tạo MC chuyên nghiệp",
      category: "Education",
    },
  };

  return (
    <DefaultLayout meta={meta}>
      <Head>
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      {/* <BirthdayPopup /> */}
      <h1 className="sr-only">
        BT Academy - Trung tâm đào tạo MC chuyên nghiệp - Khóa học dẫn chương trình, phát thanh viên, luyện giọng nói hàng đầu tại Hà Nội và Thái Nguyên
      </h1>
      <HeroBanner />
      <AboutSection />
      <FeaturedCourses />
      <TeachersSection 
        teachers={teachersData.slice(0, 3)}
        title="Đội ngũ giảng viên"
        subtitle="Những chuyên gia hàng đầu trong lĩnh vực MC"
      />
      <OrganicProcess />
      <ScrollingGallery />
      <VideoGallery maxVideos={6} />
      <HeroSectionBlog />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 px-2 pb-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      <FQSection />
      <NewsletterSignup />
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  let posts = [];
  try {
    const raw = await readPostsFromDb(8, 0);
    posts = formatPosts(raw);
  } catch (error) {
    console.error("Failed to load posts for home page:", error);
  }

  // SEO meta cho BT Academy
  const meta = {
    title: "BT Academy – Trung tâm đào tạo MC, Thuyết trình, Giọng nói hàng đầu tại Hà Nội và Thái Nguyên",
    description:
      "BT Academy - Trung tâm đào tạo MC, Giọng nói, Thuyết trình, Dẫn chương trình, Phát thanh viên chuyên nghiệp hàng đầu Hà Nội và Thái Nguyên. Khóa học MC từ cơ bản đến nâng cao với đội ngũ giảng viên giàu kinh nghiệm từ các đài truyền hình lớn.",
    keywords:
      "BT Academy, đào tạo MC, dẫn chương trình, phát thanh viên, khóa học MC, MC chuyên nghiệp, đào tạo truyền hình, MC VTV, MC HTV, học MC online, khóa học MC cơ bản, khóa học MC nâng cao",
    robots: "index, follow",
    author: "BT Academy",
    canonical: "https://btacademy.com.vn",
    og: {
      title: "BT Academy – Trung tâm đào tạo MC, Thuyết trình, Giọng nói hàng đầu tại Hà Nội và Thái Nguyên",
      description:
        "BT Academy - Trung tâm đào tạo MC, dẫn chương trình, phát thanh viên chuyên nghiệp với đội ngũ giảng  viên giàu kinh nghiệm từ các đài truyền hình lớn.",
      type: "website",
      image: "https://btacademy.com.vn/images/banner-bta.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://btacademy.com.vn",
    },
    twitter: {
      card: "summary_large_image",
      title: "BT Academy – Trung tâm đào tạo MC, Thuyết trình, Giọng nói hàng đầu tại Hà Nội và Thái Nguyên",
      description:
        "BT Academy - Trung tâm đào tạo MC, dẫn chương trình, phát thanh viên chuyên nghiệp với đội ngũ giảng  viên giàu kinh nghiệm.",
      image: "https://btacademy.com.vn/banner-bta.png",
    },
  };

  return {
    props: { posts, meta },
  };
}
