import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  ArrowRight,
  LogIn,
  LogOut,
  HelpCircle,
} from 'lucide-react';

interface DeviceItem {
  id: string;
  name: string;
  category: 'input' | 'output';
  emoji: string;
  explanation: string;
  matched: boolean;
}

export const InputOutputGame: React.FC = () => {
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

  const [devices, setDevices] = useState<DeviceItem[]>([
    {
      id: 'mic',
      name: 'Mikrofon',
      category: 'input',
      emoji: '🎙️',
      explanation: 'Sesimizi bilgisayarın içine aktardığı için GİRDİ birimidir.',
      matched: false,
    },
    {
      id: 'cam',
      name: 'Web Kamerası',
      category: 'input',
      emoji: '📷',
      explanation: 'Görüntümüzü bilgisayara gönderdiği için GİRDİ birimidir.',
      matched: false,
    },
    {
      id: 'keyboard',
      name: 'Klavye',
      category: 'input',
      emoji: '⌨️',
      explanation: 'Tuşlara basarak bilgisayara yazı ve komut girdiğimiz için GİRDİ birimidir.',
      matched: false,
    },
    {
      id: 'speaker',
      name: 'Hoparlör',
      category: 'output',
      emoji: '🔊',
      explanation: 'Bilgisayardaki ses ve müzikleri bize duyurduğu için ÇIKTI birimidir.',
      matched: false,
    },
    {
      id: 'screen',
      name: 'Monitör (Ekran)',
      category: 'output',
      emoji: '🖥️',
      explanation: 'Bilgisayardaki görüntüleri bize gösterdiği için ÇIKTI birimidir.',
      matched: false,
    },
    {
      id: 'printer',
      name: 'Yazıcı (Printer)',
      category: 'output',
      emoji: '🖨️',
      explanation: 'Yazı ve fotoğrafları kağıda basıp dışarı verdiği için ÇIKTI birimidir.',
      matched: false,
    },
  ]);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sesli Komut Dinleme
  useEffect(() => {
    const handleVoice = (e: any) => {
      const cmd = (e.detail as string).toLowerCase();
      devices.forEach((dev) => {
        if (!dev.matched && cmd.includes(dev.name.toLowerCase())) {
          setSelectedDeviceId(dev.id);
          speakText(`${dev.name} seçildi. Şimdi Girdi veya Çıktı deyin!`);
        }
      });

      if (cmd.includes('girdi')) {
        handleSort('input');
      } else if (cmd.includes('çıktı') || cmd.includes('cikti')) {
        handleSort('output');
      }
    };

    window.addEventListener('app-voice-command', handleVoice);
    return () => window.removeEventListener('app-voice-command', handleVoice);
  }, [devices, selectedDeviceId]);

  const handleSort = (targetCategory: 'input' | 'output') => {
    if (!selectedDeviceId) {
      speakText('Lütfen önce sınıflandırmak istediğin bir donanıma tıkla!');
      return;
    }

    const device = devices.find((d) => d.id === selectedDeviceId);
    if (!device) return;

    if (device.category === targetCategory) {
      playSound('success');
      recordMove(true);
      updateUDAReport('UDA 2', true);
      const categoryName = targetCategory === 'input' ? 'GİRDİ (İçeri Veri)' : 'ÇIKTI (Dışarı Sonuç)';
      const msg = `Harika! ${device.name} bir ${categoryName} birimidir. ${device.explanation}`;
      setFeedback(msg);
      speakText(msg);

      setDevices((prev) =>
        prev.map((d) => (d.id === selectedDeviceId ? { ...d, matched: true } : d))
      );
      setSelectedDeviceId(null);

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

      const allDone = devices.filter((d) => d.id !== device.id).every((d) => d.matched);
      if (allDone) {
        completeLevel('w2-l2', 3);
        playSound('fanfare');
        speakText('Tebrikler! Tüm donanım birimlerini doğru sepetlere yerleştirdin. UDA 2 başarıyla tamamlandı!');
      }
    } else {
      triggerEncouragement();
      recordMove(false);
      updateUDAReport('UDA 2', false);
      const hint =
        targetCategory === 'input'
          ? `${device.name} bilgisayara bilgi mi aktarır yoksa dışarıya mı verir? Tekrar dene!`
          : `${device.name} bize sonuç mu gösterir yoksa içine mi alır? Tekrar dene!`;
      setFeedback(hint);
      speakText(`Neredeyse oluyordu! ${hint}`);
    }
  };

  const handleReset = () => {
    playSound('click');
    setDevices((prev) => prev.map((d) => ({ ...d, matched: false })));
    setSelectedDeviceId(null);
    setFeedback(null);
    speakText('Oyun yeniden başlatıldı. Donanımları sepetlere ayıralım.');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Üst Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-emerald-300 shadow-md">
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
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                MEB UDA 2 • Bilgisayar Sistemleri
              </span>
              <span className="text-xs font-bold text-slate-500">
                Girdi & Çıktı Birimleri
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Girdi mi, Çıktı mı? 📥📤
            </h1>
          </div>
        </div>

        <button
          onClick={handleReset}
          onMouseEnter={() => speakHover('Oyunu baştan başlat')}
          className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-2 transition-all border border-slate-300"
        >
          <RotateCcw className="w-5 h-5 text-emerald-600" />
          <span>Yeniden Başlat</span>
        </button>
      </div>

      {/* Yönerge & Canlı İpucu */}
      <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-3xl flex items-center justify-between text-sm font-bold text-emerald-950">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            {feedback ||
              '💡 Yönerge: Yukarıdaki bir donanıma dokun, ardından "GİRDİ BİRİMİ" mi yoksa "ÇIKTI BİRİMİ" mi olduğuna karar verip aşağıdaki sepete tıkla!'}
          </span>
        </div>
        <button
          onClick={() =>
            speakText(
              feedback ||
                'Yukarıdaki bir donanıma dokun, ardından Girdi Birimi mi yoksa Çıktı Birimi mi olduğuna karar verip aşağıdaki sepete tıkla!'
            )
          }
          className="p-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-200 shrink-0 text-emerald-800"
          title="Yönergeyi Dinle"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Sınıflandırılacak Donanım Parçaları */}
      <div className="bg-white rounded-3xl p-6 border-4 border-slate-200 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Sınıflandırılacak Donanım Kartları</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {devices.filter((d) => d.matched).length} / {devices.length} Eşleşti
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {devices.map((dev) => {
            const isSelected = selectedDeviceId === dev.id;
            if (dev.matched) {
              return (
                <div
                  key={dev.id}
                  className="min-h-[110px] p-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center text-center opacity-50"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs font-black text-emerald-900">{dev.name}</span>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase mt-0.5">
                    {dev.category === 'input' ? 'Girdi ✓' : 'Çıktı ✓'}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={dev.id}
                onClick={() => {
                  setSelectedDeviceId(dev.id);
                  playSound('click');
                  speakText(`${dev.name} seçildi. Bu cihaz bilgisayara Girdi mi, yoksa Çıktı mı? Aşağıdan seç!`);
                }}
                onMouseEnter={() =>
                  speakHover(`${dev.name}. Seçmek için tıkla. Girdi mi çıktı mı karar ver.`)
                }
                className={`min-h-[120px] p-4 rounded-3xl border-4 flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-100 ring-4 ring-indigo-200 scale-105 shadow-xl'
                    : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40 shadow'
                }`}
              >
                <span className="text-4xl mb-1">{dev.emoji}</span>
                <span className="text-sm font-black text-slate-900">{dev.name}</span>
                <span className="mt-2 text-[10px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
                  {isSelected ? '✓ Seçildi' : 'Seç'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 Büyük Hedef Sepeti: GİRDİ BİRİMLERİ ve ÇIKTI BİRİMLERİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. GİRDİ BİRİMLERİ SEPETİ */}
        <div
          onClick={() => handleSort('input')}
          onMouseEnter={() =>
            speakHover(
              'Girdi Birimleri Sepeti. Bilgisayarın içine bilgi, ses veya görüntü gönderen parçaları buraya yerleştirin.'
            )
          }
          role="button"
          tabIndex={0}
          className="min-h-[220px] p-6 rounded-3xl border-4 border-sky-400 bg-gradient-to-b from-sky-50 to-white hover:border-sky-600 hover:shadow-2xl transition-all flex flex-col items-center justify-between text-center cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <LogIn className="w-9 h-9" />
          </div>

          <div className="my-3">
            <h3 className="text-2xl font-black text-sky-950 font-heading">
              GİRDİ BİRİMLERİ (INPUT)
            </h3>
            <p className="text-xs text-sky-700 font-bold max-w-sm mx-auto mt-1">
              Bilgisayara dışarıdan veri, ses, yazı ve komut aktaran araçlar (Klavye, Fare, Mikrofon, Kamera).
            </p>
          </div>

          <span className="px-5 py-2.5 rounded-2xl bg-sky-500 text-white font-black text-sm shadow-md group-hover:bg-sky-600 transition-colors">
            📥 Buraya Bırak / Dokun (Girdi)
          </span>
        </div>

        {/* 2. ÇIKTI BİRİMLERİ SEPETİ */}
        <div
          onClick={() => handleSort('output')}
          onMouseEnter={() =>
            speakHover(
              'Çıktı Birimleri Sepeti. Bilgisayardan dışarıya görüntü, ses veya kağıt çıktısı veren parçaları buraya yerleştirin.'
            )
          }
          role="button"
          tabIndex={0}
          className="min-h-[220px] p-6 rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-amber-50 to-white hover:border-amber-600 hover:shadow-2xl transition-all flex flex-col items-center justify-between text-center cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <LogOut className="w-9 h-9" />
          </div>

          <div className="my-3">
            <h3 className="text-2xl font-black text-amber-950 font-heading">
              ÇIKTI BİRİMLERİ (OUTPUT)
            </h3>
            <p className="text-xs text-amber-800 font-bold max-w-sm mx-auto mt-1">
              Bilgisayardaki sonuçları bize gösteren, seslendiren veya yazdıran araçlar (Ekran, Hoparlör, Yazıcı).
            </p>
          </div>

          <span className="px-5 py-2.5 rounded-2xl bg-amber-500 text-white font-black text-sm shadow-md group-hover:bg-amber-600 transition-colors">
            📤 Buraya Bırak / Dokun (Çıktı)
          </span>
        </div>
      </div>

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
            setScreen('game-digital-canvas');
            playSound('click');
            speakText('3. Modül: Görsel Düzenleme ve Dijital Çizim etkinliğine geçiliyor!');
          }}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-300"
        >
          <span>Sonraki: Dijital Çizim (UDA 3)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
