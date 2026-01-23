
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import AIAssistant from './components/AIAssistant';
import SafetyScanner from './components/SafetyScanner';
import Dashboard from './components/Dashboard';
import AccountingFAQ from './components/AccountingFAQ';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // 연차 조회 관련 상태
  const [searchName, setSearchName] = useState('');
  const [searchBirth, setSearchBirth] = useState('');
  const [searchResult, setSearchResult] = useState<{ name: string; count: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // 탭 변경 시 조회 데이터 초기화
  useEffect(() => {
    setSearchName('');
    setSearchBirth('');
    setSearchResult(null);
    setHasSearched(false);
    setIsSearching(false);
  }, [activeTab]);

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
      const sheetUrl = `https://docs.google.com/spreadsheets/d/1u7d5pvO67tyaVbysQ6bh9pJ1kx54GIOP8OCtvBbVwoM/export?format=csv&gid=490918540`;
      const response = await fetch(sheetUrl);
      const csvText = await response.text();
      const data = parseCSV(csvText);

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
        return <div className="p-8 max-h-[calc(100vh-64px)] overflow-y-auto"><Dashboard /></div>;
      case 'rules':
        return <div className="py-12 px-8 max-h-[calc(100vh-64px)] overflow-y-auto"><AIAssistant /></div>;
      case 'safety':
        return <div className="py-12 px-8 max-h-[calc(100vh-64px)] overflow-y-auto"><SafetyScanner /></div>;
      case 'faq':
        return <div className="max-h-[calc(100vh-64px)] overflow-y-auto"><AccountingFAQ /></div>;
      case 'official_sites':
        return (
          <div className="max-w-5xl mx-auto py-12 px-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-2">공식 홈페이지 연결</h2>
              <p className="text-slate-500 font-medium">신성오토텍 및 관계사의 공식 홈페이지로 이동할 수 있습니다.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={() => window.open('https://ssautotech.co.kr/', '_blank')}
                className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🏢</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">신성오토텍</h3>
                <p className="text-sm text-slate-500 font-medium">공식 홈페이지 바로가기</p>
              </button>
              <button 
                onClick={() => window.open('https://shinsungep.co.kr/', '_blank')}
                className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">신성EP</h3>
                <p className="text-sm text-slate-500 font-medium">공식 홈페이지 바로가기</p>
              </button>
            </div>
          </div>
        );
      case 'condo':
        return (
          <div className="max-h-[calc(100vh-64px)] overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-10">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-1.5 bg-cyan-600 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase mb-4 shadow-lg shadow-cyan-200">
                  Welfare Service
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-2">콘도 신청 안내</h2>
              </div>
              {/* 콘도 내용은 스크롤 가능하도록 유지 */}
              <div className="grid grid-cols-1 gap-8">
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-cyan-700 mb-6 flex items-center gap-2">
                    <span className="w-2 h-7 bg-cyan-500 rounded-full"></span>
                    신청 가이드
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed">자세한 내용은 사내 게시판을 참조하시거나 경영지원팀에 문의바랍니다.</p>
                </section>
                <button 
                  onClick={() => window.open('https://docs.google.com/forms/d/1aPLcfqXxDQ2d10GGoTF2-xLgaRycWlXP5yttJ6wQk3Y/viewform?edit_requested=true', '_blank')}
                  className="w-full py-6 bg-cyan-600 text-white rounded-3xl font-black text-xl hover:bg-cyan-700 transition-colors shadow-xl"
                >
                  🏨 콘도 이용 신청서 작성
                </button>
              </div>
            </div>
          </div>
        );
      case 'purchase':
        return (
          <div className="max-h-[calc(100vh-64px)] overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-8">
              <section className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                <h2 className="text-2xl font-black text-[#00529b] mb-4">물품 구매 신청 안내</h2>
                <p className="text-slate-600 mb-6">필요한 소모품이나 자재를 온라인 신청서를 통해 간편하게 요청하세요.</p>
                <a href="https://docs.google.com/forms/d/1NIiJKnAxLBO_o4qhKqRiBltnQ-7zYCYcrHh0AujuweM/edit" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">
                  구매 신청서 작성하기
                </a>
              </section>
            </div>
          </div>
        );
      case 'leave':
        return (
          <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 space-y-8">
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg"
                >
                  {isSearching ? '조회중...' : '🔍 조회'}
                </button>
              </div>
            </div>

            <div className="w-full max-w-4xl flex-1 bg-[#1a1f2e] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-0">
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
                   <div className="w-16 h-16 border-2 border-slate-600 rounded-2xl flex items-center justify-center mx-auto">
                     <span className="text-3xl">📅</span>
                   </div>
                   <h3 className="text-slate-400 text-xl font-black tracking-[0.2em] uppercase">Waiting for Input</h3>
                 </div>
               )}
            </div>
          </div>
        );
      case 'proposal_rules':
        return (
          <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 space-y-8 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">제안/신고 및 규정 문의</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <button onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSeXAMyp5pJZXDKZlza7EWbxzhpKpD26_ZeZD59rzgKwawumcA/viewform', '_blank')} className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all">
                <div className="text-5xl mb-6">💡</div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">회사 제안/신고</h3>
              </button>
              <button onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSf4z9jC8MvgtsaXhSeWzUKtlXT6l-IuZsegjgvtV4BYLir2ZA/viewform?usp=dialog', '_blank')} className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all">
                <div className="text-5xl mb-6">⚖️</div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">사내 규정 문의</h3>
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] animate-fadeIn p-8">
            <div className="text-8xl mb-8">⚙️</div>
            <h2 className="text-3xl font-bold mb-4">준비 중인 기능</h2>
            <button onClick={() => setActiveTab('home')} className="bg-slate-200 text-slate-800 px-10 py-4 rounded-2xl font-bold hover:bg-slate-300 transition-all">홈으로 돌아가기</button>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 min-h-0 relative">
        {renderContent()}
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default App;
