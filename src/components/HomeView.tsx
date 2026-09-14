import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Brain,
  MessageSquare,
  Calculator,
  ArrowRight,
  School,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Printer,
  BookOpen,
  Award,
  Check,
} from 'lucide-react';
import { NavTab } from '../types';
import { APP_INFO } from '../data/appData';
import { StagePagination } from './StagePagination';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenPrintModal?: (schoolName?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenPrintModal }) => {
  const [activePrincipleDetail, setActivePrincipleDetail] = useState<number | null>(1);

  const principles = [
    {
      id: 1,
      title: '1. Memahami sebelum menghitung',
      tag: 'Literasi Konteks',
      icon: Brain,
      color: 'blue',
      desc: 'Mengajak siswa menggali konteks peristiwa nyata di balik cerita, bukan terburu-buru mencari operasi hitung kilat.',
      oldWay: 'Siswa langsung menyambar angka-angka di soal lalu menebak rumus tambah, kurang, atau kali.',
      newWay: 'Siswa menceritakan kembali inti masalah dengan kata-kata sendiri sebelum menyentuh angka.',
    },
    {
      id: 2,
      title: '2. Berpikir sebelum menjawab',
      tag: 'Formulasi Nalar',
      icon: Calculator,
      color: 'amber',
      desc: 'Mengidentifikasi sasaran akhir yang ditanyakan dan memilah data yang relevan agar operasi yang dipilih tepat sasaran.',
      oldWay: 'Siswa menganggap semua angka di soal harus dihitung sekaligus tanpa memfilter informasi jebakan.',
      newWay: 'Siswa membedakan informasi penting vs informasi pendukung serta merencanakan tahapan langkah nalar.',
    },
    {
      id: 3,
      title: '3. Menjelaskan sebelum menyimpulkan',
      tag: 'Komunikasi Logis',
      icon: MessageSquare,
      color: 'emerald',
      desc: 'Membiasakan siswa mengomunikasikan alasan logis di balik hasil hitungannya dengan satuan dan kesimpulan utuh.',
      oldWay: 'Siswa hanya menulis angka akhir di selembar kertas tanpa satuan dan tanpa alasan logis.',
      newWay: 'Siswa mampu menjelaskan: "Hasilnya 25 kg karena beras yang dibagikan adalah sisa setelah penjualan."',
    },
  ];

  const quickRoadmap: { tab: NavTab; num: string; title: string; desc: string }[] = [
    { tab: 'akar-masalah', num: '01', title: 'Akar Masalah', desc: 'Identifikasi 6 kendala nalar siswa' },
    { tab: 'alur-gerak', num: '02', title: 'Alur GERAK', desc: '5 aksi pendampingan pengawas' },
    { tab: 'siklus-berdampak', num: '03', title: 'Siklus BERDAMPAK', desc: '9 langkah penguatan hasil' },
    { tab: 'laboratorium-soal', num: '04', title: 'Laboratorium Soal', desc: 'Latihan nalar bertahap SD & SMP' },
    { tab: 'strategi-pembelajaran', num: '05', title: 'Strategi Guru', desc: '5 panduan praktis instruksi kelas' },
    { tab: 'instrumen-refleksi', num: '06', title: 'Refleksi Diri', desc: 'Asesmen 7 butir tanpa menyalahkan' },
    { tab: 'rencana-tindak-lanjut', num: '07', title: 'Rencana Tindak Lanjut', desc: 'Komitmen kelas berbasis bukti' },
    { tab: 'dashboard-dampak', num: '08', title: 'Dashboard Dampak', desc: 'Kalkulator kenaikan sebelum vs sesudah' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-10 text-white shadow-2xl">
        {/* Glow decorative orbs */}
        <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 top-0 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Supervisi Akademik Berdampak • Kec. Tellu Limpoe</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none text-white">
              GERAK BERDAMPAK
            </h1>
            <h2 className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 pt-1">
              Temu Nalar Literasi-Numerasi
            </h2>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Pendampingan pengawas sekolah berbasis data untuk memberdayakan guru dan kepala sekolah,
            memampukan siswa <strong>memahami teks</strong>, <strong>berpikir kritis</strong>, dan{' '}
            <strong>mengomunikasikan solusi numerasi</strong> secara logis.
          </p>

          {/* Quotation Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 my-4 shadow-inner">
            <div className="flex items-start gap-3">
              <span className="text-3xl leading-none font-serif text-amber-400 select-none">“</span>
              <p className="text-sm sm:text-base font-medium text-slate-100 italic leading-snug font-serif-quote">
                Masalah numerasi tidak selalu dimulai dari hitungan. Sering kali, siswa belum memahami
                informasi yang harus dihitung.
              </p>
            </div>
            <div className="text-right text-[11px] text-amber-300/80 font-medium mt-1">
              — Prinsip Inti Temu Nalar Literasi-Numerasi
            </div>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-emerald-400">25</div>
              <div className="text-[11px] text-slate-400 font-medium">Sekolah Binaan (21 SD • 4 SMP)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-blue-400">5 Tahap</div>
              <div className="text-[11px] text-slate-400 font-medium">Alur GERAK</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-purple-400">9 Langkah</div>
              <div className="text-[11px] text-slate-400 font-medium">Siklus BERDAMPAK</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-lg font-black text-amber-400">5 Strategi</div>
              <div className="text-[11px] text-slate-400 font-medium">Praktik di Kelas</div>
            </div>
          </div>

          {/* 4 Main Action Buttons */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              id="btn-home-eksplorasi"
              onClick={() => onNavigate('alur-gerak')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-blue-600/30 active:scale-[0.98] group"
            >
              <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>1. Alur Tindakan GERAK</span>
            </button>

            <button
              id="btn-home-identifikasi"
              onClick={() => onNavigate('akar-masalah')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-amber-600/30 active:scale-[0.98]"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>2. Akar Masalah Siswa</span>
            </button>

            <button
              id="btn-home-lab"
              onClick={() => onNavigate('laboratorium-soal')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
            >
              <Lightbulb className="w-4 h-4" />
              <span>3. Lab Soal Interaktif</span>
            </button>

            <button
              id="btn-home-dampak"
              onClick={() => onNavigate('dashboard-dampak')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold border border-slate-700 transition active:scale-[0.98]"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>4. Dashboard Dampak</span>
            </button>
          </div>
        </div>
      </div>

      {/* Identitas Pengembang & Wilayah Sasaran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-blue-300 transition">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Pengembang & Pengawas Pembina
            </div>
            <div className="text-base font-extrabold text-slate-900 leading-snug">
              {APP_INFO.developer}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Pengawas Sekolah Dinas Pendidikan & Kebudayaan Kab. Sidrap
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4 hover:border-emerald-300 transition">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <School className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              Wilayah Sasaran Dampingan
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              Kecamatan Tellu Limpoe, Kabupaten Sidenreng Rappang
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Satuan Pendidikan SD & SMP (Kepala Sekolah & Dewan Guru)
            </div>
          </div>
        </div>
      </div>

      {/* 3 Prinsip Nalar dengan Perbandingan Kelas */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Fondasi Pedagogik</span>
            <h3 className="text-xl font-extrabold text-slate-900">Tiga Prinsip Temu Nalar</h3>
          </div>
          <span className="text-xs text-slate-500">
            Klik kartu di bawah untuk melihat perbedaan di kelas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {principles.map((pr) => {
            const Icon = pr.icon;
            const isExpanded = activePrincipleDetail === pr.id;
            return (
              <div
                key={pr.id}
                onClick={() => setActivePrincipleDetail(isExpanded ? null : pr.id)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isExpanded
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        pr.color === 'blue'
                          ? 'bg-blue-50 text-blue-600'
                          : pr.color === 'amber'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {pr.tag}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                    {pr.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {pr.desc}
                  </p>
                </div>

                {/* Expanded Comparison Box */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs animate-in fade-in duration-200">
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80">
                      <span className="font-bold text-rose-800 block text-[11px] mb-0.5">
                        ❌ Pola Lama yang Menjebak:
                      </span>
                      <p className="text-rose-950 text-[11px] leading-relaxed">{pr.oldWay}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                      <span className="font-bold text-emerald-800 block text-[11px] mb-0.5">
                        ✅ Pembiasaan Temu Nalar:
                      </span>
                      <p className="text-emerald-950 text-[11px] leading-relaxed">{pr.newWay}</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <span>{isExpanded ? 'Tutup perbandingan' : 'Lihat perbandingan di kelas'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alur 8 Langkah Terpadu (Clickable) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
              Alur Kerja Terpadu Supervisi Akademik
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              8 Langkah Transformasi Pembelajaran Kelas
            </h3>
          </div>
          <span className="text-xs text-slate-400">Klik modul untuk langsung menuju halaman</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickRoadmap.map((step) => (
            <button
              key={step.tab}
              onClick={() => onNavigate(step.tab)}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500 hover:bg-slate-850 text-left transition-all duration-150 group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {step.num}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                {step.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                {step.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Panduan Pendampingan Cepat & Akses Cetak Dokumen */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Dokumentasi Resmi Hasil Supervisi</span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
            Siap Cetak Laporan Supervisi Resmi Pengawas Sekolah?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Format laporan resmi dengan Kop Dinas Pendidikan Kab. Sidrap, rekap capaian sebelum-sesudah,
            lembar komitmen RTL, serta kolom tanda tangan tiga pihak (Pengawas, Kepala Sekolah, dan Guru Dampingan).
          </p>
        </div>

        {onOpenPrintModal && (
          <button
            onClick={onOpenPrintModal}
            id="btn-home-trigger-print"
            className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-700/20 transition active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Buka Format Cetak Laporan</span>
          </button>
        )}
      </div>

      <StagePagination
        nextTab="akar-masalah"
        nextLabel="Lanjut ke 2. Akar Masalah & Peta Nalar"
        onNavigate={onNavigate}
      />
    </div>
  );
};

