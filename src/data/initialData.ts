import type { Mascot, WorldInfo, BadgeItem, UDAReport } from '../types';

export const MASCOTS: Mascot[] = [
  {
    id: 'robi',
    name: 'Robot Robi',
    subtitle: 'Teknoloji Dostu Robot',
    avatarEmoji: '🤖',
    svgColor: 'from-blue-500 to-indigo-600',
    greeting: 'Merhaba arkadaşım! Ben Robot Robi. MEB Bilişim Macerası dersine hazır mısın?',
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
      'Vay canına, harika bir adım! Bir daha dene!',
      'Gözlerindeki neşe bana güç veriyor! Sen yaparsın!'
    ]
  }
];

export const INITIAL_WORLDS: WorldInfo[] = [
  {
    id: 1,
    udaCode: 'UDA 1',
    name: '1. Modül: Geçmişten Günümüze Bilişim',
    tagline: 'Zaman makinesiyle dünden bugüne teknolojiyi ve kullanım alanlarını keşfet!',
    emoji: '⏳',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    accentColor: 'text-amber-800',
    isUnlocked: true,
    levels: [
      {
        id: 'w1-l1',
        worldId: 1,
        number: 1,
        title: 'Zaman Makinesi (Eski vs Yeni)',
        description: 'Eski teknolojiler ile günümüzün modern araçlarını eşleştir.',
        iconName: 'History',
        stars: 3,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-time-machine'
      },
      {
        id: 'w1-l2',
        worldId: 1,
        number: 2,
        title: 'Kullanım Alanı Sepeti',
        description: 'Teknolojileri Hastane, Okul ve Banka sepetlerine doğru ayır.',
        iconName: 'Building2',
        stars: 2,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-time-machine'
      },
      {
        id: 'w1-l3',
        worldId: 1,
        number: 3,
        title: 'Yazılım ve Donanım Çarkı',
        description: 'Elle tutulan donanımlar ile ekrandaki yazılımları tanı.',
        iconName: 'Sparkles',
        stars: 0,
        isCompleted: false,
        isLocked: false,
        targetScreen: 'game-time-machine'
      }
    ]
  },
  {
    id: 2,
    udaCode: 'UDA 2',
    name: '2. Modül: Bilgisayar Sistemleri ve Bileşenleri',
    tagline: 'Bilgisayar parçalarını birleştir, girdi ve çıktı birimlerini tanı!',
    emoji: '🖥️',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    accentColor: 'text-emerald-700',
    isUnlocked: true,
    levels: [
      {
        id: 'w2-l1',
        worldId: 2,
        number: 1,
        title: 'Donanım Yapbozu',
        description: 'Monitör, kasa, klavye ve fareyi çalışma masasına yerleştir.',
        iconName: 'Monitor',
        stars: 3,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-hardware'
      },
      {
        id: 'w2-l2',
        worldId: 2,
        number: 2,
        title: 'Girdi mi Çıktı mı?',
        description: 'Kamera, yazıcı, mikrofon ve ekranı doğru sepetlere taşı.',
        iconName: 'ArrowLeftRight',
        stars: 2,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-input-output'
      },
      {
        id: 'w2-l3',
        worldId: 2,
        number: 3,
        title: 'Klavye Harf Avı',
        description: 'Süzülen harf balonlarına basarak klavye reflekslerini geliştir.',
        iconName: 'Sparkles',
        stars: 3,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-keyboard'
      }
    ]
  },
  {
    id: 3,
    udaCode: 'UDA 3',
    name: '3. Modül: Görsel Düzenleme ve Dijital Çizim',
    tagline: 'Dev fırçalar, renk paletleri ve damgalarla yaratıcılığını konuştur!',
    emoji: '🎨',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    accentColor: 'text-purple-800',
    isUnlocked: true,
    levels: [
      {
        id: 'w3-l1',
        worldId: 3,
        number: 1,
        title: 'Erişilebilir Dijital Tuval',
        description: 'Sesli renk seçici, dev fırçalar ve eğlenceli damgalarla boya.',
        iconName: 'Palette',
        stars: 3,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-digital-canvas'
      },
      {
        id: 'w3-l2',
        worldId: 3,
        number: 2,
        title: 'Arayüz Araçları Eşleştirme',
        description: 'Fırça, silgi, renk paleti simgelerini doğru görevle eşleştir.',
        iconName: 'Layers',
        stars: 2,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-digital-canvas'
      },
      {
        id: 'w3-l3',
        worldId: 3,
        number: 3,
        title: 'Dijital Sanatçı Rozeti',
        description: 'Kendi resmini çizip bilgisayarına başarıyla kaydet.',
        iconName: 'Award',
        stars: 0,
        isCompleted: false,
        isLocked: false,
        targetScreen: 'game-digital-canvas'
      }
    ]
  },
  {
    id: 4,
    udaCode: 'UDA 4',
    name: '4. Modül: Bilgisayar Ağları ve İnternet',
    tagline: 'Cihazları modeme bağla, Wi-Fi sinyallerini takip et ve güvenle gezin!',
    emoji: '🌐',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    accentColor: 'text-sky-800',
    isUnlocked: true,
    levels: [
      {
        id: 'w4-l1',
        worldId: 4,
        number: 1,
        title: 'Ağ Kurma & Wi-Fi Sinyal Takibi',
        description: 'Bilgisayar, tablet ve telefonu modeme bağlayıp interneti aç.',
        iconName: 'Wifi',
        stars: 3,
        isCompleted: true,
        isLocked: false,
        targetScreen: 'game-network-builder'
      },
      {
        id: 'w4-l2',
        worldId: 4,
        number: 2,
        title: 'Güvenli İnternet ve Şifre',
        description: 'Güçlü şifre kurallarını öğren, sanal kaleyi güvene al.',
        iconName: 'ShieldCheck',
        stars: 0,
        isCompleted: false,
        isLocked: false,
        targetScreen: 'game-network-builder'
      },
      {
        id: 'w4-l3',
        worldId: 4,
        number: 3,
        title: 'Siber Kahraman Rozeti',
        description: 'Ağ müfredatını tamamla ve MEB katılım belgesini hak et!',
        iconName: 'Award',
        stars: 0,
        isCompleted: false,
        isLocked: true
      }
    ]
  }
];

