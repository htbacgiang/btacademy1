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

      <section className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-50/80 border-b border-gray-100">
          <div className="container mx-auto px-4 py-2.5">
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-green-600 transition-colors whitespace-nowrap">
                Trang chủ
              </Link>
              <span className="text-gray-400 text-xs">›</span>
              <span className="text-gray-800 font-medium" aria-current="page">
                Khóa học
              </span>
            </nav>
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
