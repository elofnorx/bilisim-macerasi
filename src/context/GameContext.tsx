import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type {
  MascotId,
  Mascot,
  InputMode,
  ThemeMode,
  FontSize,
  ScreenType,
  WorldInfo,
  BadgeItem,
  StudentSession,
} from '../types';
import { MASCOTS, INITIAL_WORLDS, INITIAL_BADGES, INITIAL_UDA_REPORTS } from '../data/initialData';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';

interface GameContextType {
  screen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  mascot: Mascot;
  setMascotId: (id: MascotId) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  isTtsEnabled: boolean;
  setIsTtsEnabled: (enabled: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  worlds: WorldInfo[];
  badges: BadgeItem[];
  studentSession: StudentSession;
  speakText: (text: string, force?: boolean) => void;
  speakHover: (text: string) => void;
  playSound: (type: 'click' | 'success' | 'encourage' | 'pop' | 'fanfare') => void;
  triggerEncouragement: () => void;
  recordMove: (isCorrect: boolean) => void;
  completeLevel: (levelId: string, stars: number) => void;
  unlockBadge: (badgeId: string) => void;
  updateUDAReport: (code: string, isSuccess: boolean) => void;
  isTeacherModalOpen: boolean;
  setIsTeacherModalOpen: (open: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenType>('onboarding');
  const [mascotId, setMascotIdState] = useState<MascotId>('robi');
  const [inputMode, setInputModeState] = useState<InputMode>('touch');
  const [theme, setTheme] = useState<ThemeMode>('normal');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [isTtsEnabled, setIsTtsEnabledState] = useState<boolean>(true);
  const [isSoundEnabled, setIsSoundEnabledState] = useState<boolean>(true);
  const [worlds, setWorlds] = useState<WorldInfo[]>(INITIAL_WORLDS);
  const [badges, setBadges] = useState<BadgeItem[]>(INITIAL_BADGES);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);

  const [studentSession, setStudentSession] = useState<StudentSession>({
    studentName: 'Ahmet (Öğrenci)',
    timeSpentSeconds: 145,
    correctMoves: 18,
    encouragedMoves: 3,
    voiceCommandsUsed: 4,
    gestureMovesUsed: 6,
    gamesFinished: 4,
    badges: INITIAL_BADGES,
    udaReports: INITIAL_UDA_REPORTS,
  });

  const mascot = MASCOTS.find((m) => m.id === mascotId) || MASCOTS[0];

  // Timer for session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setStudentSession((prev) => ({
        ...prev,
        timeSpentSeconds: prev.timeSpentSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update theme class on HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-contrast-yellow', 'theme-contrast-blue');
    if (theme === 'contrast-yellow') {
      root.classList.add('theme-contrast-yellow');
    } else if (theme === 'contrast-blue') {
      root.classList.add('theme-contrast-blue');
    }
  }, [theme]);

  const setIsTtsEnabled = (enabled: boolean) => {
    setIsTtsEnabledState(enabled);
    speech.setTtsEnabled(enabled);
  };

  const setIsSoundEnabled = (enabled: boolean) => {
    setIsSoundEnabledState(enabled);
    sound.setSoundEnabled(enabled);
  };

  const setMascotId = (id: MascotId) => {
    setMascotIdState(id);
    const chosen = MASCOTS.find((m) => m.id === id);
    if (chosen) {
      sound.playClick();
      speech.speak(`${chosen.name} seçildi! ${chosen.greeting}`);
    }
  };

  const setInputMode = (mode: InputMode) => {
    setInputModeState(mode);
    sound.playClick();
    if (mode === 'gesture') {
      speech.speak('El Hareketi ve Kamera Modu açıldı! Sanal imleç ekranınızda.');
      unlockBadge('badge-gesture');
    } else if (mode === 'voice') {
      speech.speak('Sesli Komut Modu açıldı! Mikrofona konuşarak kontrol edebilirsiniz.');
      unlockBadge('badge-voice');
    } else {
      speech.speak('Dokunmatik ve Fare Modu devrede.');
    }
  };

  const speakText = (text: string, force: boolean = false) => {
    speech.speak(text, force);
  };

  // Hover to speak: Debounced slightly to prevent overlapping bursts
  let hoverTimeout: any = null;
  const speakHover = (text: string) => {
    if (!isTtsEnabled) return;
    if (hoverTimeout) clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      speech.speak(text);
    }, 150);
  };

  const playSound = (type: 'click' | 'success' | 'encourage' | 'pop' | 'fanfare') => {
    if (!isSoundEnabled) return;
    switch (type) {
      case 'click':
        sound.playClick();
        break;
      case 'success':
        sound.playSuccess();
        break;
      case 'encourage':
        sound.playEncouragement();
        break;
      case 'pop':
        sound.playBubblePop();
        break;
      case 'fanfare':
        sound.playFanfare();
        break;
    }
  };

  // Teşvik edici geri bildirim (Cezasız pedagoji)
  const triggerEncouragement = () => {
    playSound('encourage');
    const randomMsg =
      mascot.encouragement[Math.floor(Math.random() * mascot.encouragement.length)];
    speakText(randomMsg, true);
    setStudentSession((prev) => ({
      ...prev,
      encouragedMoves: prev.encouragedMoves + 1,
    }));
  };

  const recordMove = (isCorrect: boolean) => {
    setStudentSession((prev) => ({
      ...prev,
      correctMoves: isCorrect ? prev.correctMoves + 1 : prev.correctMoves,
      encouragedMoves: !isCorrect ? prev.encouragedMoves + 1 : prev.encouragedMoves,
    }));
  };

  const unlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) =>
        b.id === badgeId && !b.isUnlocked
          ? { ...b, isUnlocked: true, unlockedAt: 'Şimdi' }
          : b
      )
    );
  };

  const updateUDAReport = (code: string, isSuccess: boolean) => {
    setStudentSession((prev) => {
      const updated = prev.udaReports.map((report) => {
        if (report.code === code) {
          const attempts = report.attempts + 1;
          const successes = isSuccess ? report.successes + 1 : report.successes;
          const ratio = successes / attempts;
          const status: 'achieved' | 'developing' | 'initial' =
            ratio >= 0.6 && successes >= 3
              ? 'achieved'
              : ratio >= 0.4
              ? 'developing'
              : 'initial';
          return {
            ...report,
            attempts,
            successes,
            status,
          };
        }
        return report;
      });
      return { ...prev, udaReports: updated };
    });
  };

  const completeLevel = (levelId: string, stars: number) => {
    setWorlds((prevWorlds) =>
      prevWorlds.map((world) => {
        const hasLevel = world.levels.some((l) => l.id === levelId);
        if (!hasLevel) return world;

        const updatedLevels = world.levels.map((lvl) => {
          if (lvl.id === levelId) {
            return {
              ...lvl,
              stars: Math.max(lvl.stars, stars),
              isCompleted: true,
            };
          }
          return lvl;
        });

        // Bir sonraki seviyenin kilidini aç
        const currentIndex = updatedLevels.findIndex((l) => l.id === levelId);
        if (currentIndex !== -1 && currentIndex + 1 < updatedLevels.length) {
          updatedLevels[currentIndex + 1].isLocked = false;
        }

        return {
          ...world,
          levels: updatedLevels,
        };
      })
    );

    setStudentSession((prev) => ({
      ...prev,
      gamesFinished: prev.gamesFinished + 1,
    }));

    if (levelId.startsWith('w1')) {
      unlockBadge('badge-history');
    } else if (levelId.startsWith('w2')) {
      unlockBadge('badge-hardware');
    } else if (levelId.startsWith('w3')) {
      unlockBadge('badge-art');
    } else if (levelId.startsWith('w4')) {
      unlockBadge('badge-network');
    }
  };

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        mascot,
        setMascotId,
        inputMode,
        setInputMode,
        theme,
        setTheme,
        fontSize,
        setFontSize,
        isTtsEnabled,
        setIsTtsEnabled,
        isSoundEnabled,
        setIsSoundEnabled,
        worlds,
        badges,
        studentSession,
        speakText,
        speakHover,
        playSound,
        triggerEncouragement,
        recordMove,
        completeLevel,
        unlockBadge,
        updateUDAReport,
        isTeacherModalOpen,
        setIsTeacherModalOpen,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
