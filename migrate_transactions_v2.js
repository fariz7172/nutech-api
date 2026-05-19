const db = require('./config/db');

async function migrate() {
  try {
    console.log("Memulai update tabel transactions...");
    
    // Tambah kolom invoice_number
    try {
      await db.execute('ALTER TABLE transactions ADD COLUMN invoice_number VARCHAR(100);');
      console.log("Kolom invoice_number berhasil ditambahkan.");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log("Kolom invoice_number sudah ada.");
      else throw e;
    }

    // Tambah kolom service_code
    try {
      await db.execute('ALTER TABLE transactions ADD COLUMN service_code VARCHAR(100);');
      console.log("Kolom service_code berhasil ditambahkan.");
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log("Kolom service_code sudah ada.");
      else throw e;
    }
    
    console.log("Selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
}

migrate();
