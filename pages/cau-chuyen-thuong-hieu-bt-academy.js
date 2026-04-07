import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import DefaultLayout from '../components/layout/DefaultLayout';

const BrandStoryPage = () => {
  // SEO meta data
  const meta = {
    title: "Câu Chuyện Thương Hiệu BT Academy - Hành Trình Từ Cô Gái Giọng Ngọt Đến Người Truyền Cảm Hứng",
    description: "Khám phá câu chuyện truyền cảm hứng của Lê Bích Thủy - Nhà sáng lập BT Academy. Từ nỗi mặc cảm giọng nói đến sứ mệnh đào tạo kỹ năng giao tiếp chuyên nghiệp.",
    keywords: "BT Academy, câu chuyện thương hiệu, Lê Bích Thủy, đào tạo MC, kỹ năng giao tiếp, phát thanh viên, dẫn chương trình",
    ogTitle: "Câu Chuyện Thương Hiệu BT Academy - Hành Trình Truyền Cảm Hứng",
    ogDescription: "Từ cô gái giọng ngọt đến người truyền cảm hứng - Câu chuyện của Lê Bích Thủy và BT Academy",
    ogImage: "/images/brand-story-og.jpg",
    twitterCard: "summary_large_image"
  };

  // JSON-LD Schema cho bài viết
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    author: {
      "@type": "Person",
      name: "Lê Bích Thủy",
      jobTitle: "Nhà sáng lập BT Academy"
    },
    publisher: {
      "@type": "Organization",
      name: "BT Academy",
      logo: {
        "@type": "ImageObject",
        url: "https://btacademy.vn/logo.png"
      }
    },
    datePublished: "2024-01-01",
    dateModified: "2024-01-01",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://btacademy.vn/cau-chuyen-thuong-hieu-bt-academy"
    }
  };

  return (
    <DefaultLayout meta={meta}>
      <Head>
        {/* Basic Meta Tags */}
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="author" content="Lê Bích Thủy" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:image" content={meta.ogImage} />
        <meta property="og:url" content="https://btacademy.vn/cau-chuyen-thuong-hieu-bt-academy" />
        <meta property="og:site_name" content="BT Academy" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={meta.twitterCard} />
        <meta name="twitter:title" content={meta.ogTitle} />
        <meta name="twitter:description" content={meta.ogDescription} />
        <meta name="twitter:image" content={meta.ogImage} />

        {/* Canonical URL */}
        <link rel="canonical" href="https://btacademy.vn/cau-chuyen-thuong-hieu-bt-academy" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="h-[80px] bg-white"></div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800  leading-tight">
            CÂU CHUYỆN THƯƠNG HIỆU:<br />
            <span className=" text-2xl">
              TỪ CÔ GÁI GỌNG NGỌT ĐẾN NGƯỜI TRUYỀN CẢM HỨNG
            </span>
          </h1>

        </div>

        {/* Founder Image */}
        <div className="mb-8 text-center">
          <Image
            src="/images/gallery/hoc-vien-bt-05.jpg"
            alt="Lê Bích Thủy - Nhà sáng lập BT Academy"
            width={1200}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
            priority
          />
          <p className="text-base text-gray-500 mt-2 italic">
            Lê Bích Thủy - Nhà sáng lập BT Academy
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-green-50 p-4 rounded-lg mb-6 border-l-4 border-green-500">
            <p className="text-lg text-gray-700 mb-0">
              Tôi là <strong className="text-green-700">Lê Bích Thủy</strong>, Nhà sáng lập của BT Academy. Câu chuyện của tôi bắt đầu không phải trên sân khấu lớn, mà từ một nỗi mặc cảm rất đỗi đời thường: một chất giọng ngọng, chói tai.
            </p>
          </div>

          {/* Early Life Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
              Những Ngày Đầu Gian Nan
            </h2>

            {/* Childhood Image */}
            <div className="float-right ml-6 mb-4">
              <Image
                src="/images/gallery/mc-bt-19.jpg"
                alt="Thái Nguyên - Quê hương của Lê Bích Thủy"
                width={400}
                height={300}
                className="rounded-lg shadow-md"
              />

            </div>

            <p className="text-gray-700 mb-3 leading-relaxed">
              Sinh ra và lớn lên tại thành phố Thái Nguyên, tôi sớm làm quen với việc đứng trước đám đông. Từ lớp 1 đến lớp 10, tôi luôn là lớp trưởng, tự tin điều hành và giao tiếp. Nhưng mỗi khi cất lời, tôi lại nghe thấy sự khác biệt của chính mình. Giọng nói ngọng, thiếu chuẩn mực ấy, dường như là một rào cản vô hình, thách thức mọi tham vọng và ước mơ trong tôi.
            </p>

            <p className="text-gray-700 mb-3 leading-relaxed">
              Tôi hiểu rằng, sự tự tin tự nhiên là chưa đủ. Để có thể bước lên một sân khấu chuyên nghiệp, tôi cần phải biến giới hạn thành sức mạnh. Đó là lúc tôi bắt đầu hành trình &quot;chữa lành&quot; cho giọng nói của mình. Với sự kiên trì và một tinh thần không ngừng học hỏi, tôi đã mày mò, tự rèn luyện mỗi ngày, biến chất giọng ngọng chói tai ngày nào trở thành một công cụ mạnh mẽ, đầy sức thuyết phục.
            </p>
          </section>

          {/* Professional Journey Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
              Từ Kinh Nghiệm Thực Chiến Đến Phương Pháp Độc Quyền
            </h2>

            {/* TV Studio Images */}
            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div>
                <Image
                  src="/images/gallery/mc-bt-18.jpg"
                  alt="Lê Bích Thủy tại VTC"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md w-full"
                />
                <p className=" text-gray-500 text-center">
                  Thời gian công tác tại VTC
                </p>
              </div>
              <div>
                <Image
                  src="/images/gallery/mc-bt-17.jpg"
                  alt="Lê Bích Thủy tại VTV"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md w-full"
                />
                <p className=" text-gray-500  text-center">
                  Thời gian công tác tại VTV
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-3 leading-relaxed">
              Hành trình ấy đã đưa tôi đến với nghề Báo chí và MC truyền hình, công tác tại các đài truyền hình uy tín như VTC và VTV. Những năm tháng làm nghề không chỉ tôi luyện cho tôi sự chuyên nghiệp, mà còn cho tôi cơ hội tiếp xúc với hàng ngàn câu chuyện và nhận ra rằng, có biết bao người cũng đang vật lộn với những rào cản tương tự như tôi ngày xưa.
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              Đó chính là lúc BT Academy ra đời. Không chỉ là một trung tâm đào tạo, BT Academy là lời hồi đáp cho khao khát được sẻ chia và truyền cảm hứng của tôi. Tôi đã chắt lọc mọi kiến thức, kinh nghiệm thực tế và đặc biệt là phương pháp tự học thành công của mình để xây dựng nên một quy trình đào tạo độc quyền, lấy học viên làm trung tâm: <strong className="text-green-700">&quot;Thực hành - Thu hình - Phản hồi&quot;</strong>.
            </p>

            {/* Method Highlight Box */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Phương Pháp Độc Quyền</h3>
                  <p className="text-green-100 italic leading-relaxed">
                    Chúng tôi tin rằng, chỉ khi được thực hành, được nhìn thấy chính mình trên hình ảnh, và được nhận những phản hồi chuyên nghiệp, học viên mới có thể hiểu rõ điểm mạnh, điểm yếu và tiến bộ vượt bậc. Đây không chỉ là một quy trình học tập, mà là một hành trình khám phá và tái định hình bản thân.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
              BT Academy – Nơi Biến Tài Năng Tiềm Ẩn Thành Ngôi Sao Tỏa Sáng
            </h2>

            {/* BT Academy Images */}
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div>
                <Image
                  src="/images/gallery/hoc-vien-bt-02.jpg"
                  alt="Lớp học tại BT Academy"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md w-full"
                />
                <p className="text-base text-gray-500 text-center">
                  Lớp học thực hành
                </p>
              </div>
              <div>
                <Image
                  src="/images/gallery/hoc-vien-bt-03.jpg"
                  alt="Học viên BT Academy"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md w-full"
                />
                <p className="text-base text-gray-500  text-center">
                  Học viên thực hành
                </p>
              </div>
              <div>
                <Image
                  src="/images/gallery/hoc-vien-bt-04.jpg"
                  alt="Lễ tốt nghiệp BT Academy"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-md w-full"
                />
                <p className="text-base text-gray-500  text-center">
                  Lễ tốt nghiệp
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-3 leading-relaxed">
              Sứ mệnh của BT Academy không chỉ dừng lại ở việc dạy kỹ năng giao tiếp hay thuyết trình. Chúng tôi tin rằng, trong thời đại truyền thông số, giọng nói, phong thái, kỹ năng bán hàng và năng lực xây dựng thương hiệu cá nhân không chỉ giúp một người tự tin hơn, mà còn mở ra cơ hội thăng tiến, chinh phục khách hàng và lan tỏa giá trị của mình tới cộng đồng.
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              BT Academy là ngôi nhà chung, nơi mỗi học viên không chỉ được trang bị kiến thức, mà còn được truyền cảm hứng để &quot;viết lại câu chuyện&quot; của chính họ, can đảm bước ra khỏi vùng an toàn và tỏa sáng theo cách riêng.
            </p>

       
          </section>

          {/* Contact Information Section */}
          <section className="mt-8 mb-8">
            <div className=" ">
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                Thông tin liên hệ :
              </h2>
              
              <div className="space-y-3 text-gray-700">
                <p><strong>BT Academy</strong> – Trung tâm đào tạo giọng nói, MC, thuyết trình & kỹ năng mềm</p>
                <p><strong>Hotline/Zalo:</strong> <a href="tel:0988027494" className="text-green-600 hover:text-green-700">0988 02 7494</a></p>
                <p><strong>Địa chỉ:</strong> 19 Nguyễn Gia Thiều, Hoàn Kiếm, Hà Nội</p>
                <p><strong>Website:</strong> <a href="https://btacademy.com.vn" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">btacademy.com.vn</a></p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BrandStoryPage;
