import Head from "next/head";
import Link from "next/link";
import Image from "next/image"; // Cần thiết để tối ưu ảnh
import { useState, useEffect } from "react"; // Hook để xử lý đếm số lượng thực tế
import { FaArrowRight, FaFacebook, FaPlayCircle, FaYoutube, FaCheckCircle } from "react-icons/fa";
import VideoGallery from "../../components/common/VideoGallery";
import DefaultLayout from "../../components/layout/DefaultLayout";

const meta = {
  title: "Thư viện Video Học Viên | BT Academy",
  description: "Khám phá các video thực chiến, hoạt động lớp học và thành tích nổi bật của học viên tại Trung tâm Đào tạo MC BT Academy.",
  keywords: "video BT Academy, đào tạo MC, kỹ năng thuyết trình, học viên thực chiến",
  canonical: "https://btacademy.com.vn/video-hoc-vien",
  og: {
    title: "Video Học Viên BT Academy - Tự tin tỏa sáng",
    description: "Xem khoảnh khắc thực chiến và sự thay đổi của học viên sau khóa học.",
    type: "website",
    image: "https://btacademy.com.vn/images/banner-bta.jpg",
    url: "https://btacademy.com.vn/video-hoc-vien",
  },
};

// Mảng dữ liệu cố định
const STUDENTS_AVATARS = [
  { id: 1, src: "/images/hoc-vien-01.jpg", alt: "Học viên tiêu biểu 1" },
  { id: 2, src: "/images/hoc-vien-02.jpg", alt: "Học viên tiêu biểu 2" },
  { id: 3, src: "/images/hoc-vien-03.jpg", alt: "Học viên tiêu biểu 3" },
];

const FEATURE_CARDS = [
  {
    icon: <FaYoutube className="text-red-500" />,
    title: "Chất lượng 4K",
    desc: "Sản phẩm tốt nghiệp chỉn chu, chuyên nghiệp."
  },
  {
    icon: <FaFacebook className="text-blue-600" />,
    title: "Cập nhật thực tế",
    desc: "Highlight các buổi học và sự kiện mỗi tuần."
  },
  {
    icon: <FaPlayCircle className="text-green-600" />,
    title: "Tiến bộ rõ rệt",
    desc: "Minh chứng cho sự lột xác về thần thái."
  }
];

export default function VideoPage() {
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Logic đếm video thực tế từ API
  useEffect(() => {
    async function getCount() {
      try {
        const res = await fetch("/api/videos?active=true");
        const data = await res.json();
        if (data.success && data.videos) {
          setVideoCount(data.videos.length);
        }
      } catch (error) {
        console.error("Failed to fetch video count:", error);
        setVideoCount(0); // Fallback về 0 nếu API lỗi
      } finally {
        setLoading(false);
      }
    }
    getCount();
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": meta.title,
    "description": meta.description,
    "url": meta.canonical,
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "BT Academy",
      "logo": "https://btacademy.com.vn/logo.png"
    }
  };

  return (
    <DefaultLayout meta={meta}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="h-[70px] md:h-[90px] bg-white"></div>
      <main className="min-h-screen bg-white">
        <section className="py-8">
          <div className="container mx-auto ">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8 px-4 md:px-6">
              <div className="max-w-xl ">
                <h3 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-3">
                  Thư viện thực chiến
                </h3>
                <p className="text-slate-500 font-medium">
                  Xem những thước phim ghi lại sự thay đổi thần thái từ cộng đồng học viên.
                </p>
              </div>
              <div>
                <span className="px-4 py-2 bg-slate-100  text-sm font-bold text-slate-600 inline-flex items-center">
                  {loading ? (
                    <span className="w-16 h-4 bg-slate-200 animate-pulse rounded"></span>
                  ) : (
                    `Tổng: ${videoCount} Video`
                  )}
                </span>
              </div>
            </div>

            <div className="bg-white">
              <VideoGallery
                showTitle={false}
                showDescription
                showPagination
                videosPerPage={9}
                mobileScrollable={false}
                scrollToTopOnPaginate
                scrollOffset={80}
              />
            </div>
          </div>

        </section>
      </main>
    </DefaultLayout>
  );
}
