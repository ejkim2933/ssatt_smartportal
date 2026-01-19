import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// API 키 설정 (없을 경우 에러 방지)
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// 통합 AI API (채팅 + 이미지)
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, image } = req.body;
    let result;

    if (image) {
      // 이미지 분석 요청
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = { inlineData: { data: base64Data, mimeType: "image/jpeg" } };
      result = await model.generateContent([prompt || "이 이미지를 분석해주세요.", imagePart]);
    } else {
      // 일반 채팅 요청
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI 서버 처리 오류' });
  }
});

// 모든 요청을 리액트로 연결
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
