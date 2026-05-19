const mysql = require('mysql2/promise');
require('dotenv').config();

// Kita tangkap URL jika ada, atau fallback ke variabel terpisah
let connectionConfig = {};

if (process.env.MYSQL_URL) {
  connectionConfig = process.env.MYSQL_URL;
} else {
  connectionConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

console.log("==> DB CONNECTING TO HOST:", typeof connectionConfig === 'string' ? connectionConfig.split('@')[1] : connectionConfig.host + ":" + connectionConfig.port);

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
