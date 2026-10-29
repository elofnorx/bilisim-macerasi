import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/useGame';
import type { GridCoord, MapLevel } from '../types';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MazeLevelBoardProps {
  currentLevel: MapLevel;
  onVictory: () => void;
}

const MazeLevelBoard: React.FC<MazeLevelBoardProps> = ({ currentLevel, onVictory }) => {
  const { playSfx, speak } = useGame();
  const gridSize = currentLevel.gridSize || 5;

  const [robotPos, setRobotPos] = useState<GridCoord>(currentLevel.start);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [bumpDirection, setBumpDirection] = useState<string | null>(null);

  // Hareketi gerçekleştir
  const moveRobot = useCallback((dx: number, dy: number, dirName: string) => {
    if (isVictory) return;

    const newX = robotPos.x + dx;
    const newY = robotPos.y + dy;

    // Sınır kontrolü (0..gridSize-1)
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
      playSfx('encourage');
      setBumpDirection(dirName);
      setTimeout(() => setBumpDirection(null), 300);
      return;
    }

    // Engel kontrolü
    const isObstacle = currentLevel.obstacles.some(
      (obs) => obs.x === newX && obs.y === newY
    );

    if (isObstacle) {
      playSfx('encourage');
      setBumpDirection(dirName);
      setTimeout(() => setBumpDirection(null), 300);
      speak('Orada bir engel var, başka yönden dene!');
      return;
    }

    // Geçerli hareket
    setRobotPos({ x: newX, y: newY });
    playSfx('step');

    // Hedefe ulaşıldı mı?
    if (newX === currentLevel.target.x && newY === currentLevel.target.y) {
      setIsVictory(true);
      onVictory();
    }
  }, [isVictory, robotPos, gridSize, currentLevel, playSfx, speak, onVictory]);

  // Klavye ok tuşları desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        moveRobot(0, -1, 'up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        moveRobot(0, 1, 'down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        moveRobot(-1, 0, 'left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        moveRobot(1, 0, 'right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveRobot]);

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
            <span>TEBRİKLER! YILDIZI YAKALADIN! ⭐ +2 YILDIZ</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 my-auto">
        {/* 5x5 Sade Izgara Haritası */}
        <div
          className="grid gap-2.5 p-4 bg-slate-100 border-4 border-slate-300 rounded-3xl shadow-inner"
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
            const isStartHere = currentLevel.start.x === x && currentLevel.start.y === y;

            return (
              <div
                key={`cell-${x}-${y}`}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all relative ${
                  isObstacleHere
                    ? 'bg-amber-100/90 border-amber-300'
                    : isTargetHere
                    ? 'bg-amber-50 border-amber-400'
                    : isStartHere
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Hedef Yıldız */}
                {isTargetHere && (
                  <span className="text-3xl sm:text-4xl animate-bounce filter drop-shadow">
                    ⭐
                  </span>
                )}

                {/* Engel Taşı */}
                {isObstacleHere && !isRobotHere && (
                  <span className="text-3xl sm:text-4xl filter drop-shadow">
                    🪨
                  </span>
                )}

                {/* Robot Karakteri */}
                {isRobotHere && (
                  <motion.div
                    layoutId="robot-character"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <span className="text-4xl sm:text-5xl filter drop-shadow hover:scale-110 transition-transform">
                      🤖
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* DEV BOYUTLU 4 YÖN OKU (D-PAD) */}
        <div className="flex flex-col items-center">
          <h3 className="font-extrabold text-slate-700 text-lg mb-3 flex items-center gap-1.5">
            <span>Yön Okları</span>
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </h3>

          <div className="grid grid-cols-3 gap-3 w-64 h-64 p-3 bg-slate-100 border-4 border-slate-300 rounded-3xl shadow-sm items-center justify-center">
            <div />

            {/* ⬆️ YUKARI */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => moveRobot(0, -1, 'up')}
              className={`w-full h-full min-h-[72px] rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white flex items-center justify-center border-3 border-indigo-600 shadow-md cursor-pointer transition-all ${
                bumpDirection === 'up' ? 'ring-4 ring-amber-400 animate-shake' : ''
              }`}
              title="Yukarı Git"
              aria-label="Yukarı"
            >
              <ArrowUp className="w-10 h-10 stroke-[3]" />
            </motion.button>

            <div />

            {/* ⬅️ SOL */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => moveRobot(-1, 0, 'left')}
              className={`w-full h-full min-h-[72px] rounded-2xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white flex items-center justify-center border-3 border-sky-600 shadow-md cursor-pointer transition-all ${
                bumpDirection === 'left' ? 'ring-4 ring-amber-400 animate-shake' : ''
              }`}
              title="Sola Git"
              aria-label="Sol"
            >
              <ArrowLeft className="w-10 h-10 stroke-[3]" />
            </motion.button>

            {/* Orta Maskot Simgesi */}
            <div className="flex items-center justify-center text-3xl opacity-75">
              🧭
            </div>

            {/* ➡️ SAĞ */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => moveRobot(1, 0, 'right')}
              className={`w-full h-full min-h-[72px] rounded-2xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white flex items-center justify-center border-3 border-sky-600 shadow-md cursor-pointer transition-all ${
                bumpDirection === 'right' ? 'ring-4 ring-amber-400 animate-shake' : ''
              }`}
              title="Sağa Git"
              aria-label="Sağ"
            >
              <ArrowRight className="w-10 h-10 stroke-[3]" />
            </motion.button>

            <div />

            {/* ⬇️ AŞAĞI */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => moveRobot(0, 1, 'down')}
              className={`w-full h-full min-h-[72px] rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white flex items-center justify-center border-3 border-indigo-600 shadow-md cursor-pointer transition-all ${
                bumpDirection === 'down' ? 'ring-4 ring-amber-400 animate-shake' : ''
              }`}
              title="Aşağı Git"
              aria-label="Aşağı"
            >
              <ArrowDown className="w-10 h-10 stroke-[3]" />
            </motion.button>

            <div />
          </div>

          <p className="text-xs text-slate-500 mt-3 font-semibold">
            Klavye ok tuşları veya ekrandaki butonlarla oynayabilirsin.
          </p>
        </div>
      </div>
    </div>
  );
};

export const MazeGameScreen: React.FC = () => {
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
    addStars(2);
    recordBEPProgress('UDA 2', true);
    speak('Harika! Hedefe ulaştın ve yıldızı topladın!');
  };

  const handleResetLevel = () => {
    setResetKey((k) => k + 1);
    playSfx('click');
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
        {/* Üst Seviye Çubuğu */}
        <div className="flex items-center justify-between w-full mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-800 bg-slate-100 px-4 py-2 rounded-2xl border-2 border-slate-300">
              {currentLevel.title}
            </span>
            <button
              onClick={() =>
                speak(
                  'Yön oklarına basarak Robot Robi\'yi parlayan yıldıza ulaştır!'
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
              onClick={handleResetLevel}
              className="min-h-[56px] px-3.5 rounded-2xl bg-slate-100 border-2 border-slate-300 hover:bg-slate-200 font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer text-sm"
              title="Yeniden Başla"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="hidden sm:inline">Başa Al</span>
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

        {/* Level board keyed by level ID and reset key for clean state reset */}
        <MazeLevelBoard
          key={`${currentLevel.id}-${resetKey}`}
          currentLevel={currentLevel}
          onVictory={handleVictory}
        />
      </div>
    </div>
  );
};
