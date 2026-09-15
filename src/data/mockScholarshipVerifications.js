export const SCHOLARSHIP_VERIFICATIONS_KEY = "sabo_scholarship_verifications";

export const mockScholarshipVerificationsSeed = [
  {
    id: "ver-1",
    name: "DAAD Scholarship",
    provider: "German Academic Exchange Service",
    coverage: "Full Funding",
    level: "S2",
    aiNote: "AI menambahkan entri baru ini berdasarkan pemantauan situs resmi DAAD.",
  },
  {
    id: "ver-2",
    name: "Chevening",
    provider: "UK Government",
    coverage: "Full Funding + Living Allowance",
    level: "S2",
    aiNote: "AI mendeteksi perubahan cakupan dari 'Full Funding' menjadi 'Full Funding + Living Allowance'.",
  },
  {
    id: "ver-3",
    name: "MEXT Scholarship",
    provider: "Japan Government",
    coverage: "Full Funding",
    level: "S1",
    aiNote: "AI menambahkan entri baru berdasarkan hasil pemantauan situs beasiswa pemerintah Jepang.",
  },
];