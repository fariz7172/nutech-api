const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    // req.user didapatkan dari authMiddleware
    const userId = req.user.id;

    // Ambil data user dari database (tambahkan pengecekan profile_image jika ada)
    const [users] = await db.execute(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null
      });
    }

    const user = users[0];

    // Jika profile_image null di DB, set URL gambar default atau sesuai kebutuhan
    const profileImageUrl = user.profile_image ? user.profile_image : "https://yoururlapi.com/profile.jpeg";

    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: profileImageUrl
      }
    });

  } catch (error) {
    console.error("Error Get Profile:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name } = req.body;

    // Pastikan first_name dan last_name dikirim
    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 102,
        message: "Parameter first_name dan last_name wajib diisi",
        data: null
      });
    }

    // Update di database
    await db.execute(
      'UPDATE users SET first_name = ?, last_name = ? WHERE id = ?',
      [first_name, last_name, userId]
    );

    // Ambil data terbaru untuk response
    const [users] = await db.execute(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [userId]
    );
    const user = users[0];
    const profileImageUrl = user.profile_image ? user.profile_image : "https://yoururlapi.com/profile.jpeg";

    res.status(200).json({
      status: 0,
      message: "Update Pofile berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: profileImageUrl
      }
    });
  } catch (error) {
    console.error("Error Update Profile:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // req.file adalah file image yang dikirimkan. Multer akan menangani error format di rute.
    if (!req.file) {
      return res.status(400).json({
        status: 102,
        message: "Format Image tidak sesuai", // Error jika bukan JPEG/PNG juga ditangani di rute
        data: null
      });
    }

    // Buat URL lengkap gambar berdasarkan nama host server (atau string statis jika dikehendaki)
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    // Update URL gambar ke database
    await db.execute(
      'UPDATE users SET profile_image = ? WHERE id = ?',
      [imageUrl, userId]
    );

    // Ambil profil terbaru
    const [users] = await db.execute(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE id = ?',
      [userId]
    );
    const user = users[0];

    res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image
      }
    });

  } catch (error) {
    console.error("Error Update Profile Image:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};
