import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
// Đảm bảo bạn đã cho các file giao diện vào thư mục public như tôi đã nhắc ở trên
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT =
  "Bạn là trợ lý học tập. Trả lời cực kỳ ngắn gọn, đi thẳng ngay vào đáp án. KHÔNG chào hỏi, KHÔNG có câu dẫn dắt (ví dụ: 'Dưới đây là...', 'Câu trả lời là...'). TUYỆT ĐỐI KHÔNG sử dụng Markdown (không dùng dấu **, *, #). Chỉ trả về văn bản thuần túy (plain text). Nếu thiếu dữ kiện, hãy hỏi lại đúng 1 câu.";

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  systemInstruction: SYSTEM_PROMPT
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, mode: "gemini", model: "gemini-2.5-flash" });
});

app.post("/api/ask", async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();
    if (!question) return res.status(400).json({ error: "Missing question" });
    if (question.length > 2000)
      return res.status(400).json({ error: "Question too long (max 2000 chars)" });

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "ĐIỀN_KEY_CỦA_BẠN_VÀO_ĐÂY") {
      return res.status(500).json({
        error: "Chưa cấu hình GEMINI_API_KEY trong file .env"
      });
    }

    // Gọi Gemini
    const result = await model.generateContent(question);
    const answer = result.response.text() || "(Không có nội dung trả về)";

    res.json({ answer, source: "gemini", model: "gemini-2.5-flash" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      detail: String(err?.message || err)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`MODE=gemini | model=gemini-2.5-flash`);
});
