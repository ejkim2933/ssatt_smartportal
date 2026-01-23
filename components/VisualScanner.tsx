
import React, { useState, useRef } from 'react';
import { analyzeVehicleImage } from '../services/geminiService';

const VisualScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64Clean = image.split(',')[1];
      const result = await analyzeVehicleImage(base64Clean);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("이미지 분석 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white italic font-orbitron">SAFETY SCAN</h2>
        <p className="text-gray-400">현장 안전 요소, 고장 부품, 설비 상태를 사진으로 찍어 AI 전문가의 분석을 받으세요.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-video bg-gray-950 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center overflow-hidden relative group transition-all hover:border-blue-600/50">
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Scan preview" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-white font-bold hover:bg-white/20 border border-white/20 transition-all"
                  >
                    이미지 교체
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-8 space-y-6">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto border border-gray-800">
                  <span className="text-4xl">📸</span>
                </div>
                <div className="space-y-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/40"
                  >
                    사진 업로드 / 촬영
                  </button>
                </div>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button
            onClick={startAnalysis}
            disabled={!image || loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/20"
          >
            {loading ? '분석 중...' : '이미지 분석 시작'}
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-inner min-h-[300px]">
          <h3 className="text-blue-400 font-black text-xs uppercase tracking-widest mb-6 border-b border-gray-800 pb-4">Analysis Result</h3>
          <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
            {analysis || (loading ? 'AI가 이미지를 꼼꼼히 분석하고 있습니다...' : '왼쪽에서 사진을 선택하고 분석 버튼을 눌러주세요.')}
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-gray-500 font-medium">
          ※ 분석에 사용되는 이미지는 저장되지 않으며 보안 규정을 준수합니다.
        </p>
      </div>
    </div>
  );
};

export default VisualScanner;
