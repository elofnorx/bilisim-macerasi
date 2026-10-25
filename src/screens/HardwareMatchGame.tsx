import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import {
  Monitor,
  HardDrive,
  Keyboard as KeyboardIcon,
  Mouse as MouseIcon,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Volume2,
  ArrowRight,
} from 'lucide-react';

interface HardwarePart {
  id: string;
  name: string;
  category: 'monitor' | 'case' | 'keyboard' | 'mouse';
  icon: React.ReactNode;
  description: string;
  color: string;
  borderColor: string;
}

const PARTS: HardwarePart[] = [
  {
    id: 'part-monitor',
    name: 'Monitör (Ekran)',
    category: 'monitor',
    icon: <Monitor className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-600" />,
    description: 'Bilgisayardaki resimleri, yazıları ve videoları görmemizi sağlar.',
    color: 'bg-indigo-50 hover:bg-indigo-100',
    borderColor: 'border-indigo-400',
  },
  {
    id: 'part-case',
    name: 'Kasa (Sistem Birimi)',
    category: 'case',
    icon: <HardDrive className="w-12 h-12 sm:w-16 sm:h-16 text-rose-600" />,
    description: 'Bilgisayarın beyni ve kalbidir. Tüm parçalar burada çalışır.',
    color: 'bg-rose-50 hover:bg-rose-100',
    borderColor: 'border-rose-400',
  },
  {
    id: 'part-keyboard',
    name: 'Klavye',
    category: 'keyboard',
    icon: <KeyboardIcon className="w-12 h-12 sm:w-16 sm:h-16 text-amber-600" />,
    description: 'Harflere, sayılara basarak bilgisayara yazı yazmamızı sağlar.',
    color: 'bg-amber-50 hover:bg-amber-100',
    borderColor: 'border-amber-400',
  },
  {
    id: 'part-mouse',
    name: 'Fare (Mouse)',
    category: 'mouse',
    icon: <MouseIcon className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600" />,
    description: 'Ekranda gezinmemizi, nesneleri tıklayıp seçmemizi sağlar.',
    color: 'bg-emerald-50 hover:bg-emerald-100',
    borderColor: 'border-emerald-400',
  },
];

