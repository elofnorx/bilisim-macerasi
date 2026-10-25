import React from 'react';
import { useGame } from '../context/GameContext';
import {
  X,
  GraduationCap,
  Clock,
  CheckCircle,
  Award,
  Sparkles,
  BarChart3,
  HeartHandshake,
  Download,
  User,
  MousePointer,
  Hand,
  Mic,
} from 'lucide-react';

export const TeacherDashboardModal: React.FC = () => {
  const {
    isTeacherModalOpen,
    setIsTeacherModalOpen,
    studentSession,
    badges,
    worlds,
    mascot,
    inputMode,
    playSound,
    speakText,
    speakHover,
  } = useGame();

  if (!isTeacherModalOpen) return null;

  const totalLevels = worlds.reduce((acc, w) => acc + w.levels.length, 0);
  const completedLevels = worlds.reduce(
    (acc, w) => acc + w.levels.filter((l) => l.isCompleted).length,
    0
  );
  const completionPercentage = Math.round((completedLevels / totalLevels) * 100);

  // Süreyi dakika:saniye formatına çevir
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins} dk ${remainingSecs < 10 ? '0' : ''}${remainingSecs} sn`;
  };

  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  const handlePrintReport = () => {
    playSound('click');
    speakText('Öğrenci gelişim raporu hazırlandı.');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-4 border-amber-400 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* Üst Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-2.5 py-0.5 rounded-full">
                  MEB Bilişim Portalı
                </span>
                <span className="text-amber-100 text-xs font-bold">Özel Eğitim Takip Sistemi</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading">
                Öğretmen & Gelişim Paneli
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              setIsTeacherModalOpen(false);
              playSound('click');
            }}
            onMouseEnter={() => speakHover('Paneli kapat')}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Kapat"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* İçerik */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Öğrenci Profil Özeti */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{studentSession.studentName}</h3>
                <p className="text-xs text-slate-600">
                  Özel Eğitim Bilişim Teknolojileri Öğrencisi • Sınıf: 5/B
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              <span className="text-base">{mascot.avatarEmoji}</span>
              <span>Rehber: <strong className="text-indigo-900">{mascot.name}</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
              {inputMode === 'touch' && <MousePointer className="w-4 h-4 text-indigo-600" />}
              {inputMode === 'gesture' && <Hand className="w-4 h-4 text-amber-600" />}
              {inputMode === 'voice' && <Mic className="w-4 h-4 text-rose-600" />}
              <span>
                Girdi Modu:{' '}
                <strong className="text-indigo-900">
                  {inputMode === 'touch'
                    ? 'Dokunmatik / Fare'
                    : inputMode === 'gesture'
                    ? 'El Hareketi (Kamera)'
                    : 'Sesli Komut'}
                </strong>
              </span>
            </div>
          </div>

          {/* Temel Metrik Kartları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Süre */}
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 text-center">
              <Clock className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-indigo-800 uppercase">Toplam Süre</div>
              <div className="text-xl font-black text-indigo-950 mt-1">
                {formatTime(studentSession.timeSpentSeconds)}
              </div>
            </div>

            {/* Tamamlama Oranı */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-emerald-800 uppercase">Tamamlama</div>
              <div className="text-xl font-black text-emerald-950 mt-1">
                %{completionPercentage}
              </div>
            </div>

            {/* Doğru Hamle */}
            <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 text-center">
              <BarChart3 className="w-6 h-6 text-sky-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-sky-800 uppercase">Doğru Hamle</div>
              <div className="text-xl font-black text-sky-950 mt-1">
                {studentSession.correctMoves}
              </div>
            </div>

            {/* Teşvik Hamlesi (Hatasız Pedagoji) */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-center">
              <HeartHandshake className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <div className="text-xs font-bold text-amber-800 uppercase">Tekrar / Teşvik</div>
              <div className="text-xl font-black text-amber-950 mt-1">
                {studentSession.encouragedMoves}
              </div>
            </div>
          </div>

          {/* İlerleme Grafiği ve Açıklama Barı */}
          <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-slate-800">
              <span>Müfredat İlerleme Durumu</span>
              <span>
                {completedLevels} / {totalLevels} Seviye Tamamlandı
              </span>
            </div>
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(completionPercentage, 10)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              💡 Özel eğitim pedagojisinde hatalar ceza puanı olarak kaydedilmez; öğrencinin deneme cesareti ve azmi teşvik edilir.
            </p>
          </div>

          {/* Kazanılan Rozetler Koleksiyonu */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Kazanılan Başarı Rozetleri</span>
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                {unlockedBadgesCount} / {badges.length} Rozet Açık
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b) => {
                return (
                  <div
                    key={b.id}
                    onMouseEnter={() =>
                      speakHover(
                        `${b.title} rozeti. ${b.description}. ${
                          b.isUnlocked ? 'Kazanıldı.' : 'Henüz kilitli.'
                        }`
                      )
                    }
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                      b.isUnlocked
                        ? 'bg-amber-50 border-amber-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-50'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow">{b.emoji}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{b.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {b.description}
                      </p>
                      {b.isUnlocked && (
                        <span className="text-[9px] font-black text-amber-700 uppercase mt-0.5 inline-block">
                          ✓ Açıldı ({b.unlockedAt || 'Şimdi'})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Öğretmen Pedagojik Değerlendirme & Gözlem Notu */}
          <div className="bg-indigo-50/60 rounded-2xl p-5 border-2 border-indigo-200 space-y-2">
            <h4 className="text-sm font-black text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Öğretmen ve Uzman Gözlem Notu</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              "Öğrenci fare ile sürükleme ve eşleştirme görevinde el-göz koordinasyonunu başarıyla sergiledi.
              Klavye vadisinde düşüş hızı 'Yavaş' ayarlandığında harfleri tanıma ve tepki verme doğruluğu %90'ın üzerine çıktı.
              Sanal imleç (Dwell-click) modu el motor fonksiyonlarını desteklemek için olumlu sonuç verdi."
            </p>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              setIsTeacherModalOpen(false);
              playSound('click');
            }}
            className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-black text-sm border border-slate-300 transition-colors"
          >
            Kapat
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintReport}
              className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center gap-2 shadow-md transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Raporu Yazdır / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
