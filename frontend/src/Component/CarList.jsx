import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

function CarList() {
  const API_URL = import.meta.env.VITE_API_URL; // ✅ dùng cho production

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [hopDongMoi, setHopDongMoi] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const location = useLocation();

  const [formData, setFormData] = useState({
    tenKhach: "",
    sdt: "",
    ngayThue: "",
    ngayTra: "",
  });

  const fetchCars = async () => {
    try {
      const res = await fetch(`${API_URL}/api/xe`);
      const data = await res.json();
      setCars(data);
      setFilteredCars(data);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.state?.maXe) {
      const xe = cars.find((c) => c.Ma_Xe === location.state.maXe);
      if (xe) handleOpenForm(xe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars]);

  const handleSearch = async (keyword) => {
    try {
      const res = await fetch(
        `${API_URL}/api/xe?search=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      setFilteredCars(data);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    }
  };

  const handleFilter = (loai) => {
    if (loai === "all") {
      setFilteredCars(cars);
    } else {
      const filtered = cars.filter((car) => car.Loai === loai);
      setFilteredCars(filtered);
    }
  };

  const handleOpenForm = (car) => {
    setSelectedCar(car);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const { tenKhach, sdt, ngayThue, ngayTra } = formData;

    if (!tenKhach || !sdt || !ngayThue || !ngayTra) {
      alert("Vui lòng nhập đầy đủ thông tin thuê xe.");
      return;
    }

    const start = new Date(ngayThue);
    const end = new Date(ngayTra);
    const msPerDay = 1000 * 60 * 60 * 24;
    const soNgay = Math.ceil((end - start) / msPerDay);

    if (soNgay <= 0) {
      alert("Ngày trả phải sau ngày thuê.");
      return;
    }

    const giaThue = selectedCar.Gia_Thue_Ngay;
    const tongTien = soNgay * giaThue;

    const hopDong = {
      Ten_Khach: tenKhach.trim(),
      SDT: sdt.trim(),
      Ma_Xe: selectedCar.Ma_Xe,
      Ngay_Thue: ngayThue,
      Ngay_Tra: ngayTra,
      TongTien: tongTien,
    };

    try {
      const res = await fetch(`${API_URL}/api/hopdong`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hopDong),
      });

      const data = await res.json();

      if (data.error || (data.message && data.message.includes("Không tìm thấy khách hàng"))) {
        alert(data.message || "Thuê xe thất bại!");
        return;
      }

      localStorage.setItem("maKH", data.Ma_KH);
      setHopDongMoi(data);
      setShowForm(false);
      setFormData({ tenKhach: "", sdt: "", ngayThue: "", ngayTra: "" });

      await fetchCars();
    } catch (err) {
      console.error("Lỗi tạo hợp đồng:", err);
      alert("Thuê xe thất bại!");
    }
  };

  const traXe = async (maHD_raw) => {
    if (!maHD_raw || isNaN(maHD_raw)) {
      alert("Mã hợp đồng không hợp lệ.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/hopdong/${maHD_raw}/tra`, {
        method: "PUT",
      });

      const data = await res.json();

      if (data.error || data.message?.includes("không tìm thấy")) {
        alert(data.message || "Trả xe thất bại!");
        return;
      }

      alert(data.message);
      setHopDongMoi(null);

      await fetchCars();
    } catch (err) {
      console.error("Lỗi trả xe:", err);
      alert("Trả xe thất bại!");
    }
  };

  return (
    
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-[30px] font-bold text-center text-[#25a18e] mb-6">
        Hãy Lựa Chọn Xe của Riêng Bạn
      </h1>
        {/* Header có ô tìm kiếm */}
                <SearchBar onSearch={handleSearch} />

      <div className="flex justify-start gap-2 mb-4">
        <button onClick={() => handleFilter('all')} className="px-4 py-2 bg-[#52b788] text-white rounded-full hover:bg-[#7bf1a8] transition transform duration-300  hover:scale-105 hover:border hover:border-green-400">Trang Chủ</button>
        <button onClick={() => handleFilter('7 chỗ')} className="px-4 py-2 bg-[#52b788] text-white rounded-full hover:bg-[#7bf1a8] transition transform duration-300 hover:scale-105 hover:border hover:border-green-400">Xe 7 Chỗ</button>
        <button onClick={() => handleFilter('5 chỗ')} className="px-4 py-2 bg-[#52b788] text-white rounded-full hover:bg-[#7bf1a8] transition transform duration-300 hover:scale-105 hover:border hover:border-green-400">Xe 5 Chỗ</button>
        <button onClick={() => handleFilter('bán tải')} className="px-4 py-2 bg-[#52b788] text-white rounded-full hover:bg-[#7bf1a8] transition transform duration-300 hover:scale-105 hover:border hover:border-green-400">Bán Tải</button>
      </div>

      <h2 className="text-3xl font-bold mb-[45px] mx-auto text-center  rounded-full text-[#25a18e]">Danh sách xe</h2>

      <div className="flex justify-center mb-[30px]">
        <Link
          to="/history"
          className="px-4 py-2 bg-green-600 text-white  hover:bg-green-500 rounded-full"
        >
          Xem lịch sử hợp đồng
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <div key={car.Ma_Xe} className="bg-white shadow-md rounded-3xl p-4 hover:shadow-lg transition  duration-500  transform hover:scale-105 hover:border hover:border-green-400">
              <Link to={`/xe/${car.Ma_Xe}`}>
                <img
                  src={`/${car.Hinh_Anh}`}
                  alt={car.Ten_Xe}
                  className="w-full h-48 object-cover mb-4 rounded border"
                />
                <h3 className="text-xl font-semibold text-gray-800">{car.Ten_Xe}</h3>
              </Link>

              <p className="text-sm text-gray-600"><strong>Loại:</strong> {car.Loai}</p>
              <p className="text-sm text-gray-600"><strong>Hãng:</strong> {car.Hang_Xe}</p>
              <p className="text-sm text-gray-600"><strong>Biển số:</strong> {car.Bien_So}</p>
              <p className="text-sm text-gray-600"><strong>Giá thuê/ngày:</strong> {Number(car.Gia_Thue_Ngay).toLocaleString()} VND</p>
              <p className={`text-sm font-medium mt-2 ${car.Trang_Thai === 'Có sẵn' ? 'text-green-600' : 'text-red-500'}`}>
                <strong>Trạng thái:</strong> {car.Trang_Thai}
              </p>

              {car.Trang_Thai === 'Có sẵn' && (
                <button
                  onClick={() => handleOpenForm(car)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition transform duration-500 hover:shadow-xl hover:scale-105 hover:border hover:border-green-400"
                >
                  Thuê xe
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">Không có xe phù hợp.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-[#25a18e] mb-4">Thông tin thuê xe</h2>
            <p className="mb-2"><strong>Xe:</strong> {selectedCar?.Ten_Xe}</p>

            <input
              type="text"
              placeholder="Tên khách hàng"
              value={formData.tenKhach}
              onChange={(e) => setFormData({ ...formData, tenKhach: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              value={formData.sdt}
              onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <p className="mb-2"><strong>Ngày thuê:</strong></p>
            <input
              type="date"
              value={formData.ngayThue}
              onChange={(e) => setFormData({ ...formData, ngayThue: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
            />
            <p><strong>Ngày trả:</strong></p>
            <input
              type="date"
              value={formData.ngayTra}
              onChange={(e) => setFormData({ ...formData, ngayTra: e.target.value })}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition"
              >
                Xác nhận thuê
              </button>
            </div>
          </div>
        </div>
      )}

      {hopDongMoi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold text-[#25a18e] mb-4">Hợp đồng thuê xe</h2>
            <p><strong>Mã hợp đồng:</strong> {hopDongMoi.Ma_HD}</p>
            <p><strong>Mã khách hàng:</strong> {hopDongMoi.Ma_KH}</p>
            <p><strong>Mã xe:</strong> {hopDongMoi.Ma_Xe}</p>
            <p><strong>Ngày thuê:</strong> {hopDongMoi.NgayThue}</p>
            <p><strong>Ngày trả dự kiến:</strong> {hopDongMoi.NgayTraDuKien}</p>
            <p><strong>Tổng tiền:</strong> {hopDongMoi.TongTien ? Number(hopDongMoi.TongTien).toLocaleString() : 'Không xác định'} VND</p>
            <p><strong>Trạng thái:</strong> {hopDongMoi.TrangThai}</p>

            <div className="flex justify-between mt-4">
              <Link
                to="/history"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Xem lịch sử hợp đồng
              </Link>

              <div className="flex gap-2">
                {hopDongMoi.TrangThai?.toLowerCase().trim() === 'đang thuê' && (
  <button
    onClick={() => traXe(hopDongMoi.Ma_HD_raw)} // ✅ đúng
    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
  >
    Trả xe
  </button>
)}


                <button
                  onClick={() => setHopDongMoi(null)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default CarList;
