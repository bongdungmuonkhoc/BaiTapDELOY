import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="relative min-h-[200px] bg-white">
      
      {/* Logo góc trái trên cùng */}
      <div className="absolute top-4 left-2 w-40 h-44">
        <img className="rounded-3xl" src="/images/logo2.png" alt="logo" />
      </div>

      {/* Nút Đăng nhập góc phải */}
      <div className="absolute top-6 right-6">
        <Link
          to="/login"
          className="text-black font-semibold px-4 py-2 rounded-lg border border-black hover:bg-black hover:text-white transition"
        >
          Đăng nhập
        </Link>
      </div>

      {/* Dòng chữ chào mừng ở giữa */}
      <div className="flex items-center justify-center h-full">
        <h3 className="font-bold text-[55px] text-center pt-11 text-black italic animate-bounce">
          Chào Mừng Bạn đến với QG AutoCar !!!
        </h3>
      </div>

      {/* Hàng ngang icon */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-start space-x-4">
        {/* icon trái tim */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className="h-6 w-6 text-black">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 
            0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 
            3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>

        {/* icon user */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className="h-6 w-6 text-black">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 
            3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 
            0 0 1 14.998 0A17.933 17.933 0 0 1 12 
            21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

        {/* bookmark */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          className="h-6 w-6 text-black">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 
            1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 
            1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </div>
    </div>
  );
}

export default Header;
