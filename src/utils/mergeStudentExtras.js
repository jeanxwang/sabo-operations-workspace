export function mergeStudentExtras(apiStudents, mockStudents, extraKeys) {
  return apiStudents.map((apiStudent) => {
    const mockMatch = mockStudents.find((m) => m.id === apiStudent.id);
    const extras = {};
    extraKeys.forEach((key) => {
      if (mockMatch && key in mockMatch) {
        extras[key] = mockMatch[key];
      } else {
        extras[key] = key === "recommendations" ? { kampus: [], beasiswa: [] } : [];
      }
    });
    return { ...apiStudent, ...extras };
  });
}