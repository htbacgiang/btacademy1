import { FinalPost } from "../components/editor";
import { PostDetail } from "./types";

export const generateFormData = (post: FinalPost) => {
  const formData = new FormData();
  for (let key in post) {
    const value = (post as any)[key];

    // Bỏ qua undefined và null
    if (value === undefined || value === null) continue;

    if (key === "tags") {
      const tagStr = typeof value === "string" ? value.trim() : "";
      const tags = tagStr ? tagStr.split(",").map((tag: string) => tag.trim()) : [];
      formData.append("tags", JSON.stringify(tags));
    } else if (typeof value === "boolean") {
      // FormData không hiểu boolean, phải chuyển thành string
      formData.append(key, String(value));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  }

  return formData;
};

export const filterPosts = (posts: PostDetail[], postToFilter: PostDetail) => {
  return posts.filter((post) => {
    return post.id !== postToFilter.id;
  });
};

export const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text;
  return text.substring(0, trimBy).trim() + "...";
};

const decodeHtmlEntities = (str: string) => {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
};

export const extractHeadingsAndInjectIds = (htmlString: string) => {
  const headings: { text: string; id: string; level: number }[] = [];
  let headingIndex = 0;

  const processedHtml = htmlString.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag, attributes, contentText) => {
      const rawText = contentText.replace(/<[^>]+>/g, "").trim();
      if (!rawText) return match;

      const cleanText = decodeHtmlEntities(rawText);

      const baseId = cleanText
        .toLowerCase()
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      
      const id = `${baseId}-${headingIndex++}`;

      headings.push({
        text: cleanText,
        id,
        level: tag.toLowerCase() === "h2" ? 2 : 3
      });

      if (/id=/i.test(attributes)) {
        return match;
      }

      return `<${tag}${attributes} id="${id}">${contentText}</${tag}>`;
    }
  );

  return { processedHtml, headings };
};
