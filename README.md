# 🚀 Bilişim Macerası: Çoklu Etkileşimli ve Oyunlaştırılmış Web Tabanlı Öğrenme Portalı (MVP)

**MEB Özel Eğitim Bilişim Teknolojileri** dersi öğretim programına uygun olarak geliştirilmiş; özel gereksinimli (öğrenme güçlüğü, otizm spektrumu, bedensel/motor engeller veya dikkat eksikliği olan) öğrencilerin dijital okuryazarlık becerilerini geliştiren erişilebilir, oyunlaştırılmış ve çok modlu web öğrenme platformudur.

---

## 🌟 Öne Çıkan Özellikler ve Kapsayıcı Tasarım (EdTech & A11y)

### 1. Çoklu Girdi ve Etkileşim Simülasyonu
- **👆 Fare ve Dokunmatik Modu:** Standart etkileşim, akıllı tahta ve tabletlerle tam uyumlu geniş dokunma alanları (min 48x48px).
- **🖐️ Kamera ve El Hareketi (Gesture) Modu (MediaPipe Simülasyonu):**
  - Ekranda parlayan ve el hareketlerini takip eden **Sanal İmleç (Virtual Cursor)**.
  - **Dwell-Click (Duraklama ile Otomatik Tıklama):** Motor becerilerinde tıklama güçlüğü çeken öğrenciler için, imleç bir buton üzerinde 1.2 saniye durakladığında dairesel ilerleme çubuğu dolarak otomatik tıklar.
  - Canlı el iskeleti (MediaPipe Hand Landmark) görselleştirmesi.
- **🎙️ Sesli Komut Modu (Web Speech API):**
  - `"Başla"`, `"Harita"`, `"Monitör"`, `"Kasa"`, `"Klavye"`, `"Fare"`, `"Öğretmen"`, `"Yardım"` veya harfleri sesli söyleyerek eller serbest portal kontrolü.
  - Mikrofonu olmayan cihazlar için tek tıkla ses simülasyon çipleri.

### 2. Sesli Okuma (TTS) & Hover-to-Speak
- Tarayıcının dahili `window.speechSynthesis` API'si üzerinden net Türkçe telaffuz (`tr-TR`).
- Özel eğitime uygun anlaşılır konuşma hızı (`rate: 0.92`).
- **Hover-to-Speak:** İmleç veya odaklanma herhangi bir butonun/kartın üzerine geldiğinde metin ve açıklamalar otomatik Türkçe seslendirilir.
- Her an tek tıkla açılıp kapatılabilen global ses kontrolü.

### 3. Pedagojik Teşvik ve Hatasızlaştırılmış Geri Bildirim
- **Ceza veya olumsuz ses YOKTUR!**
- Yanlış hamlelerde kırmızı çarpı yerine yumuşak melodiler eşliğinde teşvik edici geri bildirim verilir:
  > *"Neredeyse oluyordu, tekrar dene! 🌟 İpucu: Şekline ve silüetine dikkat et."*
- Başarılı görevlerde konfeti patlamaları, 3 yıldız derecelendirmesi ve neşeli zafer fanfarları.

### 4. Ekranlar ve Oyun Modülleri
1. **Giriş ve Onboarding:**
   - 3 Sevimli Maskot Seçimi: **Robot Robi 🤖**, **Bilge Baykuş 🦉**, **Neşeli Yıldız ⭐**.
   - Girdi Yöntemi Seçimi (Fare, Kamera, Ses).
   - Yüksek Kontrast Seçenekleri (Standart Canlı, Sarı-Siyah Yüksek Kontrast, Mavi-Beyaz Okuma Teması).
2. **İnteraktif Yol Haritası (World Map):**
   - 🏝️ **1. Dünya: Fare ve Dokunma Adası** (Açık - 3 Mikro Seviye)
   - ⌨️ **2. Dünya: Klavye Vadisi** (Açık - 3 Mikro Seviye)
   - 🖥️ **3. Dünya: Donanım ve Güvenlik Şehri** (Kilitli & Keşfedilebilir)
3. **Oyun 1 (Donanım Parçalarını Eşleştirme):**
   - Bilgisayar donanım parçalarını (Monitör, Kasa, Klavye, Fare) çalışma masasındaki doğru silüet yuvalarına yerleştirme.
   - **Çift Yönlü Etkileşim:** Hem sürükle-bırak (Drag & Drop), hem de sürükleyemeyen öğrenciler için *"Parçaya tıkla ➔ Hedefe tıkla"* erişilebilir yerleştirme!
4. **Oyun 2 (Klavye & Harf Balonları Patlatma):**
   - Gökyüzünden süzülen harf balonlarını klavyeden basarak, ekrandaki sanal tuşlara dokunarak veya sesli söyleyerek patlatma.
   - Ayarlanabilir düşüş hızı (Yavaş / Normal).
   - Kombo ve seri çarpanları.
5. **Öğretmen & İlerleme Paneli (Dashboard Modal):**
   - Toplam harcanan öğrenme süresi (canlı sayaç).
   - Müfredat tamamlama oranı (%) ve doğru / teşvik hamleleri istatistiği.
   - Kazanılan başarı rozetleri vitrini.
   - Uzman ve öğretmen pedagojik gözlem notu.
   - Yazdırma ve PDF rapor çıktısı desteği.

---

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda başlatmak için:

```bash
# Bağımlılıkları yükleyin (zaten kuruldu)
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim (Production) derlemesi alın
npm run build

# Derlemeyi önizleyin
npm run preview
```

Varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.
