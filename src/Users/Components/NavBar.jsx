import React, { useState } from "react";
import HomeImage from "../../assets/User/user.js";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/" ,type:"link" },
    { name: "About", path: "about" ,type:"scroll"},
    { name: "Contact Us", path: "contact" , type:"scroll" },
    { name: "Pre School", path: "/preschool" , type:"link" },
  ];

  return (
    <nav>
      {/* Desktop Navbar */}
      <div className="hidden sm:flex items-center justify-between gap-6 bg-white/30 fixed z-50 w-full px-20 prata-regular">
     <Link to="/"><img src={HomeImage.logo} alt="Logo" className="w-48 h-auto hover:cursor-pointer"  /></Link>

        <ul className="flex gap-8">
        {menuItems.map((item) => (
  <li
    key={item.name}
    className="px-2 text-gray-900 hover:text-amber-600 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-1 cursor-pointer"
    onClick={() => {
      if (item.type === "scroll") {
        const section = document.getElementById(item.path);
        section?.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }}
  >
    {item.type === "link" ? (
      <Link to={item.path}>{item.name}</Link>
    ) : (
      item.name
    )}
  </li>
))}
        </ul>

        <Link to="/login">
          <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-lg w-28 h-10 transform transition-all duration-200 hover:scale-105 active:scale-95">
            Login
          </button>
        </Link>
      </div>

      {/* Mobile Navbar */}
      <div className="sm:hidden flex items-center justify-between">
        <img src={HomeImage.logo} alt="Logo" className="w-16 h-auto" />

        <button className="focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <div className="w-6 h-6 relative">
            <span
              className={`block absolute h-0.5 w-6 bg-gray-900 transform transition duration-300 ease-in-out ${
                isOpen ? "rotate-45 top-2.5" : "top-0"
              }`}
            ></span>
            <span
              className={`block absolute h-0.5 w-6 bg-gray-900 transform transition duration-300 ease-in-out ${
                isOpen ? "opacity-0" : "top-2.5"
              }`}
            ></span>
            <span
              className={`block absolute h-0.5 w-6 bg-gray-900 transform transition duration-300 ease-in-out ${
                isOpen ? "-rotate-45 top-2.5" : "top-5"
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
         {menuItems.map((item) => (
  <li
    key={item.name}
    className="px-2 text-gray-900 hover:text-amber-600 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-1 cursor-pointer"
    onClick={() => {
      if (item.type === "scroll") {
        const section = document.getElementById(item.path);
        section?.scrollIntoView({ behavior: "smooth" });
      }
      setIsOpen(false);
    }}
  >
    {item.type === "link" ? (
      <Link to={item.path}>{item.name}</Link>
    ) : (
      item.name
    )}
  </li>
))}
        </ul>

        <Link to="/login">
          <button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-lg w-28 h-10 transform transition-all duration-200 hover:scale-105 active:scale-95">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
