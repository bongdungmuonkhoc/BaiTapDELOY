import React from "react";
import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Quản Trị Admin</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/admin/cars" className="hover:text-yellow-400 text-lg">
           Quản Lý Xe
        </Link>

        <Link to="/admin/orders" className="hover:text-yellow-400 text-lg font-semibold">
           Quản Lý Đơn Hàng
        </Link>

        <Link to="/admin/users" className="hover:text-yellow-400 text-lg">
           Quản Lý Khách Hàng
        </Link>

        <Link to="/admin/reports" className="hover:text-yellow-400 text-lg font-semibold">
           Quản Lý Thống Kê
        </Link>
      </nav>
    </div>
  );
}

export default AdminSidebar;
