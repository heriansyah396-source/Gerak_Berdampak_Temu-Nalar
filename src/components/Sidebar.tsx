import React, { useState } from 'react';
import {
  Home,
  AlertTriangle,
  GitMerge,
  RotateCw,
  FlaskConical,
  BookOpenCheck,
  ClipboardCheck,
  FileSpreadsheet,
  BarChart3,
  Printer,
  RotateCcw,
  Sparkles,
  School,
  UserCheck,
  CheckCircle,
  ExternalLink,
  Database,
} from 'lucide-react';
import { NavTab } from '../types';
import { APP_INFO } from '../data/appData';
import { resetAllData } from '../utils/storage';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPrintModal: () => void;
  onOpenBackupModal?: () => void;
  onResetData?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenPrintModal,
  onOpenBackupModal,
  onResetData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const menuItems: { id: NavTab; num: string; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'beranda', num: '01', label: 'Beranda & Pengantar', icon: Home },
    { id: 'akar-masalah', num: '02', label: 'Akar Masalah & Peta', icon: AlertTriangle },
    { id: 'alur-gerak', num: '03', label: 'Alur Tindakan GERAK', icon: GitMerge },
    { id: 'siklus-berdampak', num: '04', label: 'Siklus BERDAMPAK', icon: RotateCw },
    { id: 'laboratorium-soal', num: '05', label: 'Laboratorium Soal', icon: FlaskConical, badge: 'Interaktif' },
    { id: 'strategi-pembelajaran', num: '06', label: 'Strategi Praktis Guru', icon: BookOpenCheck },
    { id: 'instrumen-refleksi', num: '07', label: 'Instrumen Refleksi', icon: ClipboardCheck },
    { id: 'rencana-tindak-lanjut', num: '08', label: 'Rencana Tindak Lanjut', icon: FileSpreadsheet },
    { id: 'dashboard-dampak', num: '09', label: 'Dashboard Dampak', icon: BarChart3 },
  ];

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    if (onResetData) {
      onResetData();
    } else {
      window.location.reload();
    }
  };

  return (
    <aside className="w-72 bg-slate-950 text-slate-100 flex flex-col h-screen fixed top-0 left-0 border-r border-slate-800/80 shadow-2xl z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-2 ring-white/10 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">Supervisi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] text-slate-400">Lit-Num</span>
            </div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-tight truncate">
              GERAK BERDAMPAK
            </h1>
            <p className="text-[11px] text-blue-300 font-medium truncate">Temu Nalar Siswa</p>
          </div>
        </div>

        {/* Profile Card of Pengawas */}
        <div className="mt-3.5 bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-[11px] space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pengawas Pembina</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold border border-emerald-500/20">
              <CheckCircle className="w-2.5 h-2.5" /> Aktif
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-white font-semibold truncate">
            <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate" title={APP_INFO.developer}>{APP_INFO.developer}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] truncate">
            <School className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">Kec. Tellu Limpoe, Kab. Sidrap</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">
          <span>Menu Pendampingan</span>
          <span className="text-[9px] text-slate-400 font-mono">9 TAHAP</span>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/40'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className={`text-[10px] font-mono font-bold w-5 text-center ${
                    isActive ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                >
                  {item.num}
                </span>
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                    isActive
                      ? 'bg-blue-900 text-amber-300 border border-blue-400/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-slate-800/90 bg-slate-950 space-y-2">
        <button
          id="sidebar-print-btn"
          onClick={onOpenPrintModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-md shadow-emerald-900/30 active:scale-[0.98]"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Dokumen Supervisi</span>
        </button>

        {onOpenBackupModal && (
          <button
            id="sidebar-backup-btn"
            onClick={onOpenBackupModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition active:scale-[0.98]"
            title="Cadangkan (Backup) atau Pulihkan (Restore) data JSON aplikasi"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Cadangkan & Pulihkan Data</span>
          </button>
        )}

        {!showResetConfirm ? (
          <button
            id="sidebar-reset-btn"
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 text-[11px] font-medium transition"
            title="Mengembalikan data simulasi awal"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data Simulasi</span>
          </button>
        ) : (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-center space-y-1.5">
            <p className="text-[10px] text-rose-300 font-medium">Kembalikan ke data bawaan?</p>
            <div className="flex items-center gap-1.5 justify-center">
              <button
                onClick={handleConfirmReset}
                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
              >
                Ya, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

