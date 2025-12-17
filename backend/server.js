const express = require('express');
const cors = require('cors');

const xeRoutes = require('./routes/xe');
const hopdongRoutes = require('./routes/hopdong');
const loginRoutes = require('./routes/login');
const xeAdminRoutes = require('./routes/xe_admin');
const usersRoutes = require('./routes/khachhang');
const reportRoutes = require('./routes/report');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route đăng nhập / khách
app.use('/api', loginRoutes);

// Route xe khách và hợp đồng
app.use('/api', xeRoutes);
app.use('/api', hopdongRoutes);

// Route admin quản lý xe
app.use('/api/admin/xe', xeAdminRoutes);

// Route admin quản lý khách hàng 
app.use('/api/admin/khachhang', usersRoutes);

// Route báo cáo thống kê
app.use('/api/admin/report', reportRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
});
