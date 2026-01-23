
import React, { useState } from 'react';
import { analyzeVehicleIssue, speakDiagnosis } from '../services/geminiService';
import { DiagnosticResult } from '../types';

const MechanicAI: React.FC = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeVehicleIssue(description);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">AI 사내 규정 및 기술 상담소</h2>
        <p className="text-gray-400">궁금한 업무 절차나 기술적 이슈를 상세히 입력하시면 AI 비서가 즉시 답변해 드립니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="예: 신입사원 연차 산정 기준이 궁금합니다. 또는, 공장 3호기 압력 펌프에서 평소와 다른 소음이 발생합니다..."
          className="w-full h-44 bg-gray-950 border-2 border-gray-800 rounded-3xl p-6 text-lg focus:border-blue-600 focus:outline-none transition-all placeholder-gray-700 shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : '🚀 상담 요청'}
        </button>
      </form>

      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-slideUp">
          <div className={`p-5 flex items-center justify-between ${
            result.severity === 'high' ? 'bg-red-950/40' : result.severity === 'medium' ? 'bg-yellow-950/40' : 'bg-blue-950/40'
          }`}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">{result.severity === 'high' ? '🚨' : result.severity === 'medium' ? '⚠️' : 'ℹ️'}</span>
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[10px] opacity-70">상담 결과 요약</h4>
                <p className="font-bold text-xl text-white">{result.issue}</p>
              </div>
            </div>
            <button 
              onClick={() => speakDiagnosis(`${result.issue}. ${result.explanation}`)}
              className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl transition-colors border border-white/10"
              title="음성으로 듣기"
            >
              <span className="text-xl">🔊</span>
            </button>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h5 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">상세 답변 및 규정</h5>
                <p className="text-gray-300 leading-relaxed text-sm">{result.explanation}</p>
              </div>
              <div>
                <h5 className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">실행 권장사항</h5>
                <p className="text-gray-300 leading-relaxed text-sm">{result.recommendation}</p>
              </div>
            </div>
            
            <div className="bg-black/40 p-6 rounded-2xl space-y-5 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">긴급도/중요도</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  result.severity === 'high' ? 'bg-red-600 text-white' : result.severity === 'medium' ? 'bg-yellow-600 text-black' : 'bg-blue-600 text-white'
                }`}>{result.severity}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <span className="text-gray-500 text-xs">관련 리소스 예측</span>
                <span className="text-lg font-bold text-white">{result.estimatedCost}</span>
              </div>
              <div className="pt-4 p-4 bg-blue-900/10 rounded-xl border border-blue-500/10">
                 <p className="text-[10px] text-gray-500 leading-relaxed">
                   ※ 본 답변은 AI 어시스턴트의 분석 결과이며, 최종적인 법적 효력이나 결정권은 사내 정관 및 관련 부서의 확인을 통해 확정됩니다.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MechanicAI;
