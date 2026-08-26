import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX, FiImage } from "react-icons/fi";

export interface ArticleGalleryImage {
  src: string;
  altText?: string;
  width?: number;
  height?: number;
  ratioMode?: string;
}

interface Props {
  images: ArticleGalleryImage[];
  title?: string;
}

export const parseArticleGalleryImages = (
  value?: string
): ArticleGalleryImage[] => {
  if (!value) return [];

  try {
    const images = JSON.parse(value);
    if (!Array.isArray(images)) return [];

    return images.filter(
      (image) =>
        image &&
        typeof image === "object" &&
        typeof image.src === "string" &&
        Boolean(image.src)
    );
  } catch {
    return [];
  }
};

const ArticleImageGallery: FC<Props> = ({
  images,
  title = "Thư viện hình ảnh",
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const validImages = images.filter((img) => Boolean(img?.src));

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showNext = useCallback(
    () =>
      setLightboxIndex((curr) =>
        curr === null ? null : (curr + 1) % validImages.length
      ),
    [validImages.length]
  );
  const showPrev = useCallback(
    () =>
      setLightboxIndex((curr) =>
        curr === null ? null : (curr - 1 + validImages.length) % validImages.length
      ),
    [validImages.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  if (!validImages || validImages.length === 0) return null;

  return (
    <section className="not-prose article-image-gallery my-8">
      {/* Header */}
      <div className="article-image-gallery-header flex items-center gap-2 mb-4">
        <span className="article-image-gallery-accent w-1 h-6 rounded-full bg-[#105d97]" aria-hidden="true" />
        <h3 className="article-image-gallery-title text-xl font-bold text-gray-900 dark:text-gray-100 m-0">
          {title}
        </h3>
        <span className="article-image-gallery-count ml-auto text-xs text-gray-400">
          {validImages.length} ảnh
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {validImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setLightboxIndex(idx)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#105d97]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.altText || `${title} ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2 bg-black/60 rounded-full text-white text-sm">
                <FiImage className="w-5 h-5" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && validImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 transition-colors z-10"
            aria-label="Đóng"
          >
            <FiX className="w-6 h-6" />
          </button>

          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors z-10"
                aria-label="Ảnh trước"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-white/10 hover:bg-white/25 transition-colors z-10"
                aria-label="Ảnh tiếp theo"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={validImages[lightboxIndex].src}
              alt={validImages[lightboxIndex].altText || `${title} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            {validImages[lightboxIndex].altText && (
              <p className="mt-3 text-white text-sm text-center">
                {validImages[lightboxIndex].altText}
              </p>
            )}
            <p className="mt-1 text-gray-400 text-xs">
              {lightboxIndex + 1} / {validImages.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArticleImageGallery;
