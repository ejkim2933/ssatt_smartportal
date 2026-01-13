
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
    className="group relative bg-white p-8 rounded-[2.5rem] text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 border border-slate-100 flex flex-col h-full"
  >
    <div className={`w-16 h-16 rounded-3xl ${color} flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed flex-1">{desc}</p>
    <div className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
      자세히 보기 <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
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
    { id: 'proposal', title: '회사 제안/신고', icon: '💡', desc: '혁신적인 아이디어나 고충 사항을 자유롭게 제안하세요.', color: 'bg-amber-50', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeXAMyp5pJZXDKZlza7EWbxzhpKpD26_ZeZD59rzgKwawumcA/viewform' },
    { id: 'safety', title: '안전지킴이 대화방', icon: '💬', desc: '현장 안전 문제 제보 및 소통을 위한 오픈채팅방으로 연결합니다.', color: 'bg-rose-50', link: 'https://open.kakao.com/o/gmcH8V6h' },
    { id: 'rules', title: '사내 규정 문의', icon: '⚖️', desc: '인사, 복지 등 회사 규정을 AI에게 즉시 물어보세요.', color: 'bg-slate-100' },
    { id: 'condo', title: '콘도 신청 안내', icon: '🏨', desc: '임직원 복지 콘도 예약 현황 및 신청서를 확인하세요.', color: 'bg-cyan-50' },
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
    <div className="animate-fadeIn max-w-7xl mx-auto py-12 px-8">
      {/* 히어로 섹션 */}
      <header className="mb-16">
        <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
          Shinsung Autotech Intelligent Portal
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
          반갑습니다! <br/>
          <span className="text-blue-600">신성오토텍 임직원</span>을 위한 스마트 공간입니다.
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl">
          궁금한 사내 정보부터 업무 지원 서비스까지, 한 곳에서 빠르고 효율적으로 해결해 보세요.
        </p>
      </header>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* 하단 배너 */}
      <div className="mt-20 p-10 bg-[#0f172a] rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 italic">Looking for technical support?</h2>
          <p className="text-slate-400">사내 규정 문의 및 안전 관련 소통은 AI 상담소와 안전지킴이 대화방을 활용해 보세요.</p>
        </div>
        <div className="flex gap-4 relative z-10 w-full md:w-auto">
          <button 
            onClick={() => onNavigate('rules')}
            className="flex-1 md:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
          >
            AI 상담 시작
          </button>
          <button 
            onClick={() => window.open('https://open.kakao.com/o/gmcH8V6h', '_blank')}
            className="flex-1 md:flex-none px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all border border-slate-700"
          >
            안전지킴이 대화방
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
