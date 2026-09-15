import {
  RootProblemItem,
  ProblemFlowStep,
  GerakStage,
  BerdampakStage,
  LabQuestion,
  TeachingStrategy,
  ReflectionQuestion,
  ImpactData,
  ActionPlanItem,
  GerakRecord,
  SchoolProgressItem,
  OfficialSchoolItem,
} from '../types';

export const APP_INFO = {
  name: 'GERAK BERDAMPAK',
  subname: 'Temu Nalar Literasi-Numerasi',
  tagline:
    'Pendampingan Pengawas Sekolah untuk Menguatkan Kemampuan Berpikir Kritis dan Komunikatif Siswa',
  targetAudience: [
    'Pengawas Sekolah',
    'Kepala Sekolah SD dan SMP',
    'Guru SD dan SMP',
    '25 Sekolah Binaan (21 SD & 4 SMP) di Kecamatan Tellu Limpoe, Kabupaten Sidenreng Rappang',
  ],
  developer: 'Heriansyah., S.Si., S.Pd., M.Pd',
  locationTarget: 'Kecamatan Tellu Limpoe, Kabupaten Sidenreng Rappang',
  corePrinciples: [
    {
      title: 'Memahami sebelum menghitung',
      desc: 'Siswa diajak menggali makna konteks informasi secara utuh, bukan terburu-buru mengoperasikan angka.',
    },
    {
      title: 'Berpikir sebelum menjawab',
      desc: 'Membimbing siswa mengidentifikasi apa yang benar-benar ditanyakan dan strategi logis yang dibutuhkan.',
    },
    {
      title: 'Menjelaskan sebelum menyimpulkan',
      desc: 'Melatih kemampuan bernalar komunikatif dengan menguraikan mengapa suatu metode hitung dipilih.',
    },
  ],
  flowStages: [
    'Masalah',
    'Data',
    'Refleksi',
    'Strategi',
    'Aksi',
    'Monitoring',
    'Dampak',
    'Perbaikan',
  ],
};

