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

const KEYS = {
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

export const INITIAL_DOC_PHOTOS: DocPhoto[] = [
  {
    id: 'photo-default-1',
    schoolName: 'ALL',
    title: 'Pendampingan Temu Nalar & Dialog Kelas',
    caption: 'Pengawas pembina mendampingi guru dan siswa membedah teks soal cerita numerasi di kelas dampingan.',
    date: 'Agustus 2026',
    dataUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'photo-default-2',
    schoolName: 'ALL',
    title: 'Refleksi Bersama Guru & Tindak Lanjut Kombel',
    caption: 'Diskusi umpan balik konstruktif dan penyepakatan strategi pembelajaran berbasis bukti nyata.',
    date: 'September 2026',
    dataUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
  },
];

export const getGerakRecords = (): GerakRecord[] => {
  try {
    const data = localStorage.getItem(KEYS.GERAK);
    if (!data) return INITIAL_GERAK_RECORDS;
    const parsed: GerakRecord[] = JSON.parse(data);
    if (parsed.some((r) => r.schoolName.includes('SDN 2 Tellu Limpoe') || r.schoolName.includes('SDN 1 Tellu Limpoe'))) {
      localStorage.setItem(KEYS.GERAK, JSON.stringify(INITIAL_GERAK_RECORDS));
      return INITIAL_GERAK_RECORDS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read GERAK records', e);
    return INITIAL_GERAK_RECORDS;
  }
};

export const saveGerakRecord = (record: GerakRecord): GerakRecord[] => {
  const current = getGerakRecords();
  const updated = [record, ...current.filter((r) => r.id !== record.id)];
  localStorage.setItem(KEYS.GERAK, JSON.stringify(updated));
  return updated;
};

export const deleteGerakRecord = (id: string): GerakRecord[] => {
  const current = getGerakRecords();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(KEYS.GERAK, JSON.stringify(updated));
  return updated;
};

export const getActionPlans = (): ActionPlanItem[] => {
  try {
    const data = localStorage.getItem(KEYS.RTL);
    if (!data) return INITIAL_ACTION_PLANS;
    const parsed: ActionPlanItem[] = JSON.parse(data);
    if (parsed.some((p) => p.schoolName.includes('SDN 1 Tellu Limpoe') || p.schoolName.includes('SMPN 1 Tellu Limpoe'))) {
      localStorage.setItem(KEYS.RTL, JSON.stringify(INITIAL_ACTION_PLANS));
      return INITIAL_ACTION_PLANS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read action plans', e);
    return INITIAL_ACTION_PLANS;
  }
};

export const saveActionPlan = (plan: ActionPlanItem): ActionPlanItem[] => {
  const current = getActionPlans();
  const updated = [plan, ...current.filter((p) => p.id !== plan.id)];
  localStorage.setItem(KEYS.RTL, JSON.stringify(updated));
  return updated;
};

export const deleteActionPlan = (id: string): ActionPlanItem[] => {
  const current = getActionPlans();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(KEYS.RTL, JSON.stringify(updated));
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
  localStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(updated));
  return updated;
};

export const deleteReflection = (id: string): ReflectionReport[] => {
  const current = getReflections();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(updated));
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
  localStorage.setItem(KEYS.IMPACT, JSON.stringify(data));
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
  localStorage.setItem(KEYS.OBSERVED_PROBLEMS, JSON.stringify(updated));
  return updated;
};

export const getSchoolProgress = (): SchoolProgressItem[] => {
  try {
    const data = localStorage.getItem(KEYS.SCHOOL_PROGRESS);
    if (!data) return INITIAL_SCHOOL_PROGRESS;
    const parsed: SchoolProgressItem[] = JSON.parse(data);
    if (parsed.some((s) => s.schoolName.includes('SDN 1 Tellu Limpoe') || s.schoolName.includes('SDN 3 Tellu Limpoe'))) {
      localStorage.setItem(KEYS.SCHOOL_PROGRESS, JSON.stringify(INITIAL_SCHOOL_PROGRESS));
      return INITIAL_SCHOOL_PROGRESS;
    }
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
  localStorage.setItem(KEYS.SCHOOL_PROGRESS, JSON.stringify(updated));
  return updated;
};

export const deleteSchoolProgress = (id: string): SchoolProgressItem[] => {
  const current = getSchoolProgress();
  const updated = current.filter((s) => s.id !== id);
  localStorage.setItem(KEYS.SCHOOL_PROGRESS, JSON.stringify(updated));
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
    return data ? JSON.parse(data) : INITIAL_DOC_PHOTOS;
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
  localStorage.setItem(KEYS.DOC_PHOTOS, JSON.stringify(updated));
  return updated;
};

export const deleteDocPhoto = (id: string): DocPhoto[] => {
  const current = getDocPhotos();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(KEYS.DOC_PHOTOS, JSON.stringify(updated));
  return updated;
};

export const initializeStorage = () => {
  try {
    if (!localStorage.getItem(KEYS.GERAK)) {
      localStorage.setItem(KEYS.GERAK, JSON.stringify(INITIAL_GERAK_RECORDS));
    }
    if (!localStorage.getItem(KEYS.RTL)) {
      localStorage.setItem(KEYS.RTL, JSON.stringify(INITIAL_ACTION_PLANS));
    }
    if (!localStorage.getItem(KEYS.IMPACT)) {
      localStorage.setItem(KEYS.IMPACT, JSON.stringify(INITIAL_IMPACT_DATA));
    }
    if (!localStorage.getItem(KEYS.SCHOOL_PROGRESS)) {
      localStorage.setItem(KEYS.SCHOOL_PROGRESS, JSON.stringify(INITIAL_SCHOOL_PROGRESS));
    }
    if (!localStorage.getItem(KEYS.DOC_PHOTOS)) {
      localStorage.setItem(KEYS.DOC_PHOTOS, JSON.stringify(INITIAL_DOC_PHOTOS));
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
  localStorage.setItem(KEYS.MICRO_COMMITMENTS, JSON.stringify(updated));
  return updated;
};

export const deleteMicroCommitment = (id: string): MicroCommitment[] => {
  const current = getMicroCommitments();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem(KEYS.MICRO_COMMITMENTS, JSON.stringify(updated));
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
  localStorage.setItem(KEYS.MICRO_COMMITMENTS, JSON.stringify(updated));
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
  localStorage.setItem(KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
  return updated;
};

export const deleteCustomQuestion = (id: string): LabQuestion[] => {
  const current = getCustomQuestions();
  const updated = current.filter((q) => q.id !== id);
  localStorage.setItem(KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
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
  localStorage.setItem(KEYS.GERAK, JSON.stringify(INITIAL_GERAK_RECORDS));
  localStorage.setItem(KEYS.RTL, JSON.stringify(INITIAL_ACTION_PLANS));
  localStorage.setItem(KEYS.IMPACT, JSON.stringify(INITIAL_IMPACT_DATA));
  localStorage.setItem(KEYS.SCHOOL_PROGRESS, JSON.stringify(INITIAL_SCHOOL_PROGRESS));
  localStorage.setItem(KEYS.DOC_PHOTOS, JSON.stringify(INITIAL_DOC_PHOTOS));
  localStorage.setItem(KEYS.MICRO_COMMITMENTS, JSON.stringify(INITIAL_MICRO_COMMITMENTS));
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
      localStorage.setItem(KEYS.SCHOOL_PROGRESS, JSON.stringify(payload.schools));
      restoredCount += payload.schools.length;
    }
    if (Array.isArray(payload.actionPlans)) {
      localStorage.setItem(KEYS.RTL, JSON.stringify(payload.actionPlans));
      restoredCount += payload.actionPlans.length;
    }
    if (Array.isArray(payload.reflections)) {
      localStorage.setItem(KEYS.REFLECTIONS, JSON.stringify(payload.reflections));
    }
    if (Array.isArray(payload.gerakRecords)) {
      localStorage.setItem(KEYS.GERAK, JSON.stringify(payload.gerakRecords));
    }
    if (Array.isArray(payload.docPhotos)) {
      localStorage.setItem(KEYS.DOC_PHOTOS, JSON.stringify(payload.docPhotos));
    }
    if (Array.isArray(payload.observedProblems)) {
      localStorage.setItem(KEYS.OBSERVED_PROBLEMS, JSON.stringify(payload.observedProblems));
    }
    if (payload.impactData && typeof payload.impactData === 'object') {
      localStorage.setItem(KEYS.IMPACT, JSON.stringify(payload.impactData));
    }
    if (Array.isArray(payload.microCommitments)) {
      localStorage.setItem(KEYS.MICRO_COMMITMENTS, JSON.stringify(payload.microCommitments));
    }

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

