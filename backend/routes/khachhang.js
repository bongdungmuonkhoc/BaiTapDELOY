const express = require('express');
const router = express.Router();
const db = require('../db'); 

// API 1: Lấy tất cả khách hàng (có thêm trạng thái)
router.get('/all', (req, res) => {
    const sql = `
        SELECT Ma_KH, tenkhachhang, sdt, CCCD, diachi, email, TrangThai
        FROM khachhang
        ORDER BY Ma_KH DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Lỗi khi lấy danh sách khách hàng:", err);
            return res.status(500).json({ error: true, message: "Lỗi hệ thống khi tải khách hàng." });
        }
        res.json(result);
    });
});
// API 2: Khóa/Mở khóa khách hàng
router.put('/toggle-status/:Ma_KH', (req, res) => {
    const { Ma_KH } = req.params;
    const { newStatus } = req.body;

    if (newStatus !== 'Hoạt động' && newStatus !== 'Đã khóa') {
        return res.status(400).json({ error: true, message: "Trạng thái không hợp lệ." });
    }

    const sql = `
        UPDATE khachhang 
        SET TrangThai = ? 
        WHERE Ma_KH = ?
    `;

    db.query(sql, [newStatus, Ma_KH], (err, result) => {
        if (err) {
            console.error(`Lỗi khi cập nhật trạng thái KH ${Ma_KH}:`, err);
            return res.status(500).json({ error: true, message: "Lỗi hệ thống khi cập nhật trạng thái." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: true, message: "Không tìm thấy khách hàng." });
        }
        res.json({ error: false, message: `Cập nhật trạng thái khách hàng ${Ma_KH} thành công: ${newStatus}` });
    });
});

// API 3: Thêm/Đăng ký khách hàng mới
router.post('/register', (req, res) => {
    const { Ma_KH, tenkhachhang, sdt, CCCD, diachi, email } = req.body;
    
    if (!Ma_KH || !tenkhachhang || !sdt || !CCCD) {
        return res.status(400).json({ error: true, message: 'Thiếu thông tin bắt buộc: Mã KH, Tên, SĐT, CCCD.' });
    }

    const sql = `
        INSERT INTO khachhang (Ma_KH, tenkhachhang, sdt, CCCD, diachi, email, TrangThai)
        VALUES (?, ?, ?, ?, ?, ?, 'Hoạt động')
    `;
    const params = [Ma_KH, tenkhachhang.trim(), sdt.trim(), CCCD.trim(), diachi, email];

    db.query(sql, params, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: true, message: 'Mã khách hàng hoặc CCCD đã tồn tại.' });
            }
            console.error("Lỗi khi đăng ký khách hàng:", err);
            return res.status(500).json({ error: true, message: "Lỗi hệ thống khi đăng ký khách hàng." });
        }
        res.status(201).json({ error: false, message: `Đăng ký khách hàng ${Ma_KH} thành công.`, Ma_KH });
    });
});

// API 4: Xóa khách hàng (FORCED DELETE - BỎ QUA RÀNG BUỘC)
router.delete('/delete/:Ma_KH', (req, res) => {
    const { Ma_KH } = req.params;

    db.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
        if (err) return res.status(500).json({ error: true, message: "Lỗi hệ thống khi tắt kiểm tra khóa ngoại." });

        db.query('DELETE FROM khachhang WHERE Ma_KH = ?', [Ma_KH], (err, result) => {
            const affectedRows = result ? result.affectedRows : 0;
            
            db.query('SET FOREIGN_KEY_CHECKS = 1', (err2) => {
                if (err2) console.error("CẢNH BÁO: Không thể bật FOREIGN_KEY_CHECKS lại:", err2); 

                if (err) {
                    console.error(`Lỗi khi xóa KH ${Ma_KH}:`, err);
                    return res.status(500).json({ error: true, message: "Lỗi hệ thống khi xóa khách hàng." });
                }

                if (affectedRows === 0) {
                    return res.status(404).json({ error: true, message: "Không tìm thấy khách hàng để xóa." });
                }
                
                res.json({ error: false, message: `Xóa khách hàng ${Ma_KH} thành công.` });
            });
        });
    });
});
module.exports = router;