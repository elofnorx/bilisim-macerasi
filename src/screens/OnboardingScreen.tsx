import React from 'react';
import { useGame } from '../context/GameContext';
import { MASCOTS } from '../data/initialData';
import {
  MousePointer,
  Hand,
  Mic,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const {
    mascot,
    setMascotId,
    inputMode,
    setInputMode,
    theme,
    setTheme,
    isTtsEnabled,
    setIsTtsEnabled,
    isSoundEnabled,
    setIsSoundEnabled,
    setScreen,
    speakHover,
    speakText,
    playSound,
  } = useGame();

  const handleStartAdventure = () => {
    playSound('fanfare');
    speakText(`Harika seçimler! ${mascot.name} ile Bilişim Macerası haritasına gidiyoruz!`);
    setScreen('map');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 flex flex-col items-center justify-center max-w-6xl mx-auto space-y-8 select-none">
      {/* Karşılama ve Başlık Alanı */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-900 px-4 py-1.5 rounded-full font-extrabold text-sm border-2 border-indigo-200 shadow-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>MEB Özel Eğitim Bilişim Teknolojileri Portalı</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-indigo-950 tracking-tight font-heading">
          Bilişim Macerasına Hoş Geldin! 🚀
        </h1>
        <p className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto font-medium">
          Öğrenme arkadaşını ve sana en uygun kontrol yöntemini seç, eğlenceli teknoloji yolculuğuna başla!
        </p>
      </div>

      {/* ADIM 1: Maskot Seçimi */}
      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-indigo-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black">
              1
            </span>
            Öğrenme Arkadaşını (Maskotunu) Seç
          </h2>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            İstediğin an değiştirebilirsin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MASCOTS.map((m) => {
            const isSelected = mascot.id === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setMascotId(m.id)}
                onMouseEnter={() =>
                  speakHover(
                    `${m.name}, ${m.subtitle}. ${isSelected ? 'Şu anda seçili.' : 'Seçmek için tıkla.'}`
                  )
                }
                role="button"
                tabIndex={0}
                className={`relative rounded-3xl p-6 border-4 cursor-pointer transition-all duration-200 flex flex-col items-center text-center group ${
                  isSelected
                    ? 'border-indigo-600 bg-gradient-to-b from-indigo-50 to-white shadow-2xl scale-[1.03] ring-4 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}

                <div className="text-7xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                  {m.avatarEmoji}
                </div>

                <h3 className="text-2xl font-black text-indigo-950">{m.name}</h3>
                <p className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wider">
                  {m.subtitle}
                </p>

                <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-2xl border border-slate-100 flex-grow">
                  "{m.greeting}"
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMascotId(m.id);
                  }}
                  className={`mt-4 w-full min-h-[48px] py-2.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  {isSelected ? '✓ Seçildi' : 'Bunu Seç'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ADIM 2: Girdi Yöntemi Seçimi */}
      <section className="w-full space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-indigo-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black">
            2
          </span>
          Nasıl Etkileşime Geçmek İstersin? (Girdi Yöntemi)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Fare / Dokunmatik */}
          <div
            onClick={() => setInputMode('touch')}
            onMouseEnter={() =>
              speakHover(
                'Dokunmatik ve Fare Modu: Ekrandaki butonlara dokunarak veya fare ile tıklayarak oynayın.'
              )
            }
            role="button"
            tabIndex={0}
            className={`rounded-3xl p-6 border-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              inputMode === 'touch'
                ? 'border-indigo-600 bg-indigo-50/70 shadow-xl ring-4 ring-indigo-200 scale-[1.02]'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-md">
                <MousePointer className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-indigo-950 mb-1">Fare & Dokunmatik</h3>
              <p className="text-sm text-slate-600">
                Ekrandaki büyük alanlara parmağınla dokun veya fare ile tıkla. Standart ve akıcı deneyim.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100 text-xs font-bold text-indigo-700">
              {inputMode === 'touch' ? '✓ Aktif Mod' : 'Seçmek için tıkla'}
            </div>
          </div>

          {/* El Hareketi / Kamera Modu */}
          <div
            onClick={() => setInputMode('gesture')}
            onMouseEnter={() =>
              speakHover(
                'El Hareketi ve Kamera Modu: Elinizi kameraya gösterin, sanal imleç sizi takip etsin. Dwell-click ile duraklayarak tıklayın.'
              )
            }
            role="button"
            tabIndex={0}
            className={`rounded-3xl p-6 border-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              inputMode === 'gesture'
                ? 'border-amber-500 bg-amber-50/80 shadow-xl ring-4 ring-amber-200 scale-[1.02]'
                : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-md">
                <Hand className="w-8 h-8 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-xl font-black text-slate-900">El Hareketi (Kamera)</h3>
                <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Özel Destek
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Sanal imleç elinizi izler. Butonun üzerinde 1.2 saniye durduğunuzda otomatik tıklar (Dwell Click).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 text-xs font-bold text-amber-800">
              {inputMode === 'gesture' ? '✓ Aktif Mod (Sanal İmleç Açık)' : 'Seçmek için tıkla'}
            </div>
          </div>

          {/* Sesli Komut Modu */}
          <div
            onClick={() => setInputMode('voice')}
            onMouseEnter={() =>
              speakHover(
                'Sesli Komut Modu: Başla, harita, monitör veya harfleri sesli söyleyerek bilgisayarı yönetin.'
              )
            }
            role="button"
            tabIndex={0}
            className={`rounded-3xl p-6 border-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              inputMode === 'voice'
                ? 'border-rose-500 bg-rose-50/80 shadow-xl ring-4 ring-rose-200 scale-[1.02]'
                : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-4 shadow-md">
                <Mic className="w-8 h-8 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-xl font-black text-slate-900">Sesli Komut</h3>
                <span className="bg-rose-400 text-rose-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Eller Serbest
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Mikrofona komutları söyle ("Başla", "Klavye", "Yardım"). Konuşma tanıma otomatik yönlendirir.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-rose-200 text-xs font-bold text-rose-800">
              {inputMode === 'voice' ? '✓ Aktif Mod (Mikrofon Açık)' : 'Seçmek için tıkla'}
            </div>
          </div>
        </div>
      </section>

      {/* ADIM 3: Erişilebilirlik & Konfor Paneli */}
      <section className="w-full bg-white rounded-3xl p-6 border-4 border-indigo-100 shadow-md space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-indigo-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black">
            3
          </span>
          Erişilebilirlik ve Görsel Ayarlar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Yüksek Kontrast */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-600" />
              Görsel Kontrast Teması
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTheme('normal')}
                onMouseEnter={() => speakHover('Standart renkli tema')}
                className={`min-h-[48px] px-3 py-2 rounded-2xl text-xs font-bold border-2 flex items-center justify-between ${
                  theme === 'normal'
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>🌈 Standart Renkli</span>
                {theme === 'normal' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </button>
              <button
                onClick={() => setTheme('contrast-yellow')}
                onMouseEnter={() => speakHover('Sarı ve Siyah Yüksek Kontrast')}
                className={`min-h-[48px] px-3 py-2 rounded-2xl text-xs font-bold border-2 flex items-center justify-between ${
                  theme === 'contrast-yellow'
                    ? 'bg-yellow-400 border-black text-black font-black'
                    : 'bg-black border-yellow-400 text-yellow-300'
                }`}
              >
                <span>🟨 Sarı & Siyah Kontrast</span>
                {theme === 'contrast-yellow' && <CheckCircle2 className="w-4 h-4 text-black" />}
              </button>
              <button
                onClick={() => setTheme('contrast-blue')}
                onMouseEnter={() => speakHover('Mavi ve Beyaz Yüksek Kontrast')}
                className={`min-h-[48px] px-3 py-2 rounded-2xl text-xs font-bold border-2 flex items-center justify-between ${
                  theme === 'contrast-blue'
                    ? 'bg-sky-200 border-sky-600 text-slate-900 font-black'
                    : 'bg-slate-900 border-sky-400 text-sky-200'
                }`}
              >
                <span>🟦 Mavi & Beyaz Okuma</span>
                {theme === 'contrast-blue' && <CheckCircle2 className="w-4 h-4 text-sky-700" />}
              </button>
            </div>
          </div>

          {/* Sesli Okuma (TTS) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              Sesli Yönerge (Hover-to-Speak)
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsTtsEnabled(true);
                  speakText('Sesli yönergeler açıldı.');
                }}
                onMouseEnter={() => speakHover('Sesli yönergeleri aç')}
                className={`min-h-[48px] px-4 py-3 rounded-2xl text-xs font-bold border-2 flex items-center justify-between ${
                  isTtsEnabled
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-emerald-600" />
                  <span>Sesli Yönerge: Açık</span>
                </div>
                {isTtsEnabled && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => {
                  setIsTtsEnabled(false);
                }}
                onMouseEnter={() => speakHover('Sesli yönergeleri kapat')}
                className={`min-h-[48px] px-4 py-3 rounded-2xl text-xs font-bold border-2 flex items-center justify-between ${
                  !isTtsEnabled
                    ? 'bg-slate-200 border-slate-400 text-slate-800 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <VolumeX className="w-5 h-5 text-slate-500" />
                  <span>Sesli Yönerge: Kapalı</span>
                </div>
                {!isTtsEnabled && <CheckCircle2 className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Efekt Sesleri */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Oyun Ses Efektleri & Melodiler
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsSoundEnabled(true);
                  playSound('success');
                }}
                onMouseEnter={() => speakHover('Oyun ses efektlerini aç')}
                className={`min-h-[48px] px-4 py-3 rounded-2xl text-xs font-bold border-2 flex items-center justify-between ${
                  isSoundEnabled
                    ? 'bg-amber-100 border-amber-500 text-amber-950 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>🔔 Ses Efektleri: Açık</span>
                {isSoundEnabled && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </button>
              <button
                onClick={() => setIsSoundEnabled(false)}
                onMouseEnter={() => speakHover('Oyun ses efektlerini kapat')}
                className={`min-h-[48px] px-4 py-3 rounded-2xl text-xs font-bold border-2 flex items-center justify-between ${
                  !isSoundEnabled
                    ? 'bg-slate-200 border-slate-400 text-slate-800 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>🔕 Ses Efektleri: Kapalı</span>
                {!isSoundEnabled && <CheckCircle2 className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Başla Büyük Buton (CTA) */}
      <div className="w-full flex justify-center pt-2">
        <button
          onClick={handleStartAdventure}
          onMouseEnter={() => speakHover('Maceraya Başla butonuna tıkla ve haritaya geç')}
          className="w-full sm:w-auto min-w-[320px] min-h-[64px] px-8 py-5 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-black text-xl sm:text-2xl shadow-2xl shadow-emerald-400/50 flex items-center justify-center gap-3 active:scale-95 transition-all transform border-4 border-emerald-300 ring-4 ring-emerald-100"
        >
          <span>Maceraya Başla!</span>
          <ArrowRight className="w-8 h-8 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
