import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Mic, MicOff, Volume2, HelpCircle } from 'lucide-react';
import { speech } from '../utils/speech';

export const VoiceCommandOverlay: React.FC = () => {
  const {
    inputMode,
    setScreen,
    screen,
    speakText,
    setIsTeacherModalOpen,
    playSound,
  } = useGame();

  const [lastRecognized, setLastRecognized] = useState<string>('');
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  useEffect(() => {
    if (inputMode !== 'voice') {
      speech.stopListening();
      return;
    }

    speech.initSpeechRecognition((cmd: string) => {
      handleVoiceCommand(cmd);
    });

    if (isMicOn) {
      speech.startListening();
    }

    return () => {
      speech.stopListening();
    };
  }, [inputMode, isMicOn, screen]);

  const handleVoiceCommand = (rawCmd: string) => {
    const cmd = rawCmd.toLowerCase();
    setLastRecognized(cmd);
    playSound('pop');

    // Global komutlar
    if (cmd.includes('harita') || cmd.includes('ana sayfa') || cmd.includes('geri')) {
      speakText('Haritaya dönülüyor.');
      setScreen('map');
      return;
    }

    if (cmd.includes('başla') || cmd.includes('başlat')) {
      if (screen === 'onboarding') {
        speakText('Macera haritasına geçiliyor!');
        setScreen('map');
      }
      return;
    }

    if (cmd.includes('öğretmen') || cmd.includes('rapor') || cmd.includes('panel')) {
      speakText('Öğretmen paneli açılıyor.');
      setIsTeacherModalOpen(true);
      return;
    }

    if (cmd.includes('yardım') || cmd.includes('ne yapmalıyım')) {
      if (screen === 'game-hardware') {
        speakText('Donanım parçalarını ekranın sağındaki doğru kutulara yerleştirin.');
      } else if (screen === 'game-time-machine') {
        speakText('Eski bir teknolojiye tıkla, sonra modern karşılığıyla eşleştir.');
      } else if (screen === 'game-input-output') {
        speakText('Donanım parçasına dokunup Girdi veya Çıktı sepetine gönderin.');
      } else if (screen === 'game-digital-canvas') {
        speakText('Fırçayı seçip tuval üzerine dokunarak resim çizebilirsiniz.');
      } else if (screen === 'game-network-builder') {
        speakText('Cihazlara dokunarak modeme Wi-Fi ile bağlayın.');
      } else if (screen === 'game-keyboard') {
        speakText('Uçan harf balonuna basmak için o harfi söyleyin veya klavyeden basın.');
      } else {
        speakText('Gitmek istediğin yeri söyle: Harita, Oyun, Başla veya Öğretmen diyebilirsin.');
      }
      return;
    }

    // Oyunlara özel komutlar için özel bir event veya global dispatch
    const voiceEvent = new CustomEvent('app-voice-command', { detail: cmd });
    window.dispatchEvent(voiceEvent);
  };

  const simulateCommand = (cmd: string) => {
    handleVoiceCommand(cmd);
  };

  if (inputMode !== 'voice') return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 select-none">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 shadow-2xl border-2 border-indigo-400 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          {/* Sol: Mikrofon Durumu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = !isMicOn;
                setIsMicOn(next);
                if (next) {
                  speech.startListening();
                  speakText('Mikrofon açıldı.');
                } else {
                  speech.stopListening();
                  speakText('Mikrofon duraklatıldı.');
                }
              }}
              className={`p-3 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                isMicOn
                  ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-400/40'
                  : 'bg-slate-700 text-slate-300'
              }`}
              title="Mikrofonu Aç/Kapat"
            >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Sesli Komut Modu
                </span>
                {isMicOn && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Dinleniyor...
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                {lastRecognized ? (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Algılanan: <span className="text-amber-300 underline font-bold">"{lastRecognized}"</span></span>
                  </>
                ) : (
                  'Bir komut söyleyin: "Harita", "Başla", "Yardım"...'
                )}
              </p>
            </div>
          </div>

          {/* Sağ: İpuçları Butonu */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2.5 rounded-xl bg-indigo-800/60 hover:bg-indigo-700 text-indigo-200 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Komutlar</span>
          </button>
        </div>

        {/* Hızlı Simülasyon Butonları */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium text-[11px]">Hızlı Ses Testi:</span>
          {screen === 'onboarding' && (
            <button
              onClick={() => simulateCommand('başla')}
              className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-white font-semibold transition-colors shrink-0"
            >
              🗣️ "Başla"
            </button>
          )}
          {screen === 'game-hardware' && (
            <>
              <button
                onClick={() => simulateCommand('monitör')}
                className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Monitör"
              </button>
              <button
                onClick={() => simulateCommand('kasa')}
                className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Kasa"
              </button>
            </>
          )}
          {screen === 'game-input-output' && (
            <>
              <button
                onClick={() => simulateCommand('mikrofon')}
                className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Mikrofon"
              </button>
              <button
                onClick={() => simulateCommand('girdi')}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Girdi"
              </button>
              <button
                onClick={() => simulateCommand('çıktı')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Çıktı"
              </button>
            </>
          )}
          {screen === 'game-time-machine' && (
            <>
              <button
                onClick={() => simulateCommand('telefon')}
                className="px-2.5 py-1 bg-amber-700 hover:bg-amber-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Telefon"
              </button>
              <button
                onClick={() => simulateCommand('okul')}
                className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Okul"
              </button>
            </>
          )}
          {screen === 'game-digital-canvas' && (
            <>
              <button
                onClick={() => simulateCommand('fırça')}
                className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Fırça"
              </button>
              <button
                onClick={() => simulateCommand('silgi')}
                className="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Silgi"
              </button>
            </>
          )}
          {screen === 'game-network-builder' && (
            <>
              <button
                onClick={() => simulateCommand('bilgisayar')}
                className="px-2.5 py-1 bg-sky-700 hover:bg-sky-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Bilgisayar"
              </button>
              <button
                onClick={() => simulateCommand('tablet')}
                className="px-2.5 py-1 bg-sky-700 hover:bg-sky-600 rounded-lg text-white font-semibold transition-colors shrink-0"
              >
                🗣️ "Tablet"
              </button>
            </>
          )}
          <button
            onClick={() => simulateCommand('harita')}
            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors shrink-0"
          >
            🗣️ "Harita"
          </button>
          <button
            onClick={() => simulateCommand('öğretmen')}
            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-semibold transition-colors shrink-0"
          >
            🗣️ "Öğretmen"
          </button>
        </div>

        {/* Yardım Kutusu */}
        {showHelp && (
          <div className="mt-2 pt-2 border-t border-indigo-800 text-xs text-indigo-200 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>• <strong className="text-white">"Harita":</strong> Yol haritasına döner.</div>
            <div>• <strong className="text-white">"Başla":</strong> Macerayı başlatır.</div>
            <div>• <strong className="text-white">"Öğretmen":</strong> İlerleme panelini açar.</div>
            <div>• <strong className="text-white">"Girdi / Çıktı":</strong> Donanımı ayırır.</div>
            <div>• <strong className="text-white">"Fırça / Silgi":</strong> Çizim aracını değiştirir.</div>
            <div>• <strong className="text-white">"Bağla":</strong> Wi-Fi ağına bağlar.</div>
          </div>
        )}
      </div>
    </div>
  );
};
