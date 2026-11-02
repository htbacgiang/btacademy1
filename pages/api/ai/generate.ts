import type { NextApiRequest, NextApiResponse } from "next";

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function callGemini(prompt: string, apiKey: string) {
  const models = [
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3-flash-preview",
    "gemini-3.8-flash",
  ];
  let lastError = "";

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      lastError = data.error?.message || `Model ${model} trả về mã ${res.status}`;
      console.warn(`Gemini model ${model} issue:`, lastError);
    } catch (err: any) {
      lastError = err.message || `Lỗi kết nối tới ${model}`;
      console.warn(`Gemini model ${model} fetch exception:`, lastError);
    }
  }

  throw new Error(lastError || "Tất cả các mô hình Gemini đều không phản hồi.");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim() || "";
  if (!apiKey) {
    return res.status(500).json({
      error: "Chưa cấu hình GEMINI_API_KEY trong file .env.",
    });
  }

  const { type, title, content, focusKeyword, itemType } = req.body || {};

  if (!type || (type !== "description" && type !== "faqs" && type !== "keyword")) {
    return res.status(400).json({
      error: "Tham số type không hợp lệ. Chỉ chấp nhận 'description', 'faqs' hoặc 'keyword'.",
    });
  }

  const cleanContent = stripHtml(content || "");
  const cleanTitle = (title || "").trim();

  if (!cleanTitle && cleanContent.length < 20) {
    return res.status(400).json({
      error: "Vui lòng nhập tiêu đề hoặc nội dung trước khi tạo bằng Gemini AI.",
    });
  }

  try {
    if (type === "description") {
      const isCourse = itemType === "course";
      const prompt = isCourse
        ? `Bạn là chuyên gia tư vấn tuyển sinh và SEO nội dung cho BT Academy (Học viện đào tạo giọng nói, kỹ năng giao tiếp, thuyết trình, MC và phát triển bản thân).
Hãy viết 1 đoạn mô tả khóa học ngắn gọn, thu hút, chuẩn SEO (chiều dài tối ưu từ 160 đến 250 ký tự, tối đa không quá 280 ký tự) dựa vào tên khóa học và nội dung dưới đây.

Yêu cầu:
1. Tóm tắt nội dung khóa học, nêu bật giá trị cốt lõi và lợi ích thiết thực giúp học viên tự tin giao tiếp, làm chủ giọng nói.
2. Văn phong chuyên nghiệp, truyền cảm hứng, thuyết phục học viên đăng ký tư vấn/học tập ngay.
3. Câu văn mạch lạc, chuẩn tiếng Việt, không dùng đại từ xưng hô tùy tiện.
4. Tuyệt đối KHÔNG đặt trong dấu ngoặc kép, KHÔNG dùng hashtag, KHÔNG chứa markdown hay icon.
5. Chỉ trả về DUY NHẤT một đoạn văn bản mô tả ngắn (khoảng 160-250 ký tự), không thêm bất kỳ lời dẫn hay giải thích nào khác.

Tên khóa học: ${cleanTitle || "Chưa có tên khóa học"}
Nội dung khóa học: ${cleanContent.slice(0, 3500)}`
        : `Bạn là chuyên gia SEO bài viết tiếng Việt cho BT Academy (Học viện đào tạo giọng nói, kỹ năng giao tiếp, thuyết trình và phát triển bản thân).
Hãy viết 1 đoạn Meta Description ngắn gọn, thu hút, chuẩn SEO (chiều dài tối ưu từ 150 đến 175 ký tự, tuyệt đối không quá 190 ký tự) dựa vào tiêu đề và nội dung bài viết dưới đây.

Yêu cầu:
1. Tóm tắt nội dung cốt lõi và nêu bật điểm hấp dẫn nhất để người tìm kiếm Google muốn nhấp vào xem ngay lập tức.
2. ${focusKeyword ? `Chứa từ khóa chính "${focusKeyword}" một cách khéo léo, tự nhiên.` : "Chứa các cụm từ khóa tự nhiên liên quan đến bài viết."}
3. Câu văn mạch lạc, hấp dẫn, chuẩn tiếng Việt, không dùng đại từ rườm rà.
4. Tuyệt đối KHÔNG đặt trong dấu ngoặc kép, KHÔNG dùng hashtag, KHÔNG chứa markdown hay icon.
5. Chỉ trả về DUY NHẤT một đoạn văn bản mô tả ngắn, không thêm bất kỳ lời dẫn hay giải thích nào khác.

Tiêu đề bài viết: ${cleanTitle || "Chưa có tiêu đề"}
Nội dung bài viết: ${cleanContent.slice(0, 3500)}`;

      const rawDesc = await callGemini(prompt, apiKey);
      let description = rawDesc.trim().replace(/^["']|["']$/g, "").trim();

      const maxLen = isCourse ? 285 : 195;
      const targetLen = isCourse ? 260 : 190;
      // Nếu dài hơn giới hạn, cắt ngắn bớt tại dấu chấm hoặc dấu cách
      if (description.length > maxLen) {
        const lastPeriod = description.lastIndexOf(".", targetLen);
        if (lastPeriod > (isCourse ? 160 : 140)) {
          description = description.slice(0, lastPeriod + 1);
        } else {
          const lastSpace = description.lastIndexOf(" ", targetLen - 5);
          description = (lastSpace > (isCourse ? 160 : 140) ? description.slice(0, lastSpace) : description.slice(0, targetLen - 5)) + "...";
        }
      }

      return res.status(200).json({ description });
    }

    if (type === "keyword") {
      const prompt = `Bạn là chuyên gia SEO tiếng Việt.
Dựa vào tiêu đề và nội dung bài viết dưới đây, hãy gợi ý 1 từ khóa chính (Focus Keyword) chuẩn SEO tốt nhất cho bài viết (độ dài 2-5 từ, dạng tiếng Việt có dấu chuẩn xác mà người dùng hay tìm kiếm nhất trên Google).
Tuyệt đối KHÔNG đặt trong dấu ngoặc kép, KHÔNG dùng hashtag hay dấu chấm cuối câu.
Chỉ trả về DUY NHẤT cụm từ khóa, không thêm bất kỳ lời dẫn nào khác.

Tiêu đề bài viết: ${cleanTitle || "Chưa có tiêu đề"}
Nội dung bài viết: ${cleanContent.slice(0, 3500)}`;

      const rawKeyword = await callGemini(prompt, apiKey);
      let keyword = rawKeyword.trim().replace(/^["']|["']$/g, "").replace(/\.$/, "").trim();
      return res.status(200).json({ keyword });
    }

    if (type === "faqs") {
      const isCourse = itemType === "course";
      const prompt = isCourse
        ? `Bạn là chuyên gia tư vấn tuyển sinh cho BT Academy (Học viện đào tạo giọng nói, kỹ năng giao tiếp, thuyết trình, MC và phát triển bản thân).
Dựa vào tên khóa học và nội dung chi tiết dưới đây, hãy tạo từ 3 đến 5 câu hỏi thường gặp (FAQ) sát thực tế nhất của học viên về khóa học (ví dụ: đối tượng học, thời gian/lịch học, phương pháp đào tạo, cam kết đầu ra, quyền lợi, hỗ trợ sau khóa học) kèm câu trả lời tận tâm, uy tín và thuyết phục.

Yêu cầu:
1. Câu hỏi là những thắc mắc thực tế, quan trọng nhất mà học viên hay quan tâm trước khi đăng ký khóa học này.
2. Câu trả lời ngắn gọn, súc tích (khoảng 2-3 câu), văn phong chuyên nghiệp, dễ hiểu, tạo niềm tin cao.
3. BẮT BUỘC trả về duy nhất định dạng JSON array hợp lệ, KHÔNG bọc trong markdown block (như \`\`\`json), KHÔNG kèm bất kỳ text lời dẫn nào khác.

Cấu trúc JSON:
[
  {"question": "Khóa học này phù hợp với những ai?", "answer": "Khóa học được thiết kế dành cho..."},
  {"question": "Sau khóa học tôi sẽ đạt được những kỹ năng gì?", "answer": "Bạn sẽ tự tin làm chủ giọng nói..."}
]

Tên khóa học: ${cleanTitle || "Chưa có tên khóa học"}
Nội dung khóa học: ${cleanContent.slice(0, 3500)}`
        : `Bạn là chuyên gia nội dung và tư vấn học viên cho BT Academy (Học viện đào tạo giọng nói, kỹ năng giao tiếp, thuyết trình và phát triển bản thân).
Hãy dựa vào tiêu đề và nội dung bài viết dưới đây để tạo từ 3 đến 5 câu hỏi thường gặp (FAQ) kèm câu trả lời hữu ích, chuẩn xác để tích hợp FAQ Schema vào bài viết (chuẩn AIO, GEO & Google Rich Snippet).

Yêu cầu:
1. Câu hỏi là những thắc mắc thực tế, quan trọng nhất mà người đọc/học viên muốn biết liên quan trực tiếp đến bài viết.
2. Câu trả lời ngắn gọn, súc tích (khoảng 2-3 câu), văn phong chuyên nghiệp, dễ hiểu, uy tín.
3. BẮT BUỘC trả về duy nhất định dạng JSON array hợp lệ, KHÔNG bọc trong markdown block (như \`\`\`json), KHÔNG kèm bất kỳ text lời dẫn nào khác.

Cấu trúc JSON:
[
  {"question": "Câu hỏi 1?", "answer": "Câu trả lời 1..."},
  {"question": "Câu hỏi 2?", "answer": "Câu trả lời 2..."}
]

Tiêu đề bài viết: ${cleanTitle || "Chưa có tiêu đề"}
Nội dung bài viết: ${cleanContent.slice(0, 3500)}`;

      const rawFaqs = await callGemini(prompt, apiKey);
      let cleanJson = rawFaqs.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

      const match = cleanJson.match(/\[[\s\S]*\]/);
      if (match) {
        cleanJson = match[0];
      }

      let parsedFaqs = JSON.parse(cleanJson);

      if (!Array.isArray(parsedFaqs)) {
        throw new Error("Dữ liệu trả về không phải là mảng FAQ hợp lệ.");
      }

      parsedFaqs = parsedFaqs
        .filter((item) => item && typeof item.question === "string" && typeof item.answer === "string")
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }));

      return res.status(200).json({ faqs: parsedFaqs });
    }
  } catch (error: any) {
    console.error("Lỗi Gemini API generate:", error);
    const msg = error.message || "";
    let userMsg = msg;
    if (msg.includes("API key not valid") || msg.includes("UNAUTHENTICATED")) {
      userMsg = "API Key Gemini không hợp lệ. Vui lòng lấy API key từ https://aistudio.google.com/app/apikey (dạng AIzaSy...) và cập nhật vào file .env rồi restart server dev.";
    }
    return res.status(500).json({
      error: userMsg || "Không thể tạo nội dung bằng Gemini AI. Vui lòng thử lại sau.",
    });
  }
}
