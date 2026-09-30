export const DIAGNOSING_SCORE_OPTIONS = [
  { value: 0, label: "0 · Belum ada data / belum mampu" },
  { value: 1, label: "1 · Kurang mampu sekali" },
  { value: 2, label: "2 · Kurang mampu" },
  { value: 3, label: "3 · Mampu" },
  { value: 4, label: "4 · Sangat mampu" },
];

export const DIAGNOSING_CRITERIA = [
  { id: "student-background", category: "Student Background", label: "Asal universitas / kurikulum SMA", helper: "Untuk tujuan S2/S3, nilai asal universitas. Untuk tujuan S1, nilai kurikulum SMA.", core: true, recommendation: "-" },
  { id: "gpa-rapport", category: "Student Background", label: "GPA / nilai rapor", helper: "Catat nilai yang sudah tersedia dan apakah masih ada ruang peningkatan.", core: true, recommendation: "Mencari kampus yang sesuai dengan GPA dan emphasize skill lain sehingga menjadi nilai tambah." },
  { id: "achievement", category: "Student Background", label: "Achievement", helper: "Pertimbangkan kompetisi, organisasi, publikasi, pekerjaan, dan impact student.", core: true, recommendation: "Mencocokkan skor yang dimiliki dengan requirement beasiswa/kampus tujuan." },
  { id: "language-test", category: "Test", label: "Language proficiency test", helper: "IELTS, TOEFL, Duolingo, atau tes bahasa lain yang relevan.", core: true, recommendation: "Sesuaikan target skor dan jenis tes dengan negara, kampus, jurusan, dan beasiswa tujuan." },
  { id: "standardized-test", category: "Test", label: "Standardized test", helper: "SAT, A-Level, GRE, GMAT, atau tes lain yang dibutuhkan.", core: true, optional: true, recommendation: "- Melakukan simulasi standardized test di Schoters\n- Mengambil bimbingan standardized test di Schoters" },
  { id: "preparation-exposure", category: "Knowledge", label: "Exposure terhadap persiapan universitas dan beasiswa", helper: "Ukur pengalaman student dalam persiapan dokumen dan proses study abroad.", core: true, recommendation: "- Mencari tahu dokumen yang dibutuhkan untuk mendaftar beasiswa\n- Membaca materi yang disediakan di platform\n- Mengecek kelengkapan dokumen pendaftaran beasiswa sesuai learning plan" },
  { id: "scholarship-application", category: "Application", label: "Pengetahuan aplikasi beasiswa", helper: "Pemahaman alur, persyaratan, dan pengalaman mendaftar beasiswa.", recommendation: "- Mencari tahu proses aplikasi beasiswa\n- Rutin bimbingan dengan mentor" },
  { id: "university-application", category: "Application", label: "Pengetahuan aplikasi kampus", helper: "Pemahaman alur, persyaratan, dan pengalaman mendaftar kampus.", recommendation: "- Mencari tahu proses aplikasi kampus\n- Rutin bimbingan dengan mentor" },
  { id: "cv-quality", category: "Documents", label: "CV understanding / quality", helper: "Kepemilikan, format, kualitas konten, dan relevansi CV student.", recommendation: "- Mengecek contoh CV yang berbobot di platform bimbingan\n- Melaksanakan bimbingan dokumen CV dengan mentor" },
  { id: "recommendation-letter-quality", category: "Documents", label: "Recommendation letter understanding / quality", helper: "Kesiapan student atas kandidat referee, format, dan isi recommendation letter.", recommendation: "- Mengecek contoh recommendation letter yang berbobot di platform bimbingan\n- Melaksanakan bimbingan dokumen recommendation letter dengan mentor" },
  { id: "essay-quality", category: "Documents", label: "Essay understanding / quality", helper: "Essay, motivation letter, personal statement, atau dokumen sejenis.", recommendation: "- Mengecek contoh essay (motlet/personal statement/etc) berbobot di platform bimbingan\n- Melaksanakan bimbingan dokumen essay dengan mentor" },
  { id: "research-proposal-quality", category: "Documents", label: "Research proposal quality", helper: "Untuk PhD applicant atau master by research.", optional: true, recommendation: "- Mengecek contoh research proposal berbobot di platform bimbingan\n- Melaksanakan bimbingan dokumen research proposal dengan mentor" },
];

