/**
 * Frontend Service: geminiService.ts
 * AI SDK를 직접 쓰지 않고, server.cjs로 요청을 보냅니다.
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

// --- 오디오 관련 헬퍼 함수 (브라우저에서 재생을 위해 유지) ---
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

// 5. 음성 출력 (TTS)
export const speakDiagnosis = async (text: string) => {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    const data = await response.json();
    const base64Audio = data.audioData;

    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        audioContext,
        24000,
        1,
      );
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS output error:", error);
  }
};
