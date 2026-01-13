
import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'diagnostics', label: 'AI 상담소', icon: '🤖' },
    { id: 'vision', label: '안전 점검', icon: '🛡️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
             <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
               <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm8 14.5l-8 4-8-4V8.5l8-4 8 4v8zM7 11h10v2H7z"/>
             </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tighter text-white leading-none">신성오토텍[주]</h1>
            <span className="text-[10px] text-blue-500 font-orbitron tracking-widest font-bold">SMART PORTAL</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-2 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
