import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- University Programs ----------

app.get("/api/university-programs", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM university_programs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data university programs" });
  }
});

app.post("/api/university-programs", async (req, res) => {
  const { university, country, program, degree_level } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO university_programs (university, country, program, degree_level)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [university, country, program, degree_level]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambah university program" });
  }
});

app.put("/api/university-programs/:id", async (req, res) => {
  const { id } = req.params;
  const { university, country, program, degree_level } = req.body;
  try {
    const result = await pool.query(
      `UPDATE university_programs
       SET university = $1, country = $2, program = $3, degree_level = $4
       WHERE id = $5 RETURNING *`,
      [university, country, program, degree_level, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengubah university program" });
  }
});

app.delete("/api/university-programs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM university_programs WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghapus university program" });
  }
});

// ---------- Scholarships ----------

app.get("/api/scholarships", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM scholarships ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data scholarships" });
  }
});

app.post("/api/scholarships", async (req, res) => {
  const scholarship = normalizeScholarshipPayload(req.body);
  if (!scholarship.name) {
    return res.status(400).json({ error: "Nama scholarship wajib diisi" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO scholarships (
        name, provider, coverage, level, program_category, university, continent, country,
        open_registration, earliest_deadline, currency, scholarship_type, funding_type,
        benefit_notes, document_category, document_detail, eligibility_notes,
        eligibility_criteria, source_url, source_checked_at, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21
      ) RETURNING *`,
      scholarshipValues(scholarship)
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambah scholarship" });
  }
});

app.put("/api/scholarships/:id", async (req, res) => {
  const { id } = req.params;
  const scholarship = normalizeScholarshipPayload(req.body);
  if (!scholarship.name) {
    return res.status(400).json({ error: "Nama scholarship wajib diisi" });
  }

  try {
    const result = await pool.query(
      `UPDATE scholarships
       SET name = $1, provider = $2, coverage = $3, level = $4,
           program_category = $5, university = $6, continent = $7, country = $8,
           open_registration = $9, earliest_deadline = $10, currency = $11,
           scholarship_type = $12, funding_type = $13, benefit_notes = $14,
           document_category = $15, document_detail = $16, eligibility_notes = $17,
           eligibility_criteria = $18, source_url = $19, source_checked_at = $20,
           status = $21, updated_at = NOW()
       WHERE id = $22 RETURNING *`,
      [...scholarshipValues(scholarship), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengubah scholarship" });
  }
});

app.delete("/api/scholarships/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM scholarships WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghapus scholarship" });
  }
});

// ---------- Students ----------

app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil data students" });
  }
});

app.get("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengambil detail student" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name, email, phone, grade, current_degree, package: pkg, package_name,
    payment_date, current_stage, next_deadline, overall_status, gpa, action, pic_sso,
  } = req.body;
  try {
    const result = await pool.query(
      `UPDATE students SET
        name = $1, email = $2, phone = $3, grade = $4, current_degree = $5,
        package = $6, package_name = $7, payment_date = $8, current_stage = $9,
        next_deadline = $10, overall_status = $11, gpa = $12, action = $13, pic_sso = $14,
        updated_at = NOW()
       WHERE id = $15 RETURNING *`,
      [name, email, phone, grade, current_degree, pkg, package_name, payment_date,
       current_stage, next_deadline, overall_status, gpa, action, pic_sso, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Student tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal mengubah data student" });
  }
});

function normalizeScholarshipPayload(payload = {}) {
  const text = (...keys) => {
    const value = keys.map((key) => payload[key]).find((candidate) => candidate !== undefined && candidate !== null);
    return typeof value === "string" ? value.trim() || null : value ?? null;
  };
  const object = (...keys) => {
    const value = keys.map((key) => payload[key]).find((candidate) => candidate !== undefined && candidate !== null);
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  };

  return {
    name: text("name", "scholarship"),
    provider: text("provider"),
    coverage: text("coverage", "funding_type"),
    level: text("level", "degree"),
    programCategory: text("programCategory", "program_category"),
    university: text("university"),
    continent: text("continent"),
    country: text("country"),
    openRegistration: text("openRegistration", "open_registration"),
    earliestDeadline: text("earliestDeadline", "earliest_deadline"),
    currency: text("currency", "currency_beasiswa"),
    scholarshipType: text("scholarshipType", "scholarship_type"),
    fundingType: text("fundingType", "funding_type"),
    benefitNotes: text("benefitNotes", "benefit_notes", "notes_benefit"),
    documentCategory: text("documentCategory", "document_category"),
    documentDetail: text("documentDetail", "document_detail", "notes_document_detail"),
    eligibilityNotes: text("eligibilityNotes", "eligibility_notes", "eligibility__notes_"),
    eligibilityCriteria: object("eligibilityCriteria", "eligibility_criteria"),
    sourceUrl: text("sourceUrl", "source_url"),
    sourceCheckedAt: text("sourceCheckedAt", "source_checked_at"),
    status: text("status") || "active",
  };
}

function scholarshipValues(scholarship) {
  return [
    scholarship.name,
    scholarship.provider,
    scholarship.coverage,
    scholarship.level,
    scholarship.programCategory,
    scholarship.university,
    scholarship.continent,
    scholarship.country,
    scholarship.openRegistration,
    scholarship.earliestDeadline,
    scholarship.currency,
    scholarship.scholarshipType,
    scholarship.fundingType,
    scholarship.benefitNotes,
    scholarship.documentCategory,
    scholarship.documentDetail,
    scholarship.eligibilityNotes,
    scholarship.eligibilityCriteria,
    scholarship.sourceUrl,
    scholarship.sourceCheckedAt,
    scholarship.status,
  ];
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