export const DIAGNOSING_CONTEXT_OPTIONS = {
  studentType: ["Tipe 1", "Tipe 2", "Tipe 3", "Belum ditentukan"],
  yesNo: ["Ya", "Tidak", "Belum ditentukan"],
  researchProposal: ["Ya", "Tidak"],
  readiness: ["Low", "Middle", "High", "Belum ditentukan"],
};

// Editable fields from the workbook's "Profile Confirmation" tab. These are
// collected by the MO during the onboarding session, so they are separate
// from the handover and SLMS reference data.
export const PROFILE_CONFIRMATION_OPTIONS = {
  yesNo: ["", "Ya", "Tidak"],
  yesNoUnknown: ["", "Ya", "Tidak", "Belum ditanyakan"],
  gender: ["", "Perempuan", "Laki-laki", "Lainnya"],
  returnHome: ["", "Ya", "Tidak", "Belum dibahas"],
  willingness: ["", "Bersedia", "Tidak bersedia", "Masih dipertimbangkan"],
};

export const PROFILE_CONFIRMATION_FIELDS = [
  { id: "videoTutorialWatched", label: "Apakah sudah menonton video tutorial?", type: "select", options: "yesNoUnknown", group: "Sesi awal" },
  { id: "studentQuestions", label: "Pertanyaan student/orang tua terkait fitur SAA", type: "textarea", group: "Sesi awal", placeholder: "Tuliskan pertanyaan yang muncul setelah video tutorial." },
  { id: "studentName", label: "Student's name", type: "text", group: "Identitas student" },
  { id: "packageName", label: "Package", type: "text", group: "Identitas student" },
  { id: "birthdate", label: "Birthdate", type: "text", group: "Identitas student", placeholder: "Contoh: 14 Mei 2008" },
  { id: "age", label: "Age", type: "text", group: "Identitas student" },
  { id: "gender", label: "Gender", type: "select", options: "gender", group: "Identitas student" },
  { id: "passport", label: "Passport", type: "text", group: "Identitas student" },
  { id: "degreeProgram", label: "Degree program to apply", type: "text", group: "Identitas student" },
  { id: "currentBackground", label: "Student's background saat ini", type: "textarea", group: "Pendidikan saat ini" },
  { id: "currentInstitution", label: "Current institution", type: "text", group: "Pendidikan saat ini" },
  { id: "intake", label: "Intake / enrollment plan", type: "text", group: "Pendidikan saat ini", placeholder: "Contoh: Fall 2027 atau September 2027" },
  { id: "achievements", label: "Achievement(s)", type: "textarea", group: "Pendidikan saat ini", placeholder: "Tuliskan pencapaian dengan format yang jelas." },
  { id: "highSchoolClass", label: "Kelas, semester, bulan/tahun saat sesi onboarding", type: "text", group: "Detail SMA / S1", appliesTo: "undergraduate", placeholder: "Contoh: Kelas 12, semester 1, September 2026" },
  { id: "highSchoolMajor", label: "Jurusan saat SMA/SMK", type: "text", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "schoolCurriculum", label: "Kurikulum sekolah", type: "text", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "averageReportScores", label: "Nilai rapor rata-rata", type: "textarea", group: "Detail SMA / S1", appliesTo: "undergraduate", placeholder: "Isi nilai per semester bila tersedia." },
  { id: "favoriteSubjects", label: "Mata pelajaran dengan nilai tertinggi/disukai", type: "textarea", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "dislikedSubjects", label: "Mata pelajaran yang tidak disukai", type: "textarea", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "standardizedTest", label: "Standardized test yang dimiliki", type: "textarea", group: "Tes dan kesiapan", appliesTo: "undergraduate", placeholder: "Contoh: SAT — belum ada; IELTS 6.5." },
  { id: "standardizedTestWillingness", label: "Bersedia mengambil standardized test jika dibutuhkan?", type: "select", options: "willingness", group: "Tes dan kesiapan", appliesTo: "undergraduate" },
  { id: "aLevelSubjectsScores", label: "Subject dan score A-Level (Cambridge)", type: "textarea", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "ibSubjectsScores", label: "Subject dan score IB", type: "textarea", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "gapYear", label: "Bersedia mengambil gap year?", type: "select", options: "willingness", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "foundation", label: "Mau mengambil foundation/pathway jika dibutuhkan?", type: "select", options: "willingness", group: "Detail SMA / S1", appliesTo: "undergraduate" },
  { id: "masterDegreeType", label: "Master's degree type to apply", type: "text", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "programDuration", label: "Durasi program", type: "text", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "previousS1Institution", label: "Institusi pendidikan saat S1", type: "text", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "previousS2Institution", label: "Institusi pendidikan saat S2", type: "text", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "previousDegreeDetails", label: "Jurusan, IPK, dan tahun lulus", type: "textarea", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "fullTimeExperience", label: "Pengalaman kerja full-time", type: "textarea", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "partTimeExperience", label: "Pengalaman kerja part-time", type: "textarea", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "volunteerExperience", label: "Pengalaman volunteer", type: "textarea", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "profession", label: "Profesi", type: "text", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "graduateStandardizedTest", label: "Standardized test yang dimiliki", type: "textarea", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "graduateStandardizedTestWillingness", label: "Bersedia mengambil standardized test jika dibutuhkan?", type: "select", options: "willingness", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "publicationCount", label: "Jumlah publikasi", type: "text", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "researchTopics", label: "Topik riset yang ingin dilakukan", type: "textarea", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "researchKeywords", label: "Keyword(s) topik riset", type: "textarea", group: "Detail S2 / S3", appliesTo: "graduate" },
  { id: "careerPlan", label: "Rencana karir", type: "textarea", group: "Tujuan studi" },
  { id: "returnHome", label: "Return home", type: "select", options: "returnHome", group: "Tujuan studi" },
  { id: "majorGoalsDream", label: "Major goals (dream)", type: "textarea", group: "Tujuan studi" },
  { id: "majorGoalsFix", label: "Major goals fix setelah diskusi dengan mentor", type: "textarea", group: "Tujuan studi" },
  { id: "countryGoalsDream", label: "Country goals (dream)", type: "textarea", group: "Tujuan studi" },
  { id: "countryGoalsFix", label: "Country goals fix setelah diskusi dengan mentor", type: "textarea", group: "Tujuan studi" },
  { id: "avoidedCountries", label: "Avoided countries", type: "textarea", group: "Tujuan studi" },
  { id: "recommendOtherCountries", label: "Bersedia direkomendasikan negara di luar avoided countries?", type: "select", options: "yesNoUnknown", group: "Tujuan studi" },
  { id: "countryListFinal", label: "Apakah list negara student sudah final?", type: "select", options: "yesNoUnknown", group: "Tujuan studi" },
  { id: "languageTest", label: "Language proficiency test dan score", type: "textarea", group: "Tes bahasa" },
  { id: "languageCertificateDirect", label: "Bersedia langsung submit sertifikat bahasa saat pendaftaran?", type: "select", options: "yesNoUnknown", group: "Tes bahasa" },
  { id: "minimumLanguageScore", label: "Minimum score bahasa yang disetujui untuk rekomendasi", type: "text", group: "Tes bahasa" },
  { id: "retakeLanguageTest", label: "Bersedia retake language proficiency test?", type: "select", options: "willingness", group: "Tes bahasa" },
  { id: "localLanguagePrograms", label: "Bersedia mempertimbangkan program berbahasa lokal?", type: "select", options: "willingness", group: "Tes bahasa" },
  { id: "localLanguageCertificate", label: "Bersedia submit sertifikat bahasa lokal saat pendaftaran?", type: "select", options: "willingness", group: "Tes bahasa" },
  { id: "languagePrepYear", label: "Bersedia mengikuti kelas persiapan bahasa 1 tahun?", type: "select", options: "willingness", group: "Tes bahasa" },
  { id: "scholarshipGoals", label: "Scholarship goals", type: "textarea", group: "Kampus, beasiswa, dan biaya" },
  { id: "universityGoals", label: "University goals", type: "textarea", group: "Kampus, beasiswa, dan biaya" },
  { id: "scholarshipExposure", label: "Exposure to scholarship preparation", type: "textarea", group: "Kampus, beasiswa, dan biaya", placeholder: "Pernah mendaftar apa, sampai tahap apa, dan kapan?" },
  { id: "fundingPreference", label: "Funding preference", type: "textarea", group: "Kampus, beasiswa, dan biaya" },
  { id: "annualFundingAmount", label: "Coverage biaya tahunan untuk partial/self funded", type: "text", group: "Kampus, beasiswa, dan biaya" },
  { id: "mentorPreferencesRanking", label: "Preferensi mentor dan ranking", type: "textarea", group: "Preferensi mentor dan jadwal", placeholder: "Contoh: 1. Jurusan · 2. Negara · 3. Beasiswa · 4. Kampus" },
  { id: "schedulePreference", label: "Schedule preferences", type: "text", group: "Preferensi mentor dan jadwal" },
  { id: "otherNotes", label: "Others / notes tambahan", type: "textarea", group: "Preferensi mentor dan jadwal" },
];

