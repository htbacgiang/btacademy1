import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload
} from 'react-icons/fa';
import useImageLoader from '../../hooks/useImageLoader';

const ScrollingGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const { preloadImage } = useImageLoader();

  // Dữ liệu ảnh cho BT Academy
const galleryImages = useMemo(
  () => [
    { id: 1, src: "/images/gallery/hoc-vien-bt-01.jpg", alt: "Lớp học MC Nhí tự tin thuyết trình tại BT Academy Hà Nội" },
    { id: 2, src: "/images/gallery/hoc-vien-bt-02.jpg", alt: "Học viên thực hành luyện giọng nói truyền cảm Thái Nguyên" },
    { id: 3, src: "/images/gallery/hoc-vien-bt-03.jpg", alt: "Đào tạo MC chuyên nghiệp chuẩn truyền hình tại 19 Nguyễn Gia Thiều" },
    { id: 4, src: "/images/gallery/hoc-vien-bt-04.jpg", alt: "Khóa học chữa ngọng dứt điểm cho người đi làm tại Hà Nội" },
    { id: 5, src: "/images/gallery/hoc-vien-bt-05.jpg", alt: "Bé tự tin tỏa sáng trong lớp MC Nhí BT Kids Thái Nguyên" },
    { id: 6, src: "/images/gallery/hoc-vien-bt-06.jpg", alt: "Học viên thực hành dẫn chương trình tại Studio BT Academy" },
    { id: 7, src: "/images/gallery/hoc-vien-bt-07.jpg", alt: "Kỹ năng thuyết trình và giao tiếp đỉnh cao cho lãnh đạo Hà Nội" },
    { id: 8, src: "/images/gallery/hoc-vien-bt-08.jpg", alt: "Lớp MC Nhí thực hành ghi hình tại Tòa nhà Viettel Thái Nguyên" },
    { id: 9, src: "/images/gallery/hoc-vien-bt-09.jpg", alt: "Luyện giọng đọc Voice-over chuyên nghiệp tại BT Academy" },
    { id: 10, src: "/images/gallery/hoc-vien-bt-10.jpg", alt: "Học viên lớp MC Pro thực hành đọc kịch bản bản tin thời sự" },
    { id: 11, src: "/images/gallery/hoc-vien-bt-11.jpg", alt: "Khóa học kỹ năng sống và tự tin giao tiếp cho trẻ em Hà Nội" },
    { id: 12, src: "/images/gallery/hoc-vien-bt-12.jpg", alt: "Địa chỉ học MC uy tín hàng đầu tại thành phố Thái Nguyên" },
    { id: 13, src: "/images/gallery/hoc-vien-bt-13.jpg", alt: "Học viên nhận chứng chỉ tốt nghiệp khóa MC tại BT Academy" },
    { id: 14, src: "/images/gallery/hoc-vien-bt-14.jpg", alt: "Thực hành kỹ năng phỏng vấn hiện trường cho học viên MC" },
    { id: 15, src: "/images/gallery/hoc-vien-bt-15.jpg", alt: "Lớp học sửa giọng địa phương và luyện giọng ấm áp Hà Nội" },
    { id: 16, src: "/images/gallery/hoc-vien-bt-16.jpg", alt: "Các bạn nhỏ hào hứng trong giờ học MC Nhí tại Thái Nguyên" },
    { id: 17, src: "/images/gallery/hoc-vien-bt-17.jpg", alt: "Kỹ thuật giải phóng hình thể và làm chủ sân khấu sự kiện" },
    { id: 18, src: "/images/gallery/hoc-vien-bt-18.jpg", alt: "BTV Bích Thủy trực tiếp hướng dẫn học viên tại cơ sở Hà Nội" },
    { id: 19, src: "/images/gallery/hoc-vien-bt-19.jpg", alt: "Học viên thực hành sử dụng máy nhắc chữ Teleprompter chuyên nghiệp" },
    { id: 20, src: "/images/gallery/hoc-vien-bt-20.jpg", alt: "Workshop kỹ năng giao tiếp doanh nghiệp tại BT Academy" },
    { id: 21, src: "/images/gallery/hoc-vien-bt-21.jpg", alt: "Không gian học tập hiện đại chuẩn trường quay tại Thái Nguyên" },
    { id: 22, src: "/images/gallery/hoc-vien-bt-22.jpg", alt: "MC Bích Thủy chia sẻ kinh nghiệm làm nghề cho học viên MC Pro" },
    { id: 23, src: "/images/gallery/hoc-vien-bt-23.jpg", alt: "Hành trình thay đổi giọng nói của học viên sau 10 buổi học" },
    { id: 24, src: "/images/gallery/hoc-vien-bt-24.jpg", alt: "Lớp học MC song ngữ nhí phát triển tư duy ngôn ngữ toàn diện" },
    { id: 25, src: "/images/gallery/hoc-vien-bt-25.jpg", alt: "Khóa đào tạo phát thanh viên chuyên nghiệp tại Hà Nội" },
    { id: 26, src: "/images/gallery/hoc-vien-bt-26.jpg", alt: "Học viên Thái Nguyên thực hành dẫn Gala Dinner cuối khóa" },
    { id: 27, src: "/images/gallery/hoc-vien-bt-27.jpg", alt: "Kỹ năng xây dựng kịch bản và biên tập nội dung sáng tạo" },
    { id: 28, src: "/images/gallery/hoc-vien-bt-28.jpg", alt: "BT Academy - Nơi khai phóng sức mạnh giọng nói của bạn" },
    { id: 29, src: "/images/gallery/hoc-vien-bt-29.jpg", alt: "Học viên nhí tự tin phỏng vấn khách mời tại Studio Hà Nội" },
    { id: 30, src: "/images/gallery/hoc-vien-bt-30.jpg", alt: "Luyện cách nhấn nhá và biểu cảm cảm xúc qua giọng nói" },
    { id: 31, src: "/images/gallery/hoc-vien-bt-31.jpg", alt: "Cộng đồng học viên thành công sau khóa học tại BT Academy" },
    { id: 32, src: "/images/gallery/hoc-vien-bt-32.jpg", alt: "Kỹ năng điều phối hội thảo và tọa đàm cho người đi làm" },
    { id: 33, src: "/images/gallery/hoc-vien-bt-33.jpg", alt: "Hình ảnh thực tế lớp học MC chuyên nghiệp tại cơ sở Nguyễn Gia Thiều" }
  ],
  []
);

  // Chia ảnh thành 2 hàng
