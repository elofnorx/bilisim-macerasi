import type {
  ShadowItem,
  WheelTask,
  DragItem,
  TargetBox,
  MapLevel,
  ScratchBlockDef,
  BEPStat,
} from '../types';

// Wordwall 1.1: Gölgesini Bulma Oyunu İlk Verileri
export const INITIAL_SHADOW_ITEMS: ShadowItem[] = [
  {
    id: 'monitor',
    name: 'Monitör / Ekran',
    emoji: '🖥️',
    color: 'from-blue-400 to-indigo-500',
    shadowSilhouetteId: 'monitor',
  },
  {
    id: 'keyboard',
    name: 'Klavye',
    emoji: '⌨️',
    color: 'from-amber-400 to-orange-500',
    shadowSilhouetteId: 'keyboard',
  },
  {
    id: 'mouse',
    name: 'Fare (Mouse)',
    emoji: '🖱️',
    color: 'from-emerald-400 to-teal-500',
    shadowSilhouetteId: 'mouse',
  },
  {
    id: 'apple',
    name: 'Elma',
    emoji: '🍎',
    color: 'from-rose-400 to-red-500',
    shadowSilhouetteId: 'apple',
  },
  {
    id: 'headphones',
    name: 'Kulaklık',
    emoji: '🎧',
    color: 'from-purple-400 to-violet-500',
    shadowSilhouetteId: 'headphones',
  },
  {
    id: 'laptop',
    name: 'Dizüstü Bilgisayar',
    emoji: '💻',
    color: 'from-sky-400 to-blue-600',
    shadowSilhouetteId: 'laptop',
  },
];

// Wordwall 1.2: Şans Çarkıfeleği Görevleri
export const INITIAL_WHEEL_TASKS: WheelTask[] = [
  {
    id: 'task-fruits',
    title: 'Meyveleri Sepete Taşı',
    icon: '🍎',
    color: '#f87171', // pastel rose
    rewardStars: 1,
  },
  {
    id: 'task-keyboard',
    title: 'Klavyede Boşluk Tuşuna Bas',
    icon: '⌨️',
    color: '#60a5fa', // pastel blue
    rewardStars: 1,
  },
  {
    id: 'task-mouse',
    title: 'Fareyi Hareket Ettir',
    icon: '🖱️',
    color: '#34d399', // pastel emerald
    rewardStars: 1,
  },
  {
    id: 'task-screen',
    title: 'Ekrana Gülümse ve Dokun',
    icon: '🖥️',
    color: '#fbbf24', // pastel amber
    rewardStars: 1,
  },
  {
    id: 'task-music',
    title: 'Neşeli Müziği Dinle',
    icon: '🎧',
    color: '#c084fc', // pastel purple
    rewardStars: 1,
  },
  {
    id: 'task-robot',
    title: 'Robot Robi\'ye El Salla',
    icon: '🤖',
    color: '#38bdf8', // pastel sky
    rewardStars: 1,
  },
];

// Wordwall 1.3: Sürükle-Bırak Eşleştirme Öğeleri
export const INITIAL_DRAG_ITEMS: DragItem[] = [
  {
    id: 'drag-monitor',
    name: 'Monitör (Ekran)',
    icon: '🖥️',
    targetCategory: 'monitor_slot',
    color: 'bg-blue-100 border-blue-400 text-blue-900',
  },
  {
    id: 'drag-keyboard',
    name: 'Klavye',
    icon: '⌨️',
    targetCategory: 'keyboard_slot',
    color: 'bg-amber-100 border-amber-400 text-amber-900',
  },
  {
    id: 'drag-mouse',
    name: 'Fare (Mouse)',
    icon: '🖱️',
    targetCategory: 'mouse_slot',
    color: 'bg-emerald-100 border-emerald-400 text-emerald-900',
  },
];

