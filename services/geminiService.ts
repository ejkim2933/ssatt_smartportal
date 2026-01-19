/**
 * geminiService.ts
 * 프론트엔드는 AI 라이브러리를 직접 쓰지 않고 서버와 통신만 합니다.
 * 이게 가장 '순리대로' 하는 방식입니다.
 */

// 공통 통신 함수
async function sendToServer(prompt: string, image?: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, image }),
    });
    const data = await response.json();
    return data.text || "응답 없음";
  } catch (error) {
    console.error(error);
    return "서버 통신 오류";
  }
}

export const askCompanyRules = async (prompt: string) => {
  return await sendToServer(prompt);
};

export const analyzeSafetyImage = async (base64Image: string) => {
  return await sendToServer("이 현장 사진의 위험 요소를 한국어로 분석해줘.", base64Image);
};

export const analyzeVehicleImage = async (base64Image: string) => {
  return await sendToServer("이 설비/차량의 상태를 점검해줘.", base64Image);
};

// JSON 분석이 필요한 경우 (이슈 분석)
export const analyzeVehicleIssue = async (description: string) => {
  const text = await sendToServer(`
    다음 이슈를 분석해서 JSON 형식으로만 답해줘.
    형식: {"issue": "...", "explanation": "...", "recommendation": "...", "severity": "low", "estimatedCost": "0"}
    내용: ${description}
  `);
  
  try {
    // 마크다운 제거 후 파싱
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    return { issue: "분석 실패", explanation: "AI 응답 오류", severity: "low" };
  }
};

export const speakDiagnosis = async (text: string) => {
  console.log("TTS 요청:", text);
};
