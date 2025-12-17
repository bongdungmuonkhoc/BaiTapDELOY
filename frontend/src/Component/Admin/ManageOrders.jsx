import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api/admin/orders'; 

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatCurrency = (number) => {
        if (number === null || number === undefined || isNaN(number)) return '0 VNĐ';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };


    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL);

            if (!response.ok) {
                 throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const data = await response.json();
            setOrders(data);
            setError(null);
        } catch (err) {
            console.error("Lỗi tải đơn hàng:", err);
            setError("Không thể tải danh sách đơn hàng. Vui lòng kiểm tra Backend Server.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (maHD_raw, newTrangThai) => {
        const maHD = `HD${String(maHD_raw).padStart(3, '0')}`;
        
        if (!window.confirm(`Bạn có chắc chắn muốn chuyển Hợp đồng ${maHD} sang trạng thái "${newTrangThai}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/update/${maHD_raw}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ TrangThai: newTrangThai }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
            }
            
            alert(`Cập nhật trạng thái Hợp đồng ${maHD} thành công.`);
            fetchOrders(); 
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Lỗi cập nhật trạng thái: " + error.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center p-5">Đang tải danh sách đơn hàng...</div>;
    if (error) return <div className="text-center p-5 text-red-500 font-bold">{error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">🛒 Quản Lý Đơn Hàng (Hợp Đồng Thuê)</h2>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã HĐ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Thuê</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe Thuê</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Thuê</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Tiền</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.Ma_HD_raw}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.Ma_HD}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.tenkhachhang} ({order.Ma_KH})</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.Ten_Xe} ({order.Ma_Xe})</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.NgayThue).toLocaleDateString('vi-VN')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{formatCurrency(order.TongTien)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.TrangThai === 'Đã xác nhận' ? 'bg-blue-100 text-blue-800' :
                                        order.TrangThai === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800' :
                                        order.TrangThai === 'Đã từ chối' ? 'bg-red-100 text-red-800' : 
                                        order.TrangThai === 'Đã trả' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.TrangThai}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-center space-x-2">
                                    {order.TrangThai === 'Chờ xác nhận' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(order.Ma_HD_raw, 'Đã xác nhận')}
                                                className="text-white bg-blue-600 hover:bg-blue-700 py-1 px-3 rounded text-xs"
                                            >
                                                Xác Nhận
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(order.Ma_HD_raw, 'Đã từ chối')}
                                                className="text-white bg-red-600 hover:bg-red-700 py-1 px-3 rounded text-xs"
                                            >
                                                Từ Chối
                                            </button>
                                        </>
                                    )}
                                    {(order.TrangThai === 'Đã xác nhận' || order.TrangThai === 'Đang thuê') && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.Ma_HD_raw, 'Đã trả')}
                                            className="text-white bg-green-600 hover:bg-green-700 py-1 px-3 rounded text-xs"
                                        >
                                            Đã Trả
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}