// Wordwall 1.3: Hedef Yuva / Kutular
export const INITIAL_TARGET_BOXES: TargetBox[] = [
  {
    id: 'box-monitor',
    category: 'monitor_slot',
    title: 'Monitör Yuvası',
    icon: '🖥️',
    color: 'border-blue-300 bg-blue-50/60',
  },
  {
    id: 'box-keyboard',
    category: 'keyboard_slot',
    title: 'Klavye Yuvası',
    icon: '⌨️',
    color: 'border-amber-300 bg-amber-50/60',
  },
  {
    id: 'box-mouse',
    category: 'mouse_slot',
    title: 'Fare Yuvası',
    icon: '🖱️',
    color: 'border-emerald-300 bg-emerald-50/60',
  },
];

// Modül 2 & 3: Başlangıç Seviye Haritaları (5x5 Grid)
export const INITIAL_MAP_LEVELS: MapLevel[] = [
  {
    id: 'level-1',
    title: '1. Adım: Düz Yol (Sağa Git)',
    gridSize: 5,
    start: { x: 0, y: 2 },
    target: { x: 4, y: 2 },
    obstacles: [],
  },
  {
    id: 'level-2',
    title: '2. Adım: Köşeyi Dön',
    gridSize: 5,
    start: { x: 0, y: 0 },
    target: { x: 4, y: 4 },
    obstacles: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
  },
  {
    id: 'level-3',
    title: '3. Adım: Engeli Aş',
    gridSize: 5,
    start: { x: 0, y: 2 },
    target: { x: 4, y: 2 },
    obstacles: [
      { x: 2, y: 2 }, // Bu engel zıplama bloğu 🦘 ile geçilebilir!
    ],
  },
];

// Modül 3: ScratchJr Blok Kütüphanesi Tanımları
export const SCRATCH_BLOCK_DEFS: ScratchBlockDef[] = [
  {
    type: 'start',
    label: 'Başlat',
    symbol: '🟢',
    bgColor: 'bg-emerald-500 hover:bg-emerald-600',
    borderColor: 'border-emerald-600',
    textColor: 'text-white',
  },
  {
    type: 'right',
    label: 'Sağ',
    symbol: '➡️',
    bgColor: 'bg-sky-500 hover:bg-sky-600',
    borderColor: 'border-sky-600',
    textColor: 'text-white',
  },
  {
    type: 'left',
    label: 'Sol',
    symbol: '⬅️',
    bgColor: 'bg-sky-500 hover:bg-sky-600',
    borderColor: 'border-sky-600',
    textColor: 'text-white',
  },
  {
    type: 'up',
    label: 'Yukarı',
    symbol: '⬆️',
    bgColor: 'bg-indigo-500 hover:bg-indigo-600',
    borderColor: 'border-indigo-600',
    textColor: 'text-white',
  },
  {
    type: 'down',
    label: 'Aşağı',
    symbol: '⬇️',
    bgColor: 'bg-indigo-500 hover:bg-indigo-600',
    borderColor: 'border-indigo-600',
    textColor: 'text-white',
  },
  {
    type: 'jump',
    label: 'Zıpla',
    symbol: '🦘',
    bgColor: 'bg-amber-500 hover:bg-amber-600',
    borderColor: 'border-amber-600',
    textColor: 'text-white',
  },
];

// MEB Bilişim BEP Kazanımları İstatistik Şablonu
export const INITIAL_BEP_STATS: BEPStat[] = [
  {
    code: 'UDA 1',
    title: 'Bilişim Teknolojileri Donanım ve Nesne Tanıma',
    bepOutcome: 'Görsel nesnelerin silüetini ve donanım parçalarını doğru eşleştirir.',
    successCount: 3,
    attemptCount: 3,
    criterionMet: true,
  },
  {
    code: 'UDA 2',
    title: 'Yön Algısı ve Mekânsal Konumlandırma',
    bepOutcome: 'Ekrandaki karakteri 4 ana yönde (Yukarı, Aşağı, Sol, Sağ) hedefe ulaştırır.',
    successCount: 2,
    attemptCount: 2,
    criterionMet: true,
  },
  {
    code: 'UDA 3',
    title: 'Simgesel Kodlama ve Algoritmik Sıralama (ScratchJr)',
    bepOutcome: 'Başlat bayrağı ve yön/zıplama bloklarını mantıksal sıraya dizerek çalıştırır.',
    successCount: 1,
    attemptCount: 1,
    criterionMet: false,
  },
];
