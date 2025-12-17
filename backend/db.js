// db.js
const mysql = require("mysql2");

const host = (process.env.DB_HOST || "").trim();
const port = Number((process.env.DB_PORT || "3306").trim());
const user = (process.env.DB_USER || "").trim();
const database = (process.env.DB_NAME || "").trim();
const caCert = process.env.DB_CA_CERT; // dán CA cert từ Aiven vào Render env

console.log("DB_HOST:", JSON.stringify(host));
console.log("DB_PORT:", JSON.stringify(port));
console.log("DB_NAME:", JSON.stringify(database));
console.log("DB_CA_CERT loaded:", !!caCert);

const db = mysql.createConnection({
  host,
  port,
  user,
  password: process.env.DB_PASSWORD,
  database,
  ssl: caCert
    ? { ca: caCert } // ✅ đúng cho Aiven (self-signed chain)
    : { rejectUnauthorized: true } // fallback nếu chưa set cert
});

db.connect((err) => {
  if (err) {
    console.error("Kết nối MySQL thất bại:", err);
    return;
  }
  console.log("Kết nối MySQL thành công!");
});

module.exports = db;
