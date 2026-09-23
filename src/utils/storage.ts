import {
  GerakRecord,
  ActionPlanItem,
  ReflectionReport,
  ImpactData,
  SchoolProgressItem,
  DocPhoto,
  BackupPackage,
  MicroCommitment,
  LabQuestion,
} from '../types';
import {
  INITIAL_ACTION_PLANS,
  INITIAL_GERAK_RECORDS,
  INITIAL_IMPACT_DATA,
  INITIAL_SCHOOL_PROGRESS,
  INITIAL_MICRO_COMMITMENTS,
} from '../data/appData';
import { idbSet, idbGet, idbDelete } from './indexedDb';

export const KEYS = {
  GERAK: 'gerak_berdampak_gerak_records',
  RTL: 'gerak_berdampak_action_plans',
  REFLECTIONS: 'gerak_berdampak_reflections',
  IMPACT: 'gerak_berdampak_impact_data',
  CURRENT_SCHOOL: 'gerak_berdampak_current_school',
  CURRENT_TEACHER: 'gerak_berdampak_current_teacher',
  OBSERVED_PROBLEMS: 'gerak_berdampak_observed_problems',
  SCHOOL_PROGRESS: 'gerak_berdampak_school_progress',
  DOC_PHOTOS: 'gerak_berdampak_doc_photos',
  MICRO_COMMITMENTS: 'gerak_berdampak_micro_commitments',
  CUSTOM_QUESTIONS: 'gerak_berdampak_custom_questions',
};

// Safe wrapper around localStorage.setItem
export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err: any) {
    console.error(`[Storage] localStorage.setItem failed for key "${key}":`, err);
    return false;
  }
};

// Broadcast storage update so all components/tabs update immediately
const notifyStorageUpdated = (key: string, data?: any) => {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(
        new CustomEvent('app_storage_updated', {
          detail: { key, data, timestamp: Date.now() },
        })
      );
    } catch {}
  }
};

