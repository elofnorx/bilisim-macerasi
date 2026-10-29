import React from 'react';
import { useGame } from '../context/useGame';
import type { ActiveTab, ThemeMode } from '../types';
import {
  Gamepad2,
  Compass,
  Rocket,
  Wrench,
  Star,
  Volume2,
  VolumeX,
  Eye,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    totalStars,
    theme,
    setTheme,
    isSoundEnabled,
    setIsSoundEnabled,
    speak,
    playSfx,
    triggerCelebration,
  } = useGame();

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'wordwall',
      label: 'Wordwall Oyunları',
      icon: <Gamepad2 className="w-7 h-7 shrink-0" />,
      color: 'hover:border-purple-400',
    },
    {
      id: 'maze',
      label: 'Labirent & Yönler',
      icon: <Compass className="w-7 h-7 shrink-0" />,
      color: 'hover:border-blue-400',
    },
    {
      id: 'scratchjr',
      label: 'ScratchJr Kodlama',
      icon: <Rocket className="w-7 h-7 shrink-0" />,
      color: 'hover:border-emerald-400',
    },
    {
      id: 'teacher',
      label: 'Öğretmen Stüdyosu',
      icon: <Wrench className="w-7 h-7 shrink-0" />,
      color: 'hover:border-amber-400',
    },
  ];

  const handleThemeToggle = () => {
    const nextTheme: ThemeMode =
      theme === 'normal'
        ? 'contrast-yellow'
        : theme === 'contrast-yellow'
        ? 'contrast-blue'
        : 'normal';
    setTheme(nextTheme);
    playSfx('click');
    if (nextTheme === 'contrast-yellow') {
      speak('Sarı ve siyah yüksek kontrast modu');
    } else if (nextTheme === 'contrast-blue') {
      speak('Mavi yüksek kontrast modu');
    } else {
      speak('Normal renkli mod');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-4 border-slate-200 px-3 py-3 sm:px-6 shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Sol Alan: Logo & Özel Eğitim BEP Rozeti */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200/50">
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
                  Bilişim Macerası
                </h1>
                <span className="bg-amber-400 text-amber-950 text-xs font-black uppercase px-2.5 py-1 rounded-xl shadow-xs">
                  MEB BEP
                </span>
              </div>
              <p className="text-xs text-slate-600 font-bold hidden sm:block">
                Özel Eğitim Bilişim Teknolojileri Öğrenme Portalı
              </p>
            </div>
          </div>

          {/* Mobil Görünümde Yıldız Sayacı */}
          <div className="flex lg:hidden items-center gap-1.5 bg-amber-100 border-2 border-amber-400 px-3 py-1.5 rounded-2xl font-black text-amber-900 shadow-xs">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500 animate-bounce" />
            <span className="text-lg">{totalStars}</span>
          </div>
        </div>

        {/* Orta Alan: 4 Ana Sekme Butonu (Dev Tıklama Alanları - min 64px hitbox) */}
        <nav
          aria-label="Ana Menü"
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full lg:w-auto"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  speak(tab.label);
                }}
                className={`min-h-[64px] px-4 py-2.5 rounded-2xl font-black text-base sm:text-lg flex items-center gap-2.5 transition-all active:scale-95 border-3 cursor-pointer shadow-sm ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-200 shadow-md translate-y-[-2px]'
                    : `bg-slate-50 text-slate-700 border-slate-300 ${tab.color} hover:bg-slate-100`
                }`}
                aria-pressed={isActive}
              >
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sağ Alan: Yıldız Sayacı + Ses Kontrolü + Yüksek Kontrast */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dev Puanım / Yıldızlarım Göstergesi */}
          <button
            onClick={() => {
              triggerCelebration();
              speak(`${totalStars} yıldızın var, harikasın!`);
            }}
            className="min-h-[64px] px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 border-3 border-amber-400 rounded-2xl flex items-center gap-2.5 font-black text-amber-950 shadow-sm hover:scale-105 transition-transform cursor-pointer"
            title="Yıldızlarını kutla!"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-xs">
              <Star className="w-7 h-7 fill-amber-100 text-amber-800 animate-spin-slow" />
            </div>
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wider text-amber-800">Puanım</div>
              <div className="text-2xl font-black leading-none">{totalStars} ⭐</div>
            </div>
          </button>

          {/* Ses Aç / Kapat Butonu */}
          <button
            onClick={() => {
              const nextState = !isSoundEnabled;
              setIsSoundEnabled(nextState);
              if (nextState) {
                playSfx('click');
                speak('Ses açıldı');
              }
            }}
            className={`min-w-[64px] min-h-[64px] rounded-2xl border-3 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs ${
              isSoundEnabled
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
            }`}
            title={isSoundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            aria-label="Ses Kontrolü"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-7 h-7" />
            ) : (
              <VolumeX className="w-7 h-7" />
            )}
          </button>

          {/* Yüksek Kontrast Teması Butonu */}
          <button
            onClick={handleThemeToggle}
            className={`min-w-[64px] min-h-[64px] rounded-2xl border-3 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs ${
              theme === 'contrast-yellow'
                ? 'bg-yellow-400 border-black text-black ring-4 ring-yellow-200'
                : theme === 'contrast-blue'
                ? 'bg-blue-900 border-sky-300 text-sky-200 ring-4 ring-sky-300'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Yüksek Kontrast Modu (WCAG)"
            aria-label="Kontrast Değiştirici"
          >
            <Eye className="w-7 h-7" />
          </button>
        </div>
      </div>
    </header>
  );
};
