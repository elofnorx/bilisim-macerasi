import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Camera, Hand, Sparkles } from 'lucide-react';

export const VirtualCursor: React.FC = () => {
  const { inputMode, playSound, speakText } = useGame();
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 300, y: 300 });
  const [isDwelling, setIsDwelling] = useState(false);
  const [dwellProgress, setDwellProgress] = useState(0); // 0 to 100
  const [gestureState, setGestureState] = useState<'open' | 'pinch' | 'point'>('open');
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const dwellTimerRef = useRef<any>(null);
  const currentTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (inputMode !== 'gesture') return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // İmlecin altındaki öğeyi bul
      const elem = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const clickable = elem?.closest('button, [role="button"], input, a, .clickable-target') as HTMLElement | null;

      if (clickable && clickable !== currentTargetRef.current) {
        // Yeni bir tıklanabilir öğeye gelindi - Dwell süresini başlat
        currentTargetRef.current = clickable;
        setIsDwelling(true);
        setDwellProgress(0);
        setGestureState('point');

        if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);

        let progress = 0;
        const intervalTime = 30; // ms
        const totalDuration = 1200; // 1.2 saniye dwell click
        const step = (intervalTime / totalDuration) * 100;

        dwellTimerRef.current = setInterval(() => {
          progress += step;
          if (progress >= 100) {
            clearInterval(dwellTimerRef.current);
            setDwellProgress(100);
            setGestureState('pinch');
            playSound('click');

            // Tıklama yap
            clickable.click();
            currentTargetRef.current = null;
            setIsDwelling(false);

            // Geri çekilme gecikmesi
            setTimeout(() => {
              setGestureState('open');
              setDwellProgress(0);
            }, 300);
          } else {
            setDwellProgress(progress);
          }
        }, intervalTime);
      } else if (!clickable) {
        // Tıklanabilir alandan çıkıldı
        if (dwellTimerRef.current) {
          clearInterval(dwellTimerRef.current);
        }
        currentTargetRef.current = null;
        setIsDwelling(false);
        setDwellProgress(0);
        setGestureState('open');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);
    };
  }, [inputMode, playSound]);

  if (inputMode !== 'gesture') return null;

  return (
    <>
      {/* Sanal El İmleci */}
      <div
        className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out select-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Dwell Progress Dairesi */}
          {isDwelling && (
            <svg className="absolute -inset-4 w-16 h-16 animate-spin-slow">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-amber-200 fill-transparent"
                strokeWidth="4"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="stroke-amber-500 fill-transparent transition-all duration-75"
                strokeWidth="5"
                strokeDasharray="163"
                strokeDashoffset={163 - (163 * dwellProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* El İkonu */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-150 ${
              gestureState === 'pinch'
                ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-300'
                : gestureState === 'point'
                ? 'bg-amber-500 text-white scale-105 ring-4 ring-amber-300'
                : 'bg-indigo-600 text-white ring-4 ring-indigo-300 shadow-indigo-300/50'
            }`}
          >
            {gestureState === 'pinch' ? (
              <Sparkles className="w-6 h-6 animate-pulse" />
            ) : (
              <Hand className="w-7 h-7" />
            )}
          </div>

          {/* Duraklama İpucu Etiketi */}
          {isDwelling && (
            <span className="absolute top-14 bg-slate-900/90 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap shadow">
              Tıklanıyor... %{Math.round(dwellProgress)}
            </span>
          )}
        </div>
      </div>

      {/* Sağ Üst Kamera & MediaPipe Jest Simülasyon Paneli */}
      <div className="fixed top-20 right-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border-2 border-indigo-200 w-64 text-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
            <Camera className="w-4 h-4 animate-pulse" />
            <span>Kamera / Jest Simülasyonu</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Yapay Zeka El İskeleti Görselleştirmesi */}
        <div className="mt-2 h-28 bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-700">
          {/* El İskeleti Çizgileri */}
          <svg className="w-full h-full p-2 opacity-80" viewBox="0 0 100 80">
            {/* Avuç İçi */}
            <circle cx="50" cy="55" r="5" fill="#38bdf8" />
            <line x1="50" y1="55" x2="30" y2="40" stroke="#38bdf8" strokeWidth="2" />
            <line x1="50" y1="55" x2="42" y2="25" stroke="#38bdf8" strokeWidth="2" />
            <line x1="50" y1="55" x2="52" y2="20" stroke="#38bdf8" strokeWidth="2" />
            <line x1="50" y1="55" x2="62" y2="26" stroke="#38bdf8" strokeWidth="2" />
            <line x1="50" y1="55" x2="70" y2="42" stroke="#38bdf8" strokeWidth="2" />

            {/* Parmak Uçları */}
            <circle
              cx="30"
              cy="40"
              r="4"
              fill={gestureState === 'pinch' ? '#10b981' : '#f59e0b'}
            />
            <circle
              cx="42"
              cy="25"
              r="4"
              fill={gestureState === 'pinch' ? '#10b981' : '#38bdf8'}
            />
            <circle cx="52" cy="20" r="4" fill="#38bdf8" />
            <circle cx="62" cy="26" r="4" fill="#38bdf8" />
            <circle cx="70" cy="42" r="4" fill="#38bdf8" />
          </svg>

          <div className="absolute bottom-1 left-2 text-[10px] text-emerald-400 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded">
            MediaPipe: {gestureState === 'pinch' ? 'Kavrama (Pinch)' : gestureState === 'point' ? 'Odaklanma' : 'Açık El (Serbest)'}
          </div>
        </div>

        <p className="mt-2 text-[11px] text-slate-600 leading-snug">
          💡 <span className="font-semibold">Özel Eğitim Desteği:</span> Butonun üstünde 1 saniye duraklayarak otomatik tıklayabilirsiniz.
        </p>

        <button
          onClick={() => {
            setIsWebcamActive(!isWebcamActive);
            speakText(isWebcamActive ? 'Kamera kapatıldı.' : 'Gerçek kamera akışı açılıyor.');
          }}
          className="mt-2 w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
        >
          <Camera className="w-3.5 h-3.5" />
          {isWebcamActive ? 'Kamerayı Gizle' : 'Kamerayı Başlat'}
        </button>
      </div>
    </>
  );
};
