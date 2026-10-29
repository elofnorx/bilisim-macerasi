import { createContext } from 'react';
import type {
  ActiveTab,
  ThemeMode,
  ShadowItem,
  MapLevel,
  BEPStat,
} from '../types';

export interface GameContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  totalStars: number;
  addStars: (count: number) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  isTtsEnabled: boolean;
  setIsTtsEnabled: (enabled: boolean) => void;
  shadowItems: ShadowItem[];
  addCustomShadowItem: (item: ShadowItem) => void;
  mapLevels: MapLevel[];
  currentMapLevelIndex: number;
  setCurrentMapLevelIndex: (index: number) => void;
  publishCustomMap: (newLevel: MapLevel) => void;
  bepStats: BEPStat[];
  recordBEPProgress: (code: 'UDA 1' | 'UDA 2' | 'UDA 3', isSuccess: boolean) => void;
  triggerCelebration: () => void;
  speak: (text: string) => void;
  playSfx: (
    type: 'click' | 'success' | 'encourage' | 'pop' | 'fanfare' | 'step' | 'jump' | 'spin' | 'glow'
  ) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);
