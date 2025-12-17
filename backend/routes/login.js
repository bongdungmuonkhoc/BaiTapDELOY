const express = require("express");
const router = express.Router();
const db = require("../db");

function generateMaKH() {
  const random = Math.floor(Math.random() * 900) + 100; 
  return `KH${random}`;
}
router.post("/login", (req, res) => {
  let { ten, sdt, cccd, diachi, email } = req.body;
  ten = ten?.trim();
  sdt = sdt?.trim();
  cccd = cccd?.trim();
  diachi = diachi?.trim();
  email = email?.trim();

  if (!sdt || !/^\d{10}$/.test(sdt)) {
    return res.status(400).json({ success: false, message: "Số điện thoại phải đúng 10 chữ số!" });
  }

  // Admin cố định
  if (ten === "admin") {
    if (sdt !== "0123456789" ) {
      return res.status(400).json({ success: false, message: "Sai thông tin admin!" });
    }
    return res.json({ success: true, role: "admin", message: "Đăng nhập admin thành công!" });
  }

  // Khách hàng: bắt buộc nhập đầy đủ thông tin
  if (!ten || !cccd || !diachi || !email) {
    return res.status(400).json({ success: false, message: "Khách hàng phải nhập đầy đủ thông tin!" });
  }
  const checkSql = "SELECT * FROM khachhang WHERE sdt = ?";
  db.query(checkSql, [sdt], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Lỗi server!" });

    if (results.length > 0) {
      return res.json({
        success: true,
        role: "user",
        Ma_KH: results[0].Ma_KH,
        message: "Đăng nhập thành công!"
      });
    } else {
      const maKH = generateMaKH(); 

const insertSql =
  "INSERT INTO khachhang (Ma_KH, tenkhachhang, sdt, cccd, diachi, email) VALUES (?, ?, ?, ?, ?, ?)";
db.query(insertSql, [maKH, ten, sdt, cccd, diachi, email], (err2, result2) => {
  if (err2) {
    console.log(err2);
    return res.status(500).json({ success: false, message: "Lỗi server khi tạo khách hàng!" });
  }

  return res.json({
    success: true,
    role: "user",
    Ma_KH: maKH, 
    message: "Đăng nhập thành công và đã tạo khách hàng mới!"
  });
      });
    }
  });
});

module.exports = router;
