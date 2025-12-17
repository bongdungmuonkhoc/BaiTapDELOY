import React from "react";

function Footer() {
  return (
    <div className="grid grid-cols-4 h-[300px] bg-gradient-to-r from-green-500 to-green-700">
      {/* Cột 1: Thông tin công ty */}
      <div className="text-white p-4">
        <h3 className="font-bold text-black text-[20px]">QG AutoCar</h3>
        <div className="pt-4 space-y-2">
          <p>CTNHH QuynhGiauAutoCar VIỆT NAM</p>
          <p>Địa chỉ : 180 Cao Lỗ , Quận 8 , TP.HCM</p>
          <p>Email : DH52201345@student.stu.edu.vn</p>
        </div>
      </div>

      {/* Cột 2: Chính sách */}
      <div className="text-white p-4">
        <h3 className="font-bold text-black text-[20px]">Chính Sách</h3>
        <div className="pt-4 space-y-2">
          <p className="hover:underline hover:text-gray-200 cursor-pointer">
            Điều kiện giao dịch chung
          </p>
          <p className="hover:underline hover:text-gray-200 cursor-pointer">
            Chính sách bảo vệ dữ liệu cá nhân
          </p>
          <p className="hover:underline hover:text-gray-200 cursor-pointer">
            Điều khoản sử dụng nền tảng
          </p>
          <p className="hover:underline hover:text-gray-200 cursor-pointer">
            Chính sách giao nhận xe
          </p>
        </div>
      </div>

      {/* Cột 3: Địa điểm dịch vụ */}
      <div className="text-white p-4">
        <h3 className="font-bold text-black text-[20px]">Địa Điểm Dịch Vụ</h3>
        <div className="pt-4 space-y-2">
          <p className="hover:text-gray-200 cursor-pointer">Hồ Chí Minh</p>
          <p className="hover:text-gray-200 cursor-pointer">Hà Nội</p>
          <p className="hover:text-gray-200 cursor-pointer">Đà Nẵng</p>
          <p className="hover:text-gray-200 cursor-pointer">Hải Phòng</p>
        </div>
      </div>

      {/* Cột 4: Số điện thoại + mạng xã hội */}
      <div className="text-white p-4">
        <h2 className="font-bold text-black text-[20px]">Số Điện Thoại</h2>
        <div className="pt-4 space-y-2">
          <p>0387144497</p>
          <p>1900 8388</p>

          {/* Icon mạng xã hội */}
          <div className="flex items-center space-x-4 pt-2">
            {/* Facebook */}
          <a 
                href="https://www.facebook.com/ChelseaFC?locale=vi_VN" 
                 target="_blank" 
                 rel="noopener noreferrer"
                >
            <svg
              className="transition duration-300 transform hover:scale-110 hover:opacity-80 cursor-pointer"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.53906C17.5229 2.53906 22 7.01621 22 12.5391C22 17.5304 18.3431 21.6674 13.5625 22.4176V15.4297H15.8926L16.3359 12.5391L13.5625 12.5387V10.6632C13.5626 9.84259 13.9742 9.10156 15.1921 9.10156H16.4531V6.64062C15.3087 6.44492 14.2146 6.44492 11.966 6.44492C10.4842 7.78652 10.4386 10.2193 10.4375 10.3355V12.5387H7.89844V15.4293L10.4375 15.4297V22.4172C5.65686 21.667 2 17.5304 2 12.5391C2 7.01621 6.47715 2.53906 12 2.53906Z"
                fill="#3b5998"
              />
            </svg></a>

            {/* Instagram */}
            <svg
              className="transition duration-300 transform hover:scale-110 hover:opacity-80 cursor-pointer"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.75-3a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
                fill="#E1306C"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
