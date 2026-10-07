import fs from "node:fs/promises";
import { pool } from "./db.js";

if (process.env.ALLOW_DB_WRITE !== "1") {
  console.error("Migrasi dibatalkan. Pastikan target database benar, lalu jalankan dengan ALLOW_DB_WRITE=1.");
  await pool.end();
  process.exit(1);
}

const schema = await fs.readFile(new URL("./schema.sql", import.meta.url), "utf8");

try {
  await pool.query(schema);
  console.log("Database schema berhasil diperbarui.");
} finally {
  await pool.end();
}