export const INITIAL_DOC_PHOTOS: DocPhoto[] = [
  // UPT SD NEGERI 1 MASSEPE - Guru 1: Andi Nurhaliza, S.Pd.
  {
    id: 'photo-massepe-andi-1',
    schoolName: 'UPT SD NEGERI 1 MASSEPE',
    teacherName: 'Andi Nurhaliza, S.Pd.',
    activityType: 'Observasi Pembelajaran Kelas',
    title: 'Pendampingan Pembedahan Teks Soal Cerita — Kelas V-A',
    caption: 'Guru Andi Nurhaliza membimbing siswa menandai kata kunci dan membedakan informasi fakta vs pertanyaan pada lembar kerja numerasi.',
    date: '14 Agustus 2026',
    dataUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-massepe-andi-2',
    schoolName: 'UPT SD NEGERI 1 MASSEPE',
    teacherName: 'Andi Nurhaliza, S.Pd.',
    activityType: 'Refleksi Klinis GERAK',
    title: 'Refleksi Klinis Pasca-Observasi bersama Ibu Andi Nurhaliza',
    caption: 'Pengawas pembina dan guru menganalisis pergeseran pemahaman siswa dari 36% menjadi 82% pasca penerapan Strategi 1.',
    date: '18 Oktober 2026',
    dataUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  // UPT SD NEGERI 1 MASSEPE - Guru 2: Nurhayati, S.Pd.
  {
    id: 'photo-massepe-nurhayati-1',
    schoolName: 'UPT SD NEGERI 1 MASSEPE',
    teacherName: 'Nurhayati, S.Pd.',
    activityType: 'Simulasi Strategi Nalar',
    title: 'Penerapan Strategi 1 (Baca, Tandai, Tanya) di Kelas IV-B',
    caption: 'Guru Nurhayati melatih siswa menggunakan stabilo warna untuk memilah angka pengalih dan menyusun skema nalar mandiri.',
    date: '12 September 2026',
    dataUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-massepe-nurhayati-2',
    schoolName: 'UPT SD NEGERI 1 MASSEPE',
    teacherName: 'Nurhayati, S.Pd.',
    activityType: 'Pemeriksaan Hasil Formatif',
    title: 'Pemberian Umpan Balik Formatif Guru Nurhayati pada Buku Latihan',
    caption: 'Guru memeriksa langkah nalar siswa sebelum siswa melakukan komputasi teknis pada soal bertingkat.',
    date: '28 September 2026',
    dataUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  },
  // UPT SMP NEGERI 1 TELLU LIMPOE - Guru 1: Muhammad Rusdi, S.Pd., Gr.
  {
    id: 'photo-smp1-rusdi-1',
    schoolName: 'UPT SMP NEGERI 1 TELLU LIMPOE',
    teacherName: 'Muhammad Rusdi, S.Pd., Gr.',
    activityType: 'Observasi Pembelajaran Kelas',
    title: 'Praktik Detektif Nalar & Papan Tulis Kelas VII-B',
    caption: 'Pak Muhammad Rusdi memandu siswa mengoreksi jebakan informasi pada soal aritmetika bertingkat.',
    date: '16 Agustus 2026',
    dataUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-smp1-rusdi-2',
    schoolName: 'UPT SMP NEGERI 1 TELLU LIMPOE',
    teacherName: 'Muhammad Rusdi, S.Pd., Gr.',
    activityType: 'Refleksi Klinis GERAK',
    title: 'Dialog Konstruktif Hasil Asesmen Formatif Pak Rusdi',
    caption: 'Pengawas pembina mendiskusikan peningkatan N-Gain nalar siswa kelas VII-B sebesar 0.65.',
    date: '22 Oktober 2026',
    dataUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
  },
  // UPT SMP NEGERI 1 TELLU LIMPOE - Guru 2: Ahmad Syahrir, S.Pd.
  {
    id: 'photo-smp1-syahrir-1',
    schoolName: 'UPT SMP NEGERI 1 TELLU LIMPOE',
    teacherName: 'Ahmad Syahrir, S.Pd.',
    activityType: 'Observasi Diskusi Kelas',
    title: 'Diskusi Berpasangan Soal Cerita Aritmetika Sosial',
    caption: 'Pak Ahmad Syahrir mendampingi siswa memvalidasi keselarasan jawaban akhir dengan satuan nalar.',
    date: '10 September 2026',
    dataUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-smp1-syahrir-2',
    schoolName: 'UPT SMP NEGERI 1 TELLU LIMPOE',
    teacherName: 'Ahmad Syahrir, S.Pd.',
    activityType: 'Evaluasi & Refleksi RTL',
    title: 'Refleksi Capaian RTL Kombel Matematika SMPN 1 Tellu Limpoe',
    caption: 'Penyusunan portofolio koreksi nalar siswa bersama kepala sekolah dan pengawas pembina.',
    date: '25 September 2026',
    dataUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  },
  // UPT SD NEGERI 1 AMPARITA - Guru 1: Siti Rahmawati, S.Pd.
  {
    id: 'photo-amparita-rahma-1',
    schoolName: 'UPT SD NEGERI 1 AMPARITA',
    teacherName: 'Siti Rahmawati, S.Pd.',
    activityType: 'Simulasi Peran Konkret',
    title: 'Menceritakan Kembali Situasi Masalah dengan Media Konkret di Kelas IV',
    caption: 'Ibu Siti Rahmawati mengajak siswa bermain peran situasi jual beli hasil bumi lokal Sidrap.',
    date: '22 Agustus 2026',
    dataUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  },
  // UPT SD NEGERI 1 AMPARITA - Guru 2: Hasnidar, S.Pd.
  {
    id: 'photo-amparita-hasnidar-1',
    schoolName: 'UPT SD NEGERI 1 AMPARITA',
    teacherName: 'Hasnidar, S.Pd.',
    activityType: 'Peragaan Media Manipulatif',
    title: 'Peragaan Media Konkret & Timbangan Mini di Kelas III',
    caption: 'Ibu Hasnidar membimbing siswa mengeksplorasi konsep satuan berat dan harga per kilogram.',
    date: '11 September 2026',
    dataUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  },
  // UPT SD NEGERI 2 BILOKKA - Guru: Kaharuddin, S.Pd.
  {
    id: 'photo-bilokka-kahar-1',
    schoolName: 'UPT SD NEGERI 2 BILOKKA',
    teacherName: 'Kaharuddin, S.Pd.',
    activityType: 'Pemodelan Kalimat Matematika',
    title: 'Metode "Jelaskan Langkahmu Sebelum Menghitung" di Kelas VI',
    caption: 'Pak Kaharuddin melatih siswa menyusun kalimat matematika bertahap pada pecahan campuran.',
    date: '26 Agustus 2026',
    dataUrl: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=800&q=80',
  },
  // UPT SMP NEGERI 2 TELLU LIMPOE - Guru: Nurjannah, S.Pd.
  {
    id: 'photo-smp2-nurjannah-1',
    schoolName: 'UPT SMP NEGERI 2 TELLU LIMPOE',
    teacherName: 'Nurjannah, S.Pd.',
    activityType: 'Analisis Data Tabel',
    title: 'Pembedahan Tabel Statistik & Detektif Nalar Kelas VIII',
    caption: 'Ibu Nurjannah membimbing diskusi kritis membedakan data primer dan informasi pengalih.',
    date: '03 September 2026',
    dataUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80',
  },
  // Dokumentasi Umum Pendampingan Satuan Pendidikan
  {
    id: 'photo-general-1',
    schoolName: 'ALL',
    teacherName: 'ALL',
    activityType: 'Koordinasi Supervisi Umum',
    title: 'Pertemuan Koordinasi Pendampingan Pengawas di Satuan Pendidikan',
    caption: 'Penyamaan persepsi instrumen temu nalar dan alur pendampingan klinis GERAK bersama jajaran pendidik sekolah binaan.',
    date: 'Agustus 2026',
    dataUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  },
];

export const getGerakRecords = (): GerakRecord[] => {
  try {
    const data = localStorage.getItem(KEYS.GERAK);
    if (!data) return INITIAL_GERAK_RECORDS;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return INITIAL_GERAK_RECORDS;
    return parsed;
  } catch (e) {
    console.error('Failed to read GERAK records', e);
    return INITIAL_GERAK_RECORDS;
  }
};

export const saveGerakRecord = (record: GerakRecord): GerakRecord[] => {
  const current = getGerakRecords();
  const updated = [record, ...current.filter((r) => r.id !== record.id)];
  safeLocalStorageSet(KEYS.GERAK, JSON.stringify(updated));
  idbSet(KEYS.GERAK, updated).catch((err) => console.warn('[IDB] Failed to backup GERAK record', err));
  notifyStorageUpdated(KEYS.GERAK, updated);
  return updated;
};

export const deleteGerakRecord = (id: string): GerakRecord[] => {
  const current = getGerakRecords();
  const updated = current.filter((r) => r.id !== id);
  safeLocalStorageSet(KEYS.GERAK, JSON.stringify(updated));
  idbSet(KEYS.GERAK, updated).catch((err) => console.warn('[IDB] Failed to update GERAK record', err));
  notifyStorageUpdated(KEYS.GERAK, updated);
  return updated;
};

export const getActionPlans = (): ActionPlanItem[] => {
  try {
    const data = localStorage.getItem(KEYS.RTL);
    if (!data) return INITIAL_ACTION_PLANS;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return INITIAL_ACTION_PLANS;
    return parsed;
  } catch (e) {
    console.error('Failed to read action plans', e);
    return INITIAL_ACTION_PLANS;
  }
};

export const saveActionPlan = (plan: ActionPlanItem): ActionPlanItem[] => {
  const current = getActionPlans();
  const updated = [plan, ...current.filter((p) => p.id !== plan.id)];
  safeLocalStorageSet(KEYS.RTL, JSON.stringify(updated));
  idbSet(KEYS.RTL, updated).catch((err) => console.warn('[IDB] Failed to backup RTL', err));
  notifyStorageUpdated(KEYS.RTL, updated);
  return updated;
};

export const deleteActionPlan = (id: string): ActionPlanItem[] => {
  const current = getActionPlans();
  const updated = current.filter((p) => p.id !== id);
  safeLocalStorageSet(KEYS.RTL, JSON.stringify(updated));
  idbSet(KEYS.RTL, updated).catch((err) => console.warn('[IDB] Failed to update RTL', err));
  notifyStorageUpdated(KEYS.RTL, updated);
  return updated;
};

export const getReflections = (): ReflectionReport[] => {
  try {
    const data = localStorage.getItem(KEYS.REFLECTIONS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read reflections', e);
    return [];
  }
};

export const saveReflection = (report: ReflectionReport): ReflectionReport[] => {
  const current = getReflections();
  const updated = [report, ...current.filter((r) => r.id !== report.id)];
  safeLocalStorageSet(KEYS.REFLECTIONS, JSON.stringify(updated));
  idbSet(KEYS.REFLECTIONS, updated).catch((err) => console.warn('[IDB] Failed to backup reflection', err));
  notifyStorageUpdated(KEYS.REFLECTIONS, updated);
  return updated;
};

export const deleteReflection = (id: string): ReflectionReport[] => {
  const current = getReflections();
  const updated = current.filter((r) => r.id !== id);
  safeLocalStorageSet(KEYS.REFLECTIONS, JSON.stringify(updated));
  idbSet(KEYS.REFLECTIONS, updated).catch((err) => console.warn('[IDB] Failed to update reflection', err));
  notifyStorageUpdated(KEYS.REFLECTIONS, updated);
  return updated;
};

export const getImpactData = (): ImpactData => {
  try {
    const data = localStorage.getItem(KEYS.IMPACT);
    return data ? JSON.parse(data) : INITIAL_IMPACT_DATA;
  } catch (e) {
    console.error('Failed to read impact data', e);
    return INITIAL_IMPACT_DATA;
  }
};

export const saveImpactData = (data: ImpactData): ImpactData => {
  safeLocalStorageSet(KEYS.IMPACT, JSON.stringify(data));
  idbSet(KEYS.IMPACT, data).catch((err) => console.warn('[IDB] Failed to backup impact data', err));
  notifyStorageUpdated(KEYS.IMPACT, data);
  return data;
};

export const getObservedProblems = (): number[] => {
  try {
    const data = localStorage.getItem(KEYS.OBSERVED_PROBLEMS);
    return data ? JSON.parse(data) : [1, 3, 6];
  } catch (e) {
    return [1, 3, 6];
  }
};

export const toggleObservedProblem = (id: number): number[] => {
  const current = getObservedProblems();
  const exists = current.includes(id);
  const updated = exists ? current.filter((i) => i !== id) : [...current, id];
  safeLocalStorageSet(KEYS.OBSERVED_PROBLEMS, JSON.stringify(updated));
  idbSet(KEYS.OBSERVED_PROBLEMS, updated).catch((err) => console.warn('[IDB] Failed to backup observed problems', err));
  notifyStorageUpdated(KEYS.OBSERVED_PROBLEMS, updated);
  return updated;
};

export const getSchoolProgress = (): SchoolProgressItem[] => {
  try {
    const data = localStorage.getItem(KEYS.SCHOOL_PROGRESS);
    if (!data) return INITIAL_SCHOOL_PROGRESS;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return INITIAL_SCHOOL_PROGRESS;
    return parsed;
  } catch (e) {
    console.error('Failed to read school progress', e);
    return INITIAL_SCHOOL_PROGRESS;
  }
};

export const saveSchoolProgress = (item: SchoolProgressItem): SchoolProgressItem[] => {
  const current = getSchoolProgress();
  const exists = current.some((s) => s.id === item.id);
  const updated = exists
    ? current.map((s) => (s.id === item.id ? item : s))
    : [item, ...current];
  safeLocalStorageSet(KEYS.SCHOOL_PROGRESS, JSON.stringify(updated));
  idbSet(KEYS.SCHOOL_PROGRESS, updated).catch((err) => console.warn('[IDB] Failed to backup school progress', err));
  notifyStorageUpdated(KEYS.SCHOOL_PROGRESS, updated);
  return updated;
};

export const deleteSchoolProgress = (id: string): SchoolProgressItem[] => {
  const current = getSchoolProgress();
  const updated = current.filter((s) => s.id !== id);
  safeLocalStorageSet(KEYS.SCHOOL_PROGRESS, JSON.stringify(updated));
  idbSet(KEYS.SCHOOL_PROGRESS, updated).catch((err) => console.warn('[IDB] Failed to update school progress', err));
  notifyStorageUpdated(KEYS.SCHOOL_PROGRESS, updated);
  return updated;
};

export interface NGainResult {
  score: number; // e.g. 0.72
  category: 'Tinggi' | 'Sedang' | 'Rendah';
  colorClass: string;
  badgeBg: string;
}

export const calculateNGain = (beforePct: number, afterPct: number): NGainResult => {
  const b = Math.max(0, Math.min(100, beforePct));
  const a = Math.max(0, Math.min(100, afterPct));
  const denominator = 100 - b;

  if (denominator <= 0) {
    return {
      score: 1.0,
      category: 'Tinggi',
      colorClass: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    };
  }

  const rawGain = (a - b) / denominator;
  const score = Math.round(Math.max(-1, rawGain) * 100) / 100;

  if (score >= 0.7) {
    return {
      score,
      category: 'Tinggi',
      colorClass: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    };
  }
  if (score >= 0.3) {
    return {
      score,
      category: 'Sedang',
      colorClass: 'text-blue-700',
      badgeBg: 'bg-blue-100 border-blue-300 text-blue-800',
    };
  }
  return {
    score,
    category: 'Rendah',
    colorClass: 'text-amber-700',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-800',
  };
};

export const getDocPhotos = (): DocPhoto[] => {
  try {
    const data = localStorage.getItem(KEYS.DOC_PHOTOS);
    if (!data) return INITIAL_DOC_PHOTOS;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_DOC_PHOTOS;
    // Check if user has old legacy default photos without teacherName
    const isLegacyDefaultOnly =
      parsed.length <= 2 &&
      parsed.every((p: any) => !p.teacherName || p.id === 'photo-default-1' || p.id === 'photo-default-2');
    if (isLegacyDefaultOnly) {
      safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(INITIAL_DOC_PHOTOS));
      idbSet(KEYS.DOC_PHOTOS, INITIAL_DOC_PHOTOS).catch(() => {});
      return INITIAL_DOC_PHOTOS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read doc photos', e);
    return INITIAL_DOC_PHOTOS;
  }
};

export const saveDocPhoto = (photo: DocPhoto): DocPhoto[] => {
  const current = getDocPhotos();
  const exists = current.some((p) => p.id === photo.id);
  const updated = exists
    ? current.map((p) => (p.id === photo.id ? photo : p))
    : [photo, ...current];
  safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(updated));
  idbSet(KEYS.DOC_PHOTOS, updated).catch((err) => console.warn('[IDB] Failed to backup photo', err));
  notifyStorageUpdated(KEYS.DOC_PHOTOS, updated);
  return updated;
};

export const updateDocPhoto = (id: string, updates: Partial<DocPhoto>): DocPhoto[] => {
  const current = getDocPhotos();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(updated));
  idbSet(KEYS.DOC_PHOTOS, updated).catch((err) => console.warn('[IDB] Failed to update photo', err));
  notifyStorageUpdated(KEYS.DOC_PHOTOS, updated);
  return updated;
};

