import React from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-4">
        <Outlet /> {/* Route con như ManageCars và ManageUsers sẽ render ở đây */}
      </div>
    </div>
  );
}

export default AdminDashboard;
