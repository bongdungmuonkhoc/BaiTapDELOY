const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// API lấy danh sách xe (có hỗ trợ tìm kiếm)
// GET /api/xe?search=...
// =======================
router.get("/xe", (req, res) => {
  const { search } = req.query;

  const baseSql = `
    SELECT xe.*, '5 chỗ' AS Loai FROM xe_5cho 
    JOIN xe ON xe.Ma_Xe = xe_5cho.Ma_Xe
    UNION
    SELECT xe.*, '7 chỗ' AS Loai FROM xe_7cho 
    JOIN xe ON xe.Ma_Xe = xe_7cho.Ma_Xe
    UNION
    SELECT xe.*, 'bán tải' AS Loai FROM xe_bantai 
    JOIN xe ON xe.Ma_Xe = xe_bantai.Ma_Xe
  `;

  if (search && search.trim()) {
    const keyword = `%${search.toLowerCase()}%`;
    const sql = `
      SELECT * FROM (
        ${baseSql}
      ) AS allCars
      WHERE LOWER(Ten_Xe) LIKE ?
         OR LOWER(Hang_Xe) LIKE ?
         OR LOWER(Bien_So) LIKE ?
         OR LOWER(Loai) LIKE ?
    `;

    db.query(sql, [keyword, keyword, keyword, keyword], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      return res.json(results);
    });
  } else {
    db.query(baseSql, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      return res.json(results);
    });
  }
});

// =======================
// API lấy chi tiết xe theo id
// GET /api/xe/:id
// =======================
router.get("/xe/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT xe.*, 
      CASE 
        WHEN xe_5cho.Ma_Xe IS NOT NULL THEN '5 chỗ'
        WHEN xe_7cho.Ma_Xe IS NOT NULL THEN '7 chỗ'
        WHEN xe_bantai.Ma_Xe IS NOT NULL THEN 'bán tải'
      END AS Loai
    FROM xe
    LEFT JOIN xe_5cho ON xe.Ma_Xe = xe_5cho.Ma_Xe
    LEFT JOIN xe_7cho ON xe.Ma_Xe = xe_7cho.Ma_Xe
    LEFT JOIN xe_bantai ON xe.Ma_Xe = xe_bantai.Ma_Xe
    WHERE xe.Ma_Xe = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy xe" });
    return res.json(results[0]);
  });
});

// =======================
// Lấy danh sách xe theo loại (TÁCH RIÊNG để không trùng /xe)
// GET /api/xe-theo-loai?loai=5chỗ|7chỗ|bán tải
// =======================
router.get("/xe-theo-loai", (req, res) => {
  const { loai } = req.query;

  let sql = "";
  if (loai === "5chỗ") {
    sql = `
      SELECT xe.Ma_Xe, xe.Ten_Xe, xe.Gia_Thue_Ngay, '5 chỗ' AS Loai,
             xe_5cho.So_Cho_Ngoi, xe_5cho.Mo_Ta, xe_5cho.Hinh_Anh
      FROM xe
      JOIN xe_5cho ON xe.Ma_Xe = xe_5cho.Ma_Xe
    `;
  } else if (loai === "7chỗ") {
    sql = `
      SELECT xe.Ma_Xe, xe.Ten_Xe, xe.Gia_Thue_Ngay, '7 chỗ' AS Loai,
             xe_7cho.So_Cho_Ngoi, xe_7cho.Mo_Ta, xe_7cho.Hinh_Anh
      FROM xe
      JOIN xe_7cho ON xe.Ma_Xe = xe_7cho.Ma_Xe
    `;
  } else if (loai === "bán tải") {
    sql = `
      SELECT xe.Ma_Xe, xe.Ten_Xe, xe.Gia_Thue_Ngay, 'bán tải' AS Loai,
             xe_bantai.Tai_Trong, xe_bantai.Mo_Ta, xe_bantai.Hinh_Anh
      FROM xe
      JOIN xe_bantai ON xe.Ma_Xe = xe_bantai.Ma_Xe
    `;
  } else {
    return res.status(400).json({ success: false, message: "Loại xe không hợp lệ" });
  }

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    return res.json(results);
  });
});

module.exports = router;
