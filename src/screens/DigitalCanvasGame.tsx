import React, { useRef, useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Download,
  Palette,
  Eraser,
  Paintbrush,
  Stamp,
  Layers,
  ArrowRight,
} from 'lucide-react';

const COLORS = [
  { name: 'Kırmızı', hex: '#ef4444', labelBg: 'bg-red-500' },
  { name: 'Mavi', hex: '#3b82f6', labelBg: 'bg-blue-500' },
  { name: 'Sarı', hex: '#eab308', labelBg: 'bg-yellow-500' },
  { name: 'Yeşil', hex: '#22c55e', labelBg: 'bg-green-500' },
  { name: 'Turuncu', hex: '#f97316', labelBg: 'bg-orange-500' },
  { name: 'Mor', hex: '#a855f7', labelBg: 'bg-purple-500' },
  { name: 'Siyah', hex: '#0f172a', labelBg: 'bg-slate-900' },
];

const BRUSH_SIZES = [
  { name: 'İnce', size: 6 },
  { name: 'Orta', size: 14 },
  { name: 'Kalın', size: 24 },
  { name: 'Dev Boy', size: 38 },
];

const STAMPS = [
  { name: 'Yıldız', emoji: '⭐' },
  { name: 'Kalp', emoji: '❤️' },
  { name: 'Bilgisayar', emoji: '🖥️' },
  { name: 'Robot', emoji: '🤖' },
  { name: 'Çiçek', emoji: '🌸' },
];

