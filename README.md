# 🚀 Bilişim Macerası: MEB BEP Uyumlu Özel Eğitim Web Portalı (MVP)

MEB Özel Eğitim Bilişim Teknolojileri Dersi BEP (Bireyselleştirilmiş Eğitim Programı) çerçeve kazanımları ile tam uyumlu; hafif/orta düzeyde zihinsel yetersizlik, otizm spektrum bozukluğu ve motor kas kısıtı olan öğrencilerin kullanımına özel, dikkat dağıtıcı unsurlardan arındırılmış, **Wordwall** ve **ScratchJr** mantığını harmanlayan tek sayfalı modern Web Portal Demosu (MVP).

---

## 🎯 Temel UI/UX ve Erişilebilirlik İlkeleri

1. **Dev Tıklama Alanları (Large Hitboxes):**
   - Tüm etkileşimli butonlar ve kartlar minimum **64x64px** boyutunda (çark butonu 110px, yön okları 72px), yuvarlatılmış köşeli (`rounded-2xl` / `rounded-3xl`) ve motor beceri kısıtları düşünülerek ferah aralıklarla yerleştirilmiştir.
2. **Dikkat Dağıtıcı Sıfırlama (Distraction-Free Minimalist UI):**
   - Arka planlar desensiz, tek renk pastel tonlardadır (`bg-slate-50`).
   - Ekran üzerinde aynı anda en fazla **3-4 ana öge** bulunur; göz yormayan, sakinleştirici renk paletleri tercih edilmiştir.
3. **Cezasız ve İpuçlu Dönüt Sistemi (Errorless Learning):**
   - Öğrenci yanlış yere tıkladığında **kırmızı uyarı, çarpı veya hata sesi KESİNLİKLE verilmez**.
   - Sistem doğru seçeneği altın sarısı yumuşak bir ışımayla (`ring-4 ring-amber-300 animate-pulse`) parlatarak öğrenciyi nazikçe yönlendirir.
   - Doğru hamlelerde ekran ortasında neşeli konfeti patlaması (`canvas-confetti`), C-majör zil sesi ve zafer fanfarı çalınır.
4. **Metinsiz ve Simgesel Anlatım:**
   - Tüm komutlar, seviyeler ve bloklar anlaşılır simgeler, büyük emojiler ve renk kodları ile temsil edilir.
   - İsteğe bağlı olarak ekrandaki yönergeleri Türkçe tane tane seslendiren dahili Sesli Rehber (TTS) butonu bulunur.
5. **Kullanılmayanlar (Çıkarılanlar):**
   - Kamera takibi (MediaPipe), ses tanıma karmaşası, küçük butonlar ve uzun okuma metinleri tamamen çıkarılmıştır.

---

## 🧩 Modüller ve Oyun Mekanizmaları

### 🎮 1. MODÜL: Wordwall Tarzı Bilişsel ve Motor Oyunlar
- **1.1. Gölgesini Bulma Oyunu (Shadow Match):**
  - Ekranda 1 adet renkli nesne kartı (Monitör, Kasa, Elma, Klavye vb.) ve altında 3 adet büyük siyah gölge silüeti kartı yer alır.
  - Doğru gölgeye tıklandığında konfeti patlar, ses çalar, +1 yıldız kazanılır.
  - Yanlış tıklandığında ceza verilmez; doğru seçenek yumuşakça parıldayarak yol gösterir.
- **1.2. Şans Çarkıfeleği (Spin Wheel):**
  - Ortasında dev bir **"ÇEVİR"** butonu bulunan yüksek kontrastlı çark.
  - Akıcı fiziksel dönüş simülasyonu ve tıkırtı sesleri.
  - Çark durduğunda çıkan görevi (ör. *"Meyveleri Sepete Taşı"*, *"Klavyede Boşluk Tuşuna Bas"*) ekranda büyük bir kart olarak gösterir. Görev tamamlanınca yıldız kazandırır.
