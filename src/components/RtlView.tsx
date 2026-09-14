import React, { useState } from 'react';
import {
  FileSpreadsheet,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Clock,
  Target,
  FileCheck,
  Sparkles,
  ArrowRight,
  School,
  User,
  Calendar,
  Printer,
} from 'lucide-react';
import { ActionPlanItem, NavTab } from '../types';
import {
  SCHOOL_LIST_TELLU_LIMPOE,
  TEACHING_STRATEGIES,
  OFFICIAL_SCHOOLS_TELLU_LIMPOE,
} from '../data/appData';
import { getActionPlans, saveActionPlan, deleteActionPlan } from '../utils/storage';
import { StagePagination } from './StagePagination';

interface RtlViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenPrintModal: (schoolName?: string) => void;
}

export const RtlView: React.FC<RtlViewProps> = ({ onNavigate, onOpenPrintModal }) => {
  const [plans, setPlans] = useState<ActionPlanItem[]>(getActionPlans());
  const [showForm, setShowForm] = useState<boolean>(false);

  // Form states
  const [schoolName, setSchoolName] = useState<string>(SCHOOL_LIST_TELLU_LIMPOE[0]);
  const [teacherName, setTeacherName] = useState<string>('');
  const [level, setLevel] = useState<'SD' | 'SMP'>('SD');
  const [mainProblem, setMainProblem] = useState<string>(
    'Siswa belum mampu menentukan informasi penting dalam soal cerita dan langsung menghitung.'
  );
  const [improvementGoal, setImprovementGoal] = useState<string>(
    'Meningkatkan persentase siswa yang mampu membedakan informasi penting dan pertanyaan menjadi 80%.'
  );
  const [selectedStrategy, setSelectedStrategy] = useState<string>(
    TEACHING_STRATEGIES[0].title
  );
  const [executionTime, setExecutionTime] = useState<string>('2 Pekan (4 Sesi Pertemuan Kelas)');
  const [successEvidence, setSuccessEvidence] = useState<string>(
    'Lembar kerja siswa dengan stabilo penanda, hasil asesmen formatif, dan catatan observasi supervisi.'
  );
  const [followUp, setFollowUp] = useState<string>(
    'Diskusi refleksi hasil di Komunitas Belajar (Kombel) dan pendampingan lanjutan di kelas.'
  );
  const [status, setStatus] = useState<ActionPlanItem['status']>('Sedang Berjalan');

  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();

    const newPlan: ActionPlanItem = {
      id: `rtl-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      schoolName,
      teacherName: teacherName.trim() || 'Guru Binaan Tellu Limpoe',
      level,
      mainProblem: mainProblem.trim(),
      improvementGoal: improvementGoal.trim(),
      selectedStrategy,
      executionTime: executionTime.trim(),
      successEvidence: successEvidence.trim(),
      followUp: followUp.trim(),
      status,
    };

    const updated = saveActionPlan(newPlan);
    setPlans(updated);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
      setTeacherName('');
    }, 1200);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('Hapus kartu rencana tindak lanjut ini?')) {
      const updated = deleteActionPlan(id);
      setPlans(updated);
    }
  };

  const handleToggleStatus = (plan: ActionPlanItem) => {
    const nextStatus: Record<ActionPlanItem['status'], ActionPlanItem['status']> = {
      Direncanakan: 'Sedang Berjalan',
      'Sedang Berjalan': 'Tercapai',
      Tercapai: 'Direncanakan',
    };
    const updatedPlan: ActionPlanItem = {
      ...plan,
      status: nextStatus[plan.status],
    };
    const updated = saveActionPlan(updatedPlan);
    setPlans(updated);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Komitmen Perbaikan Nyata</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Rencana Tindak Lanjut (RTL)
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Dokumentasi formal supervisi akademik yang menyepakati tindakan kelas konkret antara
          pengawas, kepala sekolah, dan guru. Setiap rencana dirancang terukur, kontekstual, dan
          memiliki bukti keberhasilan nyata.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            id="btn-toggle-rtl-form"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showForm ? 'Tutup Formulir' : 'Buat Rencana Tindakan Baru'}</span>
          </button>

          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition"
          >
            <span>Cetak Rekap RTL & Supervisi</span>
          </button>
        </div>
      </div>

      {/* FORMULIR RTL */}
      {showForm && (
        <div id="form-rtl-card" className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Formulir Rencana Tindak Lanjut
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Susun Kesepakatan Aksi Perbaikan Kelas
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
                Rencana Tindakan Berhasil Dibuat!
              </div>
              <p className="text-xs text-emerald-300">
                Data telah tersimpan rapi dalam kartu RTL dan siap dicetak.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Sekolah */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Nama Sekolah (25 Sekolah)
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
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <optgroup label="Sekolah Dasar (SD) — 21 Sekolah Binaan" className="bg-slate-900 text-slate-200">
                      {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SD').map((s) => (
                        <option key={s.name} value={s.name} className="bg-slate-800 text-white">
                          {s.no}. {s.name} ({s.type})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Sekolah Menengah Pertama (SMP) — 4 Sekolah Binaan" className="bg-slate-900 text-slate-200">
                      {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SMP').map((s) => (
                        <option key={s.name} value={s.name} className="bg-slate-800 text-white">
                          {s.no}. {s.name} ({s.type})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Nama Guru */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Nama Guru
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Nurhayati, S.Pd."
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Jenjang */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Jenjang
                  </label>
                  <div className="flex gap-2">
                    {(['SD', 'SMP'] as const).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLevel(l)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                          level === l
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Masalah Utama */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Masalah Utama Pembelajaran
                </label>
                <textarea
                  required
                  rows={2}
                  value={mainProblem}
                  onChange={(e) => setMainProblem(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tujuan Perbaikan */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Tujuan Perbaikan
                </label>
                <input
                  type="text"
                  required
                  value={improvementGoal}
                  onChange={(e) => setImprovementGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strategi yang Dipilih */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Strategi yang Dipilih
                  </label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {TEACHING_STRATEGIES.map((st) => (
                      <option key={st.id} value={st.title}>
                        {st.title}
                      </option>
                    ))}
                    <option value="Kombinasi Strategi & Scaffolding Nalar">
                      Kombinasi Strategi & Media Nyata
                    </option>
                  </select>
                </div>

                {/* Waktu Pelaksanaan */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    required
                    value={executionTime}
                    onChange={(e) => setExecutionTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bukti Keberhasilan */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Bukti Keberhasilan (Indikator & Bukti Portofolio)
                </label>
                <input
                  type="text"
                  required
                  value={successEvidence}
                  onChange={(e) => setSuccessEvidence(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tindak Lanjut */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Rencana Tindak Lanjut Lanjutan
                </label>
                <input
                  type="text"
                  required
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-buat-rencana-tindakan"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
                >
                  Buat Rencana Tindakan
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* DAFTAR KARTU RTL RAPI (Sesuai Contoh Prompt) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Daftar Kartu Rencana Tindak Lanjut Sekolah
          </h3>
          <span className="text-xs text-blue-600 font-semibold">
            {plans.length} Dokumen Rencana Aktif
          </span>
        </div>

        {plans.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
            Belum ada rencana tindak lanjut. Klik tombol "Buat Rencana Tindakan Baru" di atas.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((p) => {
              let statusBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
              if (p.status === 'Tercapai') statusBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
              if (p.status === 'Direncanakan') statusBadgeColor = 'bg-blue-100 text-blue-800 border-blue-300';

              return (
                <div
                  key={p.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Kartu */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                            Jenjang {p.level}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {p.createdAt}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{p.schoolName}</h4>
                        <div className="text-xs text-slate-600">
                          Guru: <strong>{p.teacherName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenPrintModal(p.schoolName)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition border border-emerald-200 cursor-pointer"
                          title={`Cetak Dokumen RTL & Supervisi ${p.schoolName}`}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer ${statusBadgeColor}`}
                          title="Klik untuk mengubah status"
                        >
                          {p.status}
                        </button>
                        <button
                          onClick={() => handleDeletePlan(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Isi Rencana Terstruktur Sesuai Contoh Prompt */}
                    <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                      <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/60">
                        <strong className="text-rose-900 block mb-0.5 font-bold">Masalah:</strong>
                        <span className="text-slate-800 leading-relaxed">{p.mainProblem}</span>
                      </div>

                      <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/60">
                        <strong className="text-blue-900 block mb-0.5 font-bold">
                          Strategi & Tindakan:
                        </strong>
                        <span className="text-slate-800 leading-relaxed">
                          Guru menerapkan <strong>{p.selectedStrategy}</strong> ({p.executionTime}).
                        </span>
                      </div>

                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60">
                        <strong className="text-emerald-900 block mb-0.5 font-bold">
                          Bukti Keberhasilan:
                        </strong>
                        <span className="text-slate-800 leading-relaxed">{p.successEvidence}</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <strong className="text-slate-800 block mb-0.5 font-bold">
                          Tindak Lanjut:
                        </strong>
                        <span className="text-slate-700 leading-relaxed">{p.followUp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Tujuan: {p.improvementGoal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <StagePagination
        prevTab="instrumen-refleksi"
        prevLabel="Kembali ke Instrumen Refleksi"
        nextTab="dashboard-dampak"
        nextLabel="Lanjut ke 9. Dashboard Dampak"
        onNavigate={onNavigate}
      />
    </div>
  );
};
