// db.js
const mysql = require('mysql2');

// Tạo kết nối tới MySQL
const db = mysql.createConnection({
  host: 'localhost',     // hoặc IP của server MySQL
  user: 'root',          // user MySQL
  password: '',          // mật khẩu MySQL
  database: 'db_thuexe'  // tên database bạn đã tạo
});

// Kiểm tra kết nối
db.connect(err => {
  if (err) {
    console.error('Kết nối MySQL thất bại: ', err);
    return;
  }
  console.log('Kết nối MySQL thành công!');
});

module.exports = db;
