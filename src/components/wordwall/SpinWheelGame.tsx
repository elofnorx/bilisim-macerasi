import React, { useState } from 'react';
import { useGame } from '../../context/useGame';
import { INITIAL_WHEEL_TASKS } from '../../data/initialData';
import type { WheelTask } from '../../types';
import { Sparkles, CheckCircle2, RotateCw, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SpinWheelGame: React.FC = () => {
  const { addStars, recordBEPProgress, speak, playSfx } = useGame();

  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<WheelTask | null>(null);
  const [isTaskCompleted, setIsTaskCompleted] = useState<boolean>(false);

  const tasks = INITIAL_WHEEL_TASKS;
  const numSegments = tasks.length;
  const segmentAngle = 360 / numSegments;

  // Çarkı Çevirme Fonksiyonu
  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedTask(null);
    setIsTaskCompleted(false);
    playSfx('click');

    // Tıkırtı sesleri çal
    const spinSoundInterval = setInterval(() => {
      playSfx('spin');
    }, 150);

    // En az 4 tam tur (1440 deg) + rastgele dilim açısı
    const extraSpins = 4 * 360;
    const randomSegmentIndex = Math.floor(Math.random() * numSegments);
    // İğne çarkın tepesinde (270 derecede veya 0 derecede) durur
    const targetAngle = extraSpins + (360 - randomSegmentIndex * segmentAngle - segmentAngle / 2);

    const finalRotation = rotation + targetAngle;
    setRotation(finalRotation);

    setTimeout(() => {
      clearInterval(spinSoundInterval);
      setIsSpinning(false);
      const chosen = tasks[randomSegmentIndex];
      setSelectedTask(chosen);
      playSfx('pop');
      speak(`Görevin: ${chosen.title}`);
    }, 3200);
  };

  // Görevi Tamamlama Butonu
  const handleCompleteTask = () => {
    if (!selectedTask || isTaskCompleted) return;

    setIsTaskCompleted(true);
    playSfx('fanfare');
    addStars(selectedTask.rewardStars || 1);
    recordBEPProgress('UDA 1', true);
    speak('Tebrikler! Görevi başarıyla tamamladın!');

    setTimeout(() => {
      setSelectedTask(null);
      setIsTaskCompleted(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto py-4 px-2 select-none">
      {/* Başlık ve Seslendirici */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-slate-800 bg-slate-100 px-4 py-2 rounded-2xl border-2 border-slate-300">
            Şans Çarkıfeleği 🎡
          </span>
          <button
            onClick={() => speak('Çarkı çevir ve çıkan görevi tamamla!')}
            className="min-w-[56px] min-h-[56px] rounded-2xl bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 flex items-center justify-center text-indigo-700 cursor-pointer transition-all"
            title="Yönergeyi Dinle"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 my-auto">
        {/* ÇARKI GÖSTEREN ALAN */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Çarkın Sabit Üst İğnesi (Pointer) */}
          <div className="absolute -top-5 z-20 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[36px] border-t-amber-500 filter drop-shadow-md" />

          {/* Dönen Çark */}
          <div
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-full border-8 border-indigo-600 shadow-2xl relative overflow-hidden transition-transform ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '3.2s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
            }}
          >
            {tasks.map((task, idx) => {
              const startAngle = idx * segmentAngle;
              return (
                <div
                  key={task.id}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    transformOrigin: '50% 50%',
                  }}
                >
                  {/* Dilim Rengi ve Simgesi */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-40 flex flex-col items-center pt-3 text-white font-black"
                    style={{
                      transformOrigin: '50% 100%',
                    }}
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow filter mb-1">
                      {task.icon}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Renkli Arka Plan SVG Dilimleri */}
            <svg
              className="absolute inset-0 w-full h-full -z-10"
              viewBox="0 0 100 100"
            >
              {tasks.map((task, idx) => {
                const angle = 360 / tasks.length;
                const start = idx * angle;
                const end = (idx + 1) * angle;
                const x1 = 50 + 50 * Math.cos((Math.PI * start) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * start) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * end) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * end) / 180);
                const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                return <path key={task.id} d={d} fill={task.color} stroke="#ffffff" strokeWidth="1.5" />;
              })}
            </svg>
          </div>

          {/* Çarkın Ortasındaki DEV "ÇEVİR" BUTONU (Min 80px) */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl flex flex-col items-center justify-center font-black text-white cursor-pointer z-10 transition-transform active:scale-90 ${
              isSpinning
                ? 'bg-slate-400 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-tr from-amber-500 to-orange-500 hover:scale-105 ring-4 ring-amber-300'
            }`}
          >
            <RotateCw className={`w-7 h-7 sm:w-8 sm:h-8 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span className="text-xs sm:text-sm tracking-wider uppercase">ÇEVİR</span>
          </button>
        </div>

        {/* SAĞ TARAF: ÇIKAN GÖREV KARTI */}
        <div className="w-full max-w-sm flex flex-col items-center justify-center min-h-[260px]">
          <AnimatePresence mode="wait">
            {selectedTask ? (
              <motion.div
                key={selectedTask.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-full rounded-3xl bg-white border-4 border-amber-300 p-6 flex flex-col items-center text-center shadow-lg"
              >
                <span className="text-6xl sm:text-7xl mb-3 animate-bounce">
                  {selectedTask.icon}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
                  {selectedTask.title}
                </h3>
                <p className="text-sm font-semibold text-slate-600 mb-5">
                  Bu görevi şimdi yerine getir ve yıldızını kap!
                </p>

                {/* Dev Görevi Yaptım Butonu (Min 64px) */}
                <button
                  onClick={handleCompleteTask}
                  disabled={isTaskCompleted}
                  className={`w-full min-h-[64px] rounded-2xl font-black text-lg flex items-center justify-center gap-2 border-3 cursor-pointer transition-all shadow-md active:scale-95 ${
                    isTaskCompleted
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-7 h-7" />
                  <span>{isTaskCompleted ? 'YILDIZ KAZANDIN! ⭐' : 'GÖREVİ YAPTIM!'}</span>
                </button>
              </motion.div>
            ) : (
              <div className="w-full rounded-3xl bg-slate-100 border-4 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center text-slate-500">
                <Sparkles className="w-12 h-12 text-slate-400 mb-2 animate-pulse" />
                <p className="font-bold text-base">
                  Ortadaki <strong className="text-amber-600">ÇEVİR</strong> butonuna bas!
                </p>
                <p className="text-xs text-slate-400 mt-1">Sana özel bir görev gelecek.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
