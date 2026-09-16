export type NavTab =
  | 'beranda'
  | 'akar-masalah'
  | 'alur-gerak'
  | 'siklus-berdampak'
  | 'laboratorium-soal'
  | 'strategi-pembelajaran'
  | 'instrumen-refleksi'
  | 'rencana-tindak-lanjut'
  | 'dashboard-dampak';

export interface RootProblemItem {
  id: number;
  title: string;
  summary: string;
  explanation: string;
  studentBehavior: string;
  literacyImpact: string;
  numeracyImpact: string;
  reflectionQuestion: string;
  practicalTip: string;
}

export interface ProblemFlowStep {
  id: number;
  step: string;
  subtitle: string;
  whatStudentShouldDo: string;
  commonMistakes: string;
  teacherGuidingQuestions: string[];
  simpleActionExample: string;
}

export interface GerakStage {
  letter: 'G' | 'E' | 'R' | 'A' | 'K';
  title: string;
  description: string;
  evidenceExamples: string[];
  guidingQuestions: string[];
  keyActions: string[];
}

export interface GerakRecord {
  id: string;
  timestamp: string;
  schoolName: string;
  level: 'SD' | 'SMP';
  teacherName: string;
  learningProblem: string;
  evidenceFound: string;
  actionPlan: string;
  supervisorNotes?: string;
}

export interface BerdampakStage {
  letter: 'B' | 'E' | 'R' | 'D' | 'A' | 'M' | 'P' | 'A' | 'K';
  stepNumber: number;
  title: string;
  description: string;
  activityFocus: string;
  exampleAction: string;
  evidenceCollected: string;
  successIndicator: string;
  badgeColor: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  diagnosticCategory: 'pemahaman-soal' | 'pemilihan-operasi' | 'hitung-teknis' | 'tepat';
}

export interface QuestionSteppedReveal {
  diketahui: string[];
  ditanyakan: string;
  informasiPenting: string[];
  operasiHitung: {
    steps: string[];
    result: string;
  };
  jawabanAkhir: string;
  penjelasanNalar: string;
}

export interface LabQuestion {
  id: string;
  level: 'SD' | 'SMP';
  topic: string;
  story: string;
  contextTag: string;
  options: QuestionOption[];
  reveals: QuestionSteppedReveal;
  teacherDiagnosticNotes: string;
}

export interface TeachingStrategy {
  id: number;
  number: number;
  title: string;
  tagline: string;
  goal: string;
  implementationSteps: string[];
  teacherScriptExample: string;
  studentResponseExample: string;
  successIndicators: string[];
  recommendedLevels: ('SD' | 'SMP')[];
}

export type ReflectionTargetRole = 'guru' | 'kepala_sekolah';

export interface ReflectionQuestion {
  id: number;
  statement: string;
  aspect: string;
  targetRole?: ReflectionTargetRole;
}

export interface ReflectionAnswer {
  questionId: number;
  score: number; // 4: Sangat Sering, 3: Sering, 2: Kadang-kadang, 1: Belum Dilakukan
}

export interface ReflectionReport {
  id: string;
  date: string;
  role?: ReflectionTargetRole; // 'guru' | 'kepala_sekolah' (default 'guru')
  teacherName: string; // nama guru atau nama kepala sekolah
  principalName?: string;
  schoolName: string;
  level: 'SD' | 'SMP';
  subject: string; // misal 'Matematika / Tematik' untuk Guru atau 'Kepemimpinan Pembelajaran' untuk KS
  totalScore: number;
  maxScore: number;
  percentage: number;
  category: 'Mandiri Berkelanjutan' | 'Berkembang Baik' | 'Perlu Pembiasaan' | 'Tahap Awal';
  strengths: string[];
  areasToImprove: string[];
  actionRecommendations: string[];
  answers: ReflectionAnswer[];
}

export interface ActionPlanItem {
  id: string;
  createdAt: string;
  schoolName: string;
  teacherName: string;
  level: 'SD' | 'SMP';
  mainProblem: string;
  improvementGoal: string;
  selectedStrategy: string;
  executionTime: string;
  successEvidence: string;
  followUp: string;
  status: 'Direncanakan' | 'Sedang Berjalan' | 'Tercapai';
}

export interface ImpactData {
  schoolCount: number;
  reflectionTeacherCount: number;
  actionPlanCount: number;
  strategyImplementedCount: number;
  // Comparative fields
  sampleClass: string;
  totalStudents: number;
  beforeCount: number;
  afterCount: number;
  skillName: string;
  // Specific metrics
  understandInfoPct: number;
  chooseOperationPct: number;
  explainAnswerPct: number;
  lastUpdated: string;
}

export interface SchoolProgressIndicators {
  understandingText: { beforePct: number; afterPct: number };
  informationFiltering: { beforePct: number; afterPct: number };
  operationModeling: { beforePct: number; afterPct: number };
  reasoningCommunication: { beforePct: number; afterPct: number };
}

export interface SchoolProgressItem {
  id: string;
  schoolName: string;
  level: 'SD' | 'SMP';
  targetClass: string;
  totalStudents: number;
  teacherName: string;
  supervisorName: string;
  baselineDate: string;
  evaluationDate: string;
  indicators: SchoolProgressIndicators;
  teacherShift: {
    beforePractice: string;
    afterPractice: string;
    keyStrategyUsed: string;
  };
  notes?: string;
}

export interface OfficialSchoolItem {
  no: number;
  name: string;
  level: 'SD' | 'SMP';
  type: string;
}

export interface DocPhoto {
  id: string;
  schoolName: string; // school name or 'ALL'
  title: string;
  caption: string;
  date: string;
  dataUrl: string; // base64 data url
}

export interface MicroCommitment {
  id: string;
  createdAt: string;
  startDate: string;
  targetEndDate: string; // 14 hari
  schoolName: string;
  level: 'SD' | 'SMP';
  teacherName: string;
  className: string;
  subject: string;
  targetObstacle: 'Linguistik (Pemahaman Teks)' | 'Transformasi Skematis (Model)' | 'Komputasi Teknis' | 'Kombinasi Nalar';
  strategyTitle: string;
  commitmentText: string;
  observableSuccessIndicator: string;
  supervisorNudge?: {
    day3Check: boolean;
    day7Check: boolean;
    day14Check: boolean;
    notes?: string;
  };
  daysProgress: { [day: number]: boolean }; // 1 s.d. 14
  status: 'Aktif Berjalan' | 'Review Hari Ke-7' | 'Tuntas Berdampak' | 'Perlu Penyesuaian';
  teacherReflectionNote?: string;
  supervisorFeedback?: string;
}

export interface BackupPackage {
  version: string;
  appName: string;
  exportedAt: string;
  supervisorName: string;
  district: string;
  data: {
    schools: SchoolProgressItem[];
    actionPlans: ActionPlanItem[];
    reflections: ReflectionReport[];
    gerakRecords: GerakRecord[];
    docPhotos: DocPhoto[];
    observedProblems: number[];
    impactData: ImpactData;
    microCommitments?: MicroCommitment[];
  };
}

