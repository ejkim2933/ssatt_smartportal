
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import AIAssistant from './components/AIAssistant';
import SafetyScanner from './components/SafetyScanner';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // 연차 조회 관련 상태
  const [searchName, setSearchName] = useState('');
  const [searchBirth, setSearchBirth] = useState('');
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<{ name: string; count: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // CSV 데이터 파싱 함수 (간단한 구현)
  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = values[i]?.trim();
      });
      return obj;
    });
  };

  const handleLeaveSearch = async () => {
    if (!searchName || !searchBirth) {
      alert('성함과 생년월일(6자리)을 모두 입력해주세요.');
      return;
    }

    setIsSearching(true);
    try {
      // 구글 스프레드시트 CSV 내보내기 URL (잔여연차 _ 0113 탭 GID: 490918540)
      const sheetUrl = `https://docs.google.com/spreadsheets/d/1u7d5pvO67tyaVbysQ6bh9pJ1kx54GIOP8OCtvBbVwoM/export?format=csv&gid=490918540`;
      const response = await fetch(sheetUrl);
      const csvText = await response.text();
      const data = parseCSV(csvText);

      // 이름과 생년월일 매칭 (스프레드시트에 '이름', '현재 잔여 연차' 열이 있다고 가정)
      const found = data.find(row => 
        row['이름'] === searchName && 
        (row['생년월일'] === searchBirth || row['비밀번호'] === searchBirth || !row['생년월일'])
      );

      if (found) {
        setSearchResult({
          name: found['이름'],
          count: found['현재 잔여 연차'] || '0'
        });
      } else {
        setSearchResult(null);
        alert('일치하는 정보가 없습니다. 이름과 생년월일을 다시 확인해주세요.');
      }
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      alert('데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'dashboard':
        return <Dashboard />;
      case 'rules':
        return <AIAssistant />;
      case 'safety':
        return <SafetyScanner />;
      case 'purchase':
        return (
          <div className="max-w-5xl mx-auto py-12 px-8 animate-fadeIn space-y-12">
            <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-[#00529b]">물품 구매 신청 가이드</h2>
              </div>
              <div className="p-8 space-y-4">
                <ol className="list-decimal list-inside space-y-4 text-slate-700 leading-relaxed">
                  <li>매월 첫째주, 팀에서 필요하신 물품을 아래 링크에 작성해주세요. <span className="text-slate-500">(문구류, 커피류, 비닐봉지, 소모품류 등 모든 아이템)</span></li>
                  <li>이외에 추가로 필요하신 물품은 수시로 아래 링크에 접속하셔서 작성해주세요.</li>
                  <li>신청하신 물품은 그 다음주, 2층 경영지원팀 - 총무님께 요청하셔서 픽업하시면 됩니다.</li>
                  <li className="text-red-600 font-bold underline decoration-red-200 underline-offset-4">알파문구, 쿠팡 등 별도로 구매하신 비용은 앞으로 비용이 지원되지 않습니다. (개인결제로 진행)</li>
                </ol>
              </div>
            </section>
            <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-[#00529b]">시행 목적</h2>
              </div>
              <div className="p-8 space-y-4">
                <ol className="list-decimal list-inside space-y-4 text-slate-700 leading-relaxed">
                  <li>각 팀에서 번거롭게 진행하셨던 불필요한 업무를 제거합니다. <span className="text-slate-500">(검색, 구매, 배송, 관리, 이동 등, 주업무와 무관한 모든 부수적인 업무)</span></li>
                  <li>모든 팀에서 공통적으로 필요한 물품은 한번에 구매하여 시간과 비용을 절감합니다.</li>
                  <li>향후 각 팀의 사용 내역을 바탕으로 물품을 미리 준비할 수 있는 시스템을 마련하게 됩니다.</li>
                </ol>
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <a href="https://docs.google.com/forms/d/1NIiJKnAxLBO_o4qhKqRiBltnQ-7zYCYcrHh0AujuweM/edit" target="_blank" rel="noopener noreferrer" className="group flex items-center bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-1/3 h-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400" alt="Laptop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-xl font-bold text-[#00529b] mb-2 group-hover:underline underline-offset-4">물품 구매 신청서 링크</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Click to open form</p>
                </div>
              </a>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSeXAMyp5pJZXDKZlza7EWbxzhpKpD26_ZeZD59rzgKwawumcA/viewform" target="_blank" rel="noopener noreferrer" className="group flex items-center bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-1/3 h-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=400" alt="Signpost" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-xl font-bold text-[#00529b] mb-2 group-hover:underline underline-offset-4">문의사항</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Click to open form</p>
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">더 나은 프로세스 정립을 위해 문의사항 및 건의사항은 이곳에 남겨주세요.</p>
                </div>
              </a>
            </div>
          </div>
        );
      case 'leave':
        return (
          <div className="max-w-5xl mx-auto py-12 px-8 animate-fadeIn space-y-8 flex flex-col items-center">
            {/* 상단 검색바 영역 */}
            <div className="w-full max-w-4xl space-y-4">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl p-2 border border-slate-100">
                <div className="flex-1 flex items-center px-6 gap-3">
                  <span className="text-slate-400">👤</span>
                  <input 
                    type="text" 
                    placeholder="성함을 입력하세요"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full py-3 text-lg outline-none placeholder-slate-300 font-medium"
                  />
                  <div className="w-px h-8 bg-slate-100 mx-2"></div>
                  <span className="text-slate-400">🔑</span>
                  <input 
                    type="password" 
                    placeholder="생년월일 6자리"
                    value={searchBirth}
                    onChange={(e) => setSearchBirth(e.target.value)}
                    maxLength={6}
                    className="w-full py-3 text-lg outline-none placeholder-slate-300 font-medium"
                  />
                </div>
                <button 
                  onClick={handleLeaveSearch}
                  disabled={isSearching}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-200"
                >
                  {isSearching ? '조회중...' : <>🔍 조회하기</>}
                </button>
              </div>
              <div className="text-center">
                <button className="text-indigo-600 text-xs font-bold hover:underline">
                  동명이인인가요? (상세 검색)
                </button>
              </div>
            </div>

            {/* 메인 결과 디스플레이 */}
            <div className="w-full max-w-4xl aspect-[21/9] bg-[#1a1f2e] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
               {hasSearched && searchResult ? (
                 <div className="text-center animate-slideUp">
                    <p className="text-indigo-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm">Employee Leave Status</p>
                    <h2 className="text-white text-3xl font-bold mb-2">{searchResult.name} 님의 잔여 연차</h2>
                    <div className="text-white text-8xl font-black tracking-tighter">
                      {searchResult.count}<span className="text-3xl font-bold text-slate-500 ml-2">DAYS</span>
                    </div>
                 </div>
               ) : (
                 <div className="text-center space-y-6 opacity-40">
                   <div className="w-20 h-20 border-2 border-slate-600 rounded-2xl flex items-center justify-center mx-auto">
                     <span className="text-4xl">📅</span>
                   </div>
                   <h3 className="text-slate-400 text-3xl font-black tracking-[0.2em] uppercase">Waiting for Input</h3>
                 </div>
               )}
            </div>

            {/* 하단 공지 및 액션 영역 */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-6">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-xl flex-shrink-0">
                  ⚠️
                </div>
                <div className="space-y-2">
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">중요 안내 사항</h4>
                  <p className="text-slate-800 text-sm font-medium leading-relaxed">
                    2026년부터 잔여 연차는 <span className="font-bold text-red-600">수당으로 지급되지 않습니다.</span> 올해 안에 모두 소진을 권장하며, 개인별 연차 소진 계획을 수립하시기 바랍니다.
                  </p>
                </div>
              </div>

              <a 
                href="https://docs.google.com/forms/d/109Zjdh7VKG4AnJjLztlbQnTS6O9xqdLyy6nooH6CmLU/viewform?edit_requested=true"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex flex-col items-center justify-center hover:shadow-lg transition-all group"
              >
                <span className="text-indigo-400 text-[10px] font-bold tracking-widest uppercase mb-2">Action</span>
                <span className="text-indigo-800 font-bold text-lg group-hover:underline">연차 신청서 ↑</span>
              </a>
            </div>
            
            <div className="text-center pt-8">
               <p className="text-red-600 font-bold text-sm">
                 소진에 대한 문의사항이 있으실 경우 경영지원팀으로 연락해주세요.
               </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn p-8">
            <div className="text-8xl mb-8">⚙️</div>
            <h2 className="text-3xl font-bold mb-4">준비 중인 기능</h2>
            <p className="text-slate-500 text-center max-w-md mb-8">이 서비스는 현재 고도화 작업 중입니다. 신속하게 제공할 수 있도록 노력하겠습니다.</p>
            <button onClick={() => setActiveTab('home')} className="bg-slate-200 text-slate-800 px-10 py-4 rounded-2xl font-bold hover:bg-slate-300 transition-all">홈으로 돌아가기</button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-72 min-h-screen">
        <div className="relative">
          {renderContent()}
        </div>
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default App;