export function getEmptyProfileConfirmation() {
  return Object.fromEntries(PROFILE_CONFIRMATION_FIELDS.map((field) => [field.id, ""]));
}

export const LEARNING_PLAN_CATEGORIES = [
  { id: "profiling", label: "Profiling", topics: "Student diagnosing, major, country, campus, career, dan scholarship goal discussion" },
  { id: "scholarship-requirements", label: "Scholarship requirements", topics: "Prosedur aplikasi, dokumen, eligibility, dan scholarship portal" },
  { id: "essay", label: "Master / specific essay", topics: "Guideline, outline, draft discussion, review, dan revision" },
  { id: "cv", label: "Master / specific CV", topics: "Guideline, outline, review, dan revision" },
  { id: "recommendation-letter", label: "Master / specific recommendation letter", topics: "Guideline, outline, review, dan revision" },
  { id: "research-proposal", label: "Professor & research proposal", topics: "Research interest, professor correspondence, proposal, dan revision" },
  { id: "scholarship-submission", label: "Scholarship submission", topics: "Pengisian akun dan finalisasi registrasi beasiswa" },
  { id: "interview", label: "Interview simulation", topics: "Simulasi interview dengan guideline Schoters" },
  { id: "pre-departure", label: "Pre-departure", topics: "Dokumen sebelum keberangkatan dan cost of living" },
];