- **1.3. Sürükle-Bırak Eşleştirme (Drag & Drop):**
  - Ekranda 3 donanım nesnesi ve bilgisayar masası üzerindeki 3 hedef yuva.
  - **Motor Kas Kısıtı Desteği:** Hem sürükle-bırak (Drag & Drop) hem de motor güçlüğü olan öğrenciler için *"Tıkla-Seç ➔ Yuvaya Dokun"* (Tap-to-Place) erişilebilir yerleştirme yöntemi.

### 🧭 2. MODÜL: Yön ve Labirent Oyunu
- 5x5 boyutlarında sade ve yüksek kontrastlı ızgara haritası.
- Sevimli Maskot Robot Robi 🤖, Hedef Yıldız ⭐ ve Taş Engeller 🪨.
- Ekranda dev boyutlu 4 yön oku (**⬆️ Yukarı, ⬇️ Aşağı, ⬅️ Sol, ➡️ Sağ**).
- Oklara veya klavye ok tuşlarına basıldığında karakter anında 1 kare hareket eder; engellere çarpıldığında yumuşakça seker; yıldıza ulaşıldığında konfeti patlar ve bir sonraki seviyeye geçilir.

### 🚀 3. MODÜL: ScratchJr Tarzı Simgesel Kodlama Modülü
- **Metinsiz Blok Kütüphanesi:**
  - 🟢 `[Başlat / Yeşil Bayrak]`
  - ➡️ `[Sağ Ok]`
  - ⬅️ `[Sol Ok]`
  - ⬆️ `[Yukarı Ok]`
  - ⬇️ `[Aşağı Ok]`
  - 🦘 `[Zıpla / Engel Geç]` (Önündeki engelin üzerinden atlar!)
- **Kodlama Çizgisi:**
  - Öğrenci bloklara dokunarak sıraya dizer (`[🟢] ➔ [➡️] ➔ [➡️] ➔ [🦘]`).
  - Bloklara dokunarak sıradan çıkarabilir veya tek tıkla temizleyebilir.
- **Oynat (Play) Butonu:**
  - Tıklandığında robot dizilen komut sırasını adım adım yürütür; çalışan blok sarı ışıkla parıldar.
  - Karakter haritadaki yıldızı topladığında büyük kutlama ve +3 yıldız ödülü verilir.

### 🛠️ 4. MODÜL: Öğretmen İçerik Stüdyosu (Teacher Studio)
- **Eşleştirme Oluşturucu:**
  - Öğretmen hazır nesne kütüphanesinden görsel seçer veya özel isim/emoji girer.
  - **"Oyunu Öğrenci Ekranına Ekle"** butonuna basıldığında sistem nesneyi otomatik olarak gölge silüetine dönüştürür ve anında Wordwall Gölge Oyununa ekler!
- **Kodlama Haritası Çizici:**
  - 5x5 interaktif harita üzerinde Başlangıç (🤖), Hedef (⭐) ve Engel (🪨) karelerini tıkla-çiz yöntemiyle belirler.
  - **"Haritayı Yayınla"** butonuna basıldığında özel labirent hem "Labirent & Yönler" hem de "ScratchJr Kodlama" modülüne anında aktarılır!
- **BEP Kazanım Raporu:**
  - MEB Bilişim Teknolojileri BEP Çerçevesi (UDA 1, UDA 2, UDA 3) kazanımlarına göre öğrencinin deneme/başarı metrikleri ve ölçüt karşılama durumu.
  - Tek tıkla yazdırılabilir veya PDF olarak kaydedilebilir rapor görünümü.

---

## 💻 Teknik Mimari

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (Yüksek Kontrast Sarı-Siyah, Mavi-Beyaz WCAG AAA temaları, Pastel tonlar)
- **Audio:** Web Audio API Procedural Synthesizer (Harici ses dosyalarına veya internet bağlantısına ihtiyaç duymadan sıfır gecikmeli procedural tınılar)
- **Animasyon:** Framer Motion & Canvas Confetti (Yalnızca ödül ve yumuşak geçişlerde)
- **İkonlar:** Lucide React

---

## 🚀 Çalıştırma

```bash
# Bağımlılıkları yükle (halihazırda yüklüdür)
npm install

# Geliştirici sunucusunu başlat
npm run dev

# Üretim derlemesi (Production Build)
npm run build
```
