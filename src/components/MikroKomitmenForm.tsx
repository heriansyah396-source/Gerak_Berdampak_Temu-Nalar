import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  PlusCircle,
  Sparkles,
  Target,
  UserCheck,
  FileText,
  Printer,
  Share2,
  Trash2,
  Filter,
  Flame,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Search,
  MessageCircle,
  Copy,
  Info,
  X,
  Pencil,
} from 'lucide-react';
import { MicroCommitment } from '../types';
import { OFFICIAL_SCHOOLS_TELLU_LIMPOE } from '../data/appData';
import {
  getMicroCommitments,
  saveMicroCommitment,
  deleteMicroCommitment,
  toggleCommitmentDay,
  KEYS,
} from '../utils/storage';

interface PresetCommitment {
  title: string;
  obstacle: MicroCommitment['targetObstacle'];
  text: string;
  indicator: string;
}

const PRESET_TEMPLATES: PresetCommitment[] = [
  {
    title: 'Stabilo Kata Kunci (Jeda 3 Menit)',
    obstacle: 'Linguistik (Pemahaman Teks)',
    text: 'Dalam 14 hari ke depan, setiap kali memulai soal cerita numerasi, saya berkomitmen memberikan jeda 3 menit bagi siswa untuk menggunakan stabilo/spidol warna menandai informasi yang diketahui dan kalimat tanya sebelum diperbolehkan memegang pensil hitung.',
    indicator: 'Minimal 85% siswa pada buku latihan tugasnya memiliki jejak stabilo pembeda antara data fakta dan kalimat tanya, serta tidak ada siswa yang langsung menjumlahkan angka secara terburu-buru.',
  },
  {
    title: 'Sketsa Kotak / Bar-Model Visual',
    obstacle: 'Transformasi Skematis (Model)',
    text: 'Dalam 14 hari ke depan, saya mewajibkan siswa membuat sketsa visual berupa diagram kotak (bar-model) atau garis alur proporsional di sisi kiri buku sebelum merumuskan kalimat matematika atau persamaan hitung.',
    indicator: 'Seluruh lembar kerja siswa memuat sketsa visual penalarannya, dan saat presentasi siswa menunjuk kotak diagram untuk menjelaskan dari mana rumus hitungnya berasal.',
  },
  {
    title: 'Pertanyaan Pemantik "Mengapa?" (Wait Time)',
    obstacle: 'Kombinasi Nalar',
    text: 'Dalam 14 hari ke depan, saya berkomitmen menahan diri untuk tidak langsung menilai jawaban benar/salah, melainkan selalu memberikan jeda berpikir (wait time) 30 detik lalu bertanya: "Mengapa kamu memilih operasi hitung itu?"',
    indicator: 'Siswa tidak takut salah saat menjawab dan minimal 70% siswa di kelas aktif berargumen logis saat sesi telaah cara berpikir.',
  },
  {
    title: 'Tulis 1 Kalimat Alasan di Bawah Hitungan',
    obstacle: 'Transformasi Skematis (Model)',
    text: 'Dalam 14 hari ke depan, saya mewajibkan siswa menulis 1 kalimat penjelasan alasan di bawah jawaban cakarannya (contoh: "karena dibagi rata ke 4 lumbung, maka menggunakan pembagian").',
    indicator: 'Siswa terbiasa mengomunikasikan makna di balik simbol angka dan tidak ada jawaban yang hanya menyajikan angka kosong tanpa penjelasan arti satuan.',
  },
  {
    title: 'Detektif Nalar (Pilah Angka Pengecoh)',
    obstacle: 'Linguistik (Pemahaman Teks)',
    text: 'Dalam 14 hari ke depan, saya melatih siswa menandai atau mencoret data angka yang tidak relevan dengan pertanyaan soal sebelum melakukan perhitungan matematika.',
    indicator: 'Siswa tidak terjebak menggunakan semua angka yang ada pada soal cerita bertingkat konteks lokal Tellu Limpoe.',
  },
];

