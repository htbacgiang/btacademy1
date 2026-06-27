import "../styles/globals.css";
import "../styles/toast.css";
import "../styles/dashboard.css";
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";

// Font Rajdhani được load qua CSS trong globals.css để tránh lỗi build trên VPS
// Nếu cần sử dụng next/font, có thể uncomment code bên dưới và cấu hình network cho VPS
/*
import { Rajdhani } from "next/font/google";
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--ltn__heading-font",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});
*/
const createSiteNavigation = () => {
  return [
    { name: "Trang chủ", url: "https://btacademy.com.vn/" },
    { name: "Khóa học", url: "https://btacademy.com.vn/khoa-hoc" },
    { name: "Lịch khai giảng", url: "https://btacademy.com.vn/lich-khai-giang" },
    { name: "Bài viết", url: "https://btacademy.com.vn/bai-viet" },
    { name: "Liên hệ", url: "https://btacademy.com.vn/lien-he" },
    { name: "Giới thiệu", url: "https://btacademy.com.vn/gioi-thieu-bt-academy" },
    { name: "Nhà sáng lập", url: "https://btacademy.com.vn/nha-sang-lap" },
  ].map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));
};

function MyApp({ Component, pageProps: { session, meta, ...pageProps } }) {
  
  return (
      <>
          <Head>
            <meta name="google-site-verification" content="fin_gC4hp_byDr3YGtl7p-2e6vpAElFKA7SYQDseOQ8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "@id": "https://btacademy.com.vn/#organization",
                    name: "BT Academy",
                    alternateName: "Trung tâm đào tạo MC BT Academy",
                    url: "https://btacademy.com.vn",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://btacademy.com.vn/logobtacademy.png",
                      width: 512,
                      height: 512,
                    },
                    image: "https://btacademy.com.vn/logobtacademy.png",
                    description:
                      "BT Academy - Trung tâm đào tạo MC, dẫn chương trình, phát thanh viên, luyện giọng nói và kỹ năng giao tiếp.",
                    sameAs: [
                      "https://www.facebook.com/btacademy",
                      "https://www.youtube.com/btacademy",
                      "https://www.instagram.com/btacademy",
                    ],
                    contactPoint: [
                      {
                        "@type": "ContactPoint",
                        telephone: "+84-988-027-494",
                        contactType: "customer service",
                        areaServed: "VN",
                        availableLanguage: "Vietnamese",
                      },
                    ],
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: "Hà Nội",
                      addressCountry: "VN",
                    },
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "@id": "https://btacademy.com.vn/#website",
                    url: "https://btacademy.com.vn",
                    name: "BT Academy",
                    description:
                      "BT Academy chuyên đào tạo MC, luyện giọng nói, kỹ năng giao tiếp và thuyết trình.",
                    publisher: {
                      "@id": "https://btacademy.com.vn/#organization",
                    },
                    potentialAction: [
                      {
                        "@type": "SearchAction",
                        target: {
                          "@type": "EntryPoint",
                          urlTemplate: "https://btacademy.com.vn/search?q={search_term_string}",
                        },
                        "query-input": "required name=search_term_string",
                      },
                    ],
                    mainEntity: {
                      "@type": "ItemList",
                      itemListElement: createSiteNavigation(),
                    },
                    inLanguage: "vi-VN",
                    copyrightYear: String(new Date().getFullYear()),
                    isPartOf: {
                      "@type": "WebSite",
                      name: "BT Academy",
                      url: "https://btacademy.com.vn",
                    },
                  },
                ]),
              }}
            />
          </Head>
          {meta && (
            <Head>
              <title>{meta.title}</title>
              <meta name="description" content={meta.description} />
              <meta name="keywords" content={meta.keywords} />
              <meta name="robots" content={meta.robots} />
              <meta name="author" content={meta.author} />
              <link rel="canonical" href={meta.canonical} />
              <meta property="og:title" content={meta.og.title} />
              <meta property="og:description" content={meta.og.description} />
              <meta property="og:type" content={meta.og.type} />
              <meta property="og:image" content={meta.og.image} />
              <meta property="og:image:width" content={meta.og.imageWidth} />
              <meta property="og:image:height" content={meta.og.imageHeight} />
              <meta property="og:url" content={meta.og.url} />
              <meta name="twitter:card" content={meta.twitter.card} />
              <meta name="twitter:title" content={meta.twitter.title} />
              <meta name="twitter:description" content={meta.twitter.description} />
              <meta name="twitter:image" content={meta.twitter.image} />
            </Head>
          )}
          <SessionProvider session={session}>
            <div className="font-arial">
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 10001 }}
              />
              <Component {...pageProps} />
            </div>
          </SessionProvider>
        </>
  );
}

export default MyApp;
