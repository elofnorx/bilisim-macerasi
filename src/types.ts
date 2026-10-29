export type MascotId = 'robi' | 'owl' | 'star';

export interface Mascot {
  id: MascotId;
  name: string;
  subtitle: string;
  avatarEmoji: string;
  svgColor: string;
  greeting: string;
  encouragement: string[];
}

export type InputMode = 'touch' | 'gesture' | 'voice';

export type ThemeMode = 'normal' | 'contrast-yellow' | 'contrast-blue';

export type FontSize = 'normal' | 'large' | 'huge';

export type ScreenType =
  | 'onboarding'
  | 'map'
  | 'game-hardware'
  | 'game-keyboard'
  | 'game-time-machine'
  | 'game-input-output'
  | 'game-digital-canvas'
  | 'game-network-builder';

export interface LevelInfo {
  id: string;
  worldId: number;
  number: number;
  title: string;
  description: string;
  iconName: string;
  stars: number; // 0 to 3
  isCompleted: boolean;
  isLocked: boolean;
  targetScreen?: ScreenType;
}

export interface WorldInfo {
  id: number;
  udaCode: string; // örn: UDA 1, UDA 2, UDA 3, UDA 4
  name: string;
  tagline: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  isUnlocked: boolean;
  levels: LevelInfo[];
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'hardware' | 'keyboard' | 'accessibility' | 'master' | 'art' | 'network' | 'history';
}

export interface UDAReport {
  code: string; // 'UDA 1', 'UDA 2', 'UDA 3', 'UDA 4'
  title: string;
  learningOutcome: string;
  attempts: number;
  successes: number;
  targetCriteria: string; // '3/5 Ölçütü (En az %60 Başarı)'
  status: 'achieved' | 'developing' | 'initial';
  notes: string;
}

export interface StudentSession {
  studentName: string;
  timeSpentSeconds: number;
  correctMoves: number;
  encouragedMoves: number; // Gentle retry attempts
  voiceCommandsUsed: number;
  gestureMovesUsed: number;
  gamesFinished: number;
  badges: BadgeItem[];
  udaReports: UDAReport[];
}
