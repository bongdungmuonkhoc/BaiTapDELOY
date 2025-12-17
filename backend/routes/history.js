    const express = require('express');
    const router = express.Router();
    const db = require('../db');
  // Lấy lịch sử hợp đồng theo mã khách hàng
  router.get('/hopdong', (req, res) => {
    const { Ma_KH } = req.query;
    if (!Ma_KH) {
      return res.status(400).json({ message: 'Thiếu mã khách hàng.' });
    }

    const sql = `
      SELECT h.Ma_HD, h.Ma_Xe, h.NgayThue, h.NgayTraDuKien, h.NgayTraThucTe, 
            h.TongTien, h.TrangThai, x.Ten_Xe
      FROM hopdongthue h
      JOIN xe x ON h.Ma_Xe = x.Ma_Xe
      WHERE h.Ma_KH = ?
      ORDER BY h.NgayThue DESC
    `;
    db.query(sql, [Ma_KH], (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  });
