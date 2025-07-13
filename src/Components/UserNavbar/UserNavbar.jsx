import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from "../../assets/logo.png";


export default function UserNavbar({ userName = "User", onLogout }) {
  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Right: Logo */}
        <div className="flex items-center space-x-2">
          <NavLink to="/">
            <img src={logo} alt="Hand Made Logo" className="w-16 h-16" />
          </NavLink>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex gap-6 mx-auto text-gray-700 font-medium text-sm sm:text-base">
          <Link to="/homeuser" className="hover:text-[#1B8354] transition">Home</Link>
          <Link to="/userproducts" className="hover:text-[#1B8354] transition">Products</Link>
          <Link to="/cart" className="hover:text-[#1B8354] transition">Cart</Link>
          <Link to="/favorites" className="hover:text-[#1B8354] transition">Favorites</Link>
          <Link to="/orders" className="hover:text-[#1B8354] transition">Orders</Link>
        </div>

        {/* Left: Welcome + Logout */}
        <div className="flex items-center gap-3 text-sm sm:text-base mt-3 md:mt-0">
          <span className="text-gray-700 font-medium">Welcome, <span className="text-[#1B8354]">{userName}</span></span>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