export const OFFICIAL_SCHOOLS_TELLU_LIMPOE: OfficialSchoolItem[] = [
  { no: 1, name: 'UPT SD NEGERI 1 MASSEPE', level: 'SD', type: 'Reguler' },
  { no: 2, name: 'UPT SD NEGERI 2 MASSEPE', level: 'SD', type: 'Reguler' },
  { no: 3, name: 'UPT SD NEGERI 3 MASSEPE', level: 'SD', type: 'Reguler' },
  { no: 4, name: 'UPT SD NEGERI 4 MASSEPE', level: 'SD', type: 'Reguler' },
  { no: 5, name: 'UPT SD NEGERI 5 MASSEPE', level: 'SD', type: 'Reguler' },
  { no: 6, name: 'UPT SD NEGERI 1 TETEAJI', level: 'SD', type: 'Reguler' },
  { no: 7, name: 'UPT SD NEGERI 2 TETEAJI', level: 'SD', type: 'Reguler' },
  { no: 8, name: 'UPT SD NEGERI 3 TETEAJI', level: 'SD', type: 'Reguler' },
  { no: 9, name: 'UPT SD NEGERI 1 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 10, name: 'UPT SD NEGERI 2 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 11, name: 'UPT SD NEGERI 3 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 12, name: 'UPT SD NEGERI 4 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 13, name: 'UPT SD NEGERI 5 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 14, name: 'UPT SD NEGERI 6 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 15, name: 'UPT SD NEGERI 7 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 16, name: 'UPT SD NEGERI 8 AMPARITA', level: 'SD', type: 'Reguler' },
  { no: 17, name: 'SEKOLAH DASAR ISLAM AL BAYAN MASSEPE', level: 'SD', type: 'Reguler' },
  { no: 18, name: 'UPT SD NEGERI 2 BILOKKA', level: 'SD', type: 'Reguler' },
  { no: 19, name: 'UPT SD NEGERI 4 BILOKKA', level: 'SD', type: 'Reguler' },
  { no: 20, name: 'UPT SD NEGERI 5 BILOKKA', level: 'SD', type: 'Reguler' },
  { no: 21, name: 'UPT SD NEGERI 6 WANIO', level: 'SD', type: 'Reguler' },
  { no: 22, name: 'UPT SMP NEGERI 1 TELLU LIMPOE', level: 'SMP', type: 'Reguler' },
  { no: 23, name: 'UPT SMP NEGERI 2 TELLU LIMPOE', level: 'SMP', type: 'Reguler' },
  { no: 24, name: 'UPT SMP ISLAM AL IRSYAD TELLU LIMPOE', level: 'SMP', type: 'Reguler' },
  { no: 25, name: 'UPT SMP SATU ATAP 5 BILOKKA', level: 'SMP', type: 'Reguler' },
];

export const SCHOOL_LIST_TELLU_LIMPOE: string[] = OFFICIAL_SCHOOLS_TELLU_LIMPOE.map(
  (s) => s.name
);

export const ROOT_PROBLEMS: RootProblemItem[] = [
  {
    id: 1,
    title: 'Siswa membaca, tetapi tidak memahami isi',
    summary:
      'Siswa mampu melafalkan kata-kata dalam kalimat soal secara lancar, namun tidak menangkap gambaran situasi nyata di balik teks tersebut.',
    explanation:
      'Banyak siswa memiliki kemampuan membaca mekanis (decoding) yang baik, tetapi ketika ditanya situasi apa yang sedang terjadi dalam soal, mereka tidak dapat menceritakannya kembali. Soal matematika dianggap deretan huruf asing yang sekadar membungkus angka.',
    studentBehavior:
      'Saat diminta menceritakan soal, siswa membaca ulang teks kata per kata tanpa ada intonasi pemahaman atau malah terdiam kebingungan.',
    literacyImpact:
      'Kemampuan membaca terbatas pada taraf fonik/mekanis tanpa proses elaborasi makna atau visualisasi konteks.',
    numeracyImpact:
      'Siswa bingung menetapkan titik tolak perhitungan karena tidak memiliki model mental tentang skenario masalah.',
    reflectionQuestion:
      'Apakah saya sudah memberi waktu kepada siswa untuk membayangkan dan menceritakan situasi soal dengan kalimat mereka sendiri?',
    practicalTip:
      'Minta siswa menutup teks soal lalu menceritakan kembali kejadian tersebut seperti mendongeng ke teman sebangku.',
  },
  {
    id: 2,
    title: 'Siswa tidak mampu menangkap informasi penting',
    summary:
      'Semua data teks dianggap sama rata nilainya, sehingga siswa kewalahan menyaring mana data pokok dan mana kalimat pelengkap.',
    explanation:
      'Dalam soal cerita kontekstual, sering kali ada informasi pendukung suasana (misal nama tokoh, hari, keterangan tempat). Siswa yang literasinya belum terlatih bingung membedakan mana besaran kuantitatif utama dan mana keterangan tambahan.',
    studentBehavior:
      'Siswa menyalin ulang seluruh kalimat soal ke lembar kerja atau justru melewatkan angka penting yang tertulis dalam bentuk kata (misal: "setengah", "dua lusin").',
    literacyImpact:
      'Kesulitan mengidentifikasi gagasan utama dan data kunci (key entities) dalam teks fungsional.',
    numeracyImpact:
      'Parameter hitungan menjadi kurang lengkap atau memasukkan angka yang tidak berhubungan dengan inti persoalan.',
    reflectionQuestion:
      'Sudahkah saya membiasakan siswa menandai (stabilo/garis bawahi) angka beserta satuan dan maknanya sebelum mulai menghitung?',
    practicalTip:
      'Gunakan teknik stabilo 2 warna: warna kuning untuk fakta/angka penting, warna hijau untuk pertanyaan.',
  },
  {
    id: 3,
    title: 'Siswa bingung menentukan apa yang ditanyakan',
    summary:
      'Siswa tergesa-gesa langsung melakukan kalkulasi tanpa memahami sasaran akhir yang ingin dicari.',
    explanation:
      'Fokus siswa langsung tertuju pada angka pertama dan kedua yang mereka lihat. Mereka lupa mengecek kalimat tanya di akhir soal: apakah yang dicari sisa, total, selisih, kembalian, atau rata-rata per bagian.',
    studentBehavior:
      'Siswa langsung menjumlahkan atau mengalikan semua angka yang ditemukan dalam soal tanpa membaca kalimat tanya hingga tuntas.',
    literacyImpact:
      'Kelemahan dalam membedakan kalimat berita (informasi) dengan kalimat tanya (tujuan pemecahan masalah).',
    numeracyImpact:
      'Jawaban melenceng jauh dari tujuan soal walaupun perhitungan teknis perkalian atau pengurangannya benar.',
    reflectionQuestion:
      'Apakah siswa saya benar-benar memahami apa yang sedang dicari sebelum mereka mulai memilih operasi hitung?',
    practicalTip:
      'Ajak siswa menuliskan "Misi Utama Kita:" dengan satu kalimat pendek sebelum menyentuh pensil hitungan.',
  },
  {
    id: 4,
    title: 'Siswa tidak memahami istilah dalam soal',
    summary:
      'Kosakata matematika kontekstual (seperti "kembalian", "bruto", "selisih", "diskon", "rasio", "kapasitas") belum dipahami secara bermakna.',
    explanation:
      'Bagi siswa, kata seperti "selisih" sering disalahartikan sebagai penjumlahan, atau "diskon" dianggap biaya tambahan. Jika kosakata konteks tidak dimaknai, rumus apa pun tidak akan bekerja dengan benar.',
    studentBehavior:
      'Siswa berhenti bekerja saat menemui kata yang tidak biasa, atau menebak sembarangan arti istilah tersebut.',
    literacyImpact:
      'Perbendaharaan kosakata akademik dan kontekstual rendah sehingga menghambat penyerapan instruksi.',
    numeracyImpact:
      'Kesalahan fatal pada penentuan model rumus karena salah menafsirkan arti kata kunci operasional.',
    reflectionQuestion:
      'Apakah sebelum latihan soal, saya sudah mengonfirmasi pemahaman siswa terhadap istilah-istilah kunci yang digunakan?',
    practicalTip:
      'Buat "Kamus Mini Istilah Numerasi" di dinding kelas atau pojok baca matematika kelas.',
  },
  {
    id: 5,
    title: 'Siswa kesulitan memilah informasi yang relevan',
    summary:
      'Siswa terdistraksi oleh informasi pengecoh atau angka tambahan yang sengaja disertakan untuk menguji daya kritis.',
    explanation:
      'Soal AKM dan soal berstandar tinggi menyajikan tabel atau cerita nyata yang memuat lebih banyak data daripada yang sebenarnya dibutuhkan untuk menjawab satu pertanyaan tertentu. Siswa kerap merasa harus menggunakan semua angka yang ada.',
    studentBehavior:
      'Jika ada 4 angka dalam teks cerita, siswa berusaha menggabungkan keempat angka tersebut dalam satu perhitungan panjang.',
    literacyImpact:
      'Lemah dalam keterampilan membaca kritis (critical reading) dan evaluasi relevansi data.',
    numeracyImpact:
      'Terjadi over-computation (perhitungan berlebihan) yang menghasilkan nilai yang tidak logis.',
    reflectionQuestion:
      'Pernahkah saya memberikan soal yang memuat informasi lebih/tidak perlu untuk melatih kepekaan seleksi data siswa?',
    practicalTip:
      'Berikan latihan "Detektif Informasi": siswa mencoret kalimat atau angka yang tidak diperlukan untuk menjawab pertanyaan.',
  },
  {
    id: 6,
    title: 'Siswa langsung menghitung tanpa memahami masalah',
    summary:
      'Kebiasaan "reaksi kilat" menghitung angka tanpa membentuk perencanaan logis atau estimasi jawaban.',
    explanation:
      'Budaya belajar yang terlalu mengagungkan kecepatan sering membuat siswa takut dianggap lambat. Akibatnya, mereka langsung menerapkan rumus hafalan tanpa memeriksa apakah masuk akal hasil tersebut.',
    studentBehavior:
      'Hanya dalam 5 detik setelah soal dibagikan, siswa langsung mencakar angka tanpa jeda hening untuk membaca dan merenung.',
    literacyImpact:
      'Ketiadaan metakognisi: siswa tidak memantau apakah proses berpikirnya masuk akal atau tidak.',
    numeracyImpact:
      'Tidak memiliki kepekaan nalar (number sense) dan tidak pernah melakukan pemeriksaan ulang terhadap kelogisan hasil.',
    reflectionQuestion:
      'Apakah saya lebih sering memuji siswa yang menjawab paling cepat daripada siswa yang mampu menjelaskan alasan logis jawabannya?',
    practicalTip:
      'Terapkan aturan "3 Menit Hening Membaca": pensil tidak boleh dipegang selama 3 menit pertama saat membaca soal cerita.',
  },
];

export const PROBLEM_FLOW_STEPS: ProblemFlowStep[] = [
  {
    id: 1,
    step: '1. Membaca Informasi',
    subtitle: 'Membaca Teks / Tabel / Diagram',
    whatStudentShouldDo:
      'Membaca keseluruhan teks secara saksama dengan tempo wajar, membayangkan suasana atau alur cerita nyata yang disajikan.',
    commonMistakes:
      'Membaca tergesa-gesa, melompati paragraf pembuka, dan langsung mencari letak angka-angka.',
    teacherGuidingQuestions: [
      'Siapa tokoh atau benda yang diceritakan dalam bacaan ini?',
      'Di mana dan kapan peristiwa dalam cerita ini terjadi?',
    ],
    simpleActionExample:
      'Guru meminta satu siswa membacakan teks dengan intonasi jelas, lalu meminta siswa lain menceritakan ringkasannya.',
  },
  {
    id: 2,
    step: '2. Memahami Isi',
    subtitle: 'Membangun Model Mental',
    whatStudentShouldDo:
      'Mengartikan makna situasi: apakah benda bertambah, berkurang, dibagi rata, diperkecil perbandingannya, atau berubah wujud.',
    commonMistakes:
      'Mengira bahwa cerita hanyalah pemanis tanpa menyadari bahwa konteks menentukan aturan hitungnya.',
    teacherGuidingQuestions: [
      'Menurutmu, apa yang sedang dialami oleh tokoh dalam soal ini?',
      'Kira-kira nanti hasilnya akan lebih banyak atau lebih sedikit dari keadaan awal?',
    ],
    simpleActionExample:
      'Ajak siswa membuat sketsa gambar sederhana atau garis bilangan untuk memvisualkan keadaan dalam soal.',
  },
  {
    id: 3,
    step: '3. Menentukan Info Penting',
    subtitle: 'Menyaring Fakta & Angka Kunci',
    whatStudentShouldDo:
      'Mengidentifikasi besaran, satuan, rasio, dan fakta kunci yang relevan, serta mengabaikan informasi pengecoh.',
    commonMistakes:
      'Menyalin semua angka tanpa menuliskan satuannya (misal menulis 14.000 tanpa tahu itu harga beras per kg atau per karung).',
    teacherGuidingQuestions: [
      'Data apa saja yang sudah kita miliki dari cerita?',
      'Apakah angka 3 itu menunjukkan jumlah anak, kilogram beras, atau jumlah hari?',
    ],
    simpleActionExample:
      'Minta siswa membuat daftar "Diketahui:" dengan format [Nama Nilai] = [Jumlah] + [Satuan].',
  },
  {
    id: 4,
    step: '4. Menemukan Pertanyaan',
    subtitle: 'Menetapkan Target Pemecahan',
    whatStudentShouldDo:
      'Menemukan kalimat tanya utama dan merumuskan sasaran akhir yang harus dicapai dalam satu kalimat lugas.',
    commonMistakes:
      'Menjawab pertanyaan perantara (sub-soal) tapi lupa menjawab pertanyaan pokok yang sebenarnya diajukan.',
    teacherGuidingQuestions: [
      'Bagian mana dari soal yang menunjukkan kalimat tanya?',
      'Apakah yang diminta harga seluruh belanjaan atau uang kembaliannya?',
    ],
    simpleActionExample:
      'Siswa mewarnai tanda tanya (?) dan menggarisbawahi frasa target: "Berapa uang kembalian...".',
  },
  {
    id: 5,
    step: '5. Memilih Strategi Hitung',
    subtitle: 'Menghubungkan Nalar dengan Operasi',
    whatStudentShouldDo:
      'Menentukan operasi hitung (tambah, kurang, kali, bagi, perbandingan, persentase) dengan alasan logis yang kuat.',
    commonMistakes:
      'Menebak operasi: "Karena ada uang besar dan kecil, langsung saya kurangkan saja!".',
    teacherGuidingQuestions: [
      'Mengapa kita harus mengalikan 3 dengan 14.000 terlebih dahulu?',
      'Operasi apa yang cocok untuk mencari uang kembalian setelah tahu total belanja?',
    ],
    simpleActionExample:
      'Siswa menuliskan kalimat nalar: "Hitung total harga beras dulu (kali), baru kurangkan dari uang bayar (kurang)".',
  },
  {
    id: 6,
    step: '6. Menyelesaikan Soal',
    subtitle: 'Kalkulasi Matematis Akurat',
    whatStudentShouldDo:
      'Melakukan eksekusi perhitungan langkah demi langkah dengan teliti dan rapi sesuai urutan operasi.',
    commonMistakes:
      'Ceroboh pada perhitungan dasar (salah perkalian dasar, lupa menyimpan pada penjumlahan, atau salah meletakkan nol).',
    teacherGuidingQuestions: [
      'Berapa hasil kali 3 × 14.000? Coba periksa kembali susunan perkalianmu.',
      'Berapa 50.000 dikurangi 42.000?',
    ],
    simpleActionExample:
      'Gunakan perhitungan bertingkat yang rapi di kertas cakar dengan nilai tempat ratusan dan ribuan yang lurus.',
  },
  {
    id: 7,
    step: '7. Menjelaskan Jawaban',
    subtitle: 'Komunikasi & Validasi Hasil',
    whatStudentShouldDo:
      'Menuliskan kesimpulan akhir dengan satuan lengkap serta memeriksa apakah hasilnya logis dan masuk akal di dunia nyata.',
    commonMistakes:
      'Hanya menuliskan angka hasil akhir (misal "8000") tanpa satuan dan tanpa kalimat penjelas kesimpulan.',
    teacherGuidingQuestions: [
      'Apakah masuk akal jika kembaliannya Rp8.000 bila ia belanja Rp42.000 dengan uang Rp50.000?',
      'Bagaimana kamu meyakinkan temanmu bahwa jawabanmu ini tepat?',
    ],
    simpleActionExample:
      'Siswa menuliskan kalimat lengkap: "Jadi, uang kembalian yang diterima Ibu adalah sebesar Rp8.000."',
  },
];

export const GERAK_STAGES: GerakStage[] = [
  {
    letter: 'G',
    title: 'Gali Masalah Berbasis Data',
    description:
      'Melakukan observasi kelas, analisis hasil belajar, dan dialog dengan kepala sekolah untuk menemukan masalah nyata pembelajaran.',
    evidenceExamples: [
      'Hasil asesmen awal/diagnostik literasi dan numerasi siswa',
      'Lembar jawaban siswa pada soal cerita kontekstual',
      'Instrumen catatan observasi pembelajaran guru di kelas',
      'Catatan harian guru mengenai kendala siswa saat bernalar',
      'Hasil diskusi terfokus dengan Kepala Sekolah binaan',
    ],
    guidingQuestions: [
      'Fakta apa yang paling sering muncul dari lembar jawaban siswa pada soal cerita?',
      'Apakah siswa kesulitan pada kalkulasi angka atau pada saat mengartikan kalimat soal?',
      'Bagaimana pola interaksi guru saat membimbing siswa membaca teks soal?',
    ],
    keyActions: [
      'Menganalisis 10-15 sampel lembar kerja siswa acak di SD/SMP binaan',
      'Mengelompokkan tipe kesalahan (salah baca, salah paham tanya, atau salah hitung)',
      'Menyusun profil awal mutu nalar literasi-numerasi kelas dampingan',
    ],
  },
  {
    letter: 'E',
    title: 'Evaluasi dan Refleksi Bersama',
    description:
      'Memfasilitasi diskusi reflektif dengan kepala sekolah dan guru berbasis data tanpa menyalahkan, guna menumbuhkan kesadaran perbaikan.',
    evidenceExamples: [
      'Notula dialog coaching supervisi akademik',
      'Lembar refleksi diri guru tentang kebiasaan mengajar',
      'Peta identifikasi kekuatan dan area pembenahan guru',
    ],
    guidingQuestions: [
      'Apa praktik baik yang sudah berjalan efektif di kelas Ibu/Bapak?',
      'Pada bagian mana siswa tampak paling bingung saat menghadapi soal bertingkat?',
      'Bagaimana perasaan guru saat melihat siswa terburu-buru menghitung sebelum paham?',
    ],
    keyActions: [
      'Menghadirkan bukti kerja siswa secara ramah dan profesional di meja diskusi',
      'Mengajukan pertanyaan pemantik apresiatif (Appreciative Inquiry)',
      'Menyepakati fokus prioritas pembenahan tanpa tekanan administratif',
    ],
  },
  {
    letter: 'R',
    title: 'Rancang Solusi Pendampingan',
    description:
      'Menyusun strategi perbaikan pembelajaran yang sederhana, kontekstual, dan dapat langsung diterapkan guru pada tema pelajaran berikutnya.',
    evidenceExamples: [
      'Rencana Aksi Penerapan Strategi Pembelajaran (RTL)',
      'Modul ajar/RPP yang disisipkan strategi "Baca, Tandai, Tanya"',
      'Lembar kerja siswa (LKS) berbasis temu nalar kontekstual',
    ],
    guidingQuestions: [
      'Strategi praktis apa yang paling realistis dicoba dalam 2 pekan ke depan?',
      'Bagaimana kita mengaitkan soal cerita dengan kearifan lokal Tellu Limpoe / Sidrap?',
      'Dukungan apa yang dibutuhkan guru dari Kepala Sekolah?',
    ],
    keyActions: [
      'Memilih 1-2 strategi inti (misal: "Baca, Tandai, Tanya" atau "Jelaskan Jawaban")',
      'Merancang lembar kerja terbimbing (scaffolding) yang memisahkan tahap nalar dan hitung',
      'Menentukan jadwal pelaksanaan dan indikator keberhasilan yang terukur',
    ],
  },
  {
    letter: 'A',
    title: 'Aksi Pendampingan Nyata',
    description:
      'Mendampingi kepala sekolah dalam supervisi akademik dan pembinaan guru melalui praktik langsung, co-teaching, atau pemodelan di kelas.',
    evidenceExamples: [
      'Foto/catatan pelaksanaan pendampingan langsung (coaching in-class)',
      'Lembar observasi perkembangan interaksi siswa saat berdiskusi',
      'Rekaman umpan balik langsung (constructive post-conference)',
    ],
    guidingQuestions: [
      'Apakah siswa mulai berani mengemukakan alasan sebelum menghitung?',
      'Bagaimana guru merespons saat siswa memberikan jawaban yang belum tepat?',
      'Apakah suasana kelas menjadi lebih dialogis dan kritis?',
    ],
    keyActions: [
      'Pengawas atau Kepala Sekolah melakukan pendampingan pendampingan langsung di ruang kelas',
      'Memberikan contoh bagaimana mengajukan pertanyaan nalar kepada siswa',
      'Melakukan umpan balik hangat dan solutif segera setelah sesi kelas selesai',
    ],
  },
  {
    letter: 'K',
    title: 'Kolaborasi Lintas Sekolah',
    description:
      'Mengembangkan komunitas belajar (Kombel / KKG / MGMP) antar kepala sekolah dan guru untuk berbagi praktik baik dan saling menguatkan.',
    evidenceExamples: [
      'Dokumentasi pertemuan Komunitas Belajar tingkat Gugus / Kecamatan Tellu Limpoe',
      'Bank soal cerita kontekstual hasil kolaborasi guru SD & SMP',
      'Jurnal refleksi bersama antar-sekolah binaan',
    ],
    guidingQuestions: [
      'Praktik baik apa dari sekolah Ibu/Bapak yang bisa diadaptasi oleh sekolah lain?',
      'Bagaimana menjaga konsistensi pembiasaan literasi-numerasi lintas jenjang?',
      'Apa tindak lanjut bersama untuk siklus pendampingan berikutnya?',
    ],
    keyActions: [
      'Menjadwalkan temu nalar berkala antar-guru di Kecamatan Tellu Limpoe',
      'Membagikan karya lembar belajar terbaik ke repositori komunitas',
      'Merayakan kemajuan belajar siswa bersama kepala sekolah dan pengawas',
    ],
  },
];

export const BERDAMPAK_STAGES: BerdampakStage[] = [
  {
    letter: 'B',
    stepNumber: 1,
    title: 'Berbasis Data Perubahan',
    description:
      'Menggunakan data nyata sebagai dasar melihat perkembangan pembelajaran sebelum dan sesudah intervensi dilakukan.',
    activityFocus:
      'Pengumpulan data baseline: persentase siswa yang mampu membedakan informasi penting dan kalimat tanya.',
    exampleAction:
      'Memberikan 2 soal cerita diagnostik awal dan mencatat proporsi siswa yang langsung menghitung tanpa membaca.',
    evidenceCollected:
      'Tabel rekapitulasi data awal kemampuan literasi-numerasi kelas sasaran.',
    successIndicator:
      'Tersedia data dasar (baseline) yang akurat dari minimal 80% siswa di kelas dampingan.',
    badgeColor: 'bg-blue-500 text-white',
  },
  {
    letter: 'E',
    stepNumber: 2,
    title: 'Evaluasi Berkelanjutan',
    description:
      'Melakukan evaluasi secara terus-menerus terhadap proses pelaksanaan dan perkembangan nalar siswa tanpa menunggu ujian akhir.',
    activityFocus:
      'Observasi mingguan terhadap perubahan kebiasaan belajar siswa saat menghadapi teks soal.',
    exampleAction:
      'Guru mengecek apakah siswa konsisten menandai informasi diketahui dan ditanyakan pada tugas harian.',
    evidenceCollected:
      'Rubrik ceklis berkala kebiasaan literasi-numerasi mingguan.',
    successIndicator:
      'Peningkatan konsistensi siswa dalam menandai teks soal mencapai minimal 70%.',
    badgeColor: 'bg-teal-500 text-white',
  },
  {
    letter: 'R',
    stepNumber: 3,
    title: 'Refleksi Mendalam',
    description:
      'Mendorong guru dan kepala sekolah melakukan refleksi kritis terhadap praktik mengajar dan suasana dialog kelas.',
    activityFocus:
      'Dialog mingguan: "Apakah pembelajaran matematika saya sudah memberi ruang berbicara bagi siswa?"',
    exampleAction:
      'Mengisi instrumen refleksi mandiri 7 poin secara jujur dan mendiskusikannya dengan rekan sejawat.',
    evidenceCollected:
      'Lembar isian instrumen refleksi guru dengan catatan kesadaran baru.',
    successIndicator:
      'Guru mampu merumuskan minimal 1 kekuatan mengajar dan 1 area pembenahan diri.',
    badgeColor: 'bg-indigo-500 text-white',
  },
  {
    letter: 'D',
    stepNumber: 4,
    title: 'Dampak pada Pembelajaran',
    description:
      'Memastikan perubahan nyata tampak pada aktivitas berpikir kritis siswa dan kualitas proses belajar di kelas.',
    activityFocus:
      'Siswa tidak lagi takut bertanya, terbiasa berargumen, dan saling mengoreksi langkah hitung.',
    exampleAction:
      'Siswa mampu mempresentasikan cara berpikirnya di depan kelas dengan kalimat runtut dan percaya diri.',
    evidenceCollected:
      'Rekaman video pendek atau foto portofolio penjelasan jawaban siswa.',
    successIndicator:
      'Minimal 75% siswa aktif menjelaskan alasan di balik pemilihan operasi hitung.',
    badgeColor: 'bg-emerald-500 text-white',
  },
  {
    letter: 'A',
    stepNumber: 5,
    title: 'Aksi Lanjutan',
    description:
      'Melakukan tindak lanjut terarah berdasarkan temuan evaluasi agar dampak positif semakin meluas dan menetap.',
    activityFocus:
      'Menyesuaikan tingkat kesulitan soal kontekstual dari taraf dasar menuju soal pemecahan masalah kompleks.',
    exampleAction:
      'Menyusun variasi soal cerita yang mengangkat konteks lokal pertanian Tellu Limpoe yang lebih kaya data.',
    evidenceCollected:
      'Kumpulan instrumen soal pengayaan dan remedial berbasis diferensiasi kemampuan siswa.',
    successIndicator:
      'Tersedia rencana tindak lanjut (RTL) tertulis yang dilaksanakan sesuai jadwal.',
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    letter: 'M',
    stepNumber: 6,
    title: 'Monitoring Rutin',
    description:
      'Melaksanakan pemantauan secara berkala oleh pengawas dan kepala sekolah dengan prinsip kemitraan yang memberdayakan.',
    activityFocus:
      'Kunjungan supervisi akademik yang hangat untuk mengamati perkembangan implementasi strategi di kelas.',
    exampleAction:
      'Pengawas menyapa guru, mengamati dinamika kelas selama 30 menit, lalu memberikan apresiasi spesifik.',
    evidenceCollected:
      'Lembar instrumen monitoring supervisi akademik berdampak.',
    successIndicator:
      'Kunjungan monitoring terlaksana minimal 2 kali dalam satu siklus pendampingan.',
    badgeColor: 'bg-sky-600 text-white',
  },
  {
    letter: 'P',
    stepNumber: 7,
    title: 'Perbaikan Berkelanjutan',
    description:
      'Mengembangkan dan menyempurnakan strategi pendampingan agar semakin fleksibel dan sesuai kebutuhan tiap guru.',
    activityFocus:
      'Memperbaiki modul dan lembar scaffolding bagi siswa yang masih mengalami hambatan membaca.',
    exampleAction:
      'Menambahkan gambar ilustrasi visual pada soal cerita untuk membantu siswa yang butuh jembatan visual.',
    evidenceCollected:
      'Revisi bahan ajar dan modul pendampingan yang telah diujicobakan.',
    successIndicator:
      'Semua siswa, termasuk siswa dengan hambatan belajar, mendapatkan bantuan yang sesuai (scaffolding).',
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    letter: 'A',
    stepNumber: 8,
    title: 'Aktivasi Ekosistem Belajar',
    description:
      'Mendorong keterlibatan aktif semua pihak: guru kelas, guru mapel, kepala sekolah, orang tua, dan komunitas belajar.',
    activityFocus:
      'Membangun budaya literasi-numerasi di lingkungan sekolah dan pojok baca kelas.',
    exampleAction:
      'Memajang karya nalar siswa di mading kelas dan mengabarkan kemajuan siswa kepada orang tua.',
    evidenceCollected:
      'Dokumentasi mading literasi-numerasi dan catatan pelibatan orang tua.',
    successIndicator:
      'Terbentuknya suasana sekolah yang merayakan proses berpikir kritis anak.',
    badgeColor: 'bg-orange-500 text-white',
  },
  {
    letter: 'K',
    stepNumber: 9,
    title: 'Kinerja Nyata',
    description:
      'Menunjukkan hasil konkret berupa peningkatan mutu pembelajaran, rapor pendidikan, dan kemandirian berpikir siswa.',
    activityFocus:
      'Peningkatan capaian literasi dan numerasi sekolah yang terverifikasi dalam asesmen berkala.',
    exampleAction:
      'Menghitung lonjakan persentase siswa yang tuntas memecahkan masalah kontekstual pada akhir periode.',
    evidenceCollected:
      'Laporan capaian akhir pendampingan pengawas sekolah dan portofolio mutu sekolah.',
    successIndicator:
      'Kenaikan signifikan pada skor nalar numerasi dan kepuasan guru terhadap budaya mengajar.',
    badgeColor: 'bg-green-600 text-white',
  },
];

export const LAB_QUESTIONS: LabQuestion[] = [
  {
    id: 'soal-sd-1',
    level: 'SD',
    topic: 'Operasi Campuran Kehidupan Sehari-hari (Beras Ibu)',
    contextTag: 'Kebutuhan Dapur & Transaksi Pasar',
    story:
      'Ibu membeli 3 kg beras dengan harga Rp14.000 per kilogram. Ibu membayar dengan uang Rp50.000. Berapa uang kembalian yang diterima Ibu?',
    options: [
      {
        id: 'opt-a',
        text: 'Rp42.000',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Angka Rp42.000 adalah total harga 3 kg beras (3 × Rp14.000). Coba periksa kembali kalimat tanya: apakah yang ditanyakan harga seluruh beras atau uang kembalian yang diterima Ibu?',
      },
      {
        id: 'opt-b',
        text: 'Rp36.000',
        isCorrect: false,
        diagnosticCategory: 'pemilihan-operasi',
        explanation:
          'Belum tepat. Tampaknya kamu langsung mengurangkan Rp50.000 dengan Rp14.000. Ingat, beras yang dibeli Ibu bukan hanya 1 kg, melainkan 3 kg. Hitung dulu total harga berasnya!',
      },
      {
        id: 'opt-c',
        text: 'Rp8.000',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Benar sekali! Kamu sudah sangat teliti: memahami informasi (3 kg @ Rp14.000 = Rp42.000), menentukan yang ditanyakan (uang kembalian), lalu memilih operasi hitung yang sesuai (Rp50.000 − Rp42.000 = Rp8.000). Hebat!',
      },
      {
        id: 'opt-d',
        text: 'Rp64.000',
        isCorrect: false,
        diagnosticCategory: 'pemilihan-operasi',
        explanation:
          'Belum tepat. Angka Rp64.000 diperoleh jika Rp50.000 dijumlahkan dengan Rp14.000. Dalam transaksi jual beli, uang kembalian dicari dengan mengurangkan uang pembayaran terhadap total harga barang, bukan menjumlahkannya.',
      },
    ],
    reveals: {
      diketahui: [
        'Harga beras: Rp14.000 per kilogram',
        'Jumlah beras yang dibeli: 3 kilogram',
        'Uang yang diserahkan/dibayarkan: Rp50.000',
      ],
      ditanyakan: 'Berapa uang kembalian yang diterima Ibu?',
      informasiPenting: [
        'Ada 2 langkah nalar: Pertama mencari total belanjaan, Kedua mencari sisa uang kembalian.',
        'Harga Rp14.000 berlaku untuk 1 kg, sehingga untuk 3 kg harus dikalikan 3.',
        'Kembalian = Uang yang dibayarkan dikurangi Total harga belanjaan.',
      ],
      operasiHitung: {
        steps: [
          'Langkah 1 (Total Harga Beras) = 3 × Rp14.000 = Rp42.000',
          'Langkah 2 (Uang Kembalian) = Rp50.000 − Rp42.000 = Rp8.000',
        ],
        result: 'Rp8.000',
      },
      jawabanAkhir:
        'Jadi, uang kembalian yang diterima Ibu dari kasir adalah Rp8.000.',
      penjelasanNalar:
        'Siswa yang menjawab Rp42.000 sebenarnya sudah bisa menghitung perkalian, namun berhenti di tengah jalan karena lupa pada tujuan pertanyaan utama (kembalian). Guru perlu membimbing siswa membaca ulang kalimat terakhir soal sebelum menyimpulkan jawaban.',
    },
    teacherDiagnosticNotes:
      'Distraktor Rp42.000 menandakan siswa gagal menyelesaikan tujuan soal (berhenti di sub-tahap). Distraktor Rp36.000 menandakan siswa mengabaikan kuantitas pengali 3 kg.',
  },
  {
    id: 'soal-sd-2',
    level: 'SD',
    topic: 'Pembagian dan Sisa (Panen Jagung Tellu Limpoe)',
    contextTag: 'Pertanian Tellu Limpoe, Sidrap',
    story:
      'Pak Ambo di Desa Tellu Limpoe memanen 85 kg jagung manis. Pak Ambo memasukkan jagung tersebut ke dalam 6 karung dengan berat yang sama banyak. Sisa jagung yang tidak muat ke dalam karung akan dimasak sendiri di rumah. Berapa kilogram jagung yang dimasukkan ke setiap karung, dan berapa kilogram jagung yang dimasak sendiri?',
    options: [
      {
        id: 'opt-2a',
        text: '14 kg setiap karung, sisa 1 kg dimasak sendiri',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Luar biasa tepat! Kamu memahami makna pembagian bersisa: 85 dibagi 6 menghasilkan 14 (karena 14 × 6 = 84) dengan sisa 1 kg yang dimasak sendiri. Penalarannya sangat utuh!',
      },
      {
        id: 'opt-2b',
        text: '14 kg setiap karung tanpa sisa',
        isCorrect: false,
        diagnosticCategory: 'hitung-teknis',
        explanation:
          'Belum tepat. Coba periksa: 14 dikali 6 baru 84 kg, padahal hasil panen Pak Ambo ada 85 kg. Ke manakah 1 kg jagung sisanya?',
      },
      {
        id: 'opt-2c',
        text: '15 kg setiap karung, sisa 5 kg',
        isCorrect: false,
        diagnosticCategory: 'pemilihan-operasi',
        explanation:
          'Belum tepat. Jika setiap karung berisi 15 kg, maka 6 karung membutuhkan 6 × 15 = 90 kg jagung. Padahal jagung Pak Ambo hanya ada 85 kg (tidak cukup).',
      },
      {
        id: 'opt-2d',
        text: '79 kg di karung dan 6 kg dimasak',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Kamu langsung mengurangkan 85 dengan 6. Ingat, angka 6 adalah jumlah karung wadah pembagi yang sama banyak, bukan jumlah kilogram jagung yang dimasak.',
      },
    ],
    reveals: {
      diketahui: [
        'Total panen jagung Pak Ambo = 85 kg',
        'Jumlah karung pembagi = 6 karung (dibagi sama banyak)',
        'Jagung sisa = dimasak sendiri di rumah',
      ],
      ditanyakan:
        'Berapa kg jagung per karung DAN berapa kg jagung yang dimasak sendiri (sisa)?',
      informasiPenting: [
        'Konsep pembagian dengan sisa (division with remainder) pada situasi nyata.',
        'Tidak boleh ada angka desimal karena jagung yang sisa utuh dimasak sendiri.',
      ],
      operasiHitung: {
        steps: [
          '85 ÷ 6 = 14 dengan sisa 1',
          'Pembuktian: (14 × 6) + 1 = 84 + 1 = 85 kg',
        ],
        result: '14 kg tiap karung, sisa 1 kg',
      },
      jawabanAkhir:
        'Setiap karung berisi 14 kg jagung, dan 1 kg jagung sisanya dimasak sendiri oleh keluarga Pak Ambo.',
      penjelasanNalar:
        'Siswa sering kesulitan membedakan konsep pembagian desimal dengan pembagian bersisa kontekstual. Dalam kehidupan bertani nyata di Tellu Limpoe, sisa pembagian adalah benda fisik yang memiliki kegunaan terpisah.',
    },
    teacherDiagnosticNotes:
      'Perhatikan apakah siswa terjebak mengurangkan 85 - 6 (gejala siswa langsung menghitung dua angka yang terlihat).',
  },
  {
    id: 'soal-smp-1',
    level: 'SMP',
    topic: 'Persentase dan Diskon (Koperasi Siswa Tellu Limpoe)',
    contextTag: 'Aritmetika Sosial & Keuangan Sekolah',
    story:
      'Toko Seragam Berkah di Tellu Limpoe memberikan promo diskon 20% untuk pembelian satu stel pakaian seragam sekolah seharga Rp180.000. Jika pembeli membayar dengan selembar uang seratus ribu rupiah dan selembar uang lima puluh ribu rupiah, berapa rupiah uang kembalian yang akan diterima?',
    options: [
      {
        id: 'opt-smp1-a',
        text: 'Rp36.000',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Angka Rp36.000 adalah besaran potongan harga (diskon 20% dari Rp180.000), bukan uang kembalian pembeli. Periksa kembali: berapa uang yang dibayarkan dan berapa harga setelah diskon?',
      },
      {
        id: 'opt-smp1-b',
        text: 'Rp144.000',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Rp144.000 adalah harga bersih seragam setelah dipotong diskon (Rp180.000 − Rp36.000). Yang ditanyakan soal adalah uang kembalian dari uang yang dibayarkan pembeli.',
      },
      {
        id: 'opt-smp1-c',
        text: 'Rp6.000',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Sempurna! Kamu melalui seluruh tahapan temu nalar: menghitung diskon (Rp36.000), mencari harga bayar (Rp144.000), menghitung total uang tunai yang diserahkan (Rp100.000 + Rp50.000 = Rp150.000), lalu mencari kembalian (Rp150.000 − Rp144.000 = Rp6.000).',
      },
      {
        id: 'opt-smp1-d',
        text: 'Rp10.000',
        isCorrect: false,
        diagnosticCategory: 'hitung-teknis',
        explanation:
          'Belum tepat. Coba periksa kembali pengurangan Rp150.000 dengan Rp144.000. Lakukan kalkulasi dengan teliti.',
      },
    ],
    reveals: {
      diketahui: [
        'Harga awal seragam = Rp180.000',
        'Persentase diskon = 20%',
        'Uang yang diserahkan pembeli = Rp100.000 + Rp50.000 = Rp150.000',
      ],
      ditanyakan: 'Berapa rupiah uang kembalian yang diterima pembeli?',
      informasiPenting: [
        'Tiga tahap nalar: (1) Menghitung nilai diskon, (2) Menghitung harga akhir yang harus dibayar, (3) Menghitung uang kembalian.',
        'Informasi uang pembeli disajikan secara verbal implisit ("selembar seratus ribu dan selembar lima puluh ribu").',
      ],
      operasiHitung: {
        steps: [
          'Besar Diskon = 20/100 × Rp180.000 = Rp36.000',
          'Harga Setelah Diskon = Rp180.000 − Rp36.000 = Rp144.000',
          'Total Uang Pembayaran = Rp100.000 + Rp50.000 = Rp150.000',
          'Uang Kembalian = Rp150.000 − Rp144.000 = Rp6.000',
        ],
        result: 'Rp6.000',
      },
      jawabanAkhir:
        'Jadi, uang kembalian yang diterima pembeli seragam adalah Rp6.000.',
      penjelasanNalar:
        'Soal ini menguji apakah siswa berhenti pada jawaban antara (misal berhenti pada nilai diskon Rp36.000 atau harga bersih Rp144.000). Guru perlu menekankan pentingnya membaca kembali kalimat tanya pada akhir paragraf soal sebelum menjawab.',
    },
    teacherDiagnosticNotes:
      'Banyak siswa SMP keliru mengira pertanyaan selesai ketika mereka sudah berhasil menemukan harga setelah diskon (Rp144.000). Ini indikator kuat kelemahan memantau tujuan akhir soal.',
  },
  {
    id: 'soal-smp-2',
    level: 'SMP',
    topic: 'Penyajian Data Tabel (Produksi Gabah Desa di Kec. Tellu Limpoe)',
    contextTag: 'Data Pertanian & Rata-rata / Selisih',
    story:
      'Data hasil panen gabah di empat desa di Kecamatan Tellu Limpoe pada musim tanam lalu adalah sebagai berikut:\n• Desa Pajalele: 48 ton\n• Desa Teteaji: 54 ton\n• Desa Baula: 38 ton\n• Desa Polewali: 60 ton\n\nKepala BPP Pertanian ingin mengetahui selisih antara desa penghasil gabah tertinggi dengan rata-rata hasil panen gabah dari keempat desa tersebut. Berapa ton selisihnya?',
    options: [
      {
        id: 'opt-smp2-a',
        text: '22 ton',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. 22 ton adalah selisih antara desa tertinggi (Desa Polewali: 60 ton) dengan desa terendah (Desa Baula: 38 ton). Pertanyaan meminta selisih antara hasil tertinggi dengan rata-rata keempat desa.',
      },
      {
        id: 'opt-smp2-b',
        text: '10 ton',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Tepat sekali! Rata-rata keempat desa adalah (48 + 54 + 38 + 60) ÷ 4 = 200 ÷ 4 = 50 ton. Desa tertinggi adalah Polewali (60 ton). Selisihnya = 60 ton − 50 ton = 10 ton. Nalar membaca datamu sangat runtut!',
      },
      {
        id: 'opt-smp2-c',
        text: '50 ton',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. 50 ton adalah nilai rata-rata dari keempat desa. Soal meminta selisih antara desa tertinggi dengan nilai rata-rata tersebut.',
      },
      {
        id: 'opt-smp2-d',
        text: '12 ton',
        isCorrect: false,
        diagnosticCategory: 'hitung-teknis',
        explanation:
          'Belum tepat. Coba periksa kembali perhitungan jumlah total (48 + 54 + 38 + 60) dan pembagiannya dengan 4.',
      },
    ],
    reveals: {
      diketahui: [
        'Desa Pajalele = 48 ton',
        'Desa Teteaji = 54 ton',
        'Desa Baula = 38 ton',
        'Desa Polewali = 60 ton',
        'Desa dengan panen tertinggi = Desa Polewali (60 ton)',
        'Jumlah desa = 4 desa',
      ],
      ditanyakan:
        'Berapa ton selisih antara desa tertinggi dengan rata-rata hasil panen keempat desa?',
      informasiPenting: [
        'Siswa harus menentukan 2 hal terlebih dahulu: Nilai tertinggi dan Nilai rata-rata.',
        'Operasi: Penjumlahan total ton, Pembagian rata-rata, lalu Pengurangan untuk mencari selisih.',
      ],
      operasiHitung: {
        steps: [
          'Total Gabah = 48 + 54 + 38 + 60 = 200 ton',
          'Rata-rata = 200 ton ÷ 4 desa = 50 ton per desa',
          'Nilai Tertinggi = 60 ton (Desa Polewali)',
          'Selisih = 60 ton − 50 ton = 10 ton',
        ],
        result: '10 ton',
      },
      jawabanAkhir:
        'Selisih antara hasil panen desa tertinggi dengan rata-rata keempat desa adalah 10 ton.',
      penjelasanNalar:
        'Siswa yang memilih 22 ton terkecoh oleh definisi umum kata "selisih" yang biasanya mengurangkan nilai maksimum dengan nilai minimum. Di sinilah letak pentingnya literasi: mencocokkan kata dengan kalimat pelengkapnya.',
    },
    teacherDiagnosticNotes:
      'Latih siswa mengurai frasa majemuk "selisih antara [X] dengan [Y]" dengan mendefinisikan X secara mandiri, mendefinisikan Y secara mandiri, baru kemudian mengurangkan keduanya.',
  },
  {
    id: 'soal-smp-3',
    level: 'SMP',
    topic: 'Kecepatan, Jarak, dan Waktu (Tellu Limpoe ke Pangkajene)',
    contextTag: 'Transportasi Lokal Sidenreng Rappang',
    story:
      'Pak Guru Heri mengendarai sepeda motor dari Tellu Limpoe menuju Pangkajene (ibu kota Kabupaten Sidrap) dengan jarak tempuh 36 km. Beliau berangkat pukul 06.45 pagi dan melaju dengan kecepatan rata-rata 48 km/jam. Tanpa berhenti di jalan, pada pukul berapa Pak Guru Heri tiba di Pangkajene?',
    options: [
      {
        id: 'opt-smp3-a',
        text: 'Pukul 07.21',
        isCorrect: false,
        diagnosticCategory: 'hitung-teknis',
        explanation:
          'Belum tepat. Waktu tempuh 36 km dengan kecepatan 48 km/jam adalah 36/48 jam = 3/4 jam = 45 menit. Jika berangkat 06.45, coba tambahkan 45 menit dengan benar.',
      },
      {
        id: 'opt-smp3-b',
        text: 'Pukul 07.30',
        isCorrect: true,
        diagnosticCategory: 'tepat',
        explanation:
          'Hebat sekali! Nalar waktu: Waktu tempuh = 36/48 jam = 0,75 jam = 45 menit. Pukul 06.45 ditambah 45 menit adalah pukul 07.30 pagi. Konversi jam ke menit dan penjumlahan jam kamu sangat mantap!',
      },
      {
        id: 'opt-smp3-c',
        text: 'Pukul 07.45',
        isCorrect: false,
        diagnosticCategory: 'pemilihan-operasi',
        explanation:
          'Belum tepat. Pukul 07.45 berarti waktu tempuh adalah 1 jam (60 menit). Jika kecepatan 48 km/jam dan jalan 1 jam, jarak yang ditempuh adalah 48 km, padahal jaraknya hanya 36 km.',
      },
      {
        id: 'opt-smp3-d',
        text: 'Pukul 08.00',
        isCorrect: false,
        diagnosticCategory: 'pemahaman-soal',
        explanation:
          'Belum tepat. Coba periksa kembali pembagian jarak dengan kecepatan: 36 dibagi 48 disederhanakan menjadi 3/4 jam.',
      },
    ],
    reveals: {
      diketahui: [
        'Jarak tempuh (s) = 36 km',
        'Kecepatan rata-rata (v) = 48 km/jam',
        'Waktu keberangkatan = Pukul 06.45',
      ],
      ditanyakan: 'Pada pukul berapa Pak Guru Heri tiba di Pangkajene?',
      informasiPenting: [
        'Rumus nalar: Waktu (t) = Jarak (s) ÷ Kecepatan (v).',
        'Hasil bagi dalam satuan jam (36/48 jam) harus dikonversikan ke satuan menit (dikalikan 60 menit) sebelum dijumlahkan ke jam berangkat.',
      ],
      operasiHitung: {
        steps: [
          'Waktu tempuh = 36 km ÷ 48 km/jam = 3/4 jam',
          'Konversi ke menit = 3/4 × 60 menit = 45 menit',
          'Waktu tiba = 06.45 + 45 menit = 07.30',
        ],
        result: 'Pukul 07.30',
      },
      jawabanAkhir:
        'Pak Guru Heri tiba di Pangkajene tepat pada pukul 07.30 pagi.',
      penjelasanNalar:
        'Tantangan utama di sini adalah konversi satuan waktu dari pecahan jam (3/4 jam) menjadi menit (45 menit), lalu menambahkannya pada jam menit berbasis kelipatan 60 (bukan desimal berbasis 100).',
    },
    teacherDiagnosticNotes:
      'Sering kali siswa salah menjumlahkan 06.45 + 45 menjadi 06.90 karena memperlakukan jam seperti bilangan desimal biasa. Perlu penegasan bahwa 1 jam = 60 menit.',
  },
];

export const TEACHING_STRATEGIES: TeachingStrategy[] = [
  {
    id: 1,
    number: 1,
    title: 'Strategi 1 — Baca, Tandai, Tanya',
    tagline: 'Membedakan fakta informasi dengan sasaran yang ditanyakan',
    goal: 'Membimbing siswa agar tidak tergesa-gesa menghitung dengan cara membaca perlahan, menandai data kunci dengan stabilo/garis bawah, dan merumuskan ulang kalimat tanya.',
    implementationSteps: [
      'Langkah 1 (Baca): Berikan waktu hening 2 menit bagi siswa untuk membaca teks soal cerita sebanyak 2 kali.',
      'Langkah 2 (Tandai): Siswa menggarisbawahi atau memberi warna kuning pada data angka beserta satuannya.',
      'Langkah 3 (Tanya): Siswa melingkari tanda tanya (?) dan menuliskan ulang sasaran pertanyaan dengan kalimatnya sendiri.',
    ],
    teacherScriptExample:
      '"Anak-anak hebat, letakkan pensil hitungmu dulu. Mari kita baca cerita ini bersama. Sekarang, ambil spidol atau stabilo: warnai angka dan satuannya dengan warna kuning, lalu lingkari apa yang ingin dicari dengan warna merah. Siapa yang bisa menyebutkan apa misi utama kita?"',
    studentResponseExample:
      'Siswa mampu berkata: "Misi kita bukan mencari harga beras Bu, tapi mencari berapa uang kembalian yang harus dikembalikan oleh penjual."',
    successIndicators: [
      'Minimal 85% siswa memiliki catatan garis bawah pada lembar soal',
      'Siswa dapat menyebutkan hal yang ditanyakan tanpa membaca teks kata per kata',
      'Penurunan kesalahan salah sasaran perhitungan hingga 50%',
    ],
    recommendedLevels: ['SD', 'SMP'],
  },
  {
    id: 2,
    number: 2,
    title: 'Strategi 2 — Ceritakan Kembali',
    tagline: 'Membangun pemahaman dan model mental situasi cerita',
    goal: 'Memastikan siswa memahami alur kejadian nyata dalam soal menggunakan bahasa mereka sendiri sebelum berhadapan dengan rumus atau angka matematis.',
    implementationSteps: [
      'Langkah 1 (Tutup Teks): Setelah membaca soal, minta siswa membalik lembar soalnya ke bawah.',
      'Langkah 2 (Cerita Berpasangan): Siswa menceritakan kembali peristiwa dalam soal kepada teman sebangku.',
      'Langkah 3 (Visualisasi Sederhana): Siswa menggambar sketsa kotak, lingkaran, atau alur kejadian sederhana.',
    ],
    teacherScriptExample:
      '"Tutup dulu bukunya sebentar! Bayangkan kalian sedang berada di warung Desa Tellu Limpoe bersama Ibu. Coba ceritakan kepada teman sebangkumu, apa saja yang terjadi di warung tadi dari awal sampai pulang?"',
    studentResponseExample:
      'Siswa bercerita: "Ibu saya membeli 3 bungkus beras yang beratnya masing-masing 1 kilo, harganya 14 ribu per bungkus. Terus ibu menyerahkan uang 50 ribu ke penjual warung."',
    successIndicators: [
      'Siswa mampu merekonstruksi skenario tanpa membaca teks',
      'Siswa menyadari perubahan kuantitas (bertambah/berkurang/dibagi)',
      'Siswa yang sebelumnya pasif menjadi lebih antusias bercerita',
    ],
    recommendedLevels: ['SD', 'SMP'],
  },
  {
    id: 3,
    number: 3,
    title: 'Strategi 3 — Pilih Operasi dengan Alasan',
    tagline: 'Mencegah tebak-tebakan operasi matematika',
    goal: 'Menghentikan kebiasaan siswa yang langsung menebak tambah/kurang/kali/bagi dengan menuntut adanya argumen nalar yang logis di balik pemilihan operasi.',
    implementationSteps: [
      'Langkah 1 (Diskusi Operasi): Larang siswa menghitung hasil angka terlebih dahulu.',
      'Langkah 2 (Menuliskan Alasan): Siswa menuliskan: "Saya memilih operasi [kali] KARENA [berasnya ada 3 kg yang sama harganya]."',
      'Langkah 3 (Validasi Nalar): Guru menanyakan apakah masuk akal jika operasinya diganti yang lain.',
    ],
    teacherScriptExample:
      '"Jangan hitung dulu berapa hasilnya! Siapa yang bisa menjelaskan kepada Bapak: kenapa di tahap pertama kita harus mengalikan 3 dengan 14.000, bukan mengurangkannya?"',
    studentResponseExample:
      'Siswa menjawab: "Karena Ibu beli 3 kantong dan setiap kantong harganya 14.000, jadi 14.000-nya berulang tiga kali Pak."',
    successIndicators: [
      'Siswa terbiasa menuliskan kata sambung nalar "karena..." pada lembar kerja',
      'Tidak ada lagi siswa yang asal menjumlahkan semua angka yang ada dalam soal',
      'Kemampuan nalar kritis siswa terasah secara aktif',
    ],
    recommendedLevels: ['SD', 'SMP'],
  },
  {
    id: 4,
    number: 4,
    title: 'Strategi 4 — Temukan Kesalahan (Detektif Nalar)',
    tagline: 'Melatih metakognisi dan evaluasi kritis siswa',
    goal: 'Guru menyajikan contoh jawaban yang sengaja dibuat salah atau melenceng untuk mengajak siswa menganalisis pada langkah mana kesalahan nalar terjadi.',
    implementationSteps: [
      'Langkah 1 (Sajikan Contoh Kasus): Tampilkan di papan tulis sebuah jawaban yang salah (misal jawaban Rp42.000 atau Rp64.000).',
      'Langkah 2 (Jadi Detektif): Minta siswa bekerja berpasangan mencari di mana letak kelemahan cara berpikir tersebut.',
      'Langkah 3 (Perbaiki Bersama): Siswa mempresentasikan perbaikan yang tepat tanpa menyalahkan tokoh dalam contoh.',
    ],
    teacherScriptExample:
      '"Ada siswa di kelas sebelah menjawab bahwa kembalian Ibu adalah Rp42.000. Coba kalian jadi detektif matematika: apakah cara berpikir teman ini sudah selesai, atau ada langkah yang terlewatkan?"',
    studentResponseExample:
      'Siswa menanggapi: "Teman itu baru menghitung harga belanjanya Pak! Dia belum menghitung uang kembaliannya. Rp42.000 harus dikurangkan dari uang Rp50.000!"',
    successIndicators: [
      'Siswa mampu membedakan antara kesalahan nalar (konsep) dengan kesalahan hitung teknis',
      'Siswa lebih waspada dan cermat saat memeriksa pekerjaannya sendiri',
      'Suasana kelas menjadi seru dan investigatif',
    ],
    recommendedLevels: ['SD', 'SMP'],
  },
  {
    id: 5,
    number: 5,
    title: 'Strategi 5 — Jelaskan Jawaban (Bernalar Komunikatif)',
    tagline: 'Mengomunikasikan kesimpulan secara utuh dan bermakna',
    goal: 'Membiasakan siswa menuliskan atau mengucapkan kalimat kesimpulan lengkap yang menghubungkan angka hasil hitungan dengan konteks nyata kehidupan.',
    implementationSteps: [
      'Langkah 1 (Tulis Kesimpulan): Larang lembar jawaban yang hanya berakhir dengan angka telanjang (misal "8000").',
      'Langkah 2 (Format Jadi): Wajibkan kalimat: "Jadi, [yang ditanyakan] adalah [angka] [satuan] karena [alasan ringkas]."',
      'Langkah 3 (Uji Kelogisan): Siswa bertanya pada diri sendiri: "Apakah jawaban ini masuk akal di dunia nyata?"',
    ],
    teacherScriptExample:
      '"Angka 8.000 itu artinya apa anak-anak? 8.000 ekor ayam? 8.000 butir beras? Tulislah kalimat lengkap di akhir lembar jawabanmu agar orang lain yang membaca langsung paham maksudmu!"',
    studentResponseExample:
      'Siswa menulis: "Jadi, uang kembalian yang diterima Ibu adalah Rp8.000 karena uang Rp50.000 dipotong harga belanjaan beras Rp42.000."',
    successIndicators: [
      '100% lembar jawaban siswa memiliki kalimat kesimpulan bertanda satuan jelas',
      'Siswa mampu mempresentasikan cara kerjanya di depan kelas dengan percaya diri',
      'Keterampilan literasi bahasa dan numerasi matematika berpadu secara harmonis',
    ],
    recommendedLevels: ['SD', 'SMP'],
  },
];

export const REFLECTION_QUESTIONS_GURU: ReflectionQuestion[] = [
  {
    id: 1,
    statement:
      'Saya memberi kesempatan siswa menjelaskan isi soal cerita menggunakan bahasa sendiri sebelum mereka menyentuh rumus/angka.',
    aspect: 'Pemahaman Isi & Model Mental',
    targetRole: 'guru',
  },
  {
    id: 2,
    statement:
      'Saya meminta dan membiasakan siswa menandai secara spesifik informasi yang diketahui serta informasi yang ditanyakan.',
    aspect: 'Identifikasi Informasi Kunci',
    targetRole: 'guru',
  },
  {
    id: 3,
    statement:
      'Saya membimbing siswa memilih operasi hitung berdasarkan alasan logis (kenapa kali, kenapa bagi), bukan sekadar menebak.',
    aspect: 'Nalar Pemilihan Operasi',
    targetRole: 'guru',
  },
  {
    id: 4,
    statement:
      'Saya menggunakan soal kontekstual yang dekat dan relevan dengan kehidupan siswa di lingkungan sekitar sekolah.',
    aspect: 'Kontekstualisasi Pembelajaran',
    targetRole: 'guru',
  },
  {
    id: 5,
    statement:
      'Saya memberikan umpan balik hangat terhadap proses berpikir nalar siswa, bukan hanya menyalahkan hasil akhir angka yang keliru.',
    aspect: 'Umpan Balik Konstruktif',
    targetRole: 'guru',
  },
  {
    id: 6,
    statement:
      'Saya memberi ruang dan kesempatan bagi siswa untuk berdiskusi, berargumen, dan mengomunikasikan jawabannya.',
    aspect: 'Komunikasi & Kolaborasi Siswa',
    targetRole: 'guru',
  },
  {
    id: 7,
    statement:
      'Saya menggunakan data hasil asesmen/kesulitan berpikir siswa untuk memperbaiki strategi dan perangkat mengajar di kelas berikutnya.',
    aspect: 'Pembelajaran Berbasis Bukti (Data-Driven)',
    targetRole: 'guru',
  },
];

export const REFLECTION_QUESTIONS_KS: ReflectionQuestion[] = [
  {
    id: 101,
    statement:
      'Saya memimpin dewan guru menganalisis data capaian nalar literasi-numerasi (Rapor Pendidikan & asesmen awal) untuk menentukan prioritas program dan alokasi anggaran sekolah (ARKAS/BOS).',
    aspect: 'Kepemimpinan Pembelajaran Berbasis Data',
    targetRole: 'kepala_sekolah',
  },
  {
    id: 102,
    statement:
      'Saya melaksanakan supervisi akademik rutin berorientasi coaching kemitraan untuk mengamati cara guru memandu nalar kritis siswa di kelas, bukan sekadar memeriksa kelengkapan administrasi.',
    aspect: 'Supervisi Akademik Dialogis (Coaching)',
    targetRole: 'kepala_sekolah',
  },
  {
    id: 103,
    statement:
      'Saya mengalokasikan jam khusus dan memfasilitasi Komunitas Belajar (Kombel) sekolah secara berkala agar para guru dapat membedah kesulitan nalar siswa dan merancang modul ajar bersama.',
    aspect: 'Aktivasi Komunitas Belajar (Kombel) Guru',
    targetRole: 'kepala_sekolah',
  },
  {
    id: 104,
    statement:
      'Saya memastikan tersedianya lingkungan kaya literasi-numerasi di sekolah, termasuk pojok baca kelas, stimulus visual, dan media konkret manipulatif untuk belajar bernalar.',
    aspect: 'Penyediaan Sarana & Ekosistem Nalar',
    targetRole: 'kepala_sekolah',
  },
  {
    id: 105,
    statement:
      'Saya mendorong guru mengembangkan bahan ajar kontekstual berbasis potensi lokal Tellu Limpoe / Sidrap (misal: siklus pertanian padi sawah, peternakan lokal, energi kincir angin PLTB).',
    aspect: 'Dukungan Kontekstualisasi Kearifan Lokal',
    targetRole: 'kepala_sekolah',
  },
  {
    id: 106,
    statement:
      'Saya membangun iklim sekolah yang aman, suportif, dan apresiatif sehingga guru dan siswa berani mencoba inovasi pembelajaran tanpa takut dinilai salah.',
    aspect: 'Budaya Sekolah Ramah Eksplorasi & Inovasi',
    targetRole: 'kepala_sekolah',
  },
  {
    id: 107,
    statement:
      'Saya proaktif berdialog dengan Pengawas Sekolah dalam alur GERAK serta mendukung guru berkolaborasi lintas sekolah binaan di wilayah Kecamatan Tellu Limpoe.',
    aspect: 'Kemitraan Pengawasan & Kolaborasi Antar-Sekolah',
    targetRole: 'kepala_sekolah',
  },
];

export const REFLECTION_QUESTIONS: ReflectionQuestion[] = REFLECTION_QUESTIONS_GURU;

export const INITIAL_IMPACT_DATA: ImpactData = {
  schoolCount: 25,
  reflectionTeacherCount: 48,
  actionPlanCount: 36,
  strategyImplementedCount: 42,
  sampleClass: 'Kelas V SD & Kelas VII SMP di Tellu Limpoe',
  totalStudents: 30,
  beforeCount: 15,
  afterCount: 24,
  skillName: 'Menentukan Informasi Penting & Yang Ditanyakan pada Soal Cerita',
  understandInfoPct: 80,
  chooseOperationPct: 76,
  explainAnswerPct: 70,
  lastUpdated: 'Musim Supervisi Akademik 2026',
};

export const INITIAL_ACTION_PLANS: ActionPlanItem[] = [
  {
    id: 'rtl-sample-1',
    createdAt: '12 Sep 2026',
    schoolName: 'UPT SD NEGERI 1 MASSEPE',
    teacherName: 'Nurhayati, S.Pd.',
    level: 'SD',
    mainProblem:
      'Siswa belum mampu menentukan informasi penting dalam soal cerita dan langsung menjumlahkan angka.',
    improvementGoal:
      'Meningkatkan kemampuan siswa memilah fakta diketahui dan yang ditanyakan hingga 80% siswa tuntas.',
    selectedStrategy: 'Strategi 1 — Baca, Tandai, Tanya',
    executionTime: '2 Pekan (4 Pertemuan pada materi Operasi Campuran)',
    successEvidence:
      'Lembar kerja siswa dengan stabilo warna, catatan observasi kelas, dan hasil kuis kontekstual.',
    followUp:
      'Melanjutkan ke Strategi 3 (Pilih Operasi dengan Alasan) dan berbagi praktik baik di Kombel Tellu Limpoe.',
    status: 'Sedang Berjalan',
  },
  {
    id: 'rtl-sample-2',
    createdAt: '10 Sep 2026',
    schoolName: 'UPT SMP NEGERI 1 TELLU LIMPOE',
    teacherName: 'Ahmad Syahrir, S.Pd.',
    level: 'SMP',
    mainProblem:
      'Siswa terhenti pada jawaban antara pada soal aritmetika sosial bertingkat (hanya hitung diskon, lupa kembalian).',
    improvementGoal:
      'Siswa mampu memeriksa kembali keselarasan jawaban akhir dengan misi kalimat tanya.',
    selectedStrategy: 'Strategi 4 — Temukan Kesalahan (Detektif Nalar)',
    executionTime: '3 Pekan (Unit Pembelajaran Aritmetika Sosial)',
    successEvidence:
      'Portofolio koreksi nalar siswa, lembar asesmen formatif, rekaman diskusi kelompok.',
    followUp:
      'Membuat bank soal cerita lokal Sidrap bersama rekan guru di MGMP Matematika.',
    status: 'Tercapai',
  },
];

export const INITIAL_GERAK_RECORDS: GerakRecord[] = [
  {
    id: 'gerak-1',
    timestamp: '11 Sep 2026',
    schoolName: 'UPT SD NEGERI 1 AMPARITA',
    level: 'SD',
    teacherName: 'Hasnidar, S.Pd.',
    learningProblem:
      'Siswa kesulitan membedakan antara harga per kilo dengan harga seluruh belanjaan pada soal perkalian.',
    evidenceFound:
      'Dari 26 siswa yang diperiksa lembar jawabannya, 16 siswa langsung menjumlahkan angka tanpa mengalikan berat.',
    actionPlan:
      'Penerapan Strategi 2 (Ceritakan Kembali) dengan peragaan uang mainan dan timbangan mini di kelas.',
    supervisorNotes:
      'Guru sangat terbuka dan responsif terhadap data. Kepala sekolah mendukung pengadaan media konkret.',
  },
];

export const INITIAL_SCHOOL_PROGRESS: SchoolProgressItem[] = [
  {
    id: 'prog-tellu-limpoe-1',
    schoolName: 'UPT SD NEGERI 1 MASSEPE',
    level: 'SD',
    targetClass: 'Kelas V-A (Fase C)',
    totalStudents: 28,
    teacherName: 'Andi Nurhaliza, S.Pd.',
    supervisorName: 'Heriansyah., S.Si., S.Pd., M.Pd',
    baselineDate: '12 Agustus 2026',
    evaluationDate: '18 Oktober 2026',
    indicators: {
      understandingText: { beforePct: 36, afterPct: 82 },
      informationFiltering: { beforePct: 29, afterPct: 75 },
      operationModeling: { beforePct: 43, afterPct: 86 },
      reasoningCommunication: { beforePct: 21, afterPct: 71 },
    },
    teacherShift: {
      beforePractice:
        'Guru langsung menulis rumus dan meminta siswa mengerjakan latihan berhitung tanpa membahas alur cerita.',
      afterPractice:
        'Guru membimbing siswa membedakan kalimat informasi vs kalimat pertanyaan serta menggambar sketsa situasi soal.',
      keyStrategyUsed: 'Strategi 1 — Baca, Visualisasikan, dan Tandai Kata Kunci',
    },
    notes:
      'Peningkatan signifikan pada pemilahan informasi penting. Siswa tidak lagi terjebak angka pengalih.',
  },
  {
    id: 'prog-tellu-limpoe-2',
    schoolName: 'UPT SMP NEGERI 1 TELLU LIMPOE',
    level: 'SMP',
    targetClass: 'Kelas VII-B (Fase D)',
    totalStudents: 32,
    teacherName: 'Muhammad Rusdi, S.Pd., Gr.',
    supervisorName: 'Heriansyah., S.Si., S.Pd., M.Pd',
    baselineDate: '15 Agustus 2026',
    evaluationDate: '22 Oktober 2026',
    indicators: {
      understandingText: { beforePct: 44, afterPct: 84 },
      informationFiltering: { beforePct: 38, afterPct: 78 },
      operationModeling: { beforePct: 50, afterPct: 88 },
      reasoningCommunication: { beforePct: 28, afterPct: 75 },
    },
    teacherShift: {
      beforePractice:
        'Siswa langsung mengoperasikan angka pertama dan kedua yang mereka temukan di teks soal aritmetika bertingkat.',
      afterPractice:
        'Guru memfasilitasi diskusi berpasangan "Detektif Nalar" untuk menemukan dan mengoreksi jebakan informasi.',
      keyStrategyUsed: 'Strategi 4 — Detektif Nalar & Diskusi Berpasangan',
    },
    notes:
      'Siswa mampu menuliskan kesimpulan dengan satuan lengkap (misal: "sisa beras adalah 25 kg, bukan 25 rupiah").',
  },
  {
    id: 'prog-tellu-limpoe-3',
    schoolName: 'UPT SD NEGERI 1 AMPARITA',
    level: 'SD',
    targetClass: 'Kelas IV (Fase B)',
    totalStudents: 25,
    teacherName: 'Siti Rahmawati, S.Pd.',
    supervisorName: 'Heriansyah., S.Si., S.Pd., M.Pd',
    baselineDate: '20 Agustus 2026',
    evaluationDate: '26 Oktober 2026',
    indicators: {
      understandingText: { beforePct: 32, afterPct: 76 },
      informationFiltering: { beforePct: 24, afterPct: 68 },
      operationModeling: { beforePct: 36, afterPct: 80 },
      reasoningCommunication: { beforePct: 16, afterPct: 64 },
    },
    teacherShift: {
      beforePractice:
        'Siswa hanya menghafal kata kunci seperti "sisa berarti kurang", sehingga salah ketika konteksnya berbeda.',
      afterPractice:
        'Guru menyajikan media manipulatif dan mengajak siswa bermain peran situasi jual-beli hasil bumi lokal.',
      keyStrategyUsed: 'Strategi 2 — Menceritakan Kembali Situasi Masalah',
    },
    notes:
      'Siswa yang awalnya pasif kini percaya diri menjelaskan mengapa mereka memilih pengurangan terlebih dahulu.',
  },
  {
    id: 'prog-tellu-limpoe-4',
    schoolName: 'UPT SD NEGERI 2 BILOKKA',
    level: 'SD',
    targetClass: 'Kelas VI (Fase C)',
    totalStudents: 26,
    teacherName: 'Kaharuddin, S.Pd.',
    supervisorName: 'Heriansyah., S.Si., S.Pd., M.Pd',
    baselineDate: '25 Agustus 2026',
    evaluationDate: '28 Oktober 2026',
    indicators: {
      understandingText: { beforePct: 38, afterPct: 80 },
      informationFiltering: { beforePct: 30, afterPct: 73 },
      operationModeling: { beforePct: 42, afterPct: 85 },
      reasoningCommunication: { beforePct: 23, afterPct: 69 },
    },
    teacherShift: {
      beforePractice:
        'Siswa buru-buru menghitung angka tanpa menyusun kalimat matematika yang logis.',
      afterPractice:
        'Guru melatih metode "Jelaskan Langkahmu Sebelum Menghitung" dengan kartu operasi nalar.',
      keyStrategyUsed: 'Strategi 3 — Pilih Operasi Hitung dengan Alasan',
    },
    notes:
      'Kemandirian siswa meningkat tajam saat dihadapkan pada soal cerita pecahan campuran.',
  },
  {
    id: 'prog-tellu-limpoe-5',
    schoolName: 'UPT SMP NEGERI 2 TELLU LIMPOE',
    level: 'SMP',
    targetClass: 'Kelas VIII (Fase D)',
    totalStudents: 22,
    teacherName: 'Nurjannah, S.Pd.',
    supervisorName: 'Heriansyah., S.Si., S.Pd., M.Pd',
    baselineDate: '01 September 2026',
    evaluationDate: '30 Oktober 2026',
    indicators: {
      understandingText: { beforePct: 40, afterPct: 82 },
      informationFiltering: { beforePct: 35, afterPct: 77 },
      operationModeling: { beforePct: 45, afterPct: 86 },
      reasoningCommunication: { beforePct: 25, afterPct: 73 },
    },
    teacherShift: {
      beforePractice:
        'Siswa mudah terkecoh data redundan pada teks bacaan tabel statistik numerasi.',
      afterPractice:
        'Guru menggunakan rubrik pemilahan data dan diskusi kelompok kritis.',
      keyStrategyUsed: 'Strategi 4 — Temukan Kesalahan (Detektif Nalar)',
    },
    notes:
      'Siswa kelas VIII mampu berargumen logis dalam menentukan solusi numerasi berbasis data lingkungan.',
  },
];

