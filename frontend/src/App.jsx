import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Component/Header';
import Banner from './Component/Banner';
import CarList from './Component/CarList';
import CarDetail from './Component/CarDetail';
import History from './Component/History';
import Login from './Component/Login';
import Footer from './Component/Footer';
import AdminDashboard from "./Component/Admin/AdminDashboard";
import ManageCars from "./Component/Admin/ManageCars";
import ManageUsers from "./Component/Admin/ManageUsers";
import ManageOrders from "./Component/Admin/ManageOrders";
import ReportDashboard from './Component/Admin/ReportDashboard';


function App() {
  const location = useLocation();

  return (
    <>
      <Header />

      {/* Chỉ hiện Banner ở trang chủ */}
      {location.pathname === "/" && <Banner />}

      <main className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CarList />} />
          <Route path="/xe/:id" element={<CarDetail />} />
          <Route path="/history" element={<History maKH="KH001" />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="cars" element={<ManageCars />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="reports" element={<ReportDashboard />} />
            
          </Route>
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
