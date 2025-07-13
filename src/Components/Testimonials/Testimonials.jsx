import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar/Navbar";

// SVG Components
const ArrowLeft = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ab8677" strokeWidth="1.5">
    <path d="M15 4.5L8 12l7 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ab8677" strokeWidth="1.5">
    <path d="M9 4.5L16 12l-7 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Testimonials Data
const testimonials = [
  {
    text: "Your packaging and products are so unique and beautiful. I’m simply amazed how gorgeous this thing looks. Best value ever.",
    author: "Susan Gibson",
    role: "Fashion Blogger",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: "Absolutely loved the attention to detail and design. It’s just perfect and exceeded my expectations.",
    author: "James Taylor",
    role: "Creative Director",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);

  const { text, author, role, image } = testimonials[index];

  return (
    <>
    <Navbar></Navbar>
    <section className="relative py-16 text-center">
      <h2 className="text-sm font-bold tracking-widest text-[#A78074] uppercase mb-8">Testimonials</h2>


      <div className="min-h-[140px] px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="text-3xl md:text-5xl text-gray-500 font-light leading-snug max-w-4xl mx-auto mb-10"
          >
            “{text}”
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div
        key={author}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center justify-center gap-3"
      >
        <img src={image} alt={author} className="w-10 h-10 rounded-full object-cover" />
        <p className="text-sm text-[#A78074]">
          <strong>{author}</strong>, <span className="text-[#A78074]">{role}</span>
        </p>
      </motion.div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 border border-[#ab8677] p-2 rounded-sm hover:bg-[#ab8677]/10"
        aria-label="Previous"
      >
        <ArrowLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 border border-[#ab8677] p-2 rounded-sm hover:bg-[#ab8677]/10"
        aria-label="Next"
      >
        <ArrowRight />
      </button>
    </section>
    </>
  );
};

export default Testimonials;
