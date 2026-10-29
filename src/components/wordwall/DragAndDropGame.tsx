import React, { useState } from 'react';
import { useGame } from '../../context/useGame';
import { INITIAL_DRAG_ITEMS, INITIAL_TARGET_BOXES } from '../../data/initialData';
import type { DragItem, TargetBox } from '../../types';
import { CheckCircle2, RotateCcw, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DragAndDropGame: React.FC = () => {
  const { addStars, recordBEPProgress, speak, playSfx } = useGame();

  // Eşleştirilen nesnelerin durum haritası: targetBoxId -> DragItem | null
  const [placedItems, setPlacedItems] = useState<Record<string, DragItem>>({});
  // Motor kısıtlı öğrenciler için "tıkla-seç" durumu
  const [selectedItem, setSelectedItem] = useState<DragItem | null>(null);
  // Yanlış hamle yapıldığında doğru kutuyu parlatma ipucu
  const [hintCategory, setHintCategory] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const dragItems = INITIAL_DRAG_ITEMS;
  const targetBoxes = INITIAL_TARGET_BOXES;

  // Henüz yerleştirilmemiş nesneler
  const availableItems = dragItems.filter(
    (item) => !Object.values(placedItems).some((placed) => placed.id === item.id)
  );

  // Eşleştirme Kontrolü
  const attemptPlacement = (item: DragItem, targetBox: TargetBox) => {
    if (placedItems[targetBox.id]) return; // Zaten dolu

    if (item.targetCategory === targetBox.category) {
      // DOĞRU YERLEŞTİRME
      playSfx('pop');
      const updated = { ...placedItems, [targetBox.id]: item };
      setPlacedItems(updated);
      setSelectedItem(null);
      setHintCategory(null);
      speak(`Harika! ${item.name} doğru yuvaya yerleşti.`);

      // Hepsi yerleşti mi?
      if (Object.keys(updated).length === targetBoxes.length) {
        setIsCompleted(true);
        playSfx('fanfare');
        addStars(2);
        recordBEPProgress('UDA 1', true);
        speak('Tebrikler! Tüm donanım parçalarını bilgisayar masasına yerleştirdin!');
      }
    } else {
      // CEZASIZ DÖNÜT: Kırmızı çarpı yok! Doğru yuva altın sarısı ışıldasın
      playSfx('glow');
      setHintCategory(item.targetCategory);
      recordBEPProgress('UDA 1', false);
      speak(`İpucu: ${item.name} için doğru yuva sarı renkle parıldıyor.`);
    }
  };

  // 1. Tıklayarak Seçme (Dokunmatik ve Motor Kısıt Uyumlu)
  const handleItemClick = (item: DragItem) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      setHintCategory(null);
    } else {
      setSelectedItem(item);
      setHintCategory(null);
      playSfx('click');
      speak(`${item.name} seçildi. Şimdi onu yerleştireceğin yuvaya tıkla.`);
    }
  };

  const handleBoxClick = (box: TargetBox) => {
    if (!selectedItem) {
      // Seçili nesne yoksa kutunun adını oku
      speak(box.title);
      return;
    }
    attemptPlacement(selectedItem, box);
  };

  // 2. Klasik Sürükle-Bırak (HTML5 Drag & Drop)
  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    setSelectedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, box: TargetBox) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = dragItems.find((i) => i.id === itemId);
    if (item) {
      attemptPlacement(item, box);
    }
  };

  const handleReset = () => {
    setPlacedItems({});
    setSelectedItem(null);
    setHintCategory(null);
    setIsCompleted(false);
    playSfx('click');
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[520px] w-full max-w-4xl mx-auto py-4 px-2 select-none">
      {/* Üst Bilgi Çubuğu */}
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-slate-800 bg-slate-100 px-4 py-2 rounded-2xl border-2 border-slate-300">
            Kutuya Yerleştirme 📦
          </span>
          <button
            onClick={() =>
              speak(
                'Donanım parçalarını bilgisayar masasında ait oldukları doğru yuvalara yerleştir.'
              )
            }
            className="min-w-[56px] min-h-[56px] rounded-2xl bg-indigo-50 border-2 border-indigo-200 hover:bg-indigo-100 flex items-center justify-center text-indigo-700 cursor-pointer transition-all"
            title="Yönergeyi Dinle"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={handleReset}
          className="min-h-[56px] px-4 rounded-2xl bg-slate-100 border-2 border-slate-300 hover:bg-slate-200 font-bold text-slate-700 flex items-center gap-2 cursor-pointer text-sm"
          title="Yeniden Başlat"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Yenile</span>
        </button>
      </div>

      {/* Başarı Kutlama Bannerı */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full bg-emerald-100 border-4 border-emerald-500 text-emerald-950 p-4 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-lg mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
            <span>HARİKA! BİLGİSAYAR MASASI TAMAMLANDI! ⭐ +2 YILDIZ</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 my-auto">
        {/* SOL ALAN: TAŞINABİLİR DONANIM PARÇALARI */}
        <div className="flex flex-col items-center">
          <h3 className="font-extrabold text-slate-700 text-lg mb-3 flex items-center gap-2">
            <span>Donanım Parçaları</span>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
              Dokun veya Sürükle
            </span>
          </h3>

          <div className="flex flex-wrap md:flex-col gap-4 w-full max-w-xs items-center justify-center min-h-[220px] p-4 bg-slate-100/70 border-3 border-dashed border-slate-300 rounded-3xl">
            {availableItems.length === 0 ? (
              <div className="flex flex-col items-center text-slate-400 py-6">
                <Sparkles className="w-12 h-12 text-emerald-500 mb-2 animate-bounce" />
                <span className="font-black text-emerald-700 text-base">Hepsi Yerleşti!</span>
              </div>
            ) : (
              availableItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <motion.div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, item)}
                    onClick={() => handleItemClick(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full min-h-[72px] px-4 py-3 rounded-2xl border-4 flex items-center gap-3.5 cursor-grab active:cursor-grabbing transition-all shadow-sm ${item.color} ${
                      isSelected
                        ? 'ring-6 ring-indigo-400 border-indigo-600 scale-105 shadow-md'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <div className="text-left font-black text-lg">{item.name}</div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* SAĞ ALAN: HEDEF YUVALAR (BİLGİSAYAR MASASI) */}
        <div className="flex flex-col items-center">
          <h3 className="font-extrabold text-slate-700 text-lg mb-3 flex items-center gap-2">
            <span>Bilgisayar Masası Yuvaları</span>
            <HelpCircle className="w-5 h-5 text-slate-400" />
          </h3>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            {targetBoxes.map((box) => {
              const placed = placedItems[box.id];
              const isHint = hintCategory === box.category;

              return (
                <div
                  key={box.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, box)}
                  onClick={() => handleBoxClick(box)}
                  className={`w-full min-h-[76px] px-4 py-2.5 rounded-2xl border-4 border-dashed flex items-center justify-between transition-all duration-300 cursor-pointer shadow-xs ${
                    box.color
                  } ${
                    placed
                      ? 'border-solid border-emerald-500 bg-emerald-50'
                      : isHint
                      ? 'border-solid border-amber-400 bg-amber-100 ring-6 ring-amber-300 animate-pulse scale-105'
                      : 'hover:bg-slate-200/50'
                  }`}
                >
                  {placed ? (
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-4xl animate-bounce">{placed.icon}</span>
                      <div className="text-left font-black text-emerald-900 text-lg">
                        {placed.name}
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 ml-auto" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-full opacity-60">
                      <span className="text-3xl filter grayscale">{box.icon}</span>
                      <div className="text-left font-bold text-slate-600 text-base">
                        {box.title}
                      </div>
                      {isHint && (
                        <span className="text-xs bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full animate-bounce ml-auto">
                          Buraya! ✨
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
