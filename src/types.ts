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

export type ScreenType = 'onboarding' | 'map' | 'game-hardware' | 'game-keyboard';

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
  category: 'hardware' | 'keyboard' | 'accessibility' | 'master';
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
}
