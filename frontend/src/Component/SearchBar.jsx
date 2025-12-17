import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) {
      alert("Vui lòng nhập từ khóa tìm kiếm!");
      return;
    }
    onSearch(keyword.trim());
  };

  return (
    <div className="flex items-end justify-end gap-2 mt-4 mb-6">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Nhập tên xe, hãng xe hoặc số chỗ"
        className="px-3 py-2 border rounded-md min-w-[300px] focus:outline-none focus:ring-2 focus:ring-lime-400"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="flex items-end justify-end gap-x-2 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
        <span>Tìm kiếm</span>
      </button>
    </div>
  );
}

export default SearchBar;
