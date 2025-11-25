import React from "react";
import { Search } from "lucide-react";
import HomeImage from "../../assets/User/user";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="flex items-center justify-between gap-8 px-16">
        <img src={HomeImage.logo} alt="" className="w-24 h-auto"/>
       
    <div className="w-full flex items-center bg-white/80  rounded-2xl px-4 py-2 border border-gray-200">
      <Search className="text-gray-500 w-5 h-5 mr-3" />

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent focus:outline-none text-gray-700"
      />
    </div>
    </div>
  );
};

export default SearchBar;
