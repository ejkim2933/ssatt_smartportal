
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
    { id: 'rules', label: 'AI 상담소', icon: '🤖' },
    { id: 'safety', label: '안전 점검', icon: '🛡️' },
    { id: 'dashboard', label: '대시보드', icon: '📊' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          {/* 공식 로고 이미지 */}
          <div className="flex items-center h-9">
             <img 
               src="https://shinsungauto.co.kr/wp-content/uploads/2021/03/logo.png" 
               alt="신성오토텍 로고" 
               className="h-full object-contain group-hover:scale-105 transition-transform"
             />
          </div>
          <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Smart Portal</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
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
