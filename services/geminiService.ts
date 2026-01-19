/**
 * Frontend Service: geminiService.ts
 * 중요: 여기서는 절대 @google/generative-ai를 import 하지 않습니다.
 * 오직 서버(/api/...)로 요청만 보냅니다.
 */

export const askCompanyRules = async (prompt: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error(error);
    return "서버 연결 오류입니다.";
  }
};

export const analyzeSafetyImage = async (base64Image: string) => {
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });
    const data = await response.json();
    return data.text;
  } catch (error) {
    return "이미지 분석 오류입니다.";
  }
};

export const analyzeVehicleIssue = async (description: string) => {
  try {
    const response = await fetch('/api/analyze-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
    return await response.json();
  } catch (error) {
    return {
      issue: "통신 오류",
      explanation: "서버 연결 실패",
      recommendation: "다시 시도해주세요",
      severity: "low",
      estimatedCost: "0"
    };
  }
};

export const analyzeVehicleImage = async (base64Image: string) => {
  return analyzeSafetyImage(base64Image);
};

export const speakDiagnosis = async (text: string) => {
  console.log("TTS 요청 (서버 미구현):", text);
};
