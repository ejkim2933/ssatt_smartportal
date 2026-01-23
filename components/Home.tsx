
import React from 'react';

interface CardProps {
  title: string;
  icon: string;
  desc: string;
  color: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, icon, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className="group relative bg-white aspect-square rounded-[2.5rem] text-left transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 border border-slate-100 flex flex-col p-8 overflow-hidden"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>
    <div className="flex-1 flex flex-col justify-end">
      <h3 className="text-[22px] font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight mb-3">
        {title}
      </h3>
      <p className="text-[13px] text-slate-500 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
        {desc}
      </p>
    </div>
    <div className="absolute top-8 right-8 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
      <span className="text-xl">→</span>
    </div>
  </button>
);

interface HomeProps {
  onNavigate: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const cards = [
    { id: 'purchase', title: '물품 구매 신청', icon: '🛒', desc: '사무 및 생산 필요 물품을 온라인으로 간편하게 신청하세요.', color: 'bg-blue-50' },
    { id: 'leave', title: '연차 관리', icon: '📅', desc: '나의 잔여 연차를 확인하고 휴가 신청을 관리합니다.', color: 'bg-indigo-50' },
    { id: 'certificate', title: '증명서 발급 요청', icon: '📄', desc: '재직/경력 증명서 등 각종 서류 발급을 요청합니다.', color: 'bg-emerald-50', link: 'https://docs.google.com/forms/d/e/1FAIpQLScQ6AtqckpDFD9hv05tyE2q7FtkCgzfsMi-i7gbNKnH-q1snA/viewform' },
    { id: 'proposal_rules', title: '문의&제안', icon: '⚖️', desc: '회사에 대한 제안, 신고 및 규정 관련 문의를 통합 관리합니다.', color: 'bg-amber-50' },
    { id: 'safety', title: '안전지킴이 대화방', icon: '💬', desc: '현장 안전 문제 제보 및 소통을 위한 오픈채팅방 연결.', color: 'bg-rose-50', link: 'https://open.kakao.com/o/gmcH8V6h' },
    { id: 'condo', title: '콘도 신청 안내', icon: '🏨', desc: '임직원 복지 콘도 예약 현황 및 신청서를 확인하세요.', color: 'bg-cyan-50', link: 'https://docs.google.com/forms/d/1aPLcfqXxDQ2d10GGoTF2-xLgaRycWlXP5yttJ6wQk3Y/viewform?edit_requested=true' },
    { id: 'official_sites', title: '공식 홈페이지', icon: '🌐', desc: '신성오토텍 및 신성EP의 공식 홈페이지로 연결합니다.', color: 'bg-slate-100' },
    { id: 'faq', title: '재무회계 FAQ', icon: '💰', desc: '회계 처리 및 비용 정산에 대한 자주 묻는 질문입니다.', color: 'bg-violet-50' },
  ];

  const handleCardClick = (card: any) => {
    if (card.link) {
      window.open(card.link, '_blank');
    } else {
      onNavigate(card.id);
    }
  };

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto py-12 px-8 flex flex-col gap-12 min-h-[calc(100vh-80px)]">
      {/* 히어로 섹션 */}
      <header>
        <div className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase mb-4 shadow-lg shadow-blue-200">
          Smart Employee Portal
        </div>
        <h1 className="text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
          반갑습니다, <br />
          <span className="text-blue-600">신성오토텍</span> 가족 여러분!
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
          임직원 여러분의 효율적인 업무와 편의를 위해 <br />
          모든 핵심 서비스를 한 곳에 모았습니다.
        </p>
      </header>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card 
            key={card.id} 
            title={card.title} 
            icon={card.icon}
            desc={card.desc}
            color={card.color}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      {/* 하단 퀵 지원 배너 */}
      <div className="mt-auto p-10 bg-[#0f172a] rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-black italic text-blue-400 mb-2">Quick Support Center</h2>
          <p className="text-slate-400 font-medium">긴급한 규정 문의나 안전 제보가 필요하신가요? 지금 바로 연결하세요.</p>
        </div>
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <button 
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSf4z9jC8MvgtsaXhSeWzUKtlXT6l-IuZsegjgvtV4BYLir2ZA/viewform?usp=dialog', '_blank')}
            className="flex-1 md:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/20 active:scale-95"
          >
            규정 문의하기
          </button>
          <button 
            onClick={() => window.open('https://open.kakao.com/o/gmcH8V6h', '_blank')}
            className="flex-1 md:flex-none px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black transition-all border border-slate-700 active:scale-95"
          >
            안전 대화방
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
