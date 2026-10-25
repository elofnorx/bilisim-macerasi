import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Volume2,
  VolumeX,
  Eye,
  Hand,
  Mic,
  MousePointer,
  GraduationCap,
  Sparkles,
  MapPin,
  Home,
} from 'lucide-react';
import type { InputMode, ThemeMode } from '../types';

export const Header: React.FC = () => {
  const {
    mascot,
    inputMode,
    setInputMode,
    theme,
    setTheme,
    isTtsEnabled,
    setIsTtsEnabled,
    setIsTeacherModalOpen,
    screen,
    setScreen,
    speakHover,
    speakText,
    playSound,
  } = useGame();

  const handleInputModeCycle = () => {
    const modes: InputMode[] = ['touch', 'gesture', 'voice'];
    const nextIndex = (modes.indexOf(inputMode) + 1) % modes.length;
    setInputMode(modes[nextIndex]);
  };

  const handleThemeCycle = () => {
    const themes: ThemeMode[] = ['normal', 'contrast-yellow', 'contrast-blue'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
    playSound('click');
    if (themes[nextIndex] === 'contrast-yellow') {
      speakText('Sarı ve Siyah Yüksek Kontrast Modu açıldı.');
    } else if (themes[nextIndex] === 'contrast-blue') {
      speakText('Mavi ve Beyaz Okuma Modu açıldı.');
    } else {
      speakText('Standart Renkli Mod açıldı.');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-4 border-indigo-200 px-3 py-2 sm:px-6 sm:py-3 shadow-md transition-colors select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Sol: Logo & Başlık */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setScreen('map');
              playSound('click');
              speakText('Haritaya gidiliyor.');
            }}
            onMouseEnter={() => speakHover('Bilişim Macerası ana menü')}
            className="flex items-center gap-2 group text-left p-1.5 rounded-2xl hover:bg-indigo-50 transition-colors focus:ring-4 focus:ring-indigo-300"
            title="Haritaya Dön"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-7 h-7 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-indigo-950 font-heading">
                  Bilişim Macerası
                </span>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                  MEB Özel Eğitim
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-semibold hidden sm:block">
                Çoklu Etkileşimli & Oyunlaştırılmış Öğrenme Portalı
              </p>
            </div>
          </button>
        </div>

        {/* Orta: Maskot Mini Rehber Konuşması */}
        <div className="hidden lg:flex items-center gap-2.5 bg-indigo-50/80 border-2 border-indigo-200/80 px-4 py-1.5 rounded-2xl shadow-inner max-w-md">
          <span className="text-2xl animate-bounce">{mascot.avatarEmoji}</span>
          <div className="text-xs leading-snug">
            <span className="font-bold text-indigo-900">{mascot.name}: </span>
            <span className="text-indigo-800">
              {screen === 'onboarding'
                ? 'Maceraya hazır mısın? Ayarlarını seçip başla!'
                : screen === 'map'
                ? 'Haritadan oynamak istediğin dünyayı seç!'
                : screen === 'game-hardware'
                ? 'Donanım parçalarını doğru kutulara yerleştir!'
                : 'Uçan harf balonlarını yakala ve patlat!'}
            </span>
          </div>
          <button
            onClick={() => {
              playSound('click');
              speakText(
                screen === 'onboarding'
                  ? 'Maceraya hazır mısın? Ayarlarını seçip başla butonuna tıkla!'
                  : screen === 'map'
                  ? 'Haritadan oynamak istediğin dünyayı seç!'
                  : screen === 'game-hardware'
                  ? 'Donanım parçalarını sağ taraftaki doğru kutulara yerleştir!'
                  : 'Uçan harf balonlarını yakala ve patlat!'
              );
            }}
            onMouseEnter={() => speakHover('Maskotun sözlerini tekrar dinle')}
            className="p-1.5 rounded-xl bg-white hover:bg-indigo-100 text-indigo-700 shadow-sm border border-indigo-200 shrink-0"
            title="Yönergeyi Seslendir"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Sağ: Erişilebilirlik ve Kontrol Araçları */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Harita / Giriş Hızlı Butonu */}
          {screen !== 'onboarding' && (
            <button
              onClick={() => {
                setScreen(screen === 'map' ? 'onboarding' : 'map');
                playSound('click');
              }}
              onMouseEnter={() =>
                speakHover(screen === 'map' ? 'Giriş ekranına dön' : 'Haritaya dön')
              }
              className="min-h-[48px] px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              {screen === 'map' ? <Home className="w-5 h-5 text-indigo-600" /> : <MapPin className="w-5 h-5 text-emerald-600" />}
              <span className="hidden md:inline">{screen === 'map' ? 'Giriş' : 'Harita'}</span>
            </button>
          )}

          {/* Girdi Yöntemi Seçimi */}
          <button
            onClick={handleInputModeCycle}
            onMouseEnter={() =>
              speakHover(
                `Şu anki girdi modu: ${
                  inputMode === 'touch'
                    ? 'Dokunmatik ve Fare'
                    : inputMode === 'gesture'
                    ? 'El Hareketi ve Kamera'
                    : 'Sesli Komut'
                }. Değiştirmek için tıkla.`
              )
            }
            className={`min-h-[48px] px-3.5 py-2 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm ${
              inputMode === 'gesture'
                ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300'
                : inputMode === 'voice'
                ? 'bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-300'
                : 'bg-indigo-50 border-indigo-300 text-indigo-900'
            }`}
            title="Girdi Modu Değiştir (Fare / Kamera / Ses)"
          >
            {inputMode === 'touch' && <MousePointer className="w-5 h-5 text-indigo-600" />}
            {inputMode === 'gesture' && <Hand className="w-5 h-5 text-amber-600 animate-bounce" />}
            {inputMode === 'voice' && <Mic className="w-5 h-5 text-rose-600 animate-pulse" />}
            <span className="hidden sm:inline">
              {inputMode === 'touch'
                ? 'Fare / Dokunmatik'
                : inputMode === 'gesture'
                ? 'El Hareketi (Kamera)'
                : 'Sesli Komut'}
            </span>
          </button>

          {/* Sesli Yönerge (TTS) Açık/Kapalı */}
          <button
            onClick={() => {
              const next = !isTtsEnabled;
              setIsTtsEnabled(next);
              playSound('click');
              if (next) speakText('Sesli yönergeler açıldı.');
            }}
            onMouseEnter={() =>
              speakHover(isTtsEnabled ? 'Sesli okumayı kapat' : 'Sesli okumayı aç')
            }
            className={`min-h-[48px] px-3 py-2 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              isTtsEnabled
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                : 'bg-slate-100 border-slate-300 text-slate-500 line-through'
            }`}
            title="Sesli Okuma (TTS)"
          >
            {isTtsEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
            <span className="hidden sm:inline">{isTtsEnabled ? 'Ses Açık' : 'Ses Kapalı'}</span>
          </button>

          {/* Yüksek Kontrast Değiştirici */}
          <button
            onClick={handleThemeCycle}
            onMouseEnter={() => speakHover('Görünüm ve yüksek kontrast temasını değiştir')}
            className={`min-h-[48px] px-3 py-2 rounded-2xl border-2 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
              theme === 'contrast-yellow'
                ? 'bg-yellow-400 border-black text-black'
                : theme === 'contrast-blue'
                ? 'bg-blue-900 border-cyan-300 text-cyan-200'
                : 'bg-purple-100 border-purple-300 text-purple-900'
            }`}
            title="Yüksek Kontrast Modu"
          >
            <Eye className="w-5 h-5" />
            <span className="hidden md:inline">
              {theme === 'contrast-yellow'
                ? 'Sarı-Siyah'
                : theme === 'contrast-blue'
                ? 'Mavi-Beyaz'
                : 'Normal'}
            </span>
          </button>

          {/* Öğretmen & İlerleme Paneli */}
          <button
            onClick={() => {
              setIsTeacherModalOpen(true);
              playSound('click');
              speakText('Öğretmen ve gelişim paneli açıldı.');
            }}
            onMouseEnter={() => speakHover('Öğretmen ve gelişim panelini aç')}
            className="min-h-[48px] px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-300/50 transition-all active:scale-95 border-2 border-amber-300"
            title="Öğretmen Paneli"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="hidden sm:inline">Öğretmen Paneli</span>
          </button>
        </div>
      </div>
    </header>
  );
};
