const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parsing body params in JSON format
app.use(express.urlencoded({ extended: true }));

// Folder statis untuk menyimpan dan mengakses gambar upload
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/profileRoutes'));
app.use('/', require('./routes/informationRoutes'));
app.use('/', require('./routes/transactionRoutes'));

app.get('/', (req, res) => res.send('Nutech API Running...'));

// Global error handler untuk menangani bad request (seperti body parsing error dari Postman)
app.use((err, req, res, next) => {
  if (err) {
    console.error("Global Error:", err.message);
    return res.status(400).json({
      status: 102,
      message: "Terjadi kesalahan pada format request (Mungkin Anda mengirim Body pada method GET)",
      data: null
    });
  }
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
