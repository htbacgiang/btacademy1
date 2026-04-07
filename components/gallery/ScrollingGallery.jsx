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
      {
        id: 1,
        src: "/images/gallery/hoc-vien-bt-01.jpg",
        alt: "Học viên BT Academy 01"
      },
      {
        id: 2,
        src: "/images/gallery/hoc-vien-bt-02.jpg",
        alt: "Học viên BT Academy 02"
      },
      {
        id: 3,
        src: "/images/gallery/hoc-vien-bt-03.jpg",
        alt: "Học viên BT Academy 03"
      },
      {
        id: 4,
        src: "/images/gallery/hoc-vien-bt-04.jpg",
        alt: "Học viên BT Academy 04"
      },
      {
        id: 5,
        src: "/images/gallery/hoc-vien-bt-05.jpg",
        alt: "Học viên BT Academy 05"
      },
      {
        id: 6,
        src: "/images/gallery/hoc-vien-bt-06.jpg",
        alt: "Học viên BT Academy 06"
      },
      {
        id: 7,
        src: "/images/gallery/hoc-vien-bt-07.jpg",
        alt: "Học viên BT Academy 07"
      },
      {
        id: 8,
        src: "/images/gallery/hoc-vien-bt-08.jpg",
        alt: "Học viên BT Academy 08"
      },
      {
        id: 9,
        src: "/images/gallery/hoc-vien-bt-09.jpg",
        alt: "Học viên BT Academy 09"
      },
      {
        id: 10,
        src: "/images/gallery/hoc-vien-bt-10.jpg",
        alt: "Học viên BT Academy 10"
      },
      {
        id: 11,
        src: "/images/gallery/hoc-vien-bt-11.jpg",
        alt: "Học viên BT Academy 11"
      },
      {
        id: 12,
        src: "/images/gallery/hoc-vien-bt-12.jpg",
        alt: "Học viên BT Academy 12"
      },
      {
        id: 13,
        src: "/images/gallery/hoc-vien-bt-13.jpg",
        alt: "Học viên BT Academy 13"
      },
      {
        id: 14,
        src: "/images/gallery/hoc-vien-bt-14.jpg",
        alt: "Học viên BT Academy 14"
      },
      {
        id: 15,
        src: "/images/gallery/hoc-vien-bt-15.jpg",
        alt: "Học viên BT Academy 15"
      },
      {
        id: 16,
        src: "/images/gallery/hoc-vien-bt-16.jpg",
        alt: "Học viên BT Academy 16"
      },
      {
        id: 17,
        src: "/images/gallery/hoc-vien-bt-17.jpg",
        alt: "Học viên BT Academy 17"
      },
      {
        id: 18,
        src: "/images/gallery/hoc-vien-bt-18.jpg",
        alt: "Học viên BT Academy 18"
      },
      {
        id: 19,
        src: "/images/gallery/hoc-vien-bt-19.jpg",
        alt: "Học viên BT Academy 19"
      },
      {
        id: 20,
        src: "/images/gallery/hoc-vien-bt-20.jpg",
        alt: "Học viên BT Academy 20"
      },
      {
        id: 21,
        src: "/images/gallery/hoc-vien-bt-21.jpg",
        alt: "Học viên BT Academy 21"
      },
      {
        id: 22,
        src: "/images/gallery/hoc-vien-bt-22.jpg",
        alt: "Học viên BT Academy 22"
      }
    ],
    []
  );

  // Chia ảnh thành 2 hàng
  const topRowImages = useMemo(() => galleryImages.slice(0, 6), [galleryImages]);
  const bottomRowImages = useMemo(() => galleryImages.slice(6, 12), [galleryImages]);

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
          animation: scroll-right-to-left 40s linear infinite;
          animation-play-state: running;
        }
        .animate-scroll-left-to-right {
          animation: scroll-left-to-right 40s linear infinite;
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
