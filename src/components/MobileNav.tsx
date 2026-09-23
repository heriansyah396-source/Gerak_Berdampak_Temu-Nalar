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
  X,
  Sparkles,
  School,
  UserCheck,
  Database,
  Printer,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { NavTab } from '../types';
import { APP_INFO } from '../data/appData';
import { resetAllData } from '../utils/storage';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPrintModal: () => void;
  onOpenBackupModal?: () => void;
  onResetData?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenPrintModal,
  onOpenBackupModal,
  onResetData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setShowResetConfirm(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    onClose();
    if (onResetData) {
      onResetData();
    } else {
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop with fade-in */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer with slide-in from left */}
      <div className="relative w-[85%] max-w-xs bg-slate-950 text-slate-100 flex flex-col h-full shadow-2xl z-10 border-r border-slate-800 animate-in slide-in-from-left duration-200">
        {/* Brand Header & Close Button */}
        <div className="p-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-2 ring-white/10 shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black tracking-wider text-emerald-400 uppercase">Supervisi</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[9.5px] text-slate-400">Lit-Num</span>
              </div>
              <h2 className="text-sm font-extrabold tracking-tight text-white leading-tight truncate">
                GERAK BERDAMPAK
              </h2>
              <p className="text-[10.5px] text-blue-300 font-medium truncate">Temu Nalar Siswa</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 hover:text-white text-slate-300 transition shrink-0 cursor-pointer shadow-xs"
            aria-label="Tutup Menu Navigasi"
          >
            <X className="w-5 h-5 pointer-events-none" />
          </button>
        </div>

        {/* Profile Card of Pengawas */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 text-[11px] space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Pengawas Pembina</span>
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

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Menu Pendampingan</span>
            <span>9 Tahap</span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.num}
                  </span>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons in Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-2">
          <button
            type="button"
            onClick={() => {
              onOpenPrintModal();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold text-center transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 active:scale-[0.98] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Supervisi</span>
          </button>

          {onOpenBackupModal && (
            <button
              type="button"
              onClick={() => {
                onOpenBackupModal();
                onClose();
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer active:scale-[0.98]"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Cadangkan & Pulihkan Data</span>
            </button>
          )}

          {/* Reset App Data confirmation on mobile */}
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-1.5 text-[10.5px] text-slate-500 hover:text-rose-400 font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data Aplikasi</span>
            </button>
          ) : (
            <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-900/60 text-center space-y-1.5">
              <p className="text-[10px] text-rose-300 font-semibold leading-tight">
                Yakin reset semua data supervisi ke awal?
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="flex-1 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition cursor-pointer"
                >
                  Ya, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-medium transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
