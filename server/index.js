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
  const { name, provider, coverage, level } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO scholarships (name, provider, coverage, level)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, provider, coverage, level]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menambah scholarship" });
  }
});

app.put("/api/scholarships/:id", async (req, res) => {
  const { id } = req.params;
  const { name, provider, coverage, level } = req.body;
  try {
    const result = await pool.query(
      `UPDATE scholarships
       SET name = $1, provider = $2, coverage = $3, level = $4
       WHERE id = $5 RETURNING *`,
      [name, provider, coverage, level, id]
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});