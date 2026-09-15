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
  GraduationCap,
  Building2,
  Trash2,
  Eye,
  RotateCcw,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { ReflectionReport, ReflectionTargetRole, NavTab } from '../types';
import {
  REFLECTION_QUESTIONS_GURU,
  REFLECTION_QUESTIONS_KS,
  SCHOOL_LIST_TELLU_LIMPOE,
  OFFICIAL_SCHOOLS_TELLU_LIMPOE,
} from '../data/appData';
import { saveReflection, getReflections, deleteReflection } from '../utils/storage';
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
  // Mode: 'guru' vs 'kepala_sekolah'
  const [activeRole, setActiveRole] = useState<ReflectionTargetRole>('guru');

  // State Guru
  const [teacherAnswers, setTeacherAnswers] = useState<Record<number, number>>({
    1: 3,
    2: 3,
    3: 2,
    4: 3,
    5: 2,
    6: 3,
    7: 2,
  });
  const [teacherName, setTeacherName] = useState<string>('Hasnidar, S.Pd.');
  const [subject, setSubject] = useState<string>('Matematika / Tematik');

  // State Kepala Sekolah
  const [principalAnswers, setPrincipalAnswers] = useState<Record<number, number>>({
    101: 3,
    102: 3,
    103: 2,
    104: 3,
    105: 3,
    106: 3,
    107: 2,
  });
  const [principalName, setPrincipalName] = useState<string>('Drs. H. Muhammad Nasir, M.Pd.');
  const [principalFocus, setPrincipalFocus] = useState<string>('Kepemimpinan Instruksional & Supervisi Temu Nalar');

  // Shared state
  const [schoolName, setSchoolName] = useState<string>(SCHOOL_LIST_TELLU_LIMPOE[0]);
  const [level, setLevel] = useState<'SD' | 'SMP'>('SD');

  // Output report and saved reflections
  const [submittedReport, setSubmittedReport] = useState<ReflectionReport | null>(null);
  const [savedReflections, setSavedReflections] = useState<ReflectionReport[]>(getReflections());
  const [filterRole, setFilterRole] = useState<'all' | 'guru' | 'kepala_sekolah'>('all');

  // Current questions depending on active role
  const currentQuestions =
    activeRole === 'guru' ? REFLECTION_QUESTIONS_GURU : REFLECTION_QUESTIONS_KS;

  const currentAnswers = activeRole === 'guru' ? teacherAnswers : principalAnswers;

  const handleSelectScore = (questionId: number, score: number) => {
    if (activeRole === 'guru') {
      setTeacherAnswers((prev) => ({ ...prev, [questionId]: score }));
    } else {
      setPrincipalAnswers((prev) => ({ ...prev, [questionId]: score }));
    }
  };

  const handleResetAnswers = () => {
    if (activeRole === 'guru') {
      setTeacherAnswers({
        1: 3,
        2: 3,
        3: 2,
        4: 3,
        5: 2,
        6: 3,
        7: 2,
      });
    } else {
      setPrincipalAnswers({
        101: 3,
        102: 3,
        103: 2,
        104: 3,
        105: 3,
        106: 3,
        107: 2,
      });
    }
  };

  const handleCalculateReport = (e: React.FormEvent) => {
    e.preventDefault();

    const answersMap = activeRole === 'guru' ? teacherAnswers : principalAnswers;
    const questionsList = activeRole === 'guru' ? REFLECTION_QUESTIONS_GURU : REFLECTION_QUESTIONS_KS;

    const scores = questionsList.map((q) => answersMap[q.id] || 2);
    const totalScore = scores.reduce((acc: number, curr: number) => acc + curr, 0);
    const maxScore = questionsList.length * 4; // 28
    const percentage = Math.round((totalScore / maxScore) * 100);

    let category: ReflectionReport['category'] = 'Tahap Awal';
    if (percentage >= 85) category = 'Mandiri Berkelanjutan';
    else if (percentage >= 70) category = 'Berkembang Baik';
    else if (percentage >= 55) category = 'Perlu Pembiasaan';

    const entries = questionsList.map((q) => ({
      question: q,
      score: answersMap[q.id] || 2,
    }));

    const highQuestions = entries.filter((item) => item.score >= 3).map((item) => item.question.aspect);
    const lowQuestions = entries.filter((item) => item.score <= 2).map((item) => item.question.aspect);

    let strengths: string[];
    let areasToImprove: string[];
    let actionRecommendations: string[];

    if (activeRole === 'guru') {
      strengths =
        highQuestions.length > 0
          ? highQuestions.slice(0, 3)
          : ['Memiliki komitmen tulus mendampingi nalar belajar siswa'];
      areasToImprove =
        lowQuestions.length > 0
          ? lowQuestions.slice(0, 3)
          : ['Mengembangkan variasi soal cerita yang lebih kontekstual'];
      actionRecommendations = [
        'Menerapkan Strategi "Baca, Tandai, Tanya" secara rutin 10 menit di awal setiap tema soal cerita.',
        'Membiasakan siswa menjelaskan alasan di balik pemilihan operasi hitung ("kenapa dikali, bukan ditambah").',
        'Menggunakan hasil kesulitan bernalar siswa sebagai bahan diskusi reflektif di Komunitas Belajar (Kombel) sekolah.',
      ];
    } else {
      strengths =
        highQuestions.length > 0
          ? highQuestions.slice(0, 3)
          : ['Komitmen kuat terhadap peningkatan mutu pembelajaran literasi-numerasi'];
      areasToImprove =
        lowQuestions.length > 0
          ? lowQuestions.slice(0, 3)
          : ['Penguatan jadwal supervisi dialogis dan alokasi jam Kombel sekolah'];
      actionRecommendations = [
        'Mengalokasikan waktu terjadwal 1 jam setiap pekan untuk Komunitas Belajar (Kombel) sekolah guna membedah kesulitan nalar murid bersama guru.',
        'Melakukan supervisi akademik bersama (co-supervision) dengan Pengawas Sekolah yang berorientasi umpan balik hangat, bukan sekadar ceklis dokumen.',
        'Memfasilitasi penyediaan pojok baca nalar dan media konkret manipulatif kontekstual Tellu Limpoe/Sidrap melalui RKAS/BOS.',
        'Mengapresiasi praktik baik guru yang berani menerapkan metode pemecahan masalah baru di kelas.',
      ];
    }

    const report: ReflectionReport = {
      id: `ref-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      role: activeRole,
      teacherName:
        activeRole === 'guru'
          ? teacherName.trim() || 'Guru Dampingan'
          : principalName.trim() || 'Kepala Sekolah Binaan',
      principalName: activeRole === 'kepala_sekolah' ? principalName.trim() : undefined,
      schoolName,
      level,
      subject: activeRole === 'guru' ? subject.trim() || 'Matematika / Tematik' : principalFocus.trim(),
      totalScore,
      maxScore,
      percentage,
      category,
      strengths,
      areasToImprove,
      actionRecommendations,
      answers: entries.map((item) => ({
        questionId: item.question.id,
        score: item.score,
      })),
    };

    const updated = saveReflection(report);
    setSavedReflections(updated);
    setSubmittedReport(report);

    // Scroll smoothly to output
    setTimeout(() => {
      document.getElementById('hasil-refleksi-panel')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteSaved = (id: string) => {
    if (confirm('Hapus riwayat refleksi ini?')) {
      const updated = deleteReflection(id);
      setSavedReflections(updated);
      if (submittedReport?.id === id) {
        setSubmittedReport(null);
      }
    }
  };

  const filteredReflections = savedReflections.filter((r) => {
    if (filterRole === 'all') return true;
    if (filterRole === 'guru') return !r.role || r.role === 'guru';
    if (filterRole === 'kepala_sekolah') return r.role === 'kepala_sekolah';
    return true;
  });

  const countGuruReflections = savedReflections.filter((r) => !r.role || r.role === 'guru').length;
  const countKSReflections = savedReflections.filter((r) => r.role === 'kepala_sekolah').length;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header Intro Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <ClipboardCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Refleksi Mandiri & Kemitraan Supervisi Klinis</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Tellu Limpoe • 25 Satuan Pendidikan</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Instrumen Refleksi Temu Nalar: Guru & Kepala Sekolah
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Instrumen ini dirancang untuk menggugah kesadaran profesional secara utuh. Refleksi ini{' '}
          <strong>bukan untuk menghakimi atau menyalahkan</strong>, melainkan sebagai pijakan
          kemitraan dialogis antara Pengawas Sekolah, Kepala Sekolah sebagai pemimpin pembelajaran,
          dan Guru pelaksana di kelas.
        </p>

        {/* Role Selector Tabs */}
        <div className="pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Pilih Target Instrumen Refleksi:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tab Guru */}
            <button
              type="button"
              id="tab-refleksi-guru"
              onClick={() => {
                setActiveRole('guru');
                setSubmittedReport(null);
              }}
              className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 ${
                activeRole === 'guru'
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeRole === 'guru'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    Instrumen Refleksi Guru
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    7 Butir Praktik Kelas
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Memotret kebiasaan interaksi mengajar, pembiasaan nalar siswa, dan cara membedah
                  soal cerita kontekstual di ruang kelas.
                </p>
              </div>
            </button>

            {/* Tab Kepala Sekolah */}
            <button
              type="button"
              id="tab-refleksi-ks"
              onClick={() => {
                setActiveRole('kepala_sekolah');
                setSubmittedReport(null);
              }}
              className={`p-4 rounded-2xl border text-left transition flex items-start gap-3.5 ${
                activeRole === 'kepala_sekolah'
                  ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeRole === 'kepala_sekolah'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-slate-900">
                    Instrumen Refleksi Kepala Sekolah
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    7 Butir Kepemimpinan
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Memotret kepemimpinan instruksional, supervisi coaching, aktivasi Kombel sekolah,
                  dan penyediaan ekosistem nalar satuan pendidikan.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Form Refleksi */}
      <form onSubmit={handleCalculateReport} className="space-y-8">
        {/* Identitas Form */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              {activeRole === 'guru' ? (
                <>
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Identitas Guru & Satuan Pendidikan Dampingan:</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Identitas Kepala Sekolah & Satuan Pendidikan:</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={handleResetAnswers}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Pilihan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Nama Subjek (Guru vs KS) */}
            {activeRole === 'guru' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Guru</label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Nama lengkap guru..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  required
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  placeholder="Nama lengkap Kepala Sekolah..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            )}

            {/* Sekolah Binaan */}
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

            {/* Jenjang */}
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
                        ? activeRole === 'guru'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Mapel / Bidang Fokus */}
            {activeRole === 'guru' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran / Tema
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Matematika / Tematik"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fokus Kepemimpinan
                </label>
                <input
                  type="text"
                  required
                  value={principalFocus}
                  onChange={(e) => setPrincipalFocus(e.target.value)}
                  placeholder="Contoh: Kepemimpinan Instruksional"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* 7 Butir Pernyataan Refleksi */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeRole === 'guru'
                  ? '7 Butir Pernyataan Praktik Mengajar Temu Nalar di Kelas'
                  : '7 Butir Pernyataan Kepemimpinan Pembelajaran Kepala Sekolah'}
              </h3>
              <p className="text-xs text-slate-500">
                Pilih skala yang paling mencerminkan kondisi nyata saat ini (Jujur dan Objektif).
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Skala 1 s.d. 4 (Maksimal Skor 28)
            </span>
          </div>

          <div className="space-y-3">
            {currentQuestions.map((q, idx) => {
              const currentScore = currentAnswers[q.id] || 2;
              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        activeRole === 'guru'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                        {q.statement}
                      </p>
                      <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md ${
                          activeRole === 'guru'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}
                      >
                        Aspek: {q.aspect}
                      </span>
                    </div>
                  </div>

                  {/* Skala Pilihan 4 Opsi */}
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
                              ? `${opt.color} border-transparent shadow-sm ring-2 ${
                                  activeRole === 'guru' ? 'ring-blue-400' : 'ring-emerald-400'
                                }`
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

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            id="btn-hitung-refleksi"
            className={`px-8 py-3.5 rounded-2xl text-white text-sm font-bold shadow-lg transition active:scale-[0.98] flex items-center gap-2 ${
              activeRole === 'guru'
                ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {activeRole === 'guru'
                ? 'Simpan & Lihat Analisis Refleksi Guru'
                : 'Simpan & Lihat Analisis Refleksi Kepala Sekolah'}
            </span>
          </button>
        </div>
      </form>

      {/* HASIL REFLEKSI KELUARAN */}
      {submittedReport && (
        <div
          id="hasil-refleksi-panel"
          className={`p-6 sm:p-8 rounded-3xl bg-white border shadow-xl space-y-6 animate-in fade-in zoom-in duration-200 ${
            submittedReport.role === 'kepala_sekolah' ? 'border-emerald-200' : 'border-blue-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>
                  {submittedReport.role === 'kepala_sekolah'
                    ? 'Umpan Balik Kepemimpinan Instruksional'
                    : 'Umpan Balik Pengembangan Pedagogis Guru'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Profil Refleksi: {submittedReport.teacherName}
              </h3>
              <p className="text-xs text-slate-500">
                {submittedReport.schoolName} ({submittedReport.level}) •{' '}
                {submittedReport.subject} • Tanggal: {submittedReport.date}
              </p>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-600">Skor Total</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {submittedReport.totalScore} / {submittedReport.maxScore}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl text-white flex items-center justify-center font-extrabold text-sm shadow-xs ${
                  submittedReport.role === 'kepala_sekolah' ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
              >
                {submittedReport.percentage}%
              </div>
            </div>
          </div>

          {/* Kategori Hasil Banner */}
          <div
            className={`p-4 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
              submittedReport.role === 'kepala_sekolah'
                ? 'bg-gradient-to-r from-emerald-900 to-teal-950'
                : 'bg-gradient-to-r from-blue-900 to-indigo-950'
            }`}
          >
            <div>
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Tingkat Kesiapan & Kemandirian
              </div>
              <div className="text-xl font-black text-white">{submittedReport.category}</div>
            </div>
            <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
              {submittedReport.role === 'kepala_sekolah'
                ? 'Kepala sekolah memainkan peran kunci sebagai penggerak ekosistem belajar. Sinergi rutin dengan Kombel dan supervisi coaching akan mempercepat budaya mutu di sekolah.'
                : 'Guru telah memiliki kesadaran menumbuhkan nalar siswa. Melalui pembiasaan rutin pada tahap pemisahan nalar dan hitung, keterampilan literasi-numerasi siswa akan melesat.'}
            </p>
          </div>

          {/* Kekuatan vs Area Penguatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {submittedReport.role === 'kepala_sekolah'
                    ? 'Kekuatan Kepemimpinan Sekolah'
                    : 'Kekuatan Praktik Baik Guru'}
                </span>
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
              <span>Rekomendasi Tindak Lanjut Pendampingan Pengawas</span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-800 space-y-2 list-disc list-inside leading-relaxed">
              {submittedReport.actionRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              Data refleksi ini otomatis tersimpan di memori aplikasi dan siap dicantumkan pada Dokumen Supervisi Resmi.
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onNavigate('rencana-tindak-lanjut')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
              >
                <span>Lanjut ke Rencana Tindak Lanjut (RTL)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAFTAR RIWAYAT REFLEKSI TERSIMPAN */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Rekapitulasi Data Refleksi Tersimpan</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Riwayat Refleksi Guru & Kepala Sekolah ({savedReflections.length} Catatan)
            </h3>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                filterRole === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({savedReflections.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterRole('guru')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterRole === 'guru'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Guru ({countGuruReflections})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterRole('kepala_sekolah')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                filterRole === 'kepala_sekolah'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span>Kepala Sekolah ({countKSReflections})</span>
            </button>
          </div>
        </div>

        {filteredReflections.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Belum ada data refleksi untuk filter ini. Silakan isi kuesioner refleksi di atas lalu
              klik tombol "Simpan & Lihat Analisis".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredReflections.map((item) => {
              const isKS = item.role === 'kepala_sekolah';
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition space-y-3 ${
                    isKS
                      ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
                      : 'bg-blue-50/40 border-blue-200/80 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isKS
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isKS ? 'Kepala Sekolah' : 'Guru Kelas/Mapel'}
                        </span>
                        <span className="text-[10px] text-slate-500">• {item.date}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {item.teacherName}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {item.schoolName} ({item.level})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-slate-900">
                        {item.totalScore}/{item.maxScore}
                      </div>
                      <div
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isKS
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {item.percentage}%
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 bg-white/80 p-2 rounded-xl border border-slate-200/60">
                    <span className="font-semibold text-slate-800">Kategori: </span>
                    <span className="font-bold text-blue-700">{item.category}</span>
                    <div className="truncate text-[11px] text-slate-500 mt-0.5">
                      Fokus: {item.subject}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedReport(item);
                        setTimeout(() => {
                          document
                            .getElementById('hasil-refleksi-panel')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Analisis</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(item.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
                      title="Hapus rekaman ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigasi Alur Pendampingan */}
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
