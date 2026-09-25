export const ONBOARDING_CHECKLIST_ITEMS = [
  {
    id: "session",
    label: "Sesi onboarding sudah dilakukan bersama student",
    helper: "Konfirmasi bahwa sesi onboarding benar-benar sudah berlangsung.",
  },
  {
    id: "profile-review",
    label: "Profil dan tujuan studi student sudah ditinjau",
    helper: "Pastikan informasi utama dari SLMS sudah dipahami dan dikonfirmasi.",
  },
  {
    id: "expectation",
    label: "Ekspektasi student dan scope mentoring sudah disepakati",
    helper: "Catat kesepahaman mengenai dukungan yang akan diberikan selama program.",
  },
  {
    id: "next-step",
    label: "Next step student sudah dijelaskan",
    helper: "Student mengetahui tindakan dan jadwal yang perlu dilakukan setelah onboarding.",
  },
  {
    id: "notes",
    label: "Catatan hasil onboarding sudah disimpan",
    helper: "Simpan konteks penting yang perlu diketahui tim terkait.",
  },
];

export const mockMoOnboardingChecklists = [
  {
    studentId: "ST-26091",
    studentName: "Nadia Putri",
    packageName: "Premium Mentoring",
    onboardingDate: "21 Sep 2026",
    checklist: {
      session: true,
      "profile-review": true,
      expectation: true,
      "next-step": true,
      notes: true,
    },
    notes: "Student ingin mulai menyusun timeline aplikasi dan shortlist kampus.",
    lastUpdated: "21 Sep 2026, 16.20",
  },
  {
    studentId: "ST-26095",
    studentName: "Alya Ramadhani",
    packageName: "Premium Mentoring",
    onboardingDate: "23 Sep 2026",
    checklist: {
      session: true,
      "profile-review": true,
      expectation: true,
      "next-step": false,
      notes: false,
    },
    notes: "",
    lastUpdated: "23 Sep 2026, 15.10",
  },
  {
    studentId: "ST-26092",
    studentName: "Raka Pratama",
    packageName: "Standard Mentoring",
    onboardingDate: null,
    checklist: {
      session: false,
      "profile-review": false,
      expectation: false,
      "next-step": false,
      notes: false,
    },
    notes: "",
    lastUpdated: null,
  },
  {
    studentId: "ST-26097",
    studentName: "Maya Salsabila",
    packageName: "Standard Mentoring",
    onboardingDate: "17 Sep 2026",
    checklist: {
      session: true,
      "profile-review": true,
      expectation: true,
      "next-step": true,
      notes: true,
    },
    notes: "Student membutuhkan arahan awal untuk eksplorasi jurusan Computer Science.",
    lastUpdated: "17 Sep 2026, 14.45",
  },
];

export function getChecklistProgress(record) {
  const total = ONBOARDING_CHECKLIST_ITEMS.length;
  const completed = ONBOARDING_CHECKLIST_ITEMS.filter(
    (item) => record.checklist[item.id]
  ).length;

  return {
    completed,
    total,
    isComplete: completed === total,
  };
}

