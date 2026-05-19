const mysql = require('mysql2/promise');
require('dotenv').config();

let connectionConfig;

const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL;

if (mysqlUrl) {
  console.log('DB: connecting via MYSQL_URL connection string');
  const parsed = new URL(mysqlUrl);
  connectionConfig = {
    host: parsed.hostname,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace(/^\//, ''),
    port: parseInt(parsed.port, 10) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else {
  console.log('DB: connecting via individual environment variables');
  connectionConfig = {
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(connectionConfig);

module.exports = pool;
