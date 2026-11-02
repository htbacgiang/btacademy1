import { FC, useState, useRef } from "react";
import { Editor } from "@tiptap/react";
import { toast } from "react-toastify";
import { AiFillCaretDown } from "react-icons/ai";
import useOutsideClick from "./useOutsideClick";

interface Props {
  editor: Editor | null;
  onToggle?(isOpen: boolean): void;
}

const DEFAULT_CTA_HTML_BOX = `<blockquote><p><strong>🎁 ĐĂNG KÝ TEST GIỌNG MIỄN PHÍ &amp; NHẬN TƯ VẤN LỘ TRÌNH 1:1</strong></p><p><strong>Hotline/Zalo:</strong> <strong><a href="https://zalo.me/0988027494" target="_blank" rel="noopener noreferrer">0988 02 74 94</a></strong> (Tư vấn chuyên sâu 24/7)<br><strong>Địa chỉ CS1:</strong> 19 Nguyễn Gia Thiều, Hoàn Kiếm, Hà Nội.<br><strong>Địa chỉ CS2:</strong> Tòa nhà Viettel, Số 4 Hoàng Văn Thụ, TP. Thái Nguyên.<br><strong>Fanpage:</strong> <a href="https://web.facebook.com/profile.php?id=61564432965502" target="_blank" rel="noopener noreferrer">BT Academy - Đào tạo giọng nói và thần thái doanh nghiệp</a><br><strong>Website:</strong> <a href="https://btacademy.com.vn/" target="_blank" rel="noopener noreferrer">btacademy.com.vn</a></p></blockquote><p></p>`;

const DEFAULT_CTA_HTML_TEXT = `<p><strong>🎁 ĐĂNG KÝ TEST GIỌNG MIỄN PHÍ &amp; NHẬN TƯ VẤN LỘ TRÌNH 1:1</strong><br><strong>Hotline/Zalo:</strong> <strong><a href="https://zalo.me/0988027494" target="_blank" rel="noopener noreferrer">0988 02 74 94</a></strong> (Tư vấn chuyên sâu 24/7)<br><strong>Địa chỉ CS1:</strong> 19 Nguyễn Gia Thiều, Hoàn Kiếm, Hà Nội.<br><strong>Địa chỉ CS2:</strong> Tòa nhà Viettel, Số 4 Hoàng Văn Thụ, TP. Thái Nguyên.<br><strong>Fanpage:</strong> <a href="https://web.facebook.com/profile.php?id=61564432965502" target="_blank" rel="noopener noreferrer">BT Academy - Đào tạo giọng nói và thần thái doanh nghiệp</a><br><strong>Website:</strong> <a href="https://btacademy.com.vn/" target="_blank" rel="noopener noreferrer">btacademy.com.vn</a></p><p></p>`;

const InsertCTA: FC<Props> = ({ editor, onToggle }): JSX.Element => {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (open: boolean) => {
    setVisible(open);
    onToggle?.(open);
  };

  useOutsideClick(containerRef, visible, () => toggleDropdown(false));

  const handleInsert = (format: "text" | "box" = "text") => {
    if (!editor) {
      toast.error("Không tìm thấy trình soạn thảo!");
      return;
    }

    const htmlToInsert = format === "box" ? DEFAULT_CTA_HTML_BOX : DEFAULT_CTA_HTML_TEXT;
    editor.chain().focus().insertContent(htmlToInsert).run();

    toast.success("Đã chèn CTA mặc định thành công!");
    toggleDropdown(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onKeyDown={({ key }) => {
        if (key === "Escape") toggleDropdown(false);
      }}
    >
      {/* Nút bấm trên Toolbar */}
      <div className="inline-flex items-center rounded-md border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors">
        {/* Nút 1-click chèn ngay (mặc định dạng văn bản sạch không có dấu ngoặc kép) */}
        <button
          type="button"
          onClick={() => handleInsert("text")}
          title="Nhấp để chèn nhanh CTA mặc định vào bài viết"
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold cursor-pointer select-none"
        >
          <span className="text-sm">🎁</span>
          <span>CTA</span>
        </button>

        {/* Nút mũi tên mở tùy chọn */}
        <button
          type="button"
          onClick={() => toggleDropdown(!visible)}
          title="Tùy chọn kiểu chèn CTA"
          className="px-1 py-1.5 border-l border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50 cursor-pointer"
        >
          <AiFillCaretDown size={10} />
        </button>
      </div>

      {/* Menu / Popover khi mở */}
      {visible && (
        <div className="absolute top-full mt-2 left-0 z-50 w-80 sm:w-96 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span>🎁</span> Chèn mẫu CTA mặc định
            </span>
            <span className="text-[10px] text-gray-400">Esc để đóng</span>
          </div>

          {/* Xem trước nội dung */}
          <div className="p-2.5 mb-3 bg-gray-50 dark:bg-gray-900/60 rounded-md border border-gray-200 dark:border-gray-700 text-xs space-y-1">
            <p className="font-bold text-gray-900 dark:text-gray-100">
              🎁 ĐĂNG KÝ TEST GIỌNG MIỄN PHÍ &amp; NHẬN TƯ VẤN LỘ TRÌNH 1:1
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-gray-100">Hotline/Zalo:</span>{" "}
              <span className="text-emerald-600 font-semibold">0988 02 74 94</span> (Tư vấn chuyên sâu 24/7)
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-gray-100">Địa chỉ CS1:</span> 19 Nguyễn Gia Thiều, Hoàn Kiếm, Hà Nội.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-gray-100">Địa chỉ CS2:</span> Tòa nhà Viettel, Số 4 Hoàng Văn Thụ, TP. Thái Nguyên.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-gray-100">Fanpage:</span>{" "}
              <span className="text-emerald-600 font-medium">BT Academy - Đào tạo giọng nói và thần thái doanh nghiệp</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-bold text-gray-900 dark:text-gray-100">Website:</span>{" "}
              <span className="text-emerald-600 underline">btacademy.com.vn</span>
            </p>
          </div>

          {/* 2 Kiểu chèn */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleInsert("text")}
              className="flex flex-col items-center justify-center p-2 rounded-md border border-emerald-500 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer transition shadow-xs"
            >
              <span className="font-bold">Đoạn văn bản (Chuẩn)</span>
              <span className="text-[10px] text-emerald-100">(Không dấu ngoặc kép)</span>
            </button>

            <button
              type="button"
              onClick={() => handleInsert("box")}
              className="flex flex-col items-center justify-center p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium cursor-pointer transition"
            >
              <span className="font-bold">Khung trích dẫn</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">(Viền xanh nổi bật)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertCTA;