import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [ten, setTen] = useState("");
  const [sdt, setSdt] = useState("");
  const [cccd, setCccd] = useState("");
  const [diachi, setDiachi] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = { ten, sdt };
    if (ten !== "admin") {
      payload.cccd = cccd;
      payload.diachi = diachi;
      payload.email = email;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        if (data.role === "admin") navigate("/admin");
        else navigate("/"); 
        setError(data.message);
      }
    } catch (err) {
      console.log(err);
      setError("Lỗi server");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl mb-4">Đăng nhập / Đăng ký</h2>
      <form onSubmit={handleLogin} className="space-y-2">
        <input type="text" placeholder="Tên" value={ten} onChange={e => setTen(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Số điện thoại" value={sdt} onChange={e => setSdt(e.target.value)} className="w-full p-2 border rounded" />
        
        {ten !== "admin" && (
          <>
            <input type="text" placeholder="CCCD" value={cccd} onChange={e => setCccd(e.target.value)} className="w-full p-2 border rounded" />
            <input type="text" placeholder="Địa chỉ" value={diachi} onChange={e => setDiachi(e.target.value)} className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
          </>
        )}

        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
