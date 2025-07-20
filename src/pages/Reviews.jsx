import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import ReviewCard from "../Components/ReviewCard/ReviewCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../Components/Sidebar/Sidebar";
import { LayoutDashboard, Package, Users, Building, MessageSquare, AlertCircle, Star } from "lucide-react";
import { Menu, LogOut } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultReviews = [
    {
      id: "sample1",
      user_id: "guest_user1",
      product_id: "Handmade Soap",
      rating: 5,
      comment: "Absolutely love this product!",
    },
    {
      id: "sample2",
      user_id: "guest_user2",
      product_id: "Organic Candle",
      rating: 4,
      comment: "Smells great and lasts long.",
    },
    {
      id: "sample3",
      user_id: "guest_user3",
      product_id: "Natural Cream",
      rating: 5,
      comment: "Very smooth on the skin. Highly recommend!",
    },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Reviews"));
        const data = snapshot.empty
          ? defaultReviews
          : snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews(defaultReviews); // fallback if error
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = [
    { name: "Overview", path: "/admin/overview", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Vendor", path: "/admin/vendor", icon: <Building size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart size={20} /> },
  
    { name: "Feedback", path: "/admin/feedback", icon: <MessageSquare size={20} /> },
    { name: "Complaint", path: "/admin/complaint", icon: <AlertCircle size={20} /> },
    { name: "Reviews", path: "/admin/reviews", icon: <Star size={20} /> },
  ];
  const navigate = useNavigate();
  const handleLogout = () => {
    // Add your logout logic here
    navigate("/login");
    console.log("Logging out...");
  };

  return (
    <>
    <div className="flex h-screen bg-[#F5F5F1]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} navItems={navItems} />
    <div className="flex-1 flex flex-col overflow-auto">
    <header className="flex items-center justify-between px-4 py-3 shadow bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#A78074] hover:text-black"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#A78074]">Reviews</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              <LogOut size={24} />
            </button>
          </div>
        </header>
        <PageLayout title="Reviews">
      <div className="bg-[#F5F5F1] min-h-screen px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl font-bold text-[#A78074] border-b pb-2">Customer Reviews</h2>

          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">
              Loading reviews...
            </p>
          ) : reviews.length === 0 ? (
            <div className="text-center text-[#A78074] font-medium mt-10">
              <p>No reviews found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  product={r.product_id || "Unknown Product"}
                  rating={r.rating || 0}
                  comment={r.comment || "No comment provided"}
                  user={r.user_id || "Anonymous"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
    </div>
    </div>
    </>
  );
}
