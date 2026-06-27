import { FC, useEffect, useState } from "react";
import { useEditor, EditorContent, getMarkRange, Range } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Link } from "@tiptap/extension-link";
import { Youtube } from "@tiptap/extension-youtube";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import ToolBar from "../editor/ToolBar";
import EditLink from "../editor/Link/EditLink";
import GalleryModal, { ImageSelectionResult } from "../editor/GalleryModal";
import axios from "axios";

interface Props {
  content: string; // Initial content value
  onChange: (content: string) => void; // Callback to update content in parent
}

const Editor: FC<Props> = ({ content, onChange }): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<{ src: string }[]>([]);
  const [hasDropdownOpen, setHasDropdownOpen] = useState(false);

  const fetchImages = async () => {
    const { data } = await axios("/api/image");
    setImages(data.images);
  };

  const handleImageUpload = async (imageData: File | { file: File; altText: string }) => {
    setUploading(true);
    const formData = new FormData();
    
    // Kiểm tra xem có phải là object chứa file và altText không
    if (typeof imageData === 'object' && 'file' in imageData && 'altText' in imageData) {
      formData.append("image", imageData.file);
      formData.append("altText", imageData.altText);
    } else {
      // Fallback cho trường hợp chỉ có file
      formData.append("image", imageData as File);
      formData.append("altText", "");
    }
    
    const { data } = await axios.post("/api/image", formData);
    setUploading(false);
    setImages([data, ...images]);
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: "",
        },
      }),
      Placeholder.configure({
        placeholder: "Viết mô tả sản phẩm chuẩn SEO",
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video",
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: "mx-auto",
        },
      }),
      BubbleMenuExtension,
    ],
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view;
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link
        );
        if (selectionRange) setSelectionRange(selectionRange);
      },
      attributes: {
        class:
          "blog prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full",
      },
    },
    content: content, // Set initial content
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Update parent on content change
    },
  });

  const handleImageSelection = (result: ImageSelectionResult) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: result.src, alt: result.altText })
      .run();
  };

  const handleDropdownToggle = (isOpen: boolean) => {
    setHasDropdownOpen(isOpen);
  };

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      // Chỉ cập nhật content nếu nó thực sự khác với content hiện tại
      // và không phải do user đang typing
      const currentContent = editor.getHTML();
      if (currentContent !== content) {
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }
  }, [content, editor]);

  return (
    <>
      <style jsx>{`
        .editor-container {
          position: relative;
          height: 500px;
          display: flex;
          flex-direction: column;
        }
        .editor-toolbar {
          top: 0 !important;
          z-index: 30 !important;
          background: white !important;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
       
        .editor-content {
          flex: 1;
          overflow-y: auto;
          max-height: 800px;
        }
        @media (prefers-color-scheme: dark) {
          .editor-toolbar {
            background: #0f172a !important;
          }
        }
      `}</style>
      <div className="editor-container">
        {/* Toolbar cố định */}
        <div 
          className={`editor-toolbar bg-white dark:bg-slate-900 text-gray-800 dark:text-white shadow-md border-b border-gray-200 dark:border-gray-700 ${hasDropdownOpen ? 'expanded' : ''}`}
        >
          <div className="px-4 py-2 ">
            <ToolBar
              editor={editor}
              onOpenImageClick={() => setShowGallery(true)}
              onDropdownToggle={handleDropdownToggle}
            />
            
          </div>
        </div>
        
        {/* Content area có thể scroll */}
        <div className="editor-content p-2 dark:bg-slate-900 transition">
          {editor ? <EditLink editor={editor} /> : null}
          <EditorContent editor={editor} className="min-h-[500px] prose max-w-full mx-auto" />
        </div>
      </div>

      <GalleryModal
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        onFileSelect={handleImageUpload}
        uploading={uploading}
        images={images}
      />
    </>
  );
};

export default Editor;
