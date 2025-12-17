import React, { useState, useEffect } from "react";

export default function ReportDashboard() {
    const [summary, setSummary] = useState({ TotalOrders: 0, TotalRevenue: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const API_BASE_URL = "http://localhost:5000/api/admin/report"; 

    const formatCurrency = (number) => {
        if (number === null || number === undefined || isNaN(number)) return '0 VNĐ'; 
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    const fetchSummaryReport = async () => {
        setLoading(true);
        setError(null); 
        try {
            const summaryRes = await fetch(`${API_BASE_URL}/summary`);
            if (!summaryRes.ok) {
            
                throw new Error('Không thể kết nối hoặc Server trả về lỗi.');
            }
            const summaryData = await summaryRes.json();
            
            setSummary({
                TotalOrders: parseInt(summaryData.TotalOrders) || 0, 
                TotalRevenue: parseFloat(summaryData.TotalRevenue) || 0 
            });

        } catch (error) {
            console.error("Lỗi Fetch Báo Cáo Tổng Quan:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummaryReport();
    }, []);

    if (loading) {
        return <div className="p-5 text-center text-blue-500">Đang tải dữ liệu báo cáo...</div>;
    }
    
    if (error) {
        return (
            <div className="p-5 text-center text-red-600 border border-red-300 bg-red-50 rounded-lg">
                <p className="font-bold text-lg">🚨 Lỗi Tải Dữ Liệu Báo Cáo</p>
                <p className="text-sm">Chi tiết: {error}. Vui lòng kiểm tra lại kết nối Server Backend.</p>
            </div>
        );
    }
    return (
        <div className="p-5 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">📊 Báo Cáo Tổng Quan Doanh Thu</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-blue-500">
                    <p className="text-lg text-gray-500">Tổng Số Đơn Đã Xác Nhận</p>
                    <p className="text-4xl font-extrabold text-blue-700 mt-1">
                        {summary.TotalOrders}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Đơn vị: chiếc (hợp đồng)</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-xl border-l-4 border-green-500">
                    <p className="text-lg text-gray-500">Tổng Doanh Thu Đạt Được</p>
                    <p className="text-4xl font-extrabold text-green-700 mt-1">
                        {formatCurrency(summary.TotalRevenue)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Tính trên tổng giá trị hợp đồng đã xác nhận</p>
                </div>
            </div>
        </div>
    );
}