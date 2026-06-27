import React, { useState } from 'react';
import Link from 'next/link';
import CourseCard from '../../components/common/CourseCard';
import DefaultLayout from '../../components/layout/DefaultLayout';
import db from '../../utils/db';
import Course from '../../models/Course';
import { toCloudinaryUrl } from '../../utils/cloudinary';

const transformCourse = (course) => ({
  id: course._id.toString(),
  title: course.title || 'Khóa học',
  description: course.description || course.subtitle || '',
  instructor: 'BT Academy',
  instructorRole: 'Giảng viên',
  category: course.level || 'Tất cả cấp độ',
  lessons: course.sessions || 0,
  videos: 0,
  students: course.students || 0,
  rating: course.rating || 4.8,
  reviews: course.reviews || 0,
  price: 0,
  discount: 0,
  image: toCloudinaryUrl(course.image),
  badge: course.isNew ? 'Mới' : (course.isFeatured ? 'Nổi bật' : ''),
  enrolledStudents: course.students || 0,
  courseType: 'offline',
  schedule: course.schedule || 'Linh hoạt',
  locations: Array.isArray(course.locations) ? course.locations : [],
  slug: course.slug || course._id.toString(),
  maKhoaHoc: course.maKhoaHoc,
  level: course.level,
  curriculum: course.curriculum || [],
  features: course.features || [],
  requirements: course.requirements || [],
  faq: course.faq || []
});

