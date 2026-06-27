export const POST_CATEGORIES = [
  "Kỹ năng MC",
  "Góc MC Nhí",
  "Thuyết trình & Giao tiếp",
  "Tin tức & Sự kiện",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

const toCategoryKey = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/&/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

const CATEGORY_BY_KEY = new Map<string, PostCategory>(
  POST_CATEGORIES.map((category) => [toCategoryKey(category), category])
);

export const normalizePostCategory = (value?: string | null): string => {
  if (!value) return "";

  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  return CATEGORY_BY_KEY.get(toCategoryKey(trimmedValue)) || trimmedValue;
};

export const isKnownPostCategory = (
  value?: string | null
): value is PostCategory => CATEGORY_BY_KEY.has(toCategoryKey(value || ""));
