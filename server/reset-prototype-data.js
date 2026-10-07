import { pool } from "./db.js";

if (process.env.ALLOW_DB_WRITE !== "1") {
  console.error("Reset dibatalkan. Jalankan dengan ALLOW_DB_WRITE=1 setelah memastikan target database benar.");
  await pool.end();
  process.exit(1);
}

try {
  await pool.query("BEGIN");
  await pool.query("TRUNCATE TABLE scholarships RESTART IDENTITY");
  await pool.query("TRUNCATE TABLE university_programs RESTART IDENTITY");
  await pool.query("COMMIT");
  console.log("Data prototype scholarships dan university_programs sudah dihapus.");
} catch (error) {
  await pool.query("ROLLBACK");
  console.error("Reset data prototype gagal:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
