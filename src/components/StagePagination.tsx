import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { NavTab } from '../types';

interface StagePaginationProps {
  prevTab?: NavTab;
  prevLabel?: string;
  nextTab?: NavTab;
  nextLabel?: string;
  onNavigate: (tab: NavTab) => void;
}

export const StagePagination: React.FC<StagePaginationProps> = ({
  prevTab,
  prevLabel = 'Kembali ke Tahap Sebelumnya',
  nextTab,
  nextLabel = 'Lanjut ke Tahap Berikutnya',
  onNavigate,
}) => {
  return (
    <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      {prevTab ? (
        <button
          onClick={() => onNavigate(prevTab)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition active:scale-[0.98] shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>{prevLabel}</span>
        </button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {nextTab && (
        <button
          onClick={() => onNavigate(nextTab)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition active:scale-[0.98] shadow-md shadow-blue-600/20"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
