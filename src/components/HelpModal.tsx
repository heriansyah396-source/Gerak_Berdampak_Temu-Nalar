import React from 'react';
import { X, HelpCircle, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs cursor-pointer"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto cursor-default"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900">
              Panduan Penggunaan Aplikasi GERAK BERDAMPAK
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
            title="Tutup Panduan (Esc)"
          >
            <X className="w-4 h-4 pointer-events-none" />
            <span>Tutup</span>
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Aplikasi ini dirancang khusus untuk memfasilitasi supervisi akademik reflektif bagi
            pengawas sekolah, kepala sekolah, dan guru SD serta SMP di Kecamatan Tellu Limpoe,
            Kabupaten Sidenreng Rappang.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
              <strong className="text-blue-950 font-bold block mb-1">
                1. Navigasi Terstruktur
              </strong>
              <span>
                Gunakan menu di sidebar kiri atau tombol navigasi di bagian bawah setiap halaman
                untuk menjelajahi 9 modul utama dari Beranda hingga Dashboard Dampak.
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <strong className="text-emerald-950 font-bold block mb-1">
                2. Laboratorium Soal Interaktif
              </strong>
              <span>
                Uji nalar soal cerita dengan menekan 5 tombol pembuka nalar bertahap: "Apa yang
                diketahui", "Apa yang ditanyakan", "Informasi penting", "Operasi hitung", dan
                "Periksa jawaban". Beralihlah ke Mode Guru untuk melihat analisis diagnostik
                pilihan jawaban salah.
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
              <strong className="text-purple-950 font-bold block mb-1">
                3. Refleksi & RTL Tanpa Menghakimi
              </strong>
              <span>
                Isi 7 butir instrumen refleksi untuk mendapatkan profil kekuatan dan rekomendasi
                pengembangan diri. Simpan rencana ke dalam Rencana Tindak Lanjut (RTL).
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <strong className="text-amber-950 font-bold block mb-1">
                4. Cetak Dokumen Supervisi Resmi
              </strong>
              <span>
                Klik tombol "Cetak Hasil Pendampingan" kapan saja untuk mempratinjau atau mencetak
                laporan resmi bertanda tangan pengawas, kepala sekolah, dan guru.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-center justify-between">
            <span>
              Pengembang: <strong>Heriansyah., S.Si., S.Pd., M.Pd</strong>
            </span>
            <span>Versi 1.0 (Offline-First)</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
          >
            Mengerti & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
