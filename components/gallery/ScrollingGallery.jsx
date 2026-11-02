import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
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
import { DEFAULT_GALLERY_IMAGES } from '../../data/defaultGalleryImages';

const ScrollingGallery = () => {
  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY_IMAGES);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const { preloadImage } = useImageLoader();
  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);
  const topOffsetRef = useRef(0);
  const bottomOffsetRef = useRef(0);
  const rafRef = useRef(null);
  const isPausedRef = useRef(false);

  // Tải danh sách ảnh từ API backend (quản lý qua Dashboard)
  useEffect(() => {
    let isMounted = true;

    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get('/api/gallery');
        if (response.data?.success && Array.isArray(response.data.images) && response.data.images.length > 0) {
          if (isMounted) {
            setGalleryImages(response.data.images);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách ảnh thư viện từ API, sử dụng ảnh mặc định:', error);
      }
    };

    fetchGalleryImages();

    return () => {
      isMounted = false;
    };
  }, []);

  // Chia ảnh thành 2 hàng theo thuộc tính row ("top" hoặc "bottom") do admin sắp xếp
  const { topRowImages, bottomRowImages } = useMemo(() => {
    if (!galleryImages || galleryImages.length === 0) {
      return { topRowImages: [], bottomRowImages: [] };
    }

    const top = galleryImages.filter(
      (img, idx) => img.row === "top" || (!img.row && idx < Math.ceil(galleryImages.length / 2))
    );
    const bottom = galleryImages.filter(
      (img, idx) => img.row === "bottom" || (!img.row && idx >= Math.ceil(galleryImages.length / 2))
    );

    return {
      topRowImages: top.length > 0 ? top : bottom,
      bottomRowImages: bottom.length > 0 ? bottom : top,
    };
  }, [galleryImages]);

  // Đảm bảo đủ số lượng ảnh lặp lại để hiệu ứng cuộn vô tận mượt mà trên mọi màn hình
  const buildSeamlessList = useCallback((rowList) => {
    if (!rowList || rowList.length === 0) return [];
    let list = [...rowList];
    while (list.length < 12) {
      list = [...list, ...rowList];
    }
    return [...list, ...list, ...list];
  }, []);

  const topSeamlessList = useMemo(() => buildSeamlessList(topRowImages), [topRowImages, buildSeamlessList]);
  const bottomSeamlessList = useMemo(() => buildSeamlessList(bottomRowImages), [bottomRowImages, buildSeamlessList]);

  // JS-based infinite scroll animation
  useEffect(() => {
    const speed = 0.6; // px per frame

    const animate = () => {
      if (!isPausedRef.current) {
        // Top row: scroll right-to-left
        if (topRowRef.current) {
          const el = topRowRef.current;
          const oneThird = el.scrollWidth / 3;
          topOffsetRef.current += speed;
          if (topOffsetRef.current >= oneThird) topOffsetRef.current = 0;
          el.style.transform = `translateX(-${topOffsetRef.current}px)`;
        }
        // Bottom row: scroll left-to-right (seamless)
        if (bottomRowRef.current) {
          const el = bottomRowRef.current;
          const oneThird = el.scrollWidth / 3;
          bottomOffsetRef.current += speed;
          if (bottomOffsetRef.current >= oneThird) bottomOffsetRef.current = 0;
          // Start at -oneThird, move toward 0 → seamless loop
          el.style.transform = `translateX(${bottomOffsetRef.current - oneThird}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [topSeamlessList, bottomSeamlessList]);

  const openLightbox = useCallback((image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index >= 0 ? index : 0);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setImageScale(1);
  }, []);

  const nextImage = useCallback(() => {
    if (galleryImages.length === 0) return;
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
    setImageScale(1);
  }, [currentIndex, galleryImages]);

  const prevImage = useCallback(() => {
    if (galleryImages.length === 0) return;
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
      link.download = `bt-academy-${selectedImage._id || selectedImage.id || 'photo'}.jpg`;
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
    if (Array.isArray(galleryImages)) {
      galleryImages.forEach(image => {
        if (image?.src) {
          preloadImage(image.src);
        }
      });
    }
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
    <div className="relative overflow-hidden py-6">
      <style jsx global>{`
        .gallery-row {
          width: fit-content;
        }
        .lightbox-modal {
          z-index: 9999 !important;
        }
        .img-gallery {
          margin-top: 0px !important;
          margin-bottom: 0px !important;
        }
        .gallery-container {
          position: relative;
          border-radius: 24px;
          margin: 0 1rem;
        }
        .lightbox-thumbnail {
          transition: all 0.3s ease;
        }
        .lightbox-thumbnail:hover {
          transform: scale(1.1);
        }
        .thumbnail-strip {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .thumbnail-strip::-webkit-scrollbar {
          display: none;
        }
        .lightbox-thumbnail {
          width: 56px;
          height: 40px;
        }
      `}</style>
      <div className="container mx-auto px-2">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 ">
              Hình ảnh hoạt động tại <span className="text-green-600 block sm:inline">BT Academy</span>
            </h2>
          </div>
        </div>

        {/* Scrolling Gallery */}
        <div className="gallery-container" style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Top Row - Right to Left */}
          <div className="relative overflow-hidden">
            <div
              ref={topRowRef}
              className="flex space-x-4"
              style={{ width: 'fit-content', willChange: 'transform' }}
            >
              {topSeamlessList.map((image, index) => (
                <div
                  key={`top-${index}`}
                  className="flex-shrink-0 group relative cursor-pointer"
                  onClick={() => openLightbox(image, galleryImages.indexOf(image))}
                >
                  <div className="w-64 h-40 img-gallery overflow-hidden shadow-lg group-hover:shadow-2xl gallery-item flex-shrink-0">
                    <img
                      src={image.src}
                      alt={image.alt || "BT Academy"}
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
          <div className="relative overflow-hidden" style={{ marginTop: '5px' }}>
            <div
              ref={bottomRowRef}
              className="flex space-x-4"
              style={{ width: 'fit-content', willChange: 'transform' }}
            >
              {bottomSeamlessList.map((image, index) => (
                <div
                  key={`bottom-${index}`}
                  className="flex-shrink-0 group relative cursor-pointer"
                  onClick={() => openLightbox(image, galleryImages.indexOf(image))}
                >
                  <div className="w-64 h-40 overflow-hidden shadow-lg group-hover:shadow-2xl gallery-item flex-shrink-0">
                    <img
                      src={image.src}
                      alt={image.alt || "BT Academy"}
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
          <div className="lightbox-modal img-gallery fixed inset-0 bg-black z-[9999999]">
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
                alt={selectedImage.alt || "BT Academy"}
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
            <div className="absolute bottom-8 img-gallery left-0 right-0 z-[9999998]">
              <div className="thumbnail-strip flex justify-center space-x-3 px-4 overflow-x-auto">
                {galleryImages.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((image, index) => {
                  const actualIndex = Math.max(0, currentIndex - 2) + index;
                  return (
                    <button
                      key={image._id || image.id || actualIndex}
                      onClick={() => {
                        setCurrentIndex(actualIndex);
                        setSelectedImage(galleryImages[actualIndex]);
                      }}
                      className={`lightbox-thumbnail flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        actualIndex === currentIndex
                          ? 'border-pink-600 opacity-100'
                          : 'border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || "Thumbnail"}
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
