import React, { useState, useEffect } from "react";

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [filterUrl, setFilterUrl] = useState("http://localhost:5000/api/admin/xe/all"); 

  const [formData, setFormData] = useState({
    Ma_Xe: "",
    Ten_Xe: "",
    Hang_Xe: "",
    Bien_So: "",
    Gia_Thue_Ngay: "",
    Trang_Thai: "Có sẵn",
    Hinh_Anh: "",
    Mo_Ta: "",
    Loai_Xe: "5cho",
    So_Cho_Ngoi: 5,
    Tai_Trong: 0.00,
  });

  useEffect(() => {
    fetchCars(filterUrl);
  }, [filterUrl]); 

  const fetchCars = (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCars(data))
      .catch(error => console.error("Lỗi khi tải dữ liệu xe:", error));
  };
    
  const handleFilterChange = (newFilterUrl) => {

    if (showForm) setShowForm(false); 
    setFilterUrl(newFilterUrl);
  };

  const handleDelete = (Ma_Xe) => {
    if (!window.confirm("Bạn có chắc muốn xóa xe này? Việc này sẽ xóa vĩnh viễn xe khỏi tất cả bảng.")) return;

    fetch(`http://localhost:5000/api/admin/xe/${Ma_Xe}`, {
      method: "DELETE",
    })
    .then(res => res.json())
    .then((data) => {
        if (data.error) {
            alert("Xóa thất bại: " + data.message);
        } else {
            alert(data.message);
            fetchCars(filterUrl); 
        }
    })
    .catch(error => alert("Lỗi kết nối khi xóa: " + error.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { Ma_Xe, Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta, Loai_Xe, Tai_Trong } = formData;
    
    const payload = { 
        Ma_Xe, Ten_Xe, Hang_Xe, Bien_So, Gia_Thue_Ngay, Trang_Thai, Hinh_Anh, Mo_Ta, Loai_Xe
    };
    
    if (Loai_Xe === '5cho') {
        payload.So_Cho_Ngoi = 5;
    } else if (Loai_Xe === '7cho') {
        payload.So_Cho_Ngoi = 7;
    } else if (Loai_Xe === 'bantai') {
        payload.Tai_Trong = Tai_Trong;
    }


    const method = editCar ? "PUT" : "POST";
    const url = editCar
      ? `http://localhost:5000/api/admin/xe/${editCar}`
      : "http://localhost:5000/api/admin/xe/add";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), 
    })
    .then(res => res.json())
    .then((data) => {
        if (data.error) {
            alert((editCar ? "Cập nhật" : "Thêm") + " thất bại: " + data.message);
        } else {
            alert(data.message);
            setShowForm(false);
            fetchCars(filterUrl);
        }
    })
    .catch(error => alert("Lỗi kết nối khi thực hiện: " + error.message));
  };

  const openEditForm = (car) => {
    setEditCar(car.Ma_Xe);
    
    let currentLoaiXe = '5cho';
    let currentSoCho = 5;
    let currentTaiTrong = 0.00;
    
    // Xác định Loai_Xe dựa trên dữ liệu có sẵn
    if (car.Tai_Trong !== undefined && car.Tai_Trong !== null) { 
        currentLoaiXe = 'bantai';
        currentTaiTrong = car.Tai_Trong;
    } else if (car.So_Cho_Ngoi === 7) {
        currentLoaiXe = '7cho';
        currentSoCho = 7;
    } else {
        currentLoaiXe = '5cho';
        currentSoCho = 5;
    }

    setFormData({
        ...car,
        Gia_Thue_Ngay: car.Gia_Thue_Ngay.toString(), 
        Mo_Ta: car.Mo_Ta || '',
        Loai_Xe: currentLoaiXe,
        So_Cho_Ngoi: currentSoCho,
        Tai_Trong: parseFloat(currentTaiTrong) || 0.00, 
    });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Cập nhật các trường phụ thuộc vào Loai_Xe
    let newFormData = { ...formData, [name]: value };

    if (name === 'Loai_Xe') {
        if (value === '5cho') {
            newFormData = { ...newFormData, So_Cho_Ngoi: 5, Tai_Trong: 0.00 };
        } else if (value === '7cho') {
            newFormData = { ...newFormData, So_Cho_Ngoi: 7, Tai_Trong: 0.00 };
        } else if (value === 'bantai') {
            newFormData = { ...newFormData, So_Cho_Ngoi: 0, Tai_Trong: 1.00 }; // Mặc định 1.00
        }
    }
    setFormData(newFormData);
};


  return (
    <div className="p-5 w-full"> 
      <h2 className="text-2xl font-bold mb-4 text-center">Quản Lý Xe</h2>

      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <div className="flex space-x-4 text-sm font-semibold"> 
            <button 
                onClick={() => handleFilterChange("http://localhost:5000/api/admin/xe/all")} 
                className={`py-1 ${filterUrl.includes('all') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tất cả xe
            </button>
            <button 
                onClick={() => handleFilterChange("http://localhost:5000/api/admin/xe/5cho")} 
                className={`py-1 ${filterUrl.includes('5cho') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Xe 5 chỗ
            </button>
            <button 
                onClick={() => handleFilterChange("http://localhost:5000/api/admin/xe/7cho")} 
                className={`py-1 ${filterUrl.includes('7cho') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Xe 7 chỗ
            </button>
            <button 
                onClick={() => handleFilterChange("http://localhost:5000/api/admin/xe/bantai")} 
                className={`py-1 ${filterUrl.includes('bantai') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Xe bán tải
            </button>
        </div>

        <button
          onClick={() => {
            setEditCar(null);
            setShowForm(true);
            setFormData({ 
              Ma_Xe: "", Ten_Xe: "", Hang_Xe: "", Bien_So: "", Gia_Thue_Ngay: "",
              Trang_Thai: "Có sẵn", Hinh_Anh: "", Mo_Ta: "", Loai_Xe: "5cho",
              So_Cho_Ngoi: 5, Tai_Trong: 0.00,
            });
          }}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          + Thêm xe
        </button>
      </div>
        
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    {cars.length > 0 &&
                        Object.keys(cars[0]).filter(col => col !== 'Mo_Ta').map((col) => (
                            <th 
                                key={col} 
                                className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider" // Font bold cho header
                            >
                                {col.replace(/_/g, ' ')}
                            </th>
                        ))
                    }
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th> 
                </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
                {cars.map((row) => (
                    <tr key={row.Ma_Xe}>
                        {Object.keys(row).filter(key => key !== 'Mo_Ta').map((key) => (
                            <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                
                                {key === "Hinh_Anh" ? (
                                    <img
                                        src={`http://localhost:5000/${row[key]}`}
                                        className="w-24 h-16 object-cover rounded" 
                                        alt={row.Ten_Xe}
                                    />
                                ) : (
                                    row[key]
                                )}
                            </td>
                        ))}

                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"> 

                            <button 
                                onClick={() => openEditForm(row)} 
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow mr-2 transition duration-150"
                            >
                                Sửa
                            </button>

                            <button
                                onClick={() => handleDelete(row.Ma_Xe)}
                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow transition duration-150"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {showForm && (
        <div
          className="mt-8 p-6 border border-gray-300 rounded-lg bg-gray-50 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-blue-600">{editCar ? "Cập nhật xe: " + editCar : "Thêm xe mới"}</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Mã Xe (Ví dụ: XE015)"
                name="Ma_Xe"
                value={formData.Ma_Xe}
                onChange={handleFormChange}
                required
                disabled={!!editCar}
                className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200"
              />
              <input
                type="text"
                placeholder="Tên xe"
                name="Ten_Xe"
                value={formData.Ten_Xe}
                onChange={handleFormChange}
                required
                className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Hãng xe"
                name="Hang_Xe"
                value={formData.Hang_Xe}
                onChange={handleFormChange}
                required
                className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Biển số"
                name="Bien_So"
                value={formData.Bien_So}
                onChange={handleFormChange}
                required
                className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Giá thuê/ngày"
                name="Gia_Thue_Ngay"
                value={formData.Gia_Thue_Ngay}
                onChange={handleFormChange}
                required
                className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                name="Trang_Thai"
                value={formData.Trang_Thai}
                onChange={handleFormChange}
                required
                className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Có sẵn">Có sẵn</option>
                <option value="Đang thuê">Đang thuê</option>
                <option value="Bảo trì">Bảo trì</option>
                <option value="Ngưng">Ngưng</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">Loại xe:</label>
                <select
                    name="Loai_Xe"
                    value={formData.Loai_Xe}
                    onChange={handleFormChange}
                    required
                    className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="5cho">Xe 5 chỗ</option>
                    <option value="7cho">Xe 7 chỗ</option>
                    <option value="bantai">Xe Bán tải</option>
                </select>

                {formData.Loai_Xe !== 'bantai' && (
                    <input
                        type="number"
                        placeholder="Số chỗ ngồi"
                        value={formData.So_Cho_Ngoi}
                        name="So_Cho_Ngoi"
                        disabled 
                        className="p-2 border rounded-lg w-32 bg-gray-200 text-center"
                    />
                )}
                
                {formData.Loai_Xe === 'bantai' && (
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Tải trọng (Tấn)"
                        name="Tai_Trong"
                        value={formData.Tai_Trong}
                        onChange={handleFormChange}
                        required
                        className="p-2 border rounded-lg w-32 focus:ring-blue-500 focus:border-blue-500"
                    />
                )}
            </div>
            <input
              type="text"
              placeholder="Đường dẫn Ảnh (Ví dụ: images/5cho/tenxe.jpg)"
              name="Hinh_Anh"
              value={formData.Hinh_Anh}
              onChange={handleFormChange}
              required
              className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            
            <textarea
                placeholder="Mô tả chi tiết về xe"
                name="Mo_Ta"
                rows="4"
                value={formData.Mo_Ta}
                onChange={handleFormChange}
                required
                className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            ></textarea>

            <div className="mt-4">
                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 shadow-md"
                >
                  {editCar ? "Cập nhật" : "Thêm mới"}
                </button>
    
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="ml-4 py-2 px-4 border border-gray-400 rounded bg-white hover:bg-gray-100 transition duration-150"
                >
                  Hủy
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}