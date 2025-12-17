import React, { useEffect, useState } from 'react';

function History() {
  const maKH = localStorage.getItem('maKH'); 

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/hopdong?Ma_KH=${maKH}`)
      .then(res => res.json())
      .then(data => {
        setContracts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi lấy hợp đồng:', err);
        setLoading(false);
      });
  }, [maKH]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#25a18e] mb-4">Lịch sử hợp đồng của khách hàng: {maKH}</h2>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : contracts.length > 0 ? (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border p-2">Mã HĐ</th>
              <th className="border p-2">Xe</th>
              <th className="border p-2">Ngày thuê</th>
              <th className="border p-2">Ngày trả dự kiến</th>
              <th className="border p-2">Ngày trả thực tế</th>
              <th className="border p-2">Tổng tiền</th>
              <th className="border p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(c => (
              <tr key={c.Ma_HD}>
                <td className="border p-2">{c.Ma_HD}</td>
                <td className="border p-2">{c.Ten_Xe}</td>
                <td className="border p-2">{c.NgayThue}</td>
                <td className="border p-2">{c.NgayTraDuKien}</td>
                <td className="border p-2">{c.NgayTraThucTe || '-'}</td>
                <td className="border p-2">{Number(c.TongTien).toLocaleString()} VND</td>
                <td className="border p-2">{c.TrangThai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">Không có hợp đồng nào cho khách hàng này.</p>
      )}
    </div>
  );
}

export default History;
