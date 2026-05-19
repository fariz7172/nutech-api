# Nutech E-Wallet API

REST API untuk sistem dompet digital (E-Wallet) yang dibangun menggunakan **Node.js, Express, dan MySQL** sebagai pemenuhan Take-Home Test Nutech Integrasi.

## 🚀 Fitur Utama
Aplikasi ini meliputi 4 modul utama:
1. **Module Membership:** Registrasi, Login (JWT), Info Profile, Edit Profile, dan Update Foto Profil (Multer).
2. **Module Information:** Daftar Banner dan Layanan PPOB (Tarif).
3. **Module Transaction:** Cek Saldo, Top Up Saldo, Pembayaran Layanan, dan Riwayat Transaksi (Pagination).
4. **Keamanan:** Hash password menggunakan `bcryptjs`, autentikasi sesi menggunakan `jsonwebtoken`, dan perlindungan database dari SQL Injection menggunakan *Prepared Statements* MySQL.

## 🛠️ Teknologi yang Digunakan
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Library Utama:** `mysql2`, `bcryptjs`, `jsonwebtoken`, `express-validator`, `multer`, `cors`, `dotenv`

## ⚙️ Persiapan dan Instalasi

### 1. Clone & Install Dependencies
Pastikan Anda sudah menginstal Node.js dan npm. Buka terminal di folder project ini dan jalankan:
```bash
npm install
```

### 2. Konfigurasi Database
1. Buat database di MySQL (contoh: `nutech_wallet`).
2. Jalankan skrip DDL & DML yang telah disediakan pada file **`database.sql`** ke dalam database Anda. Skrip tersebut akan otomatis:
   - Membuat tabel `users`, `banners`, `services`, dan `transactions`.
   - Mengisi data *dummy* untuk tabel `banners` dan `services`.

### 3. Setup Environment Variables (.env)
Pastikan file `.env` berada di root folder aplikasi dengan konfigurasi seperti berikut (sesuaikan dengan kredensial database Anda):
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_database_anda
DB_NAME=nutech_wallet
JWT_SECRET=rahasia_super_aman_nutech
```

### 4. Menjalankan Server
Jalankan aplikasi dengan perintah:
```bash
node index.js
```
Server akan berjalan secara default di `http://localhost:3000`.

## 📚 Daftar API Endpoint

### 1. Membership (Auth & Profile)
- `POST /registration` - Mendaftarkan akun baru (Public).
- `POST /login` - Autentikasi dan mendapatkan JWT Token (Public).
- `GET /profile` - Mendapatkan informasi profil user (Private).
- `PUT /profile/update` - Mengubah nama depan dan belakang (Private).
- `PUT /profile/image` - Mengunggah foto profil format JPEG/PNG (Private).

### 2. Information
- `GET /banner` - Mendapatkan daftar banner informasi (Public).
- `GET /services` - Mendapatkan daftar layanan beserta tarifnya (Private).

### 3. Transaction
- `GET /balance` - Mengecek saldo terkini (Private).
- `POST /topup` - Melakukan penambahan saldo (Private).
- `POST /transaction` - Melakukan pembayaran layanan / PPOB (Private).
- `GET /transaction/history` - Melihat riwayat transaksi dengan fitur limit & offset (Private).

*Catatan: Semua endpoint berlabel **Private** wajib menyertakan token JWT pada Header `Authorization: Bearer <TOKEN>`.*

## 📁 Struktur Folder
```text
/config       -> Pengaturan koneksi database MySQL
/controllers  -> Logika bisnis pemrosesan API (Auth, Profile, Information, Transaction)
/middlewares  -> Middleware JWT Token
/routes       -> Definisi rute Express.js
/uploads      -> Folder penyimpanan gambar foto profil (Otomatis terbuat)
database.sql  -> DDL & DML skema database
index.js      -> Entry point utama aplikasi
```
