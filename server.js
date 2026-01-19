import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// API 키가 없으면 에러가 날 수 있으므로 체크 (없으면 일단 빈 값 처리)
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 이미지 용량 제한 해제 (10MB)
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
    res.status(500).json({ error: 'AI 처리 중 오류가 발생했습니다.' });
  }
});

// 2. 이미지 분석 API
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { image } = req.body;
    // base64 헤더 제거
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([
      "이 이미지의 안전 위험 요소를 분석해주세요. 한국어로 답변해주세요.", 
      imagePart
    ]);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error) {
    console.error('Image Error:', error);
    res.status(500).json({ error: '이미지 분석 실패' });
  }
});

// 3. 설비 이슈 분석 API (JSON)
app.post('/api/analyze-issue', async (req, res) => {
  try {
    const { description } = req.body;
    const prompt = `
      다음 설비 이슈를 분석해서 JSON 포맷으로 답하시오.
      형식: { "issue": "...", "explanation": "...", "recommendation": "...", "severity": "low/medium/high", "estimatedCost": "..." }
      내용: ${description}
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    // 마크다운 제거
    text = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(text));
  } catch (error) {
    console.error('Issue Error:', error);
    res.json({
      issue: "분석 실패",
      explanation: "AI 응답을 처리할 수 없습니다.",
      recommendation: "다시 시도해주세요.",
      severity: "low",
      estimatedCost: "0"
    });
  }
});

// 모든 요청을 리액트로 보냄
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
