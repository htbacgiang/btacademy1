import { Node, mergeAttributes } from "@tiptap/core";

export interface CloudinaryVideoOptions {
  HTMLAttributes: Record<string, any>;
}

type VideoAspectRatio = "square" | "vertical" | "horizontal";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cloudinaryVideo: {
      setCloudinaryVideo: (options: {
        src: string;
        title?: string;
        aspectRatio?: VideoAspectRatio;
      }) => ReturnType;
    };
  }
}

export const CloudinaryVideo = Node.create<CloudinaryVideoOptions>({
  name: "cloudinaryVideo",

  addOptions() {
    return {
      HTMLAttributes: {
        class: "cloudinary-video-embed",
        style: "display:block; width:100%; max-width:100%; margin:20px auto;",
      },
    };
  },

  addGlobalAttributes() {
    return [];
  },

  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: "Video BT Academy" },
      aspectRatio: { default: "horizontal" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.cloudinary-video-embed",
        getAttrs: (element) => ({
          src: element.querySelector("video")?.getAttribute("src"),
          title: element.querySelector("video")?.getAttribute("title") || "Video BT Academy",
          aspectRatio: element.getAttribute("data-aspect-ratio") || "horizontal",
        }),
      },
      {
        tag: "video[data-cloudinary-video]",
        getAttrs: (element) => ({
          src: element.getAttribute("src"),
          title: element.getAttribute("title") || "Video BT Academy",
          aspectRatio: "horizontal",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const aspectRatio = node.attrs.aspectRatio || "horizontal";
    const maxWidth = aspectRatio === "vertical" ? "420px" : aspectRatio === "square" ? "640px" : "100%";
    const aspectValue = aspectRatio === "square" ? "1 / 1" : aspectRatio === "vertical" ? "9 / 16" : "16 / 9";

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-aspect-ratio": aspectRatio,
        style: `display:block; width:100%; max-width:${maxWidth}; aspect-ratio:${aspectValue}; margin:20px auto; background:#000; border-radius:0.75rem; overflow:hidden;`,
      }),
      [
        "video",
        {
          src: node.attrs.src,
          title: node.attrs.title || "Video BT Academy",
          controls: "controls",
          playsinline: "playsinline",
          preload: "metadata",
          "data-cloudinary-video": "true",
          style: "display:block; width:100%; height:100%; object-fit:contain;",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setCloudinaryVideo:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: options }),
    };
  },
});

export default CloudinaryVideo;
