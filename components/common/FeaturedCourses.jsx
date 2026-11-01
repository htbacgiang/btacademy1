"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CourseCard from './CourseCard';
import { toCloudinaryUrl } from '../../utils/cloudinary';
import Link from 'next/link';

const FeaturedCourses = ({
  badge = "KHÓA HỌC TIÊU BIỂU",
  title,
  highlightTitle = "khóa học tiêu biểu nhất",
  suffixTitle = "của BT Academy",
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
            reviews: course.reviews || 0,
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


  return (
    <section className="py-3 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 text-left">
          {badge && (
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold tracking-wider text-gray-500 uppercase mb-2">
              <span>{badge}</span>
              <span className="text-gray-400 font-normal text-base leading-none">→</span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {title ? (
                title
              ) : (
                <>
                  Danh sách những{" "}
                  <span className="text-green-600">
                    {highlightTitle}
                  </span>{" "}
                  {suffixTitle}
                </>
              )}
            </h2>

            {showViewAll && displayCourses.length > 0 && (
              <Link
                href="/khoa-hoc"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm md:text-base font-semibold text-green-600 hover:text-green-700 transition-colors whitespace-nowrap group"
              >
                <span>Xem tất cả khóa học</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {displayCourses.length > 0 ? (
          <div className={`grid gap-8 ${variant === 'compact'
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
                showFullFeatures={variant === 'default'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Chưa có khóa học nào được hiển thị.</p>
          </div>
        )}

        {/* Mobile View All - Bottom of Section */}
        {showViewAll && displayCourses.length > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/khoa-hoc"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors py-2 px-4"
            >
              <span>Xem tất cả khóa học</span>
              <span>→</span>
            </Link>
          </div>
        )}





      </div>
    </section>
  );
};

export default FeaturedCourses;
