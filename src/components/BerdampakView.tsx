import React, { useState } from 'react';
import {
  RotateCw,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Target,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { NavTab } from '../types';
import { BERDAMPAK_STAGES } from '../data/appData';
import { StagePagination } from './StagePagination';
import { MikroKomitmenForm } from './MikroKomitmenForm';

interface BerdampakViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const BerdampakView: React.FC<BerdampakViewProps> = ({ onNavigate }) => {
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  const activeStep = BERDAMPAK_STAGES[selectedStepIndex];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
          <span>Siklus Mutu Berkelanjutan</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          BERDAMPAK — Siklus Penguatan Hasil
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Siklus 9 langkah BERDAMPAK menjamin bahwa pendampingan di sekolah binaan Kecamatan Tellu
          Limpoe tidak berhenti pada satu kali pertemuan, melainkan berputar secara berkelanjutan
          hingga nalar kritis siswa benar-benar membudaya di kelas.
        </p>
      </div>

      {/* Visual Circular / Cyclic Grid Presentation */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Peta Siklus 9 Huruf BERDAMPAK
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold">
              Klik Salah Satu Huruf untuk Melihat Fokus & Indikator
            </h3>
          </div>
          <div className="text-xs text-slate-400">
            Langkah Terpilih: <strong className="text-amber-400">{activeStep.letter} — {activeStep.title}</strong>
          </div>
        </div>

        {/* The 9 Step Cyclic Strip */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {BERDAMPAK_STAGES.map((step, idx) => {
            const isCurrent = selectedStepIndex === idx;
            return (
              <button
                key={`${step.letter}-${idx}`}
                id={`btn-berdampak-step-${idx}`}
                onClick={() => setSelectedStepIndex(idx)}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center relative ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/40 ring-2 ring-emerald-400 scale-105'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 mb-0.5">
                  #{idx + 1}
                </span>
                <span className="text-xl sm:text-2xl font-black text-white">
                  {step.letter}
                </span>
                <span className="text-[9px] font-semibold text-slate-300 truncate w-full mt-1">
                  {step.title.split(' ')[0]}
                </span>
                {(step.letter === 'R' || step.stepNumber === 5) && (
                  <span className="absolute -top-1.5 -right-1 px-1 py-0.2 rounded text-[8px] font-black bg-emerald-400 text-emerald-950 uppercase shadow-xs">
                    14 Hari
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cycle Flow Visual Indicator */}
        <div className="hidden md:flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-blue-300 font-semibold">
            <span>B: Data</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>E: Evaluasi</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>R: Refleksi</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-300 font-semibold">
            <span>D: Dampak</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>A: Aksi</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>M: Monitoring</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 font-semibold">
            <span>P: Perbaikan</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>A: Aktivasi</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-green-400">K: Kinerja Nyata</span>
          </div>
        </div>
      </div>

      {/* Detail Card for Active BERDAMPAK Step */}
      {activeStep && (
        <div
          id="berdampak-detail-panel"
          className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-emerald-600 text-white font-black text-3xl flex items-center justify-center shadow-lg">
                {activeStep.letter}
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Langkah ke-{activeStep.stepNumber} dari 9 Siklus BERDAMPAK
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeStep.title}
                </h3>
              </div>
            </div>

            <a
              href="#formulir-mikro-komitmen"
              className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold transition inline-flex items-center gap-2 self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Buka Formulir Mikro-Komitmen 14 Hari ↓</span>
            </a>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {activeStep.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Fokus Kegiatan */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Fokus Kegiatan</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {activeStep.activityFocus}
              </p>
            </div>

            {/* Contoh Tindakan Nyata */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Contoh Tindakan Pengawas & Guru</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {activeStep.exampleAction}
              </p>
            </div>

            {/* Bukti yang Dikumpulkan */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Bukti yang Dikumpulkan</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {activeStep.evidenceCollected}
              </p>
            </div>

            {/* Indikator Keberhasilan */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Indikator Keberhasilan</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                {activeStep.successIndicator}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formulir Mikro-Komitmen 14 Hari Guru (Inovasi Kebaruan Pengawasan Berdampak) */}
      <MikroKomitmenForm />

      <StagePagination
        prevTab="alur-gerak"
        prevLabel="Kembali ke Alur GERAK"
        nextTab="laboratorium-soal"
        nextLabel="Lanjut ke 5. Laboratorium Soal"
        onNavigate={onNavigate}
      />
    </div>
  );
};
