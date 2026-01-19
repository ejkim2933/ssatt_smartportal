import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// 🔹 여기가 바뀌었습니다! (구버전이지만 가장 안정적임)
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// AI 연결 설정
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// 모델을 'gemini-1.5-flash'로 설정 (가장 빠르고 안정적)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// 1. 채팅 API
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    // 채팅은 모델에게 지시사항(systemInstruction)을 직접 줄 수 없어서 프롬프트에 합칩니다.
    const fullPrompt = `당신은 신성오토텍(주)의 전문 인사/행정 상담 AI입니다. 답변은 한국어로 친절하게 해주세요.\n\n사용자 질문: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
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
    const { image } = req.body; // base64 string
    // base64 헤더 제거 (data:image/jpeg;base64, 부분 삭제)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([
      "이 이미지의 안전 위험 요소를 분석해주세요. 신성오토텍 공장 환경이라고 가정하고 전문가적인 소견을 한국어로 작성해주세요.", 
      imagePart
    ]);
    const response = await result.response;
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
    const prompt = `
      당신은 설비 유지보수 전문가입니다. 아래 이슈를 분석해서 JSON 형식으로 답하세요.
      형식: { "issue": "...", "explanation": "...", "recommendation": "...", "severity": "low/medium/high", "estimatedCost": "..." }
      
      이슈 내용: ${description}
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // JSON 부분만 잘라내기 (가끔 마크다운 ```json ... ``` 이 포함될 수 있음)
    const jsonString = text.replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(jsonString));
  } catch (error) {
    console.error('Issue Error:', error);
    // 에러 나면 기본값 반환
    res.json({
      issue: "분석 실패",
      explanation: "일시적인 오류입니다.",
      recommendation: "다시 시도해주세요.",
      severity: "low",
      estimatedCost: "0"
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
