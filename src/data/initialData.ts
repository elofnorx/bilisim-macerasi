import type { Mascot, WorldInfo, BadgeItem } from '../types';

export const MASCOTS: Mascot[] = [
  {
    id: 'robi',
    name: 'Robot Robi',
    subtitle: 'Teknoloji Dostu Robot',
    avatarEmoji: '🤖',
    svgColor: 'from-blue-500 to-indigo-600',
    greeting: 'Merhaba arkadaşım! Ben Robot Robi. Bilişim macerasına birlikte çıkalım mı?',
    encouragement: [
      'Harika bir deneme! Birlikte tekrar yapabiliriz.',
      'Neredeyse oluyordu! Bir kez daha dene, sana güveniyorum.',
      'Çok iyi odaklandın! Teknoloji seninle daha eğlenceli.',
      'Süpersin! Adım adım hedefe yaklaşıyoruz.'
    ]
  },
  {
    id: 'owl',
    name: 'Bilge Baykuş',
    subtitle: 'Akıllı ve Sabırlı Rehber',
    avatarEmoji: '🦉',
    svgColor: 'from-emerald-500 to-teal-600',
    greeting: 'Hoş geldin küçük kaşif! Ben Bilge Baykuş. Yeni bilgiler öğrenmek çok keyifli!',
    encouragement: [
      'Sabırla denemeye devam et, öğrenmenin sırrı burada!',
      'Neredeyse başarmıştın! Şimdi daha dikkatli bir kez daha.',
      'Bilgi bir hazinedir, sen de çok parlak bir kaşifsin.',
      'Tebrikler! Düşündün ve harika bir adım attın.'
    ]
  },
  {
    id: 'star',
    name: 'Neşeli Yıldız',
    subtitle: 'Enerjik ve Parlayan Arkadaş',
    avatarEmoji: '⭐',
    svgColor: 'from-amber-400 to-orange-500',
    greeting: 'Selam yıldızım! Ben Neşeli Yıldız. Bugün ekran başında ışıl ışıl parlayacağız!',
    encouragement: [
      'Gülümse ve devam et! Işığın parıldıyor!',
      'Hiç sorun değil, tekrar denemek oyunun en heyecanlı kısmı!',
      'Vay canına, parmakların çok hızlı! Bir daha dene!',
      'Gözlerindeki neşe bana güç veriyor! Sen yaparsın!'
    ]
  }
];

