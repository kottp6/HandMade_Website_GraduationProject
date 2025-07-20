import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import ReviewCard from "../Components/ReviewCard/ReviewCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

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

  return (
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
  );
}
