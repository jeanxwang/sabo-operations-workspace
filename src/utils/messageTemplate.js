export const MESSAGE_VARIABLES = [
  { token: "[nama]", label: "Nama student" },
  { token: "[id]", label: "ID student" },
  { token: "[kelas]", label: "Kelas" },
  { token: "[package]", label: "Package" },
  { token: "[program]", label: "Program" },
  { token: "[deadline]", label: "Deadline berikutnya" },
  { token: "[stage]", label: "Stage saat ini" },
];

export function interpolateMessage(template, student = {}) {
  const values = {
    nama: student.name,
    id: student.id,
    kelas: student.grade ? `Kelas ${student.grade}` : "",
    package: student.package,
    program: student.packageName ?? student.current_degree,
    deadline: student.nextDeadline,
    stage: student.currentStage ?? student.current_stage,
  };

  return template.replace(/\[([^\]]+)\]/g, (token, rawKey) => {
    const key = rawKey.trim().toLowerCase();
    return values[key] ?? token;
  });
}
