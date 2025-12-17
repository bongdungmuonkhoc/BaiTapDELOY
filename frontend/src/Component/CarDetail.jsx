import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/xe/${id}`)
      .then(res => res.json())
      .then(data => setCar(data))
      .catch(err => console.error('Lỗi fetch chi tiết xe:', err));
  }, [id]);

  if (!car) return <p className="text-center mt-10">Đang tải thông tin xe...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-[#25a18e] mb-8 text-center">Thông Tin Chi Tiết Xe</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Card thông tin xe bên trái */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <img
            src={`/${car.Hinh_Anh}`}
            alt={car.Ten_Xe}
            className="w-full h-64 object-cover mb-4 rounded"
          />
          <h2 className="text-2xl font-bold text-[#25a18e] mb-2">{car.Ten_Xe}</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Loại:</strong> {car.Loai}</p>
            <p><strong>Hãng:</strong> {car.Hang_Xe}</p>
            <p><strong>Biển số:</strong> {car.Bien_So}</p>
            <p><strong>Giá thuê/ngày:</strong> {Number(car.Gia_Thue_Ngay).toLocaleString()} VND</p>
            <p className={`font-medium ${car.Trang_Thai === 'Có sẵn' ? 'text-green-600' : 'text-red-500'}`}>
              <strong>Trạng thái:</strong> {car.Trang_Thai}
            </p>
          </div>
        </div>

        {/* Mô tả xe bên phải */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold text-[#25a18e] mb-4">Mô tả xe</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {car.Mo_Ta || 'Xe chưa có mô tả chi tiết trong hệ thống.'}
          </p>
        </div>
      </div>

      {/* Nút điều hướng */}
      <div className="max-w-6xl mx-auto flex justify-center gap-6">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-[#1f8a76] transition transform duration-300 hover:scale-105  "
        >
           Quay lại
        </button>
    <button
        onClick={() => navigate('/', { state: { maXe: car.Ma_Xe } })}
        className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-[#1f8a76]  transition transform duration-300 hover:scale-105   "
        >
           Thuê ngay
        </button>
      </div>
    </div>  
  );    
}

export default CarDetail;
