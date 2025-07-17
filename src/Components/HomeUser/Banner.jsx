import { motion } from 'framer-motion';

export default function Banner() {
  return (
    <motion.section
      className="bg-gradient-to-r from-[#A78074] to-[#f2e3df] py-20 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Shop</h1>
      <p className="text-lg max-w-xl mx-auto">Discover exclusive collections and amazing deals just for you.</p>
    </motion.section>
  );
}
