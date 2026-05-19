const db = require('./config/db');

async function migrate() {
  try {
    console.log("Memulai penambahan kolom balance...");
    
    // Tambahkan kolom balance jika belum ada (gunakan trik MySQL karena IF NOT EXISTS untuk ADD COLUMN tidak standard)
    // Di Node, kita coba ALTER TABLE, kalau error duplikat kita abaikan.
    try {
      await db.execute('ALTER TABLE users ADD COLUMN balance INT DEFAULT 0;');
      console.log("Kolom balance berhasil ditambahkan ke tabel users.");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log("Kolom balance sudah ada.");
      } else {
        throw e;
      }
    }
    
    console.log("Selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
}

migrate();
