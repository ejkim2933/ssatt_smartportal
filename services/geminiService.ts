/**
 * Frontend Service: geminiService.ts
 * AI 라이브러리를 직접 쓰지 않고, server.js로 요청을 보냅니다.
 */

// 1. 사내 규정 질문 (텍스트)
export const askCompanyRules = async (prompt: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat API Error:", error);
    return "죄송합니다. 서버 연결에 문제가 생겼습니다.";
  }
};

// 2. 현장 안전 요소 분석 (이미지)
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
    console.error("Image Analysis Error:", error);
    return "이미지 분석 중 오류가 발생했습니다.";
  }
};

// 3. 설비 이슈 분석 (JSON)
export const analyzeVehicleIssue = async (description: string) => {
  try {
    const response = await fetch('/api/analyze-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Issue Analysis Error:", error);
    return {
      issue: "통신 오류",
      explanation: "서버와 연결할 수 없습니다.",
      recommendation: "잠시 후 다시 시도해주세요.",
      severity: "low",
      estimatedCost: "0"
    };
  }
};

// 4. 차량/설비 이미지 분석 (재사용)
export const analyzeVehicleImage = async (base64Image: string) => {
  return analyzeSafetyImage(base64Image);
};

// --- 오디오 관련 헬퍼 함수 (에러 방지용 유지) ---
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// 5. 음성 출력 (TTS) - 에러 방지용 더미 함수
export const speakDiagnosis = async (text: string) => {
  console.log("TTS 요청 (현재 서버 설정상 음성은 지원되지 않을 수 있음):", text);
};
