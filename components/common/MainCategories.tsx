import { FC, useState } from "react";

interface Props {
  onCategorySelect: (category: string | null) => void; // Hàm xử lý khi danh mục được chọn
}

const MainCategories: FC<Props> = ({ onCategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // Lưu danh mục đang được chọn

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category); // Cập nhật trạng thái active
    onCategorySelect(category); // Gọi hàm callback
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full sm:w-11/12 md:w-11/12 rounded-3xl xl:rounded-full p-4 shadow-lg gap-4 flex sm:flex-row flex-wrap items-center justify-center bg-gray-100 mt-5">
        <button
          onClick={() => handleCategoryClick(null)} // Tất cả bài viết
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === null
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Tất cả bài viết
        </button>
        <button
          onClick={() => handleCategoryClick("Kỹ năng MC")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Kỹ năng MC"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Kỹ năng MC
        </button>

        <button
          onClick={() => handleCategoryClick("Thuyết trình & Giao tiếp")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Thuyết trình & Giao tiếp"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Thuyết trình & Giao tiếp
        </button>
        <button
          onClick={() => handleCategoryClick("Góc MC Nhí")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Góc MC Nhí"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Góc MC Nhí
        </button>
        <button
          onClick={() => handleCategoryClick("Tin tức & Sự kiện")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Tin tức & Sự kiện"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
            Tin tức & Sự kiện
        </button>
      
      </div>
    </div>
  );
};

export default MainCategories;
