const db = require('./config/db');

async function migrate() {
  try {
    console.log("Memulai pembuatan tabel services...");
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_code VARCHAR(100) NOT NULL UNIQUE,
        service_name VARCHAR(100) NOT NULL,
        service_icon VARCHAR(255) NOT NULL,
        service_tariff INT NOT NULL
      )
    `);
    console.log("Tabel services berhasil dibuat atau sudah ada.");

    const [rows] = await db.execute('SELECT COUNT(*) as count FROM services');
    if (rows[0].count === 0) {
      console.log("Mengisi data service...");
      await db.execute(`
        INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
        ('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
        ('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
        ('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
        ('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
        ('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
        ('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
        ('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
        ('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
        ('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
        ('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
        ('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
        ('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000)
      `);
      console.log("Data service berhasil diisi.");
    } else {
      console.log("Data service sudah ada, mengabaikan proses pengisian.");
    }
    
    console.log("Selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
}

migrate();
