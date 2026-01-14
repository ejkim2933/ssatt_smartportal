
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-500'}`}>
          Q. {question}
        </span>
        <span className={`transform transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}>
          ▼
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-slate-600 leading-relaxed space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
          {answer}
        </div>
      </div>
    </div>
  );
};

const AccountingFAQ: React.FC = () => {
  const faqData = [
    {
      question: "신성오토텍의 3개년간의 매출 추이는 어떻게 되는지",
      answer: (
        <ul className="list-disc list-inside space-y-2">
          <li><strong>2024년:</strong> 전년 대비 약 <span className="text-blue-600 font-bold">50.4% 증가한 288억 원</span>의 매출을 기록하며 외형이 크게 성장하였습니다.</li>
          <li><strong>2023년:</strong> 전년 대비 1.0% 소폭 감소한 192억 원을 기록하여 전년과 유사한 수준을 유지하였습니다.</li>
          <li><strong>2022년:</strong> 전년 대비 11.9% 감소한 194억 원을 기록한 바 있습니다.</li>
        </ul>
      )
    },
    {
      question: "신성오토텍이 2024년에 순익이 갑자기 높아진 이유는",
      answer: (
        <div className="space-y-4">
          <p>2024년 신성오토텍의 당기순이익이 급증한 주된 원인은 매출액의 큰 폭 성장과 대손상각비 환입 등에 따른 판매비와관리비 감소로 인한 영업이익의 개선입니다.</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <span className="font-bold text-blue-600 mr-2">1. 매출 외형 성장:</span>
              전년 대비 50.4% 증가한 약 288억 원 달성
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <span className="font-bold text-blue-600 mr-2">2. 비용 구조 개선:</span>
              대손상각비 환입(약 17.8억 원) 등으로 판관비 47.1% 감소
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-100">
              <span className="font-bold text-blue-600 mr-2">3. 영업이익 급증:</span>
              전년 약 2.6억 원 → 약 47.5억 원으로 크게 상승
            </div>
          </div>
          <p className="text-sm text-slate-500 italic">※ 세부적인 계정별 변동 내역은 재무회계팀으로 문의해 주시기 바랍니다.</p>
        </div>
      )
    },
    {
      question: "신성오토텍의 3년간의 영업이익금액과 비율은 어떤 변화가 있는지",
      answer: (
        <ul className="list-disc list-inside space-y-2">
          <li><strong>2024년:</strong> 매출액 증가와 함께 수익성이 크게 개선되어 <span className="text-emerald-600 font-bold text-lg">16.5%</span>의 높은 영업이익률을 기록하였습니다.</li>
          <li><strong>2023년:</strong> 매출액 감소 및 원가율 상승 영향으로 <span className="font-bold">1.4%</span>의 이익률을 보였습니다.</li>
          <li><strong>2022년:</strong> 2,289백만 원의 영업이익을 달성하며 <span className="font-bold text-blue-600">11.8%</span>의 양호한 이익률을 기록하였습니다.</li>
        </ul>
      )
    },
    {
      question: "신성오토텍의 주력 생산 제품과 주요 매출처",
      answer: (
        <div className="space-y-4">
          <p>신성오토텍은 <span className="font-bold text-slate-800">자동차용 AVN(Audio, Video, Navigation) 판넬 및 인디케이터(기어커버)</span> 등의 자동차 내장 부품을 주력으로 생산하고 있습니다.</p>
          <p>주요 매출처는 <span className="text-blue-600 font-bold">엘지전자(주), 모트렉스(주), 케이비아이동국실업(주)</span> 등이며, 이들을 통해 최종적으로 현대ㆍ기아자동차 등의 완성차 업체에 납품됩니다.</p>
        </div>
      )
    },
    {
      question: "신성오토텍의 2025년 기업신용등급과 현금흐름등급",
      answer: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm">BBB0</div>
            <div>
              <p className="font-bold text-slate-800">기업신용등급 (2025.04.08 평가)</p>
              <p className="text-sm mt-1">수익성 지표 개선 및 재무구조 안정성 확보로 전년(BBB-) 대비 상향되었습니다.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-slate-700 text-white px-3 py-1 rounded font-bold text-sm">B</div>
            <div>
              <p className="font-bold text-slate-800">현금흐름등급</p>
              <p className="text-sm mt-1">현금흐름은 안정적이나 자체 창출능력이 상위등급 대비 다소 열위한 수준을 의미합니다.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-fadeIn">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-2">FAQ - 자주 묻는 질문 TOP 5</h2>
        <p className="text-slate-500">회계 및 재무 관련하여 임직원분들이 가장 많이 궁금해하시는 내용입니다.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden px-8 md:px-12 py-4">
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-[2rem] p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-blue-900 font-bold text-lg">더 궁금하신 사항이 있나요?</h4>
          <p className="text-blue-700/70 text-sm">재무회계 전용 챗봇을 이용하거나 회계팀으로 연락주세요.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.open('https://notebooklm.google.com/notebook/3b793056-5584-4488-88cd-a93ce6e2c065?authuser=1&pageId=none&addSource=true', '_blank')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <span>🤖</span> 재무회계 챗봇 연결
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountingFAQ;
