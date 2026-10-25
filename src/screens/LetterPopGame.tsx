import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
} from 'lucide-react';

interface LetterBubble {
  id: number;
  letter: string;
  x: number; // Yüzde olarak (10 to 80)
  y: number; // Yüzde olarak (0 to 100)
  color: string;
  borderColor: string;
  size: number;
}

const ALPHABET = ['A', 'B', 'C', 'E', 'K', 'M', 'O', 'S', 'T', 'U', 'Y'];
const BUBBLE_COLORS = [
  { bg: 'bg-rose-400', border: 'border-rose-200' },
  { bg: 'bg-amber-400', border: 'border-amber-200' },
  { bg: 'bg-emerald-400', border: 'border-emerald-200' },
  { bg: 'bg-sky-400', border: 'border-sky-200' },
  { bg: 'bg-purple-400', border: 'border-purple-200' },
  { bg: 'bg-pink-400', border: 'border-pink-200' },
];

export const LetterPopGame: React.FC = () => {
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

  const [bubbles, setBubbles] = useState<LetterBubble[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [targetScore] = useState<number>(8); // 8 harf patlatınca kazanılır
  const [speedLevel, setSpeedLevel] = useState<'slow' | 'normal' | 'fast'>('slow');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [lastPopped, setLastPopped] = useState<string | null>(null);

  const nextIdRef = useRef<number>(1);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);

  // Sesli Komut Dinleme
  useEffect(() => {
    const handleVoice = (e: any) => {
      const cmd = (e.detail as string).toUpperCase();
      // Harf eşleşmesi ara
      const matched = bubbles.find((b) => cmd.includes(b.letter));
      if (matched) {
        popBubble(matched.id, matched.letter);
      }
    };

    window.addEventListener('app-voice-command', handleVoice);
    return () => window.removeEventListener('app-voice-command', handleVoice);
  }, [bubbles]);

  // Klavye Dinleyicisi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;
      const key = e.key.toUpperCase();
      const matched = bubbles.find((b) => b.letter === key);
      if (matched) {
        popBubble(matched.id, matched.letter);
      } else if (/^[A-ZÇĞİÖŞÜ]$/i.test(e.key)) {
        // Yanlış tuş -> cesaretlendir
        triggerEncouragement();
        setCombo(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bubbles, isCompleted]);

  // Yeni Baloncuk Oluşturma & Süzülme Döngüsü
  useEffect(() => {
    if (isCompleted) return;

    const fallSpeed = speedLevel === 'slow' ? 0.35 : speedLevel === 'normal' ? 0.6 : 0.9;

    const interval = setInterval(() => {
      setBubbles((prev) => {
        // Balonları aşağı kaydır
        const moved = prev
          .map((b) => ({ ...b, y: b.y + fallSpeed }))
          .filter((b) => {
            // Yere düşen balonlar
            if (b.y > 90) {
              return false;
            }
            return true;
          });

        // Ekranda en az 3, en fazla 5 balon olsun
        if (moved.length < 3) {
          const letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
          const colorObj = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
          const newBubble: LetterBubble = {
            id: nextIdRef.current++,
            letter,
            x: Math.floor(Math.random() * 65) + 15, // 15 to 80%
            y: 0,
            color: colorObj.bg,
            borderColor: colorObj.border,
            size: 80, // Büyük, kolay hedeflenebilir
          };
          return [...moved, newBubble];
        }

        return moved;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [speedLevel, isCompleted]);

  // Balon Patlatma Mantığı
  const popBubble = (bubbleId: number, letter: string) => {
    playSound('pop');
    recordMove(true);
    setLastPopped(letter);
    speakText(`${letter} harfi! Harika!`);

    setScore((prev) => {
      const newScore = prev + 1;
      if (newScore >= targetScore && !isCompleted) {
        setIsCompleted(true);
        playSound('fanfare');
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
        speakText('Tebrikler! Klavye Vadisi harf avını başarıyla tamamladın!');
        completeLevel('w2-l1', 3);
        unlockBadge('badge-keyboard');
      }
      return newScore;
    });

    setCombo((prev) => prev + 1);

    // Patlayan balonu kaldır
    setBubbles((prev) => prev.filter((b) => b.id !== bubbleId));
  };

  const handleReset = () => {
    playSound('click');
    setBubbles([]);
    setScore(0);
    setCombo(0);
    setIsCompleted(false);
    setLastPopped(null);
    speakText('Klavye oyunu yeniden başladı. Harfleri yakala!');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Üst Bilgi Barı */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-sky-200 shadow-md">
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
              <span className="text-xs font-black uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                2. Dünya • Klavye Vadisi
              </span>
              <span className="text-xs font-bold text-slate-500">
                Harf Balonları Patlatma
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Süzülen Harf Balonlarını Patlat 🎈
            </h1>
          </div>
        </div>

        {/* Skor & Hız Kontrolleri */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Skor Kutusu */}
          <div className="bg-sky-50 border-2 border-sky-300 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-700">Skor:</span>
            <span className="text-xl font-black text-sky-950">
              {score} / {targetScore}
            </span>
          </div>

          {/* Kombo Göstergesi */}
          {combo > 1 && (
            <div className="bg-amber-100 border-2 border-amber-400 px-3 py-2 rounded-2xl flex items-center gap-1.5 animate-bounce">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-black text-orange-950">{combo}x Seri!</span>
            </div>
          )}

          {/* Düşüş Hızı Ayarı */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setSpeedLevel('slow');
                playSound('click');
                speakText('Düşüş hızı: Çok Yavaş olarak ayarlandı.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                speedLevel === 'slow'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Yavaş
            </button>
            <button
              onClick={() => {
                setSpeedLevel('normal');
                playSound('click');
                speakText('Düşüş hızı: Normal olarak ayarlandı.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                speedLevel === 'normal'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Normal
            </button>
          </div>

          <button
            onClick={handleReset}
            onMouseEnter={() => speakHover('Oyunu baştan başlat')}
            className="min-h-[48px] px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-1.5 border border-slate-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Yeniden</span>
          </button>
        </div>
      </div>

      {/* Yönerge İpucu */}
      <div className="bg-sky-50 border-2 border-sky-300 p-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold text-sky-950">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <span>
            💡 <span className="font-extrabold">Nasıl Oynanır:</span> Ekranda süzülen harfe klavyenden bas, dokun veya harfi sesli söyle!
          </span>
        </div>
        {lastPopped && (
          <span className="text-xs bg-white px-2.5 py-1 rounded-full border border-sky-300 text-sky-700">
            Son Patlayan: <strong className="text-base text-indigo-700">{lastPopped}</strong>
          </span>
        )}
      </div>

      {/* Oyun Alanı: Gökyüzü ve Baloncuklar */}
      <div
        ref={gameAreaRef}
        className="relative w-full h-[460px] bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-100 rounded-3xl border-4 border-sky-400 overflow-hidden shadow-2xl shadow-sky-200/50"
      >
        {/* Dekoratif Bulutlar */}
        <div className="absolute top-4 left-10 text-6xl opacity-40 select-none pointer-events-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-12 right-20 text-7xl opacity-40 select-none pointer-events-none animate-pulse">
          ☁️
        </div>
        <div className="absolute top-24 left-1/3 text-5xl opacity-30 select-none pointer-events-none">
          ☁️
        </div>

        {/* Gökyüzünden Süzülen Baloncuklar */}
        {bubbles.map((bubble) => {
          return (
            <div
              key={bubble.id}
              onClick={() => popBubble(bubble.id, bubble.letter)}
              onMouseEnter={() =>
                speakHover(
                  `${bubble.letter} harfi balonu. Patlatmak için tıkla veya klavyeden bas.`
                )
              }
              role="button"
              tabIndex={0}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full ${bubble.color} border-4 ${bubble.borderColor} text-white flex flex-col items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-90 transition-transform duration-100 animate-in zoom-in-50`}
            >
              {/* Balon Işık Parıltısı */}
              <div className="absolute top-2 left-3 w-4 h-4 bg-white/60 rounded-full blur-[1px]" />
              <span className="text-4xl font-black font-heading tracking-wide drop-shadow-md">
                {bubble.letter}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                Tıkla
              </span>
            </div>
          );
        })}

        {/* Taban Çimenlik Alanı */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-emerald-500/80 border-t-4 border-emerald-600 flex items-center justify-center text-emerald-950 font-bold text-xs">
          🌱 Klavye Vadisi Zemin Hattı
        </div>
      </div>

      {/* Tablet ve Dokunmatik Tahtalar İçin Erişilebilir Sanal Klavye Şeridi */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-4 border-slate-200 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>⌨️ Dokunmatik Sanal Klavye Tuşları</span>
          </h3>
          <span className="text-xs text-slate-500">
            Fiziksel klavye yerine dokunarak da patlatabilirsiniz
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center">
          {ALPHABET.map((letter) => {
            const hasOnScreen = bubbles.some((b) => b.letter === letter);
            return (
              <button
                key={letter}
                onClick={() => {
                  const targetBubble = bubbles.find((b) => b.letter === letter);
                  if (targetBubble) {
                    popBubble(targetBubble.id, letter);
                  } else {
                    playSound('click');
                    speakText(`${letter} harfi.`);
                  }
                }}
                onMouseEnter={() => speakHover(`${letter} tuşu`)}
                className={`min-w-[54px] min-h-[54px] sm:min-w-[62px] sm:min-h-[62px] rounded-2xl font-black text-xl sm:text-2xl flex items-center justify-center transition-all duration-100 border-2 active:scale-90 shadow-md ${
                  hasOnScreen
                    ? 'bg-amber-400 border-amber-500 text-amber-950 ring-4 ring-amber-200 animate-pulse scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zafer / Seviye Tamamlandı Modalı */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-4 border-sky-400 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-6xl animate-bounce">🎈</div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-sky-100 text-sky-900 px-3 py-1 rounded-full text-xs font-black uppercase mb-2">
                <Sparkles className="w-4 h-4 text-sky-600" /> Klavye Görevi Başarılı!
              </div>
              <h2 className="text-3xl font-black text-slate-900 font-heading">
                Tebrikler Harf Avcısı!
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Uçan harf balonlarını tam zamanında patlattın. Harika bir refleks ve klavye hakimiyeti sergiledin!
              </p>
            </div>

            {/* 3 Yıldız */}
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
                onClick={handleReset}
                className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-300 transition-colors"
              >
                <span>Tekrar Oyna</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
