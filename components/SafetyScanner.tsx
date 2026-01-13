
import React, { useState, useRef } from 'react';
import { analyzeSafetyImage } from '../services/geminiService';

const SafetyScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const result = await analyzeSafetyImage(base64);
      setAnalysis(result);
    } catch (error) {
      alert("분석에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#00529b]">🛡️ 안전 지킴이 AI 분석</h2>
          <p className="text-gray-500 mt-2">현장 사진을 업로드하여 잠재적 위험 요소를 즉시 파악하세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
            >
              {image ? (
                <img src={image} className="w-full h-full object-cover" alt="미리보기" />
              ) : (
                <div className="text-center p-8">
                  <span className="text-5xl block mb-4">📸</span>
                  <p className="text-sm text-gray-500">사진을 클릭하여 업로드하세요</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFile} accept="image/*" className="hidden" />
            <button
              disabled={!image || loading}
              onClick={startAnalysis}
              className="w-full py-4 bg-[#00529b] text-white font-bold rounded-xl disabled:bg-gray-400 hover:bg-blue-800 transition-colors"
            >
              {loading ? "분석 중..." : "AI 안전 분석 시작"}
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold mb-4 border-b pb-2 text-gray-700">분석 결과</h4>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {analysis ? analysis : "사진을 업로드하고 분석 버튼을 눌러주세요."}
            </div>
            {loading && <div className="mt-4 animate-pulse h-4 bg-gray-200 rounded w-full"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyScanner;
