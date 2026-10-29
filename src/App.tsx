import React from 'react';
import { GameProvider } from './context/GameContext';
import { useGame } from './context/useGame';
import { Header } from './components/Header';
import { WordwallGameScreen } from './screens/WordwallGameScreen';
import { MazeGameScreen } from './screens/MazeGameScreen';
import { ScratchJrCodingScreen } from './screens/ScratchJrCodingScreen';
import { TeacherStudioScreen } from './screens/TeacherStudioScreen';

const MainPortal: React.FC = () => {
  const { activeTab } = useGame();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col transition-colors duration-200">
      {/* 1. TOP BAR */}
      <Header />

      {/* 2. MAIN CONTENT AREA: Seçilen sekmenin oyunu / modülü dev boyutlu ve sade bir kart konteynırı içinde açılır */}
      <main className="flex-grow flex flex-col justify-start items-center py-6 px-2 sm:px-4 max-w-7xl mx-auto w-full">
        {activeTab === 'wordwall' && <WordwallGameScreen />}
        {activeTab === 'maze' && <MazeGameScreen />}
        {activeTab === 'scratchjr' && <ScratchJrCodingScreen />}
        {activeTab === 'teacher' && <TeacherStudioScreen />}
      </main>

      {/* 3. SADE VE ERİŞİLEBİLİR ALT BİLGİ */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/80">
        MEB Özel Eğitim Bilişim Teknolojileri Dersi BEP Çerçeve Öğretim Planı ile Tam Uyumlu • Bilişim Macerası Portalı
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <MainPortal />
    </GameProvider>
  );
};

export default App;
