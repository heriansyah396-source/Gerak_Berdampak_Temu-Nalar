import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Wheat,
  Wind,
  Egg,
  Store,
  CheckCircle2,
  HelpCircle,
  PlusCircle,
  Printer,
  Copy,
  Eye,
  Share2,
  Trash2,
  RotateCcw,
  Layers,
  Award,
  ChevronRight,
  Info,
  Calculator,
  MessageCircle,
  ArrowRight,
  FileDown,
} from 'lucide-react';
import { LabQuestion, QuestionOption } from '../types';
import { saveCustomQuestion, getCustomQuestions, deleteCustomQuestion } from '../utils/storage';

interface LocalContextPreset {
  id: string;
  theme: 'Padi & Kilang Beras' | 'PLTB Sidrap (Kincir Angin)' | 'Peternakan Itik & Telur Asin' | 'Pasar Tradisional Amparita';
  icon: React.ComponentType<{ className?: string }>;
  level: 'SD' | 'SMP';
  topic: string;
  contextTag: string;
  story: string;
  reveals: {
    diketahui: string[];
    ditanyakan: string;
    informasiPenting: string[];
    operasiHitung: {
      steps: string[];
      result: string;
    };
    jawabanAkhir: string;
    penjelasanNalar: string;
  };
  options: {
    text: string;
    isCorrect: boolean;
    diagnosticCategory: 'pemahaman-soal' | 'pemilihan-operasi' | 'hitung-teknis' | 'tepat';
    explanation: string;
    teacherCoachingPrompt: string;
  }[];
  teacherDiagnosticNotes: string;
}

