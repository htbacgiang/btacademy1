import { ChangeEventHandler, FC, useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent, getMarkRange, Range } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Link } from "@tiptap/extension-link";
import { Youtube } from "@tiptap/extension-youtube";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";

import ToolBar from "./ToolBar";
import EditLink from "./Link/EditLink";
import EditImage from "./Image/EditImage";
import GalleryModal, { ImageSelectionResult } from "./GalleryModal";
import axios from "axios";
import SEOForm, { SeoResult } from "./SeoForm";
import ThumbnailSelector from "./ThumbnailSelector";
import WordCount from "./WordCount";
import { toast } from "react-toastify";

export interface FinalPost extends SeoResult {
  id?: string;
  title: string;
  content: string;
  thumbnail?: File | string;
  focusKeyword: string;
  isDraft?: boolean;
  isFeatured?: boolean; // Bài viết nổi bật
}

interface Props {
  initialValue?: FinalPost;
  btnTitle?: string;
  busy?: boolean;
  onSubmit(post: FinalPost): void;
}

const Editor: FC<Props> = ({
  initialValue,
  btnTitle = "Đăng bài",
  busy = false,
  onSubmit,
}): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(true); // Mặc định là nháp khi tạo mới
  const [isFeatured, setIsFeatured] = useState(false); // Mặc định không phải bài nổi bật
  const [featuredCount, setFeaturedCount] = useState(0); // Số bài nổi bật hiện tại
  const [images, setImages] = useState<{ src: string; altText?: string; id?: string }[]>([]);
  const [loadingImages, setLoadingImages] = useState(true); // Loading state cho images
  const [seoInitialValue, setSeoInitialValue] = useState<SeoResult>();
  const [post, setPost] = useState<FinalPost>({
    title: "",
    content: "",
    meta: "",
    tags: "",
    slug: "",
    category: "",
    focusKeyword: "",
  });

  // Kiểm tra xem có phải đang tạo bài viết mới không
  const isCreatingNewPost = !initialValue?.id;

  // Button featured bị disable khi đủ 4 bài VÀ bài hiện tại chưa phải featured
  const featuredDisabled = featuredCount >= 4 && !isFeatured;

  // Fetch số bài nổi bật hiện tại
  useEffect(() => {
    axios.get("/api/posts/featured")
      .then(({ data }) => setFeaturedCount(data.count ?? 0))
      .catch(() => {});
  }, []);

  const fetchImages = async (retryCount = 0) => {
    const maxRetries = 3;
    setLoadingImages(true);
    try {
      const { data } = await axios("/api/image", {
        timeout: 30000, // 30 giây timeout
      });
      setImages(data.images || []);
      setLoadingImages(false);
    } catch (error: any) {
      console.error('Error fetching images:', error);

      // Retry logic nếu chưa vượt quá số lần thử
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying fetchImages in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          fetchImages(retryCount + 1);
        }, delay);
      } else {
        // Nếu đã thử hết, set mảng rỗng để UI vẫn hoạt động
        console.warn('Failed to fetch images after all retries, using empty array');
        setImages([]);
        setLoadingImages(false);
      }
    }
  };

  const handleImageUpload = async (imageData: File | { file: File; altText: string }) => {
    setUploading(true);
    try {
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

      const { data } = await axios.post("/api/image", formData, {
        timeout: 60000, // 60 giây timeout cho upload
      });

      console.log('[handleImageUpload] Upload response:', data);

      // Thêm ảnh mới vào đầu danh sách với format đúng
      const newImage = {
        src: data.src,
        altText: data.altText || "",
        id: data.id || data.src // Fallback nếu không có id
      };

      setImages(prev => {
        // Kiểm tra xem ảnh đã tồn tại chưa (tránh duplicate)
        const exists = prev.some(img => img.src === newImage.src || img.id === newImage.id);
        if (exists) {
          console.log('[handleImageUpload] Image already exists, skipping');
          return prev;
        }
        return [newImage, ...prev];
      });

      toast.success("Upload ảnh thành công!");

      // Refresh lại danh sách từ server để đảm bảo đồng bộ
      // (chạy sau một chút để đảm bảo database đã được cập nhật)
      setTimeout(() => {
        fetchImages(0).catch(err => console.error('Error refreshing images:', err));
      }, 500);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error.response?.data?.error || error.message || "Có lỗi xảy ra khi upload ảnh";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
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
        placeholder: "Viết bài nhớ chuẩn SEO",
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video",
        },
      }),
      TipTapImage.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            'data-show-caption': {
              default: 'false',
              parseHTML: element => element.getAttribute('data-show-caption') || 'false',
              renderHTML: attributes => {
                if (!attributes['data-show-caption']) {
                  return {};
                }
                return {
                  'data-show-caption': attributes['data-show-caption'],
                };
              },
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          class: "mx-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
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
  });

  const handleImageSelection = (result: ImageSelectionResult) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: result.src, alt: result.altText })
      .run();
  };

  const handleSubmit = () => {
    if (!editor) return;
    onSubmit({ ...post, content: editor.getHTML(), isDraft, isFeatured });
  };

  const saveDraft = useCallback(async () => {
    if (!editor || !isCreatingNewPost) return;

    setSavingDraft(true);
    try {
      const formData = new FormData();
      formData.append("title", post.title || "Nháp bài viết");
      formData.append("content", editor.getHTML());
      formData.append("meta", post.meta || "");
      formData.append("slug", post.slug || `draft-${Date.now()}`);
      formData.append("category", post.category || "");

      // Xử lý tags an toàn hơn
      let tagsArray: string[] = [];
      if (post.tags) {
        if (typeof post.tags === 'string') {
          tagsArray = post.tags.split(',').filter((tag: string) => tag.trim() !== '');
        } else if (Array.isArray(post.tags)) {
          tagsArray = (post.tags as any[]).filter((tag: any) => typeof tag === 'string');
        }
      }
      // Đảm bảo luôn gửi một mảng hợp lệ
      formData.append("tags", JSON.stringify(tagsArray || []));

      if (post.id) {
        formData.append("postId", post.id);
      }

      if (post.thumbnail instanceof File) {
        formData.append("thumbnail", post.thumbnail);
      }

      const { data } = await axios.post("/api/posts/draft", formData);

      // Cập nhật post ID nếu là nháp mới
      if (!post.id && data.post._id) {
        setPost(prev => ({ ...prev, id: data.post._id }));
        setIsDraft(true); // Đảm bảo trạng thái là nháp
      }

      // Toast thành công
      toast.success("Nháp bài viết đã được lưu thành công!");
    } catch (error) {
      console.error("Lỗi lưu nháp:", error);
      toast.error("Có lỗi xảy ra khi lưu nháp bài viết!");
    } finally {
      setSavingDraft(false);
    }
  }, [editor, post, isCreatingNewPost]);

  const publishDraft = useCallback(async () => {
    if (!post.id) {
      return;
    }

    setPublishing(true);
    try {
      const { data } = await axios.put("/api/posts/draft", {
        postId: post.id,
        isDraft: false
      });

      // Cập nhật trạng thái local
      setIsDraft(false);

      // Toast thành công
      toast.success("Bài viết đã được công khai thành công!");

      // Chuyển hướng sau khi hiển thị toast
      setTimeout(() => {
        window.location.href = "/dashboard/bai-viet";
      }, 1500);
    } catch (error: any) {
      console.error("Lỗi công khai bài viết:", error);
      toast.error("Có lỗi xảy ra khi công khai bài viết!");
    } finally {
      setPublishing(false);
    }
  }, [post.id]);

  const convertToDraft = useCallback(async () => {
    if (!post.id) {
      return;
    }

    setSavingDraft(true);
    try {
      const { data } = await axios.put("/api/posts/draft", {
        postId: post.id,
        isDraft: true
      });

      // Cập nhật trạng thái local
      setIsDraft(true);

      // Toast thành công
      toast.success("Bài viết đã được chuyển về lưu nháp!");
    } catch (error: any) {
      console.error("Lỗi chuyển về nháp:", error);
      toast.error("Có lỗi xảy ra khi chuyển về nháp!");
    } finally {
      setSavingDraft(false);
    }
  }, [post.id]);

  // Tự động lưu nháp mỗi 30 giây chỉ khi tạo bài viết mới
  useEffect(() => {
    if (!isCreatingNewPost) return;

    const autoSaveInterval = setInterval(() => {
      if (editor && (post.title || editor.getHTML().trim())) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [saveDraft, editor, post.title, isCreatingNewPost]);





  const updateTitle: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
    setPost({ ...post, title: target.value });

  const updateSeoValue = (result: SeoResult) => setPost({ ...post, ...result });

  const updateThumbnail = (file: File) => setPost({ ...post, thumbnail: file });

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange);
    }
  }, [editor, selectionRange]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (initialValue) {
      setPost({ ...initialValue });
      editor?.commands.setContent(initialValue.content);

      const { meta, slug, tags, category, focusKeyword } = initialValue;
      setSeoInitialValue({ meta, slug, tags, category, focusKeyword });

      // Cập nhật trạng thái nháp từ initialValue
      // Nếu đang edit bài viết có sẵn, giữ nguyên trạng thái isDraft từ database
      // Nếu tạo mới (không có id), mặc định là draft
      setIsDraft(initialValue.isDraft ?? true);

      // Cập nhật trạng thái nổi bật từ initialValue
      setIsFeatured(initialValue.isFeatured ?? false);
    }
  }, [initialValue, editor]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
        {/* Content - Left */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-[calc(100vh-140px)] overflow-hidden flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Nội dung bài viết *</h2>
            <div className="flex items-center gap-3">
              {(isCreatingNewPost || (!isDraft && post.id)) && (
                <button
                  onClick={isCreatingNewPost ? saveDraft : convertToDraft}
                  disabled={savingDraft || publishing}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium text-sm ${(savingDraft || publishing) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {(savingDraft || publishing) ? (
                    <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">{savingDraft ? "Đang lưu..." : (isCreatingNewPost ? "Lưu nháp" : "Về nháp")}</span>
                </button>
              )}

              {post.id && isDraft && (
                <button
                  onClick={publishDraft}
                  disabled={publishing}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm ${publishing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {publishing ? (
                    <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">{publishing ? "Đang xử lý..." : "Công khai"}</span>
                </button>
              )}

              <button
                onClick={handleSubmit}
                disabled={busy}
                className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#105d97] hover:bg-[#0e4d7a] text-white rounded-lg transition-colors font-medium text-sm ${busy ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {busy ? (
                  <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                <span className="whitespace-nowrap">{busy ? "Đang đăng..." : btnTitle}</span>
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg flex flex-col bg-white flex-1 min-h-0">
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex-shrink-0 z-10">
              <ToolBar
                editor={editor}
                onOpenImageClick={() => setShowGallery(true)}
              />
            </div>

            <div className="p-4 w-full flex-1 overflow-y-auto custom-scrollbar">
              {editor ? <EditLink editor={editor} /> : null}
              {editor ? <EditImage editor={editor} /> : null}
              <div className="editor-content">
                <EditorContent editor={editor} className="min-h-[600px]" />
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-500 flex-shrink-0">
            <WordCount editor={editor} />
          </div>


        </div>

        {/* Basic Info - Right 350px */}
        <div className="sticky top-0 z-10 h-fit pr-1 pb-2 w-full lg:w-[350px] shrink-0">
          {/* Basic Info & SEO Combine */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề bài viết *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none"
                  placeholder="Tiêu đề bài viết..."
                  onChange={updateTitle}
                  value={post.title}
                />
              </div>
            </div>

            <div className="">
              <SEOForm
                onChange={updateSeoValue}
                title={post.title}
                editor={editor}
                initialValue={seoInitialValue}
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hình ảnh đại diện</h2>
            <ThumbnailSelector
              initialValue={post.thumbnail as string}
              onChange={updateThumbnail}
              images={images}
              uploading={uploading || loadingImages}
              onFileSelect={handleImageUpload}
              onImageFromGallery={(imageUrl) => {
                setPost(prev => ({ ...prev, thumbnail: imageUrl }));
              }}
            />
          </div>

          {/* Bài viết nổi bật */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bài viết nổi bật</h2>
            <p className="text-sm text-gray-500 mb-4">
              Tối đa 4 bài viết nổi bật được hiển thị ở đầu trang /bai-viet.
            </p>
            <button
              type="button"
              onClick={() => !featuredDisabled && setIsFeatured((prev) => !prev)}
              disabled={featuredDisabled}
              title={featuredDisabled ? "Đã đủ 4 bài nổi bật. Vào dashboard/bai-viet để quản lý." : ""}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                featuredDisabled
                  ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-60"
                  : isFeatured
                  ? "border-amber-400 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
              }`}
            >
              <svg
                className={`w-5 h-5 flex-shrink-0 ${featuredDisabled ? "text-gray-300" : isFeatured ? "text-amber-500" : "text-gray-400"}`}
                fill={isFeatured && !featuredDisabled ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              {isFeatured ? "Đang là bài viết nổi bật" : "Đánh dấu là nổi bật"}
            </button>
          </div>

        </div>
      </div>

      <GalleryModal
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        images={images}
        onFileSelect={handleImageUpload}
        uploading={uploading || loadingImages}
      />
      <style jsx global>{`
        .tiptap-table {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          max-width: 100%;
          width: max-content !important;
          margin: 1.5em auto !important;
        }
      `}</style>
    </>
  );
};

export default Editor;