export const deleteDocPhoto = (id: string): DocPhoto[] => {
  const current = getDocPhotos();
  const updated = current.filter((p) => p.id !== id);
  safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(updated));
  idbSet(KEYS.DOC_PHOTOS, updated).catch((err) => console.warn('[IDB] Failed to update photos', err));
  notifyStorageUpdated(KEYS.DOC_PHOTOS, updated);
  return updated;
};

export const initializeStorage = async () => {
  try {
    // 1. Check GERAK records:
    const localGerak = localStorage.getItem(KEYS.GERAK);
    if (!localGerak) {
      // Attempt recovery from IndexedDB
      const idbGerak = await idbGet<GerakRecord[]>(KEYS.GERAK);
      if (idbGerak && Array.isArray(idbGerak) && idbGerak.length > 0) {
        safeLocalStorageSet(KEYS.GERAK, JSON.stringify(idbGerak));
        notifyStorageUpdated(KEYS.GERAK, idbGerak);
      } else {
        safeLocalStorageSet(KEYS.GERAK, JSON.stringify(INITIAL_GERAK_RECORDS));
        idbSet(KEYS.GERAK, INITIAL_GERAK_RECORDS).catch(() => {});
      }
    } else {
      // Sync from localStorage to IndexedDB backup
      try {
        const parsed = JSON.parse(localGerak);
        if (Array.isArray(parsed)) {
          idbSet(KEYS.GERAK, parsed).catch(() => {});
        }
      } catch {}
    }

    // 2. Check Action Plans (RTL):
    const localRtl = localStorage.getItem(KEYS.RTL);
    if (!localRtl) {
      const idbRtl = await idbGet<ActionPlanItem[]>(KEYS.RTL);
      if (idbRtl && Array.isArray(idbRtl) && idbRtl.length > 0) {
        safeLocalStorageSet(KEYS.RTL, JSON.stringify(idbRtl));
        notifyStorageUpdated(KEYS.RTL, idbRtl);
      } else {
        safeLocalStorageSet(KEYS.RTL, JSON.stringify(INITIAL_ACTION_PLANS));
        idbSet(KEYS.RTL, INITIAL_ACTION_PLANS).catch(() => {});
      }
    } else {
      try {
        const parsed = JSON.parse(localRtl);
        if (Array.isArray(parsed)) {
          idbSet(KEYS.RTL, parsed).catch(() => {});
        }
      } catch {}
    }

    // 3. Check School Progress:
    const localProg = localStorage.getItem(KEYS.SCHOOL_PROGRESS);
    if (!localProg) {
      const idbProg = await idbGet<SchoolProgressItem[]>(KEYS.SCHOOL_PROGRESS);
      if (idbProg && Array.isArray(idbProg) && idbProg.length > 0) {
        safeLocalStorageSet(KEYS.SCHOOL_PROGRESS, JSON.stringify(idbProg));
        notifyStorageUpdated(KEYS.SCHOOL_PROGRESS, idbProg);
      } else {
        safeLocalStorageSet(KEYS.SCHOOL_PROGRESS, JSON.stringify(INITIAL_SCHOOL_PROGRESS));
        idbSet(KEYS.SCHOOL_PROGRESS, INITIAL_SCHOOL_PROGRESS).catch(() => {});
      }
    } else {
      try {
        const parsed = JSON.parse(localProg);
        if (Array.isArray(parsed)) {
          idbSet(KEYS.SCHOOL_PROGRESS, parsed).catch(() => {});
        }
      } catch {}
    }

    // 4. Check Impact Data:
    if (!localStorage.getItem(KEYS.IMPACT)) {
      const idbImpact = await idbGet<ImpactData>(KEYS.IMPACT);
      if (idbImpact) {
        safeLocalStorageSet(KEYS.IMPACT, JSON.stringify(idbImpact));
      } else {
        safeLocalStorageSet(KEYS.IMPACT, JSON.stringify(INITIAL_IMPACT_DATA));
        idbSet(KEYS.IMPACT, INITIAL_IMPACT_DATA).catch(() => {});
      }
    }

    // 5. Check Doc Photos:
    const localPhotos = localStorage.getItem(KEYS.DOC_PHOTOS);
    if (!localPhotos) {
      const idbPhotos = await idbGet<DocPhoto[]>(KEYS.DOC_PHOTOS);
      if (idbPhotos && Array.isArray(idbPhotos) && idbPhotos.length > 0) {
        safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(idbPhotos));
        notifyStorageUpdated(KEYS.DOC_PHOTOS, idbPhotos);
      } else {
        safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(INITIAL_DOC_PHOTOS));
        idbSet(KEYS.DOC_PHOTOS, INITIAL_DOC_PHOTOS).catch(() => {});
        notifyStorageUpdated(KEYS.DOC_PHOTOS, INITIAL_DOC_PHOTOS);
      }
    } else {
      try {
        const parsed = JSON.parse(localPhotos);
        if (Array.isArray(parsed)) {
          const isLegacyDefaultOnly =
            parsed.length <= 2 &&
            parsed.every((p: any) => !p.teacherName || p.id === 'photo-default-1' || p.id === 'photo-default-2');
          if (isLegacyDefaultOnly) {
            safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(INITIAL_DOC_PHOTOS));
            idbSet(KEYS.DOC_PHOTOS, INITIAL_DOC_PHOTOS).catch(() => {});
            notifyStorageUpdated(KEYS.DOC_PHOTOS, INITIAL_DOC_PHOTOS);
          } else {
            idbSet(KEYS.DOC_PHOTOS, parsed).catch(() => {});
          }
        }
      } catch {}
    }

    // 6. Check Micro-Commitments (14 Hari):
    const localCommitments = localStorage.getItem(KEYS.MICRO_COMMITMENTS);
    if (!localCommitments) {
      const idbCommitments = await idbGet<MicroCommitment[]>(KEYS.MICRO_COMMITMENTS);
      if (idbCommitments && Array.isArray(idbCommitments) && idbCommitments.length > 0) {
        safeLocalStorageSet(KEYS.MICRO_COMMITMENTS, JSON.stringify(idbCommitments));
        notifyStorageUpdated(KEYS.MICRO_COMMITMENTS, idbCommitments);
      } else {
        safeLocalStorageSet(KEYS.MICRO_COMMITMENTS, JSON.stringify(INITIAL_MICRO_COMMITMENTS));
        idbSet(KEYS.MICRO_COMMITMENTS, INITIAL_MICRO_COMMITMENTS).catch(() => {});
      }
    } else {
      try {
        const parsed = JSON.parse(localCommitments);
        if (Array.isArray(parsed)) {
          idbSet(KEYS.MICRO_COMMITMENTS, parsed).catch(() => {});
        }
      } catch {}
    }

    // 7. Check Reflections (Instrumen Refleksi Guru & KS):
    const localReflections = localStorage.getItem(KEYS.REFLECTIONS);
    if (!localReflections) {
      const idbReflections = await idbGet<ReflectionReport[]>(KEYS.REFLECTIONS);
      if (idbReflections && Array.isArray(idbReflections) && idbReflections.length > 0) {
        safeLocalStorageSet(KEYS.REFLECTIONS, JSON.stringify(idbReflections));
        notifyStorageUpdated(KEYS.REFLECTIONS, idbReflections);
      }
    } else {
      try {
        const parsed = JSON.parse(localReflections);
        if (Array.isArray(parsed) && parsed.length > 0) {
          idbSet(KEYS.REFLECTIONS, parsed).catch(() => {});
        }
      } catch {}
    }

    // 8. Check Observed Problems:
    const localObserved = localStorage.getItem(KEYS.OBSERVED_PROBLEMS);
    if (!localObserved) {
      const idbObserved = await idbGet<number[]>(KEYS.OBSERVED_PROBLEMS);
      if (idbObserved && Array.isArray(idbObserved) && idbObserved.length > 0) {
        safeLocalStorageSet(KEYS.OBSERVED_PROBLEMS, JSON.stringify(idbObserved));
      } else {
        safeLocalStorageSet(KEYS.OBSERVED_PROBLEMS, JSON.stringify([1, 3, 6]));
        idbSet(KEYS.OBSERVED_PROBLEMS, [1, 3, 6]).catch(() => {});
      }
    } else {
      try {
        const parsed = JSON.parse(localObserved);
        if (Array.isArray(parsed)) {
          idbSet(KEYS.OBSERVED_PROBLEMS, parsed).catch(() => {});
        }
      } catch {}
    }

    // 9. Check Custom Questions:
    const localCustom = localStorage.getItem(KEYS.CUSTOM_QUESTIONS);
    if (!localCustom) {
      const idbCustom = await idbGet<any[]>(KEYS.CUSTOM_QUESTIONS);
      if (idbCustom && Array.isArray(idbCustom) && idbCustom.length > 0) {
        safeLocalStorageSet(KEYS.CUSTOM_QUESTIONS, JSON.stringify(idbCustom));
      }
    } else {
      try {
        const parsed = JSON.parse(localCustom);
        if (Array.isArray(parsed)) {
          idbSet(KEYS.CUSTOM_QUESTIONS, parsed).catch(() => {});
        }
      } catch {}
    }
  } catch (e) {
    console.error('Storage initialization failed', e);
  }
};

