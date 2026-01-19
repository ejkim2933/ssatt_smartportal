/**
 * geminiService.ts
 * 프론트엔드에서는 AI 라이브러리를 직접 쓰지 않고, 서버로 요청(fetch)만 보냅니다.
 * 이렇게 하면 부품이 없다는 에러가 절대 날 수 없습니다.
 */

// 1. 채팅 (서버로 토스)
export const askCompanyRules = async (prompt: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.text || "응답이 없습니다.";
  } catch (error) {
    console.error(error);
    return "서버 연결에 실패했습니다.";
  }
};

// 2. 이미지 분석 (서버로 토스)
export const analyzeSafetyImage = async (base64Image: string) => {
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });
    const data = await response.json();
    return data.text || "분석에 실패했습니다.";
  } catch (error) {
    return "이미지 전송 실패";
  }
};

// 3. 설비 이슈 분석 (서버로 토스)
export const analyzeVehicleIssue = async (description: string) => {
  try {
    const response = await fetch('/api/analyze-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
    return await response.json();
  } catch (error) {
    return { issue: "통신 오류", explanation: "서버 연결 실패", severity: "low" };
  }
};

// 4. 재사용 함수
export const analyzeVehicleImage = async (base64Image: string) => {
  return analyzeSafetyImage(base64Image);
};

// 5. TTS (더미 함수)
export const speakDiagnosis = async (text: string) => {
  console.log("TTS:", text);
};
