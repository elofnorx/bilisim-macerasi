import React, { useState, useRef } from 'react';
import { useGame } from '../context/useGame';
import { SCRATCH_BLOCK_DEFS } from '../data/initialData';
import type { ScratchCommandType, ProgrammedBlock, GridCoord, MapLevel } from '../types';
import {
  Play,
  Trash2,
  RotateCcw,
  Volume2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchJrLevelPlayerProps {
  currentLevel: MapLevel;
  onVictory: () => void;
}

const ScratchJrLevelPlayer: React.FC<ScratchJrLevelPlayerProps> = ({ currentLevel, onVictory }) => {
  const { playSfx, speak, recordBEPProgress } = useGame();
  const gridSize = currentLevel.gridSize || 5;
  const blockCounterRef = useRef<number>(1);

  // Başlangıç komut dizisi: [🟢 Başlat] ile başlar
  const [codeSequence, setCodeSequence] = useState<ProgrammedBlock[]>([
    { uid: 'flag-init', type: 'start' },
  ]);

  const [robotPos, setRobotPos] = useState<GridCoord>(currentLevel.start);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [executingBlockIndex, setExecutingBlockIndex] = useState<number | null>(null);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);

  // Bloğu kodlama çizgisine ekle
  const handleAddBlock = (type: ScratchCommandType) => {
    if (isPlaying) return;
    if (codeSequence.length >= 10) {
      speak('En fazla 10 blok ekleyebilirsin.');
      return;
    }

    const nextId = blockCounterRef.current++;
    const newBlock: ProgrammedBlock = {
      uid: `${type}-${nextId}`,
      type,
    };

    setCodeSequence((prev) => [...prev, newBlock]);
    playSfx('click');
  };

  // Diziden tek bir bloğu silme (Tıkla-kaldır)
  const handleRemoveBlock = (index: number) => {
    if (isPlaying) return;
    if (index === 0 && codeSequence[0]?.type === 'start') {
      speak('Başlat bayrağı kodun başındadır.');
      return;
    }

    setCodeSequence((prev) => prev.filter((_, i) => i !== index));
    playSfx('pop');
  };

  // Kodlama çizgisini temizle
  const handleClearSequence = () => {
    if (isPlaying) return;
    setCodeSequence([{ uid: 'flag-clean', type: 'start' }]);
    setRobotPos(currentLevel.start);
    setIsVictory(false);
    playSfx('click');
    speak('Kodlama çizgisi temizlendi.');
  };

  // Kod Simülasyonunu Adım Adım Çalıştır
  const handleRunProgram = async () => {
    if (isPlaying || codeSequence.length <= 1) {
      if (codeSequence.length <= 1) {
        speak('Önce aşağıdaki renkli bloklardan yön blokları ekle!');
      }
      return;
    }

    setIsPlaying(true);
    setIsVictory(false);
    setRobotPos(currentLevel.start);
    playSfx('click');

    let currentX = currentLevel.start.x;
    let currentY = currentLevel.start.y;
    let hitStar = false;

    // Blokları sırayla adım adım yürüt
    for (let i = 0; i < codeSequence.length; i++) {
      setExecutingBlockIndex(i);
      const block = codeSequence[i];

      if (block.type === 'start') {
        playSfx('pop');
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }

      let dx = 0;
      let dy = 0;
      let isJumpCommand = false;

      switch (block.type) {
        case 'right':
          dx = 1;
          break;
        case 'left':
          dx = -1;
          break;
        case 'up':
          dy = -1;
          break;
        case 'down':
          dy = 1;
          break;
        case 'jump':
          dx = 1;
          isJumpCommand = true;
          break;
      }

      const nextX = Math.max(0, Math.min(gridSize - 1, currentX + dx));
      const nextY = Math.max(0, Math.min(gridSize - 1, currentY + dy));

      if (isJumpCommand) {
        setIsJumping(true);
        playSfx('jump');
        await new Promise((resolve) => setTimeout(resolve, 300));
        setIsJumping(false);
      } else {
        playSfx('step');
      }

      currentX = nextX;
      currentY = nextY;
      setRobotPos({ x: currentX, y: currentY });

      // Yıldız kontrolü
      if (currentX === currentLevel.target.x && currentY === currentLevel.target.y) {
        hitStar = true;
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setExecutingBlockIndex(null);
    setIsPlaying(false);

    if (hitStar) {
      setIsVictory(true);
      onVictory();
    } else {
      playSfx('encourage');
      recordBEPProgress('UDA 3', false);
      speak('Yıldız biraz uzakta kaldı! Yeni yön blokları ekleyip tekrar dene.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Zafer Bildirimi */}
      <AnimatePresence>
        {isVictory && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full bg-emerald-100 border-4 border-emerald-500 text-emerald-950 p-4 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-lg mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
            <span>TEBRİKLER! ALGORİTMA BAŞARIYLA ÇALIŞTI! ⭐ +3 YILDIZ</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. ALAN: 5x5 KODLAMA SİMÜLASYON SAHNESİ */}
      <div className="w-full flex justify-center mb-6">
        <div
          className="grid gap-2 p-3 bg-slate-100 border-4 border-slate-300 rounded-3xl shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);

            const isRobotHere = robotPos.x === x && robotPos.y === y;
            const isTargetHere = currentLevel.target.x === x && currentLevel.target.y === y;
            const isObstacleHere = currentLevel.obstacles.some(
              (obs) => obs.x === x && obs.y === y
            );

            return (
              <div
                key={`cell-${x}-${y}`}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border-2 transition-all relative ${
                  isObstacleHere
                    ? 'bg-amber-100/90 border-amber-300'
                    : isTargetHere
                    ? 'bg-amber-50 border-amber-400'
                    : 'bg-white border-slate-200'
                }`}
              >
                {isTargetHere && (
                  <span className="text-3xl animate-bounce filter drop-shadow">
                    ⭐
                  </span>
                )}
                {isObstacleHere && !isRobotHere && (
                  <span className="text-2xl filter drop-shadow">
                    🪨
                  </span>
                )}
                {isRobotHere && (
                  <motion.div
                    layout
                    className={`absolute inset-0 flex items-center justify-center z-10 ${
                      isJumping ? 'scale-125 -translate-y-3' : ''
                    } transition-transform`}
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow">
                      🤖
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ALAN: METİNSİZ BLOK KÜTÜPHANESİ */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-extrabold text-slate-700 text-base flex items-center gap-2">
            <span>Simgesel Blok Kütüphanesi</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </h3>
          <span className="text-xs text-slate-500 font-bold">
            Bloklara dokunarak sıraya ekle
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {SCRATCH_BLOCK_DEFS.map((block) => (
            <motion.button
              key={block.type}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              disabled={isPlaying}
              onClick={() => handleAddBlock(block.type)}
              className={`min-h-[64px] rounded-2xl border-3 ${block.bgColor} ${block.borderColor} ${block.textColor} p-2 flex flex-col items-center justify-center shadow-sm cursor-pointer transition-all active:scale-95 ${
                isPlaying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={`${block.label} bloğunu ekle`}
            >
              <span className="text-3xl drop-shadow">{block.symbol}</span>
              <span className="text-[11px] font-black uppercase mt-0.5 tracking-tight">
                {block.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 3. ALAN: KODLAMA ÇİZGİSİ & DEV OYNAT BUTONU */}
      <div className="w-full max-w-4xl bg-slate-50 border-3 border-slate-300 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Blok Sırası */}
        <div className="flex-grow w-full overflow-x-auto py-2">
          <div className="flex items-center gap-2 min-w-max">
            {codeSequence.map((block, idx) => {
              const def = SCRATCH_BLOCK_DEFS.find((d) => d.type === block.type) || SCRATCH_BLOCK_DEFS[0];
              const isCurrentExecuting = executingBlockIndex === idx;

              return (
                <motion.div
                  key={block.uid}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  onClick={() => handleRemoveBlock(idx)}
                  className={`min-w-[64px] min-h-[64px] rounded-2xl border-3 p-2 flex flex-col items-center justify-center cursor-pointer transition-all shadow-xs relative ${
                    def.bgColor
                  } ${def.borderColor} ${def.textColor} ${
                    isCurrentExecuting
                      ? 'ring-6 ring-amber-300 scale-110 shadow-lg translate-y-[-2px]'
                      : 'hover:opacity-90'
                  }`}
                  title="Silmek için bloğa dokun"
                >
                  <span className="text-2xl">{def.symbol}</span>
                  <span className="text-[10px] font-black uppercase">
                    {def.label}
                  </span>

                  <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-black flex items-center justify-center border border-white">
                    {idx + 1}
                  </span>
                </motion.div>
              );
            })}

            {codeSequence.length === 1 && (
              <div className="text-slate-400 text-sm font-semibold italic px-3">
                Yukarıdaki yön veya zıplama bloklarına dokun...
              </div>
            )}
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={handleClearSequence}
            disabled={isPlaying}
            className="min-h-[64px] px-4 rounded-2xl bg-slate-200 border-2 border-slate-300 hover:bg-slate-300 text-slate-700 font-bold flex items-center gap-2 cursor-pointer transition-all"
            title="Kodları Temizle"
          >
            <Trash2 className="w-6 h-6 text-slate-600" />
            <span className="hidden sm:inline">Temizle</span>
          </button>

          {/* DEV OYNAT / ÇALIŞTIR BUTONU */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isPlaying}
            onClick={handleRunProgram}
            className={`min-h-[72px] px-7 rounded-2xl font-black text-xl flex items-center justify-center gap-3 border-4 shadow-lg cursor-pointer transition-all ${
              isPlaying
                ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600 text-white ring-4 ring-emerald-200'
            }`}
            title="Kodu Çalıştır"
          >
            <Play className={`w-8 h-8 fill-current ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying ? 'ÇALIŞIYOR...' : 'OYNAT'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export const ScratchJrCodingScreen: React.FC = () => {
  const {
    mapLevels,
    currentMapLevelIndex,
    setCurrentMapLevelIndex,
    addStars,
    recordBEPProgress,
    speak,
    playSfx,
  } = useGame();

  const [resetKey, setResetKey] = useState<number>(0);
  const currentLevel = mapLevels[currentMapLevelIndex % mapLevels.length];

  const handleVictory = () => {
    playSfx('fanfare');
    addStars(3);
    recordBEPProgress('UDA 3', true);
    speak('Harika kodlama! Robot Robi yıldızı topladı!');
  };

  const handleNextLevel = () => {
    const nextIdx = (currentMapLevelIndex + 1) % mapLevels.length;
    setCurrentMapLevelIndex(nextIdx);
    setResetKey(0);
    playSfx('click');
    speak(mapLevels[nextIdx].title);
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2 px-3 sm:px-6">
      <div className="w-full max-w-5xl bg-white border-4 border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm flex flex-col items-center min-h-[560px]">
        {/* Üst Seviye ve Bilgi Çubuğu */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-800 bg-slate-100 px-4 py-2 rounded-2xl border-2 border-slate-300">
              {currentLevel.title}
            </span>
            <button
              onClick={() =>
                speak(
                  'Aşağıdaki bloklara tıklayarak sıraya diz. Sonra yeşil Oynat butonuna bas!'
                )
              }
              className="min-w-[56px] min-h-[56px] rounded-2xl bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 flex items-center justify-center text-indigo-700 cursor-pointer transition-all"
              title="Yönergeyi Dinle"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setResetKey((k) => k + 1);
                playSfx('click');
              }}
              className="min-h-[56px] px-3.5 rounded-2xl bg-slate-100 border-2 border-slate-300 hover:bg-slate-200 font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer text-sm"
              title="Karakteri Başa Al"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Karakteri Sıfırla</span>
            </button>
            <button
              onClick={handleNextLevel}
              className="min-h-[56px] px-4 rounded-2xl bg-indigo-100 border-2 border-indigo-300 hover:bg-indigo-200 font-black text-indigo-900 flex items-center gap-1.5 cursor-pointer text-base"
              title="Sonraki Seviye"
            >
              <span>Sonraki</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level Player keyed by level and reset */}
        <ScratchJrLevelPlayer
          key={`${currentLevel.id}-${resetKey}`}
          currentLevel={currentLevel}
          onVictory={handleVictory}
        />
      </div>
    </div>
  );
};
