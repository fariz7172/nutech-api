const db = require('./config/db');

async function migrate() {
  try {
    console.log("Memulai pembuatan tabel banners...");
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        banner_name VARCHAR(100) NOT NULL,
        banner_image VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      )
    `);
    console.log("Tabel banners berhasil dibuat atau sudah ada.");

    // Cek apakah tabel kosong
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM banners');
    if (rows[0].count === 0) {
      console.log("Mengisi data banner...");
      await db.execute(`
        INSERT INTO banners (banner_name, banner_image, description) VALUES
        ('Banner 1', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png', 'Lerem Ipsum Dolor sit amet'),
        ('Banner 2', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png', 'Lerem Ipsum Dolor sit amet'),
        ('Banner 3', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png', 'Lerem Ipsum Dolor sit amet'),
        ('Banner 4', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-4.png', 'Lerem Ipsum Dolor sit amet'),
        ('Banner 5', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-5.png', 'Lerem Ipsum Dolor sit amet')
      `);
      console.log("Data banner berhasil diisi.");
    } else {
      console.log("Data banner sudah ada, mengabaikan proses pengisian.");
    }
    
    console.log("Selesai!");
    process.exit(0);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    process.exit(1);
  }
}

migrate();
