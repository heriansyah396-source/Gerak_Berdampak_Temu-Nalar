import React, { useState } from 'react';
import {
  FlaskConical,
  GraduationCap,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Calculator,
  BookOpen,
  Info,
  Check,
} from 'lucide-react';
import { LabQuestion, QuestionOption, NavTab } from '../types';
import { LAB_QUESTIONS } from '../data/appData';
import { StagePagination } from './StagePagination';

interface LabSoalViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const LabSoalView: React.FC<LabSoalViewProps> = ({ onNavigate }) => {
  const [activeLevel, setActiveLevel] = useState<'SD' | 'SMP'>('SD');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    LAB_QUESTIONS.find((q) => q.level === 'SD')?.id || LAB_QUESTIONS[0].id
  );
  const [appMode, setAppMode] = useState<'siswa' | 'guru'>('siswa');

  // Interactive reveal states
  const [revealedParts, setRevealedParts] = useState<{
    diketahui: boolean;
    ditanyakan: boolean;
    informasiPenting: boolean;
    operasiHitung: boolean;
    periksaJawaban: boolean;
  }>({
    diketahui: false,
    ditanyakan: false,
    informasiPenting: false,
    operasiHitung: false,
    periksaJawaban: false,
  });

  // Selected answer state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [scoreTracker, setScoreTracker] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const filteredQuestions = LAB_QUESTIONS.filter((q) => q.level === activeLevel);
  const currentQuestion =
    LAB_QUESTIONS.find((q) => q.id === selectedQuestionId) || filteredQuestions[0];

  const handleLevelChange = (lvl: 'SD' | 'SMP') => {
    setActiveLevel(lvl);
    const firstQ = LAB_QUESTIONS.find((q) => q.level === lvl);
    if (firstQ) {
      setSelectedQuestionId(firstQ.id);
      resetQuestionState();
    }
  };

  const handleSelectQuestion = (id: string) => {
    setSelectedQuestionId(id);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setRevealedParts({
      diketahui: false,
      ditanyakan: false,
      informasiPenting: false,
      operasiHitung: false,
      periksaJawaban: false,
    });
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
  };

  const toggleReveal = (key: keyof typeof revealedParts) => {
    setRevealedParts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;
    setIsAnswerSubmitted(true);
    const chosen = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (chosen) {
      setScoreTracker((prev) => ({
        correct: prev.correct + (chosen.isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    }
    // Auto-reveal the answer examination
    setRevealedParts((prev) => ({
      ...prev,
      periksaJawaban: true,
      operasiHitung: true,
    }));
  };

  const selectedOptionObj = currentQuestion.options.find((o) => o.id === selectedOptionId);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
            <span>Laboratorium Soal Cerita Temu Nalar</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              id="mode-btn-siswa"
              onClick={() => setAppMode('siswa')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                appMode === 'siswa'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Mode Latihan Siswa</span>
            </button>
            <button
              id="mode-btn-guru"
              onClick={() => setAppMode('guru')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                appMode === 'guru'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Mode Guru (Analisis Diagnostik)</span>
            </button>
          </div>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Laboratorium Soal: Baca, Pahami, Hitung, Jelaskan
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Melatih guru dan siswa memahami hubungan erat antara literasi (memahami konteks bacaan) dan
          numerasi (memilih kalkulasi yang tepat) melalui soal cerita kontekstual bertingkat.
        </p>

        {/* Level Filters & Question Pills */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Pilih Jenjang:</span>
            {(['SD', 'SMP'] as const).map((lvl) => (
              <button
                key={lvl}
                id={`btn-lab-level-${lvl}`}
                onClick={() => handleLevelChange(lvl)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeLevel === lvl
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Jenjang {lvl}
              </button>
            ))}
          </div>

          {appMode === 'siswa' && scoreTracker.total > 0 && (
            <div className="text-xs font-bold text-slate-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Skor Latihan: {scoreTracker.correct} Benar dari {scoreTracker.total} Percobaan (
                {Math.round((scoreTracker.correct / scoreTracker.total) * 100)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {filteredQuestions.map((q, idx) => {
          const isSelected = q.id === selectedQuestionId;
          return (
            <button
              key={q.id}
              onClick={() => handleSelectQuestion(q.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border text-left ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              Soal {idx + 1}: {q.topic}
            </button>
          );
        })}
      </div>

      {/* Mode Guru Notification Banner */}
      {appMode === 'guru' && (
        <div className="p-4 rounded-2xl bg-emerald-900 text-emerald-50 border border-emerald-700 flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <div className="font-bold text-white">Mode Supervisi & Diagnostik Guru Aktif</div>
            <p className="text-emerald-200 leading-relaxed">
              Pada mode ini, Anda dapat meninjau pemetaan distraktor pilihan jawaban untuk mengenali
              kategori kelemahan siswa: apakah siswa salah memahami kalimat tanya, salah menentukan
              operasi hitung, atau keliru hitungan teknis.
            </p>
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        {/* Context Tag & Title */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold tracking-wide">
              {currentQuestion.level}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Konteks Nyata: <strong className="text-slate-800">{currentQuestion.contextTag}</strong>
            </span>
          </div>
          <button
            onClick={resetQuestionState}
            className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
            title="Mulai Ulang Soal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tampilan Soal</span>
          </button>
        </div>

        {/* Story Paragraph with distinct clean box */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-md space-y-2.5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Teks Bacaan & Stimulus Kontekstual</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Topik: {currentQuestion.topic}</span>
          </div>
          <p className="text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line text-slate-100 font-sans">
            {currentQuestion.story}
          </p>
        </div>

        {/* 5 STEPPED REVEAL BUTTONS (Fitur Wajib Prompt) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Tangga Nalar Bertahap (Klik untuk Menguji Pemahaman)</span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Bimbing siswa membaca tahap demi tahap
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              id="btn-reveal-diketahui"
              onClick={() => toggleReveal('diketahui')}
              className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                revealedParts.diketahui
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">1. Diketahui</span>
            </button>

            <button
              id="btn-reveal-ditanyakan"
              onClick={() => toggleReveal('ditanyakan')}
              className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                revealedParts.ditanyakan
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">2. Ditanyakan</span>
            </button>

            <button
              id="btn-reveal-info-penting"
              onClick={() => toggleReveal('informasiPenting')}
              className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                revealedParts.informasiPenting
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">3. Info Penting</span>
            </button>

            <button
              id="btn-reveal-operasi"
              onClick={() => toggleReveal('operasiHitung')}
              className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                revealedParts.operasiHitung
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">4. Operasi Hitung</span>
            </button>

            <button
              id="btn-reveal-periksa"
              onClick={() => toggleReveal('periksaJawaban')}
              className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1 ${
                revealedParts.periksaJawaban
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">5. Periksa Nalar</span>
            </button>
          </div>

          {/* Stepped Reveal Containers */}
          <div className="space-y-3 pt-2">
            {/* Diketahui */}
            {revealedParts.diketahui && (
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs sm:text-sm space-y-1.5 animate-in fade-in duration-150">
                <div className="font-extrabold text-blue-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>1. Informasi yang Diketahui:</span>
                </div>
                <ul className="list-disc list-inside text-slate-800 space-y-1 pl-1">
                  {currentQuestion.reveals.diketahui.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ditanyakan */}
            {revealedParts.ditanyakan && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm space-y-1.5 animate-in fade-in duration-150">
                <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>2. Sasaran yang Ditanyakan:</span>
                </div>
                <p className="text-slate-800 font-semibold pl-1">{currentQuestion.reveals.ditanyakan}</p>
              </div>
            )}

            {/* Info Penting */}
            {revealedParts.informasiPenting && (
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/90 border border-purple-200 text-xs sm:text-sm space-y-1.5 animate-in fade-in duration-150">
                <div className="font-extrabold text-purple-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span>3. Informasi Penting & Kunci Nalar:</span>
                </div>
                <ul className="list-disc list-inside text-slate-800 space-y-1 pl-1">
                  {currentQuestion.reveals.informasiPenting.map((inf, i) => (
                    <li key={i}>{inf}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Operasi Hitung */}
            {revealedParts.operasiHitung && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs sm:text-sm space-y-2.5 animate-in fade-in duration-150">
                <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>4. Tahapan Operasi Hitung Berurutan:</span>
                </div>
                <div className="space-y-1.5 font-mono text-slate-800 bg-white p-3.5 rounded-xl border border-emerald-200 text-xs sm:text-sm">
                  {currentQuestion.reveals.operasiHitung.steps.map((st, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">›</span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-emerald-950 font-extrabold px-1">
                  Hasil Akhir Terverifikasi = {currentQuestion.reveals.operasiHitung.result}
                </div>
              </div>
            )}

            {/* Periksa Jawaban & Penjelasan Nalar */}
            {revealedParts.periksaJawaban && (
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 border border-teal-200 text-xs sm:text-sm space-y-2.5 animate-in fade-in duration-150">
                <div className="font-extrabold text-teal-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  <span>5. Periksa Jawaban & Menjelaskan Alasan:</span>
                </div>
                <p className="text-slate-800 font-semibold bg-white p-3.5 rounded-xl border border-teal-200">
                  {currentQuestion.reveals.jawabanAkhir}
                </p>
                <div className="text-xs text-slate-700 leading-relaxed italic bg-teal-100/60 p-3.5 rounded-xl border border-teal-200/60">
                  <strong className="text-teal-900 not-italic">Refleksi Pendampingan Pengawas:</strong> {currentQuestion.reveals.penjelasanNalar}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PILIHAN JAWABAN MULTIPLE CHOICE */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pilihlah Jawaban yang Tepat:
            </span>
            <span className="text-[11px] text-slate-400">Pilih salah satu lalu klik periksa</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const showResult = isAnswerSubmitted;
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

              let cardStyle =
                'bg-slate-50/80 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/40';

              if (isSelected) {
                cardStyle = 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-xs';
              }

              if (showResult) {
                if (opt.isCorrect) {
                  cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/30 shadow-xs';
                } else if (isSelected && !opt.isCorrect) {
                  cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30 shadow-xs';
                }
              }

              return (
                <div
                  key={opt.id}
                  id={`opt-btn-${opt.id}`}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${cardStyle}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {optionLetter}
                      </span>
                      <div className="font-bold text-sm sm:text-base leading-snug pt-0.5">{opt.text}</div>
                    </div>
                    {showResult && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showResult && isSelected && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>

                  {/* Diagnostik badge on Mode Guru */}
                  {appMode === 'guru' && (
                    <div className="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500 uppercase tracking-wider">
                        Analisis Diagnostik:
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          opt.isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {opt.diagnosticCategory === 'tepat'
                          ? 'Nalar Tepat'
                          : opt.diagnosticCategory === 'pemahaman-soal'
                          ? 'Salah Paham Tujuan'
                          : opt.diagnosticCategory === 'pemilihan-operasi'
                          ? 'Salah Pilih Operasi'
                          : 'Kekeliruan Hitung'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              id="btn-submit-answer"
              disabled={!selectedOptionId}
              onClick={handleCheckAnswer}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition ${
                selectedOptionId
                  ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Periksa Jawaban
            </button>

            {isAnswerSubmitted && (
              <button
                onClick={resetQuestionState}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
              >
                Coba Ulang Soal Ini
              </button>
            )}
          </div>
        </div>

        {/* FEEDBACK YANG TIDAK MENYALAHKAN (Sesuai Syarat Prompt) */}
        {isAnswerSubmitted && selectedOptionObj && (
          <div
            id="feedback-box"
            className={`p-5 sm:p-6 rounded-2xl border text-sm leading-relaxed space-y-2.5 animate-in fade-in duration-150 ${
              selectedOptionObj.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-base">
              {selectedOptionObj.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Hebat! Nalar Anda Tepat Sasaran</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  <span>Umpan Balik Reflektif (Temu Nalar)</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed">{selectedOptionObj.explanation}</p>

            {appMode === 'guru' && (
              <div className="pt-2.5 border-t border-current/20 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Catatan Pedagogis Guru:</strong> {currentQuestion.teacherDiagnosticNotes}
              </div>
            )}
          </div>
        )}
      </div>

      <StagePagination
        prevTab="siklus-berdampak"
        prevLabel="Kembali ke Siklus BERDAMPAK"
        nextTab="strategi-pembelajaran"
        nextLabel="Lanjut ke 6. Strategi Pembelajaran"
        onNavigate={onNavigate}
      />
    </div>
  );
};
