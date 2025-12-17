const express = require("express");
const router = express.Router();
const db = require("../db");

// --- TẤT CẢ XE ---
router.get("/all", (req, res) => {
    const sql = `
        SELECT 
            Ma_Xe, Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta
        FROM xe
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// --- XE 5 CHỖ ---
router.get("/5cho", (req, res) => {
    const sql = `
        SELECT 
            xe.Ma_Xe, xe.Ten_Xe, xe_5cho.So_Cho_Ngoi, xe.Mo_Ta, xe.Hinh_Anh
        FROM xe_5cho
        JOIN xe ON xe_5cho.Ma_Xe = xe.Ma_Xe
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// --- XE 7 CHỖ ---
router.get("/7cho", (req, res) => {
    const sql = `
        SELECT 
            xe.Ma_Xe, xe.Ten_Xe, xe_7cho.So_Cho_Ngoi, xe.Mo_Ta, xe.Hinh_Anh
        FROM xe_7cho
        JOIN xe ON xe_7cho.Ma_Xe = xe.Ma_Xe
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// --- XE BÁN TẢI ---
router.get("/bantai", (req, res) => {
    const sql = `
        SELECT 
            xe.Ma_Xe, xe.Ten_Xe, xe_bantai.Tai_Trong, xe.Mo_Ta, xe.Hinh_Anh
        FROM xe_bantai
        JOIN xe ON xe_bantai.Ma_Xe = xe.Ma_Xe
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// --- 1. THÊM XE MỚI (POST) ---
router.post("/add", (req, res) => {
    const { Ma_Xe, Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta, Loai_Xe, So_Cho_Ngoi, Tai_Trong } = req.body;
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: "Lỗi hệ thống khi bắt đầu giao dịch", error: err });

        const sql_xe = `
            INSERT INTO xe (Ma_Xe, Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values_xe = [Ma_Xe, Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta];

        db.query(sql_xe, values_xe, (err, result) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Lỗi khi thêm vào bảng XE:', err);
                    res.status(500).json({ message: "Lỗi khi thêm vào bảng chính (XE)", error: err });
                });
            }
            let sql_con;
            let values_con;
            let tableName;

            if (Loai_Xe === '5cho') {
                tableName = 'xe_5cho';
                sql_con = `
                    INSERT INTO ${tableName} (Ma_Xe, Ten_Xe, So_Cho_Ngoi, Mo_Ta, Hinh_Anh) 
                    VALUES (?, ?, 5, ?, ?)
                `;
                values_con = [Ma_Xe, Ten_Xe, Mo_Ta, Hinh_Anh];
            } else if (Loai_Xe === '7cho') {
                tableName = 'xe_7cho';
                sql_con = `
                    INSERT INTO ${tableName} (Ma_Xe, Ten_Xe, So_Cho_Ngoi, Mo_Ta, Hinh_Anh) 
                    VALUES (?, ?, 7, ?, ?)
                `;
                values_con = [Ma_Xe, Ten_Xe, Mo_Ta, Hinh_Anh];
            } else if (Loai_Xe === 'bantai') {
                tableName = 'xe_bantai';
                sql_con = `
                    INSERT INTO ${tableName} (Ma_Xe, Ten_Xe, Tai_Trong, Mo_Ta, Hinh_Anh) 
                    VALUES (?, ?, ?, ?, ?)
                `;
                values_con = [Ma_Xe, Ten_Xe, parseFloat(Tai_Trong), Mo_Ta, Hinh_Anh];
            } else {
                return db.rollback(() => {
                    res.status(400).json({ message: "Loại xe không hợp lệ." });
                });
            }

            db.query(sql_con, values_con, (err_con, result_con) => {
                if (err_con) {
                    return db.rollback(() => {
                        console.error(`Lỗi khi thêm vào bảng ${tableName}:`, err_con);
                        res.status(500).json({ message: `Thêm xe thất bại ở bảng ${tableName}`, error: err_con });
                    });
                }
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ message: "Lỗi khi hoàn tất giao dịch (Commit)", error: err });
                        });
                    }
                    res.status(201).json({ message: `Thêm xe ${Ten_Xe} thành công!` });
                });
            });
        });
    });
});

// --- 2. CẬP NHẬT XE (PUT) ---
router.put("/:Ma_Xe", (req, res) => {
    const { Ma_Xe } = req.params;
    const { Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta } = req.body;
    const sql = `
        UPDATE xe 
        SET Ten_Xe = ?, Hang_Xe = ?, Bien_So = ?, Gia_Thue_Ngay = ?, Trang_Thai = ?, Hinh_Anh = ?, Mo_Ta = ?
        WHERE Ma_Xe = ?
    `;
    const values = [Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta, Ma_Xe];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật xe:', err);
            return res.status(500).json({ message: "Lỗi CSDL khi cập nhật xe", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy xe để cập nhật" });
        }
        res.json({ message: "Cập nhật xe thành công!" });
    });
});

// --- 3. XÓA XE (DELETE) ---
router.delete("/:Ma_Xe", (req, res) => {
    const { Ma_Xe } = req.params;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: "Lỗi hệ thống khi bắt đầu giao dịch", error: err });
        const deleteChildrenQueries = [
            'DELETE FROM xe_5cho WHERE Ma_Xe = ?',
            'DELETE FROM xe_7cho WHERE Ma_Xe = ?',
            'DELETE FROM xe_bantai WHERE Ma_Xe = ?'
        ];
        const executeDeleteChildren = (index) => {
            if (index < deleteChildrenQueries.length) {
                db.query(deleteChildrenQueries[index], [Ma_Xe], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Lỗi khi xóa từ bảng con:', err);
                            res.status(500).json({ message: "Lỗi khi xóa khóa ngoại từ bảng con", error: err });
                        });
                    }
                    executeDeleteChildren(index + 1); 
                });
            } else {
                const sql_xe = 'DELETE FROM xe WHERE Ma_Xe = ?';
                db.query(sql_xe, [Ma_Xe], (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Lỗi khi xóa từ bảng XE:', err);
                            res.status(500).json({ message: "Lỗi khi xóa xe từ bảng chính (XE)", error: err });
                        });
                    }
                    
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: "Lỗi khi hoàn tất giao dịch (Commit)", error: err });
                            });
                        }
                        if (result.affectedRows === 0) {
                            res.status(404).json({ message: "Không tìm thấy xe để xóa" });
                        } else {
                            res.json({ message: "Xóa xe thành công!" });
                        }
                    });
                });
            }
        };
        executeDeleteChildren(0);
    });
});

module.exports = router;