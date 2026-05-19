const db = require('../config/db');

exports.getBalance = async (req, res) => {
  try {
    // Ambil id dari token JWT
    const userId = req.user.id;

    // Query balance dari database
    const [users] = await db.execute('SELECT balance FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(401).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null
      });
    }

    const balance = users[0].balance;

    res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance: balance
      }
    });

  } catch (error) {
    console.error("Error Get Balance:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};

exports.topup = async (req, res) => {
  const { top_up_amount } = req.body;

  try {
    const userId = req.user.id;

    // Tambah saldo user
    await db.execute(
      'UPDATE users SET balance = balance + ? WHERE id = ?',
      [top_up_amount, userId]
    );

    // Catat histori transaksi
    await db.execute(
      'INSERT INTO transactions (user_id, transaction_type, amount, description) VALUES (?, ?, ?, ?)',
      [userId, 'TOPUP', top_up_amount, 'Top Up Balance']
    );

    // Ambil saldo terbaru untuk response
    const [users] = await db.execute('SELECT balance FROM users WHERE id = ?', [userId]);
    const balance = users[0].balance;

    res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: balance
      }
    });

  } catch (error) {
    console.error("Error Topup:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};

exports.transaction = async (req, res) => {
  const { service_code } = req.body;

  try {
    const userId = req.user.id;

    // 1. Cek apakah service_code ada di tabel services
    const [services] = await db.execute('SELECT * FROM services WHERE service_code = ?', [service_code]);
    if (services.length === 0) {
      return res.status(400).json({
        status: 102,
        message: "Service ataus Layanan tidak ditemukan",
        data: null
      });
    }

    const service = services[0];
    const tariff = service.service_tariff;

    // 2. Cek saldo user
    const [users] = await db.execute('SELECT balance FROM users WHERE id = ?', [userId]);
    const currentBalance = users[0].balance;

    if (currentBalance < tariff) {
      return res.status(400).json({
        status: 102,
        message: "Saldo tidak mencukupi",
        data: null
      });
    }

    // 3. Generate Invoice Number (Format: INVDDMMYYYY-XXX)
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV${day}${month}${year}-${randomSuffix}`;

    // 4. Kurangi saldo user
    await db.execute(
      'UPDATE users SET balance = balance - ? WHERE id = ?',
      [tariff, userId]
    );

    // 5. Catat transaksi
    await db.execute(
      'INSERT INTO transactions (user_id, transaction_type, amount, description, invoice_number, service_code) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, 'PAYMENT', tariff, service.service_name, invoiceNumber, service_code]
    );

    res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number: invoiceNumber,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: tariff,
        created_on: date.toISOString()
      }
    });

  } catch (error) {
    console.error("Error Transaction:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};

exports.history = async (req, res) => {
  try {
    const userId = req.user.id;
    let { offset, limit } = req.query;

    offset = parseInt(offset) || 0;
    
    // Siapkan query dasar
    let query = 'SELECT invoice_number, transaction_type, description, amount as total_amount, created_at as created_on FROM transactions WHERE user_id = ? ORDER BY created_at DESC';
    const queryParams = [userId];

    // Jika ada limit, tambahkan LIMIT dan OFFSET
    if (limit) {
      limit = parseInt(limit);
      query += ' LIMIT ? OFFSET ?';
      queryParams.push(limit, offset);
    }

    const [transactions] = await db.query(query, queryParams);

    res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: offset,
        limit: limit ? parseInt(limit) : 0, // jika tidak dikirim limit, bisa dikembalikan 0 atau sesuai ekspektasi
        records: transactions
      }
    });

  } catch (error) {
    console.error("Error Transaction History:", error);
    res.status(500).json({
      status: 999,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
};
