import React from "react";
import product1 from "../../assets/bolster.png";
import product1Hover from "../../assets/bolster-hover.png";
import product2 from "../../assets/planter.png";
import product2Hover from "../../assets/planter-hover.png";
import product3 from "../../assets/candle.png";
import product3Hover from "../../assets/candle-hover.png";
import Navbar from "../Navbar/Navbar";
const products = [
  {
    title: "Simple Support Bolster",
    price: 230,
    img: product1,
    hoverImg: product1Hover,
    description:
      "Get this elegant round, high-quality item perfect for the living room. Thick natural bamboo wood with a beautiful tex...",
  },
  {
    title: "Rustic Balance Planters",
    price: 280,
    img: product2,
    hoverImg: product2Hover,
    description:
      "Get this elegant round, high-quality item perfect for the living room. Thick natural bamboo wood with a beautiful tex...",
  },
  {
    title: "Patchouli Scented Candle",
    price: 250,
    sale: 280,
    img: product3,
     hoverImg: product3Hover,
    description:
      "Get this elegant round, high-quality item perfect for the living room. Thick natural bamboo wood with a beautiful tex...",
  },
];

export default function FeaturedProducts() {
  return (
    <>
    <Navbar/> 
    <section className="bg-[#F5F5F1] text-[#A78074] py-12 px-6 md:px-16">
      <div className="mb-10 max-w-xl">
        <h2 className="text-4xl font-light mb-4">Featured Products</h2>
        <p className="text-sm mb-2">
          Explore our best-sellers of all time made with dexterous hands —
          resulting in timeless and expressive pieces for your everyday life.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <svg viewBox="0 0 10 11" fill="none" className="w-4 h-4 text-[#A78074]">
            <path
              d="M5 0.5L6.5 4L10 5.5L6.5 7L5 10.5L3.5 7L0 5.5L3.5 4L5 0.5Z"
              fill="currentColor"
            />
          </svg>
          March 2022
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, i) => (
  <div
    key={i}
    className="group bg-white p-4 shadow-sm hover:shadow-md transition duration-300 relative"
  >
    <div className="relative w-full h-64 overflow-hidden">
      <img
        src={product.img}
        alt={product.title}
        className="w-full h-full object-contain transition-opacity duration-500 group-hover:opacity-0"
      />
      <img
        src={product.hoverImg}
        alt={`${product.title} hover`}
        className="w-full h-full object-contain absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-[#00000033] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      {/* {product.sale && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
          Sale
        </span>
      )} */}
    </div>
    <h3 className="text-lg font-semibold mt-4 mb-1">{product.title}</h3>
    <p className="text-sm text-gray-500 mb-3">{product.description}</p>
    <div className="flex items-center justify-between">
      <p className="text-[#A78074] font-semibold">
        ${product.price.toFixed(2)}
        {product.sale && (
          <span className="line-through ml-2 text-sm text-red-400">
            ${product.sale.toFixed(2)}
          </span>
        )}
      </p>
      <button className="bg-[#A78074] text-white px-4 py-2 rounded-md border border-[#A78074] hover:bg-white hover:text-[#A78074] transition">
        Quick view
      </button>
    </div>
  </div>
))}

      </div>

      <div className="text-center mt-10">
  <button className="bg-[#A78074] text-white px-6 py-2 rounded-lg border border-[#A78074] hover:bg-white hover:text-[#A78074] transition">
    Show More Products
  </button>
</div>

    </section>
    </>
  );
}
