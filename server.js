import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// 1번 파일(package.json)에 있는 이름과 정확히 일치시켰습니다.
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// API 키가 없을 경우를 대비한 방어 코드
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
// 모델명 통일 (가장 빠르고 안정적인 모델)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// 1. 채팅 API
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'AI Error' });
  }
});

// 2. 이미지 분석 API
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { image } = req.body;
    // 불필요한 헤더 제거 로직 추가
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };
    const result = await model.generateContent([
      "이 이미지의 안전 위험 요소를 한국어로 분석해주세요.", 
      imagePart
    ]);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('Image Error:', error);
    res.status(500).json({ error: 'AI Error' });
  }
});

// 3. 설비 이슈 분석 API
app.post('/api/analyze-issue', async (req, res) => {
  try {
    const { description } = req.body;
    const prompt = `
      설비 이슈 분석: ${description}
      결과를 JSON형식으로: { "issue": "...", "explanation": "...", "recommendation": "...", "severity": "low", "estimatedCost": "0" }
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, "").trim();
    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Issue Error:', error);
    res.json({ issue: "Error", explanation: "분석 실패", recommendation: "재시도 요망", severity: "low", estimatedCost: "0" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
