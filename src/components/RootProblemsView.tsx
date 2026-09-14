import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Calculator,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { RootProblemItem, ProblemFlowStep, NavTab } from '../types';
import { ROOT_PROBLEMS, PROBLEM_FLOW_STEPS } from '../data/appData';
import { getObservedProblems, toggleObservedProblem } from '../utils/storage';
import { StagePagination } from './StagePagination';

interface RootProblemsViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const RootProblemsView: React.FC<RootProblemsViewProps> = ({ onNavigate }) => {
  const [selectedProblemId, setSelectedProblemId] = useState<number>(1);
  const [selectedFlowStepId, setSelectedFlowStepId] = useState<number>(1);
  const [observedIds, setObservedIds] = useState<number[]>(getObservedProblems());

  const selectedProblem =
    ROOT_PROBLEMS.find((p) => p.id === selectedProblemId) || ROOT_PROBLEMS[0];
  const selectedFlow =
    PROBLEM_FLOW_STEPS.find((s) => s.id === selectedFlowStepId) || PROBLEM_FLOW_STEPS[0];

  const handleToggleObserved = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleObservedProblem(id);
    setObservedIds(updated);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* SECTION 1: AKAR MASALAH */}
      <section className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Diagnosis Awal Pembelajaran</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Akar Masalah Literasi dan Numerasi
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
            Selama ini, pembelajaran numerasi sering berfokus pada rumus dan latihan hitung. Padahal,
            siswa dapat mengalami kesulitan sebelum sampai pada proses berhitung, yaitu ketika
            memahami isi soal.
          </p>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">
              Masalah Utama
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900">
              Siswa membaca, tetapi belum memahami isi informasi.
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Klik salah satu dari 6 kartu di bawah untuk menelaah perilaku siswa, dampaknya pada
              literasi-numerasi, dan pertanyaan refleksi pendampingan.
            </p>
          </div>
        </div>

        {/* 6 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROOT_PROBLEMS.map((prob) => {
            const isSelected = selectedProblemId === prob.id;
            const isObserved = observedIds.includes(prob.id);

            return (
              <div
                key={prob.id}
                id={`problem-card-${prob.id}`}
                onClick={() => setSelectedProblemId(prob.id)}
                className={`relative cursor-pointer p-5 rounded-2xl border transition-all duration-200 text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-950/20 ring-2 ring-blue-500'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        isSelected
                          ? 'bg-blue-800 text-blue-200 border border-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Masalah {prob.id}
                    </span>

                    <button
                      onClick={(e) => handleToggleObserved(prob.id, e)}
                      title={isObserved ? 'Sudah ditandai teramati di kelas' : 'Tandai jika teramati di kelas'}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition ${
                        isObserved
                          ? isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isSelected
                          ? 'bg-blue-800/80 text-blue-300 hover:bg-blue-700'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>{isObserved ? 'Teramati di Kelas' : 'Tandai'}</span>
                    </button>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold leading-snug mb-2 ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {prob.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed line-clamp-3 ${
                      isSelected ? 'text-blue-100' : 'text-slate-600'
                    }`}
                  >
                    {prob.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? 'text-amber-300' : 'text-blue-600'}>
                    {isSelected ? 'Sedang Ditelaah' : 'Klik untuk Detail'}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Problem Deep Detail */}
        {selectedProblem && (
          <div
            id="problem-detail-box"
            className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200 shadow-lg space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Telaah Mendalam Masalah {selectedProblem.id}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {selectedProblem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleToggleObserved(selectedProblem.id, e)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    observedIds.includes(selectedProblem.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {observedIds.includes(selectedProblem.id)
                      ? 'Tercatat Sering Terjadi di Kelas Binaan'
                      : 'Tandai Ditemukan di Sekolah Binaan'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Penjelasan Masalah
                </h4>
                <p className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {selectedProblem.explanation}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Contoh Perilaku Siswa</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {selectedProblem.studentBehavior}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Dampak terhadap Literasi</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {selectedProblem.literacyImpact}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Dampak terhadap Numerasi</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {selectedProblem.numeracyImpact}
                  </p>
                </div>
              </div>

              {/* Pertanyaan Refleksi & Tips Praktis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>Pertanyaan Refleksi untuk Guru</span>
                  </div>
                  <p className="text-sm font-semibold italic text-indigo-950">
                    "{selectedProblem.reflectionQuestion}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-teal-600" />
                    <span>Tips Praktis di Ruang Kelas</span>
                  </div>
                  <p className="text-xs text-teal-950 leading-relaxed">
                    {selectedProblem.practicalTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: PETA MASALAH (DIAGRAM ALUR INTERAKTIF) */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Peta Alur Temu Nalar</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Peta Masalah: 7 Langkah Berpikir Soal Cerita
          </h2>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-emerald-400">Prinsip Emas:</strong> Literasi membantu siswa
            memahami masalah. Numerasi membantu siswa menggunakan pemahaman tersebut untuk mengambil
            keputusan dan menyelesaikan masalah.
          </div>

          <p className="text-xs text-slate-400">
            Klik pada setiap simpul diagram alur di bawah untuk melihat apa yang seharusnya dilakukan
            siswa, kesalahan umum, dan pertanyaan pemantik yang dapat diajukan guru.
          </p>

          {/* Interactive Flow Diagram Buttons */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {PROBLEM_FLOW_STEPS.map((st, index) => {
              const isFlowActive = selectedFlowStepId === st.id;
              return (
                <button
                  key={st.id}
                  id={`flow-step-btn-${st.id}`}
                  onClick={() => setSelectedFlowStepId(st.id)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isFlowActive
                      ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/40'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-1 flex items-center justify-between">
                    <span>Tahap {index + 1}</span>
                    {index < PROBLEM_FLOW_STEPS.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-500 hidden lg:block" />
                    )}
                  </div>
                  <div className="text-xs font-bold leading-tight mb-1">{st.step.replace(/^\d+\.\s*/, '')}</div>
                  <div className="text-[10px] text-slate-400 truncate">{st.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Flow Step Details */}
        {selectedFlow && (
          <div
            id="flow-step-detail-card"
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Panduan Supervisi Tahapan
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {selectedFlow.step} — {selectedFlow.subtitle}
                </h3>
              </div>
              <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold self-start">
                Langkah {selectedFlow.id} dari 7
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Apa yang Seharusnya Dilakukan Siswa</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {selectedFlow.whatStudentShouldDo}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Kesalahan yang Sering Terjadi</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {selectedFlow.commonMistakes}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Pertanyaan yang Dapat Diajukan Guru</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-800 space-y-1.5 list-disc list-inside">
                  {selectedFlow.teacherGuidingQuestions.map((q, i) => (
                    <li key={i} className="leading-relaxed">
                      "{q}"
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>Contoh Tindakan Sederhana di Kelas</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {selectedFlow.simpleActionExample}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <StagePagination
        prevTab="beranda"
        prevLabel="Kembali ke Beranda"
        nextTab="alur-gerak"
        nextLabel="Lanjut ke 3. Alur GERAK"
        onNavigate={onNavigate}
      />
    </div>
  );
};
