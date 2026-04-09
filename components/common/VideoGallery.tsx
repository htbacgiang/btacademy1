import React, { useState, useEffect } from "react";
import Image from "next/image";
import VideoModal from "./VideoModal";
import { FaPlay } from "react-icons/fa";

interface Video {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  videoType: "youtube" | "facebook";
  thumbnail?: string;
  videoId?: string;
  order?: number;
}

interface VideoGalleryProps {
  maxVideos?: number;
  showTitle?: boolean;
  showDescription?: boolean;
  showPagination?: boolean;
  videosPerPage?: number;
  mobileScrollable?: boolean;
}

const VideoGallery: React.FC<VideoGalleryProps> = ({
  maxVideos,
  showTitle = true,
  showDescription = false,
  showPagination = false,
  videosPerPage = 9,
  mobileScrollable = true,
}) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchVideos();
  }, [maxVideos]);

  useEffect(() => {
    setCurrentPage(1);
  }, [videos.length, showPagination, videosPerPage]);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos?active=true");
      const data = await response.json();

      if (data.success) {
        const sortedVideos = [...data.videos].sort(
          (a: Video, b: Video) => (a.order || 0) - (b.order || 0)
        );
        const limitedVideos =
          typeof maxVideos === "number"
            ? sortedVideos.slice(0, maxVideos)
            : sortedVideos;

        setVideos(limitedVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const getThumbnailUrl = (video: Video) => {
    // Luôn ưu tiên lấy thumbnail trực tiếp từ video YouTube
    if (video.videoType === "youtube") {
      if (video.videoId) {
        return `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
      }
      // Nếu không có videoId, thử extract từ URL
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = video.videoUrl.match(youtubeRegex);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
      }
    }
    
    // Facebook video - sử dụng thumbnail đã lưu nếu có
    if (video.videoType === "facebook" && video.thumbnail) {
      return video.thumbnail;
    }
    
    // Fallback: dùng thumbnail đã lưu hoặc placeholder
    return video.thumbnail || "/images/placeholder-video.jpg";
  };

  const totalPages = showPagination
    ? Math.ceil(videos.length / videosPerPage)
    : 1;

  const displayedVideos = showPagination
    ? videos.slice(
        (currentPage - 1) * videosPerPage,
        currentPage * videosPerPage
      )
    : videos;

  const renderPaginationButton = (
    label: React.ReactNode,
    page: number,
    isActive = false,
    isDisabled = false
  ) => (
    <button
      type="button"
      onClick={() => !isDisabled && setCurrentPage(page)}
      disabled={isDisabled}
      className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors ${
        isActive
          ? "border-green-600 bg-green-600 text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-600"
      } ${isDisabled ? "cursor-not-allowed opacity-50 hover:border-gray-200 hover:text-gray-700" : ""}`}
    >
      {label}
    </button>
  );

  const renderVideoCard = (video: Video, compact = false) => (
    <div
      key={video._id}
      className={`group relative bg-white overflow-hidden cursor-pointer transition-all duration-300 ${
        compact
          ? "rounded-lg shadow-md hover:shadow-xl flex-shrink-0"
          : "rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2"
      }`}
      style={compact ? { width: "280px" } : undefined}
      onClick={() => handleVideoClick(video)}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-200">
        <Image
          src={getThumbnailUrl(video)}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/placeholder-video.jpg";
          }}
        />

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div
            className={`bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
              compact ? "w-12 h-12" : "w-12 h-12 md:w-16 md:h-16"
            }`}
          >
            <FaPlay className="text-green-600 ml-1" size={18} />
          </div>
        </div>

        <div className={`absolute ${compact ? "top-1.5 right-1.5" : "top-1.5 right-1.5 md:top-3 md:right-3"}`}>
          <span
            className={`bg-black/70 text-white backdrop-blur-sm ${
              compact
                ? "px-1.5 py-0.5 text-[12px] rounded"
                : "px-1.5 py-0.5 md:px-2 md:py-1 text-[12px] md:text-sm rounded md:rounded-md"
            }`}
          >
            {video.videoType === "youtube" ? "Youtube" : "Facebook"}
          </span>
        </div>
      </div>

      <div className={compact ? "p-1.5" : "p-2"}>
        <h3
          className={`font-semibold px-2 text-gray-900 mb-1 md:mb-2 line-clamp-2 group-hover:text-green-600 transition-colors ${
            compact ? "text-sm" : "text-base"
          }`}
        >
          {video.title}
        </h3>
        {showDescription && video.description && (
          <p
            className={`px-2 pb-2 text-gray-600 line-clamp-3 ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {video.description}
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-2 md:px-4">
          {/* Section Header */}
          {showTitle && (
            <div className="text-center mb-6 md:mb-12">
              <div className="w-16 h-1 bg-gray-300 mx-auto mb-4 md:mb-6"></div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ">
                  Video Học Viên Trung Tâm Đào Tạo MC BT Academy
                </span>
              </h2>
              <p className="text-sm md:text-base hidden md:block text-gray-600 max-w-4xl mx-auto px-2">
                Theo dõi những khoảnh khắc đáng nhớ, thành tích và hoạt động của học viên tại Trung Tâm Đào tạo MC BT Academy. Cập nhật thường xuyên với những video mới nhất từ các khóa học và sự kiện.
              </p>
            </div>
          )}

          {mobileScrollable ? (
            <>
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 px-2">
                {displayedVideos.map((video) => renderVideoCard(video))}
              </div>

              <div className="lg:hidden overflow-x-auto pb-4 px-2 scrollbar-hide">
                <div className="flex gap-3" style={{ width: "max-content" }}>
                  {displayedVideos.map((video) => renderVideoCard(video, true))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
              {displayedVideos.map((video) => renderVideoCard(video))}
            </div>
          )}

          {showPagination && totalPages > 1 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 px-2">
              {renderPaginationButton("Trước", currentPage - 1, false, currentPage === 1)}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) =>
                  renderPaginationButton(page, page, currentPage === page)
              )}
              {renderPaginationButton(
                "Sau",
                currentPage + 1,
                false,
                currentPage === totalPages
              )}
            </div>
          )}

      
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default VideoGallery;
