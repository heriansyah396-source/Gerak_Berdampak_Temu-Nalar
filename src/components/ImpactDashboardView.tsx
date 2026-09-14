import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  School,
  Users,
  FileSpreadsheet,
  Lightbulb,
  ArrowUpRight,
  Info,
  CheckCircle2,
  RefreshCw,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Calculator,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Filter,
  Check,
  X,
  Database,
  Camera,
  Download,
} from 'lucide-react';
import { ImpactData, NavTab, SchoolProgressItem, SchoolProgressIndicators } from '../types';
import {
  getImpactData,
  saveImpactData,
  getActionPlans,
  getReflections,
  getSchoolProgress,
  saveSchoolProgress,
  deleteSchoolProgress,
  calculateNGain,
  NGainResult,
  exportSchoolProgressCsv,
} from '../utils/storage';
import { SCHOOL_LIST_TELLU_LIMPOE, OFFICIAL_SCHOOLS_TELLU_LIMPOE } from '../data/appData';
import { StagePagination } from './StagePagination';
import { BackupRestoreModal } from './BackupRestoreModal';
import { PhotoManagerModal } from './PhotoManagerModal';

interface ImpactDashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenPrintModal: (schoolName?: string) => void;
}

export const ImpactDashboardView: React.FC<ImpactDashboardViewProps> = ({
  onNavigate,
  onOpenPrintModal,
}) => {
  const [impact, setImpact] = useState<ImpactData>(getImpactData());
  const [schools, setSchools] = useState<SchoolProgressItem[]>(getSchoolProgress());
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    schools[0]?.id || 'prog-tellu-limpoe-1'
  );
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'SD' | 'SMP'>('ALL');

  // Modals state for Backup & Photos
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [csvToast, setCsvToast] = useState<string | null>(null);

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolProgressItem | null>(null);

  // Form State
  const [formSchoolName, setFormSchoolName] = useState('');
  const [formLevel, setFormLevel] = useState<'SD' | 'SMP'>('SD');
  const [formClass, setFormClass] = useState('');
  const [formTotalStudents, setFormTotalStudents] = useState<number>(30);
  const [formTeacher, setFormTeacher] = useState('');
  const [formBaselineDate, setFormBaselineDate] = useState('');
  const [formEvaluationDate, setFormEvaluationDate] = useState('');
  // 4 indicators
  const [preText, setPreText] = useState<number>(35);
  const [postText, setPostText] = useState<number>(80);
  const [preFilter, setPreFilter] = useState<number>(30);
  const [postFilter, setPostFilter] = useState<number>(75);
  const [preOp, setPreOp] = useState<number>(40);
  const [postOp, setPostOp] = useState<number>(85);
  const [preReason, setPreReason] = useState<number>(20);
  const [postReason, setPostReason] = useState<number>(70);
  // Qualitative shift
  const [formBeforePractice, setFormBeforePractice] = useState('');
  const [formAfterPractice, setFormAfterPractice] = useState('');
  const [formKeyStrategy, setFormKeyStrategy] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const plans = getActionPlans();
  const reflections = getReflections();

  // Counts by level
  const countSD = schools.filter((s) => s.level === 'SD').length;
  const countSMP = schools.filter((s) => s.level === 'SMP').length;
  const countAll = schools.length;

  // Filtered Schools
  const filteredSchools = schools.filter((s) => {
    if (filterLevel === 'ALL') return true;
    return s.level === filterLevel;
  });

  const selectedSchool =
    schools.find((s) => s.id === selectedSchoolId) || schools[0] || null;

  // Aggregate Calculations
  const totalSchoolsCount = Math.max(schools.length, impact.schoolCount);
  const totalReflectionsCount = Math.max(reflections.length, impact.reflectionTeacherCount);
  const totalPlansCount = Math.max(plans.length, impact.actionPlanCount);

  // Average N-Gain and percentage based on currently filtered scope
  const calculateSchoolAverage = (s: SchoolProgressItem) => {
    const avgPre = Math.round(
      (s.indicators.understandingText.beforePct +
        s.indicators.informationFiltering.beforePct +
        s.indicators.operationModeling.beforePct +
        s.indicators.reasoningCommunication.beforePct) /
        4
    );
    const avgPost = Math.round(
      (s.indicators.understandingText.afterPct +
        s.indicators.informationFiltering.afterPct +
        s.indicators.operationModeling.afterPct +
        s.indicators.reasoningCommunication.afterPct) /
        4
    );
    const nGain = calculateNGain(avgPre, avgPost);
    return { avgPre, avgPost, delta: avgPost - avgPre, nGain };
  };

  const aggregateMetrics = () => {
    const targetSchools = filteredSchools.length > 0 ? filteredSchools : schools;
    if (targetSchools.length === 0) {
      return { avgPre: 35, avgPost: 80, delta: 45, nGain: calculateNGain(35, 80) };
    }
    let sumPre = 0;
    let sumPost = 0;
    targetSchools.forEach((s) => {
      const stats = calculateSchoolAverage(s);
      sumPre += stats.avgPre;
      sumPost += stats.avgPost;
    });
    const avgPre = Math.round(sumPre / targetSchools.length);
    const avgPost = Math.round(sumPost / targetSchools.length);
    const delta = avgPost - avgPre;
    const nGain = calculateNGain(avgPre, avgPost);
    return { avgPre, avgPost, delta, nGain };
  };

  const currentAggregate = aggregateMetrics();

  // Export CSV Handler
  const handleExportCsv = () => {
    try {
      const listToExport = filteredSchools.length > 0 ? filteredSchools : schools;
      exportSchoolProgressCsv(listToExport);
      setCsvToast(
        filterLevel === 'ALL'
          ? 'Rekap data 25 sekolah berhasil diunduh dalam format Excel CSV.'
          : `Rekap data jenjang ${filterLevel} (${listToExport.length} sekolah) berhasil diunduh.`
      );
      setTimeout(() => setCsvToast(null), 4000);
    } catch (e) {
      setCsvToast('Gagal mengekspor data ke Excel CSV.');
      setTimeout(() => setCsvToast(null), 4000);
    }
  };

  // Refresh All when restored or reset
  const handleRefreshAll = () => {
    const freshSchools = getSchoolProgress();
    setSchools(freshSchools);
    setImpact(getImpactData());
    if (freshSchools.length > 0) {
      setSelectedSchoolId(freshSchools[0].id);
    }
  };

  // Quick Interactive Simulator State
  const [simTotal, setSimTotal] = useState<number>(30);
  const [simBefore, setSimBefore] = useState<number>(12);
  const [simAfter, setSimAfter] = useState<number>(25);
  const simBeforePct = Math.round((Math.min(simBefore, simTotal) / Math.max(1, simTotal)) * 100);
  const simAfterPct = Math.round((Math.min(simAfter, simTotal) / Math.max(1, simTotal)) * 100);
  const simDeltaPct = simAfterPct - simBeforePct;
  const simNGain = calculateNGain(simBeforePct, simAfterPct);

  // Modal Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormSchoolName(SCHOOL_LIST_TELLU_LIMPOE[0]);
    setFormLevel('SD');
    setFormClass('Kelas V');
    setFormTotalStudents(28);
    setFormTeacher('');
    setFormBaselineDate('Agustus 2026');
    setFormEvaluationDate('Oktober 2026');
    setPreText(35);
    setPostText(80);
    setPreFilter(30);
    setPostFilter(75);
    setPreOp(40);
    setPostOp(85);
    setPreReason(20);
    setPostReason(70);
    setFormBeforePractice('Guru langsung memberikan rumus dan mendikte pengerjaan.');
    setFormAfterPractice('Guru membimbing dialog nalar bertahap dan memilah informasi soal.');
    setFormKeyStrategy('Strategi 1 — Baca & Visualisasikan Cerita');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: SchoolProgressItem) => {
    setEditingItem(item);
    setFormSchoolName(item.schoolName);
    setFormLevel(item.level);
    setFormClass(item.targetClass);
    setFormTotalStudents(item.totalStudents);
    setFormTeacher(item.teacherName);
    setFormBaselineDate(item.baselineDate);
    setFormEvaluationDate(item.evaluationDate);
    setPreText(item.indicators.understandingText.beforePct);
    setPostText(item.indicators.understandingText.afterPct);
    setPreFilter(item.indicators.informationFiltering.beforePct);
    setPostFilter(item.indicators.informationFiltering.afterPct);
    setPreOp(item.indicators.operationModeling.beforePct);
    setPostOp(item.indicators.operationModeling.afterPct);
    setPreReason(item.indicators.reasoningCommunication.beforePct);
    setPostReason(item.indicators.reasoningCommunication.afterPct);
    setFormBeforePractice(item.teacherShift.beforePractice);
    setFormAfterPractice(item.teacherShift.afterPractice);
    setFormKeyStrategy(item.teacherShift.keyStrategyUsed);
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: SchoolProgressItem = {
      id: editingItem?.id || `prog-tellu-limpoe-${Date.now()}`,
      schoolName: formSchoolName,
      level: formLevel,
      targetClass: formClass,
      totalStudents: formTotalStudents,
      teacherName: formTeacher || 'Guru Kelas Dampingan',
      supervisorName: 'Heriansyah., S.Si., S.Pd., M.Pd',
      baselineDate: formBaselineDate || 'Baseline Awal',
      evaluationDate: formEvaluationDate || 'Evaluasi Akhir',
      indicators: {
        understandingText: { beforePct: preText, afterPct: postText },
        informationFiltering: { beforePct: preFilter, afterPct: postFilter },
        operationModeling: { beforePct: preOp, afterPct: postOp },
        reasoningCommunication: { beforePct: preReason, afterPct: postReason },
      },
      teacherShift: {
        beforePractice: formBeforePractice,
        afterPractice: formAfterPractice,
        keyStrategyUsed: formKeyStrategy,
      },
      notes: formNotes,
    };

    const updated = saveSchoolProgress(newItem);
    setSchools(updated);
    setSelectedSchoolId(newItem.id);
    setIsModalOpen(false);
  };

  const handleDeleteSchool = (id: string) => {
    if (confirm('Apakah Bapak/Ibu yakin ingin menghapus data progres sekolah ini?')) {
      const updated = deleteSchoolProgress(id);
      setSchools(updated);
      if (selectedSchoolId === id && updated.length > 0) {
        setSelectedSchoolId(updated[0].id);
      }
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* SECTION 1: HEADER & PRINSIP PENGUKURAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Pemantauan Capaian Berbasis Bukti Nyata</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Cetak Laporan PDF */}
            <button
              type="button"
              onClick={onOpenPrintModal}
              id="btn-open-print-modal"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-md transition cursor-pointer"
              title="Buka pratinjau cetak resmi dan unduh PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>

            {/* 2. Ekspor Excel CSV */}
            <button
              type="button"
              onClick={handleExportCsv}
              id="btn-export-csv"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-md transition cursor-pointer"
              title="Unduh rekapitulasi data 25 sekolah dalam format spreadsheet Excel/CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Excel CSV</span>
            </button>

            {/* 3. Cadangkan / Pulihkan JSON */}
            <button
              type="button"
              onClick={() => setIsBackupModalOpen(true)}
              id="btn-open-backup-modal"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-100 text-xs font-bold shadow-sm transition cursor-pointer"
              title="Pencadangan dan pemulihan data aplikasi mandiri"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Cadangan / Pulihkan</span>
            </button>

            {/* 4. Kelola Foto Kegiatan */}
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              id="btn-open-photos-modal"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold shadow-md transition cursor-pointer"
              title="Kelola dan unggah foto dokumentasi kegiatan supervisi"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto Kegiatan</span>
            </button>
          </div>
        </div>

        {/* CSV Toast Notification */}
        {csvToast && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{csvToast}</span>
          </div>
        )}

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Dashboard Progres & Dampak Sebelum vs Sesudah
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          Melacak transformasi penalaran literasi-numerasi siswa di sekolah binaan Kecamatan Tellu
          Limpoe, Kabupaten Sidenreng Rappang. Pengukuran menggunakan{' '}
          <strong className="text-slate-900">Rubrik 4 Indikator Temu Nalar</strong> dan indeks{' '}
          <strong className="text-slate-900">Normalized Gain (N-Gain Hake)</strong> untuk menguji
          efektivitas ilmiah pendampingan pengawas sekolah.
        </p>

        {/* Pemberitahuan Model Evaluasi */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block">Pemberitahuan Metodologi & Data Sekolah:</strong>
            <p className="text-xs text-amber-900 leading-relaxed">
              Data awal merupakan data dasar supervisi akademik. Bapak Pengawas dapat memperbarui,
              menambah sekolah binaan baru, atau mengubah skor pre-post riil dari hasil asesmen di
              lapangan. Gunakan tombol <strong className="underline">+ Tambah Evaluasi Sekolah</strong> untuk
              memasukkan data kelas binaan lainnya.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: 4 KARTU METRIK UTAMA AGREGAT */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sekolah Binaan
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">
              {filterLevel === 'ALL' ? totalSchoolsCount : filteredSchools.length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {filterLevel === 'ALL'
                ? '25 Sekolah (21 SD & 4 SMP)'
                : filterLevel === 'SD'
                ? `${countSD} Sekolah Dasar (SD)`
                : `${countSMP} Sekolah Menengah Pertama (SMP)`}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Pertumbuhan {filterLevel !== 'ALL' ? `(${filterLevel})` : ''}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600">
              +{currentAggregate.delta}%
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Dari {currentAggregate.avgPre}% ke {currentAggregate.avgPost}%
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Efektivitas N-Gain {filterLevel !== 'ALL' ? `(${filterLevel})` : 'Agregat'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-purple-700">
                g = {currentAggregate.nGain.score}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {currentAggregate.nGain.category}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Kategori Standar Hake</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Refleksi Guru Terdata
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900">{totalReflectionsCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Guru Dampingan Aktif</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: PELACAKAN PROGRES PER SEKOLAH BINAAN */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Pencatatan Progres Sekolah Binaan (Pre vs Post)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih sekolah untuk menelaah perkembangan detail 4 indikator dan perubahan praktik guru.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Jenjang */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setFilterLevel('ALL');
                  if (schools.length > 0) setSelectedSchoolId(schools[0].id);
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  filterLevel === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Semua</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-extrabold">
                  {countAll}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterLevel('SD');
                  const firstSD = schools.find((s) => s.level === 'SD');
                  if (firstSD) setSelectedSchoolId(firstSD.id);
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  filterLevel === 'SD'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>SD</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold">
                  {countSD}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilterLevel('SMP');
                  const firstSMP = schools.find((s) => s.level === 'SMP');
                  if (firstSMP) setSelectedSchoolId(firstSMP.id);
                }}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  filterLevel === 'SMP'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>SMP</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-extrabold">
                  {countSMP}
                </span>
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              id="btn-tambah-sekolah"
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Evaluasi</span>
            </button>
          </div>
        </div>

        {/* School Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {filteredSchools.map((s) => {
            const isSelected = s.id === selectedSchoolId;
            const stats = calculateSchoolAverage(s);
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSchoolId(s.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border text-left transition relative flex items-center gap-3 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-blue-500/50'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                        s.level === 'SD'
                          ? isSelected
                            ? 'bg-blue-800 text-blue-200'
                            : 'bg-blue-100 text-blue-800'
                          : isSelected
                          ? 'bg-purple-800 text-purple-200'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {s.level}
                    </span>
                    <span className="text-xs font-bold truncate max-w-[160px]">{s.schoolName}</span>
                  </div>
                  <div
                    className={`text-[11px] font-semibold mt-0.5 ${
                      isSelected ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    +{stats.delta}% • g = {stats.nGain.score}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected School Detail Card */}
        {selectedSchool ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* School Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-md ${
                      selectedSchool.level === 'SD'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-purple-100 text-purple-800 border border-purple-200'
                    }`}
                  >
                    Jenjang {selectedSchool.level}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Kecamatan Tellu Limpoe, Kab. Sidrap
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {selectedSchool.schoolName}
                </h3>
                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                  <span>
                    Kelas Sasaran: <strong>{selectedSchool.targetClass}</strong> ({selectedSchool.totalStudents} siswa)
                  </span>
                  <span>•</span>
                  <span>
                    Guru Dampingan: <strong>{selectedSchool.teacherName}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Linimasa: {selectedSchool.baselineDate} → {selectedSchool.evaluationDate}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => onOpenPrintModal(selectedSchool.schoolName)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Cetak atau Simpan PDF Lembar Supervisi Khusus Sekolah Ini"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak PDF Sekolah Ini</span>
                </button>
                <button
                  onClick={() => handleOpenEditModal(selectedSchool)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Data</span>
                </button>
                <button
                  onClick={() => handleDeleteSchool(selectedSchool.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="Hapus data sekolah ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

            {/* School N-Gain Banner */}
            {(() => {
              const stats = calculateSchoolAverage(selectedSchool);
              return (
                <div className="p-5 rounded-2xl bg-slate-900 text-white grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Sebelum Pendampingan (Pre)
                    </span>
                    <div className="text-3xl font-black text-rose-400">{stats.avgPre}%</div>
                    <div className="text-xs text-slate-400">Rata-rata nalar awal</div>
                  </div>

                  <div className="py-2 md:py-0 md:px-5 border-y md:border-y-0 md:border-x border-slate-800 space-y-1 text-center">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Efektivitas Peningkatan
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-2">
                      <span>{stats.avgPre}%</span>
                      <span className="text-emerald-400">→</span>
                      <span className="text-emerald-400">{stats.avgPost}%</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{stats.delta} poin persentase</span>
                    </div>
                  </div>

                  <div className="space-y-1 md:text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Skor Normalized Gain
                    </span>
                    <div className="flex items-center md:justify-end gap-2">
                      <span className="text-3xl font-black text-emerald-400">
                        g = {stats.nGain.score}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950">
                        {stats.nGain.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Formula Hake: (Post - Pre) / (100 - Pre)
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Rubrik 4 Indikator Temu Nalar Komparatif */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    Rubrik 4 Indikator Kunci Nalar (Pre vs Post)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Perbandingan persentase ketuntasan siswa pada tiap tahapan berpikir
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Target Tuntas: ≥ 75%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Indikator 1 */}
                {(() => {
                  const ind = selectedSchool.indicators.understandingText;
                  const nGain = calculateNGain(ind.beforePct, ind.afterPct);
                  const delta = ind.afterPct - ind.beforePct;
                  return (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                            1
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            Pemahaman Teks & Hal Ditanyakan
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${nGain.badgeBg}`}>
                          g={nGain.score} ({nGain.category})
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Kemampuan siswa menguraikan situasi cerita tanpa salah tafsir dan
                        menemukan misi utama yang ditanyakan.
                      </p>

                      <div className="space-y-2 pt-1">
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sebelum Pendampingan (Pre-Test)</span>
                            <strong className="text-rose-600">{ind.beforePct}%</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.beforePct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sesudah Pendampingan (Post-Test)</span>
                            <strong className="text-emerald-700 font-black">{ind.afterPct}% (+{delta}%)</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.afterPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Indikator 2 */}
                {(() => {
                  const ind = selectedSchool.indicators.informationFiltering;
                  const nGain = calculateNGain(ind.beforePct, ind.afterPct);
                  const delta = ind.afterPct - ind.beforePct;
                  return (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                            2
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            Memilah Info Penting vs Pengecoh
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${nGain.badgeBg}`}>
                          g={nGain.score} ({nGain.category})
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Kemampuan menyaring angka relevan dan tidak terkecoh oleh angka pelengkap
                        atau rincian pengalih dalam cerita.
                      </p>

                      <div className="space-y-2 pt-1">
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sebelum Pendampingan (Pre-Test)</span>
                            <strong className="text-rose-600">{ind.beforePct}%</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.beforePct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sesudah Pendampingan (Post-Test)</span>
                            <strong className="text-emerald-700 font-black">{ind.afterPct}% (+{delta}%)</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.afterPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Indikator 3 */}
                {(() => {
                  const ind = selectedSchool.indicators.operationModeling;
                  const nGain = calculateNGain(ind.beforePct, ind.afterPct);
                  const delta = ind.afterPct - ind.beforePct;
                  return (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                            3
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            Ketepatan Memilih Operasi Hitung
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${nGain.badgeBg}`}>
                          g={nGain.score} ({nGain.category})
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Menetapkan model matematika (+, -, ×, ÷) berdasarkan nalar situasi masalah,
                        bukan tebak rumus acak.
                      </p>

                      <div className="space-y-2 pt-1">
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sebelum Pendampingan (Pre-Test)</span>
                            <strong className="text-rose-600">{ind.beforePct}%</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.beforePct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sesudah Pendampingan (Post-Test)</span>
                            <strong className="text-emerald-700 font-black">{ind.afterPct}% (+{delta}%)</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.afterPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Indikator 4 */}
                {(() => {
                  const ind = selectedSchool.indicators.reasoningCommunication;
                  const nGain = calculateNGain(ind.beforePct, ind.afterPct);
                  const delta = ind.afterPct - ind.beforePct;
                  return (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold">
                            4
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            Menjelaskan Alasan & Kesimpulan Satuan
                          </span>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${nGain.badgeBg}`}>
                          g={nGain.score} ({nGain.category})
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Siswa mampu mengomunikasikan logika pengerjaannya dan melengkapi kesimpulan
                        dengan satuan yang tepat.
                      </p>

                      <div className="space-y-2 pt-1">
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sebelum Pendampingan (Pre-Test)</span>
                            <strong className="text-rose-600">{ind.beforePct}%</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.beforePct}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Sesudah Pendampingan (Post-Test)</span>
                            <strong className="text-emerald-700 font-black">{ind.afterPct}% (+{delta}%)</strong>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${ind.afterPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Transformasi Kualitatif Praktik Guru */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Transformasi Praktik Guru di Kelas
                  </h4>
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-lg">
                  Strategi Diterapkan: {selectedSchool.teacherShift.keyStrategyUsed}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200/80 space-y-1.5">
                  <span className="font-bold text-rose-800 block uppercase tracking-wider text-[11px]">
                    Kondisi Sebelum Pendampingan (Pola Awal):
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedSchool.teacherShift.beforePractice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
                  <span className="font-bold text-emerald-800 block uppercase tracking-wider text-[11px]">
                    Kondisi Sesudah Pendampingan (Temu Nalar):
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedSchool.teacherShift.afterPractice}
                  </p>
                </div>
              </div>

              {selectedSchool.notes && (
                <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                  <strong>Catatan Pengawas:</strong> {selectedSchool.notes}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            Belum ada sekolah yang dipilih atau terdata. Silakan klik "Tambah Evaluasi".
          </div>
        )}
      </div>

      {/* SECTION 4: TABEL MATRIKS REKAPITULASI SEMUA SEKOLAH BINAAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Matriks Komparasi Wilayah: Sebelum vs Sesudah
            </h3>
            <p className="text-xs text-slate-500">
              Rekapitulasi capaian rata-rata seluruh sekolah dampingan di Kecamatan Tellu Limpoe
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {schools.length} Sekolah Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3 border-b border-slate-200">Sekolah & Kelas</th>
                <th className="p-3 border-b border-slate-200">Guru Dampingan</th>
                <th className="p-3 border-b border-slate-200 text-center">Rata-rata Pre</th>
                <th className="p-3 border-b border-slate-200 text-center">Rata-rata Post</th>
                <th className="p-3 border-b border-slate-200 text-center">Peningkatan</th>
                <th className="p-3 border-b border-slate-200 text-center">N-Gain (Hake)</th>
                <th className="p-3 border-b border-slate-200 text-center">Status</th>
                <th className="p-3 border-b border-slate-200 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {schools.map((s) => {
                const stats = calculateSchoolAverage(s);
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSchoolId(s.id)}
                    className="hover:bg-blue-50/40 cursor-pointer transition"
                  >
                    <td className="p-3 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                            s.level === 'SD' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {s.level}
                        </span>
                        <span>{s.schoolName}</span>
                      </div>
                      <span className="block text-[11px] text-slate-500 font-normal">
                        {s.targetClass} ({s.totalStudents} siswa)
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{s.teacherName}</td>
                    <td className="p-3 text-center font-semibold text-rose-600">{stats.avgPre}%</td>
                    <td className="p-3 text-center font-bold text-emerald-700">{stats.avgPost}%</td>
                    <td className="p-3 text-center font-black text-emerald-600">+{stats.delta}%</td>
                    <td className="p-3 text-center font-bold text-slate-900">
                      g = {stats.nGain.score}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stats.nGain.badgeBg}`}>
                        {stats.nGain.category}
                      </span>
                    </td>
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenPrintModal(s.schoolName)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer shadow-2xs"
                        title={`Cetak Lembar Pendampingan ${s.schoolName}`}
                      >
                        <Printer className="w-3 h-3" />
                        <span>Cetak</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: KALKULATOR CEPAT SIMULASI N-GAIN INTERAKTIF */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Simulasi Cepat N-Gain Hake
          </span>
          <h3 className="text-xl sm:text-2xl font-bold">
            Kalkulator Instan Dampak Kelas
          </h3>
          <p className="text-xs text-slate-400">
            Uji coba perhitungan peningkatan siswa secara mandiri untuk persiapan evaluasi supervisi.
          </p>
        </div>

        {/* Dynamic Showcase Banner */}
        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:text-left space-y-1">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Sebelum Pendampingan
            </div>
            <div className="text-3xl font-black text-rose-400">{simBeforePct}%</div>
            <div className="text-xs text-slate-300">
              {simBefore} dari {simTotal} siswa mampu
            </div>
          </div>

          <div className="text-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-slate-700 space-y-1">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Kenaikan Capaian
            </div>
            <div className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
              <span>{simBeforePct}%</span>
              <span className="text-emerald-400">→</span>
              <span className="text-emerald-400">{simAfterPct}%</span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>+{simDeltaPct} poin persentase</span>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Hasil Nilai N-Gain
            </div>
            <div className="text-3xl font-black text-emerald-400">g = {simNGain.score}</div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-400 text-slate-950">
              Efektivitas {simNGain.category}
            </span>
          </div>
        </div>

        {/* Form Input Sliders / Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Total Siswa di Kelas: <strong className="text-white">{simTotal}</strong>
            </label>
            <input
              type="range"
              min={5}
              max={60}
              value={simTotal}
              onChange={(e) => setSimTotal(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Siswa Mampu (Sebelum): <strong className="text-rose-400">{simBefore}</strong> ({simBeforePct}%)
            </label>
            <input
              type="range"
              min={0}
              max={simTotal}
              value={Math.min(simBefore, simTotal)}
              onChange={(e) => setSimBefore(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Siswa Mampu (Sesudah): <strong className="text-emerald-400">{simAfter}</strong> ({simAfterPct}%)
            </label>
            <input
              type="range"
              min={0}
              max={simTotal}
              value={Math.min(simAfter, simTotal)}
              onChange={(e) => setSimAfter(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* MODAL: FORM TAMBAH / EDIT EVALUASI SEKOLAH BINAAN */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto cursor-pointer"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] cursor-default"
          >
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-400" />
                <h3 className="text-base sm:text-lg font-bold">
                  {editingItem ? 'Edit Data Evaluasi Sekolah' : 'Tambah Evaluasi Sekolah Dampingan'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Tutup Form (Esc)"
              >
                <X className="w-4 h-4 pointer-events-none" />
                <span>Tutup</span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-5 text-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Nama Sekolah (25 Sekolah Binaan)
                    </label>
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      Tellu Limpoe
                    </span>
                  </div>
                  <select
                    value={formSchoolName}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setFormSchoolName(selected);
                      const found = OFFICIAL_SCHOOLS_TELLU_LIMPOE.find((s) => s.name === selected);
                      if (found) {
                        setFormLevel(found.level);
                      }
                    }}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
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
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as 'SD' | 'SMP')}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                    <option value="SD">Sekolah Dasar (SD)</option>
                    <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelas Sasaran</label>
                  <input
                    type="text"
                    required
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    placeholder="Contoh: Kelas 5B"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Siswa</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    required
                    value={formTotalStudents}
                    onChange={(e) => setFormTotalStudents(Number(e.target.value))}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Guru</label>
                  <input
                    type="text"
                    required
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    placeholder="Nama Guru Dampingan"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu Asesmen Awal (Pre)
                  </label>
                  <input
                    type="text"
                    value={formBaselineDate}
                    onChange={(e) => setFormBaselineDate(e.target.value)}
                    placeholder="Misal: 14 Agustus 2026"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu Evaluasi Akhir (Post)
                  </label>
                  <input
                    type="text"
                    value={formEvaluationDate}
                    onChange={(e) => setFormEvaluationDate(e.target.value)}
                    placeholder="Misal: 20 Oktober 2026"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Input 4 Rubrik Pre vs Post */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Nilai Capaian 4 Indikator (% Siswa Mampu):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Indikator 1 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      1. Pemahaman Teks & Hal Ditanyakan
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500">Sebelum (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={preText}
                          onChange={(e) => setPreText(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Sesudah (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={postText}
                          onChange={(e) => setPostText(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Indikator 2 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      2. Memilah Info Penting vs Pengecoh
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500">Sebelum (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={preFilter}
                          onChange={(e) => setPreFilter(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Sesudah (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={postFilter}
                          onChange={(e) => setPostFilter(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Indikator 3 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      3. Ketepatan Memilih Operasi Hitung
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500">Sebelum (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={preOp}
                          onChange={(e) => setPreOp(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Sesudah (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={postOp}
                          onChange={(e) => setPostOp(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Indikator 4 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      4. Menjelaskan Alasan & Kesimpulan Satuan
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] text-slate-500">Sebelum (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={preReason}
                          onChange={(e) => setPreReason(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Sesudah (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={postReason}
                          onChange={(e) => setPostReason(Number(e.target.value))}
                          className="w-full p-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perubahan Praktik Guru Kualitatif */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Catatan Perubahan Kualitatif Praktik Guru:
                </div>

                <div>
                  <label className="block text-xs text-slate-700 mb-1">
                    Praktik Guru Sebelum Pendampingan
                  </label>
                  <textarea
                    rows={2}
                    value={formBeforePractice}
                    onChange={(e) => setFormBeforePractice(e.target.value)}
                    placeholder="Contoh: Guru mendikte rumus langsung, siswa pasif menghitung angka tanpa membaca cerita."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-700 mb-1">
                    Praktik Guru Sesudah Pendampingan
                  </label>
                  <textarea
                    rows={2}
                    value={formAfterPractice}
                    onChange={(e) => setFormAfterPractice(e.target.value)}
                    placeholder="Contoh: Guru memandu dialog nalar bertahap, siswa berdiskusi menandai informasi kunci sebelum berhitung."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-700 mb-1">
                    Strategi Utama yang Diterapkan
                  </label>
                  <input
                    type="text"
                    value={formKeyStrategy}
                    onChange={(e) => setFormKeyStrategy(e.target.value)}
                    placeholder="Misal: Strategi 1 — Baca, Visualisasikan, dan Tandai"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
                >
                  Simpan Data Evaluasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <StagePagination
        prevTab="rencana-tindak-lanjut"
        prevLabel="Kembali ke Rencana Tindak Lanjut"
        nextTab="beranda"
        nextLabel="Kembali ke Beranda Awal"
        onNavigate={onNavigate}
      />

      {/* Modal Pencadangan & Pemulihan (JSON) */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataChanged={handleRefreshAll}
      />

      {/* Modal Pengelola Foto Dokumentasi Kegiatan */}
      <PhotoManagerModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        defaultSchoolName={selectedSchool?.schoolName}
        onPhotosUpdated={handleRefreshAll}
      />
    </div>
  );
};
