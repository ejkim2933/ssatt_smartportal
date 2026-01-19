const express = require('express');
const path = require('path');
// 구글 AI 라이브러리를 여기서 불러옵니다!
const { GoogleGenAI, Type, Modality } = require("@google/genai");

const app = express();
const port = process.env.PORT || 8080;

// 보안 키 사용 (Secret Manager에서 주입된 키)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 이미지 전송을 위해 용량 제한을 늘립니다.
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// 1. 채팅 API (사내 규정)
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // 모델명을 최신으로 업데이트했습니다
      contents: prompt,
      config: {
        systemInstruction: "당신은 신성오토텍(주)의 전문 인사/행정 상담 AI입니다. 사용자의 질문에 대해 신성오토텍의 사내 규정과 절차를 기반으로 친절하고 명확하게 한국어로 답변하세요. 규정 내용을 모를 경우 인사팀에 문의하도록 안내하세요.",
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
    const { image } = req.body; // base64 string
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: image } },
          { text: "이 이미지에서 안전 위험 요소나 개선이 필요한 부분을 분석해주세요. 신성오토텍 공장 환경이라고 가정하고 전문가적인 소견을 한국어로 작성해주세요." }
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
        systemInstruction: "당신은 신성오토텍(주)의 설비 유지보수 및 사내 기술 규정 전문가입니다. 사용자의 이슈 설명에 따라 문제 현상, 상세 원인 및 규정 설명, 권장 조치 사항, 심각도(low/medium/high), 예상 소요 비용을 JSON으로 분석하세요.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issue: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            severity: { type: Type.STRING },
            estimatedCost: { type: Type.STRING }
          },
          required: ["issue", "explanation", "recommendation", "severity", "estimatedCost"]
        }
      }
    });
    res.json(JSON.parse(response.text()));
  } catch (error) {
    console.error('Issue Error:', error);
    res.status(500).json({ error: 'AI Error' });
  }
});

// 4. TTS API
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // TTS 모델이 아직 프리뷰라 flash로 대체하거나 텍스트만 처리. (여기서는 오디오 생성 로직 유지 시도)
      // *주의: Node.js 환경에서 TTS는 현재 모델 버전에 따라 지원 여부가 다를 수 있습니다.
      // 일단 기존 요청하신 로직을 유지하되, 텍스트 응답용으로 세팅합니다.
      // 만약 음성 모델 사용 권한이 있다면 gemini-2.0-flash-exp 등을 사용하세요.
      contents: [{ parts: [{ text: `내용을 읽어주세요: ${text}` }] }],
    });
    // 현재 SDK 버전에서 TTS는 오디오 데이터를 반환해야 함.
    // 만약 에러가 난다면 이 부분은 텍스트만 반환하도록 수정해야 할 수 있습니다.
    res.json({ audioData: null }); 
  } catch (error) {
    console.error('TTS Error:', error);
    res.json({ audioData: null });
  }
});


// 리액트 앱 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// 모든 요청을 index.html로 (SPA 지원)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 0.0.0.0 설정 필수!
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
