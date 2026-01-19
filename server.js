import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// API 키 연결
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// 통합 채팅 API
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, image } = req.body;
    let result;
    
    if (image) {
      // 이미지가 있으면 비전 분석
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = { inlineData: { data: base64Data, mimeType: "image/jpeg" } };
      result = await model.generateContent([prompt || "이 이미지를 분석해주세요.", imagePart]);
    } else {
      // 텍스트만 있으면 채팅
      result = await model.generateContent(prompt);
    }
    
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'AI 처리 중 오류 발생' });
  }
});

// 리액트 앱 전달
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