export const INITIAL_WORLDS: WorldInfo[] = [
  {
    id: 1,
    name: 'Fare ve Dokunma Adası',
    tagline: 'Tıkla, dokun ve donanımları keşfet!',
    emoji: '🏝️',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    accentColor: 'text-emerald-700',
    isUnlocked: true,
    levels: [
      {
        id: 'w1-l1',
        worldId: 1,
        number: 1,
        title: 'Donanım Eşleştirme',
        description: 'Monitör, kasa, klavye ve fareyi doğru yuvalarına yerleştir.',
        iconName: 'Monitor',
        stars: 0,
        isCompleted: false,
        isLocked: false,
        targetScreen: 'game-hardware'
      },
      {
        id: 'w1-l2',
        worldId: 1,
        number: 2,
        title: 'Baloncuk Yakalama',
        description: 'Ekranda beliren hedeflere dokunarak reflekslerini geliştir.',
        iconName: 'MousePointerClick',
        stars: 0,
        isCompleted: false,
        isLocked: false,
        targetScreen: 'game-hardware'
      },
      {
        id: 'w1-l3',
        worldId: 1,
        number: 3,
        title: 'Sürükleme Şampiyonu',
        description: 'Farklı boyutlardaki simgeleri kutularına taşı.',
        iconName: 'Move',
        stars: 0,
        isCompleted: false,
        isLocked: true
      }
    ]
  },
  {
    id: 2,
    name: 'Klavye Vadisi',
    tagline: 'Harfleri tanı, tuşlara bas ve patlat!',
    emoji: '⌨️',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    accentColor: 'text-sky-700',
    isUnlocked: true,
    levels: [
      {
        id: 'w2-l1',
        worldId: 2,
        number: 1,
        title: 'Harf Balonları Patlatma',
        description: 'Süzülen harf balonlarına klavyeden veya dokunarak bas.',
        iconName: 'Sparkles',
        stars: 0,
        isCompleted: false,
        isLocked: false,
        targetScreen: 'game-keyboard'
      },
      {
        id: 'w2-l2',
        worldId: 2,
        number: 2,
        title: 'Sihirli Rakamlar',
        description: 'Klavyedeki 1, 2, 3 gibi sayı tuşlarını eğlenerek öğren.',
        iconName: 'Binary',
        stars: 0,
        isCompleted: false,
        isLocked: false,
        targetScreen: 'game-keyboard'
      },
      {
        id: 'w2-l3',
        worldId: 2,
        number: 3,
        title: 'Kelime Kaşifi',
        description: 'Harfleri yan yana getirip ilk kelimeni yaz.',
        iconName: 'BookOpen',
        stars: 0,
        isCompleted: false,
        isLocked: true
      }
    ]
  },
  {
    id: 3,
    name: 'Donanım ve Güvenlik Şehri',
    tagline: 'Bilişim kuralları ve güvenli teknoloji!',
    emoji: '🖥️',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    accentColor: 'text-amber-800',
    isUnlocked: false,
    levels: [
      {
        id: 'w3-l1',
        worldId: 3,
        number: 1,
        title: 'Güvenli Şifre Kalesi',
        description: 'Güçlü şifre oluşturup kaleni virüslere karşı koru.',
        iconName: 'ShieldCheck',
        stars: 0,
        isCompleted: false,
        isLocked: true
      },
      {
        id: 'w3-l2',
        worldId: 3,
        number: 2,
        title: 'Kablo Fabrikası',
        description: 'Güç ve görüntü kablolarını doğru portlara tak.',
        iconName: 'Cpu',
        stars: 0,
        isCompleted: false,
        isLocked: true
      },
      {
        id: 'w3-l3',
        worldId: 3,
        number: 3,
        title: 'Bilişim Kahramanı Rozeti',
        description: 'Tüm aşamaları tamamla ve büyük sertifikayı kazan!',
        iconName: 'Award',
        stars: 0,
        isCompleted: false,
        isLocked: true
      }
    ]
  }
];

export const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'badge-welcome',
    title: 'Maceracı Başlangıcı',
    description: 'Bilişim Macerası portalına ilk adımı attın.',
    emoji: '🚀',
    isUnlocked: true,
    unlockedAt: 'İlk Oturum',
    category: 'master'
  },
  {
    id: 'badge-hardware',
    title: 'Donanım Mimarı',
    description: 'Monitör, kasa, klavye ve fareyi eksiksiz yerleştirdin.',
    emoji: '🖥️',
    isUnlocked: false,
    category: 'hardware'
  },
  {
    id: 'badge-keyboard',
    title: 'Harf Avcısı',
    description: 'Klavye vadisinde uçan harf balonlarını patlattın.',
    emoji: '🎯',
    isUnlocked: false,
    category: 'keyboard'
  },
  {
    id: 'badge-resilience',
    title: 'Azimli Şampiyon',
    description: 'Pes etmeden tekrar deneyerek hedefe ulaştın.',
    emoji: '💪',
    isUnlocked: true,
    unlockedAt: '1. Seviye',
    category: 'master'
  },
  {
    id: 'badge-voice',
    title: 'Sesli Komutan',
    description: 'Sesinle bilgisayara komut verdin.',
    emoji: '🎙️',
    isUnlocked: false,
    category: 'accessibility'
  },
  {
    id: 'badge-gesture',
    title: 'Sanal El Büyücüsü',
    description: 'El hareketleri ve sanal imleç modunu başarıyla kullandın.',
    emoji: '✨',
    isUnlocked: false,
    category: 'accessibility'
  }
];
