import Head from "next/head";
import DefaultLayout from "../../components/layout/DefaultLayout";
import ContactPage from "../../components/common/ContactPage";

export default function LienHe({ meta }) {
  // JSON-LD Schema.org cho trang liên hệ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Liên hệ BT Academy",
    "description": "Liên hệ với BT Academy để được tư vấn về các khóa học và chương trình đào tạo. Đội ngũ tư vấn viên giàu kinh nghiệm sẵn sàng hỗ trợ bạn.",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "BT Academy",
      "address": [
        {
          "@type": "PostalAddress",
          "name": "CS1 - Hà Nội",
          "streetAddress": "19 Nguyễn Gia Thiều",
          "addressLocality": "Hoàn Kiếm",
          "addressRegion": "Hà Nội",
          "postalCode": "100000",
          "addressCountry": "VN"
        },
        {
          "@type": "PostalAddress", 
          "name": "CS2 - Thái Nguyên",
          "streetAddress": "Tòa nhà Viettel, Số 4 Hoàng Văn Thụ",
          "addressLocality": "Thái Nguyên",
          "addressRegion": "Thái Nguyên",
          "postalCode": "240000",
          "addressCountry": "VN"
        }
      ],
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+84-988-02-7494",
          "contactType": "customer service",
          "availableLanguage": ["Vietnamese", "English"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "20:00"
          }
        },
        {
          "@type": "ContactPoint",
          "email": "contact@btacademy.com.vn",
          "contactType": "customer service"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/btacademy",
        "https://www.youtube.com/btacademy"
      ]
    }
  };

  return (
    <DefaultLayout 
      title={meta?.title}
      desc={meta?.description}
      thumbnail={meta?.og?.image}
      meta={meta}
    >
      <Head>
        {/* JSON-LD Schema.org cho trang Liên hệ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <h1 className="sr-only">
        Liên hệ BT Academy - Tư vấn khóa học và chương trình đào tạo
      </h1>
      
      <ContactPage />
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: "Liên hệ BT Academy - Tư vấn khóa học và chương trình đào tạo",
    description:
      "Liên hệ ngay với BT Academy để được tư vấn về các khóa học và chương trình đào tạo. Hotline: 024.3333.4444. Email: contact@btacademy.com.vn. Đội ngũ tư vấn viên sẵn sàng hỗ trợ bạn.",
    keywords:
      "liên hệ BT Academy, tư vấn khóa học, hotline BT Academy, địa chỉ BT Academy, email BT Academy, đào tạo lập trình, khóa học công nghệ, học lập trình",
    robots: "index, follow",
    author: "BT Academy",
    canonical: "https://btacademy.com.vn/lien-he",
    og: {
      title: "Liên hệ BT Academy - Tư vấn khóa học và chương trình đào tạo",
      description:
        "Liên hệ ngay với BT Academy để được tư vấn về các khóa học và chương trình đào tạo. Hotline: 024.3333.4444. Email: contact@btacademy.com.vn. Đội ngũ tư vấn viên sẵn sàng hỗ trợ bạn.",
      type: "website",
      image: "https://btacademy.com.vn/images/banner-bta.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://btacademy.com.vn/lien-he",
    },
    twitter: {
      card: "summary_large_image",
      title: "Liên hệ BT Academy - Tư vấn khóa học và chương trình đào tạo",
      description:
        "Liên hệ ngay với BT Academy để được tư vấn về các khóa học và chương trình đào tạo. Hotline: 024.3333.4444. Email: contact@btacademy.com.vn. Đội ngũ tư vấn viên sẵn sàng hỗ trợ bạn.",
      image: "https://btacademy.com.vn/images/banner-bta.jpg",
    },
  };

  return {
    props: {
      meta,
    },
  };
}