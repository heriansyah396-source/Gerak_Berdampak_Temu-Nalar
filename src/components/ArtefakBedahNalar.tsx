import React, { useState } from 'react';
import {
  FileSearch,
  Brain,
  MessageSquare,
  ListChecks,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Eye,
  School,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

interface ArtefakBedahNalarProps {
  currentStageLetter: 'G' | 'E' | 'R' | 'A' | 'K';
}

export const ArtefakBedahNalar: React.FC<ArtefakBedahNalarProps> = ({ currentStageLetter }) => {
  const [activeTab, setActiveTab] = useState<'matriks' | 'protokol' | 'simulasi' | 'checklist'>('matriks');
  const [expandedCase, setExpandedCase] = useState<number>(0);

  // Only render or highlight prominently for G and E
  const isG = currentStageLetter === 'G';
  const isE = currentStageLetter === 'E';

  if (!isG && !isE) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-blue-600" />
          <span>
            <strong>Catatan Kebaruan Pengawas:</strong> Pedoman Bedah Artefak Berpikir Siswa aktif terutama pada <strong>Tahap G (Gali Masalah)</strong> dan <strong>Tahap E (Evaluasi Bersama)</strong>.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="pedoman-bedah-artefak"
      className="rounded-3xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 p-6 sm:p-8 shadow-sm space-y-6 transition-all"
    >
      {/* Header Kebaruan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-blue-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kebaruan Supervisi Klinis Pengawas</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileSearch className="w-6 h-6 text-blue-600 shrink-0" />
            <span>
              Pedoman Praktik Baik: Bedah Artefak Berpikir Siswa
            </span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {isG ? (
              <>
                <strong>Fokus Tahap G (Gali Masalah Berbasis Bukti):</strong> Pengawas beralih dari sekadar memeriksa dokumen RPP administratif menjadi melacak <em>jejak nalar (thought tracing)</em> langsung pada coretan lembar kerja siswa di 25 sekolah Tellu Limpoe.
              </>
            ) : (
              <>
                <strong>Fokus Tahap E (Evaluasi Bersama Berprinsip Kemitraan):</strong> Pengawas meletakkan artefak siswa di meja diskusi sebagai cermin reflektif <em>(Non-Judgmental Clinical Inquiry)</em> untuk membangun kesadaran guru tanpa rasa diadili atau disalahkan.
              </>
            )}
          </p>
        </div>

        <div className="flex sm:flex-col items-end justify-center shrink-0">
          <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
            {isG ? 'Tahap G — Diagnostik Nalar' : 'Tahap E — Refleksi Kemitraan'}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 hidden sm:block">Perdirjen GTK 4831/2023</span>
        </div>
      </div>

      {/* Tab Navigasi Sub-Pedoman */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('matriks')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'matriks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>1. Matriks 3 Hambatan Nalar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('protokol')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'protokol'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>2. Protokol Dialog Bebas Justifikasi (O-R-I-D)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulasi')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'simulasi'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>3. Contoh Kasus Bedah Coretan Siswa</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'checklist'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ListChecks className="w-3.5 h-3.5" />
          <span>4. Checklist Observasi Pengawas</span>
        </button>
      </div>

      {/* KONTEN TAB 1: MATRIKS 3 LAPISAN HAMBATAN NALAR */}
      {activeTab === 'matriks' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Prinsip Kebaruan:</strong> Saat memeriksa lembar kerja siswa, jangan hanya memberi tanda silang (✗). Bedah coretan pensil siswa ke dalam 3 lapisan hambatan ini untuk menemukan akar masalah yang sesungguhnya.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hambatan 1 */}
            <div className="p-5 rounded-2xl bg-white border border-rose-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
                  Lapisan 1
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Taraf Teks</span>
              </div>
              <h5 className="text-sm font-extrabold text-slate-900">
                Hambatan Linguistik & Pemaknaan Teks
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Siswa gagal memahami maksud kalimat cerita. Mereka tidak bisa membedakan mana <em>informasi pendukung</em> dan mana <em>inti yang ditanyakan</em>.
              </p>
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-rose-900 text-[11px] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-rose-600" />
                  <span>Jejak Coretan yang Tampak:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600">
                  <li>Siswa mengambil sembarang angka pertama dan kedua lalu menjumlahkannya.</li>
                  <li>Tidak ada kata penanda yang digarisbawahi atau ditandai.</li>
                  <li>Kalimat tanya di akhir paragraf terlewatkan sama sekali.</li>
                </ul>
              </div>
              <div className="text-[11px] text-blue-700 font-semibold pt-1">
                👉 <strong>Rekomendasi Pengawas:</strong> Intervensi dengan strategi <em>"Baca, Tandai, Tanya"</em> (warna stabilo untuk data penting).
              </div>
            </div>

            {/* Hambatan 2 */}
            <div className="p-5 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                  Lapisan 2
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Taraf Skematis</span>
              </div>
              <h5 className="text-sm font-extrabold text-slate-900">
                Hambatan Transformasi Skematis (Representasi)
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Siswa mengerti isi cerita secara umum, tetapi bingung menerjemahkannya ke dalam model matematika atau sketsa visual diagram yang tepat.
              </p>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-amber-900 text-[11px] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-600" />
                  <span>Jejak Coretan yang Tampak:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600">
                  <li>Salah memilih operasi hitung (soal pengurangan bertingkat dihitung perkalian).</li>
                  <li>Tidak mampu menggambar skema kotak/diagram batang sederhana.</li>
                  <li>Terjebak kata pemicu semu (misal kata "seluruhnya" dianggap selalu tambah).</li>
                </ul>
              </div>
              <div className="text-[11px] text-amber-800 font-semibold pt-1">
                👉 <strong>Rekomendasi Pengawas:</strong> Gunakan strategi <em>"Sketsa Sederhana / Bar Model"</em> sebelum masuk ke rumus angka.
              </div>
            </div>

            {/* Hambatan 3 */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Lapisan 3
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">Taraf Komputasi</span>
              </div>
              <h5 className="text-sm font-extrabold text-slate-900">
                Hambatan Komputasi Teknis / Operasional
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nalar logika cerita dan model rumus matematika siswa sudah tepat, namun terjadi kesalahan teknis saat melakukan kalkulasi aritmatika.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-emerald-900 text-[11px] flex items-center gap-1">
                  <Eye className="w-3 h-3 text-emerald-600" />
                  <span>Jejak Coretan yang Tampak:</span>
                </div>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-600">
                  <li>Lupa angka simpanan pada penjumlahan/pengurangan bersusun.</li>
                  <li>Salah memposisikan koma desimal atau nilai tempat ratusan/puluhan.</li>
                  <li>Coretan hitung cakar-cakar tidak rapi sehingga salah menyalin hasil akhir.</li>
                </ul>
              </div>
              <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                👉 <strong>Rekomendasi Pengawas:</strong> Berikan penguatan pembiasaan <em>"Jelaskan Alur & Taksir Nilai Wajar"</em> untuk verifikasi mandiri.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KONTEN TAB 2: PROTOKOL DIALOG BEBAS JUSTIFIKASI (O-R-I-D) */}
      {activeTab === 'protokol' && (
        <div className="space-y-5">
          <div className="bg-indigo-50/80 border border-indigo-200 p-4 rounded-2xl">
            <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1">
              Protokol O-R-I-D: 4 Langkah Dialog Supervisi Berbasis Bukti
            </h5>
            <p className="text-xs text-indigo-950 leading-relaxed">
              Pengawas membawa 5-10 lembar sampel kerja siswa ke meja refleksi. Bersama Guru dan Kepala Sekolah, pengawas memandu percakapan tanpa mencela, menggunakan 4 tangga dialog berikut:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* O - Objective */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700 uppercase">
                <span className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-xs">O</span>
                <span>1. Observasi Objektif (Fakta Nyata)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ajak guru melihat data dan coretan siswa tanpa memberi penilaian benar/salah pada guru.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs italic text-slate-800">
                💬 <em>"Ibu Guru, mari kita perhatikan lembar kerja siswa nomor 4 ini. Dari coretan anak-anak, apa yang paling sering muncul di baris pertama cara kerja mereka?"</em>
              </div>
            </div>

            {/* R - Reflective */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 uppercase">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs">R</span>
                <span>2. Reflektif (Menyelami Pikiran Siswa)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mendorong guru berempati terhadap proses berpikir yang dirasakan siswa saat menghadapi soal cerita.
              </p>
              <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs italic text-indigo-950">
                💬 <em>"Saat siswa melihat angka 150 kg dan 3 keranjang ini, kira-kira apa yang membuat sebagian besar siswa langsung mengalikannya tanpa mengecek apakah itu sisa atau total?"</em>
              </div>
            </div>

            {/* I - Interpretive */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-700 uppercase">
                <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center text-xs">I</span>
                <span>3. Interpretatif (Menghubungkan dengan Praktik Kelas)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menghubungkan temuan coretan siswa dengan pola interaksi mengajar yang selama ini berlangsung di ruang kelas.
              </p>
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs italic text-amber-950">
                💬 <em>"Apakah selama ini kita sudah memberi jeda 3 menit bagi siswa untuk sekadar mendongengkan kembali isi soal dengan bahasa mereka sendiri sebelum menyentuh pensil hitung?"</em>
              </div>
            </div>

            {/* D - Decisional */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs">D</span>
                <span>4. Desisional (Aksi Perbaikan Berkelanjutan)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Merumuskan komitmen 1 strategi sederhana yang langsung dicoba guru pada materi berikutnya.
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs italic text-emerald-950">
                💬 <em>"Luar biasa kesadaran ini. Untuk pekan depan, teknik visual apa yang paling siap Ibu cobakan agar anak-anak terbiasa menandai kata kunci terlebih dahulu?"</em>
              </div>
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <h6 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Etika Komunikasi Pengawas: Katakan Ini vs Hindari Ini
            </h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>Hindari Kalimat Menghakimi:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  ✗ <em>"Kenapa siswa Ibu masih banyak yang salah di soal mudah ini? Padahal di RPP modul ajar Ibu tertulis strategi nalar aktif."</em>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Gunakan Kalimat Kemitraan Apresiatif:</span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  ✓ <em>"Mari kita lihat lembar ini bersama. Siswa sudah berani menuliskan jawaban. Menurut Ibu, apa yang bisa kita fasilitasi agar penalaran mereka lebih terstruktur?"</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KONTEN TAB 3: CONTOH KASUS BEDAH CORETAN SISWA */}
      {activeTab === 'simulasi' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600">
            Pilihlah salah satu contoh kasus artefak nyata yang sering dijumpai pada siswa SD/SMP di Tellu Limpoe untuk melihat cara bedah nalarnya:
          </div>

          <div className="space-y-3">
            {/* Kasus 1: Panen Padi Tellu Limpoe */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setExpandedCase(expandedCase === 0 ? -1 : 0)}
                className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h6 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Kasus Soal Cerita: Panen Padi Petani di Tellu Limpoe
                    </h6>
                    <span className="text-[11px] text-slate-500">Konteks: Operasi Hitung Bertingkat (SD Fase B/C)</span>
                  </div>
                </div>
                {expandedCase === 0 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {expandedCase === 0 && (
                <div className="p-5 space-y-4 text-xs border-t border-slate-200">
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 font-mono text-[11px] text-slate-800">
                    <strong>Teks Soal:</strong> "Pak Amir di Tellu Limpoe memanen 80 karung gabah. Sebanyak 50 karung langsung dijual ke pedagang penggilingan. Sisanya dimasukkan ke dalam 5 lumbung penyimpanan sama rata. Berapa karung isi tiap lumbung?"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                      <span className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Coretan Lembar Siswa yang Keliru:</span>
                      </span>
                      <div className="p-2.5 bg-white rounded-lg border border-rose-200 font-mono text-xs text-rose-950">
                        80 + 50 = 130 <br />
                        130 × 5 = 650 karung. <br />
                        <em>(Jawaban siswa: 650 karung)</em>
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        <strong>Diagnosis Klinis Pengawas:</strong> Terjebak pada <em>Hambatan Linguistik & Skematis</em>. Siswa tidak memahami arti kata "sisanya" dan "dijual", lalu menganggap semua angka di soal harus dijumlahkan dan dikalikan.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Coretan Nalar yang Diharapkan:</span>
                      </span>
                      <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono text-xs text-emerald-950">
                        Total panen: 80 <br />
                        Dijual: 50 ➔ Sisa = 80 - 50 = 30 <br />
                        Dibagi 5 lumbung = 30 : 5 = <strong>6 karung/lumbung</strong>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        <strong>Intervensi Pengawas ke Guru:</strong> Bimbing siswa membuat gambar kotak sederhana (80 kotak, coret 50, lalu bagi sisa 30 ke 5 wadah).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Kasus 2: PLTB Sidrap */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setExpandedCase(expandedCase === 1 ? -1 : 1)}
                className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h6 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      Kasus Soal Cerita: Kecepatan Putaran Kincir Angin PLTB Sidrap
                    </h6>
                    <span className="text-[11px] text-slate-500">Konteks: Rasio / Perbandingan Data Kontekstual (SMP Fase D)</span>
                  </div>
                </div>
                {expandedCase === 1 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {expandedCase === 1 && (
                <div className="p-5 space-y-4 text-xs border-t border-slate-200">
                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200 font-mono text-[11px] text-slate-800">
                    <strong>Teks Soal:</strong> "Satu kincir angin raksasa di PLTB Sidrap berputar menghasilkan 50 kWh listrik dalam 2 jam saat angin kencang. Jika angin stabil selama 6 jam berikutnya, berapa estimasi total daya listrik yang dihasilkan?"
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                      <span className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Coretan Lembar Siswa yang Keliru:</span>
                      </span>
                      <div className="p-2.5 bg-white rounded-lg border border-rose-200 font-mono text-xs text-rose-950">
                        50 × 6 = 300 <br />
                        300 + 2 = 302 kWh.
                      </div>
                      <p className="text-[11px] text-rose-800 leading-relaxed">
                        <strong>Diagnosis Klinis Pengawas:</strong> Siswa mengabaikan hubungan tarif (per jam). Mereka mengalikan 50 dengan 6 tanpa mencari dulu daya listrik per 1 jamnya.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Coretan Nalar yang Diharapkan:</span>
                      </span>
                      <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono text-xs text-emerald-950">
                        Daya per jam = 50 kWh : 2 jam = 25 kWh/jam <br />
                        Total 6 jam = 6 × 25 kWh = <strong>150 kWh</strong>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        <strong>Intervensi Pengawas ke Guru:</strong> Gunakan tabel proporsional (Jam vs Daya) agar siswa melihat keteraturan pola angka sebelum menghitung rumus perbandingan.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KONTEN TAB 4: CHECKLIST OBSERVASI PENGAWAS */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-600 leading-relaxed">
            Gunakan panduan checklist ini saat duduk bersama Kepala Sekolah dan Guru untuk menilai kualitas pembiasaan nalar pada lembar kerja siswa:
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'chk-1',
                title: 'Apakah siswa memberi tanda pembeda pada informasi teks?',
                desc: 'Ada garis bawah atau stabilo pada data yang diketahui vs pertanyaan yang dicari.',
                category: 'Taraf Linguistik',
              },
              {
                id: 'chk-2',
                title: 'Apakah ada diagram, sketsa kotak, atau pemodelan visual bantu?',
                desc: 'Siswa menggambar coretan visual sebelum langsung menyusun kalimat rumus hitung.',
                category: 'Taraf Representasi',
              },
              {
                id: 'chk-3',
                title: 'Apakah siswa menuliskan alasan pemilihan operasi hitung?',
                desc: 'Ada keterangan sederhana seperti: "karena dibagi rata ke 5 wadah, maka menggunakan pembagian".',
                category: 'Taraf Penalaran',
              },
              {
                id: 'chk-4',
                title: 'Apakah hasil akhir dicek kewajarannya terhadap logika dunia nyata?',
                desc: 'Siswa menyadari kejanggalan jika misalnya hasil hitung belanja uang kembalian justru bernilai lebih besar dari uang modal.',
                category: 'Taraf Refleksi Nalar',
              },
              {
                id: 'chk-5',
                title: 'Apakah dialog guru pasca-asesmen memberikan ruang diskusi?',
                desc: 'Guru bertanya "Mengapa kamu menempuh cara ini?" bukan sekadar "Siapa yang dapat nilai 100?".',
                category: 'Budaya Kelas',
              },
            ].map((chk, idx) => (
              <div
                key={chk.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3 hover:border-blue-300 transition"
              >
                <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{chk.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {chk.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{chk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info Box */}
      <div className="p-4 rounded-2xl bg-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="font-bold text-blue-200 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Kutipan Esensial Kebaruan Pengawas:</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            "Kualitas supervisi pengawas tidak lagi dinilai dari tebalnya map administrasi guru yang dicentang, melainkan dari kedalaman dialog saat membedah coretan berpikir siswa demi menemukan solusi nyata di ruang kelas."
          </p>
        </div>
      </div>
    </div>
  );
};
