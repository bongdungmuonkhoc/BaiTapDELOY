const express = require('express');
const router = express.Router();
const db = require('../db');

const formatMaHD = (id) => `HD${String(id).padStart(3, '0')}`;

// API 1: Tạo hợp đồng thuê xe 
router.post('/hopdong', (req, res) => {
    let { Ten_Khach, SDT, Ma_Xe, Ngay_Thue, Ngay_Tra } = req.body;

    if (!Ten_Khach || !SDT || !Ma_Xe || !Ngay_Thue || !Ngay_Tra) {
        return res.status(400).json({ message: 'Thiếu thông tin thuê xe.' });
    }

    Ten_Khach = Ten_Khach.trim().toLowerCase();
    SDT = SDT.trim();

    const startDate = new Date(Ngay_Thue);
    const endDate = new Date(Ngay_Tra);
    const msPerDay = 1000 * 60 * 60 * 24;

    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: 'Ngày thuê hoặc ngày trả không hợp lệ.' });
    }

    const soNgay = Math.ceil((endDate - startDate) / msPerDay);
    if (soNgay <= 0) {
        return res.status(400).json({ message: 'Ngày trả phải sau ngày thuê.' });
    }

    const findKhachSql = `
        SELECT Ma_KH, TrangThai FROM khachhang 
        WHERE LOWER(TRIM(tenkhachhang)) = ? AND TRIM(sdt) = ?
    `;
    db.query(findKhachSql, [Ten_Khach, SDT], (err, khachResults) => {
        if (err) return res.status(500).json({ error: err });
        if (khachResults.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy khách hàng.' });
        }
        const { Ma_KH, TrangThai } = khachResults[0];

        if (TrangThai === 'Đã khóa') {
            return res.status(403).json({ 
                error: true, 
                message: "Khách hàng này đã bị khóa tài khoản và không được phép thuê xe." 
            });
        }
        const getGiaXeSql = `SELECT Gia_Thue_Ngay FROM xe WHERE Ma_Xe = ?`;
        db.query(getGiaXeSql, [Ma_Xe], (err2, xeResults) => {
            if (err2) return res.status(500).json({ error: err2 });
            if (xeResults.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy xe.' });
            }

            const GiaThue = parseFloat(xeResults[0].Gia_Thue_Ngay);
            if (!GiaThue || isNaN(GiaThue)) {
                return res.status(400).json({ message: 'Giá thuê xe không hợp lệ.' });
            }

            const TongTien = soNgay * GiaThue;
            const initialStatus = 'Chờ xác nhận'; 
            const insertSql = `
                INSERT INTO hopdongthue 
                (Ma_KH, Ma_Xe, NgayThue, NgayTraDuKien, TongTien, TrangThai)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            db.query(insertSql, [Ma_KH, Ma_Xe, Ngay_Thue, Ngay_Tra, TongTien, initialStatus], (err3, result) => {
                if (err3) return res.status(500).json({ error: err3 });

                const Ma_HD_raw = result.insertId;
                const Ma_HD = formatMaHD(Ma_HD_raw);
                res.json({
                    message: 'Yêu cầu thuê xe đã được gửi đi. Vui lòng chờ Admin xác nhận!',
                    Ma_HD,
                    Ma_HD_raw,
                    Ma_KH,
                    Ma_Xe,
                    NgayThue: Ngay_Thue,
                    NgayTraDuKien: Ngay_Tra,
                    GiaThue,
                    TongTien,
                    TrangThai: initialStatus
                });
            });
        });
    });
});

// API 2: Trả xe (User/Client)
router.put('/hopdong/:id/tra', (req, res) => {
    const { id } = req.params;

    const getHopDongSql = `SELECT Ma_Xe, TrangThai FROM hopdongthue WHERE Ma_HD = ?`;
    db.query(getHopDongSql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy hợp đồng.' });

        const { Ma_Xe, TrangThai } = results[0];
        if (String(TrangThai).toLowerCase().trim() !== 'đã xác nhận') { 
            return res.status(409).json({ message: 'Hợp đồng không ở trạng thái Đã xác nhận/Đang thuê.' });
        }

        const updateHopDongSql = `UPDATE hopdongthue SET TrangThai = 'Đã trả', NgayTraThucTe = CURDATE() WHERE Ma_HD = ?`;
        db.query(updateHopDongSql, [id], (err2) => {
            if (err2) return res.status(500).json({ error: err2 });

            const updateXeSql = `UPDATE xe SET Trang_Thai = 'Có sẵn' WHERE Ma_Xe = ?`;
            db.query(updateXeSql, [Ma_Xe], (err3) => {
                if (err3) return res.status(500).json({ error: err3 });

                res.json({ message: 'Xe đã được trả thành công', Ma_HD: formatMaHD(id), Ma_HD_raw: id, Ma_Xe });
            });
        });
    });
});

// API 3: Xem lịch sử hợp đồng (User/Client)
router.get('/hopdong', (req, res) => {
    let { Ma_KH } = req.query;

    if (!Ma_KH) {
        return res.status(400).json({ message: 'Thiếu mã khách hàng.' });
    }

    Ma_KH = Ma_KH.trim();

    const sql = `
        SELECT h.Ma_HD, h.Ma_Xe, h.NgayThue, h.NgayTraDuKien, h.NgayTraThucTe, 
             h.TongTien, h.TrangThai, x.Ten_Xe
        FROM hopdongthue h
        LEFT JOIN xe x ON h.Ma_Xe = x.Ma_Xe
        WHERE h.Ma_KH = ?
        ORDER BY h.NgayThue DESC
    `;

    db.query(sql, [Ma_KH], (err, results) => {
        if (err) return res.status(500).json({ error: err });

        const formattedResults = results.map(r => ({
            ...r,
            Ma_HD: formatMaHD(r.Ma_HD),
            Ma_HD_raw: r.Ma_HD
        }));

        res.json(formattedResults);
    });
});


// API 4: Lấy danh sách hợp đồng cho Admin
router.get('/admin/orders', (req, res) => {
    const sql = `
        SELECT 
            h.Ma_HD, h.Ma_KH, h.Ma_Xe, h.NgayThue, h.NgayTraDuKien, h.TongTien, h.TrangThai,
            kh.tenkhachhang, x.Ten_Xe
        FROM hopdongthue h
        JOIN khachhang kh ON h.Ma_KH = kh.Ma_KH
        JOIN xe x ON h.Ma_Xe = x.Ma_Xe
        ORDER BY h.Ma_HD DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn đơn hàng Admin:", err);
            return res.status(500).json({ error: true, message: "Lỗi Server khi tải danh sách đơn hàng." });
        }
        
        const formattedResults = results.map(r => ({
            ...r,
            Ma_HD: formatMaHD(r.Ma_HD),
            Ma_HD_raw: r.Ma_HD
        }));

        res.status(200).json(formattedResults);
    });
});
// API 5: Cập nhật trạng thái hợp đồng (Admin)
router.put('/admin/orders/update/:id', (req, res) => {
    const maHD_raw = req.params.id;
    const { TrangThai } = req.body; 

    if (!TrangThai) {
        return res.status(400).send({ message: "Thiếu trạng thái cập nhật." });
    }
    
    const validStates = ['Đã xác nhận', 'Đã từ chối', 'Đã trả'];
    if (!validStates.includes(TrangThai)) {
        return res.status(400).send({ message: "Trạng thái không hợp lệ." });
    }
    const getOrderSql = "SELECT Ma_Xe, TrangThai FROM hopdongthue WHERE Ma_HD = ?";
    db.query(getOrderSql, [maHD_raw], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy Hợp đồng." });

        const { Ma_Xe, TrangThai: currentStatus } = results[0];

        let updateXeSql = null;
        
        if (TrangThai === 'Đã xác nhận' && currentStatus === 'Chờ xác nhận') {
            updateXeSql = `UPDATE xe SET Trang_Thai = 'Đang thuê' WHERE Ma_Xe = ?`;
        } else if (TrangThai === 'Đã từ chối' && currentStatus === 'Chờ xác nhận') {
            updateXeSql = `UPDATE xe SET Trang_Thai = 'Có sẵn' WHERE Ma_Xe = ?`;
        } else if (TrangThai === 'Đã trả') {
             updateXeSql = `UPDATE xe SET Trang_Thai = 'Có sẵn' WHERE Ma_Xe = ?`;
        }
        const updateHopDongSql = `UPDATE hopdongthue SET TrangThai = ? WHERE Ma_HD = ?`;
        db.query(updateHopDongSql, [TrangThai, maHD_raw], (err2, result) => {
            if (err2) return res.status(500).send({ message: "Lỗi Server khi cập nhật trạng thái Hợp đồng." });
            if (updateXeSql) {
                db.query(updateXeSql, [Ma_Xe], (err3) => {
                    if (err3) return res.status(500).send({ message: "Lỗi Server khi cập nhật trạng thái Xe." });
                    res.status(200).send({ message: `Cập nhật trạng thái Hợp đồng ${formatMaHD(maHD_raw)} thành công.` });
                });
            } else {
                 res.status(200).send({ message: `Cập nhật trạng thái Hợp đồng ${formatMaHD(maHD_raw)} thành công.` });
            }
        });
    });
});

module.exports = router;