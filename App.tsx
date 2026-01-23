
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

  // 탭 변경 시 조회 데이터 초기화 (보안 및 사용자 경험 강화)
  useEffect(() => {
    setSearchName('');
    setSearchBirth('');
    setSearchResult(null);
    setHasSearched(false);
    setIsSearching(false);
  }, [activeTab]);

  // CSV 데이터 파싱 함수
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
        return <Dashboard />;
      case 'rules':
        return <div className="py-12 px-8"><AIAssistant /></div>;
      case 'safety':
        return <div className="py-12 px-8"><SafetyScanner /></div>;
      case 'faq':
        return <AccountingFAQ />;
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
            <div className="mt-12 text-center">
              <button onClick={() => setActiveTab('home')} className="text-slate-400 font-bold hover:text-blue-600 transition-colors">← 홈으로 돌아가기</button>
            </div>
          </div>
        );
      case 'proposal_rules':
        return (
          <div className="max-w-5xl mx-auto py-12 px-8 animate-fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-2">제안/신고 및 규정 문의</h2>
              <p className="text-slate-500 font-medium">원하시는 서비스를 선택해 주세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSeXAMyp5pJZXDKZlza7EWbxzhpKpD26_ZeZD59rzgKwawumcA/viewform', '_blank')}
                className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">💡</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">회사 제안/신고</h3>
                <p className="text-sm text-slate-500 font-medium">혁신적인 아이디어 및 고충 사항 제안</p>
              </button>
              <button 
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSf4z9jC8MvgtsaXhSeWzUKtlXT6l-IuZsegjgvtV4BYLir2ZA/viewform?usp=dialog', '_blank')}
                className="group bg-white p-10 rounded-[2.5rem] border border-slate-200 text-center hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">⚖️</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">사내 규정 문의</h3>
                <p className="text-sm text-slate-500 font-medium">인사, 복지 등 회사 규정 온라인 문의</p>
              </button>
            </div>
            <div className="mt-12 text-center">
              <button onClick={() => setActiveTab('home')} className="text-slate-400 font-bold hover:text-blue-600 transition-colors">← 홈으로 돌아가기</button>
            </div>
          </div>
        );
      case 'purchase':
        return (
          <div className="max-w-5xl mx-auto py-12 px-8 animate-fadeIn space-y-12">
            <section className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-[#00529b]">물품 구매 신청 통합 안내</h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                    물품 구매 신청 가이드
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 leading-relaxed text-[13px] font-medium">
                    <li>세금계산서 발행, (수리비, 기계 구매류 구입 등) 법인카드로 별도 결제해야 하는 건은 <span className="text-blue-600 font-bold">사전 기안을 작성</span>해주세요.</li>
                    <li>이 외에, 팀별로 업무에 필요한 소품 및 수시로 개별 구매하시던 품목은 앞으로 <span className="text-blue-600 font-bold">'물품 신청서'</span>로 신청해주시면 됩니다.</li>
                    <li>알파문구, 마트, 편의점, 쿠팡 등에서 따로 구매하셨던 아이템 (장갑, 비닐, 휴지, 커피, 문구류 등) 들이 해당됩니다.</li>
                    <li>매월 첫째주, 팀에서 필요하신 물품을 취합하여 아래 링크에 작성해주세요.</li>
                    <li>소모품 구매시에는 '물품 신청서'로 신청만 해주시면 되고 기안 작성은 별도로 하지 않으셔도 됩니다.</li>
                    <li>이외에도 추가로 필요하신 물품은 수시로 아래 링크에 접속하셔서 작성해주세요.</li>
                    <li>신청하신 물품은 그 다음주, 2층 경영지원팀 - 총무님께 요청하셔서 픽업하시면 됩니다.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-600 text-xl">📝</span>
                      <h4 className="font-bold text-blue-900">기안 작성 O</h4>
                    </div>
                    <p className="text-[12px] text-blue-800 leading-relaxed">
                      세금계산서 발행건, 법인카드 구매건 (외부 미팅, 기계류 구입, 수리비, 자재비 등 큰 비용이자 별도 보고가 필요한 내용은 사전 기안 작성)
                    </p>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-emerald-600 text-xl">🛒</span>
                      <h4 className="font-bold text-emerald-900">기안 작성 X + 물품 신청서 작성</h4>
                    </div>
                    <p className="text-[12px] text-emerald-800 leading-relaxed">
                      소모품/문구류 등 구매 (기존 쿠팡, 알파문고, 마트 구매물품)
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                    시행 목적
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-bold text-slate-800">불필요한 업무 제거</p>
                      <p className="text-[11px] text-slate-500 leading-tight">각 팀의 번거로운 부수적 업무(검색, 구매, 배송 관리 등)를 제거하여 주업무에 집중합니다.</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-bold text-slate-800">시간 및 비용 절감</p>
                      <p className="text-[11px] text-slate-500 leading-tight">공통 필요 물품을 한번에 대량 구매하여 기업의 운영 효율과 비용을 최적화합니다.</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-bold text-slate-800">효율적 재고 시스템</p>
                      <p className="text-[11px] text-slate-500 leading-tight">사용 내역 데이터를 바탕으로 필요한 물품을 미리 준비할 수 있는 예측 시스템을 마련합니다.</p>
                    </div>
                  </div>
                </div>
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
                  <h3 className="text-xl font-bold text-[#00529b] mb-2 group-hover:underline underline-offset-4">기타 문의사항</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Click to open form</p>
                </div>
              </a>
            </div>
          </div>
        );
      case 'leave':
        return (
          <div className="max-w-5xl mx-auto py-12 px-8 animate-fadeIn space-y-8 flex flex-col items-center">
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
            </div>

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

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-6">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 text-xl flex-shrink-0">
                  ⚠️
                </div>
                <div className="space-y-2">
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">중요 안내 사항</h4>
                  <p className="text-slate-800 text-sm font-medium leading-relaxed">
                    2026년부터 잔여 연차는 <span className="font-bold text-red-600">수당으로 지급되지 않습니다.</span> 올해 안에 모두 소진을 권장합니다.
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
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn p-8">
            <div className="text-8xl mb-8">⚙️</div>
            <h2 className="text-3xl font-bold mb-4">준비 중인 기능</h2>
            <button onClick={() => setActiveTab('home')} className="bg-slate-200 text-slate-800 px-10 py-4 rounded-2xl font-bold hover:bg-slate-300 transition-all">홈으로 돌아가기</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="min-h-[calc(100-80px)]">
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
