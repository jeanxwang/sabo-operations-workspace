export const FOLLOW_UP_TAGS = [
  { id: "deadline-beasiswa-h7", label: "Deadline beasiswa H-7" },
  { id: "inactive-booking", label: "Sudah sebulan tidak booking" },
  { id: "not-onboarded", label: "Belum onboarding" },
];

export const FOLLOW_UP_TAG_LABELS = Object.fromEntries(
  FOLLOW_UP_TAGS.map((tag) => [tag.id, tag.label])
);