export const LOCAL_PRESETS_TELLU_LIMPOE: LocalContextPreset[] = [
  {
    id: 'preset-padi-sd',
    theme: 'Padi & Kilang Beras',
    icon: Wheat,
    level: 'SD',
    topic: 'Panen Padi & Penggilingan Gabah Pak Rustam (Tellu Limpoe)',
    contextTag: 'Sektor Pertanian & Kilang Padi Amparita',
    story:
      'Pak Rustam di Desa Baula, Kecamatan Tellu Limpoe, memanen 1.200 kg gabah kering panen dari sawahnya. Setelah dibawa ke kilang padi di Amparita untuk digiling, bobot gabah mengalami penyusutan sebesar 30% menjadi beras putih bersih siap konsumsi. Beras tersebut kemudian dimasukkan sama rata ke dalam karung berukuran 20 kg.\n\nBerapa banyak karung beras yang berhasil diisi oleh Pak Rustam?',
    reveals: {
      diketahui: [
        'Total panen gabah awal: 1.200 kg',
        'Penyusutan saat penggilingan menjadi beras: 30%',
        'Persentase beras yang dihasilkan: 100% − 30% = 70%',
        'Kapasitas setiap karung beras: 20 kg',
      ],
      ditanyakan: 'Berapa banyak karung beras yang berhasil diisi sama rata oleh Pak Rustam?',
      informasiPenting: [
        'Ada 2 langkah penalaran: Pertama mencari total berat beras bersih setelah susut giling, Kedua membagi berat beras ke dalam karung 20 kg.',
        'Hati-hati: Angka 30% adalah penyusutan (kulit gabah/sekam), bukan persentase beras yang didapat.',
        'Beras yang dihasilkan = 70% × 1.200 kg = 840 kg.',
      ],
      operasiHitung: {
        steps: [
          'Langkah 1: Menghitung persentase beras bersih = 100% − 30% = 70% (atau 0,7)',
          'Langkah 2: Menghitung berat beras bersih = 0,7 × 1.200 kg = 840 kg',
          'Langkah 3: Menghitung jumlah karung = 840 kg ÷ 20 kg/karung = 42 karung',
        ],
        result: '42 Karung Beras',
      },
      jawabanAkhir:
        'Pak Rustam berhasil mengisi 42 karung beras bersih berukuran masing-masing 20 kg.',
      penjelasanNalar:
        'Siswa perlu memahami alur nyata pertanian Sidrap: gabah tidak langsung masuk karung beras 20 kg, melainkan harus dikurangi bobot sekam giling terlebih dahulu.',
    },
    options: [
      {
        text: '18 Karung',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Angka 18 karung diperoleh jika membagi bobot sekam yang hilang (360 kg ÷ 20 kg). Perhatikan kembali: yang dimasukkan ke dalam karung adalah beras bersihnya, bukan sekam yang terbuang.',
        teacherCoachingPrompt:
          'Guru memantik: "Ananda, angka 360 kg itu beras yang bisa dimakan atau kulit sekam yang dibuang saat digiling? Yang ingin dimasukkan Pak Rustam ke karung yang mana?"',
      },
      {
        text: '60 Karung',
        isCorrect: false,
        diagnosticCategory: 'pemilihan-operasi',
        explanation:
          'Belum tepat. Kamu langsung membagi 1.200 kg ÷ 20 kg tanpa memperhitungkan penyusutan giling 30%. Ingat, gabah padi memiliki kulit sekam yang terbuang saat digiling!',
        teacherCoachingPrompt:
          'Guru memantik: "Coba bayangkan saat ayahmu membawa gabah ke kilang padi, apakah berat beras yang keluar sama persis dengan berat gabah basah yang dibawa?"',
      },
      {
        text: '42 Karung',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Luar biasa! Penalarannya sangat utuh: menghitung sisa beras bersih (70% × 1.200 = 840 kg), lalu membaginya ke dalam karung 20 kg (840 ÷ 20 = 42 karung). Tepat sekali!',
        teacherCoachingPrompt:
          'Guru memantik: "Hebat! Coba jelaskan kepada teman kelompokmu mengapa kamu memilih mengalikan 70% terlebih dahulu sebelum membagi 20."',
      },
      {
        text: '36 Karung',
        isCorrect: false,
        diagnosticCategory: 'hitung-teknis',
        explanation:
          'Belum tepat. Terjadi kekeliruan saat membagi atau mengalikan persentase. Periksa kembali: 70% dari 1.200 adalah 840, lalu 840 ÷ 20 menghasilkan 42.',
        teacherCoachingPrompt:
          'Guru memantik: "Cara berpikirmu sudah benar mencari beras bersih. Coba periksa kembali cakaran pembagian 840 dibagi 20 ya."',
      },
    ],
    teacherDiagnosticNotes:
      'Fokus diagnosis: Menguji apakah siswa memahami konsep penyusutan persentase dalam konteks riil lumbung pangan Tellu Limpoe sebelum melakukan operasi pembagian kelompok.',
  },
  {
    id: 'preset-pltb-sd',
    theme: 'PLTB Sidrap (Kincir Angin)',
    icon: Wind,
    level: 'SD',
    topic: 'Putaran Kincir Raksasa PLTB Sidrap (Mattirotasi)',
    contextTag: 'Ikon Energi Bersih Tellu Limpoe - Sidrap',
    story:
      'Di perbukitan Desa Mattirotasi, Kecamatan Tellu Limpoe, terdapat 30 kincir angin raksasa PLTB Sidrap. Saat angin bertiup stabil, satu bilah kincir berputar sebanyak 15 kali putaran setiap 1 menit.\n\nBerapa total putaran yang dihasilkan oleh bilah kincir tersebut jika berputar stabil selama 2 jam 30 menit?',
    reveals: {
      diketahui: [
        'Kecepatan putaran kincir: 15 putaran per 1 menit',
        'Durasi waktu berputar: 2 jam 30 menit',
        'Konversi satuan: 1 jam = 60 menit, sehingga 2 jam = 120 menit',
        'Total durasi dalam menit: 120 menit + 30 menit = 150 menit',
      ],
      ditanyakan: 'Berapa total putaran bilah kincir selama 2 jam 30 menit?',
      informasiPenting: [
        'Kecepatan putar diberikan dalam satuan menit, sedangkan durasi diberikan dalam jam dan menit.',
        'Siswa harus menyamakan satuan waktu menjadi menit terlebih dahulu sebelum dikalikan dengan kecepatan putar.',
        'Data 30 turbin adalah informasi konteks umum dan tidak perlu dimasukkan jika hanya menanyakan satu kincir.',
      ],
      operasiHitung: {
        steps: [
          'Langkah 1: Mengubah 2 jam 30 menit ke satuan menit = (2 × 60) + 30 = 150 menit',
          'Langkah 2: Menghitung total putaran = 150 menit × 15 putaran/menit = 2.250 putaran',
        ],
        result: '2.250 Putaran',
      },
      jawabanAkhir:
        'Bilah kincir angin PLTB Sidrap tersebut berputar sebanyak 2.250 kali putaran.',
      penjelasanNalar:
        'Siswa dilatih kejelian konversi waktu (jam ke menit) dan memilah informasi (tidak terjebak angka 30 turbin).',
    },
    options: [
      {
        text: '37,5 Putaran',
        isCorrect: false,
        diagnosticCategory: 'pemilihan-operasi',
        explanation:
          'Belum tepat. Kamu langsung mengalikan 15 dengan 2,5 jam tanpa mengubah satuan jam ke menit. Ingat, kincir berputar 15 kali setiap 1 menit, bukan setiap 1 jam!',
        teacherCoachingPrompt:
          'Guru memantik: "Dalam 1 jam ada berapa menit? Kalau 1 menit saja sudah berputar 15 kali, apakah mungkin dalam 2 jam hanya berputar 37 kali?"',
      },
      {
        text: '1.800 Putaran',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Angka 1.800 hanya menghitung durasi 2 jam (120 menit × 15), namun lupa menambahkan sisa waktu 30 menitnya.',
        teacherCoachingPrompt:
          'Guru memantik: "Coba baca ulang soalnya: ada 2 jam lebih 30 menit. Yang 30 menitnya sudah kamu hitung juga belum?"',
      },
      {
        text: '2.250 Putaran',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Sempurna! Kamu jeli menyetarakan satuan: 2 jam 30 menit = 150 menit, lalu mengalikan 150 × 15 = 2.250 putaran.',
        teacherCoachingPrompt:
          'Guru memantik: "Keren sekali! Bagaimana caramu tadi menyamakan jam menjadi menit?"',
      },
      {
        text: '67.500 Putaran',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Kamu mengalikan hasil 2.250 dengan 30 kincir. Perhatikan kalimat tanya: soal hanya menanyakan putaran satu bilah kincir tersebut, bukan seluruh 30 turbin.',
        teacherCoachingPrompt:
          'Guru memantik: "Coba stabilo kalimat tanyanya: apakah yang ditanyakan putaran 1 kincir atau seluruh 30 kincir di bukit?"',
      },
    ],
    teacherDiagnosticNotes:
      'Fokus diagnosis: Menilai kemampuan konversi satuan waktu majemuk dan ketelitian membaca subjek yang ditanyakan (1 turbin vs 30 turbin).',
  },
  {
    id: 'preset-telur-sd',
    theme: 'Peternakan Itik & Telur Asin',
    icon: Egg,
    level: 'SD',
    topic: 'Penyortiran Rak Telur Itik Tellu Limpoe (Amparita)',
    contextTag: 'Sentra Telur Asin Khas Tellu Limpoe',
    story:
      'Daeng Marewa beternak itik petelur di Tellu Limpoe. Hari ini kandangnya menghasilkan 750 butir telur itik segar. Saat disortir, ditemukan 30 butir telur mengalami retak rambut sehingga dipisahkan untuk dimasak sendiri. Telur yang utuh dan mulus dimasukkan sama rata ke dalam rak karton telur yang masing-masing berkapasitas tepat 30 butir.\n\nBerapa rak karton telur yang dibutuhkan Daeng Marewa untuk mengemas seluruh telur utuh tersebut?',
    reveals: {
      diketahui: [
        'Total telur yang dipanen: 750 butir',
        'Telur retak yang dipisahkan: 30 butir',
        'Telur utuh yang siap dikemas: 750 − 30 = 720 butir',
        'Kapasitas 1 rak karton telur: 30 butir',
      ],
      ditanyakan: 'Berapa rak karton telur yang dibutuhkan untuk mengemas telur utuh?',
      informasiPenting: [
        'Telur retak tidak boleh dimasukkan ke dalam rak karton penjualan.',
        'Lakukan pengurangan terlebih dahulu untuk mengetahui jumlah telur utuh.',
        'Bagi jumlah telur utuh dengan kapasitas per rak (30 butir).',
      ],
      operasiHitung: {
        steps: [
          'Langkah 1: Menghitung telur utuh = 750 butir − 30 butir = 720 butir',
          'Langkah 2: Menghitung jumlah rak karton = 720 butir ÷ 30 butir/rak = 24 rak',
        ],
        result: '24 Rak Karton',
      },
      jawabanAkhir:
        'Daeng Marewa membutuhkan 24 rak karton untuk mengemas seluruh telur itik utuh.',
      penjelasanNalar:
        'Membangun pemahaman bahwa kondisi riil perdagangan telur menuntut eliminasi barang cacat sebelum pembagian wadah.',
    },
    options: [
      {
        text: '25 Rak Karton',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Angka 25 didapat dari 750 ÷ 30. Kamu lupa menyisihkan 30 butir telur yang retak. Telur retak tidak boleh dikemas untuk dijual!',
        teacherCoachingPrompt:
          'Guru memantik: "Kalau kamu membeli telur di toko lalu ada yang retak, kamu mau beli tidak? Nah, 30 telur retak itu diapakan oleh Daeng Marewa di soal?"',
      },
      {
        text: '24 Rak Karton',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Tepat sekali! Kamu cermat menyisihkan telur retak terlebih dahulu (750 − 30 = 720 butir), lalu membaginya ke dalam rak isi 30 butir (720 ÷ 30 = 24 rak). Hebat!',
        teacherCoachingPrompt:
          'Guru memantik: "Pilihan yang sangat tepat. Coba perlihatkan ke temanmu kalimat mana yang menunjukkan telur retak harus dipisahkan."',
      },
      {
        text: '21 Rak Karton',
        isCorrect: false,
        diagnosticCategory: 'hitung-teknis',
        explanation:
          'Belum tepat. Terjadi kesalahan saat membagi 720 dengan 30. Cobalah membuat coretan pembagian bersusun (porogapit) dengan teliti.',
        teacherCoachingPrompt:
          'Guru memantik: "Langkahmu sudah benar mengurangkan 750 − 30 = 720. Sekarang coba hitung kembali 720 dibagi 30 pelan-pelan ya."',
      },
      {
        text: '72 Rak Karton',
        isCorrect: false,
        diagnosticCategory: 'pemilihan-operasi',
        explanation:
          'Belum tepat. Angka 72 didapat jika kamu hanya mencoret angka 0 dari 720 tanpa membaginya dengan angka 3.',
        teacherCoachingPrompt:
          'Guru memantik: "Saat mencoret nol di 720 dan 30, angkanya menjadi 72 dan 3. Apakah 72 sudah dibagi 3?"',
      },
    ],
    teacherDiagnosticNotes:
      'Fokus diagnosis: Mengidentifikasi apakah siswa membaca detail kondisi "penyortiran/barang rusak" atau langsung melakukan operasi pembagian mekanis.',
  },
  {
    id: 'preset-palekko-smp',
    theme: 'Pasar Tradisional Amparita',
    icon: Store,
    level: 'SMP',
    topic: 'Kalkulasi Usaha Kuliner Nasu Palekko Amparita',
    contextTag: 'Ekonomi Kerakyatan & Kuliner Khas Sidrap',
    story:
      'Ibu Hajjah Maryam mengelola warung kuliner tradisional Nasu Palekko di dekat Pasar Sentral Amparita, Tellu Limpoe. Setiap hari ia mengeluarkan biaya tetap sebesar Rp150.000 untuk gas dan bumbu rempah khas, serta biaya variabel sebesar Rp35.000 untuk daging itik per porsi. Hari ini ia berhasil memasak dan menjual 25 porsi Nasu Palekko dengan harga jual Rp50.000 per porsi.\n\nBerapa keuntungan bersih yang diperoleh Ibu Hajjah Maryam hari ini?',
    reveals: {
      diketahui: [
        'Biaya tetap harian (bumbu & gas): Rp150.000',
        'Biaya variabel per porsi: Rp35.000',
        'Jumlah porsi terjual: 25 porsi',
        'Harga jual per porsi: Rp50.000',
      ],
      ditanyakan: 'Berapa keuntungan bersih yang diperoleh Ibu Hajjah Maryam hari ini?',
      informasiPenting: [
        'Total Modal/Biaya = Biaya Tetap + (Jumlah Porsi × Biaya Daging per Porsi).',
        'Total Pendapatan/Omzet = Jumlah Porsi × Harga Jual per Porsi.',
        'Keuntungan Bersih = Total Pendapatan − Total Modal Keseluruhan.',
      ],
      operasiHitung: {
        steps: [
          'Langkah 1: Menghitung total modal daging = 25 porsi × Rp35.000 = Rp875.000',
          'Langkah 2: Menghitung total biaya produksi = Rp150.000 + Rp875.000 = Rp1.025.000',
          'Langkah 3: Menghitung total pendapatan = 25 porsi × Rp50.000 = Rp1.250.000',
          'Langkah 4: Menghitung keuntungan bersih = Rp1.250.000 − Rp1.025.000 = Rp225.000',
        ],
        result: 'Rp225.000',
      },
      jawabanAkhir:
        'Keuntungan bersih yang diperoleh Ibu Hajjah Maryam hari ini adalah sebesar Rp225.000.',
      penjelasanNalar:
        'Melatih siswa SMP memahami konsep model aljabar linear sederhana (Biaya = C_tetap + C_variabel) dalam konteks UMKM lokal.',
    },
    options: [
      {
        text: 'Rp375.000',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Angka Rp375.000 didapat dari (Rp50.000 − Rp35.000) × 25. Kamu hanya menghitung selisih harga jual dan daging, namun lupa mengurangkan biaya tetap bumbu & gas sebesar Rp150.000.',
        teacherCoachingPrompt:
          'Guru memantik: "Apakah Ibu Hajjah Maryam memasak Nasu Palekko hanya dengan daging saja tanpa bumbu dan gas elpiji? Biaya Rp150.000 itu diambil dari mana?"',
      },
      {
        text: 'Rp1.250.000',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Rp1.250.000 adalah total seluruh uang masuk (omzet penjualan), bukan keuntungan bersih. Untuk mendapat untung bersih, omzet harus dikurangi modal belanja.',
        teacherCoachingPrompt:
          'Guru memantik: "Kalau kamu jualan dan dapat uang Rp1.250.000 di laci kasir, apakah seluruh uang itu sudah murni keuntunganmu? Bagaimana dengan modal belanja daging di pasar?"',
      },
      {
        text: 'Rp225.000',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Luar biasa! Pemikiran finansial dan matematikamu sangat matang: Total Omzet (Rp1.250.000) dikurangi Total Modal [Rp150.000 + (25 × Rp35.000) = Rp1.025.000] = Rp225.000.',
        teacherCoachingPrompt:
          'Guru memantik: "Analisis yang sangat presisi! Menurutmu, apa yang bisa dilakukan Ibu Hajjah Maryam jika ingin meningkatkan keuntungan bersihnya?"',
      },
      {
        text: 'Rp175.000',
        isCorrect: false,
        diagnosticCategory: 'hitung-teknis',
        explanation:
          'Belum tepat. Rumus penalaranmu sudah benar, namun ada kekeliruan hitung pengurangan saat mengurangkan Rp1.250.000 dengan Rp1.025.000.',
        teacherCoachingPrompt:
          'Guru memantik: "Model matematikamu sudah tepat sekali. Coba hitung kembali pengurangan Rp1.250.000 − Rp1.025.000 secara teliti."',
      },
    ],
    teacherDiagnosticNotes:
      'Fokus diagnosis: Menilai pemahaman pemodelan biaya tetap vs biaya variabel (dasar aljabar kelas VII/VIII) dan pembedaan antara omzet kotor vs laba bersih.',
  },
];

