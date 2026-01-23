
import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'purchase', label: '구매 신청', icon: '🛒' },
    { id: 'leave', label: '연차 관리', icon: '📅' },
    { id: 'certificate', label: '증명서 발급', icon: '📄', link: 'https://docs.google.com/forms/d/e/1FAIpQLScQ6AtqckpDFD9hv05tyE2q7FtkCgzfsMi-i7gbNKnH-q1snA/viewform' },
    { id: 'proposal_rules', label: '제안/규정', icon: '⚖️' },
    { id: 'safety', label: '안전 소통', icon: '💬', link: 'https://open.kakao.com/o/gmcH8V6h' },
    { id: 'official_sites', label: '공식 사이트', icon: '🌐' },
    { id: 'condo', label: '콘도 신청', icon: '🏨', link: 'https://docs.google.com/forms/d/1aPLcfqXxDQ2d10GGoTF2-xLgaRycWlXP5yttJ6wQk3Y/viewform?edit_requested=true' },
    { id: 'faq', label: '회계 FAQ', icon: '💰' },
  ];

  const handleTabClick = (tab: any) => {
    if (tab.link) {
      window.open(tab.link, '_blank');
    } else {
      setActiveTab(tab.id);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-2.5 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        <div 
          className="flex flex-col cursor-pointer group min-w-fit"
          onClick={() => setActiveTab('home')}
        >
          <div className="flex items-baseline gap-1.5">
            <h1 className="text-base font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
              신성오토텍[주]
            </h1>
            <span className="text-[11px] font-bold text-blue-500">스마트 포털</span>
          </div>
          <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5 leading-none">
            SHINSUNG AUTOTECH
          </p>
        </div>
        
        <nav className="flex items-center gap-0.5 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {tab.label}
              {tab.link && <span className="text-[8px] opacity-20 ml-0.5">↗</span>}
            </button>
          ))}
        </nav>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
};

export default Header;
