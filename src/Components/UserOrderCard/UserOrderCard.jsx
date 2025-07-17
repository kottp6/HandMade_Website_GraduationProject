import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserOrderCard({ order, index }) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow p-4 text-sm sm:text-base"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex justify-between mb-2">
        <p className="font-semibold text-[#A78074]">Order ID:</p>
        <p>{order.id}</p>
      </div>

      <div className="flex justify-between">
        <p className="font-semibold">Total Price:</p>
        <p>{order.total} EGP</p>
      </div>

      <div className="flex justify-between">
        <p className="font-semibold">Date:</p>
        <p>{order.createdAt?.toDate().toLocaleString() || "N/A"}</p>
      </div>

      {order.cartItems?.map((product) => (
        <div key={product.id} className="mt-4 border-t pt-2">
          <p className="font-semibold">Product Name: {product.title}</p>

          <Link to={`/feedback/${order.id}/${product.id}`}>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-2 transition">
              Give Feedback
            </button>
          </Link>
        </div>
      ))}

      <Link to={`/orders/${order.id}`}>
        <button className="bg-[#A78074] hover:bg-[#A78074]/80 text-white px-4 py-2 rounded mt-4 transition">
          View Order Details
        </button>
      </Link>
    </motion.div>
  );
}