export const getMicroCommitments = (): MicroCommitment[] => {
  try {
    const data = localStorage.getItem(KEYS.MICRO_COMMITMENTS);
    if (!data) return INITIAL_MICRO_COMMITMENTS;
    const parsed: MicroCommitment[] = JSON.parse(data);
    return parsed;
  } catch (e) {
    console.error('Failed to read micro-commitments', e);
    return INITIAL_MICRO_COMMITMENTS;
  }
};

export const saveMicroCommitment = (item: MicroCommitment): MicroCommitment[] => {
  const current = getMicroCommitments();
  const exists = current.some((c) => c.id === item.id);
  const updated = exists
    ? current.map((c) => (c.id === item.id ? item : c))
    : [item, ...current];
  safeLocalStorageSet(KEYS.MICRO_COMMITMENTS, JSON.stringify(updated));
  idbSet(KEYS.MICRO_COMMITMENTS, updated).catch((err) => console.warn('[IDB] Failed to backup commitment', err));
  notifyStorageUpdated(KEYS.MICRO_COMMITMENTS, updated);
  return updated;
};

export const deleteMicroCommitment = (id: string): MicroCommitment[] => {
  const current = getMicroCommitments();
  const updated = current.filter((c) => c.id !== id);
  safeLocalStorageSet(KEYS.MICRO_COMMITMENTS, JSON.stringify(updated));
  idbSet(KEYS.MICRO_COMMITMENTS, updated).catch((err) => console.warn('[IDB] Failed to update commitment', err));
  notifyStorageUpdated(KEYS.MICRO_COMMITMENTS, updated);
  return updated;
};

