
import React from 'react';

const AccountingFAQ: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase mb-4 shadow-lg shadow-blue-200">
          Accounting Support
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">재무회계 문의 안내</h2>
        <p className="text-slate-500 font-medium leading-relaxed">
          재무 및 회계 관련 상세 내용이나 궁금하신 사항은<br />
          아래의 담당자에게 문의해 주시기 바랍니다.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-10 md:p-16 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-8">
          <span className="text-4xl">📧</span>
        </div>
        
        <div className="space-y-2 mb-8">
          <h3 className="text-2xl font-black text-slate-900">황보령 팀장</h3>
          <p className="text-blue-600 font-bold tracking-wide">신성오토텍 재무회계팀</p>
        </div>

        <a 
          href="mailto:boryung@ssautotech.co.kr"
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-blue-600 hover:scale-105 active:scale-95 shadow-lg shadow-slate-200"
        >
          <span className="text-lg">✉️</span>
          boryung@ssautotech.co.kr
        </a>

        <p className="mt-8 text-sm text-slate-400 font-medium leading-relaxed">
          이메일을 통해 문의 사항을 남겨주시면<br />
          확인 후 신속하게 답변해 드리겠습니다.
        </p>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[11px] text-slate-300 font-bold tracking-widest uppercase mb-4">Shinsung Autotech Co., Ltd.</p>
      </div>
    </div>
  );
};

export default AccountingFAQ;
