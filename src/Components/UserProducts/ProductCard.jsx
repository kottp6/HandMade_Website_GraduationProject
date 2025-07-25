import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaEye } from "react-icons/fa";
import { db, auth } from "../../firebase";
import { doc, setDoc, getDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  id,
  title,
  price,
  image,
  rating,
  categoryName, 
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [stock, setStock] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  useEffect(() => {
    const productRef = doc(db, "Products", id);

    const unsubscribe = onSnapshot(productRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setStock(data.stock); // Live stock update
      }
    });

    return () => unsubscribe(); // Clean up on unmount
  }, [id]);
  const navigate = useNavigate();
  const handleViewDetails = () => {
  navigate(`/product/${id}`);
};
  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const favRef = doc(db, "favorite", `${user.uid}_${id}`);
      const favSnap = await getDoc(favRef);
      if (favSnap.exists()) {
        setIsFavorited(true);
      }
    };

    checkFavorite();
  }, [id]);

  const handleFavoriteClick = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to manage favorites");
      return;
    }

    const favRef = doc(db, "favorite", `${user.uid}_${id}`);

    try {
      if (isFavorited) {
        await deleteDoc(favRef);
        setIsFavorited(false);
        toast.success("Removed from favorites!");
      } else {
        await setDoc(favRef, {
          userId: user.uid,
          productId: id,
          title,
          imgURL: image,
          price,
        });
        setIsFavorited(true);
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Something went wrong.");
    }
  };

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to add to cart");
      return;
    }
    setAddingToCart(true);
    const cartId = `${user.uid}_${id}`;
    const cartRef = doc(db, "Cart", cartId);
    const productRef = doc(db, "Products", id);

    try {
      const [cartSnap, productSnap] = await Promise.all([
        getDoc(cartRef),
        getDoc(productRef),
      ]);

      if (!productSnap.exists()) {
        toast.error("Product no longer exists.");
        return;
      }

      const productData = productSnap.data();
      const currentStock = productData.stock || 0;

      if (currentStock === 0) {
        toast.error("Out of stock");
        return;
      }

      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        const newQuantity = cartData.quantity + 1;

        await Promise.all([
          setDoc(cartRef, {
            ...cartData,
            quantity: newQuantity,
          }),
          updateDoc(productRef, {
            stock: currentStock - 1,
          }),
        ]);

        toast.success("Quantity updated in cart!");
      } else {
        await Promise.all([
          setDoc(cartRef, {
            userId: user.uid,
            productId: id,
            title,
            price,
            imgURL: image,
            quantity: 1,
          }),
          updateDoc(productRef, {
            stock: currentStock - 1,
          }),
        ]);

        toast.success("Added to cart!");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="bg-[#f5f5f1] w-full max-w-xs rounded-xl shadow-md p-4 transition hover:scale-102 duration-200 relative">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover rounded-xl"
        />

        {/* Favorite Icon */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1 bg-[#A78074] rounded-xl p-2"
        >
          {isFavorited ? (
            <FaHeart className="text-white text-xl" />
          ) : (
            <FaRegHeart className="text-white text-xl" />
          )}
        </button>

        {/* View Icon */}
        <div className="absolute top-2 left-2 group bg-[#A78074] rounded-xl p-1">
          <button className="p-1">
            <FaEye onClick={handleViewDetails} className="text-[#eee1dd] text-xl" />
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#A78074] text-white text-xs px-2 py-1 rounded opacity-0 
            group-hover:opacity-100 transition duration-200 whitespace-nowrap z-10">
            View Details
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold text-[#A78074] text-left">
          {title}
        </h2>
        <div className="flex justify-between items-center mt-2 text-base">
          <div className="flex items-center gap-1 text-yellow-500 font-semibold">
            ⭐ {rating ?? 0} / 5
          </div>
          <div className="flex items-center text-[#a27466] font-bold">
            <span className="text-[#A78074] mr-1">Available:</span> {stock}
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Category: {categoryName}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-[#A78074]">{price} EGP</p>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || stock === 0}
            className={`mt-1 px-6 py-2 rounded-lg border transition ${
              stock === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#A78074] text-white border-[#A78074] hover:bg-white hover:text-[#A78074]"
            }`}
          >
            {stock === 0 ? "Out of Stock" : addingToCart ? "Adding..." : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
