import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  School,
  User,
  HeartHandshake,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { ReflectionReport, NavTab } from '../types';
import { REFLECTION_QUESTIONS, SCHOOL_LIST_TELLU_LIMPOE, OFFICIAL_SCHOOLS_TELLU_LIMPOE } from '../data/appData';
import { saveReflection, getReflections } from '../utils/storage';
import { StagePagination } from './StagePagination';

interface ReflectionViewProps {
  onNavigate: (tab: NavTab) => void;
}

const SCALE_OPTIONS = [
  { label: 'Sangat Sering', score: 4, color: 'bg-emerald-600 text-white' },
  { label: 'Sering', score: 3, color: 'bg-blue-600 text-white' },
  { label: 'Kadang-kadang', score: 2, color: 'bg-amber-500 text-white' },
  { label: 'Belum Dilakukan', score: 1, color: 'bg-rose-500 text-white' },
];

export const ReflectionView: React.FC<ReflectionViewProps> = ({ onNavigate }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 3,
    2: 3,
    3: 2,
    4: 3,
    5: 2,
    6: 3,
    7: 2,
  });

  const [teacherName, setTeacherName] = useState<string>('Hasnidar, S.Pd.');
  const [schoolName, setSchoolName] = useState<string>(SCHOOL_LIST_TELLU_LIMPOE[0]);
  const [level, setLevel] = useState<'SD' | 'SMP'>('SD');
  const [subject, setSubject] = useState<string>('Matematika / Tematik');

  const [submittedReport, setSubmittedReport] = useState<ReflectionReport | null>(null);
  const [savedReflections, setSavedReflections] = useState<ReflectionReport[]>(getReflections());

  const handleSelectScore = (questionId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleCalculateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const scores = Object.values(answers) as number[];
    const totalScore = scores.reduce((acc: number, curr: number) => acc + curr, 0);
    const maxScore = 7 * 4; // 28
    const percentage = Math.round((totalScore / maxScore) * 100);

    let category: ReflectionReport['category'] = 'Tahap Awal';
    if (percentage >= 85) category = 'Mandiri Berkelanjutan';
    else if (percentage >= 70) category = 'Berkembang Baik';
    else if (percentage >= 55) category = 'Perlu Pembiasaan';

    const entries = Object.entries(answers) as [string, number][];

    // Formulate strengths and areas to develop based on individual scores
    const highQuestions = entries
      .filter(([_, score]) => score >= 3)
      .map(([id]) => REFLECTION_QUESTIONS.find((q) => q.id === Number(id))?.aspect || '');

    const lowQuestions = entries
      .filter(([_, score]) => score <= 2)
      .map(([id]) => REFLECTION_QUESTIONS.find((q) => q.id === Number(id))?.aspect || '');

    const strengths =
      highQuestions.length > 0
        ? highQuestions.slice(0, 3)
        : ['Memiliki komitmen tulus untuk mendampingi nalar belajar siswa'];

    const areasToImprove =
      lowQuestions.length > 0
        ? lowQuestions.slice(0, 3)
        : ['Mengembangkan variasi soal cerita yang lebih kontekstual'];

    const actionRecommendations = [
      'Menerapkan Strategi "Baca, Tandai, Tanya" secara rutin 10 menit di awal setiap tema soal cerita.',
      'Membiasakan siswa menjelaskan alasan di balik pemilihan operasi hitung ("kenapa dikali, bukan ditambah").',
      'Menggunakan hasil kesulitan siswa sebagai bahan diskusi reflektif di Komunitas Belajar (Kombel) sekolah.',
    ];

    const report: ReflectionReport = {
      id: `ref-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      teacherName: teacherName.trim() || 'Guru Dampingan',
      schoolName,
      level,
      subject,
      totalScore,
      maxScore,
      percentage,
      category,
      strengths,
      areasToImprove,
      actionRecommendations,
      answers: entries.map(([qid, sc]) => ({
        questionId: Number(qid),
        score: sc,
      })),
    };

    const updated = saveReflection(report);
    setSavedReflections(updated);
    setSubmittedReport(report);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Intro Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Refleksi Mandiri & Supervisi Klinis</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Refleksi Pembelajaran Literasi-Numerasi
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Instrumen ini dirancang untuk menggugah kesadaran profesional guru dan kepala sekolah.
          Hasil refleksi <strong>bukan untuk menghakimi atau menyalahkan guru</strong>, melainkan
          sebagai titik tolak kolaborasi pendampingan yang memberdayakan.
        </p>
      </div>

      {/* Form Refleksi */}
      <form onSubmit={handleCalculateReport} className="space-y-8">
        {/* Identitas Guru & Sekolah */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Identitas Guru & Satuan Pendidikan:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Guru</label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">Sekolah Binaan (25 Sekolah)</label>
                <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  Tellu Limpoe
                </span>
              </div>
              <select
                value={schoolName}
                onChange={(e) => {
                  const selected = e.target.value;
                  setSchoolName(selected);
                  const found = OFFICIAL_SCHOOLS_TELLU_LIMPOE.find((s) => s.name === selected);
                  if (found) {
                    setLevel(found.level);
                  }
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <optgroup label="Sekolah Dasar (SD) — 21 Sekolah Binaan">
                  {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SD').map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.no}. {s.name} ({s.type})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Sekolah Menengah Pertama (SMP) — 4 Sekolah Binaan">
                  {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SMP').map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.no}. {s.name} ({s.type})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang</label>
              <div className="flex gap-2">
                {(['SD', 'SMP'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                      level === lvl
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran / Tema</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 7 Pernyataan Reflektif */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              7 Butir Pernyataan Praktik Mengajar di Kelas
            </h3>
            <span className="text-xs text-slate-500">Pilih skala yang paling mencerminkan kondisi nyata</span>
          </div>

          <div className="space-y-3">
            {REFLECTION_QUESTIONS.map((q) => {
              const currentScore = answers[q.id] || 2;
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {q.id}
                    </span>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                        {q.statement}
                      </p>
                      <span className="text-[11px] text-blue-600 font-medium">
                        Aspek: {q.aspect}
                      </span>
                    </div>
                  </div>

                  {/* Skala Pilihan */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {SCALE_OPTIONS.map((opt) => {
                      const isChosen = currentScore === opt.score;
                      return (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => handleSelectScore(q.id, opt.score)}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                            isChosen
                              ? `${opt.color} border-transparent shadow-sm ring-2 ring-blue-400`
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-[11px] opacity-80">({opt.score})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            id="btn-hitung-refleksi"
            className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition active:scale-[0.98] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Lihat Analisis Refleksi Profesional</span>
          </button>
        </div>
      </form>

      {/* HASIL REFLEKSI KELUARAN */}
      {submittedReport && (
        <div
          id="hasil-refleksi-panel"
          className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200 shadow-xl space-y-6 animate-in fade-in zoom-in duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>Umpan Balik Pengembangan Profesional</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Profil Pembelajaran {submittedReport.teacherName}
              </h3>
              <p className="text-xs text-slate-500">
                {submittedReport.schoolName} ({submittedReport.level}) • Tanggal:{' '}
                {submittedReport.date}
              </p>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-2xl border border-blue-200">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-blue-700">Skor Total</div>
                <div className="text-xl sm:text-2xl font-black text-blue-900 leading-tight">
                  {submittedReport.totalScore} / {submittedReport.maxScore}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                {submittedReport.percentage}%
              </div>
            </div>
          </div>

          {/* Kategori Hasil */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Kategori Pengembangan
              </div>
              <div className="text-xl font-black text-white">{submittedReport.category}</div>
            </div>
            <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
              Guru telah memiliki niat kuat menumbuhkan nalar siswa. Melalui pembiasaan rutin
              pada tahap membedakan informasi dan pertanyaan, capaian literasi-numerasi akan melesat.
            </p>
          </div>

          {/* Kekuatan vs Hal yang Perlu Diperbaiki */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kekuatan Praktik Baik Guru</span>
              </div>
              <ul className="text-xs sm:text-sm text-emerald-950 space-y-1.5 list-disc list-inside">
                {submittedReport.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Area yang Terbuka untuk Dioptimalkan</span>
              </div>
              <ul className="text-xs sm:text-sm text-amber-950 space-y-1.5 list-disc list-inside">
                {submittedReport.areasToImprove.map((ar, i) => (
                  <li key={i}>{ar}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Saran Tindakan Berikutnya */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Saran Tindakan Pendampingan Berikutnya</span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-800 space-y-2 list-disc list-inside leading-relaxed">
              {submittedReport.actionRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Action button to continue to RTL */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              Data refleksi ini otomatis tersimpan untuk dicantumkan pada Dokumen Supervisi Resmi.
            </span>
            <button
              onClick={() => onNavigate('rencana-tindak-lanjut')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <span>Lanjut Susun Rencana Tindak Lanjut (RTL)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <StagePagination
        prevTab="strategi-pembelajaran"
        prevLabel="Kembali ke Strategi"
        nextTab="rencana-tindak-lanjut"
        nextLabel="Lanjut ke 8. Rencana Tindak Lanjut"
        onNavigate={onNavigate}
      />
    </div>
  );
};
