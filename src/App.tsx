import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MapScreen } from './screens/MapScreen';
import { HardwareMatchGame } from './screens/HardwareMatchGame';
import { LetterPopGame } from './screens/LetterPopGame';
import { VirtualCursor } from './components/VirtualCursor';
import { VoiceCommandOverlay } from './components/VoiceCommandOverlay';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';

const AppContent: React.FC = () => {
  const { screen } = useGame();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50/40 to-slate-100 text-slate-800 flex flex-col transition-colors duration-200">
      {/* Üst Navigasyon & Erişilebilirlik Çubuğu */}
      <Header />

      {/* Ana Ekran Görünümü */}
      <main className="flex-grow flex flex-col">
        {screen === 'onboarding' && <OnboardingScreen />}
        {screen === 'map' && <MapScreen />}
        {screen === 'game-hardware' && <HardwareMatchGame />}
        {screen === 'game-keyboard' && <LetterPopGame />}
      </main>

      {/* Alt Footer Bilgilendirme */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/70">
        MEB Özel Eğitim Bilişim Teknolojileri • Bilişim Macerası Öğrenme Portalı • Kapsayıcı Eğitim Teknolojisi MVP Demosu
      </footer>

      {/* Global Erişilebilirlik ve Simülasyon Katmanları */}
      <VirtualCursor />
      <VoiceCommandOverlay />
      <TeacherDashboardModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
