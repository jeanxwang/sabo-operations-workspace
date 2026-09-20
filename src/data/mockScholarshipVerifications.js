export const SCHOLARSHIP_VERIFICATIONS_KEY = "sabo_scholarship_verifications";

export const SCHOLARSHIP_SOURCE_URLS = {
  "ver-1": "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
  "ver-2": "https://www.chevening.org/scholarships/",
  "ver-3": "https://www.id.emb-japan.go.jp/sch.html",
};

export const mockScholarshipVerificationsSeed = [
  {
    id: "ver-1",
    name: "DAAD Scholarship",
    provider: "German Academic Exchange Service",
    coverage: "Full Funding",
    level: "S2",
    aiNote: "AI menambahkan entri baru ini berdasarkan pemantauan situs resmi DAAD.",
    aiDetails: "AI mendeteksi program beasiswa baru dari DAAD dan merangkum cakupan pendanaan untuk kandidat jenjang master.",
    sourceUrl: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    eligibility: "Kandidat internasional yang memenuhi persyaratan program studi dan DAAD.",
    applicationSteps: "Periksa persyaratan program, siapkan dokumen, lalu ikuti instruksi pendaftaran pada situs resmi.",
    detectedAt: "18 September 2026",
  },
  {
    id: "ver-2",
    name: "Chevening",
    provider: "UK Government",
    coverage: "Full Funding + Living Allowance",
    level: "S2",
    aiNote: "AI mendeteksi perubahan cakupan dari 'Full Funding' menjadi 'Full Funding + Living Allowance'.",
    aiDetails: "AI menemukan perubahan pada informasi pendanaan Chevening dan menandai entri ini untuk dikonfirmasi oleh tim Academic.",
    sourceUrl: "https://www.chevening.org/scholarships/",
    eligibility: "Profesional dengan pengalaman kerja dan potensi kepemimpinan yang memenuhi kriteria Chevening.",
    applicationSteps: "Baca panduan resmi, siapkan dokumen aplikasi, dan cek jadwal pendaftaran pada situs Chevening.",
    detectedAt: "17 September 2026",
  },
  {
    id: "ver-3",
    name: "MEXT Scholarship",
    provider: "Japan Government",
    coverage: "Full Funding",
    level: "S1",
    aiNote: "AI menambahkan entri baru berdasarkan hasil pemantauan situs beasiswa pemerintah Jepang.",
    aiDetails: "AI menemukan informasi program MEXT untuk kandidat internasional dan merekomendasikan pengecekan langsung pada sumber pemerintah Jepang.",
    sourceUrl: "https://www.id.emb-japan.go.jp/sch.html",
    eligibility: "Pelamar internasional yang memenuhi ketentuan jenjang dan program MEXT yang tersedia.",
    applicationSteps: "Cek pengumuman terbaru, ikuti jalur pendaftaran yang sesuai, dan gunakan dokumen resmi sebagai acuan.",
    detectedAt: "16 September 2026",
  },
];
