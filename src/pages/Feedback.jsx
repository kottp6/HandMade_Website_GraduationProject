import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import PageLayout from "../Components/PageLayout/PageLayout";
import { FaStar } from "react-icons/fa";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchProductId, setSearchProductId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [selectedDateOnly, setSelectedDateOnly] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "Feedbacks"));
        const data = querySnapshot.docs.map((doc) => {
          const raw = doc.data();
          return {
            id: doc.id,
            ...raw,
            createdAt: raw.createdAt?.toDate?.() || new Date(),
          };
        });
        setFeedbacks(data);
        setFilteredFeedbacks(data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;

    if (searchProductId) {
      filtered = filtered.filter((fb) =>
        fb.productId?.toLowerCase().includes(searchProductId.toLowerCase())
      );
    }

    if (searchUserId) {
      filtered = filtered.filter((fb) =>
        fb.userId?.toLowerCase().includes(searchUserId.toLowerCase())
      );
    }

    if (filterRating) {
      filtered = filtered.filter((fb) => String(fb.rating) === filterRating);
    }

    if (selectedDateOnly) {
      const selected = new Date(selectedDateOnly).toDateString();
      filtered = filtered.filter(
        (fb) => fb.createdAt?.toDateString?.() === selected
      );
    }

    setFilteredFeedbacks(filtered);
  }, [
    searchProductId,
    searchUserId,
    filterRating,
    selectedDateOnly,
    feedbacks,
  ]);

  return (
    <PageLayout>
      <div className="bg-[#F5F5F1] min-h-screen p-4">
        <h1 className="text-3xl font-semibold text-[#A78074] mb-6">Feedback</h1>

        {/* 👉 Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search Product ID"
            className="border p-2 rounded w-56"
            value={searchProductId}
            onChange={(e) => setSearchProductId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search User ID"
            className="border p-2 rounded w-56"
            value={searchUserId}
            onChange={(e) => setSearchUserId(e.target.value)}
          />

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>

          <input
            type="date"
            value={selectedDateOnly}
            onChange={(e) => setSelectedDateOnly(e.target.value)}
            className="border p-2 rounded w-44"
          />
        </div>

        {/* 👉 Feedback Cards */}
        {loading ? (
          <div className="text-center mt-20 text-[#A78074] text-xl font-medium">
            Loading feedback...
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center mt-10 text-gray-500 text-lg">
            No feedback found matching the filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                onClick={() => setSelectedFeedback(fb)}
                className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 transition transform hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-[#A78074]">
                    Order: {fb.orderId || "—"}
                  </h2>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(fb.rating || 0, 5))].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-[#A78074]">Product:</span>{" "}
                  {fb.productId || "—"}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-[#A78074]">User:</span>{" "}
                  {fb.userId || "—"}
                </p>
                <p className="text-sm text-gray-700 italic">
                  "{fb.message || "No message"}"
                </p>

                <p className="text-right text-xs text-gray-400 mt-3">
                  {fb.createdAt?.toLocaleDateString()}{" "}
                  {fb.createdAt?.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 👉 Modal for selected feedback */}
        {selectedFeedback && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-[#A78074] text-2xl"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-2 text-[#A78074]">
                Feedback Details
              </h2>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Order ID:</strong> {selectedFeedback.orderId || "—"}</p>
                <p><strong>Product ID:</strong> {selectedFeedback.productId || "—"}</p>
                <p><strong>User ID:</strong> {selectedFeedback.userId || "—"}</p>
                <p><strong>Rating:</strong> {selectedFeedback.rating} ⭐</p>
                <p><strong>Message:</strong> {selectedFeedback.message || "No message"}</p>
                <p><strong>Date:</strong> {selectedFeedback.createdAt?.toLocaleString() || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
