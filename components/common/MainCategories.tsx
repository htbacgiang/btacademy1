import { FC, useState } from "react";
import { POST_CATEGORIES } from "../../utils/postCategories";

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
        {POST_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
              activeCategory === category
                ? "bg-blue-800 text-white"
                : "hover:bg-blue-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainCategories;
