
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 사내 규정 및 절차 상담 (텍스트)
 */
export const askCompanyRules = async (prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "당신은 신성오토텍(주)의 전문 인사/행정 상담 AI입니다. 사용자의 질문에 대해 신성오토텍의 사내 규정과 절차를 기반으로 친절하고 명확하게 한국어로 답변하세요. 규정 내용을 모를 경우 인사팀에 문의하도록 안내하세요.",
    },
  });
  return response.text;
};

/**
 * 현장 안전 요소 분석 (비전)
 */
export const analyzeSafetyImage = async (base64Image: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "이 이미지에서 안전 위험 요소나 개선이 필요한 부분을 분석해주세요. 신성오토텍 공장 환경이라고 가정하고 전문가적인 소견을 한국어로 작성해주세요." }
      ]
    },
  });
  return response.text;
};

/**
 * 설비 이슈 및 사내 기술 상담 분석 (JSON 반환)
 */
export const analyzeVehicleIssue = async (description: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: description,
    config: {
      systemInstruction: "당신은 신성오토텍(주)의 설비 유지보수 및 사내 기술 규정 전문가입니다. 사용자의 이슈 설명에 따라 문제 현상, 상세 원인 및 규정 설명, 권장 조치 사항, 심각도(low/medium/high 중 하나를 소문자로 선택), 예상 소요 비용/자원을 JSON 형식으로 분석하여 답변하세요. 모든 답변은 한국어로 작성하세요.",
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
  
  try {
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON parsing error:", e);
    return {
      issue: "분석 처리 중 오류",
      explanation: "AI의 응답을 파싱하는 과정에서 오류가 발생했습니다.",
      recommendation: "요청 내용을 다시 한 번 명확하게 입력해주세요.",
      severity: "medium",
      estimatedCost: "N/A"
    };
  }
};

/**
 * 차량/설비 이미지 분석 (VisualScanner용)
 */
export const analyzeVehicleImage = async (base64Image: string) => {
  // 안전 분석 로직을 설비 분석 컨텍스트로 재사용
  return analyzeSafetyImage(base64Image);
};

// Helper function to decode base64 string to Uint8Array
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

// Helper function to decode raw PCM audio data into AudioBuffer
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

/**
 * 진단 결과 음성 출력 (TTS)
 */
export const speakDiagnosis = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `내용을 한국어로 차분하고 친절하게 읽어주세요: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
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
