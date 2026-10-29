import React, { useState } from 'react';
import { useGame } from '../../context/useGame';
import { Volume2, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShadowMatchGame: React.FC = () => {
  const {
    shadowItems,
    addStars,
    recordBEPProgress,
    speak,
    playSfx,
  } = useGame();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [highlightCorrect, setHighlightCorrect] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const currentItem = shadowItems[currentIndex % shadowItems.length];

  // 3 seçenek oluştur (1 doğru, 2 çeldirici)
  // Karışık sırada sabit tutmak için currentIndex'e bağlı pseudo-rastgele sıra
  const generateChoices = () => {
    const others = shadowItems.filter((i) => i.id !== currentItem.id);
    const shuffledOthers = [...others].sort((a, b) => a.id.localeCompare(b.id));
    const distractor1 = shuffledOthers[0] || currentItem;
    const distractor2 = shuffledOthers[1] || currentItem;

    const list = [
      { item: currentItem, isCorrect: true },
      { item: distractor1, isCorrect: false },
      { item: distractor2, isCorrect: false },
    ];

    // Sabit ama seviyeye göre değişen bir sıra
    if (currentIndex % 3 === 1) {
      list.reverse();
    } else if (currentIndex % 3 === 2) {
      const temp = list[0];
      list[0] = list[1];
      list[1] = temp;
    }

    return list;
  };

  const choices = generateChoices();

  const handleChoiceClick = (isCorrect: boolean) => {
    if (isSuccess) return;

    if (isCorrect) {
      // Doğru seçim
      setIsSuccess(true);
      setHighlightCorrect(false);
      playSfx('success');
      addStars(1);
      recordBEPProgress('UDA 1', true);
      speak(`Harika! Bu bir ${currentItem.name}`);

      // 1.8 saniye sonra sonraki soruya yumuşakça geç
      setTimeout(() => {
        setIsSuccess(false);
        setCurrentIndex((prev) => (prev + 1) % shadowItems.length);
      }, 1800);
    } else {
      // CEZASIZ DÖNÜT SİSTEMİ:
      // Kırmızı uyarı yok! Doğru seçenek altın sarısı ışıltıyla parıldayarak yol gösterir.
      playSfx('glow');
      setHighlightCorrect(true);
      recordBEPProgress('UDA 1', false);
      speak('İpucu: Doğru gölge parıldıyor');
    }
  };

  const handleNext = () => {
    setIsSuccess(false);
    setHighlightCorrect(false);
    setCurrentIndex((prev) => (prev + 1) % shadowItems.length);
    playSfx('click');
  };

  const handleReset = () => {
    setIsSuccess(false);
    setHighlightCorrect(false);
    setCurrentIndex(0);
    playSfx('click');
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto py-4 px-2 select-none">
      {/* Üst Bilgi & Seviye İlerlemesi (Sade, max 3-4 öge) */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-slate-800 bg-slate-100 px-4 py-2 rounded-2xl border-2 border-slate-300">
            Soru {currentIndex + 1} / {shadowItems.length}
          </span>
          <button
            onClick={() => speak(`Bu renkli nesnenin gölgesini aşağıdan bul: ${currentItem.name}`)}
            className="min-w-[56px] min-h-[56px] rounded-2xl bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 flex items-center justify-center text-indigo-700 cursor-pointer transition-all"
            title="Yönergeyi Dinle"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="min-h-[56px] px-3.5 rounded-2xl bg-slate-100 border-2 border-slate-300 hover:bg-slate-200 font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer text-sm"
            title="Başa Dön"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="hidden sm:inline">Başa Al</span>
          </button>
          <button
            onClick={handleNext}
            className="min-h-[56px] px-4 rounded-2xl bg-indigo-100 border-2 border-indigo-300 hover:bg-indigo-200 font-black text-indigo-900 flex items-center gap-1.5 cursor-pointer text-base"
            title="Sonraki Nesne"
          >
            <span>Sonraki</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 1. ANA ÖGE: Büyük Renkli Hedef Nesne Kartı */}
      <motion.div
        key={`target-${currentItem.id}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-tr ${currentItem.color} p-4 flex flex-col items-center justify-center shadow-lg border-4 border-white text-white mb-8`}
      >
        <span className="text-7xl sm:text-8xl drop-shadow-md select-none transform hover:scale-110 transition-transform">
          {currentItem.emoji}
        </span>
        <span className="mt-3 text-lg sm:text-xl font-black bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-xl text-center">
          {currentItem.name}
        </span>
      </motion.div>

      {/* Başarı Kutlama Bildirimi (Doğru tıklandığında çıkar) */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-3 bg-emerald-100 border-4 border-emerald-500 text-emerald-950 px-6 py-3 rounded-3xl font-black text-xl shadow-xl mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
            <span>HARİKA! DOĞRU GÖLGE! ⭐ +1</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ANA ÖGE: 3 Adet Büyük Siyah Gölge Kartı (Dev Tıklama Alanları - min 110x110px) */}
      <div className="w-full">
        <p className="text-center font-bold text-slate-600 mb-3 text-sm sm:text-base">
          Aşağıdaki gölgelerden hangisi bu nesneye ait?
        </p>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl mx-auto">
          {choices.map((choice, idx) => {
            const isTargetChoice = choice.isCorrect;
            const shouldGlow = highlightCorrect && isTargetChoice;

            return (
              <motion.button
                key={`${choice.item.id}-${idx}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChoiceClick(choice.isCorrect)}
                className={`min-h-[120px] sm:min-h-[140px] rounded-3xl border-4 p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-sm relative ${
                  shouldGlow
                    ? 'bg-amber-100 border-amber-400 ring-6 ring-amber-300 animate-pulse scale-105'
                    : 'bg-slate-100 border-slate-300 hover:border-slate-400 hover:bg-slate-200'
                }`}
                title="Gölgeyi Seç"
              >
                {/* Siyah Gölge Silüeti (brightness(0) filtresi ile tam silüet) */}
                <div
                  className="text-6xl sm:text-7xl filter grayscale contrast-200 brightness-0 opacity-85 transition-transform"
                  style={{ userSelect: 'none' }}
                >
                  {choice.item.emoji}
                </div>

                {shouldGlow && (
                  <span className="absolute -top-3 bg-amber-400 text-amber-950 text-xs font-black px-3 py-0.5 rounded-full shadow-sm animate-bounce">
                    Buradayım! ✨
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
