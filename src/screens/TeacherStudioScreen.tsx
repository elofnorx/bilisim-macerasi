import React, { useState } from 'react';
import { useGame } from '../context/useGame';
import type { ShadowItem, MapLevel, GridCoord } from '../types';
import {
  Wrench,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  FileCheck2,
  Palette,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TeacherStudioScreen: React.FC = () => {
  const {
    addCustomShadowItem,
    publishCustomMap,
    bepStats,
    setActiveTab,
    playSfx,
    speak,
  } = useGame();

  const [activeStudioTab, setActiveStudioTab] = useState<'matching' | 'map' | 'report'>('matching');

  // Eşleştirme Oluşturucu Form Durumu
  const [itemName, setItemName] = useState<string>('Yazıcı');
  const [itemEmoji, setItemEmoji] = useState<string>('🖨️');
  const [itemColor, setItemColor] = useState<string>('from-blue-400 to-indigo-500');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Kodlama Haritası Çizici Durumu (5x5)
  const [mapTitle, setMapTitle] = useState<string>('Öğretmen Özel Labirenti');
  const [drawTool, setDrawTool] = useState<'start' | 'target' | 'obstacle'>('obstacle');
  const [startCoord, setStartCoord] = useState<GridCoord>({ x: 0, y: 0 });
  const [targetCoord, setTargetCoord] = useState<GridCoord>({ x: 4, y: 4 });
  const [obstacles, setObstacles] = useState<GridCoord[]>([
    { x: 2, y: 1 },
    { x: 2, y: 2 },
    { x: 2, y: 3 },
  ]);

  // Hazır İkon Kütüphanesi
  const presetItems = [
    { name: 'Yazıcı', emoji: '🖨️', color: 'from-blue-400 to-indigo-500' },
    { name: 'Tablet Bilgisayar', emoji: '📱', color: 'from-sky-400 to-cyan-500' },
    { name: 'Okul Çantası', emoji: '🎒', color: 'from-amber-400 to-orange-500' },
    { name: 'Kurşun Kalem', emoji: '✏️', color: 'from-emerald-400 to-teal-500' },
    { name: 'Akıllı Lamba', emoji: '💡', color: 'from-yellow-400 to-amber-500' },
    { name: 'Robot Arkadaş', emoji: '🤖', color: 'from-indigo-400 to-purple-500' },
    { name: 'Futbol Topu', emoji: '⚽', color: 'from-rose-400 to-pink-500' },
    { name: 'Resim Paleti', emoji: '🎨', color: 'from-violet-400 to-fuchsia-500' },
  ];

  // 1. Eşleştirme Oyununa Ekle
  const handleAddShadowGame = () => {
    if (!itemName.trim()) return;

    const newItem: ShadowItem = {
      id: `custom-${Date.now()}`,
      name: itemName.trim(),
      emoji: itemEmoji,
      color: itemColor,
      shadowSilhouetteId: `silhouette-${Date.now()}`,
    };

    addCustomShadowItem(newItem);
    playSfx('fanfare');
    setSuccessToast(`"${itemName}" nesnesi Wordwall Gölge Oyununa başarıyla eklendi!`);
    speak(`${itemName} gölge oyununa eklendi.`);

    setTimeout(() => setSuccessToast(null), 4000);
  };

  // 2. Harita Hücresine Tıklama (Çizici)
  const handleCellClick = (x: number, y: number) => {
    playSfx('click');

    if (drawTool === 'start') {
      // Hedef veya engelle çakışmayı önle
      setObstacles((prev) => prev.filter((obs) => !(obs.x === x && obs.y === y)));
      if (targetCoord.x === x && targetCoord.y === y) {
        setTargetCoord({ x: (x + 1) % 5, y });
      }
      setStartCoord({ x, y });
    } else if (drawTool === 'target') {
      setObstacles((prev) => prev.filter((obs) => !(obs.x === x && obs.y === y)));
      if (startCoord.x === x && startCoord.y === y) {
        setStartCoord({ x: (x + 1) % 5, y });
      }
      setTargetCoord({ x, y });
    } else {
      // Engel ekle / kaldır (toggle)
      if (
        (startCoord.x === x && startCoord.y === y) ||
        (targetCoord.x === x && targetCoord.y === y)
      ) {
        speak('Başlangıç ve hedef karelerine engel koyulamaz.');
        return;
      }

      setObstacles((prev) => {
        const exists = prev.some((obs) => obs.x === x && obs.y === y);
        if (exists) {
          return prev.filter((obs) => !(obs.x === x && obs.y === y));
        } else {
          return [...prev, { x, y }];
        }
      });
    }
  };

  // 3. Haritayı Yayınla
  const handlePublishMap = () => {
    const newLevel: MapLevel = {
      id: `custom-map-${Date.now()}`,
      title: mapTitle.trim() || 'Öğretmen Özel Haritası',
      gridSize: 5,
      start: startCoord,
      target: targetCoord,
      obstacles: [...obstacles],
    };

    publishCustomMap(newLevel);
    playSfx('fanfare');
    setSuccessToast(`"${newLevel.title}" Labirent ve ScratchJr modüllerine yayınlandı!`);
    speak('Yeni harita yayınlandı.');

    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-2 px-3 sm:px-6">
      {/* Üst Sekmeler */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 w-full max-w-4xl">
        <button
          onClick={() => {
            setActiveStudioTab('matching');
            playSfx('click');
          }}
          className={`min-h-[56px] px-5 py-2.5 rounded-2xl font-black text-base flex items-center gap-2 border-3 cursor-pointer transition-all ${
            activeStudioTab === 'matching'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-4 ring-amber-200'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-5 h-5" />
          <span>Eşleştirme Oluşturucu</span>
        </button>

        <button
          onClick={() => {
            setActiveStudioTab('map');
            playSfx('click');
          }}
          className={`min-h-[56px] px-5 py-2.5 rounded-2xl font-black text-base flex items-center gap-2 border-3 cursor-pointer transition-all ${
            activeStudioTab === 'map'
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-4 ring-indigo-200'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Kodlama Haritası Çizici</span>
        </button>

        <button
          onClick={() => {
            setActiveStudioTab('report');
            playSfx('click');
          }}
          className={`min-h-[56px] px-5 py-2.5 rounded-2xl font-black text-base flex items-center gap-2 border-3 cursor-pointer transition-all ${
            activeStudioTab === 'report'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-4 ring-emerald-200'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-5 h-5" />
          <span>BEP Kazanım Raporu</span>
        </button>
      </div>

      {/* Başarı Bildirimi (Toast) */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="w-full max-w-2xl bg-emerald-100 border-4 border-emerald-500 text-emerald-950 p-4 rounded-3xl font-black text-base sm:text-lg flex items-center justify-between gap-3 shadow-lg mb-6"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => {
                setActiveTab(activeStudioTab === 'matching' ? 'wordwall' : 'maze');
                playSfx('click');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase hover:bg-emerald-700 cursor-pointer shrink-0"
            >
              Hemen Dene →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANA FORM VE ÇALIŞMA KONTEYNIRI */}
      <div className="w-full max-w-5xl bg-white border-4 border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm min-h-[520px]">
        {/* 1. SEKME: EŞLEŞTİRME OLUŞTURUCU */}
        {activeStudioTab === 'matching' && (
          <div className="flex flex-col gap-6">
            <div className="border-b-2 border-slate-200 pb-3">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Wrench className="w-7 h-7 text-amber-500" />
                <span>BEP Uyumlu Eşleştirme ve Gölge Kartı Oluşturucu</span>
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                Öğrencinizin hedefine uygun görseli ve adı belirleyip tek tıkla öğrenci oyununa aktarın.
              </p>
            </div>

            {/* Hazır İkon Şablonları */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">
                Hazır Nesne Kütüphanesinden Hızlı Seç:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {presetItems.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setItemName(preset.name);
                      setItemEmoji(preset.emoji);
                      setItemColor(preset.color);
                      playSfx('click');
                    }}
                    className={`min-h-[56px] p-2.5 rounded-2xl border-2 flex items-center gap-2.5 font-bold text-sm cursor-pointer transition-all ${
                      itemName === preset.name
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-3xl">{preset.emoji}</span>
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Özel Bilgi Form Alanları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-1.5">
                  Nesne / Donanım Adı:
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full min-h-[56px] px-4 rounded-2xl border-3 border-slate-300 text-slate-800 font-bold text-lg focus:border-indigo-500 focus:outline-none"
                  placeholder="Örn: Kulaklık, Yazıcı, Elma"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-1.5">
                  Emoji / Simgesi:
                </label>
                <input
                  type="text"
                  value={itemEmoji}
                  onChange={(e) => setItemEmoji(e.target.value)}
                  className="w-full min-h-[56px] px-4 rounded-2xl border-3 border-slate-300 text-slate-800 font-bold text-2xl text-center focus:border-indigo-500 focus:outline-none"
                  placeholder="Örn: 🖨️"
                />
              </div>
            </div>

            {/* Önizleme Kartı */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 border-3 border-dashed border-slate-300 p-5 rounded-3xl">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Öğrenci Kartı Önizleme
                </span>
                <div
                  className={`w-36 h-36 rounded-2xl bg-gradient-to-tr ${itemColor} flex flex-col items-center justify-center text-white shadow-md border-3 border-white`}
                >
                  <span className="text-6xl drop-shadow">{itemEmoji}</span>
                  <span className="text-xs font-black mt-1 bg-black/20 px-2 py-0.5 rounded-lg">
                    {itemName}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Oluşacak Gölge Silüeti
                </span>
                <div className="w-36 h-36 rounded-2xl bg-slate-100 border-3 border-slate-300 flex items-center justify-center">
                  <span className="text-6xl filter grayscale contrast-200 brightness-0 opacity-80">
                    {itemEmoji}
                  </span>
                </div>
              </div>

              <div className="sm:ml-auto w-full sm:w-auto">
                {/* DEV "OYUNU ÖĞRENCİ EKRANINA EKLE" BUTONU */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddShadowGame}
                  className="w-full sm:w-auto min-h-[64px] px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 border-3 border-amber-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg cursor-pointer ring-4 ring-amber-200"
                >
                  <PlusCircle className="w-7 h-7" />
                  <span>OYUNU ÖĞRENCİ EKRANINA EKLE</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SEKME: KODLAMA HARİTASI ÇİZİCİ */}
        {activeStudioTab === 'map' && (
          <div className="flex flex-col gap-6">
            <div className="border-b-2 border-slate-200 pb-3">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Compass className="w-7 h-7 text-indigo-600" />
                <span>Özel Kodlama & Labirent Haritası Çizici</span>
              </h2>
              <p className="text-sm font-semibold text-slate-600 mt-1">
                4x4 veya 5x5 kare üzerinde başlangıç, hedef ve engelleri seçerek sınıfınıza özel labirent oluşturun.
              </p>
            </div>

            {/* Harita Başlığı Inputu */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1">
                Harita / Seviye Başlığı:
              </label>
              <input
                type="text"
                value={mapTitle}
                onChange={(e) => setMapTitle(e.target.value)}
                className="w-full min-h-[52px] px-4 rounded-2xl border-3 border-slate-300 text-slate-800 font-bold text-base focus:border-indigo-500 focus:outline-none"
                placeholder="Örn: 4. Adım: Dolambaçlı Yol"
              />
            </div>

            {/* Çizim Aracı Seçicisi */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">
                Tıklama Aracı Seç:
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setDrawTool('start');
                    playSfx('click');
                  }}
                  className={`min-h-[56px] px-4 rounded-2xl border-3 font-black text-sm flex items-center gap-2 cursor-pointer transition-all ${
                    drawTool === 'start'
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-200 shadow-md'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-2xl">🤖</span>
                  <span>1. Başlangıç Noktası</span>
                </button>

                <button
                  onClick={() => {
                    setDrawTool('target');
                    playSfx('click');
                  }}
                  className={`min-h-[56px] px-4 rounded-2xl border-3 font-black text-sm flex items-center gap-2 cursor-pointer transition-all ${
                    drawTool === 'target'
                      ? 'bg-amber-400 text-amber-950 border-amber-500 ring-4 ring-amber-200 shadow-md'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-2xl">⭐</span>
                  <span>2. Hedef Yıldız</span>
                </button>

                <button
                  onClick={() => {
                    setDrawTool('obstacle');
                    playSfx('click');
                  }}
                  className={`min-h-[56px] px-4 rounded-2xl border-3 font-black text-sm flex items-center gap-2 cursor-pointer transition-all ${
                    drawTool === 'obstacle'
                      ? 'bg-slate-800 text-white border-slate-900 ring-4 ring-slate-300 shadow-md'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-2xl">🪨</span>
                  <span>3. Engel Ekle / Kaldır</span>
                </button>
              </div>
            </div>

            {/* İnteraktif 5x5 Çizim Tablası */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
              <div
                className="grid gap-2.5 p-4 bg-slate-100 border-4 border-slate-300 rounded-3xl shadow-inner"
                style={{
                  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                }}
              >
                {Array.from({ length: 25 }).map((_, index) => {
                  const x = index % 5;
                  const y = Math.floor(index / 5);

                  const isStart = startCoord.x === x && startCoord.y === y;
                  const isTarget = targetCoord.x === x && targetCoord.y === y;
                  const isObstacle = obstacles.some((obs) => obs.x === x && obs.y === y);

                  return (
                    <button
                      key={`draw-cell-${x}-${y}`}
                      onClick={() => handleCellClick(x, y)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        isStart
                          ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300'
                          : isTarget
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300'
                          : isObstacle
                          ? 'bg-slate-300 border-slate-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isStart && <span className="text-3xl">🤖</span>}
                      {isTarget && <span className="text-3xl">⭐</span>}
                      {isObstacle && <span className="text-3xl">🪨</span>}
                    </button>
                  );
                })}
              </div>

              {/* Bilgi & Yayınla Butonu */}
              <div className="flex flex-col gap-4 max-w-xs">
                <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-2xl text-xs text-indigo-900 leading-relaxed font-semibold">
                  <p className="font-bold text-sm mb-1 text-indigo-950">Nasıl Kullanılır?</p>
                  Yukarıdan bir araç seçip haritadaki kutucuklara tıklayın. Haritanız tamamlandığında aşağıdaki butona basarak Labirent ve ScratchJr modüllerine anında aktarabilirsiniz.
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePublishMap}
                  className="min-h-[64px] px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 border-3 border-indigo-700 text-white font-black text-lg flex items-center justify-center gap-2.5 shadow-lg cursor-pointer ring-4 ring-indigo-200"
                >
                  <Sparkles className="w-6 h-6 text-amber-300" />
                  <span>HARİTAYI YAYINLA</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {/* 3. SEKME: BEP KAZANIM RAPORU */}
        {activeStudioTab === 'report' && (
          <div className="flex flex-col gap-6">
            <div className="border-b-2 border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <FileCheck2 className="w-7 h-7 text-emerald-600" />
                  <span>MEB Bilişim Teknolojileri Dersi BEP Kazanım Tablosu</span>
                </h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  Özel gereksinimli öğrencinin oturum sırasındaki başarı ve deneme metrikleri.
                </p>
              </div>

              <button
                onClick={() => {
                  window.print();
                  playSfx('click');
                }}
                className="min-h-[48px] px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 font-bold text-slate-700 text-xs sm:text-sm cursor-pointer"
              >
                Raporu Yazdır 🖨️
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {bepStats.map((stat) => {
                const ratio =
                  stat.attemptCount > 0
                    ? Math.round((stat.successCount / stat.attemptCount) * 100)
                    : 100;

                return (
                  <div
                    key={stat.code}
                    className="p-5 rounded-2xl border-3 border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-indigo-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg">
                          {stat.code}
                        </span>
                        <h4 className="font-black text-slate-800 text-base">
                          {stat.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold max-w-xl">
                        {stat.bepOutcome}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-500">
                          Başarı: {stat.successCount} / {stat.attemptCount}
                        </div>
                        <div className="text-lg font-black text-slate-800">
                          %{ratio}
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase border-2 ${
                          stat.criterionMet
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                            : 'bg-amber-100 text-amber-800 border-amber-400'
                        }`}
                      >
                        {stat.criterionMet ? 'Ölçüt Karşılandı ✓' : 'Geliştirilmekte ⏳'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
