import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { DocPhoto } from '../types';
import { getDocPhotos, saveDocPhoto, deleteDocPhoto } from '../utils/storage';
import { SCHOOL_LIST_TELLU_LIMPOE } from '../data/appData';

interface PhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSchoolName?: string;
  onPhotosUpdated?: () => void;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  isOpen,
  onClose,
  defaultSchoolName,
  onPhotosUpdated,
}) => {
  const [photos, setPhotos] = useState<DocPhoto[]>(getDocPhotos());
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>(
    defaultSchoolName || 'ALL'
  );

  // Form State for new photo
  const [showAddForm, setShowAddForm] = useState(false);
  const [formSchool, setFormSchool] = useState<string>(defaultSchoolName || 'ALL');
  const [formTitle, setFormTitle] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formDate, setFormDate] = useState('Agustus 2026');
  const [formDataUrl, setFormDataUrl] = useState<string>('');
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSchoolName) {
      setSelectedSchoolFilter(defaultSchoolName);
      setFormSchool(defaultSchoolName);
    }
  }, [defaultSchoolName]);

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

  if (!isOpen) return null;

  // Compress image before saving to stay lightweight in localStorage
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
      setErrorMsg('Silakan unggah atau pilih foto terlebih dahulu.');
      return;
    }
    if (!formTitle.trim()) {
      setErrorMsg('Judul foto wajib diisi.');
      return;
    }

    const newPhoto: DocPhoto = {
      id: `photo-${Date.now()}`,
      schoolName: formSchool,
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

  const filteredPhotos = photos.filter((p) => {
    if (selectedSchoolFilter === 'ALL') return true;
    return p.schoolName === 'ALL' || p.schoolName === selectedSchoolFilter;
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] cursor-default my-auto"
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
                Lampiran bukti visual supervisi akademik di sekolah binaan
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
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <span className="font-bold text-slate-600 shrink-0">Filter Sekolah:</span>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="flex-1 p-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Foto (Umum & Seluruh Sekolah)</option>
              {SCHOOL_LIST_TELLU_LIMPOE.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setErrorMsg(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
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
              className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4 animate-in fade-in"
            >
              <div className="font-bold text-xs text-purple-950 uppercase tracking-wider flex items-center gap-2 border-b border-purple-200 pb-2">
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Unggah Foto Dokumentasi Baru</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Kaitan Sekolah:
                  </label>
                  <select
                    value={formSchool}
                    onChange={(e) => setFormSchool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="ALL">Umum (Bisa Tampil di Semua Laporan)</option>
                    {SCHOOL_LIST_TELLU_LIMPOE.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Waktu / Tanggal Kegiatan:
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="Contoh: 20 Agustus 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Judul Foto Dokumentasi: *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Pendampingan Diskusi Nalar Siswa di SDN 1 Arateng"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Keterangan Singkat / Deskripsi Foto:
                  </label>
                  <textarea
                    value={formCaption}
                    onChange={(e) => setFormCaption(e.target.value)}
                    placeholder="Tuliskan aktivitas yang dilakukan guru dan pengawas dalam foto tersebut..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

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
                        Mendukung format JPG, PNG, WebP (otomatis dioptimalkan untuk cetak)
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
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold border-b border-slate-200 pb-1">
              <span>Koleksi Foto Terpasang ({filteredPhotos.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">
                Foto ini otomatis tampil di lampiran dokumen cetak
              </span>
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-slate-400" />
                <p>Belum ada foto kegiatan untuk filter ini.</p>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Unggah Foto Sekarang</span>
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
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                        <School className="w-3 h-3 text-blue-400" />
                        <span>{photo.schoolName === 'ALL' ? 'Semua Sekolah' : photo.schoolName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition shadow-sm cursor-pointer"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                      </button>
                    </div>

                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <strong className="block text-slate-900 font-bold leading-tight line-clamp-1">
                          {photo.title}
                        </strong>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mt-1">
                          {photo.caption}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{photo.date}</span>
                        </span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Tampil di Laporan
                        </span>
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
            Foto yang terpasang akan otomatis dicetak pada lembar lampiran resmi.
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
