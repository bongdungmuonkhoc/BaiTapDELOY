import React, { useEffect, useState } from "react";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    
    const API_USERS = "http://localhost:5000/api/admin/khachhang/all";
    const API_TOGGLE_STATUS = "http://localhost:5000/api/admin/khachhang/toggle-status";
    const API_DELETE = "http://localhost:5000/api/admin/khachhang/delete"; 


    const fetchUsers = () => {
        fetch(API_USERS) 
          .then((res) => {
            if (!res.ok) {
                throw new Error('Lỗi khi tải dữ liệu khách hàng. Vui lòng kiểm tra Server Log.');
            }
            return res.json();
          })
          .then((data) => setUsers(data))
          .catch(error => {
            console.error("Lỗi Fetch Khách Hàng:", error);
            alert("Lỗi kết nối khi thực hiện: " + error.message);
          });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = (Ma_KH, currentStatus) => {
        const newStatus = currentStatus === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động';
        const action = newStatus === 'Đã khóa' ? 'khóa' : 'mở khóa';

        if (!window.confirm(`Bạn có chắc muốn ${action} khách hàng ${Ma_KH} không?`)) return;

        fetch(`${API_TOGGLE_STATUS}/${Ma_KH}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newStatus }),
        })
        .then(res => res.json())
        .then((data) => {
            if (data.error) {
                alert("Thao tác thất bại: " + data.message);
            } else {
                alert(data.message);
                fetchUsers(); 
            }
        })
        .catch(error => alert("Lỗi kết nối khi thực hiện: " + error.message));
    };

    const handleDeleteUser = (Ma_KH) => {
        if (!window.confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn khách hàng ${Ma_KH} không?`)) return;

        fetch(`${API_DELETE}/${Ma_KH}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then((data) => {
            if (data.error) {
                alert("Xóa thất bại: " + data.message);
            } else {
                alert(data.message);
                fetchUsers(); 
            }
        })
        .catch(error => alert("Lỗi kết nối khi thực hiện: " + error.message));
    };

    return (
        <div className="p-6 w-full">
            <h1 className="text-3xl font-bold mb-4">Quản Lý Khách Hàng</h1>

            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Mã KH</th>
                        <th className="p-2">Tên</th>
                        <th className="p-2">SĐT</th>
                        <th className="p-2">Email</th>
                        <th className="p-2 text-center">Trạng Thái</th>
                        <th className="p-2 text-center">Hành Động</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((u) => (
                        <tr key={u.Ma_KH} className="border-b">
                            <td className="p-2">{u.Ma_KH}</td>
                            <td className="p-2">{u.tenkhachhang}</td>
                            <td className="p-2">{u.sdt}</td>
                            <td className="p-2">{u.email}</td>

                            <td className="p-2 text-center">
                                <span 
                                    className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                        u.TrangThai === 'Hoạt động' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {u.TrangThai || 'Thiếu DB'}
                                </span>
                            </td>

                            <td className="p-2 text-center">
                                <button
                                    onClick={() => handleToggleStatus(u.Ma_KH, u.TrangThai)}
                                    className={`text-white px-3 py-1 rounded mr-2 ${
                                        u.TrangThai === 'Hoạt động' 
                                            ? 'bg-red-500 hover:bg-red-600' 
                                            : 'bg-green-500 hover:bg-green-600' 
                                    }`}
                                >
                                    {u.TrangThai === 'Hoạt động' ? "Khóa" : "Mở khóa"}
                                </button>
                                
                                <button 
                                    onClick={() => handleDeleteUser(u.Ma_KH)} 
                                    className="bg-red-600 text-white px-3 py-1 rounded ml-2 hover:bg-red-700"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsers;