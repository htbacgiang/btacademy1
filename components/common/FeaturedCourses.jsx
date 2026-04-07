"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CourseCard from './CourseCard';
import { toCloudinaryUrl } from '../../utils/cloudinary';
import Link from 'next/link';

const FeaturedCourses = ({ 
  title = "Các khóa học nổi bật",
  courses = [],
  variant = 'default',
  showViewAll = true,
  maxItems = 6
}) => {
  const router = useRouter();
  const [apiCourses, setApiCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        const data = await response.json();

        if (data.status === 'success') {
          // Transform API data to match CourseCard format
          const transformedCourses = data.courses.map(course => ({
            id: course._id,
            title: course.title || 'Khóa học',
            description: course.description || course.subtitle || '',
            instructor: 'BT Academy',
            instructorRole: 'Giảng viên',
            category: course.level || 'Tất cả cấp độ',
            lessons: course.sessions || 0,
            videos: 0,
            students: course.students || 0,
            rating: course.rating || 4.8,
            reviews: course.reviews || Math.floor(Math.random() * 50) + 10,
            price: 0,
            discount: 0,
            image: toCloudinaryUrl(course.image),
            badge: course.isNew ? 'Mới' : (course.isFeatured ? 'Nổi bật' : ''),
            enrolledStudents: course.students || 0,
            courseType: 'offline',
            duration: course.duration || '8 tuần',
            schedule: course.schedule || 'Linh hoạt',
            location: course.location || 'BT Academy',
            slug: course.slug || course._id,
            maKhoaHoc: course.maKhoaHoc,
            level: course.level,
            curriculum: course.curriculum || [],
            features: course.features || [],
            requirements: course.requirements || [],
            faq: course.faq || []
          }));
          setApiCourses(transformedCourses);
        } else {
          setError('Không thể tải dữ liệu khóa học');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const displayCourses = courses.length > 0 ? courses.slice(0, maxItems) : apiCourses.slice(0, maxItems);

  const handleLearnMore = (course) => {
    // Navigate to course detail page
    if (course.slug) {
      router.push(`/khoa-hoc/${course.slug}`);
    } else {
      router.push(`/khoa-hoc/${course.id}`);
    }
  };

  const handleAddToCart = (course) => {
    // Handle add to cart action
    console.log('Add to cart:', course);
    // You can add cart logic here
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight uppercase">
              {title.split(' ').map((word, index) => {
                if (index === 1) {
                  return (
                    <span key={index}>
                      {word}{' '}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Đang tải khóa học...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight uppercase">
              {title}
            </h2>
          </div>
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight uppercase">
            {title}
          </h2>
        </div>

        {/* Courses Grid */}
        {displayCourses.length > 0 ? (
          <div className={`grid gap-8 ${
            variant === 'compact' 
              ? 'lg:grid-cols-2 grid-cols-1' 
              : variant === 'minimal'
              ? 'lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1'
              : 'lg:grid-cols-3 md:grid-cols-2 grid-cols-1'
          }`}>
            {displayCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant={variant}
                onLearnMore={handleLearnMore}
                onAddToCart={handleAddToCart}
                showFullFeatures={variant === 'default'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Chưa có khóa học nào được hiển thị.</p>
          </div>
        )}

        {/* View All Button */}
        {showViewAll && displayCourses.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/khoa-hoc"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
            >
              <span>Xem tất cả khóa học</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Học viên đã tốt nghiệp</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">6+</div>
              <div className="text-gray-600">Khóa học chuyên nghiệp</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">98%</div>
              <div className="text-gray-600">Tỷ lệ hài lòng</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-700 mb-2">5+</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
