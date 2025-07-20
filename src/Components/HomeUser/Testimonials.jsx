import { motion } from 'framer-motion';

export default function Testimonials() {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <h2 className="text-center text-2xl font-bold text-[#A78074] mb-8">What Our Customers Say</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {[1, 2].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <p className="text-sm text-gray-600 mb-2">“Amazing quality and fast delivery. Totally recommend!”</p>
            <p className="font-semibold text-[#A78074]">- Mahmoud Hussein</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
