/**
 * Frontend Service: geminiService.ts
 * 이제 직접 AI를 부르지 않고, 서버에게 부탁(fetch)만 합니다.
 */

// 1. 사내 규정 질문 (텍스트)
export const askCompanyRules = async (prompt: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error('Server error');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error(error);
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

// --- 오디오 관련 헬퍼 함수 (유지) ---
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

// 5. 음성 출력 (TTS) - 기능 유지 (빈 함수 처리 방지)
export const speakDiagnosis = async (text: string) => {
  // 현재 서버 TTS 기능이 임시 비활성 상태이므로 로그만 출력하거나
  // 추후 서버에 TTS 엔드포인트를 추가하면 여기도 fetch로 바꾸면 됩니다.
  console.log("TTS 요청:", text);
};
