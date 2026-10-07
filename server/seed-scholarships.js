import fs from "node:fs/promises";
import { pool } from "./db.js";

if (process.env.ALLOW_DB_WRITE !== "1") {
  console.error("Seed dibatalkan. Jalankan dengan ALLOW_DB_WRITE=1 setelah memastikan target database benar.");
  await pool.end();
  process.exit(1);
}

const sourceRows = JSON.parse(
  await fs.readFile(new URL("./source-scholarships.json", import.meta.url), "utf8")
).filter((row) => row.scholarship?.trim());

const sourceColumns = [
  "scholarship", "degree", "grade", "continent", "country", "open_registration",
  "earliest_deadline", "currency_beasiswa", "scholarship_type", "notes_benefit",
  "document_category", "notes_document_detail", "min__gpa__scale_100_",
  "min__gpa__scale_4_0_", "program_category", "funding_type", "min_age",
  "standardized_test", "a_level", "nationality", "min_gpa_raport", "ielts__overall_",
  "minimum_total_score_sat", "min_score_delf_dalf", "min_score_dsh__germany_",
  "min_score_hsk", "min_score_jlpt", "min_score_tocfl", "min_score_toefl_ibt",
  "minimum_score_act", "eligibility__notes_", "university",
];

const coreInsertColumns = [
  "name", "provider", "coverage", "level", "program_category", "university", "continent", "country",
  "open_registration", "earliest_deadline", "currency", "scholarship_type", "funding_type",
  "benefit_notes", "document_category", "document_detail", "eligibility_notes", "eligibility_criteria",
  "source_url", "source_checked_at", "status", "record_type",
];
const insertColumns = [
  ...coreInsertColumns,
  ...sourceColumns.filter((column) => !coreInsertColumns.includes(column)),
  "raw_source_record",
];
const sourceOnlyColumns = sourceColumns.filter((column) => !coreInsertColumns.includes(column));

const text = (row, key) => row[key] ?? "";
const nullableText = (row, key) => text(row, key).trim() || null;
const nullableDate = (row, key) => nullableText(row, key);

function criteriaFrom(row) {
  const criteriaKeys = [
    "min__gpa__scale_100_", "min__gpa__scale_4_0_", "min_age", "standardized_test",
    "a_level", "nationality", "min_gpa_raport", "ielts__overall_", "minimum_total_score_sat",
    "min_score_delf_dalf", "min_score_dsh__germany_", "min_score_hsk", "min_score_jlpt",
    "min_score_tocfl", "min_score_toefl_ibt", "minimum_score_act", "eligibility__notes_",
  ];
  return Object.fromEntries(criteriaKeys.filter((key) => text(row, key).trim()).map((key) => [key, text(row, key)]));
}

function valuesFor(row) {
  const scholarshipName = nullableText(row, "scholarship");
  const recordType = "scholarship";
  const rawValues = sourceOnlyColumns.map((column) => text(row, column));

  return [
    scholarshipName,
    null,
    nullableText(row, "funding_type"),
    nullableText(row, "degree"),
    nullableText(row, "program_category"),
    nullableText(row, "university"),
    nullableText(row, "continent"),
    nullableText(row, "country"),
    nullableDate(row, "open_registration"),
    nullableDate(row, "earliest_deadline"),
    nullableText(row, "currency_beasiswa"),
    nullableText(row, "scholarship_type"),
    nullableText(row, "funding_type"),
    nullableText(row, "notes_benefit"),
    nullableText(row, "document_category"),
    nullableText(row, "notes_document_detail"),
    nullableText(row, "eligibility__notes_"),
    JSON.stringify(criteriaFrom(row)),
    null,
    null,
    "active",
    recordType,
    ...rawValues,
    JSON.stringify(row),
  ];
}

try {
  await pool.query("BEGIN");

  for (const row of sourceRows) {
    const values = valuesFor(row);
    const existing = await pool.query(
      "SELECT 1 FROM scholarships WHERE raw_source_record = $1::jsonb LIMIT 1",
      [JSON.stringify(row)]
    );
    if (existing.rowCount > 0) continue;

    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    await pool.query(
      `INSERT INTO scholarships (${insertColumns.join(", ")}) VALUES (${placeholders})`,
      values
    );
  }

  await pool.query("COMMIT");
  console.log(`${sourceRows.length} baris source scholarship diproses (data identik dilewati).`);
} catch (error) {
  await pool.query("ROLLBACK");
  console.error("Seed scholarship gagal:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