export function getEmptyAssessmentScores() {
  return Object.fromEntries(DIAGNOSING_CRITERIA.map((criterion) => [criterion.id, null]));
}

export function getAssessmentProgress(scores, researchProposalRequired = "Tidak") {
  const applicableCriteria = DIAGNOSING_CRITERIA.filter(
    (criterion) => !criterion.optional || criterion.id !== "research-proposal-quality" || researchProposalRequired === "Ya"
  );
  const completed = applicableCriteria.filter((criterion) => Number.isInteger(scores?.[criterion.id])).length;
  const total = applicableCriteria.length;
  const coreCriteria = applicableCriteria.filter((criterion) => criterion.core);
  const coreCompleted = coreCriteria.filter((criterion) => Number.isInteger(scores?.[criterion.id])).length;
  const coreScore = coreCompleted === coreCriteria.length
    ? coreCriteria.reduce((sum, criterion) => sum + scores[criterion.id], 0)
    : null;
  const readinessCriteria = applicableCriteria.filter((criterion) => !criterion.core);
  const readinessCompleted = readinessCriteria.filter((criterion) => Number.isInteger(scores?.[criterion.id])).length;
  const readinessScore = readinessCompleted === readinessCriteria.length
    ? readinessCriteria.reduce((sum, criterion) => sum + scores[criterion.id], 0)
    : null;

  return { completed, total, coreCompleted, coreTotal: coreCriteria.length, coreScore, readinessCompleted, readinessTotal: readinessCriteria.length, readinessScore };
}

export function getStudentGrade(coreScore) {
  if (coreScore === null) return "Belum lengkap";
  if (coreScore <= 6) return "Low";
  if (coreScore <= 12) return "Middle 2";
  if (coreScore <= 18) return "Middle 1";
  return "High";
}

export function getReadinessGrade(readinessScore, isResearchTrack = false) {
  if (readinessScore === null) return "Belum lengkap";
  if (isResearchTrack) return readinessScore <= 12 ? "Low" : readinessScore <= 18 ? "Middle" : "High";
  return readinessScore <= 10 ? "Low" : readinessScore <= 15 ? "Middle" : "High";
}
