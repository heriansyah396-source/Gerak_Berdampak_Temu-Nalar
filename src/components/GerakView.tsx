import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  PlusCircle,
  Trash2,
  FileText,
  School,
  User,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GerakRecord, NavTab } from '../types';
import { GERAK_STAGES, SCHOOL_LIST_TELLU_LIMPOE, OFFICIAL_SCHOOLS_TELLU_LIMPOE } from '../data/appData';
import { getGerakRecords, saveGerakRecord, deleteGerakRecord } from '../utils/storage';
import { StagePagination } from './StagePagination';

interface GerakViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const GerakView: React.FC<GerakViewProps> = ({ onNavigate }) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [records, setRecords] = useState<GerakRecord[]>(getGerakRecords());
  const [showForm, setShowForm] = useState<boolean>(false);

  // Form state
  const [schoolName, setSchoolName] = useState<string>(SCHOOL_LIST_TELLU_LIMPOE[0]);
  const [customSchool, setCustomSchool] = useState<string>('');
  const [level, setLevel] = useState<'SD' | 'SMP'>('SD');
  const [teacherName, setTeacherName] = useState<string>('');
  const [learningProblem, setLearningProblem] = useState<string>('');
  const [evidenceFound, setEvidenceFound] = useState<string>('');
  const [actionPlan, setActionPlan] = useState<string>('');
  const [supervisorNotes, setSupervisorNotes] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const activeStage = GERAK_STAGES[activeStageIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSchool =
      schoolName === 'Lainnya (Tulis Manual)' && customSchool.trim()
        ? customSchool.trim()
        : schoolName;

    const newRecord: GerakRecord = {
      id: `gerak-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      schoolName: finalSchool,
      level,
      teacherName: teacherName.trim() || 'Guru Dampingan',
      learningProblem: learningProblem.trim() || 'Kesulitan memahami teks soal cerita numerasi',
      evidenceFound: evidenceFound.trim() || 'Hasil analisis lembar jawaban asesmen harian siswa',
      actionPlan: actionPlan.trim() || 'Penerapan strategi nalar terbimbing di kelas',
      supervisorNotes: supervisorNotes.trim() || undefined,
    };

    const updated = saveGerakRecord(newRecord);
    setRecords(updated);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
      // Reset fields
      setTeacherName('');
      setLearningProblem('');
      setEvidenceFound('');
      setActionPlan('');
      setSupervisorNotes('');
    }, 1200);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus catatan pendampingan GERAK ini?')) {
      const updated = deleteGerakRecord(id);
      setRecords(updated);
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Banner Intro */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Kerangka Kerja Pengawas Sekolah</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          GERAK — Alur Tindakan Pengawas
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Pendampingan pengawas sekolah dilaksanakan melalui lima langkah terpadu yang memosisikan
          pengawas sebagai mitra reflektif kepala sekolah dan guru demi menguatkan nalar
          literasi-numerasi siswa di Kecamatan Tellu Limpoe.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            id="btn-open-gerak-form"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showForm ? 'Tutup Formulir GERAK' : 'Mulai Tahap GERAK'}</span>
          </button>

          <span className="text-xs text-slate-500">
            Tersimpan: <strong>{records.length} Catatan Pendampingan</strong>
          </span>
        </div>
      </div>

      {/* Interactive 5 Stage Timeline / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">5 Tahap Alur GERAK</h3>
          <span className="text-xs text-slate-500">Klik huruf untuk melihat rincian tindakan</span>
        </div>

        {/* Big Step Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {GERAK_STAGES.map((st, idx) => {
            const isActive = activeStageIndex === idx;
            return (
              <button
                key={st.letter}
                id={`btn-gerak-stage-${st.letter}`}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-900 text-white border-blue-900 shadow-lg shadow-blue-900/20 ring-2 ring-blue-500'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-9 h-9 rounded-xl font-extrabold text-lg flex items-center justify-center ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {st.letter}
                  </span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>
                    Tahap {idx + 1}
                  </span>
                </div>
                <div className={`text-xs font-extrabold leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        {activeStage && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                  {activeStage.letter}
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Tahap {activeStageIndex + 1} dari 5
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {activeStage.title}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {activeStage.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Bukti Nyata */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Contoh Bukti Nyata</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {activeStage.evidenceExamples.map((ev, i) => (
                    <li key={i} className="leading-relaxed">
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pertanyaan Pemantik Reflektif */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>Pertanyaan Dialog Reflektif</span>
                </div>
                <ul className="text-xs text-indigo-950 space-y-2">
                  {activeStage.guidingQuestions.map((q, i) => (
                    <li key={i} className="italic leading-relaxed">
                      "{q}"
                    </li>
                  ))}
                </ul>
              </div>

              {/* Aksi Kunci Pengawas */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tindakan Kunci Pengawas</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  {activeStage.keyActions.map((ka, i) => (
                    <li key={i} className="leading-relaxed">
                      {ka}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FORMULIR TAHAP GERAK */}
      {showForm && (
        <div id="form-tahap-gerak" className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Formulir Pendampingan Nyata
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Mulai Catatan Tahap GERAK
              </h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
            >
              Tutup
            </button>
          </div>

          {formSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-600/30 border border-emerald-500 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-base font-bold text-emerald-200">
                Catatan GERAK Berhasil Disimpan!
              </div>
              <p className="text-xs text-emerald-300">
                Data telah dicatat ke dalam ringkasan supervisi dan tersimpan di penyimpanan lokal browser.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sekolah */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Nama Sekolah Binaan (25 Sekolah)
                    </label>
                    <span className="text-[10px] text-blue-400 font-semibold bg-blue-900/40 px-1.5 py-0.5 rounded border border-blue-700/50">
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
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <optgroup label="Sekolah Dasar (SD) — 21 Sekolah Binaan" className="bg-slate-900 text-slate-200">
                      {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SD').map((sch) => (
                        <option key={sch.name} value={sch.name} className="bg-slate-800 text-white">
                          {sch.no}. {sch.name} ({sch.type})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Sekolah Menengah Pertama (SMP) — 4 Sekolah Binaan" className="bg-slate-900 text-slate-200">
                      {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SMP').map((sch) => (
                        <option key={sch.name} value={sch.name} className="bg-slate-800 text-white">
                          {sch.no}. {sch.name} ({sch.type})
                        </option>
                      ))}
                    </optgroup>
                    <option value="Lainnya (Tulis Manual)" className="bg-slate-800 text-white">
                      Lainnya (Tulis Manual)
                    </option>
                  </select>
                  {schoolName === 'Lainnya (Tulis Manual)' && (
                    <input
                      type="text"
                      placeholder="Ketik nama sekolah..."
                      value={customSchool}
                      onChange={(e) => setCustomSchool(e.target.value)}
                      className="mt-2 w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden"
                      required
                    />
                  )}
                </div>

                {/* Jenjang */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Jenjang Sekolah
                  </label>
                  <div className="flex gap-2">
                    {(['SD', 'SMP'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                          level === lvl
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nama Guru */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nama Guru yang Didampingi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Hasnidar, S.Pd."
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Masalah Pembelajaran */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Masalah Pembelajaran Literasi-Numerasi yang Ditemukan
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Siswa tergesa-gesa mengalikan semua angka tanpa memeriksa kalimat tanya uang kembalian..."
                  value={learningProblem}
                  onChange={(e) => setLearningProblem(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Bukti yang Ditemukan */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Bukti Nyata yang Ditemukan (Data Asesmen / Catatan Observasi)
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: 18 dari 25 siswa di kelas V menjawab Rp42.000 pada soal beras Ibu karena lupa menghitung kembalian..."
                  value={evidenceFound}
                  onChange={(e) => setEvidenceFound(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              {/* Rencana Tindakan */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Rencana Tindakan Pendampingan (Solusi Praktis)
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Guru bersama pengawas menerapkan Strategi 'Baca, Tandai, Tanya' pada pertemuan berikutnya..."
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Catatan GERAK
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* DAFTAR RINGKASAN DATA GERAK YANG DISIMPAN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Ringkasan Catatan Pendampingan GERAK
          </h3>
          <span className="text-xs text-blue-600 font-semibold">
            {records.length} Sekolah/Guru Tercatat
          </span>
        </div>

        {records.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
            Belum ada catatan pendampingan GERAK. Klik tombol "Mulai Tahap GERAK" di atas untuk menambahkan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                        Jenjang {rec.level}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rec.timestamp}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{rec.schoolName}</h4>
                    <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Guru: <strong>{rec.teacherName}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                  <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60">
                    <strong className="text-amber-900 block mb-0.5">Masalah Pembelajaran:</strong>
                    <span className="text-slate-700">{rec.learningProblem}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <strong className="text-slate-800 block mb-0.5">Bukti yang Ditemukan:</strong>
                    <span className="text-slate-700">{rec.evidenceFound}</span>
                  </div>

                  <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/60">
                    <strong className="text-emerald-900 block mb-0.5">Rencana Tindakan:</strong>
                    <span className="text-slate-700">{rec.actionPlan}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <StagePagination
        prevTab="akar-masalah"
        prevLabel="Kembali ke Akar Masalah"
        nextTab="siklus-berdampak"
        nextLabel="Lanjut ke 4. Siklus BERDAMPAK"
        onNavigate={onNavigate}
      />
    </div>
  );
};
