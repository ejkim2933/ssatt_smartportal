
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menus = [
    { id: 'home', label: '홈 포털', icon: '🏠' },
    { id: 'purchase', label: '구매 신청', icon: '🛒' },
    { id: 'leave', label: '연차 관리', icon: '📅' },
    { id: 'faq', label: '회계 FAQ', icon: '💰' },
    { id: 'condo', label: '콘도 예약', icon: '🏨' },
  ];

  return (
    <div className="w-72 bg-[#0f172a] min-h-screen text-white flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      <div className="p-8 pb-12">
        <div className="flex flex-col gap-4">
          {/* 공식 로고 이미지 - 원본 색상 유지를 위해 화이트 배경 컨테이너 사용 */}
          <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center justify-center h-16">
            <img 
              src="https://shinsungauto.co.kr/wp-content/uploads/2021/03/logo.png" 
              alt="신성오토텍 로고" 
              className="h-full w-full object-contain"
            />
          </div>
          <div className="px-1">
            <p className="text-[10px] text-blue-400 font-bold tracking-[0.3em] uppercase">Smart Workplace</p>
            <p className="text-[11px] text-slate-500 font-medium">SHINSUNG AUTOTECH</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveTab(menu.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group ${
              activeTab === menu.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={`text-lg transition-transform duration-300 ${activeTab === menu.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {menu.icon}
            </span>
            {menu.label}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-800/50">
        <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-2xl">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">임</div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">임직원님</p>
            <p className="text-[10px] text-slate-500">인사팀 소속</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