export const toggleCommitmentDay = (id: string, day: number): MicroCommitment[] => {
  const current = getMicroCommitments();
  const updated = current.map((c) => {
    if (c.id !== id) return c;
    const newProgress = { ...c.daysProgress, [day]: !c.daysProgress[day] };
    const completedDays = Object.values(newProgress).filter(Boolean).length;
    let newStatus = c.status;
    if (completedDays === 14) {
      newStatus = 'Tuntas Berdampak';
    } else if (completedDays >= 7 && c.status === 'Aktif Berjalan') {
      newStatus = 'Review Hari Ke-7';
    } else if (completedDays < 7 && c.status === 'Review Hari Ke-7') {
      newStatus = 'Aktif Berjalan';
    }
    return {
      ...c,
      daysProgress: newProgress,
      status: newStatus,
    };
  });
  safeLocalStorageSet(KEYS.MICRO_COMMITMENTS, JSON.stringify(updated));
  idbSet(KEYS.MICRO_COMMITMENTS, updated).catch((err) => console.warn('[IDB] Failed to update commitment day', err));
  notifyStorageUpdated(KEYS.MICRO_COMMITMENTS, updated);
  return updated;
};

export const getCustomQuestions = (): LabQuestion[] => {
  try {
    const data = localStorage.getItem(KEYS.CUSTOM_QUESTIONS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read custom questions', e);
    return [];
  }
};

export const saveCustomQuestion = (item: LabQuestion): LabQuestion[] => {
  const current = getCustomQuestions();
  const exists = current.some((q) => q.id === item.id);
  const updated = exists
    ? current.map((q) => (q.id === item.id ? item : q))
    : [item, ...current];
  safeLocalStorageSet(KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
  idbSet(KEYS.CUSTOM_QUESTIONS, updated).catch((err) => console.warn('[IDB] Failed to backup custom question', err));
  notifyStorageUpdated(KEYS.CUSTOM_QUESTIONS, updated);
  return updated;
};

export const deleteCustomQuestion = (id: string): LabQuestion[] => {
  const current = getCustomQuestions();
  const updated = current.filter((q) => q.id !== id);
  safeLocalStorageSet(KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
  idbSet(KEYS.CUSTOM_QUESTIONS, updated).catch((err) => console.warn('[IDB] Failed to update custom question', err));
  notifyStorageUpdated(KEYS.CUSTOM_QUESTIONS, updated);
  return updated;
};

export const resetAllData = () => {
  localStorage.removeItem(KEYS.GERAK);
  localStorage.removeItem(KEYS.RTL);
  localStorage.removeItem(KEYS.REFLECTIONS);
  localStorage.removeItem(KEYS.IMPACT);
  localStorage.removeItem(KEYS.OBSERVED_PROBLEMS);
  localStorage.removeItem(KEYS.SCHOOL_PROGRESS);
  localStorage.removeItem(KEYS.DOC_PHOTOS);
  localStorage.removeItem(KEYS.MICRO_COMMITMENTS);
  localStorage.removeItem(KEYS.CUSTOM_QUESTIONS);

  safeLocalStorageSet(KEYS.GERAK, JSON.stringify(INITIAL_GERAK_RECORDS));
  safeLocalStorageSet(KEYS.RTL, JSON.stringify(INITIAL_ACTION_PLANS));
  safeLocalStorageSet(KEYS.IMPACT, JSON.stringify(INITIAL_IMPACT_DATA));
  safeLocalStorageSet(KEYS.SCHOOL_PROGRESS, JSON.stringify(INITIAL_SCHOOL_PROGRESS));
  safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(INITIAL_DOC_PHOTOS));
  safeLocalStorageSet(KEYS.MICRO_COMMITMENTS, JSON.stringify(INITIAL_MICRO_COMMITMENTS));

  idbSet(KEYS.GERAK, INITIAL_GERAK_RECORDS).catch(() => {});
  idbSet(KEYS.RTL, INITIAL_ACTION_PLANS).catch(() => {});
  idbSet(KEYS.IMPACT, INITIAL_IMPACT_DATA).catch(() => {});
  idbSet(KEYS.SCHOOL_PROGRESS, INITIAL_SCHOOL_PROGRESS).catch(() => {});
  idbSet(KEYS.DOC_PHOTOS, INITIAL_DOC_PHOTOS).catch(() => {});
  idbSet(KEYS.MICRO_COMMITMENTS, INITIAL_MICRO_COMMITMENTS).catch(() => {});

  notifyStorageUpdated('ALL');
};

/**
 * Generates a full JSON backup file containing all application data
 */
export const exportAllDataJson = (): string => {
  const backup: BackupPackage = {
    version: '2.0.0',
    appName: 'GERAK BERDAMPAK: Temu Nalar Literasi-Numerasi',
    exportedAt: new Date().toISOString(),
    supervisorName: 'Heriansyah., S.Si., S.Pd., M.Pd',
    district: 'Kecamatan Tellu Limpoe, Kabupaten Sidenreng Rappang',
    data: {
      schools: getSchoolProgress(),
      actionPlans: getActionPlans(),
      reflections: getReflections(),
      gerakRecords: getGerakRecords(),
      docPhotos: getDocPhotos(),
      observedProblems: getObservedProblems(),
      impactData: getImpactData(),
      microCommitments: getMicroCommitments(),
    },
  };
  return JSON.stringify(backup, null, 2);
};

/**
 * Imports a JSON backup file and restores application data
 */
export const importAllDataJson = (
  jsonString: string
): { success: boolean; message: string; count: number } => {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, message: 'Format berkas tidak valid.', count: 0 };
    }

    const payload = parsed.data || parsed;

    let restoredCount = 0;

    if (Array.isArray(payload.schools) && payload.schools.length > 0) {
      safeLocalStorageSet(KEYS.SCHOOL_PROGRESS, JSON.stringify(payload.schools));
      idbSet(KEYS.SCHOOL_PROGRESS, payload.schools).catch(() => {});
      restoredCount += payload.schools.length;
    }
    if (Array.isArray(payload.actionPlans)) {
      safeLocalStorageSet(KEYS.RTL, JSON.stringify(payload.actionPlans));
      idbSet(KEYS.RTL, payload.actionPlans).catch(() => {});
      restoredCount += payload.actionPlans.length;
    }
    if (Array.isArray(payload.reflections)) {
      safeLocalStorageSet(KEYS.REFLECTIONS, JSON.stringify(payload.reflections));
      idbSet(KEYS.REFLECTIONS, payload.reflections).catch(() => {});
    }
    if (Array.isArray(payload.gerakRecords)) {
      safeLocalStorageSet(KEYS.GERAK, JSON.stringify(payload.gerakRecords));
      idbSet(KEYS.GERAK, payload.gerakRecords).catch(() => {});
    }
    if (Array.isArray(payload.docPhotos)) {
      safeLocalStorageSet(KEYS.DOC_PHOTOS, JSON.stringify(payload.docPhotos));
      idbSet(KEYS.DOC_PHOTOS, payload.docPhotos).catch(() => {});
    }
    if (Array.isArray(payload.observedProblems)) {
      safeLocalStorageSet(KEYS.OBSERVED_PROBLEMS, JSON.stringify(payload.observedProblems));
      idbSet(KEYS.OBSERVED_PROBLEMS, payload.observedProblems).catch(() => {});
    }
    if (payload.impactData && typeof payload.impactData === 'object') {
      safeLocalStorageSet(KEYS.IMPACT, JSON.stringify(payload.impactData));
      idbSet(KEYS.IMPACT, payload.impactData).catch(() => {});
    }
    if (Array.isArray(payload.microCommitments)) {
      safeLocalStorageSet(KEYS.MICRO_COMMITMENTS, JSON.stringify(payload.microCommitments));
      idbSet(KEYS.MICRO_COMMITMENTS, payload.microCommitments).catch(() => {});
    }

    notifyStorageUpdated('ALL');

    return {
      success: true,
      message: `Berhasil memulihkan ${restoredCount} catatan sekolah & data supervisi.`,
      count: restoredCount,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kesalahan parsing JSON.';
    return { success: false, message: msg, count: 0 };
  }
};