export const MikroKomitmenForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'form' | 'guide'>('tracker');
  const [commitments, setCommitments] = useState<MicroCommitment[]>(() => getMicroCommitments());
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const [printCommitment, setPrintCommitment] = useState<MicroCommitment | null>(null);
  const [editingCommitment, setEditingCommitment] = useState<MicroCommitment | null>(null);
  const [successBanner, setSuccessBanner] = useState<{
    teacherName: string;
    schoolName: string;
    strategyTitle: string;
  } | null>(null);

  // Sync state with storage and listen to storage updates across components
  useEffect(() => {
    setCommitments(getMicroCommitments());

    const handleStorageUpdate = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (!customEvt.detail || customEvt.detail.key === KEYS.MICRO_COMMITMENTS || customEvt.detail.key === 'ALL') {
        setCommitments(getMicroCommitments());
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('app_storage_updated', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('app_storage_updated', handleStorageUpdate);
    };
  }, []);

  // Handle ESC key for modals
  useEffect(() => {
    if (!editingCommitment && !printCommitment) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingCommitment(null);
        setPrintCommitment(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingCommitment, printCommitment]);

  const handleStartEdit = (commitment: MicroCommitment) => {
    setEditingCommitment({ ...commitment });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommitment) return;
    if (!editingCommitment.teacherName.trim() || !editingCommitment.commitmentText.trim()) {
      alert('Mohon lengkapi nama guru dan teks mikro-komitmen.');
      return;
    }

    const updated = saveMicroCommitment(editingCommitment);
    setCommitments(updated);
    setSuccessBanner({
      teacherName: editingCommitment.teacherName,
      schoolName: editingCommitment.schoolName,
      strategyTitle: editingCommitment.strategyTitle,
    });
    setEditingCommitment(null);
  };

  // Form State
  const todayStr = new Date().toISOString().slice(0, 10);
  const calc14DaysLater = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 14);
      return d.toISOString().slice(0, 10);
    } catch {
      return dateStr;
    }
  };

  const [formData, setFormData] = useState<{
    schoolName: string;
    level: 'SD' | 'SMP';
    teacherName: string;
    className: string;
    subject: string;
    startDate: string;
    targetObstacle: MicroCommitment['targetObstacle'];
    strategyTitle: string;
    commitmentText: string;
    observableSuccessIndicator: string;
  }>({
    schoolName: OFFICIAL_SCHOOLS_TELLU_LIMPOE[0]?.name || '',
    level: 'SD',
    teacherName: '',
    className: 'Kelas V (Fase C)',
    subject: 'Matematika & Tematik',
    startDate: todayStr,
    targetObstacle: 'Linguistik (Pemahaman Teks)',
    strategyTitle: PRESET_TEMPLATES[0].title,
    commitmentText: PRESET_TEMPLATES[0].text,
    observableSuccessIndicator: PRESET_TEMPLATES[0].indicator,
  });

  const handleSchoolChange = (name: string) => {
    const matched = OFFICIAL_SCHOOLS_TELLU_LIMPOE.find((s) => s.name === name);
    const newLevel = matched ? matched.level : 'SD';
    setFormData((prev) => ({
      ...prev,
      schoolName: name,
      level: newLevel,
      className: newLevel === 'SD' ? 'Kelas V (Fase C)' : 'Kelas VII (Fase D)',
    }));
  };

  const applyPreset = (preset: PresetCommitment) => {
    setFormData((prev) => ({
      ...prev,
      strategyTitle: preset.title,
      targetObstacle: preset.obstacle,
      commitmentText: preset.text,
      observableSuccessIndicator: preset.indicator,
    }));
  };

  const handleToggleDay = (id: string, day: number) => {
    const updated = toggleCommitmentDay(id, day);
    setCommitments(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus mikro-komitmen 14 hari ini?')) {
      const updated = deleteMicroCommitment(id);
      setCommitments(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherName.trim() || !formData.commitmentText.trim()) {
      alert('Mohon lengkapi nama guru dan teks mikro-komitmen.');
      return;
    }

    const newCommitment: MicroCommitment = {
      id: `commit-${Date.now()}`,
      createdAt: new Date().toISOString(),
      startDate: formData.startDate,
      targetEndDate: calc14DaysLater(formData.startDate),
      schoolName: formData.schoolName,
      level: formData.level,
      teacherName: formData.teacherName.trim(),
      className: formData.className.trim(),
      subject: formData.subject.trim(),
      targetObstacle: formData.targetObstacle,
      strategyTitle: formData.strategyTitle.trim(),
      commitmentText: formData.commitmentText.trim(),
      observableSuccessIndicator: formData.observableSuccessIndicator.trim(),
      daysProgress: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
      },
      status: 'Aktif Berjalan',
      supervisorNudge: {
        day3Check: false,
        day7Check: false,
        day14Check: false,
        notes: 'Dijadwalkan sapaan hari ke-3 untuk mengecek respons awal siswa.',
      },
    };

    const updated = saveMicroCommitment(newCommitment);
    setCommitments(updated);
    setSuccessBanner({
      teacherName: newCommitment.teacherName,
      schoolName: newCommitment.schoolName,
      strategyTitle: newCommitment.strategyTitle,
    });
    setActiveTab('tracker');
    setFormData((prev) => ({
      ...prev,
      teacherName: '',
      commitmentText: PRESET_TEMPLATES[0].text,
      observableSuccessIndicator: PRESET_TEMPLATES[0].indicator,
    }));
  };

  const handleCopyWhatsapp = (c: MicroCommitment) => {
    const completedDays = Object.values(c.daysProgress).filter(Boolean).length;
    const msg = `*PENGUATAN MIKRO-KOMITMEN 14 HARI TEMU NALAR*\n` +
      `Kecamatan Tellu Limpoe - Sidrap\n\n` +
      `Kepada Yth. *${c.teacherName}*\n` +
      `Sekolah: *${c.schoolName}* (${c.className})\n\n` +
      `📌 *Komitmen 14 Hari:* \n"${c.commitmentText}"\n\n` +
      `🎯 *Indikator Tampak:* \n${c.observableSuccessIndicator}\n\n` +
      `📊 *Progres Pelaksanaan:* ${completedDays}/14 Hari (${Math.round((completedDays / 14) * 100)}%)\n` +
      `Status: *${c.status}*\n\n` +
      `"Satu perubahan kecil yang dilakukan secara konsisten di kelas akan membawa dampak nalar yang abadi bagi siswa kita."\n\n` +
      `Salam hangat,\n*Heriansyah., S.Si., S.Pd., M.Pd*\nPengawas Pembina`;

    navigator.clipboard.writeText(msg).then(() => {
      setCopyNotice(c.id);
      setTimeout(() => setCopyNotice(null), 3000);
    });
  };

  // Filtered list
  const filteredCommitments = commitments.filter((c) => {
    const matchSchool = selectedSchoolFilter === 'ALL' || c.schoolName === selectedSchoolFilter;
    const matchStatus = selectedStatusFilter === 'ALL' || c.status === selectedStatusFilter;
    const matchQuery =
      searchQuery === '' ||
      c.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.strategyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSchool && matchStatus && matchQuery;
  });

  return (
    <div id="formulir-mikro-komitmen" className="mt-8 pt-8 border-t border-slate-200 space-y-8">
      {/* Banner Kebaruan */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kebaruan Pengawasan Berdampak</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Target Waktu: <strong>14 Hari Kerja Kalender</strong></span>
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Formulir Mikro-Komitmen 14 Hari Guru
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed mt-1">
              Inovasi pendampingan berbasis <strong>One-Bite Pedagogical Shift</strong>: menggantikan dokumen RTL
              tebal yang sering menjadi formalitas mati dengan <strong>1 perubahan perilaku mengajar spesifik</strong> yang
              dipraktikkan konsisten selama 14 hari serta disapa secara berkala oleh pengawas pembina.
            </p>
          </div>

          {/* Tab Navigasi Sub-Komponen */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-800/60">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
                activeTab === 'tracker'
                  ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Pantau Komitmen Aktif ({commitments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Mikro-Komitmen Baru</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                  : 'bg-slate-800/80 text-blue-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Panduan Protokol 14 Hari</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: TRACKER DAFTAR KOMITMEN 14 HARI */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Success Notification Banner */}
          {successBanner && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-slate-800 shadow-sm flex items-start justify-between gap-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-sm sm:text-base text-emerald-950 flex flex-wrap items-center gap-2">
                    <span>Mikro-Komitmen 14 Hari Berhasil Disimpan Permanen!</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                      Tersimpan Aman
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Aksi mikro untuk <strong>{successBanner.teacherName}</strong> ({successBanner.schoolName}) dengan fokus <em>"{successBanner.strategyTitle}"</em> telah tersimpan di <strong>LocalStorage</strong> dan diamankan di <strong>IndexedDB Browser</strong>. Data tidak akan hilang saat aplikasi ditutup atau dibuka keesokan harinya.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSuccessBanner(null)}
                className="p-1.5 rounded-lg hover:bg-emerald-200 text-emerald-800 transition cursor-pointer"
                title="Tutup pemberitahuan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama guru, sekolah, atau strategi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={selectedSchoolFilter}
                onChange={(e) => setSelectedSchoolFilter(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
              >
                <option value="ALL">Semua Sekolah Binaan</option>
                {OFFICIAL_SCHOOLS_TELLU_LIMPOE.map((s) => (
                  <option key={s.no} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="Aktif Berjalan">Aktif Berjalan</option>
                <option value="Review Hari Ke-7">Review Hari Ke-7</option>
                <option value="Tuntas Berdampak">Tuntas Berdampak</option>
                <option value="Perlu Penyesuaian">Perlu Penyesuaian</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          {filteredCommitments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-6 space-y-3">
              <Clock className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold text-slate-700">Belum ada mikro-komitmen yang cocok</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Silakan buat mikro-komitmen baru untuk guru dampingan Anda dengan klik tab "+ Buat Mikro-Komitmen Baru".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredCommitments.map((c) => {
                const completedCount = Object.values(c.daysProgress).filter(Boolean).length;
                const percentage = Math.round((completedCount / 14) * 100);
                const isFinished = completedCount === 14;

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-7 space-y-6 hover:border-blue-400 transition"
                  >
                    {/* Header Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              c.level === 'SD'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                            }`}
                          >
                            {c.level}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            {c.schoolName}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-700">
                            {c.className}
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">
                          {c.teacherName} — <span className="text-blue-700">{c.strategyTitle}</span>
                        </h4>
                      </div>

                      {/* Status Badge & Quick Edit */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center gap-1 border border-slate-200 cursor-pointer shadow-2xs"
                          title="Edit komitmen guru ini"
                        >
                          <Pencil className="w-3 h-3 text-blue-600" />
                          <span>Edit</span>
                        </button>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                            isFinished
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : completedCount >= 7
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {isFinished ? (
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{c.status} ({completedCount}/14 Hari)</span>
                        </span>
                      </div>
                    </div>

                    {/* Komitmen & Indikator */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-blue-600" />
                          <span>Rumusan 1 Mikro-Komitmen Tunggal</span>
                        </div>
                        <p className="text-slate-900 font-medium leading-relaxed italic">
                          "{c.commitmentText}"
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tanda Keberhasilan yang Tampak di Kelas</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed">
                          {c.observableSuccessIndicator}
                        </p>
                      </div>
                    </div>

                    {/* 14-Day Progress Bar & Interactive Checkpoints */}
                    <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <div className="font-extrabold text-blue-950 flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-500" />
                          <span>Checklist Jejak Harian (Klik nomor hari untuk menandai pelaksanaan):</span>
                        </div>
                        <div className="text-blue-700 font-bold">
                          {percentage}% Selesai • Periode: {c.startDate} s.d. {c.targetEndDate}
                        </div>
                      </div>

                      {/* Visual 14 Days Dots */}
                      <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-1">
                        {Array.from({ length: 14 }, (_, i) => i + 1).map((dayNum) => {
                          const isDone = !!c.daysProgress[dayNum];
                          const isDay3 = dayNum === 3;
                          const isDay7 = dayNum === 7;
                          const isDay14 = dayNum === 14;

                          return (
                            <button
                              key={dayNum}
                              title={`Hari ke-${dayNum} (Klik untuk ${isDone ? 'batalkan' : 'centang'})`}
                              onClick={() => handleToggleDay(c.id, dayNum)}
                              className={`h-11 rounded-xl flex flex-col items-center justify-center transition border font-bold relative text-xs ${
                                isDone
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                              } ${isDay7 || isDay14 ? 'ring-1 ring-amber-400' : ''}`}
                            >
                              <span className="text-[10px] opacity-80">H-{dayNum}</span>
                              <span className="text-xs">
                                {isDone ? '✓' : '—'}
                              </span>
                              {(isDay3 || isDay7 || isDay14) && (
                                <span
                                  className={`absolute -top-1.5 -right-1 px-1 rounded text-[8px] font-black ${
                                    isDay14
                                      ? 'bg-purple-600 text-white'
                                      : isDay7
                                      ? 'bg-amber-500 text-slate-950'
                                      : 'bg-blue-600 text-white'
                                  }`}
                                >
                                  {isDay14 ? 'Akhir' : isDay7 ? 'Mid' : 'Sapa'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                            <strong>H-3:</strong> Sapaan WA Pengawas
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                            <strong>H-7:</strong> Walkthrough / Review Tengah
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                            <strong>H-14:</strong> Refleksi Tuntas
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sapaan Pengawas & Refleksi Guru */}
                    {(c.teacherReflectionNote || c.supervisorFeedback || c.supervisorNudge?.notes) && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                        {c.supervisorNudge?.notes && (
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-blue-900">Jejak Pendampingan Pengawas:</strong>{' '}
                              <span className="text-slate-800">{c.supervisorNudge.notes}</span>
                            </div>
                          </div>
                        )}
                        {c.teacherReflectionNote && (
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                              <strong className="text-emerald-900">Refleksi Guru di Kelas:</strong>{' '}
                              <span className="text-slate-800">{c.teacherReflectionNote}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleCopyWhatsapp(c)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Kirim Pengingat WhatsApp</span>
                        </button>
                        {copyNotice === c.id && (
                          <span className="text-xs text-emerald-700 font-bold animate-pulse">
                            ✓ Teks WA tersalin!
                          </span>
                        )}

                        <button
                          onClick={() => setPrintCommitment(c)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak Lembar Komitmen</span>
                        </button>

                        <button
                          onClick={() => handleStartEdit(c)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          title="Edit formulir komitmen ini"
                        >
                          <Pencil className="w-3.5 h-3.5 text-blue-600" />
                          <span>Edit Komitmen</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                          title="Edit komitmen"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus komitmen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FORM INPUT BARU */}
      {activeTab === 'form' && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-7"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Formulir Kesepakatan Mikro-Komitmen 14 Hari
              </h4>
              <p className="text-xs sm:text-sm text-slate-600">
                Disepakati bersama antara Pengawas Sekolah Pembina dan Guru dampingan saat sesi coaching dialog refleksi klinis.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-semibold shadow-xs shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Penyimpanan Aman (LocalStorage & IndexedDB)</span>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gunakan Inspirasi Preset Cepat (5 Strategi Temu Nalar):</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PRESET_TEMPLATES.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className={`p-3 rounded-2xl border text-left text-xs transition ${
                    formData.strategyTitle === p.title
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-extrabold text-slate-900 mb-0.5">{p.title}</div>
                  <div className="text-[10px] text-slate-500">{p.obstacle}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
            {/* Sekolah */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sekolah Binaan di Tellu Limpoe *</label>
              <select
                value={formData.schoolName}
                onChange={(e) => handleSchoolChange(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {OFFICIAL_SCHOOLS_TELLU_LIMPOE.map((s) => (
                  <option key={s.no} value={s.name}>
                    {s.name} ({s.level})
                  </option>
                ))}
              </select>
            </div>

            {/* Nama Guru */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Nama Lengkap Guru Dampingan *</label>
              <input
                type="text"
                required
                placeholder="misal: Siti Nurhalizah, S.Pd."
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Kelas & Mapel */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Sasaran Kelas & Fase</label>
              <input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                placeholder="misal: Kelas V (Fase C)"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Mata Pelajaran / Muatan</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="misal: Matematika / Tematik"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tanggal Mulai */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Tanggal Mulai (Hari ke-1)</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-[11px] text-slate-500">
                Target Selesai (Hari ke-14): <strong>{calc14DaysLater(formData.startDate)}</strong>
              </div>
            </div>

            {/* Target Hambatan Nalar */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Fokus Hambatan Nalar yang Diintervensi</label>
              <select
                value={formData.targetObstacle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetObstacle: e.target.value as MicroCommitment['targetObstacle'],
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Linguistik (Pemahaman Teks)">Lapisan 1: Linguistik (Pemahaman Teks & Istilah)</option>
                <option value="Transformasi Skematis (Model)">Lapisan 2: Transformasi Skematis (Visual Model)</option>
                <option value="Komputasi Teknis">Lapisan 3: Komputasi Teknis & Satuan</option>
                <option value="Kombinasi Nalar">Kombinasi / Dialog Penalaran Kelas</option>
              </select>
            </div>
          </div>

          {/* Teks Mikro-Komitmen */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 flex items-center justify-between text-xs sm:text-sm">
              <span>Rumusan 1 Mikro-Komitmen Tunggal Guru (One-Bite Commitment) *</span>
              <span className="text-[11px] font-normal text-slate-500">Gunakan kalimat aksi operasional yang realistis</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.commitmentText}
              onChange={(e) => setFormData({ ...formData, commitmentText: e.target.value })}
              placeholder="Dalam 14 hari ke depan, setiap kali... saya berkomitmen untuk..."
              className="w-full p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Indikator Tampak */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 flex items-center justify-between text-xs sm:text-sm">
              <span>Tanda Keberhasilan yang Tampak di Kelas (*Observable Success Indicator*) *</span>
              <span className="text-[11px] font-normal text-slate-500">Bukti fisik/perilaku apa yang bisa dicek pengawas?</span>
            </label>
            <textarea
              required
              rows={2}
              value={formData.observableSuccessIndicator}
              onChange={(e) => setFormData({ ...formData, observableSuccessIndicator: e.target.value })}
              placeholder="misal: Minimal 85% siswa pada buku tugasnya menandai kata kunci dengan stabilo..."
              className="w-full p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Jadwal Nudge Pengawas Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <div className="font-extrabold">Jadwal Sapaan Pendampingan Pengawas (*Gentle Nudging*):</div>
              <p>
                Sistem akan memplot otomatis pengingat sapaan: <strong>Hari ke-3</strong> (Sapaan WhatsApp apresiatif),{' '}
                <strong>Hari ke-7</strong> (Kunjungan *Walkthrough* 15 menit), dan <strong>Hari ke-14</strong> (Dialog Refleksi Tuntas).
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('tracker')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-emerald-700/25 flex items-center gap-2 transition cursor-pointer active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Mulai Siklus 14 Hari</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PANDUAN PROTOKOL */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="space-y-2 pb-4 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Mengapa Ini Kebaruan Nyata?</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Prinsip 14-Day Micro-Commitment dalam Pengawasan Berdampak
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              Teori perubahan perilaku (*Behavioral Economics & Implementation Science*) membuktikan bahwa
              guru gagal menerapkan RTL bukan karena malas, melainkan karena target yang disepakati terlalu besar,
              terlalu abstrak, dan tidak ada pengingat berkala.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h5 className="font-extrabold text-slate-900 text-sm">Hanya Satu Perilaku Mikro</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guru tidak dibebani 10 rencana kerja. Hanya 1 aksi pedagogis mikro (misal: jeda 3 menit stabilo kata kunci).
                Kecil, konkret, dan tidak menimbulkan beban mental.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h5 className="font-extrabold text-slate-900 text-sm">14 Hari Pembentukan Kebiasaan</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                14 hari kerja adalah durasi optimal agar kebiasaan baru mulai mengakar di kelas tanpa menunggu
                waktu berbulan-bulan yang menghilangkan momentum perbaikan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h5 className="font-extrabold text-slate-900 text-sm">Pengawas Sebagai Pendukung (Nudge)</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pengawas tidak datang sebagai pemeriksa yang menakutkan, melainkan menyapa ramah di Hari ke-3 via WhatsApp,
                kunjungan kilas di Hari ke-7, dan merayakan keberhasilan di Hari ke-14.
              </p>
            </div>
          </div>

          {/* Protokol 3 Titik Sapaan */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 space-y-3">
            <h5 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Protokol 3 Titik Sapaan Pengawas (Heriansyah., S.Si., S.Pd., M.Pd)</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-blue-200 space-y-1">
                <div className="font-bold text-blue-700">Hari ke-3: Sapaan Apresiatif WA</div>
                <p className="text-slate-600">
                  "Halo Bu/Pak, bagaimana respons siswa di hari ketiga jeda stabilo? Apakah anak-anak sudah mulai terbiasa?"
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                <div className="font-bold text-amber-700">Hari ke-7: Walkthrough 15 Menit</div>
                <p className="text-slate-600">
                  Pengawas mengintip kelas selama 15 menit, melihat langsung lembar coretan siswa, lalu memberi jempol apresiasi.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-700">Hari ke-14: Dialog Tuntas & Rayakan</div>
                <p className="text-slate-600">
                  Menelaah sampel lembar kerja akhir, menandai status "Tuntas Berdampak", dan mendokumentasikan untuk Kombel.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT MIKRO-KOMITMEN */}
      {editingCommitment && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 space-y-6 shadow-2xl my-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs shrink-0">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                    Edit Mikro-Komitmen 14 Hari
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perbarui rumusan komitmen, guru sasaran, atau catatan pendampingan tanpa mereset progres harian.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCommitment(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveEdit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
              {/* Row 1: Sekolah & Guru */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Satuan Pendidikan</label>
                  <select
                    value={editingCommitment.schoolName}
                    onChange={(e) => {
                      const name = e.target.value;
                      const matched = OFFICIAL_SCHOOLS_TELLU_LIMPOE.find((s) => s.name === name);
                      const newLevel = matched ? matched.level : 'SD';
                      setEditingCommitment((prev) =>
                        prev
                          ? {
                              ...prev,
                              schoolName: name,
                              level: newLevel,
                            }
                          : null
                      );
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {OFFICIAL_SCHOOLS_TELLU_LIMPOE.map((s) => (
                      <option key={s.no} value={s.name}>
                        [{s.level}] {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Guru Dampingan</label>
                  <input
                    type="text"
                    required
                    value={editingCommitment.teacherName}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev ? { ...prev, teacherName: e.target.value } : null
                      )
                    }
                    placeholder="Contoh: Usman S.Pd., Gr"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
              </div>

              {/* Row 2: Kelas & Mapel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Kelas / Fase</label>
                  <input
                    type="text"
                    value={editingCommitment.className}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev ? { ...prev, className: e.target.value } : null
                      )
                    }
                    placeholder="Contoh: Kelas VI (Fase C)"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mata Pelajaran / Fokus</label>
                  <input
                    type="text"
                    value={editingCommitment.subject}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev ? { ...prev, subject: e.target.value } : null
                      )
                    }
                    placeholder="Contoh: Matematika & Tematik Numerasi"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Tanggal Mulai, Tanggal Selesai, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={editingCommitment.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setEditingCommitment((prev) =>
                        prev
                          ? {
                              ...prev,
                              startDate: newStart,
                              targetEndDate: calc14DaysLater(newStart),
                            }
                          : null
                      );
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Target Selesai (14 Hari)</label>
                  <input
                    type="date"
                    value={editingCommitment.targetEndDate}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev ? { ...prev, targetEndDate: e.target.value } : null
                      )
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">Status Siklus</label>
                  <select
                    value={editingCommitment.status}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev ? { ...prev, status: e.target.value as MicroCommitment['status'] } : null
                      )
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Aktif Berjalan">Aktif Berjalan</option>
                    <option value="Review Hari Ke-7">Review Hari Ke-7</option>
                    <option value="Tuntas Berdampak">Tuntas Berdampak</option>
                    <option value="Perlu Penyesuaian">Perlu Penyesuaian</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Hambatan & Judul Strategi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Fokus Hambatan Siswa</label>
                  <select
                    value={editingCommitment.targetObstacle}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev
                          ? {
                              ...prev,
                              targetObstacle: e.target.value as MicroCommitment['targetObstacle'],
                            }
                          : null
                      )
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Linguistik (Pemahaman Teks)">Linguistik (Pemahaman Teks)</option>
                    <option value="Transformasi Skematis (Model)">Transformasi Skematis (Model)</option>
                    <option value="Komputasi Teknis">Komputasi Teknis</option>
                    <option value="Kombinasi Nalar">Kombinasi Nalar</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Judul Strategi Pendampingan</label>
                  <input
                    type="text"
                    required
                    value={editingCommitment.strategyTitle}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev ? { ...prev, strategyTitle: e.target.value } : null
                      )
                    }
                    placeholder="Contoh: Stabilo Kata Kunci (Jeda 3 Menit)"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-900"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for editing */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500">
                  Ganti Cepat dari Template Teruji:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TEMPLATES.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEditingCommitment((prev) =>
                          prev
                            ? {
                                ...prev,
                                strategyTitle: p.title,
                                targetObstacle: p.obstacle,
                                commitmentText: p.text,
                                observableSuccessIndicator: p.indicator,
                              }
                            : null
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition cursor-pointer"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 5: Rumusan Komitmen */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Rumusan 1 Mikro-Komitmen Tunggal</span>
                  <span className="text-[11px] text-slate-400 font-normal">Spesifik, terukur, dan fokus 1 aksi</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingCommitment.commitmentText}
                  onChange={(e) =>
                    setEditingCommitment((prev) =>
                      prev ? { ...prev, commitmentText: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              {/* Row 6: Indikator Keberhasilan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-800 flex items-center justify-between">
                  <span>Tanda Keberhasilan yang Tampak di Kelas (*Observable Sign*)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Perilaku murid/guru yang dapat diamati</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingCommitment.observableSuccessIndicator}
                  onChange={(e) =>
                    setEditingCommitment((prev) =>
                      prev ? { ...prev, observableSuccessIndicator: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-emerald-300 bg-emerald-50/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              {/* Row 7: Catatan Pendampingan & Refleksi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-900">
                    Catatan Jejak Pendampingan Pengawas
                  </label>
                  <textarea
                    rows={2}
                    value={editingCommitment.supervisorNudge?.notes || ''}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev
                          ? {
                              ...prev,
                              supervisorNudge: {
                                day3Check: prev.supervisorNudge?.day3Check || false,
                                day7Check: prev.supervisorNudge?.day7Check || false,
                                day14Check: prev.supervisorNudge?.day14Check || false,
                                notes: e.target.value,
                              },
                            }
                          : null
                      )
                    }
                    placeholder="Contoh: Terjadwal sapaan hari ke-3 untuk memantau respons awal siswa."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-900">
                    Catatan Refleksi Guru di Kelas
                  </label>
                  <textarea
                    rows={2}
                    value={editingCommitment.teacherReflectionNote || ''}
                    onChange={(e) =>
                      setEditingCommitment((prev) =>
                        prev ? { ...prev, teacherReflectionNote: e.target.value } : null
                      )
                    }
                    placeholder="Contoh: Siswa antusias menandai kata kunci dengan spidol warna."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingCommitment(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Perubahan Komitmen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRINT PREVIEW LEMBAR KOMITMEN */}
      {printCommitment && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="text-xs font-bold uppercase text-slate-500">
                Pratinjau Cetak Dokumen Supervisi
              </div>
              <button
                onClick={() => setPrintCommitment(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                ✕
              </button>
            </div>

            {/* Konten Lembar Cetak */}
            <div
              id="printable-commitment-sheet"
              className="p-6 border-2 border-slate-800 rounded-2xl space-y-5 bg-white text-slate-900"
            >
              {/* Kop Sederhana */}
              <div className="text-center pb-3 border-b-2 border-slate-800 space-y-0.5">
                <div className="text-[11px] font-bold tracking-widest uppercase text-slate-600">
                  PENDAMPINGAN PENGAWAS SEKOLAH — KECAMATAN TELLU LIMPOE
                </div>
                <div className="text-base sm:text-lg font-black uppercase text-slate-900">
                  LEMBAR MIKRO-KOMITMEN 14 HARI PENGUATAN NALAR GURU
                </div>
                <div className="text-[10px] text-slate-500">
                  Pendekatan GERAK BERDAMPAK: Temu Nalar Literasi & Numerasi
                </div>
              </div>

              {/* Data Guru & Sekolah */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Nama Guru:</span>{' '}
                  <strong className="text-slate-900">{printCommitment.teacherName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Sekolah:</span>{' '}
                  <strong className="text-slate-900">{printCommitment.schoolName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Kelas / Fase:</span>{' '}
                  <strong className="text-slate-900">{printCommitment.className}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Masa Siklus:</span>{' '}
                  <strong className="text-slate-900">
                    {printCommitment.startDate} s.d. {printCommitment.targetEndDate}
                  </strong>
                </div>
              </div>

              {/* Komitmen Tunggal */}
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 text-xs">
                <div className="font-black text-slate-800 uppercase text-[10px]">
                  Rumusan 1 Mikro-Komitmen Pedagogis:
                </div>
                <p className="font-semibold italic text-slate-900 leading-relaxed">
                  "{printCommitment.commitmentText}"
                </p>
              </div>

              {/* Indikator Tampak */}
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 text-xs">
                <div className="font-black text-slate-800 uppercase text-[10px]">
                  Tanda Keberhasilan Terlihat di Kelas (*Observable Sign*):
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {printCommitment.observableSuccessIndicator}
                </p>
              </div>

              {/* Matriks 14 Hari */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-800 text-[10px] uppercase">
                  Log Verifikasi 14 Hari Kerja:
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((d) => (
                    <div
                      key={d}
                      className="p-1.5 border border-slate-400 rounded text-[10px] font-bold"
                    >
                      H-{d}: {printCommitment.daysProgress[d] ? '✓' : 'O'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-4 flex justify-between text-xs text-center">
                <div className="space-y-10">
                  <div>Guru Dampingan,</div>
                  <div className="font-bold underline">{printCommitment.teacherName}</div>
                </div>
                <div className="space-y-10">
                  <div>Pengawas Pembina,</div>
                  <div className="font-bold underline">Heriansyah., S.Si., S.Pd., M.Pd</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPrintCommitment(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
