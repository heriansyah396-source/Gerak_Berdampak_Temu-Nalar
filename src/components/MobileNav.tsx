import React from 'react';
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
} from 'lucide-react';
import { NavTab } from '../types';
import { APP_INFO } from '../data/appData';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenPrintModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentTab,
  onSelectTab,
  onOpenPrintModal,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const menuItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'beranda', label: '1. Beranda', icon: Home },
    { id: 'akar-masalah', label: '2. Akar Masalah', icon: AlertTriangle },
    { id: 'alur-gerak', label: '3. Alur GERAK', icon: GitMerge },
    { id: 'siklus-berdampak', label: '4. Siklus BERDAMPAK', icon: RotateCw },
    { id: 'laboratorium-soal', label: '5. Lab Soal', icon: FlaskConical },
    { id: 'strategi-pembelajaran', label: '6. Strategi', icon: BookOpenCheck },
    { id: 'instrumen-refleksi', label: '7. Refleksi', icon: ClipboardCheck },
    { id: 'rencana-tindak-lanjut', label: '8. RTL', icon: FileSpreadsheet },
    { id: 'dashboard-dampak', label: '9. Dashboard Dampak', icon: BarChart3 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-slate-900 text-white flex flex-col h-full shadow-2xl z-10 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">GERAK BERDAMPAK</h2>
              <p className="text-[10px] text-blue-400">Tellu Limpoe, Sidrap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-slate-950/40 text-[11px] text-slate-400 border-b border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <School className="w-3.5 h-3.5" />
            <span>Kecamatan Tellu Limpoe, Sidrap</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{APP_INFO.developer}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={() => {
              onOpenPrintModal();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition"
          >
            Cetak Dokumen Supervisi
          </button>
        </div>
      </div>
    </div>
  );
};
