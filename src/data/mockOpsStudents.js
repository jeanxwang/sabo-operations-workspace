export const mockOpsStudents = [
  {
    id: "ST-26091",
    name: "Nadia Putri",
    isNewStudent: true,
    email: "nadia.putri@email.com",
    phone: "+62 812-3456-7890",
    joinedAt: "20 Sep 2026",
    paymentDate: "18 Sep 2026",
    onboardingDate: "2026-09-21",
    assignedTo: "Ops Team",
    assignedMo: "Sarah Wijaya",
    activation: "done",
    profile: "done",
    onboarding: "done",
    diagnostic: "done",
    lpChecked: "done",
    lpReleased: "done",
  },
  {
    id: "ST-26092",
    name: "Raka Pratama",
    isNewStudent: true,
    email: "raka.pratama@email.com",
    phone: "+62 813-2468-1357",
    joinedAt: "20 Sep 2026",
    paymentDate: "20 Sep 2026",
    onboardingDate: null,
    assignedTo: "Belum ditugaskan",
    assignedMo: null,
    activation: "done",
    profile: "pending",
    onboarding: "pending",
    diagnostic: "pending",
    lpChecked: "pending",
    lpReleased: "pending",
  },
  {
    id: "ST-26093",
    name: "Keisha Anindya",
    isNewStudent: true,
    email: "keisha.anindya@email.com",
    phone: "+62 821-9087-6543",
    joinedAt: "19 Sep 2026",
    paymentDate: "19 Sep 2026",
    onboardingDate: null,
    assignedTo: "Ops Team",
    assignedMo: null,
    activation: "pending",
    profile: "done",
    onboarding: "pending",
    diagnostic: "pending",
    lpChecked: "pending",
    lpReleased: "pending",
  },
  {
    id: "ST-26094",
    name: "Bima Mahendra",
    isNewStudent: true,
    email: "bima.mahendra@email.com",
    phone: "+62 822-4567-8901",
    joinedAt: "19 Sep 2026",
    paymentDate: "19 Sep 2026",
    onboardingDate: null,
    assignedTo: "Belum ditugaskan",
    assignedMo: null,
    activation: "pending",
    profile: "pending",
    onboarding: "pending",
    diagnostic: "pending",
    lpChecked: "pending",
    lpReleased: "pending",
  },
  {
    id: "ST-26095",
    name: "Alya Ramadhani",
    isNewStudent: true,
    email: "alya.ramadhani@email.com",
    phone: "+62 823-5678-9012",
    joinedAt: "18 Sep 2026",
    paymentDate: "17 Sep 2026",
    onboardingDate: "2026-09-23",
    assignedTo: "Ops Team",
    assignedMo: "Rio Aditya",
    activation: "done",
    profile: "done",
    onboarding: "scheduled",
    diagnostic: "pending",
    lpChecked: "pending",
    lpReleased: "pending",
  },
  {
    id: "ST-26096",
    name: "Farhan Akbar",
    isNewStudent: true,
    email: "farhan.akbar@email.com",
    phone: "+62 811-6789-0123",
    joinedAt: "18 Sep 2026",
    paymentDate: "16 Sep 2026",
    onboardingDate: "2026-09-19",
    assignedTo: "Ops Team",
    assignedMo: "Celine Tan",
    activation: "done",
    profile: "pending",
    onboarding: "done",
    diagnostic: "done",
    lpChecked: "pending",
    lpReleased: "pending",
  },
  {
    id: "ST-26097",
    name: "Maya Salsabila",
    isNewStudent: true,
    email: "maya.salsabila@email.com",
    phone: "+62 812-7890-1234",
    joinedAt: "17 Sep 2026",
    paymentDate: "15 Sep 2026",
    onboardingDate: "2026-09-17",
    assignedTo: "Ops Team",
    assignedMo: "Sarah Wijaya",
    activation: "done",
    profile: "done",
    onboarding: "done",
    diagnostic: "done",
    lpChecked: "done",
    lpReleased: "done",
  },
  {
    id: "ST-26098",
    name: "Daffa Wijaya",
    isNewStudent: true,
    email: "daffa.wijaya@email.com",
    phone: "+62 814-8901-2345",
    joinedAt: "17 Sep 2026",
    paymentDate: "17 Sep 2026",
    onboardingDate: null,
    assignedTo: "Belum ditugaskan",
    assignedMo: null,
    activation: "pending",
    profile: "pending",
    onboarding: "pending",
    diagnostic: "pending",
    lpChecked: "pending",
    lpReleased: "pending",
  },
  {
    id: "ST-25042",
    name: "Naufal Hidayat",
    isNewStudent: false,
    email: "naufal.hidayat@email.com",
    phone: "+62 815-2345-6789",
    joinedAt: "12 Jun 2026",
    paymentDate: "10 Jun 2026",
    onboardingDate: "2026-06-13",
    assignedTo: "Ops Team",
    assignedMo: "Rio Aditya",
    activation: "done",
    profile: "done",
    onboarding: "done",
    diagnostic: "done",
    lpChecked: "done",
    lpReleased: "done",
  },
  {
    id: "ST-25043",
    name: "Salsa Kirana",
    isNewStudent: false,
    email: "salsa.kirana@email.com",
    phone: "+62 816-3456-7890",
    joinedAt: "08 Jun 2026",
    paymentDate: "06 Jun 2026",
    onboardingDate: "2026-06-09",
    assignedTo: "Ops Team",
    assignedMo: "Celine Tan",
    activation: "done",
    profile: "done",
    onboarding: "done",
    diagnostic: "done",
    lpChecked: "done",
    lpReleased: "done",
  },
];

export function isOpsStudentReady(student) {
  return student.activation === "done" && student.profile === "done";
}

export const OPS_REFERENCE_DATE = new Date("2026-09-24T12:00:00");

export const OPS_SLA_RULES = [
  { id: "diagnostic", label: "Diagnostic checking", daysAfterOnboarding: 1 },
  { id: "lpChecked", label: "LP checked", daysAfterOnboarding: 2 },
  { id: "lpReleased", label: "LP released", daysAfterOnboarding: 3 },
];

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getOpsSlaMilestones(student) {
  return OPS_SLA_RULES.map((rule) => {
    const isOnboardingComplete = student.onboarding === "done" && student.onboardingDate;

    if (!isOnboardingComplete) {
      return {
        ...rule,
        deadline: null,
        status: "waiting",
      };
    }

    const deadline = addDays(new Date(`${student.onboardingDate}T00:00:00`), rule.daysAfterOnboarding);
    const completed = student[rule.id] === "done";
    const status = completed
      ? "done"
      : OPS_REFERENCE_DATE > deadline
        ? "overdue"
        : "on-track";

    return { ...rule, deadline, status };
  });
}

export function getOpsSlaSummary(student) {
  const milestones = getOpsSlaMilestones(student);
  return {
    milestones,
    overdueCount: milestones.filter((milestone) => milestone.status === "overdue").length,
  };
}

export const mockOpsMOs = [
  { id: "mo-sarah", name: "Sarah Wijaya" },
  { id: "mo-rio", name: "Rio Aditya" },
  { id: "mo-celine", name: "Celine Tan" },
];

// Placeholder until the official Learning System URL is provided.
export const LEARNING_SYSTEM_ASSIGN_URL = "https://learning-system.schoters.com/assign-mo";
