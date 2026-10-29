import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  Building2,
  ArrowRight,
  Hourglass,
} from 'lucide-react';

interface TechPair {
  id: string;
  oldName: string;
  oldEmoji: string;
  oldDesc: string;
  newName: string;
  newEmoji: string;
  newDesc: string;
  matched: boolean;
}

interface AreaItem {
  id: string;
  name: string;
  emoji: string;
  area: 'okul' | 'hastane' | 'banka';
  desc: string;
  matched: boolean;
}

export const TimeMachineGame: React.FC = () => {
  const {
    setScreen,
    playSound,
    speakText,
    speakHover,
    triggerEncouragement,
    recordMove,
    completeLevel,
    updateUDAReport,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'timemachine' | 'areabaskets'>('timemachine');

  // Zaman Makinesi Eşleştirmeleri
  const [techPairs, setTechPairs] = useState<TechPair[]>([
    {
      id: 'tel',
      oldName: 'Çevirmeli Telefon',
      oldEmoji: '☎️',
      oldDesc: 'Eski zamanlarda evlerde sabit duran çevirmeli telefon.',
      newName: 'Akıllı Telefon',
      newEmoji: '📱',
      newDesc: 'Günümüzde cepte taşınan, görüntülü ve internetli telefon.',
      matched: false,
    },
    {
      id: 'daktilo',
      oldName: 'Mekanik Daktilo',
      oldEmoji: '📠',
      oldDesc: 'Kağıda mürekkeple harf basan eski daktilo.',
      newName: 'Bilgisayar Klavyesi',
      newEmoji: '⌨️',
      newDesc: 'Hızlıca ekrana yazı yazmamızı sağlayan modern klavye.',
      matched: false,
    },
    {
      id: 'tuplu',
      oldName: 'Tüplü Ağır Monitör',
      oldEmoji: '📺',
      oldDesc: 'Arkası kocaman, ağır ve elektrik harcayan tüplü ekran.',
      newName: 'İnce LCD Monitör',
      newEmoji: '🖥️',
      newDesc: 'Hafif, net renkler sunan ince bilgisayar ekranı.',
      matched: false,
    },
    {
      id: 'mektup',
      oldName: 'Posta & Mektup',
      oldEmoji: '✉️',
      oldDesc: 'Günler süren kağıt mektup haberleşmesi.',
      newName: 'E-Posta & İnternet',
      newEmoji: '📧',
      newDesc: 'Bir saniyede dünyanın öbür ucuna ulaşan elektronik posta.',
      matched: false,
    },
  ]);

  const [selectedOldId, setSelectedOldId] = useState<string | null>(null);

  // Kullanım Alanı Sepeti
  const [areaItems, setAreaItems] = useState<AreaItem[]>([
    { id: 'a1', name: 'Akıllı Etkileşimli Tahta', emoji: '🧑‍🏫', area: 'okul', desc: 'Derslerimizi işlediğimiz büyük dokunmatik tahta.', matched: false },
    { id: 'a2', name: 'Röntgen ve Tomografi', emoji: '🩻', area: 'hastane', desc: 'Kemiklerimizi ve sağlığımızı kontrol eden tıbbi cihaz.', matched: false },
    { id: 'a3', name: 'ATM Para Çekme Makinesi', emoji: '🏧', area: 'banka', desc: 'Para çekip yatırdığımız bankamatik cihazı.', matched: false },
    { id: 'a4', name: 'Öğrenci Eğitim Tableti', emoji: '📋', area: 'okul', desc: 'Kitap okuyup test çözdüğümüz okul tableti.', matched: false },
    { id: 'a5', name: 'Dijital Kalp & Nabız Monitörü', emoji: '💓', area: 'hastane', desc: 'Hastaların kalp atışlarını izleyen monitör.', matched: false },
    { id: 'a6', name: 'Para Sayma Makinesi', emoji: '💵', area: 'banka', desc: 'Bankada paraları şipşak sayan teknoloji.', matched: false },
  ]);

  const [selectedAreaItemId, setSelectedAreaItemId] = useState<string | null>(null);

  // Zaman Makinesi Eşleşmesi
  const handleMatchTech = (newId: string) => {
    if (!selectedOldId) {
      speakText('Önce sol taraftaki eski teknolojilerden birine tıkla!');
      return;
    }

    if (selectedOldId === newId) {
      playSound('success');
      recordMove(true);
      updateUDAReport('UDA 1', true);
      const matchedItem = techPairs.find((p) => p.id === newId);
      const msg = `Harika! ${matchedItem?.oldName} günümüzde ${matchedItem?.newName} oldu!`;
      speakText(msg);

      setTechPairs((prev) =>
        prev.map((p) => (p.id === newId ? { ...p, matched: true } : p))
      );
      setSelectedOldId(null);

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      const allDone = techPairs.filter((p) => p.id !== newId).every((p) => p.matched);
      if (allDone) {
        completeLevel('w1-l1', 3);
        playSound('fanfare');
        speakText('Tebrikler! Zaman makinesi eşleştirmesini tamamladın. UDA 1 kazanımı başarıyla pekişti!');
      }
    } else {
      triggerEncouragement();
      recordMove(false);
      updateUDAReport('UDA 1', false);
      speakText('Neredeyse oluyordu! Birbiriyle aynı işi yapan eski ve yeni eşleşmeye dikkat et.');
    }
  };

  // Alan Sepeti Eşleşmesi
  const handleSortArea = (targetArea: 'okul' | 'hastane' | 'banka') => {
    if (!selectedAreaItemId) {
      speakText('Önce yukarıdan bir teknoloji seç, sonra gideceği kuruma tıkla!');
      return;
    }

    const item = areaItems.find((i) => i.id === selectedAreaItemId);
    if (!item) return;

    if (item.area === targetArea) {
      playSound('success');
      recordMove(true);
      updateUDAReport('UDA 1', true);
      const areaName = targetArea === 'okul' ? 'Okul' : targetArea === 'hastane' ? 'Hastane' : 'Banka';
      speakText(`Doğru! ${item.name} bir ${areaName} teknolojisidir.`);

      setAreaItems((prev) =>
        prev.map((i) => (i.id === selectedAreaItemId ? { ...i, matched: true } : i))
      );
      setSelectedAreaItemId(null);

      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });

      const allDone = areaItems.filter((i) => i.id !== item.id).every((i) => i.matched);
      if (allDone) {
        completeLevel('w1-l2', 3);
        playSound('fanfare');
        speakText('Harika! Tüm teknolojileri kullanım alanlarına doğru ayırdın!');
      }
    } else {
      triggerEncouragement();
      recordMove(false);
      updateUDAReport('UDA 1', false);
      speakText('Bu teknoloji oraya ait değil gibi. Nerede kullanıldığını tekrar düşünelim!');
    }
  };

  const handleReset = () => {
    playSound('click');
    setTechPairs((prev) => prev.map((p) => ({ ...p, matched: false })));
    setAreaItems((prev) => prev.map((i) => ({ ...i, matched: false })));
    setSelectedOldId(null);
    setSelectedAreaItemId(null);
    speakText('Etkinlik yeniden başlatıldı.');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Üst Bilgi Barı */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-amber-300 shadow-md">
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
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                MEB UDA 1 • Bilişim ve Değişim
              </span>
              <span className="text-xs font-bold text-slate-500">
                Geçmişten Günümüze & Alanlar
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Zaman Makinesi ve Kullanım Alanları ⏳
            </h1>
          </div>
        </div>

        {/* Sekmeler & Yeniden Başlat */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('timemachine');
                playSound('click');
                speakText('Zaman Makinesi eşleştirme oyunu seçildi.');
              }}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'timemachine'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              1. Zaman Makinesi
            </button>
            <button
              onClick={() => {
                setActiveTab('areabaskets');
                playSound('click');
                speakText('Kullanım Alanı Sepeti oyunu seçildi.');
              }}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                activeTab === 'areabaskets'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              2. Kullanım Alanları
            </button>
          </div>

          <button
            onClick={handleReset}
            onMouseEnter={() => speakHover('Etkinliği sıfırla')}
            className="min-h-[48px] p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300"
            title="Yeniden Başlat"
          >
            <RotateCcw className="w-5 h-5 text-amber-700" />
          </button>
        </div>
      </div>

      {/* Yönerge Kutusu */}
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-3xl flex items-center justify-between text-sm font-bold text-amber-950">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            {activeTab === 'timemachine'
              ? '💡 Yönerge: Sol taraftan eski bir teknolojiye tıkla, sonra sağ taraftaki modern karşılığıyla eşleştir!'
              : '💡 Yönerge: Yukarıdaki teknolojiyi seç, ardından kullanıldığı kuruma (Hastane, Okul veya Banka) tıkla!'}
          </span>
        </div>
        <button
          onClick={() =>
            speakText(
              activeTab === 'timemachine'
                ? 'Sol taraftan eski bir teknolojiye tıkla, sonra sağ taraftaki modern karşılığıyla eşleştir!'
                : 'Yukarıdaki teknolojiyi seç, ardından kullanıldığı kuruma tıkla!'
            )
          }
          className="p-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 shrink-0 text-amber-800"
          title="Yönergeyi Dinle"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* 1. SEKME: ZAMAN MAKİNESİ (ESKİ VS YENİ) */}
      {activeTab === 'timemachine' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SOL: Eski Teknolojiler */}
          <div className="bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                <Hourglass className="w-6 h-6 text-amber-600" />
                <span>Geçmişin Teknolojileri (Dün)</span>
              </h2>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                Eski Nesil
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {techPairs.map((p) => {
                const isSelected = selectedOldId === p.id;
                return (
                  <button
                    key={p.id}
                    disabled={p.matched}
                    onClick={() => {
                      setSelectedOldId(p.id);
                      playSound('click');
                      speakText(`${p.oldName} seçildi. Şimdi bunun günümüzdeki yeni halini sağdan seç!`);
                    }}
                    onMouseEnter={() => speakHover(`${p.oldName}. ${p.oldDesc}`)}
                    className={`min-h-[72px] p-4 rounded-2xl border-4 flex items-center justify-between transition-all text-left ${
                      p.matched
                        ? 'border-emerald-300 bg-emerald-50 opacity-60 cursor-default'
                        : isSelected
                        ? 'border-amber-500 bg-amber-100 ring-4 ring-amber-200 scale-[1.02]'
                        : 'border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{p.oldEmoji}</span>
                      <div>
                        <div className="text-base font-black text-slate-900">{p.oldName}</div>
                        <div className="text-xs text-slate-600 line-clamp-1">{p.oldDesc}</div>
                      </div>
                    </div>
                    {p.matched ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-xs font-bold text-amber-800 bg-white px-2.5 py-1 rounded-xl border border-amber-200 shrink-0">
                        {isSelected ? '✓ Seçildi' : 'Seç'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SAĞ: Günümüzün Teknolojileri */}
          <div className="bg-white rounded-3xl p-6 border-4 border-indigo-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <span>Günümüzün Teknolojileri (Bugün)</span>
              </h2>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                Modern Çağ
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {techPairs.map((p) => {
                return (
                  <button
                    key={p.id}
                    disabled={p.matched}
                    onClick={() => handleMatchTech(p.id)}
                    onMouseEnter={() => speakHover(`${p.newName}. ${p.newDesc}`)}
                    className={`min-h-[72px] p-4 rounded-2xl border-4 flex items-center justify-between transition-all text-left ${
                      p.matched
                        ? 'border-emerald-300 bg-emerald-50 opacity-60 cursor-default'
                        : selectedOldId
                        ? 'border-indigo-400 bg-indigo-50/70 hover:bg-indigo-100 cursor-pointer animate-pulse'
                        : 'border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{p.newEmoji}</span>
                      <div>
                        <div className="text-base font-black text-slate-900">{p.newName}</div>
                        <div className="text-xs text-slate-600 line-clamp-1">{p.newDesc}</div>
                      </div>
                    </div>
                    {p.matched ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-xl border border-indigo-200 shrink-0">
                        Eşleştir
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. SEKME: KULLANIM ALANI SEPETİ */}
      {activeTab === 'areabaskets' && (
        <div className="space-y-6">
          {/* Üst: Seçilecek Teknoloji Kartları */}
          <div className="bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-md">
            <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Sınıflandırılacak Teknolojiler (Birine Dokun)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {areaItems.map((item) => {
                const isSelected = selectedAreaItemId === item.id;
                if (item.matched) {
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex items-center gap-2.5 opacity-50"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-black text-emerald-800 line-through">
                        {item.name}
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedAreaItemId(item.id);
                      playSound('click');
                      speakText(`${item.name} seçildi. Şimdi aşağıdaki doğru kuruma tıkla.`);
                    }}
                    onMouseEnter={() => speakHover(`${item.name}. ${item.desc}`)}
                    className={`min-h-[58px] p-3.5 rounded-2xl border-3 flex items-center gap-3 transition-all text-left ${
                      isSelected
                        ? 'border-amber-500 bg-amber-100 ring-4 ring-amber-200 scale-105'
                        : 'border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <div>
                      <div className="text-xs font-black text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-600 line-clamp-1">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alt: 3 Kurum Sepeti (Okul, Hastane, Banka) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* 1. Okul Sepeti */}
            <button
              onClick={() => handleSortArea('okul')}
              onMouseEnter={() => speakHover('Okul sepeti. Eğitim ve öğrenme teknolojilerini buraya bırakın.')}
              className="min-h-[180px] p-6 rounded-3xl border-4 border-indigo-300 bg-gradient-to-b from-indigo-50 to-white hover:border-indigo-500 hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group"
            >
              <span className="text-5xl mb-2 transform group-hover:scale-110 transition-transform">
                🏫
              </span>
              <h3 className="text-xl font-black text-indigo-950">Okul</h3>
              <p className="text-xs text-indigo-700 font-semibold mt-1">
                Eğitim & Öğretim Teknolojileri
              </p>
              <span className="mt-3 text-[11px] font-black text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
                Buraya Bırak / Dokun
              </span>
            </button>

            {/* 2. Hastane Sepeti */}
            <button
              onClick={() => handleSortArea('hastane')}
              onMouseEnter={() => speakHover('Hastane sepeti. Sağlık ve tedavi teknolojilerini buraya bırakın.')}
              className="min-h-[180px] p-6 rounded-3xl border-4 border-rose-300 bg-gradient-to-b from-rose-50 to-white hover:border-rose-500 hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group"
            >
              <span className="text-5xl mb-2 transform group-hover:scale-110 transition-transform">
                🏥
              </span>
              <h3 className="text-xl font-black text-rose-950">Hastane</h3>
              <p className="text-xs text-rose-700 font-semibold mt-1">
                Sağlık & Tıp Teknolojileri
              </p>
              <span className="mt-3 text-[11px] font-black text-rose-900 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                Buraya Bırak / Dokun
              </span>
            </button>

            {/* 3. Banka Sepeti */}
            <button
              onClick={() => handleSortArea('banka')}
              onMouseEnter={() => speakHover('Banka sepeti. Para ve finans teknolojilerini buraya bırakın.')}
              className="min-h-[180px] p-6 rounded-3xl border-4 border-emerald-300 bg-gradient-to-b from-emerald-50 to-white hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group"
            >
              <span className="text-5xl mb-2 transform group-hover:scale-110 transition-transform">
                🏦
              </span>
              <h3 className="text-xl font-black text-emerald-950">Banka</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Finans & Para Teknolojileri
              </p>
              <span className="mt-3 text-[11px] font-black text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                Buraya Bırak / Dokun
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Alt Hızlı Navigasyon */}
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
            setScreen('game-input-output');
            playSound('click');
            speakText('2. Modül: Girdi ve Çıktı birimleri etkinliğine geçiliyor!');
          }}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-300"
        >
          <span>Sonraki: Girdi & Çıktı (UDA 2)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
