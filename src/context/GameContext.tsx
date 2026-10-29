import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import confetti from 'canvas-confetti';
import type {
  ActiveTab,
  ThemeMode,
  ShadowItem,
  MapLevel,
  BEPStat,
} from '../types';
import {
  INITIAL_SHADOW_ITEMS,
  INITIAL_MAP_LEVELS,
  INITIAL_BEP_STATS,
} from '../data/initialData';
import { sound } from '../utils/audio';
import { speech } from '../utils/speech';
import { GameContext } from './gameContextDefinition';

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ActiveTab>('wordwall');
  const [totalStars, setTotalStars] = useState<number>(12);
  const [theme, setTheme] = useState<ThemeMode>('normal');
  const [isSoundEnabled, setIsSoundEnabledState] = useState<boolean>(true);
  const [isTtsEnabled, setIsTtsEnabledState] = useState<boolean>(true);

  const [shadowItems, setShadowItems] = useState<ShadowItem[]>(INITIAL_SHADOW_ITEMS);
  const [mapLevels, setMapLevels] = useState<MapLevel[]>(INITIAL_MAP_LEVELS);
  const [currentMapLevelIndex, setCurrentMapLevelIndex] = useState<number>(0);
  const [bepStats, setBepStats] = useState<BEPStat[]>(INITIAL_BEP_STATS);

  // Yüksek kontrast temasını <html> etiketine uygula
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-contrast-yellow', 'theme-contrast-blue');
    if (theme === 'contrast-yellow') {
      root.classList.add('theme-contrast-yellow');
    } else if (theme === 'contrast-blue') {
      root.classList.add('theme-contrast-blue');
    }
  }, [theme]);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    sound.playClick();
  };

  const setIsSoundEnabled = (enabled: boolean) => {
    setIsSoundEnabledState(enabled);
    sound.setSoundEnabled(enabled);
  };

  const setIsTtsEnabled = (enabled: boolean) => {
    setIsTtsEnabledState(enabled);
    speech.setTtsEnabled(enabled);
  };

  // Konfeti ve kutlama efekti
  const triggerCelebration = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e', '#a855f7'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }
  };

  // Yıldız artırımı
  const addStars = (count: number) => {
    setTotalStars((prev) => prev + count);
    triggerCelebration();
  };

  // Sesli yönerge
  const speak = (text: string) => {
    if (isTtsEnabled) {
      speech.speak(text);
    }
  };

  // Ses efektleri
  const playSfx = (
    type: 'click' | 'success' | 'encourage' | 'pop' | 'fanfare' | 'step' | 'jump' | 'spin' | 'glow'
  ) => {
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
      case 'step':
        sound.playStep();
        break;
      case 'jump':
        sound.playJump();
        break;
      case 'spin':
        sound.playSpin();
        break;
      case 'glow':
        sound.playHintGlow();
        break;
    }
  };

  // Öğretmen Stüdyosundan yeni gölge kartı ekleme
  const addCustomShadowItem = (item: ShadowItem) => {
    setShadowItems((prev) => [item, ...prev]);
    recordBEPProgress('UDA 1', true);
  };

  // Öğretmen Stüdyosundan özel harita yayınlama
  const publishCustomMap = (newLevel: MapLevel) => {
    setMapLevels((prev) => [newLevel, ...prev]);
    setCurrentMapLevelIndex(0);
    recordBEPProgress('UDA 2', true);
  };

  // BEP Kazanımını güncelle
  const recordBEPProgress = (code: 'UDA 1' | 'UDA 2' | 'UDA 3', isSuccess: boolean) => {
    setBepStats((prev) =>
      prev.map((item) => {
        if (item.code === code) {
          const newSuccess = isSuccess ? item.successCount + 1 : item.successCount;
          const newAttempt = item.attemptCount + 1;
          const ratio = newSuccess / newAttempt;
          return {
            ...item,
            successCount: newSuccess,
            attemptCount: newAttempt,
            criterionMet: ratio >= 0.6 && newAttempt >= 2,
          };
        }
        return item;
      })
    );
  };

  return (
    <GameContext.Provider
      value={{
        activeTab,
        setActiveTab,
        totalStars,
        addStars,
        theme,
        setTheme,
        isSoundEnabled,
        setIsSoundEnabled,
        isTtsEnabled,
        setIsTtsEnabled,
        shadowItems,
        addCustomShadowItem,
        mapLevels,
        currentMapLevelIndex,
        setCurrentMapLevelIndex,
        publishCustomMap,
        bepStats,
        recordBEPProgress,
        triggerCelebration,
        speak,
        playSfx,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
