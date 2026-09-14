import React, { useState } from 'react';
import {
  BookOpenCheck,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  School,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { TeachingStrategy, ActionPlanItem, NavTab } from '../types';
import { TEACHING_STRATEGIES, SCHOOL_LIST_TELLU_LIMPOE, OFFICIAL_SCHOOLS_TELLU_LIMPOE } from '../data/appData';
import { saveActionPlan } from '../utils/storage';
import { StagePagination } from './StagePagination';

interface StrategiesViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const StrategiesView: React.FC<StrategiesViewProps> = ({ onNavigate }) => {
  const [selectedStrategyId, setSelectedStrategyId] = useState<number>(1);
  const [modalStrategy, setModalStrategy] = useState<TeachingStrategy | null>(null);

  // Modal form states
  const [modalSchool, setModalSchool] = useState<string>(SCHOOL_LIST_TELLU_LIMPOE[0]);
  const [modalTeacher, setModalTeacher] = useState<string>('');
  const [modalLevel, setModalLevel] = useState<'SD' | 'SMP'>('SD');
  const [modalSubject, setModalSubject] = useState<string>('Matematika / Tematik');
  const [modalTime, setModalTime] = useState<string>('2 Pekan (Materi Operasi Hitung Campuran)');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const activeStrategy =
    TEACHING_STRATEGIES.find((s) => s.id === selectedStrategyId) || TEACHING_STRATEGIES[0];

  const handleOpenPlanModal = (strat: TeachingStrategy) => {
    setModalStrategy(strat);
    setSaveSuccess(false);
  };

  const handleSaveToRtl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalStrategy) return;

    const newPlan: ActionPlanItem = {
      id: `rtl-from-strat-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      schoolName: modalSchool,
      teacherName: modalTeacher.trim() || 'Guru Dampingan',
      level: modalLevel,
      mainProblem: `Siswa membutuhkan penguatan nalar melalui ${modalStrategy.title}`,
      improvementGoal: modalStrategy.goal,
      selectedStrategy: modalStrategy.title,
      executionTime: modalTime,
      successEvidence: `Lembar kerja siswa, rekaman dialog, dan ${modalStrategy.successIndicators[0]}`,
      followUp: 'Refleksi pasca penerapan bersama Pengawas Sekolah Heriansyah',
      status: 'Direncanakan',
    };

    saveActionPlan(newPlan);
    setSaveSuccess(true);
    setTimeout(() => {
      setModalStrategy(null);
      setSaveSuccess(false);
      onNavigate('rencana-tindak-lanjut');
    }, 1500);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <BookOpenCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Solusi Praktis di Ruang Kelas</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Strategi Praktis untuk Guru
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Lima strategi aplikatif yang dapat langsung diterapkan guru di kelas SD maupun SMP untuk
          mengubah kebiasaan siswa dari "langsung menghitung" menjadi "memahami konteks masalah
          terlebih dahulu".
        </p>
      </div>

      {/* 5 Strategy Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {TEACHING_STRATEGIES.map((st) => {
          const isActive = selectedStrategyId === st.id;
          return (
            <button
              key={st.id}
              id={`btn-strat-tab-${st.id}`}
              onClick={() => setSelectedStrategyId(st.id)}
              className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-950/20 ring-2 ring-blue-500'
                  : 'bg-white text-slate-800 border-slate-200/90 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {st.number}
                </span>
                <span className={`text-[10px] font-bold ${isActive ? 'text-amber-300' : 'text-slate-400'}`}>
                  SD & SMP
                </span>
              </div>
              <div className={`text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                {st.title.replace(/^Strategi \d+ — /, '')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Strategy Deep Detail Panel */}
      {activeStrategy && (
        <div
          id="strategy-detail-card"
          className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Panduan Praktik Baik Guru
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {activeStrategy.title}
              </h3>
              <p className="text-xs text-slate-500 italic mt-0.5">{activeStrategy.tagline}</p>
            </div>

            <button
              id="btn-coba-strategi-ini"
              onClick={() => handleOpenPlanModal(activeStrategy)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition active:scale-[0.98] self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Coba Strategi Ini</span>
            </button>
          </div>

          {/* Tujuan */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1">
              Tujuan Strategi
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              {activeStrategy.goal}
            </p>
          </div>

          {/* Langkah Penerapan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Langkah-Langkah Penerapan di Kelas:
            </h4>
            <div className="space-y-2">
              {activeStrategy.implementationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="leading-relaxed">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Script Guru & Respons Siswa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Contoh Instruksi Guru (Ucapkan di Kelas)</span>
              </div>
              <p className="text-xs sm:text-sm italic text-amber-950 leading-relaxed font-serif">
                {activeStrategy.teacherScriptExample}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Contoh Respons Nalar Siswa</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                {activeStrategy.studentResponseExample}
              </p>
            </div>
          </div>

          {/* Indikator Keberhasilan */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Indikator Keberhasilan di Kelas</span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-200 space-y-1.5 list-disc list-inside">
              {activeStrategy.successIndicators.map((ind, idx) => (
                <li key={idx} className="leading-relaxed">
                  {ind}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* MODAL / FORM "COBA STRATEGI INI" */}
      {modalStrategy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs cursor-pointer"
          onClick={() => setModalStrategy(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Rancang Aksi Kelas
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {modalStrategy.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalStrategy(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4 pointer-events-none" />
                <span>Tutup</span>
              </button>
            </div>

            {saveSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="text-base font-bold text-emerald-900">
                  Rencana Tindakan Berhasil Disimpan!
                </div>
                <p className="text-xs text-emerald-700">
                  Mengalihkan ke halaman Rencana Tindak Lanjut (RTL)...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveToRtl} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Sekolah Binaan (25 Sekolah)
                    </label>
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      Tellu Limpoe
                    </span>
                  </div>
                  <select
                    value={modalSchool}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setModalSchool(selected);
                      const found = OFFICIAL_SCHOOLS_TELLU_LIMPOE.find((s) => s.name === selected);
                      if (found) {
                        setModalLevel(found.level);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <optgroup label="Sekolah Dasar (SD) — 21 Sekolah Binaan">
                      {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SD').map((sch) => (
                        <option key={sch.name} value={sch.name}>
                          {sch.no}. {sch.name} ({sch.type})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Sekolah Menengah Pertama (SMP) — 4 Sekolah Binaan">
                      {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SMP').map((sch) => (
                        <option key={sch.name} value={sch.name}>
                          {sch.no}. {sch.name} ({sch.type})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jenjang
                    </label>
                    <div className="flex gap-2">
                      {(['SD', 'SMP'] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setModalLevel(l)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                            modalLevel === l
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Guru
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Herlina, S.Pd."
                      value={modalTeacher}
                      onChange={(e) => setModalTeacher(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mata Pelajaran / Topik
                  </label>
                  <input
                    type="text"
                    required
                    value={modalSubject}
                    onChange={(e) => setModalSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu & Durasi Penerapan
                  </label>
                  <input
                    type="text"
                    required
                    value={modalTime}
                    onChange={(e) => setModalTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalStrategy(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
                  >
                    Simpan ke RTL
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <StagePagination
        prevTab="laboratorium-soal"
        prevLabel="Kembali ke Lab Soal"
        nextTab="instrumen-refleksi"
        nextLabel="Lanjut ke 7. Instrumen Refleksi"
        onNavigate={onNavigate}
      />
    </div>
  );
};