export const DigitalCanvasGame: React.FC = () => {
  const {
    setScreen,
    playSound,
    speakText,
    speakHover,
    completeLevel,
    updateUDAReport,
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'canvas' | 'toolsMatch'>('canvas');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#3b82f6');
  const [brushSize, setBrushSize] = useState<number>(14);
  const [selectedTool, setSelectedTool] = useState<'brush' | 'eraser' | 'stamp'>('brush');
  const [activeStamp, setActiveStamp] = useState<string>('⭐');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);

  // Arayüz Simgeleri Eşleştirme Mini Oyunu
  const [toolPairs, setToolPairs] = useState([
    { id: 't1', icon: '🖌️', name: 'Fırça Aracı', matchId: 'm1', matched: false },
    { id: 't2', icon: '🧼', name: 'Silgi Aracı', matchId: 'm2', matched: false },
    { id: 't3', icon: '🎨', name: 'Renk Paleti', matchId: 'm3', matched: false },
    { id: 't4', icon: '💾', name: 'Kaydet Butonu', matchId: 'm4', matched: false },
  ]);

  const [toolDescriptions] = useState([
    { id: 'm1', desc: 'Tuval üzerine renkli çizgiler ve resimler çizer.' },
    { id: 'm2', desc: 'İstemediğimiz veya hatalı kısımları beyazlatıp siler.' },
    { id: 'm3', desc: 'Kırmızı, mavi, sarı gibi farklı renk tonlarını seçmemizi sağlar.' },
    { id: 'm4', desc: 'Yaptığımız sanat eserini bilgisayarımıza saklar ve indirir.' },
  ]);

  const [selectedToolCard, setSelectedToolCard] = useState<string | null>(null);

  // Canvas Başlatma
  useEffect(() => {
    if (activeSubTab !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Beyaz arka plan
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [activeSubTab]);

  // Çizim Olayları
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (selectedTool === 'stamp') {
      ctx.font = `${brushSize * 2.2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeStamp, x, y);
      playSound('pop');
      handleStrokeProgress();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      handleStrokeProgress();
    }
  };

  const handleStrokeProgress = () => {
    setStrokeCount((prev) => {
      const next = prev + 1;
      if (next === 5) {
        completeLevel('w3-l1', 3);
        updateUDAReport('UDA 3', true);
        confetti({ particleCount: 50, spread: 60 });
        speakText('Harika gidiyorsun! Renkler ve fırçalarla çok güzel bir kompozisyon oluşuyor.');
      }
      return next;
    });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playSound('click');
    speakText('Tuval temizlendi. Yepyeni bir resme başlayabilirsin.');
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'meb-bilisim-resmim.png';
    link.href = dataUrl;
    link.click();
    playSound('fanfare');
    updateUDAReport('UDA 3', true);
    completeLevel('w3-l3', 3);
    speakText('Tebrikler! Çizdiğin harika resim bilgisayarına kaydedildi.');
    confetti({ particleCount: 80, spread: 80 });
  };

  // Araçlar Eşleştirme Mantığı
  const handleMatchTool = (descId: string) => {
    if (!selectedToolCard) {
      speakText('Lütfen önce soldan bir araç simgesine tıkla!');
      return;
    }

    const tool = toolPairs.find((t) => t.id === selectedToolCard);
    if (!tool) return;

    if (tool.matchId === descId) {
      playSound('success');
      updateUDAReport('UDA 3', true);
      speakText(`Doğru eşleşme! ${tool.name} tam olarak bu görevi yapar.`);
      setToolPairs((prev) =>
        prev.map((t) => (t.id === selectedToolCard ? { ...t, matched: true } : t))
      );
      setSelectedToolCard(null);
      confetti({ particleCount: 40, spread: 60 });

      const allDone = toolPairs.filter((t) => t.id !== tool.id).every((t) => t.matched);
      if (allDone) {
        completeLevel('w3-l2', 3);
        playSound('fanfare');
        speakText('Tebrikler! Arayüz araçlarının görevlerini eksiksiz kavradın.');
      }
    } else {
      playSound('encourage');
      updateUDAReport('UDA 3', false);
      speakText('Neredeyse oluyordu! Bu aracın simgesine ve görevine tekrar dikkat et.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Üst Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-purple-300 shadow-md">
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
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-300">
                MEB UDA 3 • Görsel Düzenleme
              </span>
              <span className="text-xs font-bold text-slate-500">
                Dijital Çizim & Araçlar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Erişilebilir Dijital Tuval 🎨
            </h1>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setActiveSubTab('canvas');
              playSound('click');
              speakText('Dijital Tuval ve Çizim alanı açıldı.');
            }}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'canvas'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            1. Çizim Tuvali
          </button>
          <button
            onClick={() => {
              setActiveSubTab('toolsMatch');
              playSound('click');
              speakText('Arayüz Araçları eşleştirme oyunu açıldı.');
            }}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'toolsMatch'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            2. Araç Simgeleri Eşleştir
          </button>
        </div>
      </div>

      {/* 1. SEKME: DİJİTAL ÇİZİM TUVALİ */}
      {activeSubTab === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sol Araç Çubuğu: Renkler, Fırça Boyutları, Damgalar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border-4 border-purple-200 shadow-md space-y-5">
            {/* Araç Seçimi: Fırça / Silgi / Damga */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Paintbrush className="w-4 h-4 text-purple-600" />
                <span>Çizim Aracı</span>
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setSelectedTool('brush');
                    playSound('click');
                    speakText('Fırça seçildi.');
                  }}
                  onMouseEnter={() => speakHover('Fırça aracı')}
                  className={`min-h-[48px] p-2 rounded-2xl border-2 flex items-center justify-center gap-1 text-xs font-black transition-all ${
                    selectedTool === 'brush'
                      ? 'bg-purple-600 border-purple-700 text-white shadow-md'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <Paintbrush className="w-4 h-4" />
                  <span>Fırça</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedTool('eraser');
                    playSound('click');
                    speakText('Silgi seçildi.');
                  }}
                  onMouseEnter={() => speakHover('Silgi aracı')}
                  className={`min-h-[48px] p-2 rounded-2xl border-2 flex items-center justify-center gap-1 text-xs font-black transition-all ${
                    selectedTool === 'eraser'
                      ? 'bg-purple-600 border-purple-700 text-white shadow-md'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <Eraser className="w-4 h-4" />
                  <span>Silgi</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedTool('stamp');
                    playSound('click');
                    speakText('Damga ve hazır şekil aracı seçildi.');
                  }}
                  onMouseEnter={() => speakHover('Damga ve şekil aracı')}
                  className={`min-h-[48px] p-2 rounded-2xl border-2 flex items-center justify-center gap-1 text-xs font-black transition-all ${
                    selectedTool === 'stamp'
                      ? 'bg-purple-600 border-purple-700 text-white shadow-md'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <Stamp className="w-4 h-4" />
                  <span>Damga</span>
                </button>
              </div>
            </div>

            {/* Sesli Renk Paleti */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-600" />
                <span>Sesli Renk Paleti (Dokun)</span>
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {COLORS.map((col) => {
                  const isSelected = currentColor === col.hex && selectedTool !== 'eraser';
                  return (
                    <button
                      key={col.name}
                      onClick={() => {
                        setCurrentColor(col.hex);
                        if (selectedTool === 'eraser') setSelectedTool('brush');
                        playSound('click');
                        speakText(`${col.name} rengi seçildi!`);
                      }}
                      onMouseEnter={() => speakHover(`${col.name} rengi`)}
                      style={{ backgroundColor: col.hex }}
                      className={`h-11 rounded-2xl border-3 shadow transition-transform ${
                        isSelected
                          ? 'ring-4 ring-purple-400 scale-110 border-white'
                          : 'border-white/80 hover:scale-105'
                      }`}
                      title={col.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Fırça Boyutları (Özel Eğitim İçin Dev Boyutlar) */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Fırça / Çizgi Kalınlığı
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BRUSH_SIZES.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setBrushSize(b.size);
                      playSound('click');
                      speakText(`${b.name} fırça kalınlığı ayarlandı.`);
                    }}
                    className={`min-h-[44px] p-2 rounded-2xl border-2 text-xs font-black flex items-center justify-center transition-all ${
                      brushSize === b.size
                        ? 'bg-purple-100 border-purple-500 text-purple-950 ring-2 ring-purple-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Hazır Damgalar */}
            {selectedTool === 'stamp' && (
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <span className="text-xs font-bold text-purple-900 block">
                  Basılacak Damgayı Seç:
                </span>
                <div className="flex gap-2 justify-center">
                  {STAMPS.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => {
                        setActiveStamp(s.emoji);
                        playSound('pop');
                        speakText(`${s.name} damgası seçildi. Tuvale dokunup basabilirsin.`);
                      }}
                      className={`text-2xl p-2 rounded-xl transition-all ${
                        activeStamp === s.emoji
                          ? 'bg-white shadow-md ring-2 ring-purple-400 scale-110'
                          : 'bg-purple-100/60 hover:bg-white'
                      }`}
                      title={s.name}
                    >
                      {s.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Temizle ve Kaydet Butonları */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleClear}
                onMouseEnter={() => speakHover('Tuvali temizle ve sıfırla')}
                className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-1.5 border border-slate-300"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Temizle</span>
              </button>

              <button
                onClick={handleDownload}
                onMouseEnter={() => speakHover('Çizdiğin resmi bilgisayara indir')}
                className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200"
              >
                <Download className="w-4 h-4" />
                <span>Resmi Kaydet 💾</span>
              </button>
            </div>
          </div>

          {/* Sağ Alan: Dokunmatik Çizim Tuvali */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border-4 border-purple-300 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 pb-1">
              <span className="flex items-center gap-1.5 text-purple-900 font-black">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Çizim Alanı (Dokun veya Sürükle)
              </span>
              <span>Çizim Hamlesi: {strokeCount}</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden border-4 border-slate-200 shadow-inner bg-white">
              <canvas
                ref={canvasRef}
                width={700}
                height={460}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[440px] touch-none cursor-crosshair bg-white"
              />
            </div>

            <p className="text-xs text-slate-500 italic text-center">
              💡 Özel Eğitim Desteği: Büyük fırçalar el koordinasyonunu geliştirir. Damgalara dokunarak tuvalin istediğiniz yerine nesne ekleyebilirsiniz.
            </p>
          </div>
        </div>
      )}

      {/* 2. SEKME: ARAYÜZ SİMGELERİ EŞLEŞTİR */}
      {activeSubTab === 'toolsMatch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sol Araç Simgeleri */}
          <div className="bg-white rounded-3xl p-6 border-4 border-purple-200 shadow-lg space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b pb-3">
              <Layers className="w-6 h-6 text-purple-600" />
              <span>Görsel Düzenleme Araçları (Simgeler)</span>
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {toolPairs.map((t) => {
                const isSelected = selectedToolCard === t.id;
                return (
                  <button
                    key={t.id}
                    disabled={t.matched}
                    onClick={() => {
                      setSelectedToolCard(t.id);
                      playSound('click');
                      speakText(`${t.name} seçildi. Şimdi bunun görevini sağdan seç!`);
                    }}
                    onMouseEnter={() => speakHover(`${t.name}. Görevini eşleştirmek için tıkla.`)}
                    className={`min-h-[72px] p-4 rounded-2xl border-4 flex items-center justify-between text-left transition-all ${
                      t.matched
                        ? 'border-emerald-300 bg-emerald-50 opacity-60 cursor-default'
                        : isSelected
                        ? 'border-purple-600 bg-purple-100 ring-4 ring-purple-200 scale-[1.02]'
                        : 'border-slate-200 bg-slate-50 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{t.icon}</span>
                      <span className="text-base font-black text-slate-900">{t.name}</span>
                    </div>
                    {t.matched ? (
                      <span className="text-xs font-bold text-emerald-700">✓ Eşleşti</span>
                    ) : (
                      <span className="text-xs font-bold text-purple-700 bg-white px-2.5 py-1 rounded-xl border border-purple-200">
                        {isSelected ? '✓ Seçildi' : 'Seç'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sağ Açıklamalar */}
          <div className="bg-white rounded-3xl p-6 border-4 border-indigo-200 shadow-lg space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b pb-3">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span>Araçların Görevleri (Ne İşe Yarar?)</span>
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {toolDescriptions.map((desc) => {
                return (
                  <button
                    key={desc.id}
                    onClick={() => handleMatchTool(desc.id)}
                    className="min-h-[72px] p-4 rounded-2xl border-4 border-slate-200 bg-slate-50 hover:bg-indigo-50/70 hover:border-indigo-400 text-left transition-all flex items-center justify-between"
                  >
                    <p className="text-xs sm:text-sm font-bold text-slate-800 pr-2">
                      {desc.desc}
                    </p>
                    <span className="text-xs font-black text-indigo-700 bg-white px-2.5 py-1 rounded-xl border border-indigo-200 shrink-0">
                      Eşleştir
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Alt Navigasyon */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={() => {
            setScreen('map');
            playSound('click');
          }}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-sm"
        >
          Haritaya Dön
        </button>

        <button
          onClick={() => {
            setScreen('game-network-builder');
            playSound('click');
            speakText('4. Modül: Bilgisayar Ağları ve İnternet etkinliğine geçiliyor!');
          }}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-purple-300"
        >
          <span>Sonraki: Ağ Kurma (UDA 4)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
