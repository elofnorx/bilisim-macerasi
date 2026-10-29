import React, { useState } from 'react';
import type { WordwallSubGame } from '../types';
import { ShadowMatchGame } from '../components/wordwall/ShadowMatchGame';
import { SpinWheelGame } from '../components/wordwall/SpinWheelGame';
import { DragAndDropGame } from '../components/wordwall/DragAndDropGame';
import { useGame } from '../context/useGame';
import { Ghost, Disc, PackageCheck } from 'lucide-react';

export const WordwallGameScreen: React.FC = () => {
  const [subGame, setSubGame] = useState<WordwallSubGame>('shadow');
  const { playSfx, speak } = useGame();

  const subGames: { id: WordwallSubGame; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'shadow',
      label: 'Gölgesini Bul',
      icon: <Ghost className="w-6 h-6 shrink-0" />,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'wheel',
      label: 'Şans Çarkıfeleği',
      icon: <Disc className="w-6 h-6 shrink-0" />,
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'matching',
      label: 'Kutuya Yerleştir',
      icon: <PackageCheck className="w-6 h-6 shrink-0" />,
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center select-none py-2 px-3 sm:px-6">
      {/* 3 Alt Oyun Seçici Butonları (Dev Tıklama Alanları - min 64px) */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 w-full max-w-3xl">
        {subGames.map((game) => {
          const isActive = subGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => {
                setSubGame(game.id);
                playSfx('click');
                speak(game.label);
              }}
              className={`min-h-[64px] flex-1 min-w-[180px] px-5 py-3 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 border-3 cursor-pointer shadow-xs ${
                isActive
                  ? `bg-gradient-to-r ${game.color} text-white border-white ring-4 ring-indigo-200 shadow-md translate-y-[-2px]`
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
              }`}
              aria-pressed={isActive}
            >
              {game.icon}
              <span>{game.label}</span>
            </button>
          );
        })}
      </div>

      {/* DEV BOYUTLU VE SADE KART KONTEYNIRI */}
      <div className="w-full max-w-5xl bg-white border-4 border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm flex flex-col items-center justify-center min-h-[560px]">
        {subGame === 'shadow' && <ShadowMatchGame />}
        {subGame === 'wheel' && <SpinWheelGame />}
        {subGame === 'matching' && <DragAndDropGame />}
      </div>
    </div>
  );
};