export const HardwareMatchGame: React.FC = () => {
  const {
    setScreen,
    playSound,
    speakText,
    speakHover,
    triggerEncouragement,
    recordMove,
    completeLevel,
    unlockBadge,
  } = useGame();

  // Matched slots: { monitor: true, case: false, ... }
  const [placedParts, setPlacedParts] = useState<{ [key: string]: boolean }>({
    monitor: false,
    case: false,
    keyboard: false,
    mouse: false,
  });

  // Erişilebilir iki aşamalı tıklama seçimi
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; isSuccess: boolean } | null>({
    text: 'Parçayı seçip masadaki doğru silüete yerleştirin!',
    isSuccess: true,
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sesli Komut Dinleme
  useEffect(() => {
    const handleVoice = (e: any) => {
      const cmd = e.detail as string;
      if (cmd.includes('monitör') || cmd.includes('ekran')) {
        handleMatch('monitor', 'monitor');
      } else if (cmd.includes('kasa') || cmd.includes('beyin')) {
        handleMatch('case', 'case');
      } else if (cmd.includes('klavye') || cmd.includes('tuş')) {
        handleMatch('keyboard', 'keyboard');
      } else if (cmd.includes('fare') || cmd.includes('mouse')) {
        handleMatch('mouse', 'mouse');
      }
    };

    window.addEventListener('app-voice-command', handleVoice);
    return () => window.removeEventListener('app-voice-command', handleVoice);
  }, [placedParts]);

  // Kazanma kontrolü
  useEffect(() => {
    const allPlaced = Object.values(placedParts).every((v) => v === true);
    if (allPlaced && !isCompleted) {
      setIsCompleted(true);
      playSound('fanfare');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      speakText('Tebrikler! Tüm donanım parçalarını doğru yerleştirdin. Harika bir iş çıkardın!');
      completeLevel('w1-l1', 3);
      unlockBadge('badge-hardware');
    }
  }, [placedParts, isCompleted]);

  const handleMatch = (partCategory: string, slotCategory: string) => {
    if (placedParts[slotCategory]) return; // Zaten dolu

    if (partCategory === slotCategory) {
      // Doğru eşleşme
      playSound('success');
      recordMove(true);
      setPlacedParts((prev) => ({ ...prev, [slotCategory]: true }));
      setSelectedPartId(null);

      const partInfo = PARTS.find((p) => p.category === slotCategory);
      const msg = `Harika! Bu bir ${partInfo?.name}. ${partInfo?.description}`;
      setFeedbackMsg({ text: msg, isSuccess: true });
      speakText(msg);

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else {
      // Yanlış deneme -> Cezalandırma yok, cesaretlendirici dönüt!
      triggerEncouragement();
      recordMove(false);
      setFeedbackMsg({
        text: 'Neredeyse oluyordu, tekrar dene! 🌟 İpucu: Şekline ve silüetine dikkat et.',
        isSuccess: false,
      });
    }
  };

  const handleReset = () => {
    playSound('click');
    setPlacedParts({
      monitor: false,
      case: false,
      keyboard: false,
      mouse: false,
    });
    setSelectedPartId(null);
    setIsCompleted(false);
    setFeedbackMsg({
      text: 'Oyun yeniden başlatıldı. Parçaları yerleştirmeye hazırsın!',
      isSuccess: true,
    });
    speakText('Oyun yeniden başlatıldı. Donanım parçalarını yerleştirelim.');
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, category: string) => {
    e.dataTransfer.setData('text/plain', category);
  };

  const handleDrop = (e: React.DragEvent, slotCategory: string) => {
    e.preventDefault();
    const draggedCategory = e.dataTransfer.getData('text/plain');
    if (draggedCategory) {
      handleMatch(draggedCategory, slotCategory);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Üst Bar: Geri Dönüş, Başlık, Yeniden Başlat */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-indigo-200 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setScreen('map');
              playSound('click');
            }}
            onMouseEnter={() => speakHover('Haritaya dön')}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-2 transition-all border border-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Harita</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                1. Dünya • 1. Seviye
              </span>
              <span className="text-xs font-bold text-slate-500">
                Dokunma & Eşleştirme
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Bilgisayar Parçalarını Eşleştir 🖥️
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            onMouseEnter={() => speakHover('Oyunu baştan başlat')}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-sm flex items-center gap-2 transition-all border-2 border-amber-300"
          >
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <span>Yeniden Başlat</span>
          </button>
        </div>
      </div>

      {/* Geri Bildirim ve Rehber Mesaj Kutusu */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-3xl border-4 flex items-center justify-between gap-4 transition-all ${
            feedbackMsg.isSuccess
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-md shadow-emerald-100'
              : 'bg-amber-50 border-amber-300 text-amber-950 shadow-md shadow-amber-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {feedbackMsg.isSuccess ? '🌟' : '💡'}
            </span>
            <p className="text-base sm:text-lg font-bold leading-snug">
              {feedbackMsg.text}
            </p>
          </div>
          <button
            onClick={() => speakText(feedbackMsg.text, true)}
            onMouseEnter={() => speakHover('Mesajı tekrar dinle')}
            className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 shadow border border-slate-200 shrink-0"
            title="Mesajı Dinle"
          >
            <Volume2 className="w-5 h-5 text-indigo-600" />
          </button>
        </div>
      )}

      {/* Oyun Alanı: Sol Parça Havuzu + Sağ Bilgisayar Masası Yuvaları */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SOL: Sürüklenebilir / Tıklanabilir Donanım Parçaları */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-4 border-indigo-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Parçalar Kutusu
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Sürükle veya Tıkla
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600">
            👉 Parçaya dokunup seçtikten sonra masadaki uygun yuvaya dokunabilirsiniz.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {PARTS.map((part) => {
              const isPlaced = placedParts[part.category];
              const isSelected = selectedPartId === part.category;

              if (isPlaced) {
                return (
                  <div
                    key={part.id}
                    className="p-5 rounded-2xl border-4 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center text-center opacity-60 cursor-default"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-1" />
                    <span className="text-xs font-extrabold text-emerald-800">
                      {part.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Yerleştirildi ✓
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={part.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, part.category)}
                  onClick={() => {
                    setSelectedPartId(part.category);
                    playSound('click');
                    speakText(`${part.name} seçildi. Şimdi masadaki yuvasına tıkla.`);
                  }}
                  onMouseEnter={() =>
                    speakHover(
                      `${part.name}. ${part.description}. Yerleştirmek için tıkla veya sürükle.`
                    )
                  }
                  role="button"
                  tabIndex={0}
                  className={`p-5 rounded-3xl border-4 cursor-grab active:cursor-grabbing transition-all duration-150 flex flex-col items-center text-center select-none shadow-md hover:shadow-xl hover:scale-105 active:scale-95 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-100 ring-4 ring-indigo-300 scale-105'
                      : `${part.borderColor} ${part.color}`
                  }`}
                >
                  <div className="mb-2">{part.icon}</div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {part.name}
                  </h3>
                  <span className="mt-2 text-[11px] font-bold text-indigo-700 bg-white/80 px-2 py-0.5 rounded-full border border-indigo-200">
                    {isSelected ? '✓ Seçildi' : 'Seç / Taşı'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SAĞ: Bilgisayar Masası ve Hedef Silüet Yuvaları */}
        <div className="lg:col-span-7 bg-gradient-to-b from-sky-50 to-indigo-50/60 rounded-3xl p-6 sm:p-8 border-4 border-indigo-300 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
            <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
              <span>🖥️ Çalışma Masası</span>
            </h2>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
              {Object.values(placedParts).filter(Boolean).length} / 4 Parça Yerleşti
            </span>
          </div>

          {/* Masaüstü Düzeni */}
          <div className="relative bg-white/90 rounded-3xl p-6 sm:p-8 border-4 border-slate-200 shadow-inner min-h-[380px] flex flex-col justify-between">
            {/* Üst Satır: Kasa ve Monitör */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Yuva 1: Kasa */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'case')}
                onClick={() => {
                  if (selectedPartId) handleMatch(selectedPartId, 'case');
                }}
                onMouseEnter={() =>
                  speakHover(
                    placedParts.case
                      ? 'Kasa doğru yerleştirildi.'
                      : 'Kasa yuvası. Buraya bilgisayar kasasını yerleştirin.'
                  )
                }
                role="button"
                tabIndex={0}
                className={`min-h-[160px] rounded-3xl border-4 p-4 flex flex-col items-center justify-center text-center transition-all ${
                  placedParts.case
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                    : 'border-dashed border-rose-300 bg-rose-50/40 hover:bg-rose-100/60 cursor-pointer'
                }`}
              >
                {placedParts.case ? (
                  <>
                    <HardDrive className="w-16 h-16 text-rose-600 mb-2 animate-bounce" />
                    <span className="text-base font-black text-slate-900">Kasa Yerleşti!</span>
                    <span className="text-xs text-emerald-700 font-bold">Harika ✓</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-12 h-12 text-rose-300 mb-2" />
                    <span className="text-sm font-black text-slate-700">Kasa Yuvası</span>
                    <span className="text-[11px] text-slate-500">
                      {selectedPartId ? 'Buraya bırakmak için tıkla' : 'Buraya sürükle'}
                    </span>
                  </>
                )}
              </div>

              {/* Yuva 2: Monitör */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'monitor')}
                onClick={() => {
                  if (selectedPartId) handleMatch(selectedPartId, 'monitor');
                }}
                onMouseEnter={() =>
                  speakHover(
                    placedParts.monitor
                      ? 'Monitör doğru yerleştirildi.'
                      : 'Monitör yuvası. Buraya ekranı yerleştirin.'
                  )
                }
                role="button"
                tabIndex={0}
                className={`min-h-[160px] rounded-3xl border-4 p-4 flex flex-col items-center justify-center text-center transition-all ${
                  placedParts.monitor
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                    : 'border-dashed border-indigo-300 bg-indigo-50/40 hover:bg-indigo-100/60 cursor-pointer'
                }`}
              >
                {placedParts.monitor ? (
                  <>
                    <Monitor className="w-16 h-16 text-indigo-600 mb-2 animate-bounce" />
                    <span className="text-base font-black text-slate-900">Monitör Yerleşti!</span>
                    <span className="text-xs text-emerald-700 font-bold">Harika ✓</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-12 h-12 text-indigo-300 mb-2" />
                    <span className="text-sm font-black text-slate-700">Monitör Yuvası</span>
                    <span className="text-[11px] text-slate-500">
                      {selectedPartId ? 'Buraya bırakmak için tıkla' : 'Buraya sürükle'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Alt Satır: Klavye ve Fare */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {/* Yuva 3: Klavye (Geniş alan) */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'keyboard')}
                onClick={() => {
                  if (selectedPartId) handleMatch(selectedPartId, 'keyboard');
                }}
                onMouseEnter={() =>
                  speakHover(
                    placedParts.keyboard
                      ? 'Klavye doğru yerleştirildi.'
                      : 'Klavye yuvası. Buraya klavyeyi yerleştirin.'
                  )
                }
                role="button"
                tabIndex={0}
                className={`sm:col-span-2 min-h-[120px] rounded-3xl border-4 p-4 flex flex-col items-center justify-center text-center transition-all ${
                  placedParts.keyboard
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                    : 'border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-100/60 cursor-pointer'
                }`}
              >
                {placedParts.keyboard ? (
                  <>
                    <KeyboardIcon className="w-12 h-12 text-amber-600 mb-1" />
                    <span className="text-base font-black text-slate-900">Klavye Yerleşti!</span>
                    <span className="text-xs text-emerald-700 font-bold">Harika ✓</span>
                  </>
                ) : (
                  <>
                    <KeyboardIcon className="w-10 h-10 text-amber-300 mb-1" />
                    <span className="text-sm font-black text-slate-700">Klavye Yuvası</span>
                    <span className="text-[11px] text-slate-500">
                      {selectedPartId ? 'Buraya bırakmak için tıkla' : 'Buraya sürükle'}
                    </span>
                  </>
                )}
              </div>

              {/* Yuva 4: Fare */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'mouse')}
                onClick={() => {
                  if (selectedPartId) handleMatch(selectedPartId, 'mouse');
                }}
                onMouseEnter={() =>
                  speakHover(
                    placedParts.mouse
                      ? 'Fare doğru yerleştirildi.'
                      : 'Fare yuvası. Buraya fareyi yerleştirin.'
                  )
                }
                role="button"
                tabIndex={0}
                className={`min-h-[120px] rounded-3xl border-4 p-4 flex flex-col items-center justify-center text-center transition-all ${
                  placedParts.mouse
                    ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                    : 'border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-100/60 cursor-pointer'
                }`}
              >
                {placedParts.mouse ? (
                  <>
                    <MouseIcon className="w-12 h-12 text-emerald-600 mb-1" />
                    <span className="text-base font-black text-slate-900">Fare Yerleşti!</span>
                    <span className="text-xs text-emerald-700 font-bold">Harika ✓</span>
                  </>
                ) : (
                  <>
                    <MouseIcon className="w-10 h-10 text-emerald-300 mb-1" />
                    <span className="text-sm font-black text-slate-700">Fare Yuvası</span>
                    <span className="text-[11px] text-slate-500">
                      {selectedPartId ? 'Tıkla' : 'Sürükle'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seviye Tamamlandı Başarı Modalı */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-4 border-amber-400 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-6xl animate-bounce">🏆</div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black uppercase mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Seviye Başarıyla Tamamlandı!
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-heading">
                Harika İş Çıkardın!
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Tüm temel bilgisayar donanım parçalarını doğru yerleştirdin. 3 Yıldız ve "Donanım Mimarı" rozeti kazandın!
              </p>
            </div>

            {/* 3 Yıldız Gösterimi */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3].map((star) => (
                <div
                  key={star}
                  className="w-14 h-14 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-300/50 animate-pulse"
                >
                  ⭐
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setScreen('map');
                  playSound('click');
                }}
                className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition-colors border border-slate-300"
              >
                Haritaya Dön
              </button>
              <button
                onClick={() => {
                  setScreen('game-keyboard');
                  playSound('click');
                  speakText('2. Dünya, Klavye Vadisi Harf Patlatma oyunu başlıyor!');
                }}
                className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-300 transition-colors"
              >
                <span>Sonraki Oyun</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
