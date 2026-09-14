import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Printer,
  X,
  School,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Building2,
  Layers,
  ExternalLink,
  Download,
  Info,
  AlertCircle,
  Camera,
} from 'lucide-react';
import {
  getActionPlans,
  getReflections,
  getGerakRecords,
  getSchoolProgress,
  calculateNGain,
  getDocPhotos,
} from '../utils/storage';
import {
  OFFICIAL_SCHOOLS_TELLU_LIMPOE,
} from '../data/appData';
import {
  SchoolProgressItem,
  OfficialSchoolItem,
  DocPhoto,
} from '../types';
import { PhotoManagerModal } from './PhotoManagerModal';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSchool?: string;
  defaultTeacher?: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  defaultSchool,
  defaultTeacher,
}) => {
  // Storage Data
  const plans = getActionPlans();
  const reflections = getReflections();
  const gerakRecords = getGerakRecords();
  const schoolProgressList = getSchoolProgress();

  // Print Mode: 'single' (Per Sekolah & Guru) or 'all' (Semua Sekolah Terpisah)
  const [printMode, setPrintMode] = useState<'single' | 'all'>('single');

  // Selected School (Defaults to defaultSchool if passed, or first school with data, or first official school)
  const initialSchoolName = useMemo(() => {
    if (defaultSchool && OFFICIAL_SCHOOLS_TELLU_LIMPOE.some((s) => s.name === defaultSchool)) {
      return defaultSchool;
    }
    if (schoolProgressList.length > 0) {
      return schoolProgressList[0].schoolName;
    }
    return OFFICIAL_SCHOOLS_TELLU_LIMPOE[0].name;
  }, [defaultSchool, schoolProgressList]);

  const [selectedSchoolName, setSelectedSchoolName] = useState<string>(initialSchoolName);
  const [printFeedback, setPrintFeedback] = useState<string | null>(null);
  const [showPhotoManager, setShowPhotoManager] = useState(false);
  const [docPhotos, setDocPhotos] = useState<DocPhoto[]>(() => getDocPhotos());

  // Sync if defaultSchool changes when modal reopens
  useEffect(() => {
    if (defaultSchool && OFFICIAL_SCHOOLS_TELLU_LIMPOE.some((s) => s.name === defaultSchool)) {
      setSelectedSchoolName(defaultSchool);
    }
  }, [defaultSchool, isOpen]);

  const handleCloseModal = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) {
      e.preventDefault();
      e.stopPropagation();
    }
    document.body.classList.remove('has-print-modal');
    document.body.style.overflow = '';
    onClose();
  };

  // Handle ESC key to close modal & lock background scroll
  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('has-print-modal');
      document.body.style.overflow = '';
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('has-print-modal');
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('has-print-modal');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Current selected official school metadata
  const currentOfficialSchool = useMemo(() => {
    return (
      OFFICIAL_SCHOOLS_TELLU_LIMPOE.find((s) => s.name === selectedSchoolName) ||
      OFFICIAL_SCHOOLS_TELLU_LIMPOE[0]
    );
  }, [selectedSchoolName]);

  // Find all records related to the selected school
  const matchedProgressList = useMemo(() => {
    return schoolProgressList.filter((s) => s.schoolName === selectedSchoolName);
  }, [schoolProgressList, selectedSchoolName]);

  const matchedPlans = useMemo(() => {
    return plans.filter((p) => p.schoolName === selectedSchoolName);
  }, [plans, selectedSchoolName]);

  const matchedReflections = useMemo(() => {
    return reflections.filter((r) => r.schoolName === selectedSchoolName);
  }, [reflections, selectedSchoolName]);

  const matchedGerakRecords = useMemo(() => {
    return gerakRecords.filter((g) => g.schoolName === selectedSchoolName);
  }, [gerakRecords, selectedSchoolName]);

  // Extract all teacher names for this school
  const detectedTeachers = useMemo(() => {
    const set = new Set<string>();
    matchedProgressList.forEach((p) => p.teacherName && set.add(p.teacherName));
    matchedPlans.forEach((p) => p.teacherName && set.add(p.teacherName));
    matchedReflections.forEach((r) => r.teacherName && set.add(r.teacherName));
    matchedGerakRecords.forEach((g) => g.teacherName && set.add(g.teacherName));
    return Array.from(set);
  }, [matchedProgressList, matchedPlans, matchedReflections, matchedGerakRecords]);

  // Active teacher selection
  const [selectedTeacherName, setSelectedTeacherName] = useState<string>('');

  useEffect(() => {
    if (defaultTeacher && detectedTeachers.includes(defaultTeacher)) {
      setSelectedTeacherName(defaultTeacher);
    } else if (detectedTeachers.length > 0) {
      setSelectedTeacherName(detectedTeachers[0]);
    } else {
      setSelectedTeacherName('');
    }
  }, [selectedSchoolName, defaultTeacher, detectedTeachers]);

  // Editable fields for custom print adjustments
  const primaryProgress = useMemo(() => {
    if (selectedTeacherName) {
      const match = matchedProgressList.find((p) => p.teacherName === selectedTeacherName);
      if (match) return match;
    }
    return matchedProgressList[0] || null;
  }, [matchedProgressList, selectedTeacherName]);

  const [customTeacher, setCustomTeacher] = useState<string>('');
  const [customClass, setCustomClass] = useState<string>('');
  const [customPrincipal, setCustomPrincipal] = useState<string>('');
  const [customPrincipalNip, setCustomPrincipalNip] = useState<string>('');
  const [customTeacherNip, setCustomTeacherNip] = useState<string>('');

  // Update defaults when school or primaryProgress changes
  useEffect(() => {
    if (primaryProgress) {
      setCustomTeacher(primaryProgress.teacherName);
      setCustomClass(primaryProgress.targetClass);
    } else if (detectedTeachers.length > 0) {
      setCustomTeacher(detectedTeachers[0]);
      setCustomClass(
        currentOfficialSchool.level === 'SD'
          ? 'Kelas V (Fase C)'
          : 'Kelas VII (Fase D)'
      );
    } else {
      setCustomTeacher(
        currentOfficialSchool.level === 'SD'
          ? 'Guru Kelas Dampingan'
          : 'Guru Mata Pelajaran Matematika'
      );
      setCustomClass(
        currentOfficialSchool.level === 'SD'
          ? 'Kelas V (Fase C)'
          : 'Kelas VII (Fase D)'
      );
    }
  }, [selectedSchoolName, primaryProgress, currentOfficialSchool, detectedTeachers]);

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Safe window print execution
  const handlePrint = () => {
    setPrintFeedback(null);
    try {
      window.print();
    } catch (err) {
      console.warn('Direct window.print() failed:', err);
      setPrintFeedback(
        'Dialog cetak terhambat oleh kebijakan iframe browser. Silakan klik "Buka di Tab Baru" atau "Unduh Dokumen" di bawah.'
      );
    }
  };

  // Quick navigation between the 25 official schools
  const currentIndex = OFFICIAL_SCHOOLS_TELLU_LIMPOE.findIndex(
    (s) => s.name === selectedSchoolName
  );

  const handlePrevSchool = () => {
    const nextIdx =
      currentIndex > 0 ? currentIndex - 1 : OFFICIAL_SCHOOLS_TELLU_LIMPOE.length - 1;
    setSelectedSchoolName(OFFICIAL_SCHOOLS_TELLU_LIMPOE[nextIdx].name);
  };

  const handleNextSchool = () => {
    const nextIdx =
      currentIndex < OFFICIAL_SCHOOLS_TELLU_LIMPOE.length - 1 ? currentIndex + 1 : 0;
    setSelectedSchoolName(OFFICIAL_SCHOOLS_TELLU_LIMPOE[nextIdx].name);
  };

  // Helper to check if a school has saved evaluation or RTL data
  const hasDataMap = useMemo(() => {
    const map = new Map<string, boolean>();
    OFFICIAL_SCHOOLS_TELLU_LIMPOE.forEach((s) => {
      const hasProg = schoolProgressList.some((p) => p.schoolName === s.name);
      const hasRtl = plans.some((p) => p.schoolName === s.name);
      const hasRef = reflections.some((r) => r.schoolName === s.name);
      const hasGerak = gerakRecords.some((g) => g.schoolName === s.name);
      map.set(s.name, hasProg || hasRtl || hasRef || hasGerak);
    });
    return map;
  }, [schoolProgressList, plans, reflections, gerakRecords]);

  // Generate Standalone HTML Document for Direct Tab Print or File Download
  const generateStandaloneHtml = (mode: 'single' | 'all') => {
    const schoolsToRender =
      mode === 'single'
        ? [currentOfficialSchool]
        : OFFICIAL_SCHOOLS_TELLU_LIMPOE;

    const sheetsHtml = schoolsToRender
      .map((sch) => {
        const pItem =
          mode === 'single'
            ? primaryProgress
            : schoolProgressList.find((p) => p.schoolName === sch.name) || null;

        const sPlans = plans.filter((p) => p.schoolName === sch.name);
        const sReflections = reflections.filter((r) => r.schoolName === sch.name);
        const sGerak = gerakRecords.filter((g) => g.schoolName === sch.name);

        const activeTeacher =
          mode === 'single' && customTeacher
            ? customTeacher
            : pItem?.teacherName ||
              sPlans[0]?.teacherName ||
              sReflections[0]?.teacherName ||
              (sch.level === 'SD' ? 'Guru Kelas Dampingan' : 'Guru Mapel Matematika');

        const activeClass =
          mode === 'single' && customClass
            ? customClass
            : pItem?.targetClass ||
              (sch.level === 'SD' ? 'Kelas V (Fase C)' : 'Kelas VII (Fase D)');

        const indicators = pItem?.indicators || {
          understandingText: { beforePct: 35, afterPct: 80 },
          informationFiltering: { beforePct: 30, afterPct: 75 },
          operationModeling: { beforePct: 40, afterPct: 85 },
          reasoningCommunication: { beforePct: 20, afterPct: 70 },
        };

        const avgPre = Math.round(
          (indicators.understandingText.beforePct +
            indicators.informationFiltering.beforePct +
            indicators.operationModeling.beforePct +
            indicators.reasoningCommunication.beforePct) /
            4
        );

        const avgPost = Math.round(
          (indicators.understandingText.afterPct +
            indicators.informationFiltering.afterPct +
            indicators.operationModeling.afterPct +
            indicators.reasoningCommunication.afterPct) /
            4
        );

        const delta = avgPost - avgPre;
        const nGain = calculateNGain(avgPre, avgPost);

        const teacherShift = pItem?.teacherShift || {
          beforePractice:
            'Guru terbiasa langsung menulis rumus dan meminta siswa berhitung tanpa membedah alur cerita kontekstual.',
          afterPractice:
            'Guru memfasilitasi visualisasi cerita, memilah kalimat fakta vs kalimat tanya, dan melatih siswa menjelaskan alasan langkahnya.',
          keyStrategyUsed:
            sch.level === 'SD'
              ? 'Strategi 1 — Baca, Visualisasikan, dan Tandai Kata Kunci'
              : 'Strategi 4 — Temukan Kesalahan (Detektif Nalar)',
        };

        const notes =
          pItem?.notes ||
          'Pendampingan berfokus pada penguatan penalaran numerasi bermakna melalui pendekatan GERAK BERDAMPAK di sekolah binaan.';

        return `
        <div class="page-container">
          <!-- KOP RESMI -->
          <div class="kop-header">
            <div class="kop-line-1">PEMERINTAH KABUPATEN SIDENRENG RAPPANG</div>
            <div class="kop-line-2">DINAS PENDIDIKAN DAN KEBUDAYAAN • WILAYAH KECAMATAN TELLU LIMPOE</div>
            <h1 class="kop-title">LEMBAR HASIL PENDAMPINGAN SUPERVISI AKADEMIK</h1>
            <div class="kop-program">PROGRAM: GERAK BERDAMPAK (TEMU NALAR LITERASI-NUMERASI)</div>
            <div class="kop-focus">Fokus: Penguatan Berpikir Kritis & Kemampuan Bernalar Siswa Berbasis Data Kelas</div>
          </div>

          <!-- IDENTITAS -->
          <div class="id-card">
            <div class="id-card-header">
              <span>IDENTITAS SATUAN PENDIDIKAN & GURU BINAAN</span>
              <span class="badge">Sekolah No. ${sch.no} • Jenjang ${sch.level}</span>
            </div>
            <div class="id-grid">
              <div>
                <span class="label">Satuan Pendidikan:</span>
                <strong>${sch.name}</strong>
                <span class="sub">Status: ${sch.type}</span>
              </div>
              <div>
                <span class="label">Guru Dampingan:</span>
                <strong>${activeTeacher}</strong>
                <span class="sub">Sasaran: ${activeClass}</span>
              </div>
              <div>
                <span class="label">Pengawas Pembina:</span>
                <strong>Heriansyah., S.Si., S.Pd., M.Pd</strong>
                <span class="sub">NIP. 197805122005021004</span>
                <span class="sub">Tanggal: ${currentDate}</span>
              </div>
            </div>
          </div>

          <!-- I. EVALUASI NALAR SISWA -->
          <div class="section-box">
            <div class="section-title">
              <span>I. Evaluasi Kemampuan Nalar Siswa: Sebelum vs Sesudah Pendampingan</span>
              <span class="gain-pill">Efektivitas: N-Gain = ${nGain.score} (${nGain.category})</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 32px; text-align: center;">No</th>
                  <th>Indikator Dimensi Temu Nalar</th>
                  <th style="width: 80px; text-align: center;">Skor Awal (Pre)</th>
                  <th style="width: 80px; text-align: center;">Skor Akhir (Post)</th>
                  <th style="width: 70px; text-align: center;">Kenaikan</th>
                  <th style="width: 90px; text-align: center;">N-Gain (g)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="text-align: center; font-weight: bold;">1</td>
                  <td>
                    <strong>Memahami Cerita & Situasi Masalah</strong>
                    <div class="sub-text">Siswa mampu menceritakan kembali alur soal tanpa langsung menghafal angka</div>
                  </td>
                  <td style="text-align: center; color: #b91c1c; font-weight: bold;">${indicators.understandingText.beforePct}%</td>
                  <td style="text-align: center; color: #15803d; font-weight: bold;">${indicators.understandingText.afterPct}%</td>
                  <td style="text-align: center; color: #047857; font-weight: bold;">+${indicators.understandingText.afterPct - indicators.understandingText.beforePct}%</td>
                  <td style="text-align: center; font-size: 10px;">g = ${calculateNGain(indicators.understandingText.beforePct, indicators.understandingText.afterPct).score}</td>
                </tr>
                <tr>
                  <td style="text-align: center; font-weight: bold;">2</td>
                  <td>
                    <strong>Memilah Informasi Pokok & Abaikan Pengalih</strong>
                    <div class="sub-text">Membedakan data besaran kuantitatif utama dengan informasi pendukung konteks</div>
                  </td>
                  <td style="text-align: center; color: #b91c1c; font-weight: bold;">${indicators.informationFiltering.beforePct}%</td>
                  <td style="text-align: center; color: #15803d; font-weight: bold;">${indicators.informationFiltering.afterPct}%</td>
                  <td style="text-align: center; color: #047857; font-weight: bold;">+${indicators.informationFiltering.afterPct - indicators.informationFiltering.beforePct}%</td>
                  <td style="text-align: center; font-size: 10px;">g = ${calculateNGain(indicators.informationFiltering.beforePct, indicators.informationFiltering.afterPct).score}</td>
                </tr>
                <tr>
                  <td style="text-align: center; font-weight: bold;">3</td>
                  <td>
                    <strong>Pemodelan Rumus & Pemilihan Operasi Hitung</strong>
                    <div class="sub-text">Menyusun kalimat matematika secara terstruktur dengan alasan logis</div>
                  </td>
                  <td style="text-align: center; color: #b91c1c; font-weight: bold;">${indicators.operationModeling.beforePct}%</td>
                  <td style="text-align: center; color: #15803d; font-weight: bold;">${indicators.operationModeling.afterPct}%</td>
                  <td style="text-align: center; color: #047857; font-weight: bold;">+${indicators.operationModeling.afterPct - indicators.operationModeling.beforePct}%</td>
                  <td style="text-align: center; font-size: 10px;">g = ${calculateNGain(indicators.operationModeling.beforePct, indicators.operationModeling.afterPct).score}</td>
                </tr>
                <tr>
                  <td style="text-align: center; font-weight: bold;">4</td>
                  <td>
                    <strong>Menalar & Mengomunikasikan Alasan Solusi</strong>
                    <div class="sub-text">Kemampuan menjelaskan "mengapa cara ini benar" dan menulis satuan tepat</div>
                  </td>
                  <td style="text-align: center; color: #b91c1c; font-weight: bold;">${indicators.reasoningCommunication.beforePct}%</td>
                  <td style="text-align: center; color: #15803d; font-weight: bold;">${indicators.reasoningCommunication.afterPct}%</td>
                  <td style="text-align: center; color: #047857; font-weight: bold;">+${indicators.reasoningCommunication.afterPct - indicators.reasoningCommunication.beforePct}%</td>
                  <td style="text-align: center; font-size: 10px;">g = ${calculateNGain(indicators.reasoningCommunication.beforePct, indicators.reasoningCommunication.afterPct).score}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="text-align: right; text-transform: uppercase; font-size: 10px;">Rata-Rata Capaian Kelas Dampingan:</td>
                  <td style="text-align: center; color: #b91c1c; font-weight: 800;">${avgPre}%</td>
                  <td style="text-align: center; color: #15803d; font-weight: 800;">${avgPost}%</td>
                  <td style="text-align: center; color: #047857; font-weight: 800;">+${delta}%</td>
                  <td style="text-align: center; font-weight: 800; color: #1e3a8a;">g = ${nGain.score} (${nGain.category})</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- II. PERUBAHAN PRAKTIK GURU -->
          <div class="section-box">
            <div class="section-title">II. Perubahan Praktik Guru: Sebelum vs Sesudah Pendampingan</div>
            <div class="shift-grid">
              <div class="shift-card before">
                <span class="shift-tag">Praktik Sebelum Supervisi:</span>
                <p>${teacherShift.beforePractice}</p>
              </div>
              <div class="shift-card after">
                <span class="shift-tag">Praktik Sesudah GERAK:</span>
                <p>${teacherShift.afterPractice}</p>
              </div>
            </div>
            <div class="shift-note">
              <strong>Strategi Terpilih: </strong> ${teacherShift.keyStrategyUsed} • <em>${notes}</em>
            </div>
          </div>

          <!-- III. CATATAN REFLEKSI & OBSERVASI -->
          <div class="section-box">
            <div class="section-title">III. Catatan Observasi Lapangan & Refleksi Diri Guru</div>
            ${
              sReflections.length > 0 || sGerak.length > 0
                ? sReflections
                    .map(
                      (r) => `
                  <div class="item-card">
                    <div style="font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 4px;">
                      Refleksi Mandiri: ${r.teacherName} (${r.subject}) • Kategori: ${r.category} (${r.totalScore}/${r.maxScore})
                    </div>
                    <div><strong>Kekuatan:</strong> ${r.strengths.join(' • ')}</div>
                    <div><strong>Fokus Penguatan:</strong> ${r.areasToImprove.join(' • ')}</div>
                  </div>`
                    )
                    .join('') +
                  sGerak
                    .map(
                      (g) => `
                  <div class="item-card">
                    <div style="font-weight: bold; color: #1e293b;">Alur GERAK: ${g.teacherName} (${g.timestamp})</div>
                    <div><strong>Masalah:</strong> ${g.learningProblem}</div>
                    <div><strong>Bukti:</strong> ${g.evidenceFound}</div>
                    <div><strong>Tindakan:</strong> ${g.actionPlan}</div>
                  </div>`
                    )
                    .join('')
                : `<div class="empty-notice">Instrumen pendampingan ini difungsikan sebagai supervisi awal berkelanjutan bagi sekolah binaan.</div>`
            }
          </div>

          <!-- IV. RTL -->
          <div class="section-box">
            <div class="section-title">IV. Rencana Tindak Lanjut (RTL) Pendampingan Sekolah Ini</div>
            ${
              sPlans.length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Masalah Pembelajaran</th>
                    <th>Sasaran Peningkatan</th>
                    <th>Strategi & Linimasa</th>
                    <th style="width: 75px; text-align: center;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${sPlans
                    .map(
                      (p) => `
                    <tr>
                      <td>${p.mainProblem}<div class="sub-text">Guru: ${p.teacherName}</div></td>
                      <td>${p.improvementGoal}</td>
                      <td><strong>${p.selectedStrategy}</strong><div class="sub-text">Waktu: ${p.executionTime} • Bukti: ${p.successEvidence}</div></td>
                      <td style="text-align: center;"><span class="badge-rtl">${p.status}</span></td>
                    </tr>`
                    )
                    .join('')}
                </tbody>
              </table>`
                : `
              <div class="empty-notice" style="text-align: left;">
                <strong>Komitmen RTL:</strong> Menerapkan pembelajaran nalar literasi-numerasi terjadwal dengan mengoptimalkan pembedahan teks soal cerita serta pembiasaan siswa menuliskan argumen/alasan. Dievaluasi secara berkala pada Komunitas Belajar (Kombel).
              </div>`
            }
          </div>

          <!-- V. DOKUMENTASI KEGIATAN PENDAMPINGAN DI KELAS -->
          <div class="section-box print-avoid-break">
            <div class="section-title">V. Dokumentasi Foto Kegiatan Pendampingan di Kelas</div>
            ${(() => {
              const matchedPhotos = docPhotos.filter(
                (p) => p.schoolName === 'ALL' || p.schoolName === sch.name
              );
              if (matchedPhotos.length === 0) {
                return `<div class="empty-notice" style="text-align: left;">Dokumentasi visual observasi terlampir dalam arsip digital kegiatan kepengawasan.</div>`;
              }
              return `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 6px;">
                  ${matchedPhotos
                    .map(
                      (p) => `
                    <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #f8fafc; break-inside: avoid;">
                      <img src="${p.dataUrl}" alt="${p.title}" style="width: 100%; height: 140px; object-fit: cover; display: block;" />
                      <div style="padding: 6px 8px; font-size: 10px;">
                        <strong style="color: #0f172a; display: block; line-height: 1.3;">${p.title}</strong>
                        <span style="color: #475569; font-size: 9px; display: block; margin-top: 2px;">${p.caption}</span>
                        <span style="color: #64748b; font-size: 8.5px; font-style: italic; display: block; margin-top: 3px;">Waktu: ${p.date}</span>
                      </div>
                    </div>`
                    )
                    .join('')}
                </div>`;
            })()}
          </div>

          <!-- VI. TANDA TANGAN -->
          <div class="signature-grid">
            <div class="sig-col">
              <span class="sig-role">Mengetahui,</span>
              <strong>Kepala ${sch.name}</strong>
              <div class="sig-line">${mode === 'single' && customPrincipal ? customPrincipal : '...........................................'}</div>
              <span class="sig-nip">NIP. ${mode === 'single' && customPrincipalNip ? customPrincipalNip : '...........................................'}</span>
            </div>
            <div class="sig-col">
              <span class="sig-role">Disepakati Bersama,</span>
              <strong>Guru Dampingan</strong>
              <div class="sig-line">${activeTeacher}</div>
              <span class="sig-nip">NIP. ${mode === 'single' && customTeacherNip ? customTeacherNip : '...........................................'}</span>
            </div>
            <div class="sig-col">
              <span class="sig-role">Tellu Limpoe, ${currentDate}</span>
              <strong>Pengawas Sekolah Pembina</strong>
              <div class="sig-line">Heriansyah., S.Si., S.Pd., M.Pd</div>
              <span class="sig-nip">NIP. 197805122005021004</span>
            </div>
          </div>
        </div>
        `;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan_Supervisi_GERAK_${mode === 'single' ? currentOfficialSchool.name.replace(/\s+/g, '_') : 'Tellu_Limpoe'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 10mm 10mm 10mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11px;
      line-height: 1.45;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .page-container {
      padding: 12px;
      margin-bottom: 24px;
      page-break-after: always;
      break-after: page;
    }
    .page-container:last-child {
      page-break-after: auto;
      break-after: auto;
    }
    .kop-header {
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 8px;
      text-align: center;
      margin-bottom: 12px;
    }
    .kop-line-1 { font-size: 11px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; color: #334155; }
    .kop-line-2 { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #1e293b; margin-top: 1px; }
    .kop-title { font-size: 14px; font-weight: 900; margin: 5px 0 2px 0; text-transform: uppercase; letter-spacing: -0.2px; }
    .kop-program { font-size: 11px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; }
    .kop-focus { font-size: 9.5px; color: #475569; font-style: italic; margin-top: 2px; }

    .id-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      padding: 8px 12px;
      margin-bottom: 12px;
    }
    .id-card-header {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .id-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      font-size: 10.5px;
    }
    .label { color: #64748b; display: block; font-size: 9.5px; }
    .sub { color: #475569; display: block; font-size: 9.5px; }

    .section-box { margin-bottom: 12px; }
    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 3px;
      margin-bottom: 6px;
      color: #0f172a;
    }
    .gain-pill {
      font-size: 9.5px;
      font-weight: 700;
      color: #065f46;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 2px 6px;
      border-radius: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
    }
    th {
      background: #f1f5f9;
      font-weight: 800;
      color: #1e293b;
    }
    .sub-text { font-size: 9px; color: #64748b; margin-top: 1px; }
    .total-row { background: #f8fafc; font-weight: 800; border-top: 2px solid #94a3b8; }

    .shift-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 6px;
    }
    .shift-card {
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 10px;
    }
    .shift-card.before { border: 1px solid #fecdd3; background: #fff1f2; }
    .shift-card.after { border: 1px solid #a7f3d0; background: #ecfdf5; }
    .shift-tag { font-weight: 800; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 3px; }
    .shift-card.before .shift-tag { color: #9f1239; }
    .shift-card.after .shift-tag { color: #065f46; }
    .shift-card p { margin: 0; line-height: 1.4; color: #334155; }
    .shift-note {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 9.5px;
      color: #334155;
    }

    .item-card {
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 6px 8px;
      margin-bottom: 4px;
      font-size: 10px;
    }
    .empty-notice {
      border: 1px dashed #cbd5e1;
      padding: 8px;
      text-align: center;
      color: #64748b;
      font-style: italic;
      font-size: 10px;
      border-radius: 4px;
    }
    .badge-rtl {
      background: #dbeafe;
      color: #1e40af;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9px;
    }

    .signature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      text-align: center;
      margin-top: 24px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .sig-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 105px;
    }
    .sig-role { font-size: 9.5px; color: #64748b; display: block; }
    .sig-line {
      width: 80%;
      margin: 36px auto 3px auto;
      border-bottom: 1.2px solid #0f172a;
      font-weight: 800;
      font-size: 10.5px;
      padding-bottom: 1px;
    }
    .sig-nip { font-size: 9px; color: #475569; display: block; }
  </style>
</head>
<body>
  ${sheetsHtml}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;
  };

  // Open Document in New Tab (Bypasses iframe print restrictions)
  const handleOpenNewTab = () => {
    try {
      const html = generateStandaloneHtml(printMode);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        // If popup blocker intervened, fallback to temporary link click
        const link = document.createElement('a');
        link.href = blobUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Failed to open new tab:', err);
      setPrintFeedback('Gagal membuka tab baru. Silakan gunakan tombol "Unduh Dokumen".');
    }
  };

  // Download Standalone HTML file
  const handleDownloadHtml = () => {
    try {
      const html = generateStandaloneHtml(printMode);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const filename =
        printMode === 'single'
          ? `Laporan_Supervisi_GERAK_${currentOfficialSchool.name.replace(/\s+/g, '_')}.html`
          : `Laporan_Supervisi_GERAK_Semua_Sekolah_Tellu_Limpoe.html`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setPrintFeedback('File laporan berhasil diunduh. Anda dapat membukanya kapan saja di browser.');
      setTimeout(() => setPrintFeedback(null), 6000);
    } catch (err) {
      console.error('Download failed:', err);
      setPrintFeedback('Gagal mengunduh file.');
    }
  };

  // Render a complete single-school report document for preview inside modal
  const renderSchoolDocument = (
    school: OfficialSchoolItem,
    progItem: SchoolProgressItem | null,
    teacherOverride?: string,
    classOverride?: string
  ) => {
    const sPlans = plans.filter((p) => p.schoolName === school.name);
    const sReflections = reflections.filter((r) => r.schoolName === school.name);
    const sGerak = gerakRecords.filter((g) => g.schoolName === school.name);

    const activeTeacher =
      teacherOverride ||
      progItem?.teacherName ||
      sPlans[0]?.teacherName ||
      sReflections[0]?.teacherName ||
      (school.level === 'SD' ? 'Guru Kelas Dampingan' : 'Guru Mapel Matematika');

    const activeClass =
      classOverride ||
      progItem?.targetClass ||
      (school.level === 'SD' ? 'Kelas V (Fase C)' : 'Kelas VII (Fase D)');

    // Fallback baseline metrics if school has no saved progress
    const indicators = progItem?.indicators || {
      understandingText: { beforePct: 35, afterPct: 80 },
      informationFiltering: { beforePct: 30, afterPct: 75 },
      operationModeling: { beforePct: 40, afterPct: 85 },
      reasoningCommunication: { beforePct: 20, afterPct: 70 },
    };

    const avgPre = Math.round(
      (indicators.understandingText.beforePct +
        indicators.informationFiltering.beforePct +
        indicators.operationModeling.beforePct +
        indicators.reasoningCommunication.beforePct) /
        4
    );

    const avgPost = Math.round(
      (indicators.understandingText.afterPct +
        indicators.informationFiltering.afterPct +
        indicators.operationModeling.afterPct +
        indicators.reasoningCommunication.afterPct) /
        4
    );

    const delta = avgPost - avgPre;
    const nGain = calculateNGain(avgPre, avgPost);

    const teacherShift = progItem?.teacherShift || {
      beforePractice:
        'Guru terbiasa langsung menulis rumus dan meminta siswa berhitung tanpa membedah alur cerita kontekstual.',
      afterPractice:
        'Guru memfasilitasi visualisasi cerita, memilah kalimat fakta vs kalimat tanya, dan melatih siswa menjelaskan alasan langkahnya.',
      keyStrategyUsed:
        school.level === 'SD'
          ? 'Strategi 1 — Baca, Visualisasikan, dan Tandai Kata Kunci'
          : 'Strategi 4 — Temukan Kesalahan (Detektif Nalar)',
    };

    const notes =
      progItem?.notes ||
      'Pendampingan berfokus pada penguatan penalaran numerasi bermakna melalui pendekatan GERAK BERDAMPAK di sekolah binaan.';

    return (
      <div
        key={school.name}
        className="p-6 sm:p-10 space-y-6 text-slate-900 bg-white rounded-xl shadow-xs print:p-0 print:m-0 print:shadow-none print-school-page"
      >
        {/* KOP DOKUMEN SUPERVISI RESMI */}
        <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-700">
            PEMERINTAH KABUPATEN SIDENRENG RAPPANG
          </div>
          <div className="text-xs sm:text-sm font-bold uppercase text-slate-800">
            DINAS PENDIDIKAN DAN KEBUDAYAAN • WILAYAH KECAMATAN TELLU LIMPOE
          </div>
          <h1 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight pt-1">
            LEMBAR HASIL PENDAMPINGAN SUPERVISI AKADEMIK
          </h1>
          <div className="text-xs sm:text-sm font-extrabold text-blue-900 uppercase">
            PROGRAM: GERAK BERDAMPAK (TEMU NALAR LITERASI-NUMERASI)
          </div>
          <div className="text-[11px] text-slate-600 italic">
            Fokus: Penguatan Berpikir Kritis & Kemampuan Bernalar Siswa Berbasis Data Kelas
          </div>
        </div>

        {/* IDENTITAS SATUAN PENDIDIKAN & GURU BINAAN */}
        <div className="rounded-xl border border-slate-300 bg-slate-50/80 p-4 text-xs">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
            <span>Identitas Satuan Pendidikan & Guru Binaan</span>
            <span className="text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded font-bold">
              Sekolah No. {school.no} • Jenjang {school.level}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 block">Satuan Pendidikan:</span>
              <strong className="text-slate-900 text-sm font-bold block">
                {school.name}
              </strong>
              <span className="text-[11px] text-slate-600">Status: {school.type}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Guru Dampingan:</span>
              <strong className="text-slate-900 text-sm font-bold block">
                {activeTeacher}
              </strong>
              <span className="text-[11px] text-slate-600">Sasaran: {activeClass}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pengawas Pembina:</span>
              <strong className="text-slate-900 block font-bold">
                Heriansyah., S.Si., S.Pd., M.Pd
              </strong>
              <span className="text-[11px] text-slate-600 block">NIP. 197805122005021004</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Tanggal: {currentDate}
              </span>
            </div>
          </div>
        </div>

        {/* BAGIAN I: DATA EVALUASI NALAR SISWA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
              I. Evaluasi Kemampuan Nalar Siswa: Sebelum vs Sesudah Pendampingan
            </h2>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Efektivitas: N-Gain = {nGain.score} ({nGain.category})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead className="bg-slate-100 font-bold text-slate-800">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-10 text-center">No</th>
                  <th className="p-2 border-r border-slate-300">Indikator Dimensi Temu Nalar</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">Skor Awal (Pre)</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">Skor Akhir (Post)</th>
                  <th className="p-2 border-r border-slate-300 text-center w-20">Kenaikan</th>
                  <th className="p-2 text-center w-28">N-Gain (g)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 text-center font-bold">1</td>
                  <td className="p-2 border-r border-slate-200">
                    <strong>Memahami Cerita & Situasi Masalah</strong>
                    <span className="block text-[10px] text-slate-500">
                      Siswa mampu menceritakan kembali alur soal tanpa langsung menghafal angka
                    </span>
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-rose-700">
                    {indicators.understandingText.beforePct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800">
                    {indicators.understandingText.afterPct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-black text-emerald-700">
                    +{indicators.understandingText.afterPct - indicators.understandingText.beforePct}%
                  </td>
                  <td className="p-2 text-center text-[11px] font-semibold">
                    g = {calculateNGain(indicators.understandingText.beforePct, indicators.understandingText.afterPct).score}
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 text-center font-bold">2</td>
                  <td className="p-2 border-r border-slate-200">
                    <strong>Memilah Informasi Pokok & Abaikan Pengalih</strong>
                    <span className="block text-[10px] text-slate-500">
                      Membedakan data besaran kuantitatif utama dengan informasi pendukung konteks
                    </span>
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-rose-700">
                    {indicators.informationFiltering.beforePct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800">
                    {indicators.informationFiltering.afterPct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-black text-emerald-700">
                    +{indicators.informationFiltering.afterPct - indicators.informationFiltering.beforePct}%
                  </td>
                  <td className="p-2 text-center text-[11px] font-semibold">
                    g = {calculateNGain(indicators.informationFiltering.beforePct, indicators.informationFiltering.afterPct).score}
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 text-center font-bold">3</td>
                  <td className="p-2 border-r border-slate-200">
                    <strong>Pemodelan Rumus & Pemilihan Operasi Hitung</strong>
                    <span className="block text-[10px] text-slate-500">
                      Menyusun kalimat matematika secara terstruktur dengan alasan logis
                    </span>
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-rose-700">
                    {indicators.operationModeling.beforePct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800">
                    {indicators.operationModeling.afterPct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-black text-emerald-700">
                    +{indicators.operationModeling.afterPct - indicators.operationModeling.beforePct}%
                  </td>
                  <td className="p-2 text-center text-[11px] font-semibold">
                    g = {calculateNGain(indicators.operationModeling.beforePct, indicators.operationModeling.afterPct).score}
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 text-center font-bold">4</td>
                  <td className="p-2 border-r border-slate-200">
                    <strong>Menalar & Mengomunikasikan Alasan Solusi</strong>
                    <span className="block text-[10px] text-slate-500">
                      Kemampuan menjelaskan "mengapa cara ini benar" dan menulis satuan tepat
                    </span>
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-rose-700">
                    {indicators.reasoningCommunication.beforePct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-emerald-800">
                    {indicators.reasoningCommunication.afterPct}%
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-black text-emerald-700">
                    +{indicators.reasoningCommunication.afterPct - indicators.reasoningCommunication.beforePct}%
                  </td>
                  <td className="p-2 text-center text-[11px] font-semibold">
                    g = {calculateNGain(indicators.reasoningCommunication.beforePct, indicators.reasoningCommunication.afterPct).score}
                  </td>
                </tr>

                {/* RATA-RATA TOTAL KELAS */}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td colSpan={2} className="p-2 border-r border-slate-300 text-right uppercase tracking-wider text-[11px]">
                    Rata-Rata Capaian Kelas Dampingan:
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center text-rose-700 font-extrabold">
                    {avgPre}%
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center text-emerald-800 font-black">
                    {avgPost}%
                  </td>
                  <td className="p-2 border-r border-slate-300 text-center text-emerald-700 font-black">
                    +{delta}%
                  </td>
                  <td className="p-2 text-center font-black text-blue-900">
                    g = {nGain.score} ({nGain.category})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BAGIAN II: TRANSFORMASI PRAKTIK PEMBELAJARAN GURU DAMPINGAN */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            II. Perubahan Praktik Guru: Sebelum vs Sesudah Pendampingan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40 space-y-1">
              <span className="font-bold text-rose-900 block uppercase text-[10px] tracking-wider">
                Praktik Pembelajaran Sebelum Supervisi:
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {teacherShift.beforePractice}
              </p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 space-y-1">
              <span className="font-bold text-emerald-900 block uppercase text-[10px] tracking-wider">
                Praktik Pembelajaran Sesudah GERAK:
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {teacherShift.afterPractice}
              </p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-slate-500 font-semibold">Strategi Temu Nalar Terpilih: </span>
              <strong className="text-blue-900">{teacherShift.keyStrategyUsed}</strong>
            </div>
            <div className="text-[11px] text-slate-600 italic">
              Catatan: {notes}
            </div>
          </div>
        </div>

        {/* BAGIAN III: REFLEKSI GURU & CATATAN OBSERVASI GERAK */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            III. Catatan Observasi Lapangan & Refleksi Diri Guru
          </h2>

          {sReflections.length > 0 || sGerak.length > 0 ? (
            <div className="space-y-2 text-xs">
              {sReflections.map((ref) => (
                <div key={ref.id} className="p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold border-b border-slate-100 pb-1">
                    <span className="text-slate-800">
                      Refleksi Mandiri: {ref.teacherName} ({ref.subject})
                    </span>
                    <span className="text-blue-800">
                      Skor: {ref.totalScore}/{ref.maxScore} ({ref.category})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong>Kekuatan Mengajar:</strong> {ref.strengths.join(' • ')}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong>Fokus Penguatan:</strong> {ref.areasToImprove.join(' • ')}
                  </div>
                </div>
              ))}

              {sGerak.map((rec) => (
                <div key={rec.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="font-bold text-slate-800">
                    Catatan Alur GERAK: {rec.teacherName} ({rec.timestamp})
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong>Masalah di Kelas:</strong> {rec.learningProblem}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong>Bukti Faktual:</strong> {rec.evidenceFound}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <strong>Rencana Tindakan:</strong> {rec.actionPlan}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-lg border border-dashed border-slate-300 text-center text-xs text-slate-500 italic">
              Belum ada catatan refleksi khusus yang tercatat untuk sekolah ini.
              (Instrumen pendampingan ini berfungsi sebagai instrumen supervisi awal).
            </div>
          )}
        </div>

        {/* BAGIAN IV: RENCANA TINDAK LANJUT (RTL) YANG DISEPAKATI */}
        <div className="space-y-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            IV. Rencana Tindak Lanjut (RTL) Pendampingan Sekolah Ini
          </h2>

          {sPlans.length > 0 ? (
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead className="bg-slate-100 font-bold text-slate-800">
                <tr className="border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-1/4">Masalah Pembelajaran</th>
                  <th className="p-2 border-r border-slate-300 w-1/4">Sasaran Peningkatan</th>
                  <th className="p-2 border-r border-slate-300 w-1/3">Strategi & Linimasa</th>
                  <th className="p-2 text-center w-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {sPlans.map((p) => (
                  <tr key={p.id} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-200 text-slate-800">
                      {p.mainProblem}
                      <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                        Guru: {p.teacherName}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-slate-700">
                      {p.improvementGoal}
                    </td>
                    <td className="p-2 border-r border-slate-200 text-slate-700">
                      <strong className="text-blue-900 block">{p.selectedStrategy}</strong>
                      <span className="text-[10px] text-slate-500 block">
                        Linimasa: {p.executionTime}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Bukti: {p.successEvidence}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'Tercapai'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-800">
                Komitmen Kesepakatan RTL Sekolah:
              </div>
              <p className="text-[11px] leading-relaxed">
                Menerapkan pembelajaran nalar literasi-numerasi secara terjadwal dengan
                mengoptimalkan pembedahan teks soal cerita serta pembiasaan siswa menuliskan
                argumen/alasan di setiap jawaban. RTL ini akan dievaluasi secara berkala pada
                kegiatan Komunitas Belajar (Kombel) antar-guru di Kecamatan Tellu Limpoe.
              </p>
            </div>
          )}
        </div>

        {/* BAGIAN V: DOKUMENTASI FOTO KEGIATAN PENDAMPINGAN */}
        <div className="space-y-2 print-avoid-break">
          <div className="flex items-center justify-between border-b border-slate-300 pb-1">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
              V. Dokumentasi Foto Kegiatan Pendampingan di Kelas
            </h2>
            <button
              type="button"
              onClick={() => setShowPhotoManager(true)}
              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 print:hidden cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Kelola / Unggah Foto</span>
            </button>
          </div>

          {(() => {
            const matchedPhotos = docPhotos.filter(
              (p) => p.schoolName === 'ALL' || p.schoolName === school.name
            );
            if (matchedPhotos.length === 0) {
              return (
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-500 italic">
                  Dokumentasi visual kegiatan observasi dan pendampingan terlampir dalam arsip digital
                  pengawas sekolah.
                </div>
              );
            }
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {matchedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-xl border border-slate-300 bg-slate-50/70 overflow-hidden text-xs break-inside-avoid shadow-2xs"
                  >
                    <div className="h-36 sm:h-40 bg-slate-200 overflow-hidden">
                      <img
                        src={photo.dataUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2.5 space-y-1">
                      <strong className="block text-slate-900 font-bold leading-tight">
                        {photo.title}
                      </strong>
                      <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                        {photo.caption}
                      </p>
                      <div className="text-[10px] text-slate-400 italic pt-1">
                        Waktu Kegiatan: {photo.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* BAGIAN VI: PENGESAHAN & TANDA TANGAN RESMI */}
        <div className="pt-6 grid grid-cols-3 text-center text-xs gap-4 print:pt-8 print-avoid-break">
          {/* 1. Kepala Sekolah */}
          <div className="space-y-12">
            <div>
              <span className="block text-slate-500 text-[11px]">Mengetahui,</span>
              <strong className="block text-slate-900 font-bold">
                Kepala {school.name}
              </strong>
            </div>
            <div>
              <div className="w-36 border-b border-slate-900 mx-auto font-bold text-slate-900 pb-0.5">
                {customPrincipal || '...........................................'}
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                NIP. {customPrincipalNip || '...........................................'}
              </span>
            </div>
          </div>

          {/* 2. Guru Dampingan */}
          <div className="space-y-12">
            <div>
              <span className="block text-slate-500 text-[11px]">Disepakati Bersama,</span>
              <strong className="block text-slate-900 font-bold">Guru Dampingan</strong>
            </div>
            <div>
              <div className="w-36 border-b border-slate-900 mx-auto font-bold text-slate-900 pb-0.5">
                {activeTeacher}
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                NIP. {customTeacherNip || '...........................................'}
              </span>
            </div>
          </div>

          {/* 3. Pengawas Sekolah */}
          <div className="space-y-12">
            <div>
              <span className="block text-slate-500 text-[11px]">
                Tellu Limpoe, {currentDate}
              </span>
              <strong className="block text-slate-900 font-bold">
                Pengawas Sekolah Pembina
              </strong>
            </div>
            <div>
              <div className="w-44 border-b border-slate-900 mx-auto font-bold text-slate-900 pb-0.5">
                Heriansyah., S.Si., S.Pd., M.Pd
              </div>
              <span className="text-[10px] text-slate-600 block mt-1">
                NIP. 197805122005021004
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      id="print-modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible cursor-pointer"
      onClick={handleCloseModal}
    >
      {/* Modal Dialog Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300 flex flex-col h-[92vh] max-h-[95vh] z-10 print:max-h-none print:h-auto print:shadow-none print:border-none print:w-full print:rounded-none overflow-hidden cursor-default my-auto"
      >
        {/* MODAL TOOLBAR (ALWAYS PINNED AT THE TOP, HIDDEN IN PRINT) */}
        <div className="shrink-0 p-4 sm:p-5 bg-slate-900 text-white flex flex-col gap-3 print:hidden border-b border-slate-800 shadow-md">
          {/* Top Bar: Title & Primary Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Cetak / Simpan PDF Laporan Pendampingan</span>
                  <span className="text-[10px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/60 font-semibold">
                    Tellu Limpoe
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Laporan resmi per sekolah dan guru agar teratur dan tidak bercampur
                </p>
              </div>
            </div>

            {/* Action Buttons: Cetak, Buka Tab Baru, Unduh HTML, Tutup (X) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 1. Primary Print / Save PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                id="btn-trigger-print"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 cursor-pointer"
                title="Buka dialog cetak browser (Pilih 'Save as PDF' untuk menyimpan file PDF)"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>

              {/* 2. Manage Photos Button */}
              <button
                type="button"
                onClick={() => setShowPhotoManager(true)}
                id="btn-open-photo-manager"
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Kelola & lampirkan foto dokumentasi kegiatan pendampingan"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Foto Kegiatan ({docPhotos.length})</span>
              </button>

              {/* 3. Open in New Tab Button (Bypasses iframe constraints) */}
              <button
                type="button"
                onClick={handleOpenNewTab}
                id="btn-open-new-tab"
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Buka dokumen di tab browser baru untuk mencetak tanpa batas iframe"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Buka Tab Baru</span>
              </button>

              {/* 3. Download HTML Button */}
              <button
                type="button"
                onClick={handleDownloadHtml}
                id="btn-download-html"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                title="Unduh file dokumen HTML mandiri ke perangkat Anda"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Unduh File</span>
              </button>

              {/* 4. PROMINENT CLOSE BUTTON (X & Text) */}
              <button
                type="button"
                onClick={handleCloseModal}
                id="btn-close-print-top"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-950/40 border border-rose-500 transition flex items-center gap-1.5 cursor-pointer"
                title="Tutup Jendela Pratinjau (atau tekan tombol Esc di keyboard)"
              >
                <X className="w-5 h-5 pointer-events-none" />
                <span>Tutup</span>
              </button>
            </div>
          </div>

          {/* Print Notification / Guidance Banner */}
          {printFeedback ? (
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{printFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setPrintFeedback(null)}
                className="text-amber-400 hover:text-white text-xs underline cursor-pointer"
              >
                Sembunyikan
              </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  <strong>Tips Simpan PDF:</strong> Pada jendela dialog cetak yang muncul, ubah pilihan <em>Tujuan (Destination)</em> menjadi <strong>"Simpan sebagai PDF" / "Save as PDF"</strong>, lalu klik <strong>Simpan</strong>.
                </span>
              </div>
            )}

            {/* Mode Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
              <div className="inline-flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setPrintMode('single')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    printMode === 'single'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Cetak Per Sekolah & Guru</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrintMode('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    printMode === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Cetak Semua Sekolah (Lembar Terpisah)</span>
                </button>
              </div>

              {/* Hint text */}
              <div className="text-[11px] text-slate-400">
                {printMode === 'single' ? (
                  <span>
                    Menampilkan laporan khusus untuk 1 sekolah dan guru yang dipilih.
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    Setiap sekolah dicetak pada lembaran/halaman terpisah (tidak bercampur).
                  </span>
                )}
              </div>
            </div>

            {/* Single Mode Controls: Dropdowns for School & Teacher */}
            {printMode === 'single' && (
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  {/* School Selector (25 Official Schools) */}
                  <div className="md:col-span-6">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-blue-400" />
                        <span>Pilih Sekolah Binaan (25 Sekolah)</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevSchool}
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] transition cursor-pointer"
                          title="Sekolah Sebelumnya"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextSchool}
                          className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px] transition cursor-pointer"
                          title="Sekolah Berikutnya"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <select
                      value={selectedSchoolName}
                      onChange={(e) => setSelectedSchoolName(e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    >
                      <optgroup label="Sekolah Dasar (SD) — 21 Sekolah Binaan">
                        {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SD').map((sch) => {
                          const hasData = hasDataMap.get(sch.name);
                          return (
                            <option key={sch.name} value={sch.name}>
                              {sch.no}. {sch.name} {hasData ? '✓ (Ada Data)' : ''}
                            </option>
                          );
                        })}
                      </optgroup>
                      <optgroup label="Sekolah Menengah Pertama (SMP) — 4 Sekolah Binaan">
                        {OFFICIAL_SCHOOLS_TELLU_LIMPOE.filter((s) => s.level === 'SMP').map((sch) => {
                          const hasData = hasDataMap.get(sch.name);
                          return (
                            <option key={sch.name} value={sch.name}>
                              {sch.no}. {sch.name} {hasData ? '✓ (Ada Data)' : ''}
                            </option>
                          );
                        })}
                      </optgroup>
                    </select>
                  </div>

                  {/* Teacher Name Input / Select */}
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Guru Dampingan</span>
                    </label>
                    {detectedTeachers.length > 1 ? (
                      <select
                        value={customTeacher}
                        onChange={(e) => {
                          setCustomTeacher(e.target.value);
                          setSelectedTeacherName(e.target.value);
                        }}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                      >
                        {detectedTeachers.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={customTeacher}
                        onChange={(e) => setCustomTeacher(e.target.value)}
                        placeholder="Nama Guru Dampingan"
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    )}
                  </div>

                  {/* Target Class Input */}
                  <div className="md:col-span-3">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Kelas / Fase
                    </label>
                    <input
                      type="text"
                      value={customClass}
                      onChange={(e) => setCustomClass(e.target.value)}
                      placeholder="Contoh: Kelas V-A (Fase C)"
                      className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                  </div>
                </div>

                {/* Optional Metadata: Kepala Sekolah & NIP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">
                      Nama Kepala Sekolah (Opsional untuk Lembar TTD):
                    </label>
                    <input
                      type="text"
                      value={customPrincipal}
                      onChange={(e) => setCustomPrincipal(e.target.value)}
                      placeholder="Contoh: Drs. H. Mulyadi, M.Pd (atau kosongkan untuk titik-titik)"
                      className="w-full p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">
                      NIP Kepala Sekolah (Opsional):
                    </label>
                    <input
                      type="text"
                      value={customPrincipalNip}
                      onChange={(e) => setCustomPrincipalNip(e.target.value)}
                      placeholder="Contoh: 197204151998021003"
                      className="w-full p-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PRINTABLE DOCUMENT SHEET AREA (SCROLLABLE CONTAINER) */}
          <div className="flex-1 overflow-y-auto min-h-0 bg-slate-100 p-2 sm:p-6 print:overflow-visible print:p-0 print:bg-white divide-y-4 divide-dashed divide-slate-200 print:divide-none">
            {printMode === 'single' ? (
              renderSchoolDocument(
                currentOfficialSchool,
                primaryProgress,
                customTeacher,
                customClass
              )
            ) : (
              OFFICIAL_SCHOOLS_TELLU_LIMPOE.map((sch) => {
                const pItem = schoolProgressList.find((p) => p.schoolName === sch.name) || null;
                return renderSchoolDocument(sch, pItem);
              })
            )}
          </div>

          {/* BOTTOM FOOTER BAR (ALWAYS ACCESSIBLE, HIDDEN IN PRINT) */}
          <div className="shrink-0 p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
            <div className="text-xs text-slate-500">
              Menampilkan:{' '}
              <strong className="text-slate-800">
                {printMode === 'single' ? currentOfficialSchool.name : '25 Sekolah Binaan Tellu Limpoe'}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                id="btn-close-print-bottom"
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs sm:text-sm font-bold border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4 pointer-events-none" />
                <span>Tutup Pratinjau</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Kelola Foto Dokumentasi */}
        <PhotoManagerModal
          isOpen={showPhotoManager}
          onClose={() => setShowPhotoManager(false)}
          defaultSchoolName={selectedSchoolName}
          onPhotosUpdated={() => setDocPhotos(getDocPhotos())}
        />
      </div>
  );
};
