export const mockSsoDashboard = {
  totalActiveStudents: 350,
  distribution: {
    grades: [
      { label: "Kelas 10", count: 86 },
      { label: "Kelas 11", count: 112 },
      { label: "Kelas 12", count: 152 },
    ],
    degrees: [
      { label: "S1", count: 128 },
      { label: "S2", count: 96 },
      { label: "S3", count: 34 },
      { label: "Gap Year", count: 92 },
    ],
  },
  followUp: {
    total: 24,
    items: [
      { id: "deadline-beasiswa-h7", count: 8 },
      { id: "inactive-booking", count: 10 },
      { id: "not-onboarded", count: 6 },
    ],
  },
  cxUpdate: {
    id: "cx-updates",
    title: "Update dari CX/Lainnya",
    count: 7,
    description: "Informasi baru dari Student Buddy, Hotline, atau tim lain.",
    action: "Lihat update",
  },
  priorities: [
    {
      id: "STU-1001",
      name: "Hermione Granger",
      stage: "University shortlist",
      issue: "Belum submit pilihan kampus",
      status: "high-risk",
      statusLabel: "High Risk",
    },
    {
      id: "STU-1002",
      name: "Luna Lovegood",
      stage: "Simulation test",
      issue: "Perlu reminder jadwal mock test",
      status: "today",
      statusLabel: "Today",
    },
    {
      id: "STU-1003",
      name: "Martin Edwards",
      stage: "Scholarship prep",
      issue: "Rekomendasi beasiswa belum ditinjau",
      status: "pending",
      statusLabel: "Pending",
    },
    {
      id: "STU-1004",
      name: "Draco Malfoy",
      stage: "LoA tracking",
      issue: "Menunggu sync submit mentor",
      status: "on-track",
      statusLabel: "On Track",
    },
  ],
  updates: [
    {
      id: "UPD-001",
      studentName: "Mad Max",
      message:
        "Student Buddy melaporkan student belum mengisi university shortlist minggu ini.",
      time: "Hari ini - 10.00",
    },
    {
      id: "UPD-002",
      studentName: "Mia Thermopolis",
      message:
        "Student menanyakan perubahan jadwal sesi dan meminta konfirmasi dari SSO.",
      time: "Hari ini - 08.00",
    },
    {
      id: "UPD-003",
      studentName: "Jane Hopper",
      message: "Isu baru mengenai preferensi pilihan kampus.",
      time: "Kemarin",
    },
  ],
};
