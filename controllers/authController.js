const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/db');

exports.registration = async (req, res) => {
  // 1. Cek format email dan validasi lainnya menggunakan express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 102,
      message: errors.array()[0].msg,
      data: null
    });
  }

  const { email, first_name, last_name, password } = req.body;

  try {
    // 2. Cek apakah email sudah terdaftar
    const [existingUser] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 102,
        message: "Email sudah terdaftar",
        data: null
      });
    }

    // 3. Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Simpan ke database
    await db.execute(
      'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
      [email, first_name, last_name, hashedPassword]
    );

    // 5. Response sukses
    res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null
    });

  } catch (error) {
    console.error("Error Registration:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};

exports.login = async (req, res) => {
  // 1. Cek format email dan validasi
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 102,
      message: errors.array()[0].msg,
      data: null
    });
  }

  const { email, password } = req.body;

  try {
    // 2. Cari user berdasarkan email
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }

    const user = users[0];

    // 3. Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 103,
        message: "Username atau password salah",
        data: null
      });
    }

    // 4. Generate JWT Token
    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };

    // Set token expiration (misal 12 jam)
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '12h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          status: 0,
          message: "Login Sukses",
          data: {
            token: token
          }
        });
      }
    );

  } catch (error) {
    console.error("Error Login:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};
