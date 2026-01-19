import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";

// ESM 환경에서 __dirname 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// 구글 AI 키 설정
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// 1. 채팅 API
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        systemInstruction: "당신은 신성오토텍(주)의 전문 인사/행정 상담 AI입니다. 답변은 한국어로 친절하게 해주세요.",
      },
    });
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: image } },
          { text: "이 이미지의 안전 위험 요소를 분석해주세요." }
        ]
      },
    });
    res.json({ text: response.text() });
  } catch (error) {
    console.error('Image Error:', error);
    res.status(500).json({ error: 'AI Error' });
  }
});

// 3. 이슈 분석 API (JSON)
app.post('/api/analyze-issue', async (req, res) => {
  try {
    const { description } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: description,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issue: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            severity: { type: Type.STRING },
            estimatedCost: { type: Type.STRING }
          }
        }
      }
    });
    res.json(JSON.parse(response.text()));
  } catch (error) {
    console.error('Issue Error:', error);
    res.status(500).json({ error: 'AI Error' });
  }
});

// 리액트 앱 서빙
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