interface StudioSoalLokalProps {
  onQuestionCreated?: (question: LabQuestion) => void;
  onClose?: () => void;
}

export const StudioSoalLokal: React.FC<StudioSoalLokalProps> = ({
  onQuestionCreated,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'katalog' | 'wizard' | 'koleksi'>('katalog');
  const [customQuestions, setCustomQuestions] = useState<LabQuestion[]>(getCustomQuestions());
  const [selectedPresetId, setSelectedPresetId] = useState<string>(LOCAL_PRESETS_TELLU_LIMPOE[0].id);
  const [printWorksheet, setPrintWorksheet] = useState<LabQuestion | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State for Wizard / Customizer
  const [formLevel, setFormLevel] = useState<'SD' | 'SMP'>('SD');
  const [formTopic, setFormTopic] = useState<string>(
    'Panen Padi & Penggilingan Gabah Pak Rustam (Tellu Limpoe)'
  );
  const [formContextTag, setFormContextTag] = useState<string>(
    'Sektor Pertanian & Kilang Padi Amparita'
  );
  const [formStory, setFormStory] = useState<string>(LOCAL_PRESETS_TELLU_LIMPOE[0].story);
  const [formDiketahui, setFormDiketahui] = useState<string>(
    LOCAL_PRESETS_TELLU_LIMPOE[0].reveals.diketahui.join('\n')
  );
  const [formDitanyakan, setFormDitanyakan] = useState<string>(
    LOCAL_PRESETS_TELLU_LIMPOE[0].reveals.ditanyakan
  );
  const [formInfoPenting, setFormInfoPenting] = useState<string>(
    LOCAL_PRESETS_TELLU_LIMPOE[0].reveals.informasiPenting.join('\n')
  );
  const [formLangkahHitung, setFormLangkahHitung] = useState<string>(
    LOCAL_PRESETS_TELLU_LIMPOE[0].reveals.operasiHitung.steps.join('\n')
  );
  const [formHasilAkhir, setFormHasilAkhir] = useState<string>(
    LOCAL_PRESETS_TELLU_LIMPOE[0].reveals.operasiHitung.result
  );
  const [formPenjelasan, setFormPenjelasan] = useState<string>(
    LOCAL_PRESETS_TELLU_LIMPOE[0].reveals.penjelasanNalar
  );

  // 4 Options
  const [formOptionA, setFormOptionA] = useState({
    text: '18 Karung',
    isCorrect: false,
    explanation: 'Belum tepat. Angka 18 hanya menghitung sekam yang terbuang.',
    coaching: 'Guru memantik: "Yang dimasukkan ke karung beras bersih atau sekam?"',
  });
  const [formOptionB, setFormOptionB] = useState({
    text: '60 Karung',
    isCorrect: false,
    explanation: 'Belum tepat. Langsung membagi 1.200 kg ÷ 20 kg tanpa susut giling.',
    coaching: 'Guru memantik: "Apakah berat beras sama persis dengan berat gabah basah?"',
  });
  const [formOptionC, setFormOptionC] = useState({
    text: '42 Karung',
    isCorrect: true,
    explanation: 'Tepat sekali! 70% × 1.200 = 840 kg, lalu 840 ÷ 20 = 42 karung.',
    coaching: 'Guru memantik: "Bagus sekali! Coba jelaskan alasanmu pada teman."',
  });
  const [formOptionD, setFormOptionD] = useState({
    text: '36 Karung',
    isCorrect: false,
    explanation: 'Belum tepat. Terjadi kekeliruan perhitungan pembagian.',
    coaching: 'Guru memantik: "Periksa kembali cakaran pembagian 840 dibagi 20."',
  });

  const handleApplyPreset = (preset: LocalContextPreset) => {
    setSelectedPresetId(preset.id);
    setFormLevel(preset.level);
    setFormTopic(preset.topic);
    setFormContextTag(preset.contextTag);
    setFormStory(preset.story);
    setFormDiketahui(preset.reveals.diketahui.join('\n'));
    setFormDitanyakan(preset.reveals.ditanyakan);
    setFormInfoPenting(preset.reveals.informasiPenting.join('\n'));
    setFormLangkahHitung(preset.reveals.operasiHitung.steps.join('\n'));
    setFormHasilAkhir(preset.reveals.operasiHitung.result);
    setFormPenjelasan(preset.reveals.penjelasanNalar);

    if (preset.options[0]) {
      setFormOptionA({
        text: preset.options[0].text,
        isCorrect: preset.options[0].isCorrect,
        explanation: preset.options[0].explanation,
        coaching: preset.options[0].teacherCoachingPrompt,
      });
    }
    if (preset.options[1]) {
      setFormOptionB({
        text: preset.options[1].text,
        isCorrect: preset.options[1].isCorrect,
        explanation: preset.options[1].explanation,
        coaching: preset.options[1].teacherCoachingPrompt,
      });
    }
    if (preset.options[2]) {
      setFormOptionC({
        text: preset.options[2].text,
        isCorrect: preset.options[2].isCorrect,
        explanation: preset.options[2].explanation,
        coaching: preset.options[2].teacherCoachingPrompt,
      });
    }
    if (preset.options[3]) {
      setFormOptionD({
        text: preset.options[3].text,
        isCorrect: preset.options[3].isCorrect,
        explanation: preset.options[3].explanation,
        coaching: preset.options[3].teacherCoachingPrompt,
      });
    }
  };

  const handleSaveToLab = (asPreset?: LocalContextPreset) => {
    let newQ: LabQuestion;

    if (asPreset) {
      newQ = {
        id: `soal-lokal-${Date.now()}`,
        level: asPreset.level,
        topic: asPreset.topic,
        contextTag: asPreset.contextTag,
        story: asPreset.story,
        reveals: asPreset.reveals,
        teacherDiagnosticNotes: asPreset.teacherDiagnosticNotes,
        options: asPreset.options.map((o, idx) => ({
          id: `opt-${idx + 1}`,
          text: o.text,
          isCorrect: o.isCorrect,
          diagnosticCategory: o.diagnosticCategory,
          explanation: `${o.explanation} [Sapaan Guru: ${o.teacherCoachingPrompt}]`,
        })),
      };
    } else {
      const optionsArray: QuestionOption[] = [
        {
          id: 'opt-a',
          text: formOptionA.text,
          isCorrect: formOptionA.isCorrect,
          diagnosticCategory: formOptionA.isCorrect ? 'tepat' : 'pemahaman-soal',
          explanation: `${formOptionA.explanation} [Sapaan Guru: ${formOptionA.coaching}]`,
        },
        {
          id: 'opt-b',
          text: formOptionB.text,
          isCorrect: formOptionB.isCorrect,
          diagnosticCategory: formOptionB.isCorrect ? 'tepat' : 'pemilihan-operasi',
          explanation: `${formOptionB.explanation} [Sapaan Guru: ${formOptionB.coaching}]`,
        },
        {
          id: 'opt-c',
          text: formOptionC.text,
          isCorrect: formOptionC.isCorrect,
          diagnosticCategory: formOptionC.isCorrect ? 'tepat' : 'hitung-teknis',
          explanation: `${formOptionC.explanation} [Sapaan Guru: ${formOptionC.coaching}]`,
        },
        {
          id: 'opt-d',
          text: formOptionD.text,
          isCorrect: formOptionD.isCorrect,
          diagnosticCategory: formOptionD.isCorrect ? 'tepat' : 'pemilihan-operasi',
          explanation: `${formOptionD.explanation} [Sapaan Guru: ${formOptionD.coaching}]`,
        },
      ];

      newQ = {
        id: `soal-lokal-${Date.now()}`,
        level: formLevel,
        topic: formTopic.trim() || 'Soal Kontekstual Tellu Limpoe',
        contextTag: formContextTag.trim() || 'Kearifan Lokal Tellu Limpoe',
        story: formStory.trim(),
        teacherDiagnosticNotes:
          'Disusun melalui Studio Penyusun Soal Kontekstual Lokal Tellu Limpoe untuk penguatan nalar berbasis kearifan lokal.',
        options: optionsArray,
        reveals: {
          diketahui: formDiketahui.split('\n').filter((s) => s.trim().length > 0),
          ditanyakan: formDitanyakan.trim(),
          informasiPenting: formInfoPenting.split('\n').filter((s) => s.trim().length > 0),
          operasiHitung: {
            steps: formLangkahHitung.split('\n').filter((s) => s.trim().length > 0),
            result: formHasilAkhir.trim() || 'Hasil Terkalkulasi',
          },
          jawabanAkhir: `Hasil akhir yang tepat adalah ${formHasilAkhir.trim()}.`,
          penjelasanNalar: formPenjelasan.trim(),
        },
      };
    }

    const updated = saveCustomQuestion(newQ);
    setCustomQuestions(updated);
    if (onQuestionCreated) {
      onQuestionCreated(newQ);
    }
    alert(
      `Soal kontekstual "${newQ.topic}" berhasil disimpan! Soal ini sekarang aktif di Laboratorium Soal dan dapat dikerjakan siswa maupun ditelaah guru.`
    );
    setActiveTab('koleksi');
  };

  const handleDeleteCustom = (id: string) => {
    if (window.confirm('Hapus soal kontekstual ini dari koleksi laboratorium?')) {
      const updated = deleteCustomQuestion(id);
      setCustomQuestions(updated);
    }
  };

  const handleShareWa = (q: LabQuestion) => {
    const text =
      `*SOAL CERITA NUMERASI TEMU NALAR (KONTEKS LOKAL TELLU LIMPOE)*\n` +
      `Jenjang: *${q.level}* | Topik: *${q.topic}*\n` +
      `Konteks: ${q.contextTag}\n\n` +
      `📖 *Teks Soal:*\n"${q.story}"\n\n` +
      `🎯 *Pilihan Jawaban:*\n` +
      q.options.map((o, idx) => `${String.fromCharCode(65 + idx)}. ${o.text}`).join('\n') +
      `\n\n🔍 *Tangga Nalar (Kunci & Pembahasan):*\n` +
      `• *Diketahui:* \n${q.reveals.diketahui.map((d) => `  - ${d}`).join('\n')}\n` +
      `• *Ditanyakan:* ${q.reveals.ditanyakan}\n` +
      `• *Langkah Hitung:* \n${q.reveals.operasiHitung.steps.map((st) => `  › ${st}`).join('\n')}\n` +
      `• *Hasil Akhir:* ${q.reveals.operasiHitung.result}\n\n` +
      `💡 *Catatan Nalar Guru:* \n${q.reveals.penjelasanNalar}\n\n` +
      `_Disusun melalui Studio Soal Kontekstual Tellu Limpoe - Inovasi Pengawasan Berdampak (Heriansyah., S.Si., S.Pd., M.Pd)_`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-7">
      {/* Header Studio */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inovasi Pedagogis Lokal</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Studio Penyusun Soal Kontekstual Lokal Tellu Limpoe
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Membantu guru dampingan di 25 sekolah binaan meramu soal cerita kontekstual bertingkat
            berdasarkan <strong>4 Ikon Kearifan Lokal Kecamatan Tellu Limpoe (Sidrap)</strong>:
            Lumbung Padi, PLTB Sidrap, Peternakan Itik Telur Asin, dan Pasar Sentral Amparita.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'katalog'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Katalog 4 Ikon Lokal</span>
          </button>
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'wizard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Editor / Modifikasi Soal</span>
          </button>
          <button
            onClick={() => setActiveTab('koleksi')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'koleksi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Soal Tersimpan ({customQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: KATALOG 4 IKON LOKAL TELLU LIMPOE */}
      {activeTab === 'katalog' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-blue-900 font-extrabold">
                Mengapa Memakai Konteks Nyata Tellu Limpoe?
              </strong>
              <p className="text-slate-700 leading-relaxed">
                Riset membuktikan hambatan nalar siswa sering kali terjadi bukan karena tidak bisa
                menghitung, melainkan karena stimulus soal terasa asing dan berjarak dari dunianya.
                Ketika soal mengangkat kilang padi di Baula, turbin PLTB di Mattirotasi, atau telur
                asin Amparita, siswa langsung mengaktifkan skema berpikir (*background knowledge*)
                nyata mereka.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LOCAL_PRESETS_TELLU_LIMPOE.map((preset) => {
              const IconComp = preset.icon;
              return (
                <div
                  key={preset.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-blue-400 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                        <IconComp className="w-3.5 h-3.5 text-blue-700" />
                        <span>{preset.theme}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          preset.level === 'SD'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}
                      >
                        Jenjang {preset.level}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {preset.topic}
                    </h4>

                    {/* Preview Story */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed italic line-clamp-3">
                      "{preset.story}"
                    </div>

                    {/* Quick Stepped Highlights */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                        <span className="font-bold block">Kunci Jawaban:</span>
                        <span>{preset.reveals.operasiHitung.result}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900">
                        <span className="font-bold block">Fokus Nalar:</span>
                        <span className="truncate block">{preset.contextTag}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        handleApplyPreset(preset);
                        setActiveTab('wizard');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1 border border-slate-300"
                    >
                      <span>Modifikasi di Editor →</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveToLab(preset)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Pasang di Lab Soal</span>
                      </button>

                      <button
                        onClick={() => {
                          const tempQ: LabQuestion = {
                            id: preset.id,
                            level: preset.level,
                            topic: preset.topic,
                            contextTag: preset.contextTag,
                            story: preset.story,
                            reveals: preset.reveals,
                            teacherDiagnosticNotes: preset.teacherDiagnosticNotes,
                            options: preset.options.map((o, i) => ({
                              id: `opt-${i}`,
                              text: o.text,
                              isCorrect: o.isCorrect,
                              diagnosticCategory: o.diagnosticCategory,
                              explanation: o.explanation,
                            })),
                          };
                          setPrintWorksheet(tempQ);
                        }}
                        className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition"
                        title="Cetak LKPD"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EDITOR / WIZARD PEMBUAT SOAL KUSTOM */}
      {activeTab === 'wizard' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveToLab();
          }}
          className="space-y-6"
        >
          {/* Quick preset chips */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Muat Draf Cepat dari 4 Ikon Tellu Limpoe:</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {LOCAL_PRESETS_TELLU_LIMPOE.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                    selectedPresetId === p.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {p.theme} ({p.level})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Jenjang Sasaran *</label>
              <select
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value as 'SD' | 'SMP')}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="SD">Sekolah Dasar (SD / Fase C)</option>
                <option value="SMP">Sekolah Menengah Pertama (SMP / Fase D)</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-slate-700">Judul Topik Soal Cerita *</label>
              <input
                type="text"
                required
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                placeholder="misal: Panen Padi di Desa Baula"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="font-bold text-slate-700">Tag Konteks Kearifan Lokal</label>
              <input
                type="text"
                value={formContextTag}
                onChange={(e) => setFormContextTag(e.target.value)}
                placeholder="misal: Sektor Pertanian & Kilang Padi Tellu Limpoe"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Teks Cerita Utama */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-900 flex items-center justify-between text-xs sm:text-sm">
              <span>Teks Cerita Kontekstual (Stimulus Bacaan) *</span>
              <span className="text-[11px] font-normal text-slate-500">
                Sajikan nama tokoh lokal, lokasi, data fakta, dan kalimat tanya di akhir
              </span>
            </label>
            <textarea
              required
              rows={4}
              value={formStory}
              onChange={(e) => setFormStory(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* 5 Tangga Nalar Otomatis */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Rincian 5 Tangga Nalar (Kunci & Analisis Jawaban)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-blue-900">1. Yang Diketahui (1 baris per fakta):</label>
                <textarea
                  rows={3}
                  value={formDiketahui}
                  onChange={(e) => setFormDiketahui(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-blue-200 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-amber-900">2. Yang Ditanyakan:</label>
                <textarea
                  rows={3}
                  value={formDitanyakan}
                  onChange={(e) => setFormDitanyakan(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-200 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-purple-900">3. Informasi Penting & Kunci Nalar:</label>
                <textarea
                  rows={3}
                  value={formInfoPenting}
                  onChange={(e) => setFormInfoPenting(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-emerald-900">4. Langkah Operasi Hitung (1 baris per langkah):</label>
                <textarea
                  rows={3}
                  value={formLangkahHitung}
                  onChange={(e) => setFormLangkahHitung(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-emerald-200 bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-teal-900">Hasil Akhir Terverifikasi:</label>
                <input
                  type="text"
                  value={formHasilAkhir}
                  onChange={(e) => setFormHasilAkhir(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-teal-200 bg-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">5. Catatan Penjelasan Nalar Kontekstual:</label>
                <input
                  type="text"
                  value={formPenjelasan}
                  onChange={(e) => setFormPenjelasan(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 4 Opsi Pilihan Ganda & Sapaan Coaching Guru */}
          <div className="space-y-3">
            <label className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
              4 Pilihan Jawaban & Kalimat Pemantik Guru (*Coaching Prompts*):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Opsi A */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>Pilihan A (Pengecoh 1 - Salah Paham)</span>
                  <input
                    type="checkbox"
                    checked={formOptionA.isCorrect}
                    onChange={(e) => setFormOptionA({ ...formOptionA, isCorrect: e.target.checked })}
                  />
                </div>
                <input
                  type="text"
                  value={formOptionA.text}
                  onChange={(e) => setFormOptionA({ ...formOptionA, text: e.target.value })}
                  placeholder="Teks Pilihan A"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                />
                <textarea
                  rows={2}
                  value={formOptionA.coaching}
                  onChange={(e) => setFormOptionA({ ...formOptionA, coaching: e.target.value })}
                  placeholder="Kalimat Pemantik Guru jika siswa pilih A"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-[11px]"
                />
              </div>

              {/* Opsi B */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>Pilihan B (Pengecoh 2 - Salah Operasi)</span>
                  <input
                    type="checkbox"
                    checked={formOptionB.isCorrect}
                    onChange={(e) => setFormOptionB({ ...formOptionB, isCorrect: e.target.checked })}
                  />
                </div>
                <input
                  type="text"
                  value={formOptionB.text}
                  onChange={(e) => setFormOptionB({ ...formOptionB, text: e.target.value })}
                  placeholder="Teks Pilihan B"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                />
                <textarea
                  rows={2}
                  value={formOptionB.coaching}
                  onChange={(e) => setFormOptionB({ ...formOptionB, coaching: e.target.value })}
                  placeholder="Kalimat Pemantik Guru jika siswa pilih B"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-[11px]"
                />
              </div>

              {/* Opsi C (Kunci Tepat) */}
              <div className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/60 space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>Pilihan C (Kunci Jawaban Tepat)</span>
                  <input
                    type="checkbox"
                    checked={formOptionC.isCorrect}
                    onChange={(e) => setFormOptionC({ ...formOptionC, isCorrect: e.target.checked })}
                  />
                </div>
                <input
                  type="text"
                  value={formOptionC.text}
                  onChange={(e) => setFormOptionC({ ...formOptionC, text: e.target.value })}
                  placeholder="Teks Pilihan C"
                  className="w-full p-2 rounded-lg border border-emerald-300 bg-white font-bold"
                />
                <textarea
                  rows={2}
                  value={formOptionC.coaching}
                  onChange={(e) => setFormOptionC({ ...formOptionC, coaching: e.target.value })}
                  placeholder="Kalimat Pemantik Guru jika siswa pilih C"
                  className="w-full p-2 rounded-lg border border-emerald-300 bg-white text-[11px]"
                />
              </div>

              {/* Opsi D */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>Pilihan D (Pengecoh 3 - Keliru Hitung)</span>
                  <input
                    type="checkbox"
                    checked={formOptionD.isCorrect}
                    onChange={(e) => setFormOptionD({ ...formOptionD, isCorrect: e.target.checked })}
                  />
                </div>
                <input
                  type="text"
                  value={formOptionD.text}
                  onChange={(e) => setFormOptionD({ ...formOptionD, text: e.target.value })}
                  placeholder="Teks Pilihan D"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white font-bold"
                />
                <textarea
                  rows={2}
                  value={formOptionD.coaching}
                  onChange={(e) => setFormOptionD({ ...formOptionD, coaching: e.target.value })}
                  placeholder="Kalimat Pemantik Guru jika siswa pilih D"
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('katalog')}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Pasang di Lab Soal</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DAFTAR SOAL KUSTOM TERSIMPAN */}
      {activeTab === 'koleksi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Koleksi Soal Kontekstual Lokal di Laboratorium ({customQuestions.length})
            </span>
            <button
              onClick={() => setActiveTab('wizard')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Buat Soal Lokal Baru</span>
            </button>
          </div>

          {customQuestions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="font-bold text-slate-700 text-sm">Belum Ada Soal Lokal Tersimpan</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Silakan pilih salah satu draf dari tab "Katalog 4 Ikon Lokal" lalu klik "Pasang di Lab Soal".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {customQuestions.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 hover:border-blue-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-900 uppercase">
                          {q.level}
                        </span>
                        <span className="text-xs text-slate-500">{q.contextTag}</span>
                      </div>
                      <h5 className="font-extrabold text-slate-900 text-base">{q.topic}</h5>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShareWa(q)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </button>
                      {copiedId === q.id && (
                        <span className="text-xs font-bold text-emerald-700 animate-pulse">
                          ✓ Tersalin!
                        </span>
                      )}

                      <button
                        onClick={() => setPrintWorksheet(q)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak LKPD</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCustom(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                        title="Hapus soal ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-2">
                    "{q.story}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL CETAK LKPD TEMU NALAR SIAP PAKAI */}
      {printWorksheet && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="text-xs font-bold uppercase text-slate-500">
                Pratinjau Cetak Lembar Kerja Peserta Didik (LKPD Temu Nalar)
              </div>
              <button
                onClick={() => setPrintWorksheet(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg"
              >
                ✕
              </button>
            </div>

            {/* Area Kertas Kerja LKPD */}
            <div
              id="printable-worksheet"
              className="p-6 border-2 border-slate-800 rounded-2xl space-y-5 bg-white text-slate-900"
            >
              {/* Kop LKPD */}
              <div className="text-center pb-3 border-b-2 border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
                  LEMBAR KERJA PESERTA DIDIK (LKPD) TEMU NALAR KONTEKSTUAL
                </div>
                <div className="text-base sm:text-xl font-black text-slate-900 uppercase">
                  KECAMATAN TELLU LIMPOE — KABUPATEN SIDENRENG RAPPANG
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Pendekatan GERAK BERDAMPAK | Pengawas Pembina: Heriansyah., S.Si., S.Pd., M.Pd
                </div>
              </div>

              {/* Identitas Siswa */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-b border-slate-200 pb-3">
                <div>
                  <span className="text-slate-500">Nama Siswa:</span>{' '}
                  <div className="border-b border-dotted border-slate-400 h-5" />
                </div>
                <div>
                  <span className="text-slate-500">Kelas / Fase:</span>{' '}
                  <div className="border-b border-dotted border-slate-400 h-5" />
                </div>
                <div>
                  <span className="text-slate-500">Sekolah:</span>{' '}
                  <div className="border-b border-dotted border-slate-400 h-5" />
                </div>
                <div>
                  <span className="text-slate-500">Tanggal:</span>{' '}
                  <div className="border-b border-dotted border-slate-400 h-5" />
                </div>
              </div>

              {/* Topik & Teks Stimulus */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">
                    Topik: {printWorksheet.topic} ({printWorksheet.level})
                  </span>
                  <span className="text-slate-600 font-mono text-[10px]">
                    Konteks: {printWorksheet.contextTag}
                  </span>
                </div>

                <div className="p-4 rounded-xl border-2 border-slate-400 bg-slate-50/50 space-y-1 text-xs sm:text-sm">
                  <span className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
                    Petunjuk: Gunakan stabilo kuning untuk fakta yang diketahui dan stabilo hijau untuk kalimat tanya!
                  </span>
                  <p className="leading-relaxed whitespace-pre-line text-slate-900 font-medium">
                    {printWorksheet.story}
                  </p>
                </div>
              </div>

              {/* Ruang Kerja Siswa 3 Kotak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Kotak 1: Informasi Penting */}
                <div className="p-3 border border-slate-400 rounded-xl space-y-1">
                  <div className="font-bold text-[10px] uppercase text-slate-700">
                    A. Yang Diketahui & Yang Ditanyakan:
                  </div>
                  <div className="h-24 border-b border-dotted border-slate-300" />
                </div>

                {/* Kotak 2: Diagram Sketsa Bar-Model */}
                <div className="p-3 border border-slate-400 rounded-xl space-y-1">
                  <div className="font-bold text-[10px] uppercase text-slate-700">
                    B. Gambar Sketsa / Diagram Model Nalar:
                  </div>
                  <div className="h-24 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                    (Buat kotak bar-model di sini)
                  </div>
                </div>
              </div>

              {/* Kotak Cakar-Cakar & Alasan */}
              <div className="p-3 border border-slate-400 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-[10px] uppercase text-slate-700">
                  C. Perhitungan Kalimat Matematika & Penjelasan Alasan:
                </div>
                <div className="h-28 border-b border-dotted border-slate-300" />
                <div className="text-[10px] text-slate-500 italic pt-1">
                  Tuliskan 1 kalimat alasan mengapa kamu memilih operasi hitung di atas.
                </div>
              </div>

              {/* Pilihan Jawaban */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-slate-800 text-[10px] uppercase">
                  Pilihlah Jawaban Akhir yang Paling Tepat:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {printWorksheet.options.map((opt, idx) => (
                    <div key={opt.id} className="p-2 border border-slate-400 rounded-lg flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-medium text-[11px]">{opt.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paraf Guru */}
              <div className="pt-2 flex justify-between text-xs text-center border-t border-slate-200">
                <div className="space-y-8">
                  <div>Catatan Refleksi Siswa,</div>
                  <div className="text-[10px] text-slate-400">(Tanda Tangan Siswa)</div>
                </div>
                <div className="space-y-8">
                  <div>Guru Dampingan,</div>
                  <div className="text-[10px] text-slate-400">(Tanda Tangan & Nilai Nalar)</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setPrintWorksheet(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