const AllCoursesPage = ({ meta, courses }) => {
  const [viewType, setViewType] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://btacademy.com.vn"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Khóa học",
        "item": "https://btacademy.com.vn/khoa-hoc"
      }
    ]
  };

  const filteredCourses = courses.filter(course => {
    return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <DefaultLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="h-[80px] bg-white"></div>

      <section className="min-h-screen">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          {/* Breadcrumb */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200 shadow-sm">
            <div className="container mx-auto px-4 py-5">
              <div className="flex items-center gap-3 text-base">
                <Link href="/" className="font-semibold text-gray-700 hover:text-green-600 hover:underline whitespace-nowrap transition-colors duration-200">
                  Trang chủ
                </Link>
                <span className="text-green-400 font-bold text-lg">›</span>
                <span className="font-bold text-gray-800 bg-green-100 px-3 py-1 rounded-full text-sm">
                  Khóa học
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Left Side - View Toggle and Results */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewType('grid')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${viewType === 'grid'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-green-600'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setViewType('list')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${viewType === 'list'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-green-600'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>List</span>
                  </button>
                </div>
                <p className="text-gray-600 hidden md:block">
                  {filteredCourses.length > 0
                    ? `Hiển thị 1-${filteredCourses.length} / ${filteredCourses.length} khóa học`
                    : 'Hiển thị 0 khóa học'}
                </p>
              </div>

              {/* Right Side - Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 && (
            <div className={`grid ${viewType === 'grid'
              ? 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6'
              : 'grid-cols-1 gap-4'
              }`}>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant={viewType === 'grid' ? 'default' : 'compact'}
                  showFullFeatures={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Visible Content Section for SEO and Users */}
        <section className="py-16 bg-white border-t border-gray-150 mt-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Học MC & Đào tạo Kỹ năng Giao tiếp chuyên nghiệp tại BT Academy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-center text-lg">
              BT Academy là trung tâm hàng đầu chuyên đào tạo MC, luyện giọng nói truyền cảm và mài giũa kỹ năng giao tiếp thực chiến tại Hà Nội và Thái Nguyên. 
              Dưới sự dẫn dắt của BTV truyền hình Bích Thủy, chúng tôi cung cấp lộ trình học bài bản giúp học viên khai phóng giọng nói, định hình bản sắc cá nhân 
              và tự tin tỏa sáng trước đám đông thông qua phương pháp thực hành - thu hình - phản hồi độc quyền.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-10">
              <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                <h3 className="text-xl font-bold text-green-800 mb-4">Các khóa học nổi bật</h3>
                <ul className="space-y-3 text-gray-750">
                  <li className="flex items-start gap-2">
                    <span className="text-green-550 font-bold">✓</span>
                    <span><strong>MC Nhí (BT Kids):</strong> Ươm mầm tự tin và tư duy ngôn ngữ cho trẻ từ 5-12 tuổi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-550 font-bold">✓</span>
                    <span><strong>MC Cơ bản & Nâng cao:</strong> Đào tạo dẫn chương trình truyền hình, sự kiện chuyên nghiệp.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-550 font-bold">✓</span>
                    <span><strong>Luyện giọng nói truyền cảm:</strong> Khắc phục lỗi ngọng L/N, giọng địa phương và gia cố nền móng giọng nói nội lực.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-550 font-bold">✓</span>
                    <span><strong>Kỹ năng thuyết trình & Giao tiếp:</strong> Làm chủ thần thái và ngôn ngữ hình thể dành cho người đi làm.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                <h3 className="text-xl font-bold text-green-800 mb-4">Tại sao nên chọn BT Academy?</h3>
                <p className="text-gray-750 leading-relaxed mb-4">
                  Với triết lý "Móng vững - Nhà sang", mỗi khóa học tại BT Academy được thiết kế để học viên không chỉ biết cách nói 
                  mà còn làm chủ được tư duy biên tập và bản lĩnh xử lý tình huống.
                </p>
                <p className="text-gray-750 leading-relaxed">
                  Hệ thống Studio hiện đại tại Hoàn Kiếm (Hà Nội) và Thái Nguyên giúp học viên tiếp cận môi trường truyền hình thực tế ngay từ buổi học đầu tiên.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </DefaultLayout>
  );
};

export const getStaticProps = async () => {
  try {
    await db.connectDb();

    const courseDocs = await Course.find({ isDeleted: { $ne: true } })
      .select('-instructor -instructorRole -category -targetAge -price -discount -badge -isActive -duration -location')
      .sort({ createdAt: -1 });

    const serializedCourseDocs = JSON.parse(JSON.stringify(courseDocs));
    const courses = serializedCourseDocs.map(transformCourse);

    const meta = {
      title: "Khóa Học MC & Kỹ Năng Giao Tiếp Chuyên Nghiệp | BT Academy",
      description: "Tổng hợp các khóa học MC, luyện giọng nói truyền cảm và kỹ năng thuyết trình thực chiến tại BT Academy. Đào tạo bởi BTV truyền hình, cam kết tự tin tỏa sáng sau lộ trình. Đăng ký ngay!",
      keywords: "khóa học MC, kỹ năng giao tiếp, thuyết trình, dẫn chương trình, BT Academy, MC chuyên nghiệp, kỹ năng mềm",
      author: "BT Academy",
      robots: "index, follow",
      canonical: "https://btacademy.com.vn/khoa-hoc",
      og: {
        title: "BT Academy - Khóa học MC và Kỹ năng Giao tiếp",
        description: "Khám phá các khóa học MC chuyên nghiệp, kỹ năng giao tiếp và thuyết trình tại BT Academy.",
        type: "website",
        image: "https://btacademy.com.vn/images/banner-bta.jpg",
        imageWidth: "1200",
        imageHeight: "630",
        url: "https://btacademy.com.vn/khoa-hoc",
        siteName: "BT Academy",
      },
      twitter: {
        card: "summary_large_image",
        title: "BT Academy - Khóa học MC và Kỹ năng Giao tiếp",
        description: "Khám phá các khóa học MC chuyên nghiệp, kỹ năng giao tiếp và thuyết trình tại BT Academy.",
        image: "https://btacademy.com.vn/images/banner-bta.jpg",
      },
    };

    return {
      props: {
        meta,
        courses,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  } finally {
    await db.disconnectDb();
  }
};

export default AllCoursesPage;
