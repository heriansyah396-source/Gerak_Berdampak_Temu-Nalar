import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  X,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  School,
  AlertCircle,
  User,
  Users,
  Edit2,
  Tag,
  Check,
} from 'lucide-react';
import { DocPhoto } from '../types';
import {
  getDocPhotos,
  saveDocPhoto,
  updateDocPhoto,
  deleteDocPhoto,
  getSchoolProgress,
  getActionPlans,
  getReflections,
  getGerakRecords,
} from '../utils/storage';
import { SCHOOL_LIST_TELLU_LIMPOE } from '../data/appData';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSchoolName?: string;
  defaultTeacherName?: string;
  availableTeachers?: string[];
  onPhotosUpdated?: () => void;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  defaultSchoolName,
  defaultTeacherName,
  availableTeachers,
  onPhotosUpdated,
}) => {
  const [photos, setPhotos] = useState<DocPhoto[]>(() => getDocPhotos());
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>(
    defaultSchoolName || 'ALL'
  );
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('ALL');

  // Form State for new photo
  const [showAddForm, setShowAddForm] = useState(false);
  const [formSchool, setFormSchool] = useState<string>(defaultSchoolName || 'ALL');
  const [formTeacherMode, setFormTeacherMode] = useState<'preset' | 'custom' | 'general'>('preset');
  const [formTeacher, setFormTeacher] = useState<string>(defaultTeacherName || '');
  const [customTeacherInput, setCustomTeacherInput] = useState<string>('');
  const [formActivityType, setFormActivityType] = useState<string>('Observasi Pembelajaran Kelas');
  const [formTitle, setFormTitle] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formDate, setFormDate] = useState('Agustus 2026');
  const [formDataUrl, setFormDataUrl] = useState<string>('');
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editing Teacher for an existing photo
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editTeacherValue, setEditTeacherValue] = useState<string>('');

  // Extract all teachers associated with each school
  const allKnownTeachersMap = useMemo(() => {
    const map = new Map<string, Set<string>>();

    const add = (sch: string, teacher?: string) => {
      if (!sch || !teacher || teacher.trim() === '' || teacher === 'ALL') return;
      if (!map.has(sch)) map.set(sch, new Set<string>());
      map.get(sch)?.add(teacher.trim());
    };

    getSchoolProgress().forEach((p) => add(p.schoolName, p.teacherName));
    getActionPlans().forEach((p) => add(p.schoolName, p.teacherName));
    getReflections().forEach((r) => add(r.schoolName, r.teacherName));
    getGerakRecords().forEach((g) => add(g.schoolName, g.teacherName));
    photos.forEach((p) => add(p.schoolName, p.teacherName));

    if (availableTeachers && defaultSchoolName) {
      availableTeachers.forEach((t) => add(defaultSchoolName, t));
    }

    return map;
  }, [photos, availableTeachers, defaultSchoolName]);

  // Detected teachers for currently chosen school in the form
  const formSchoolTeachers = useMemo(() => {
    if (formSchool === 'ALL') {
      const allSet = new Set<string>();
      allKnownTeachersMap.forEach((teachers) => {
        teachers.forEach((t) => allSet.add(t));
      });
      return Array.from(allSet);
    }
    return Array.from(allKnownTeachersMap.get(formSchool) || []);
  }, [formSchool, allKnownTeachersMap]);

  // Detected teachers for currently selected school filter
  const filterSchoolTeachers = useMemo(() => {
    if (selectedSchoolFilter === 'ALL') {
      const allSet = new Set<string>();
      allKnownTeachersMap.forEach((teachers) => {
        teachers.forEach((t) => allSet.add(t));
      });
      return Array.from(allSet);
    }
    return Array.from(allKnownTeachersMap.get(selectedSchoolFilter) || []);
  }, [selectedSchoolFilter, allKnownTeachersMap]);

  // Sync props when modal opens or props change
  useEffect(() => {
    if (defaultSchoolName) {
      setSelectedSchoolFilter(defaultSchoolName);
      setFormSchool(defaultSchoolName);
    }
    if (defaultTeacherName) {
      setFormTeacher(defaultTeacherName);
      setFormTeacherMode('preset');
      setSelectedTeacherFilter(defaultTeacherName);
    } else {
      setSelectedTeacherFilter('ALL');
    }
  }, [defaultSchoolName, defaultTeacherName, isOpen]);

  // Reload photos on open
  useEffect(() => {
    if (!isOpen) return;
    setPhotos(getDocPhotos());
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Update default teacher selection when form school changes
  useEffect(() => {
    if (formTeacherMode === 'preset') {
      if (defaultTeacherName && formSchoolTeachers.includes(defaultTeacherName)) {
        setFormTeacher(defaultTeacherName);
      } else if (formSchoolTeachers.length > 0) {
        setFormTeacher(formSchoolTeachers[0]);
      } else {
        setFormTeacherMode('general');
        setFormTeacher('ALL');
      }
    }
  }, [formSchool, formSchoolTeachers, defaultTeacherName]);

  if (!isOpen) return null;

  // Compress image before saving
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih file gambar (JPEG, PNG, atau WebP).');
      return;
    }

    setIsProcessingImg(true);
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Max dimension 900px for print quality & lightweight storage
        const maxDim = 900;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.78);
          setFormDataUrl(compressed);
        } else {
          setFormDataUrl(readerEvent.target?.result as string);
        }
        setIsProcessingImg(false);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataUrl) {
      setErrorMsg('Silakan unggah atau pilih file foto terlebih dahulu.');
      return;
    }
    if (!formTitle.trim()) {
      setErrorMsg('Judul foto wajib diisi.');
      return;
    }

    let finalTeacherName = 'ALL';
    if (formTeacherMode === 'general') {
      finalTeacherName = 'ALL';
    } else if (formTeacherMode === 'custom') {
      if (!customTeacherInput.trim()) {
        setErrorMsg('Silakan ketikkan nama guru dampingan.');
        return;
      }
      finalTeacherName = customTeacherInput.trim();
    } else {
      finalTeacherName = formTeacher || 'ALL';
    }

    const newPhoto: DocPhoto = {
      id: `photo-${Date.now()}`,
      schoolName: formSchool,
      teacherName: finalTeacherName,
      activityType: formActivityType,
      title: formTitle.trim(),
      caption: formCaption.trim() || 'Dokumentasi kegiatan pendampingan pengawas pembina.',
      date: formDate.trim() || '2026',
      dataUrl: formDataUrl,
    };

    const updated = saveDocPhoto(newPhoto);
    setPhotos(updated);
    if (onPhotosUpdated) onPhotosUpdated();

    // Reset form
    setFormDataUrl('');
    setFormTitle('');
    setFormCaption('');
    setCustomTeacherInput('');
    setShowAddForm(false);
    setErrorMsg(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus foto dokumentasi ini?')) {
      const updated = deleteDocPhoto(id);
      setPhotos(updated);
      if (onPhotosUpdated) onPhotosUpdated();
    }
  };

  const handleStartEditTeacher = (photo: DocPhoto) => {
    setEditingPhotoId(photo.id);
    setEditTeacherValue(photo.teacherName || 'ALL');
  };

  const handleSaveEditTeacher = (photoId: string) => {
    const updated = updateDocPhoto(photoId, {
      teacherName: editTeacherValue.trim() || 'ALL',
    });
    setPhotos(updated);
    setEditingPhotoId(null);
    if (onPhotosUpdated) onPhotosUpdated();
  };

  // Filter photos based on School AND Teacher
  const filteredPhotos = photos.filter((p) => {
    // School filter
    const matchSchool =
      selectedSchoolFilter === 'ALL' ||
      p.schoolName === 'ALL' ||
      p.schoolName === selectedSchoolFilter;

    if (!matchSchool) return false;

    // Teacher filter
    if (selectedTeacherFilter === 'ALL') return true;
    if (selectedTeacherFilter === 'GENERAL_ONLY') {
      return !p.teacherName || p.teacherName === 'ALL';
    }

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pT = normalize(p.teacherName || '');
    const sT = normalize(selectedTeacherFilter);
    return pT === sT || pT.includes(sT) || sT.includes(pT);
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] cursor-default my-auto"
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Dokumentasi Foto Kegiatan Pendampingan
              </h3>
              <p className="text-xs text-slate-400">
                Tautkan foto visual ke masing-masing guru dampingan atau satuan pendidikan binaan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4 pointer-events-none" />
            <span>Tutup</span>
          </button>
        </div>

        {/* Toolbar Filter & Add Button */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Filter Sekolah */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600 shrink-0 flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-blue-600" />
                <span>Sekolah:</span>
              </span>
              <select
                value={selectedSchoolFilter}
                onChange={(e) => {
                  setSelectedSchoolFilter(e.target.value);
                  setSelectedTeacherFilter('ALL');
                }}
                className="p-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 max-w-[220px]"
              >
                <option value="ALL">Semua Sekolah Binaan</option>
                {SCHOOL_LIST_TELLU_LIMPOE.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Guru Dampingan */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-600 shrink-0 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guru:</span>
              </span>
              <select
                value={selectedTeacherFilter}
                onChange={(e) => setSelectedTeacherFilter(e.target.value)}
                className="p-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 max-w-[200px]"
              >
                <option value="ALL">Semua Guru & Umum</option>
                <option value="GENERAL_ONLY">Hanya Dokumentasi Umum</option>
                {filterSchoolTeachers.map((t) => (
                  <option key={t} value={t}>
                    Khusus: {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setErrorMsg(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? 'Batal Tambah' : 'Unggah Foto Baru'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Unggah Foto Baru */}
          {showAddForm && (
            <form
              onSubmit={handleSavePhoto}
              className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-4 animate-in fade-in"
            >
              <div className="font-bold text-xs text-purple-950 uppercase tracking-wider flex items-center gap-2 border-b border-purple-200 pb-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Unggah & Tautkan Foto Dokumentasi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Satuan Pendidikan */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-blue-600" />
                    <span>Satuan Pendidikan: *</span>
                  </label>
                  <select
                    value={formSchool}
                    onChange={(e) => setFormSchool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ALL">Umum (Tampil di Semua Sekolah)</option>
                    {SCHOOL_LIST_TELLU_LIMPOE.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Guru Dampingan Sasaran */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Guru Dampingan Sasaran: *</span>
                  </label>
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <select
                        value={formTeacherMode === 'custom' ? 'CUSTOM' : formTeacherMode === 'general' ? 'GENERAL' : formTeacher}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === 'CUSTOM') {
                            setFormTeacherMode('custom');
                          } else if (val === 'GENERAL') {
                            setFormTeacherMode('general');
                            setFormTeacher('ALL');
                          } else {
                            setFormTeacherMode('preset');
                            setFormTeacher(val);
                          }
                        }}
                        className="flex-1 p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="GENERAL">-- Umum (Seluruh Guru Sekolah Ini) --</option>
                        {formSchoolTeachers.map((t) => (
                          <option key={t} value={t}>
                            Guru: {t}
                          </option>
                        ))}
                        <option value="CUSTOM">+ Tulis Nama Guru Baru...</option>
                      </select>
                    </div>

                    {formTeacherMode === 'custom' && (
                      <input
                        type="text"
                        value={customTeacherInput}
                        onChange={(e) => setCustomTeacherInput(e.target.value)}
                        placeholder="Ketik Nama Lengkap Guru (mis: Fatmawati, S.Pd.)"
                        className="w-full p-2.5 rounded-xl border border-purple-300 bg-white focus:ring-2 focus:ring-purple-500 text-xs"
                      />
                    )}
                  </div>
                </div>

                {/* Jenis Aktivitas */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-600" />
                    <span>Fokus Aktivitas Pendampingan:</span>
                  </label>
                  <select
                    value={formActivityType}
                    onChange={(e) => setFormActivityType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Observasi Pembelajaran Kelas">Observasi Pembelajaran Kelas</option>
                    <option value="Refleksi Klinis GERAK">Refleksi Klinis GERAK (Pasca-Observasi)</option>
                    <option value="Pembedahan Teks & Soal Cerita">Pembedahan Teks & Soal Cerita</option>
                    <option value="Simulasi Media & Kartu Nalar">Simulasi Media & Kartu Nalar</option>
                    <option value="Diskusi Berpasangan (Detektif Nalar)">Diskusi Berpasangan (Detektif Nalar)</option>
                    <option value="Pemeriksaan Hasil Formatif">Pemeriksaan Hasil Formatif Siswa</option>
                    <option value="Evaluasi & Tindak Lanjut Kombel">Evaluasi & Tindak Lanjut Kombel</option>
                  </select>
                </div>

                {/* Tanggal / Waktu */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Waktu / Tanggal Kegiatan:</span>
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="Contoh: 18 Agustus 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Judul Foto */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Judul Foto Dokumentasi: *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Pendampingan Pembedahan Teks Soal Cerita di Kelas V-A"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Deskripsi Foto */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Keterangan Singkat / Aktivitas di Lapangan:
                  </label>
                  <textarea
                    value={formCaption}
                    onChange={(e) => setFormCaption(e.target.value)}
                    placeholder="Tuliskan peran guru dan pengawas dalam foto (misal: guru melatih siswa menandai kata kunci dan membedakan informasi fakta vs pertanyaan)..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Unggah Berkas Foto */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Pilih Berkas Foto (Kamera / Galeri): *
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 border-2 border-dashed border-purple-300 hover:border-purple-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer bg-white transition text-center">
                      <ImageIcon className="w-6 h-6 text-purple-600" />
                      <span className="text-xs font-bold text-slate-700">
                        {isProcessingImg
                          ? 'Mengoptimalkan foto...'
                          : formDataUrl
                          ? 'Ganti Berkas Foto'
                          : 'Pilih Berkas Gambar'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Mendukung format JPG, PNG, WebP (otomatis dioptimalkan untuk cetak laporan resmi)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>

                    {formDataUrl && (
                      <div className="w-24 h-24 rounded-2xl border border-purple-300 overflow-hidden shrink-0 bg-slate-100 shadow-sm relative">
                        <img
                          src={formDataUrl}
                          alt="Pratinjau"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessingImg || !formDataUrl}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-300 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan & Lampirkan Foto</span>
                </button>
              </div>
            </form>
          )}

          {/* List Foto Terlampir */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-bold border-b border-slate-200 pb-1.5 gap-2">
              <div className="flex items-center gap-2">
                <span>Koleksi Foto Terpasang ({filteredPhotos.length})</span>
                {selectedTeacherFilter !== 'ALL' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Filter: {selectedTeacherFilter === 'GENERAL_ONLY' ? 'Umum Sekolah' : selectedTeacherFilter}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                Foto guru dampingan dipisahkan agar lembar supervisi masing-masing guru tetap otentik
              </span>
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-slate-400" />
                <p className="font-semibold text-slate-700">
                  {selectedTeacherFilter !== 'ALL'
                    ? `Belum ada foto khusus untuk "${selectedTeacherFilter}".`
                    : 'Belum ada foto kegiatan untuk filter ini.'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  Foto yang Anda unggah untuk guru ini akan otomatis muncul pada lembar hasil supervisi saat guru tersebut dipilih.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Unggah Foto Khusus Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                  >
                    <div className="h-44 bg-slate-100 relative overflow-hidden">
                      <img
                        src={photo.dataUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {/* School Badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1 shadow-xs max-w-[70%] truncate">
                        <School className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{photo.schoolName === 'ALL' ? 'Semua Sekolah' : photo.schoolName}</span>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition shadow-sm cursor-pointer"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                      </button>

                      {/* Teacher Tag on Image */}
                      <div className="absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-between gap-1">
                        {photo.teacherName && photo.teacherName !== 'ALL' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-900/90 text-emerald-200 text-[10px] font-bold backdrop-blur-xs shadow-xs">
                            <User className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Khusus: {photo.teacherName}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-900/90 text-blue-200 text-[10px] font-bold backdrop-blur-xs shadow-xs">
                            <Users className="w-2.5 h-2.5 text-blue-400" />
                            <span>Dokumentasi Umum</span>
                          </span>
                        )}

                        {photo.activityType && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-purple-900/90 text-purple-200 text-[9px] font-medium backdrop-blur-xs truncate max-w-[130px]">
                            {photo.activityType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <strong className="block text-slate-900 font-bold leading-tight line-clamp-1">
                          {photo.title}
                        </strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mt-1">
                          {photo.caption}
                        </p>
                      </div>

                      {/* Quick Teacher Reassign or Edit */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-500">
                        {editingPhotoId === photo.id ? (
                          <div className="w-full flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-purple-200">
                            <input
                              type="text"
                              value={editTeacherValue}
                              onChange={(e) => setEditTeacherValue(e.target.value)}
                              placeholder="Nama guru atau 'ALL' untuk umum"
                              className="flex-1 p-1 bg-white border border-slate-300 rounded text-[11px] text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveEditTeacher(photo.id)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-0.5 text-[10px]"
                            >
                              <Check className="w-3 h-3" />
                              <span>Simpan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPhotoId(null)}
                              className="px-1.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{photo.date}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStartEditTeacher(photo)}
                                className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-0.5 hover:underline"
                                title="Ganti tautan guru dampingan"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                                <span>Ganti Guru</span>
                              </button>
                            </div>
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[9.5px]">
                              Tampil di Dokumen
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Foto yang ditautkan ke nama guru akan otomatis dicetak pada lembar lampiran resmi guru bersangkutan.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
