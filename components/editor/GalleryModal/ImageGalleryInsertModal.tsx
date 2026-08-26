import { FC, useCallback, useEffect, useState } from "react";
import { FiCheck, FiImage, FiX } from "react-icons/fi";
import ModalContainer, { ModalProps } from "../../common/ModalContainer";
import type { GalleryImage } from "../ImageGallery";

interface ImageData {
  src: string;
  altText?: string;
  id?: string;
}

interface Props extends ModalProps {
  images: ImageData[];
  onSelect(images: GalleryImage[]): void;
}

const ImageGalleryInsertModal: FC<Props> = ({ visible, onClose, images, onSelect }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("Thư viện hình ảnh");

  useEffect(() => {
    if (visible) {
      setSelected(new Set());
      setTitle("Thư viện hình ảnh");
    }
  }, [visible]);

  const toggleSelect = useCallback((src: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(src)) next.delete(src);
      else next.add(src);
      return next;
    });
  }, []);

  const handleInsert = () => {
    if (selected.size < 2) return;
    const galleryImages: GalleryImage[] = images
      .filter((img) => selected.has(img.src))
      .map((img) => ({ src: img.src, altText: img.altText || "" }));
    onSelect(galleryImages);
    onClose?.();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Chèn Gallery ảnh</h2>
            <p className="mt-1 text-sm text-gray-500">
              Chọn ít nhất 2 ảnh từ thư viện. Đã chọn: <span className="font-semibold text-[#105d97]">{selected.size}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Title input */}
        <div className="px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề gallery</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thư viện hình ảnh"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#105d97] focus:ring-2 focus:ring-[#105d97]/20"
          />
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 custom-scrollbar">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiImage className="w-12 h-12 mb-3" />
              <p className="text-sm">Chưa có ảnh nào trong thư viện.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img) => {
                const isSelected = selected.has(img.src);
                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => toggleSelect(img.src)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected
                        ? "border-[#105d97] ring-2 ring-[#105d97]/40 scale-95"
                        : "border-gray-200 hover:border-[#105d97]/50"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.altText || ""}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#105d97]/20 flex items-center justify-center">
                        <div className="bg-[#105d97] rounded-full p-1">
                          <FiCheck className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          {selected.size > 0 && selected.size < 2 && (
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Vui lòng chọn ít nhất 2 ảnh để tạo gallery.
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleInsert}
              disabled={selected.size < 2}
              className="rounded-lg bg-[#105d97] px-5 py-2.5 font-medium text-white hover:bg-[#0e4d7a] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Chèn Gallery ({selected.size} ảnh)
            </button>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ImageGalleryInsertModal;
