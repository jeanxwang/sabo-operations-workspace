export const mockSsoDashboard = {
  totalActiveStudents: 350,
  highlights: [
    {
      id: "follow-up",
      title: "Perlu Follow Up",
      count: 24,
      description:
        "Student dengan progress mandek, deadline dekat, atau update belum dikirim.",
    },
    {
      id: "strategic-reminder",
      title: "Reminder Strategis",
      count: 9,
      description:
        "OIT, simulation test, deadline dokumen, dan milestone penting.",
    },
    {
      id: "cx-updates",
      title: "Update dari CX/Lainnya",
      count: 7,
      description: "Informasi baru dari Student Buddy, Hotline, atau tim lain.",
      action: "Lihat update",
    },
  ],
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
