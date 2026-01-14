
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
    { id: 'proposal', label: '제안/신고', icon: '💡', link: 'https://docs.google.com/forms/d/e/1FAIpQLSeXAMyp5pJZXDKZlza7EWbxzhpKpD26_ZeZD59rzgKwawumcA/viewform' },
    { id: 'safety_chat', label: '안전 소통', icon: '💬', link: 'https://open.kakao.com/o/gmcH8V6h' },
    { id: 'rules', label: '규정 문의', icon: '⚖️' },
    { id: 'condo', label: '콘도 신청', icon: '🏨' },
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
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 py-3 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
        {/* 브랜드 영역: 한글 중심의 깔끔한 텍스트 디자인 */}
        <div 
          className="flex flex-col cursor-pointer group min-w-fit"
          onClick={() => setActiveTab('home')}
        >
          <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-700 transition-colors">
            신성오토텍[주]
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-blue-600">스마트 포털</span>
            <span className="text-[8px] text-slate-400 font-bold tracking-widest border-l border-slate-200 pl-1.5 uppercase">
              SHINSUNG AUTOTECH
            </span>
          </div>
        </div>
        
        {/* 네비게이션 영역: 작고 귀여운 칩(Chip) 스타일 */}
        <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              {tab.label}
              {tab.link && <span className="text-[8px] opacity-30">↗</span>}
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
