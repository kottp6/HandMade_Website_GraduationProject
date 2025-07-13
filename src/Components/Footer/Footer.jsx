import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#A78074] text-[#F5F5F1] text-sm gap-20">
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-6 gap-20">
        {/* Logo and Description */}
        <div className="col-span-1 md:col-span-2 space-y-3 text-justify leading-relaxed min-w-[160px] max-w-sm">
          <h2 className="text-2xl font-serif italic text-white">Handmade</h2>
          <p className="text-sm">
            Special thanks to Midsummerstar and Oyoylivingdesign for generously
            providing us with their stunning product imagery. Kindly visit their
            website to make real purchases of their products.
          </p>
        </div>

        {/* Presets */}
        <div className="col-span-1 min-w-[160px] text-left">
          <h3 className="uppercase font-semibold mb-2 text-white">Presets</h3>
          <ul className="space-y-1">
            {["Dusty Brown", "Subtle Blue", "Magma", "Marble", "Oak Green"].map((item) => (
              <li
                key={item}
                className="hover:text-[#F5F5F1] hover:underline cursor-pointer transition break-words"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div className="col-span-1 min-w-[160px] text-left">
          <h3 className="uppercase font-semibold mb-2 text-white">Collections</h3>
          <ul className="space-y-1">
            {["Sale", "Vases", "Bowls & Cups", "Plates"].map((item) => (
              <li
                key={item}
                className="hover:text-[#F5F5F1] hover:underline cursor-pointer transition break-words"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Sale */}
        <div className="col-span-1 min-w-[160px] text-left">
          <h3 className="uppercase font-semibold mb-2 text-white">Sale</h3>
          <ul className="space-y-1">
            {["Scandinavian Savoy Vase", "Ceramic Candle-Holder", "Indian Plate"].map((item) => (
              <li
                key={item}
                className="hover:text-[#F5F5F1] hover:underline cursor-pointer transition break-words"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Currency Dropdown */}
        <div className="col-span-1 min-w-[160px] text-left">
          <h3 className="uppercase font-semibold mb-2 text-white">Currency</h3>
          <select className="w-full bg-white text-[#A78074] border border-[#A78074] px-4 py-2 rounded-md cursor-pointer focus:outline-none">
            <option>CAD $</option>
            <option>Australia (CAD $)</option>
            <option>Austria (CAD $)</option>
            <option>Belgium (CAD $)</option>
            <option>Canada (CAD $)</option>
            <option>Czechia (CAD $)</option>
          </select>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-[#F5F5F1]/30 py-4 px-6 text-[#F5F5F1] text-sm bg-[#A78074]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row text-sm justify-between items-center space-y-3 md:space-y-0">
          <div className="text-center md:text-left leading-snug">
            &copy; {new Date().getFullYear()}{" "}
            <span className="underline hover:text-[#F5F5F1]">Handmade Ceramics</span>
            <br />
            <span className="text-xs">Powered by Shopify</span>
          </div>

          <div className="flex space-x-4">
            {["Home", "About", "Search"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-[#F5F5F1] hover:underline transition"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="flex space-x-4 text-lg">
            <a href="#" aria-label="Facebook" className="hover:text-[#F5F5F1]/80 transition">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#F5F5F1]/80 transition">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-[#F5F5F1]/80 transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
