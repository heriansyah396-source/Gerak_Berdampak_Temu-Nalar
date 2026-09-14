import React from 'react';
import {
  Menu,
  Printer,
  Sparkles,
  ChevronRight,
  HelpCircle,
  School,
} from 'lucide-react';
import { NavTab } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobileNav: () => void;
  onOpenPrintModal: () => void;
  onOpenHelpModal: () => void;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string; step: string }> = {
  beranda: {
    step: 'Tahap 1',
    title: 'Beranda & Pusat Panduan',
    subtitle: 'Orientasi Pendampingan Supervisi Temu Nalar Lit-Num Siswa',
  },
  'akar-masalah': {
    step: 'Tahap 2',
    title: 'Akar Masalah & Peta Alur Nalar',
    subtitle: 'Mendiagnosis kendala nalar literasi-numerasi siswa',
  },
  'alur-gerak': {
    step: 'Tahap 3',
    title: 'Alur Tindakan GERAK',
    subtitle: 'Kerangka kerja pendampingan pengawas sekolah ke guru binaan',
  },
  'siklus-berdampak': {
    step: 'Tahap 4',
    title: 'Siklus Penguatan BERDAMPAK',
    subtitle: '9 Langkah siklus penguatan hasil mutu pembelajaran berkelanjutan',
  },
  'laboratorium-soal': {
    step: 'Tahap 5',
    title: 'Laboratorium Soal Kontekstual',
    subtitle: 'Baca, Pahami, Hitung, dan Jelaskan — Mode Siswa & Mode Guru',
  },
  'strategi-pembelajaran': {
    step: 'Tahap 6',
    title: '5 Strategi Pembelajaran Praktis',
    subtitle: 'Panduan instruksi langsung di kelas dan respons nalar siswa',
  },
  'instrumen-refleksi': {
    step: 'Tahap 7',
    title: 'Instrumen Refleksi Guru & KS',
    subtitle: 'Refleksi kebiasaan mengajar literasi-numerasi tanpa menyalahkan',
  },
  'rencana-tindak-lanjut': {
    step: 'Tahap 8',
    title: 'Rencana Tindak Lanjut (RTL)',
    subtitle: 'Penyusunan komitmen perbaikan kelas berbasis bukti nyata',
  },
  'dashboard-dampak': {
    step: 'Tahap 9',
    title: 'Dashboard Dampak & Kalkulator',
    subtitle: 'Pemantauan persentase keberhasilan sebelum dan sesudah pendampingan',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileNav,
  onOpenPrintModal,
  onOpenHelpModal,
}) => {
  const currentInfo = TAB_TITLES[currentTab] || {
    step: 'Tahap 1',
    title: 'GERAK BERDAMPAK',
    subtitle: 'Temu Nalar Literasi-Numerasi',
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="btn-mobile-menu-toggle"
          onClick={onOpenMobileNav}
          className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition focus:outline-hidden"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-0.5">
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100 text-[10px]">
              {currentInfo.step}
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600 font-medium truncate hidden sm:inline">GERAK BERDAMPAK</span>
            <ChevronRight className="w-3 h-3 text-slate-400 hidden sm:inline" />
            <span className="text-blue-600 font-semibold truncate capitalize">
              {currentTab.replace(/-/g, ' ')}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight truncate">
            {currentInfo.title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden xl:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/60 mr-1">
          <School className="w-3.5 h-3.5 text-blue-600" />
          <span>Kec. Tellu Limpoe</span>
        </div>

        <button
          onClick={onOpenHelpModal}
          id="btn-quick-help"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-xs font-semibold transition shadow-2xs"
          title="Panduan Alur Pendampingan"
        >
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Panduan</span>
        </button>

        <button
          onClick={onOpenPrintModal}
          id="btn-header-print"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-sm shadow-emerald-700/20 active:scale-[0.98]"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">Cetak Dokumen</span>
        </button>
      </div>
    </header>
  );
};