export const INITIAL_UDA_REPORTS: UDAReport[] = [
  {
    code: 'UDA 1',
    title: 'Bilişim Teknolojileri ve Değişim',
    learningOutcome: 'Geçmişten günümüze teknolojileri karşılaştırır, kullanım alanlarına göre sınıflandırır.',
    attempts: 5,
    successes: 4,
    targetCriteria: '3/5 Ölçütü (En az %60 Başarı)',
    status: 'achieved',
    notes: 'Zaman makinesi eşleştirmesinde 4/5 başarı sağlandı. Çevirmeli telefon ve daktilo dönüşümünü kavradı.',
  },
  {
    code: 'UDA 2',
    title: 'Bilgisayar Sistemleri ve Bileşenleri',
    learningOutcome: 'Bilgisayar donanım parçalarını tanır, girdi ve çıktı birimlerini doğru ayırt eder.',
    attempts: 5,
    successes: 5,
    targetCriteria: '3/5 Ölçütü (En az %60 Başarı)',
    status: 'achieved',
    notes: 'Donanım yapbozunu hatasız tamamladı. Girdi ve çıktı sepetlerini sesli yönergelerle doğru gruplandırdı.',
  },
  {
    code: 'UDA 3',
    title: 'Görsel Düzenleme ve Dijital Çizim',
    learningOutcome: 'Görsel düzenleme araçlarını (fırça, silgi, renk paleti) kullanarak temel dijital çizimler oluşturur.',
    attempts: 4,
    successes: 3,
    targetCriteria: '3/5 Ölçütü (En az %60 Başarı)',
    status: 'achieved',
    notes: 'Renk paletinden sesli dönüt alarak istediği renkleri seçti, fırça ve damgalarla özgün kompozisyon üretti.',
  },
  {
    code: 'UDA 4',
    title: 'Bilgisayar Ağları ve İnternet Sorgulama',
    learningOutcome: 'Cihazlar arası kablosuz ağ (Wi-Fi) bağlantısı kurar, internet ve sinyal akış mantığını kavrar.',
    attempts: 5,
    successes: 3,
    targetCriteria: '3/5 Ölçütü (En az %60 Başarı)',
    status: 'achieved',
    notes: 'Modem ile cihazlar arasındaki bağlantı yollarını başarıyla birleştirdi. Sinyal akışını takip etti.',
  },
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
    id: 'badge-history',
    title: 'Zaman Yolcusu',
    description: 'UDA 1: Geçmişten günümüze teknolojileri başarıyla eşleştirdin.',
    emoji: '⏳',
    isUnlocked: true,
    unlockedAt: '1. Modül',
    category: 'history'
  },
  {
    id: 'badge-hardware',
    title: 'Donanım Mimarı',
    description: 'UDA 2: Bilgisayar parçalarını ve girdi/çıktı birimlerini doğru grupladın.',
    emoji: '🖥️',
    isUnlocked: true,
    unlockedAt: '2. Modül',
    category: 'hardware'
  },
  {
    id: 'badge-art',
    title: 'Dijital Ressam',
    description: 'UDA 3: Görsel düzenleme araçlarıyla ilk dijital eserini ürettin.',
    emoji: '🎨',
    isUnlocked: true,
    unlockedAt: '3. Modül',
    category: 'art'
  },
  {
    id: 'badge-network',
    title: 'Ağ Ustası',
    description: 'UDA 4: Cihazları modeme bağlayıp internet ağını kurdun.',
    emoji: '📶',
    isUnlocked: true,
    unlockedAt: '4. Modül',
    category: 'network'
  },
  {
    id: 'badge-keyboard',
    title: 'Harf Avcısı',
    description: 'Klavye vadisinde uçan harf balonlarını patlattın.',
    emoji: '🎯',
    isUnlocked: true,
    unlockedAt: 'Klavye Dersi',
    category: 'keyboard'
  },
  {
    id: 'badge-resilience',
    title: 'Azimli Şampiyon',
    description: 'Pes etmeden tekrar deneyerek 3/5 hedefine ulaştın.',
    emoji: '💪',
    isUnlocked: true,
    unlockedAt: 'Özel Eğitim',
    category: 'master'
  },
  {
    id: 'badge-voice',
    title: 'Sesli Komutan',
    description: 'Sesli komutları kullanarak portalı eller serbest yönettin.',
    emoji: '🎙️',
    isUnlocked: false,
    category: 'accessibility'
  },
  {
    id: 'badge-gesture',
    title: 'Sanal El Büyücüsü',
    description: 'Kamera ve sanal imleç ile duraklayarak (dwell-click) işlem yaptın.',
    emoji: '✨',
    isUnlocked: false,
    category: 'accessibility'
  }
];
