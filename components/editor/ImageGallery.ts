import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

export interface GalleryImage {
  src: string;
  altText?: string;
}

export interface ImageGalleryOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageGallery: {
      setImageGallery: (options: { images: GalleryImage[]; title?: string }) => ReturnType;
    };
  }
}

const normalizeImages = (images: unknown): GalleryImage[] => {
  if (!Array.isArray(images)) return [];
  return images.filter(
    (img): img is GalleryImage =>
      Boolean(img) &&
      typeof img === "object" &&
      typeof (img as GalleryImage).src === "string" &&
      Boolean((img as GalleryImage).src.trim())
  );
};

const parseImagesAttribute = (value: string | null): GalleryImage[] => {
  if (!value) return [];
  try {
    return normalizeImages(JSON.parse(value));
  } catch {
    return [];
  }
};

export const ImageGallery = Node.create<ImageGalleryOptions>({
  name: "imageGallery",

  addOptions() {
    return {
      HTMLAttributes: { class: "article-image-gallery" },
    };
  },

  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: "Thư viện hình ảnh",
        parseHTML: (el) => el.getAttribute("data-title") || "Thư viện hình ảnh",
      },
      images: {
        default: [],
        parseHTML: (el) => {
          const stored = parseImagesAttribute(el.getAttribute("data-images"));
          if (stored.length > 0) return stored;
          return Array.from(el.querySelectorAll("img")).map((img) => ({
            src: img.getAttribute("src") || "",
            altText: img.getAttribute("alt") || "",
          }));
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-article-gallery="true"]' }];
  },

  renderHTML({ node }) {
    const images = normalizeImages(node.attrs.images);
    const title = node.attrs.title || "Thư viện hình ảnh";
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-article-gallery": "true",
        "data-images": JSON.stringify(images),
        "data-title": title,
        "data-count": String(images.length),
      }),
      [
        "div",
        { class: "article-image-gallery-header" },
        ["div", { class: "article-image-gallery-title" }, title],
        ["span", { class: "article-image-gallery-count" }, `${images.length} ảnh`],
      ],
      [
        "div",
        { class: "article-image-gallery-grid" },
        ...images.map((img, i) => [
          "div",
          { class: "article-image-gallery-item" },
          ["img", { src: img.src, alt: img.altText || `${title} ${i + 1}`, loading: "lazy" }],
        ]),
      ],
    ];
  },

  addCommands() {
    return {
      setImageGallery:
        ({ images, title = "Thư viện hình ảnh" }) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { title, images: normalizeImages(images) },
          }),
    };
  },

  addNodeView() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ImageGalleryView = require("./ImageGalleryView").default;
    return ReactNodeViewRenderer(ImageGalleryView);
  },
});
