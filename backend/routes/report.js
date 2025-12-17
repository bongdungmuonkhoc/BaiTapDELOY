const express = require('express');
const router = express.Router();
const db = require('../db'); 
// API 1: Báo cáo Tổng quan (Số đơn, Doanh thu)

router.get('/summary', (req, res) => {
    const sql = `
        SELECT 
            COUNT(Ma_HD) AS TotalOrders, 
            SUM(TongTien) AS TotalRevenue
        FROM hopdongthue 
        WHERE TrangThai IN ('Đã xác nhận', 'Đã trả')
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi tạo báo cáo thống kê tổng quan:", err);
            return res.status(500).json({ error: true, message: "Lỗi hệ thống khi tạo báo cáo." });
        }
        res.json(results[0]); 
    });
});

// API 2: Báo cáo Chi tiết theo Xe
router.get('/cars', (req, res) => {
    const sql = `
        SELECT 
            h.Ma_Xe, 
            x.Ten_Xe,
            COUNT(h.Ma_HD) AS TimesRented, 
            SUM(h.TongTien) AS TotalRevenueByCar
        FROM hopdongthue h
        JOIN xe x ON h.Ma_Xe = x.Ma_Xe
        WHERE h.TrangThai IN ('Đã xác nhận', 'Đã trả')
        GROUP BY h.Ma_Xe, x.Ten_Xe
        ORDER BY TotalRevenueByCar DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi khi tạo báo cáo chi tiết xe:", err);
            return res.status(500).json({ error: true, message: "Lỗi hệ thống khi tạo báo cáo chi tiết." });
        }
        res.json(results);
    });
});

module.exports = router;