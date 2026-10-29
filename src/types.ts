// MEB Özel Eğitim Bilişim Teknolojileri BEP Portalı Tip Tanımları

export type ActiveTab = 'wordwall' | 'maze' | 'scratchjr' | 'teacher';

export type WordwallSubGame = 'shadow' | 'wheel' | 'matching';

export type ThemeMode = 'normal' | 'contrast-yellow' | 'contrast-blue';

// Wordwall: Gölge Eşleştirme Öğesi
export interface ShadowItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  shadowSilhouetteId: string;
}

// Wordwall: Şans Çarkıfeleği Görevi
export interface WheelTask {
  id: string;
  title: string;
  icon: string;
  color: string;
  rewardStars: number;
}

// Wordwall: Sürükle-Bırak Eşleştirme Öğesi & Hedef Kutusu
export interface DragItem {
  id: string;
  name: string;
  icon: string;
  targetCategory: string; // örn: 'ekran', 'klavye', 'fare', 'kasa'
  color: string;
}

export interface TargetBox {
  id: string;
  category: string;
  title: string;
  icon: string;
  color: string;
}

// Labirent & Kodlama Harita Hücre Tipleri
export type CellType = 'empty' | 'obstacle' | 'start' | 'target';

export interface GridCoord {
  x: number;
  y: number;
}

export interface MapLevel {
  id: string;
  title: string;
  gridSize: number; // varsayılan 5
  start: GridCoord;
  target: GridCoord;
  obstacles: GridCoord[];
}

// ScratchJr Simgesel Komut Blokları
export type ScratchCommandType =
  | 'start'      // 🟢 [Başlat / Yeşil Bayrak]
  | 'right'      // ➡️ [Sağ Ok]
  | 'left'       // ⬅️ [Sol Ok]
  | 'up'         // ⬆️ [Yukarı Ok]
  | 'down'       // ⬇️ [Aşağı Ok]
  | 'jump';      // 🦘 [Zıpla / Engel Geç]

export interface ScratchBlockDef {
  type: ScratchCommandType;
  label: string;
  symbol: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export interface ProgrammedBlock {
  uid: string;
  type: ScratchCommandType;
}

// Öğretmen Stüdyosu Şablon Nesnesi
export interface CustomTeacherObject {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

// BEP Kazanım İlerleme İstatistikleri
export interface BEPStat {
  code: string; // 'UDA 1', 'UDA 2', 'UDA 3'
  title: string;
  bepOutcome: string;
  successCount: number;
  attemptCount: number;
  criterionMet: boolean;
}
