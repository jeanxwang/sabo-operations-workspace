# Database MVP Academic

Database beasiswa mengikuti source BigQuery yang diberikan: seluruh 32 kolom
source disimpan di kolom aslinya. Salinan lengkap setiap baris juga disimpan di
`raw_source_record` agar tidak ada informasi asli yang hilang.

## Menjalankan migrasi

Pastikan `server/.env` sudah menunjuk ke database yang benar, lalu jalankan dari folder `server`:

```bash
ALLOW_DB_WRITE=1 npm run db:migrate
```

Perintah ini membuat/menambah struktur tabel `scholarships`. Script tidak dijalankan otomatis oleh aplikasi.

## Mengisi sample data

Setelah migrasi berhasil:

```bash
ALLOW_DB_WRITE=1 npm run db:seed:scholarships
```

Seed membaca 9 baris scholarship dari `source-scholarships.json`. Baris pertama
yang hanya berisi country grouping sengaja dilewati karena bukan data beasiswa.
Seed aman dijalankan ulang karena baris source yang identik akan dilewati.

Jika tabel masih berisi data dummy prototype dan Anda memang ingin menggantinya
dengan data master sebenarnya, jalankan reset berikut **sekali saja** sebelum
seed. Perintah ini menghapus seluruh isi `scholarships` dan
`university_programs`, bukan tabelnya:

```bash
ALLOW_DB_WRITE=1 npm run db:reset:prototype
ALLOW_DB_WRITE=1 npm run db:seed:scholarships
```

Pastikan data universitas/program aktual sudah tersedia sebelum mengisi tabel
`university_programs`; sample yang Anda kirim pada tahap ini baru berisi data
beasiswa.

## Menjalankan API

```bash
npm run dev
```

API tersedia di `http://localhost:4000/api/scholarships`.

> Jangan menjalankan migrasi atau seed ke database produksi/shared tanpa memastikan target database dan persetujuan tim. Untuk eksperimen, gunakan database development.