/**
 * Exports all schools evaluation progress into an Excel-ready CSV file with UTF-8 BOM
 */
export const exportSchoolProgressCsv = (schoolsList?: SchoolProgressItem[]): string => {
  const list = schoolsList && schoolsList.length > 0 ? schoolsList : getSchoolProgress();
  const headers = [
    'No',
    'Nama Sekolah',
    'Jenjang',
    'Sasaran Kelas',
    'Jumlah Siswa',
    'Guru Dampingan',
    'Pengawas Pembina',
    'Tanggal Baseline',
    'Tanggal Evaluasi',
    'Pre Membaca Teks (%)',
    'Post Membaca Teks (%)',
    'Pre Memilah Info (%)',
    'Post Memilah Info (%)',
    'Pre Operasi Model (%)',
    'Post Operasi Model (%)',
    'Pre Nalar Argumen (%)',
    'Post Nalar Argumen (%)',
    'Rata-rata Pre (%)',
    'Rata-rata Post (%)',
    'Kenaikan (Delta %)',
    'Indeks N-Gain (g)',
    'Kategori N-Gain',
    'Strategi Unggulan Digunakan',
    'Praktik Guru Sebelum',
    'Praktik Guru Sesudah',
    'Catatan Pengawas',
  ];

  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = list.map((s, idx) => {
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
    const delta = avgPost - avgPre;
    const gain = calculateNGain(avgPre, avgPost);

    return [
      idx + 1,
      escapeCsv(s.schoolName),
      escapeCsv(s.level),
      escapeCsv(s.targetClass),
      s.totalStudents,
      escapeCsv(s.teacherName),
      escapeCsv(s.supervisorName),
      escapeCsv(s.baselineDate),
      escapeCsv(s.evaluationDate),
      s.indicators.understandingText.beforePct,
      s.indicators.understandingText.afterPct,
      s.indicators.informationFiltering.beforePct,
      s.indicators.informationFiltering.afterPct,
      s.indicators.operationModeling.beforePct,
      s.indicators.operationModeling.afterPct,
      s.indicators.reasoningCommunication.beforePct,
      s.indicators.reasoningCommunication.afterPct,
      avgPre,
      avgPost,
      delta,
      gain.score,
      escapeCsv(gain.category),
      escapeCsv(s.teacherShift.keyStrategyUsed),
      escapeCsv(s.teacherShift.beforePractice),
      escapeCsv(s.teacherShift.afterPractice),
      escapeCsv(s.notes || '-'),
    ].join(',');
  });

  // UTF-8 BOM prefix for Excel Indonesian / Windows compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const nowStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Rekap_Supervisi_GERAK_BERDAMPAK_Tellu_Limpoe_${nowStr}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
};

