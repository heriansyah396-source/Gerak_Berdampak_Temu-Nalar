import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  X,
  School,
  FileSpreadsheet,
  Camera,
  Info,
  RotateCw,
  Smartphone,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  exportAllDataJson,
  importAllDataJson,
  resetAllData,
  getSchoolProgress,
  getActionPlans,
  getDocPhotos,
  getMicroCommitments,
} from '../utils/storage';
import { useAuth } from '../context/AuthContext';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'backup' | 'restore' | 'reset'>('cloud');
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<{
    valid: boolean;
    schoolCount: number;
    planCount: number;
    photoCount: number;
    commitmentCount: number;
    exportedAt?: string;
    supervisor?: string;
    error?: string;
    rawJson?: string;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    user,
    isSyncing,
    lastSyncTime,
    syncStatusMessage,
    login,
    logout,
    syncNow,
    pullNow,
  } = useAuth();

  // Live counts
  const schoolsCount = getSchoolProgress().length;
  const plansCount = getActionPlans().length;
  const photosCount = getDocPhotos().length;
  const commitmentsCount = getMicroCommitments().length;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    try {
      const jsonStr = exportAllDataJson();
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `Cadangan_GERAK_BERDAMPAK_Tellu_Limpoe_${dateStr}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: 'Berkas cadangan data (.json) berhasil diunduh ke perangkat Anda.',
      });
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: 'Gagal membuat berkas cadangan data.',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setImportedFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        const data = parsed.data || parsed;
        const schools = Array.isArray(data.schools) ? data.schools : [];
        const plans = Array.isArray(data.actionPlans) ? data.actionPlans : [];
        const photos = Array.isArray(data.docPhotos) ? data.docPhotos : [];
        const commitments = Array.isArray(data.microCommitments) ? data.microCommitments : [];

        if (schools.length === 0 && plans.length === 0 && commitments.length === 0) {
          setImportPreview({
            valid: false,
            schoolCount: 0,
            planCount: 0,
            photoCount: 0,
            commitmentCount: 0,
            error: 'Berkas tidak memuat data sekolah atau rencana aksi GERAK BERDAMPAK.',
          });
        } else {
          setImportPreview({
            valid: true,
            schoolCount: schools.length,
            planCount: plans.length,
            photoCount: photos.length,
            commitmentCount: commitments.length,
            exportedAt: parsed.exportedAt || 'Tidak tercatat',
            supervisor: parsed.supervisorName || 'Pengawas Pembina',
            rawJson: text,
          });
        }
      } catch (err) {
        setImportPreview({
          valid: false,
          schoolCount: 0,
          planCount: 0,
          photoCount: 0,
          commitmentCount: 0,
          error: 'Format berkas tidak sesuai. Pastikan memilih berkas .json yang valid.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!importPreview?.rawJson) return;
    const res = importAllDataJson(importPreview.rawJson);
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message,
      });
      onDataChanged();
      setImportPreview(null);
      setImportedFile(null);
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        'PERINGATAN: Tindakan ini akan mengembalikan semua data sekolah, RTL, dan refleksi ke data standar bawaan 25 sekolah Tellu Limpoe. Lanjutkan?'
      )
    ) {
      resetAllData();
      setStatusMessage({
        type: 'success',
        text: 'Data telah berhasil diatur ulang ke data standar resmi 25 sekolah Tellu Limpoe.',
      });
      onDataChanged();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] cursor-default my-auto"
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Pencadangan & Pemulihan Data Supervisi
              </h3>
              <p className="text-xs text-slate-400">
                Amankan data 25 sekolah binaan Kecamatan Tellu Limpoe
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

        {/* Panduan Pindah Browser / Perangkat */}
        <div className="bg-amber-50/90 border-b border-amber-200 px-5 py-3 text-xs text-amber-900 flex items-start gap-2.5">
          <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-950">
              Cara Menampilkan Data di Browser / Perangkat Lain (Chrome, Edge, atau HP Android):
            </span>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Browser menyimpan data di penyimpanan lokal masing-masing (*local storage*). Jika Anda menginput data di Chrome dan ingin membukanya di browser lain: 
              <strong> 1)</strong> Di Chrome, klik <strong>Unduh Berkas Cadangan (.json)</strong>. 
              <strong> 2)</strong> Buka aplikasi di browser lain/HP, lalu pilih tab <strong>Pulihkan Data (Restore)</strong> dan unggah berkas tersebut.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('cloud');
              setStatusMessage(null);
            }}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cloud'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>☁️ Sinkron Cloud (Firebase)</span>
            {user && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
          </button>
          <button
            onClick={() => {
              setActiveTab('backup');
              setStatusMessage(null);
            }}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>1. Unduh Berkas (.json)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('restore');
              setStatusMessage(null);
            }}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'restore'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>2. Pulihkan (.json)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('reset');
              setStatusMessage(null);
            }}
            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ml-auto ${
              activeTab === 'reset'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-rose-700 hover:bg-rose-50'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atur Ulang</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-3 mx-6 mt-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {activeTab === 'cloud' && (
            <div className="space-y-5">
              {!user ? (
                /* Card Belum Login */
                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Cloud className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-lg mx-auto">
                    <h4 className="text-base font-extrabold text-slate-900">
                      Aktifkan Sinkronisasi Otomatis Cloud Firebase (Gratis)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Dengan masuk menggunakan akun Google Anda (contoh:{' '}
                      <strong className="text-slate-800">heriansyah396@gmail.com</strong>), seluruh data 25
                      sekolah binaan, RTL, dan mikro-komitmen akan tersimpan aman di Cloud Firestore.
                      Data akan langsung otomatis muncul saat Anda membuka aplikasi di browser lain atau di HP Android!
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => login()}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-600/25 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogIn className="w-4 h-4" />
                      )}
                      <span>Masuk dengan Akun Google (Sinkron Cloud)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 text-left max-w-xl mx-auto">
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                        <span>Buka di Perangkat Apa Pun</span>
                      </div>
                      <p className="text-slate-500 text-[10px]">
                        Akses lewat laptop, Chrome, Edge, Safari, ataupun HP Android.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>100% Gratis & Resmi</span>
                      </div>
                      <p className="text-slate-500 text-[10px]">
                        Menggunakan paket resmi Google Cloud Firebase Spark Free Tier.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-[11px] space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CloudCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Simpan Otomatis</span>
                      </div>
                      <p className="text-slate-500 text-[10px]">
                        Setiap perubahan form atau centang harian tersimpan otomatis ke cloud.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Sudah Login & Terhubung */
                <div className="space-y-4">
                  <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Avatar"
                          className="w-12 h-12 rounded-2xl border-2 border-emerald-300 object-cover shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-base flex items-center justify-center shadow-2xs">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">
                            {user.displayName || 'Pengawas Pembina'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Cloud Aktif
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">{user.email}</p>
                        {lastSyncTime && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Sinkronisasi terakhir: {lastSyncTime}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => logout()}
                      className="self-start sm:self-center px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>

                  {syncStatusMessage && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-blue-600 shrink-0 ${
                          isSyncing ? 'animate-spin' : ''
                        }`}
                      />
                      <span>{syncStatusMessage}</span>
                    </div>
                  )}

                  {/* Tombol Aksi Sinkronisasi Manual */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => syncNow()}
                      disabled={isSyncing}
                      className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>Kirim / Cadangkan Data Lokal ke Cloud</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => pullNow()}
                      disabled={isSyncing}
                      className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>Tarik / Segarkan Data dari Cloud</span>
                    </button>
                  </div>

                  {/* Petunjuk Penggunaan di Browser Lain */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-700" />
                      <span>Cara Membuka Data Ini di Browser Lain (Edge, Firefox, atau HP Android):</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-900 leading-relaxed">
                      <li>Buka tautan aplikasi ini di browser lain atau di HP Anda.</li>
                      <li>
                        Klik tombol <strong>"Sinkron Cloud"</strong> di bagian atas layar.
                      </li>
                      <li>
                        Masuk dengan akun Google yang sama: <strong>{user.email}</strong>.
                      </li>
                      <li>
                        Selesai! Seluruh 25 sekolah binaan, rencana aksi, dan mikro-komitmen yang sudah Anda isi
                        akan langsung terbaca dan tersinkronisasi otomatis.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Status Ringkasan Data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <School className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{schoolsCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Sekolah Binaan</div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <FileSpreadsheet className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{plansCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Rencana RTL</div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <RotateCw className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{commitmentsCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Mikro-Komitmen</div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <Camera className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{photosCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Foto Kegiatan</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Tentang Pencadangan Data Mandiri:</span>
                </div>
                <p className="leading-relaxed">
                  Semua data observasi, rubrik evaluasi N-Gain per sekolah, komitmen RTL guru,
                  dan foto dokumentasi pendampingan akan dikemas menjadi satu berkas{' '}
                  <strong>.json</strong>. Anda dapat menyimpannya di Google Drive, flashdisk,
                  atau laptop lain.
                </p>
              </div>

              {/* Status Ringkasan Data Saat Ini */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <School className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{schoolsCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Sekolah Binaan</div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <FileSpreadsheet className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{plansCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Rencana RTL</div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <RotateCw className="w-5 h-5 mx-auto text-amber-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{commitmentsCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Mikro-Komitmen</div>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <Camera className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                  <div className="text-xl font-extrabold text-slate-900">{photosCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Foto Kegiatan</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Berkas Cadangan (.json) Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'restore' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Perhatian Pemulihan Data:</span>
                </div>
                <p className="leading-relaxed">
                  Memulihkan data dari berkas cadangan akan memperbarui catatan sekolah, RTL, dan
                  dokumentasi yang tersimpan di browser ini sesuai dengan isi berkas yang diunggah.
                </p>
              </div>

              {/* Upload Drop Area */}
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition text-center">
                <FileJson className="w-10 h-10 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">
                  {importedFile ? importedFile.name : 'Pilih Berkas Cadangan (.json)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Klik di sini untuk mencari berkas cadangan di komputer/ponsel Anda
                </span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Import Preview */}
              {importPreview && (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1">
                    Pratinjau Isi Berkas Cadangan:
                  </div>
                  {importPreview.valid ? (
                    <div className="space-y-2 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal Ekspor:</span>
                        <strong className="text-slate-900">{importPreview.exportedAt}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah Sekolah Ditemukan:</span>
                        <strong className="text-blue-700 font-bold">
                          {importPreview.schoolCount} Satuan Pendidikan
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah Rencana RTL:</span>
                        <strong className="text-emerald-700 font-bold">
                          {importPreview.planCount} RTL
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah Mikro-Komitmen:</span>
                        <strong className="text-amber-700 font-bold">
                          {importPreview.commitmentCount} Komitmen 14 Hari
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Jumlah Foto Dokumentasi:</span>
                        <strong className="text-purple-700 font-bold">
                          {importPreview.photoCount} Foto
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyRestore}
                        className="w-full mt-3 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Terapkan Pemulihan Data ke Aplikasi</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-700 font-semibold">
                      {importPreview.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Atur Ulang ke Data Standar Bawaan:</span>
                </div>
                <p className="leading-relaxed">
                  Jika Anda ingin membersihkan semua perubahan dan kembali ke kondisi data resmi
                  bawaan (21 SD dan 4 SMP Kecamatan Tellu Limpoe lengkap dengan data simulasi awal),
                  Anda dapat menggunakan tombol di bawah ini.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Kembalikan Semua Data ke Kondisi Awal</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
