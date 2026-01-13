
import React, { useState } from 'react';
import { askCompanyRules } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await askCompanyRules(input);
      setMessages(prev => [...prev, { role: 'model', text: result || '답변을 생성할 수 없습니다.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: '오류가 발생했습니다. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[700px] animate-fadeIn">
      <div className="bg-[#00529b] p-6 text-white">
        <h2 className="text-xl font-bold">🤖 회사 규정 AI 상담사</h2>
        <p className="text-sm opacity-80">인사, 복지, 규정에 대해 무엇이든 물어보세요.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' ? 'bg-[#00529b] text-white' : 'bg-white text-gray-800 border border-gray-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm animate-pulse italic">AI가 답변을 생성 중입니다...</div>}
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="질문을 입력하세요... (예: 경조사 휴가 기준이 어떻게 되나요?)"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleSend}
          className="bg-[#00529b] text-white px-8 rounded-lg font-bold hover:bg-blue-800 transition-colors"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
