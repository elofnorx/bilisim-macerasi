// Web Speech API (TTS ve Sesli Komut) Yöneticisi

class SpeechManager {
  private isTtsEnabled: boolean = true;
  private trVoice: SpeechSynthesisVoice | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private onCommandCallback: ((command: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.updateVoices();
      }
    }
  }

  private updateVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Türkçe sesi bul
    this.trVoice = voices.find(v => v.lang.startsWith('tr')) || null;
  }

  public setTtsEnabled(enabled: boolean) {
    this.isTtsEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isEnabled(): boolean {
    return this.isTtsEnabled;
  }

  // Metin Seslendirme (TTS)
  public speak(text: string, force: boolean = false) {
    if (!this.isTtsEnabled && !force) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Önceki konuşmayı kes, birikmeyi önle

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.trVoice) {
        utterance.voice = this.trVoice;
      }
      utterance.lang = 'tr-TR';
      // Özel eğitim için tane tane ve anlaşılır konuşma hızı
      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      window.speechSynthesis.speak(utterance);
    } catch {
      // TTS failover silently
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Sesli Komut Algılama (SpeechRecognition)
  public initSpeechRecognition(onCommand: (cmd: string) => void) {
    this.onCommandCallback = onCommand;

    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API bu tarayıcıda desteklenmiyor.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'tr-TR';

      this.recognition.onresult = (event: any) => {
        const lastIndex = event.results.length - 1;
        const transcript = event.results[lastIndex][0].transcript.trim().toLowerCase();
        if (this.onCommandCallback) {
          this.onCommandCallback(transcript);
        }
      };

      this.recognition.onerror = (err: any) => {
        console.warn('Ses tanıma hatası:', err);
      };

      this.recognition.onend = () => {
        // Dinleme devam ediyorsa tekrar başlat
        if (this.isListening) {
          try {
            this.recognition?.start();
          } catch {
            // ignore
          }
        }
      };
    } catch (e) {
      console.warn('SpeechRecognition başlatılamadı:', e);
    }
  }

  public startListening() {
    if (!this.recognition) return;
    this.isListening = true;
    try {
      this.recognition.start();
    } catch {
      // ignore
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speech = new SpeechManager();
