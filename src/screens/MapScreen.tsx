import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Star,
  Lock,
  Play,
  CheckCircle,
  Sparkles,
  Monitor,
  MousePointerClick,
  Move,
  Binary,
  BookOpen,
  ShieldCheck,
  Cpu,
  Award,
} from 'lucide-react';
import type { LevelInfo } from '../types';

export const MapScreen: React.FC = () => {
  const { worlds, setScreen, speakHover, speakText, playSound, mascot } = useGame();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor':
        return <Monitor className="w-6 h-6" />;
      case 'MousePointerClick':
        return <MousePointerClick className="w-6 h-6" />;
      case 'Move':
        return <Move className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Binary':
        return <Binary className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const handleStartLevel = (level: LevelInfo) => {
    if (level.isLocked) {
      playSound('encourage');
      speakText('Bu seviye henüz kilitli. Önceki seviyeleri tamamlayarak kilidini açabilirsin!');
      return;
    }

    playSound('click');
    if (level.targetScreen) {
      speakText(`${level.title} oyunu başlıyor! İyi şanslar.`);
      setScreen(level.targetScreen);
    } else {
      speakText(`${level.title} seviyesine hoş geldin.`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Harita Başlığı ve Maskot İpucu */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border-4 border-indigo-400 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-700/80 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>İnteraktif Macera Yolculuğu</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">
            Bilişim Dünyaları Haritası 🗺️
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl">
            Adaları sırayla keşfet, seviyelerdeki görevleri tamamla ve parlayan altın yıldızları topla!
          </p>
        </div>

        {/* Maskot Karakter Kutusu */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
          <span className="text-4xl animate-bounce">{mascot.avatarEmoji}</span>
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              {mascot.name} diyor ki:
            </div>
            <div className="text-sm font-semibold text-white">
              "1. Dünya'daki Donanım Eşleştirme oyununa başlayalım mı?"
            </div>
          </div>
        </div>

        {/* Arka plan süslemeleri */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3 Ana Dünya Listesi */}
      <div className="space-y-12">
        {worlds.map((world) => {
          return (
            <div
              key={world.id}
              className={`rounded-3xl border-4 p-6 sm:p-8 shadow-lg transition-all ${
                world.isUnlocked
                  ? `${world.bgColor} ${world.borderColor}`
                  : 'bg-slate-100 border-slate-300 opacity-80'
              }`}
            >
              {/* Dünya Başlığı */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200/80">
                <div className="flex items-center gap-4">
                  <span className="text-5xl filter drop-shadow">{world.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white shadow-sm border border-slate-200 text-slate-700">
                        {world.id}. Dünya
                      </span>
                      {!world.isUnlocked && (
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                          <Lock className="w-3.5 h-3.5" /> Kilitli
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                      {world.name}
                    </h2>
                    <p className="text-sm text-slate-600 font-medium">{world.tagline}</p>
                  </div>
                </div>

                {world.isUnlocked && (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 text-sm font-bold text-slate-700">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span>
                      {world.levels.reduce((acc, l) => acc + l.stars, 0)} / {world.levels.length * 3} Yıldız
                    </span>
                  </div>
                )}
              </div>

              {/* Mikro Seviyeler Izgarası */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                {world.levels.map((level) => {
                  return (
                    <div
                      key={level.id}
                      onClick={() => handleStartLevel(level)}
                      onMouseEnter={() =>
                        speakHover(
                          `${world.name}, Seviye ${level.number}: ${level.title}. ${
                            level.isLocked
                              ? 'Kilitli seviye.'
                              : level.isCompleted
                              ? 'Tamamlandı. ' + level.stars + ' yıldız kazanıldı.'
                              : 'Oynamak için tıkla.'
                          }`
                        )
                      }
                      role="button"
                      tabIndex={level.isLocked ? -1 : 0}
                      className={`relative rounded-3xl p-6 border-4 flex flex-col justify-between transition-all duration-200 select-none ${
                        level.isLocked
                          ? 'bg-slate-200/60 border-slate-300 text-slate-400 cursor-not-allowed'
                          : level.isCompleted
                          ? 'bg-white border-emerald-400 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer ring-2 ring-emerald-100'
                          : 'bg-white border-indigo-400 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer ring-2 ring-indigo-100'
                      }`}
                    >
                      {/* Üst Satır: Seviye No ve İkon */}
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
                            level.isLocked
                              ? 'bg-slate-300 text-slate-500'
                              : level.isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {level.isLocked ? <Lock className="w-7 h-7" /> : getIcon(level.iconName)}
                        </div>

                        {/* Yıldızlar */}
                        <div className="flex gap-1 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
                          {[1, 2, 3].map((starNum) => (
                            <Star
                              key={starNum}
                              className={`w-4 h-4 ${
                                starNum <= level.stars
                                  ? 'text-amber-500 fill-amber-400 animate-pulse'
                                  : 'text-slate-300 fill-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Başlık ve Açıklama */}
                      <div className="mt-4 mb-4">
                        <div className="text-xs font-black uppercase text-indigo-700 tracking-wider">
                          Seviye {level.number}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mt-0.5">
                          {level.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {level.description}
                        </p>
                      </div>

                      {/* Alt Buton / Durum */}
                      <div className="pt-3 border-t border-slate-100">
                        {level.isLocked ? (
                          <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-500">
                            <Lock className="w-4 h-4" />
                            <span>Kilitli</span>
                          </div>
                        ) : level.isCompleted ? (
                          <div className="flex items-center justify-between py-1">
                            <span className="flex items-center gap-1 text-xs font-black text-emerald-700">
                              <CheckCircle className="w-4 h-4" /> Tamamlandı
                            </span>
                            <span className="text-xs font-bold text-indigo-600 underline">
                              Tekrar Oyna
                            </span>
                          </div>
                        ) : (
                          <button className="w-full min-h-[44px] py-2 px-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow transition-colors">
                            <Play className="w-4 h-4 fill-white" />
                            <span>Oyna</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
