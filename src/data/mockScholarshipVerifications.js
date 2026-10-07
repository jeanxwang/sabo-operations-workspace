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
    aiNote: "AI menambahkan data baru ke master data beasiswa.",
    aiDetails: "AI mendeteksi program beasiswa baru dari situs resmi DAAD.",
    changes: [
      { field: "name", label: "Nama beasiswa", before: "Belum ada data", after: "DAAD Scholarship" },
      { field: "provider", label: "Penyelenggara", before: "Belum ada data", after: "German Academic Exchange Service" },
      { field: "coverage", label: "Cakupan / benefit", before: "Belum ada data", after: "Full Funding" },
      { field: "level", label: "Jenjang", before: "Belum ada data", after: "S2" },
      { field: "eligibilityNotes", label: "Catatan eligibility", before: "Belum ada data", after: "Kandidat internasional yang memenuhi persyaratan program studi dan DAAD." },
      { field: "sourceUrl", label: "URL sumber resmi", before: "Belum ada data", after: "https://www.daad.de/en/study-and-research-in-germany/scholarships/" },
    ],
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
    aiNote: "AI mengubah 1 kolom: Cakupan / benefit.",
    aiDetails: "AI menemukan perubahan pada informasi pendanaan Chevening dari situs resminya.",
    changes: [
      { field: "coverage", label: "Cakupan / benefit", before: "Full Funding", after: "Full Funding + Living Allowance" },
    ],
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
    aiNote: "AI menambahkan data baru ke master data beasiswa.",
    aiDetails: "AI mendeteksi informasi program MEXT dari situs resmi Kedutaan Besar Jepang.",
    changes: [
      { field: "name", label: "Nama beasiswa", before: "Belum ada data", after: "MEXT Scholarship" },
      { field: "provider", label: "Penyelenggara", before: "Belum ada data", after: "Japan Government" },
      { field: "coverage", label: "Cakupan / benefit", before: "Belum ada data", after: "Full Funding" },
      { field: "level", label: "Jenjang", before: "Belum ada data", after: "S1" },
      { field: "eligibilityNotes", label: "Catatan eligibility", before: "Belum ada data", after: "Pelamar internasional yang memenuhi ketentuan jenjang dan program MEXT yang tersedia." },
      { field: "sourceUrl", label: "URL sumber resmi", before: "Belum ada data", after: "https://www.id.emb-japan.go.jp/sch.html" },
    ],
    sourceUrl: "https://www.id.emb-japan.go.jp/sch.html",
    eligibility: "Pelamar internasional yang memenuhi ketentuan jenjang dan program MEXT yang tersedia.",
    applicationSteps: "Cek pengumuman terbaru, ikuti jalur pendaftaran yang sesuai, dan gunakan dokumen resmi sebagai acuan.",
    detectedAt: "16 September 2026",
  },
];
