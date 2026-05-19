const db = require('./config/db');

async function migrate() {
  try {
    console.log("Memulai pembuatan tabel transactions...");
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        transaction_type VARCHAR(50) NOT NULL,
        amount INT NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log("Tabel transactions berhasil dibuat atau sudah ada.");
    console.log("Selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
}

migrate();