// Hàng 1 lấy 17 ảnh, hàng 2 lấy 16 ảnh còn lại
const topRowImages = useMemo(() => galleryImages.slice(0, 17), [galleryImages]);
const bottomRowImages = useMemo(() => galleryImages.slice(17), [galleryImages]);

  const openLightbox = useCallback((image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setImageScale(1);
  }, []);

  const nextImage = useCallback(() => {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
    setImageScale(1);
  }, [currentIndex, galleryImages]);

  const prevImage = useCallback(() => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
    setImageScale(1);
  }, [currentIndex, galleryImages]);

  const zoomIn = useCallback(() => {
    setImageScale(prev => Math.min(prev + 0.5, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setImageScale(prev => Math.max(prev - 0.5, 0.5));
  }, []);

  const downloadImage = useCallback(() => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage.src;
      link.download = `bt-academy-${selectedImage.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [selectedImage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }, [closeLightbox, nextImage, prevImage]);

  // Preload images for better performance
  useEffect(() => {
    galleryImages.forEach(image => {
      preloadImage(image.src);
    });
  }, [galleryImages, preloadImage]);

  // Keyboard event listener
  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, handleKeyPress]);

  return (
    <div 
      className="relative overflow-hidden py-16"
     
    >
      <style jsx>{`
        @keyframes scroll-right-to-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        @keyframes scroll-left-to-right {
          0% { transform: translateX(-33.33%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-right-to-left {
          animation: scroll-right-to-left 80s linear infinite;
          animation-play-state: running;
        }
        .animate-scroll-left-to-right {
          animation: scroll-left-to-right 80s linear infinite;
          animation-play-state: running;
        }
        .gallery-row {
          width: fit-content;
        }
        .lightbox-modal {
          z-index: 9999 !important;
        }
        .gallery-container {
          position: relative;
          background: linear-gradient(45deg, #f8fafc 0%, #ffffff 25%, #f1f5f9 50%, #ffffff 75%, #f8fafc 100%);
          border-radius: 24px;
          margin: 0 1rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .lightbox-thumbnail {
          transition: all 0.3s ease;
        }
        .lightbox-thumbnail:hover {
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          .animate-scroll-right-to-left {
            animation: scroll-right-to-left 30s linear infinite;
          }
          .animate-scroll-left-to-right {
            animation: scroll-left-to-right 30s linear infinite;
          }
          .lightbox-thumbnail {
            width: 16px;
            height: 12px;
          }
        }
      `}</style>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-4">
            <FaImages className="text-green-600 text-3xl mr-3" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Hình ảnh hoạt động tại <span className="text-green-600">BT Academy</span>
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-5xl mx-auto">
            Khám phá những khoảnh khắc đáng nhớ trong quá trình đào tạo và phát triển của các học viên tại BT Academy
          </p>
        </div>

        {/* Scrolling Gallery */}
        <div className="gallery-container space-y-6">
          {/* Top Row - Right to Left */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-right-to-left space-x-4 gallery-row">
              {/* Duplicate images for infinite scroll */}
              {[...topRowImages, ...topRowImages, ...topRowImages].map((image, index) => (
                <div
                  key={`top-${index}`}
                  className="flex-shrink-0 group relative cursor-pointer"
                  onClick={() => openLightbox(image, galleryImages.indexOf(image))}
                >
                  <div className="w-64 h-40 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl gallery-item flex-shrink-0">
                    <img
                      loading="lazy"  
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`;
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Left to Right */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-left-to-right space-x-4 gallery-row">
              {/* Duplicate images for infinite scroll */}
              {[...bottomRowImages, ...bottomRowImages, ...bottomRowImages].map((image, index) => (
                <div
                  key={`bottom-${index}`}
                  className="flex-shrink-0 group relative cursor-pointer"
                  onClick={() => openLightbox(image, galleryImages.indexOf(image))}
                >
                  <div className="w-64 h-40 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl gallery-item flex-shrink-0">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80`;
                      }}
                    />
                    
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="lightbox-modal fixed inset-0 bg-black z-[9999999]">
            {/* Top Bar */}
            <div 
              className="lightbox-top-bar absolute top-0 left-0 right-0 z-[9999998] p-4 flex justify-between items-center"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)'
              }}
            >
              {/* Counter */}
              <div className="text-white text-lg font-medium">
                {currentIndex + 1} / {galleryImages.length}
              </div>
              
              {/* Top Right Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={zoomOut}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                  title="Zoom Out"
                >
                  <FaSearchMinus className="text-lg" />
                </button>
                <button
                  onClick={zoomIn}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                  title="Zoom In"
                >
                  <FaSearchPlus className="text-lg" />
                </button>
                <button
                  onClick={downloadImage}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                  title="Download"
                >
                  <FaDownload className="text-lg" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                  title="Close"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Main Image Container */}
            <div className="w-full h-full flex items-center justify-center p-8 pt-20 pb-24 overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="lightbox-image max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ transform: `scale(${imageScale})` }}
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80`;
                }}
              />
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-200 z-[9999998] text-2xl p-3 rounded-full hover:bg-white/10"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-all duration-200 z-[9999998] text-2xl p-3 rounded-full hover:bg-white/10"
            >
              <FaChevronRight />
            </button>


            {/* Thumbnail Strip */}
            <div className="absolute bottom-8 left-0 right-0 z-[9999998]">
              <div className="flex justify-center space-x-3 px-4 overflow-x-auto">
                {galleryImages.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((image, index) => {
                  const actualIndex = Math.max(0, currentIndex - 2) + index;
                  return (
                    <button
                      key={image.id}
                      onClick={() => {
                        setCurrentIndex(actualIndex);
                        setSelectedImage(galleryImages[actualIndex]);
                      }}
                      className={`lightbox-thumbnail flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        actualIndex === currentIndex 
                          ? 'border-green-500 opacity-100' 
                          : 'border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=75&q=80`;
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ScrollingGallery;
