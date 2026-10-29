import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  Wifi,
  Globe,
  Radio,
  Lock,
} from 'lucide-react';

interface NetworkDevice {
  id: string;
  name: string;
  type: string;
  emoji: string;
  connected: boolean;
  posStyle: string; // Tailwind positioning
  ipAddress: string;
}

export const NetworkBuilderGame: React.FC = () => {
  const {
    setScreen,
    playSound,
    speakText,
    speakHover,
    completeLevel,
    updateUDAReport,
  } = useGame();

  const [devices, setDevices] = useState<NetworkDevice[]>([
    {
      id: 'pc',
      name: 'Masaüstü PC',
      type: 'Laboratuvar Bilgisayarı',
      emoji: '🖥️',
      connected: false,
      posStyle: 'top-6 left-8 sm:left-16',
      ipAddress: '192.168.1.10',
    },
    {
      id: 'laptop',
      name: 'Dizüstü Bilgisayar',
      type: 'Öğretmen Bilgisayarı',
      emoji: '💻',
      connected: false,
      posStyle: 'top-6 right-8 sm:right-16',
      ipAddress: '192.168.1.11',
    },
    {
      id: 'tablet',
      name: 'Öğrenci Tableti',
      type: 'Eğitim Tableti',
      emoji: '📱',
      connected: false,
      posStyle: 'bottom-8 left-8 sm:left-16',
      ipAddress: '192.168.1.12',
    },
    {
      id: 'phone',
      name: 'Akıllı Telefon',
      type: 'Mobil Cihaz',
      emoji: '🤳',
      connected: false,
      posStyle: 'bottom-8 right-8 sm:right-16',
      ipAddress: '192.168.1.13',
    },
    {
      id: 'printer',
      name: 'Ortak Ağ Yazıcısı',
      type: 'Kablosuz Yazıcı',
      emoji: '🖨️',
      connected: false,
      posStyle: 'bottom-2 left-1/2 -translate-x-1/2',
      ipAddress: '192.168.1.20',
    },
  ]);

  const [isInternetOnline, setIsInternetOnline] = useState<boolean>(false);

  const connectedCount = devices.filter((d) => d.connected).length;

  const handleConnectDevice = (devId: string) => {
    const dev = devices.find((d) => d.id === devId);
    if (!dev || dev.connected) return;

    playSound('success');
    updateUDAReport('UDA 4', true);
    speakText(`${dev.name} modeme bağlandı! Wi-Fi sinyali aktif.`);

    setDevices((prev) =>
      prev.map((d) => (d.id === devId ? { ...d, connected: true } : d))
    );

    confetti({ particleCount: 35, spread: 50 });
  };

  useEffect(() => {
    const allConnected = devices.every((d) => d.connected);
    if (allConnected && !isInternetOnline) {
      setIsInternetOnline(true);
      playSound('fanfare');
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      completeLevel('w4-l1', 3);
      speakText(
        'Tebrikler! Tüm cihazlar modeme bağlandı ve yerel ağ başarıyla kuruldu. İnternet dünyası aktif!'
      );
    }
  }, [devices, isInternetOnline]);

  const handleReset = () => {
    playSound('click');
    setDevices((prev) => prev.map((d) => ({ ...d, connected: false })));
    setIsInternetOnline(false);
    speakText('Ağ oyunu yeniden başlatıldı. Cihazları modeme bağlayalım.');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Üst Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-3xl p-4 sm:p-6 border-4 border-sky-300 shadow-md">
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
              <span className="text-xs font-black uppercase tracking-wider text-sky-900 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-300">
                MEB UDA 4 • Bilgisayar Ağları
              </span>
              <span className="text-xs font-bold text-slate-500">
                Wi-Fi & İnternet Sinyal Takibi
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Ağ Kurma ve Sinyal Takibi 🌐
            </h1>
          </div>
        </div>

        {/* Durum & Yeniden Başlat */}
        <div className="flex items-center gap-3">
          <div className="bg-sky-50 border-2 border-sky-300 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Wifi className="w-5 h-5 text-sky-600 animate-pulse" />
            <span className="text-xs font-black text-sky-950">
              {connectedCount} / {devices.length} Cihaz Bağlı
            </span>
          </div>

          <button
            onClick={handleReset}
            onMouseEnter={() => speakHover('Oyunu baştan başlat')}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-2 border border-slate-300"
          >
            <RotateCcw className="w-5 h-5 text-sky-600" />
            <span>Yeniden Başlat</span>
          </button>
        </div>
      </div>

      {/* Yönerge Kutusu */}
      <div className="bg-sky-50 border-2 border-sky-300 p-4 rounded-3xl flex items-center justify-between text-sm font-bold text-sky-950">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
          <span>
            {isInternetOnline
              ? '🎉 Harika! Tüm cihazlar ağa bağlandı. Artık güvenli bir şekilde internette bilgi arayabilirsiniz!'
              : '💡 Yönerge: Ekrandaki cihazlara (Bilgisayar, Tablet, Telefon, Yazıcı) dokunarak onları merkezdeki modeme bağla!'}
          </span>
        </div>
        <button
          onClick={() =>
            speakText(
              isInternetOnline
                ? 'Tüm cihazlar ağa bağlandı. Artık güvenli bir şekilde internette bilgi arayabilirsiniz!'
                : 'Ekrandaki cihazlara dokunarak onları merkezdeki modeme bağla!'
            )
          }
          className="p-2 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 shrink-0 text-sky-800"
          title="Yönergeyi Dinle"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* İnteraktif Ağ Haritası & Sinyal Diyagramı */}
      <div className="relative w-full h-[520px] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl border-4 border-sky-400 overflow-hidden shadow-2xl p-6 flex items-center justify-center">
        {/* Arka Plan Izgara Çizgileri */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* MERKEZ: Ana Modem / Wi-Fi Router */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 ${
              isInternetOnline
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white ring-8 ring-emerald-300/50 scale-105'
                : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white ring-8 ring-sky-300/40'
            }`}
          >
            {isInternetOnline ? (
              <Globe className="w-14 h-14 animate-spin-slow" />
            ) : (
              <Radio className="w-14 h-14 animate-pulse" />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">
              {isInternetOnline ? 'İNTERNET ÇEVRİMİÇİ' : 'Wİ-Fİ MODEM'}
            </span>
          </div>

          <div className="mt-2 text-center">
            <span className="text-white text-xs font-black bg-slate-800/80 px-3 py-1 rounded-full border border-sky-400/50">
              Merkezi Ağ Dağıtıcısı
            </span>
          </div>
        </div>

        {/* ÇEVREDEKİ CİHAZLAR */}
        {devices.map((dev) => {
          return (
            <div key={dev.id} className={`absolute ${dev.posStyle} z-20`}>
              <button
                onClick={() => handleConnectDevice(dev.id)}
                onMouseEnter={() =>
                  speakHover(
                    `${dev.name}. ${dev.type}. ${
                      dev.connected ? 'Ağa bağlı.' : 'Modeme bağlamak için tıkla.'
                    }`
                  )
                }
                className={`min-w-[140px] p-3 rounded-2xl border-3 flex flex-col items-center text-center transition-all ${
                  dev.connected
                    ? 'border-emerald-400 bg-emerald-950/80 text-emerald-100 ring-4 ring-emerald-400/30 shadow-lg shadow-emerald-500/20'
                    : 'border-slate-500 bg-slate-800/90 text-slate-200 hover:border-sky-400 hover:bg-slate-700/90 cursor-pointer animate-pulse'
                }`}
              >
                <span className="text-4xl mb-1">{dev.emoji}</span>
                <span className="text-xs font-black">{dev.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{dev.ipAddress}</span>

                <div className="mt-2">
                  {dev.connected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500">
                      <CheckCircle2 className="w-3 h-3" /> Bağlandı
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-sky-300 bg-sky-900/60 px-2 py-0.5 rounded-full border border-sky-500">
                      <Wifi className="w-3 h-3" /> Bağla
                    </span>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Güvenli İnternet Kuralları Bilgi Kartı */}
      <div className="bg-white rounded-3xl p-5 border-4 border-slate-200 shadow-md space-y-2">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>MEB Güvenli İnternet ve Ağ Kuralları</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          • İnternete bağlandığımızda şifremizi kimseyle paylaşmamalıyız.
          • Tanımadığımız sitelerden dosya indirmemeli, her zaman öğretmen ve velimizden yardım almalıyız.
          • Kablosuz (Wi-Fi) ağlar bilgiye hızlıca ulaşmamızı sağlar.
        </p>
      </div>

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
            setScreen('map');
            playSound('fanfare');
            speakText('Harika bir öğrenme serüveniydi! Şimdi öğretmen panelinden sonuçlarını görebilirsin.');
          }}
          className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-sky-300"
        >
          <span>Tüm Modülleri Tamamla 🏆</span>
        </button>
      </div>
    </div>
  );
};
