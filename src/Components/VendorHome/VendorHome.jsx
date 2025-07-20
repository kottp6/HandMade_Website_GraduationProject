import VendorNavbar from '../VendorNavbar/VendorNavbar';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import Banner from '../HomeUser/Banner';
import { Link } from 'react-router-dom';
import SpecialOffers from '../HomeUser/SpecialOffers';
import Testimonials from '../HomeUser/Testimonials';
import UserComplaints from '../UserComplaints/UserComplaints';

export default function VendorHome() {
  const [vendorProducts, setVendorProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true); // ✅ loading state
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const productsRef = collection(db, "Products");
      const q = query(productsRef, where("status", "==", "approved"));

      const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
        const products = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(product => product.vendorId !== user.uid);

        setVendorProducts(products);
        setLoading(false); // ✅ stop loading
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user || vendorProducts.length === 0) return;

      const updatedFavorites = {};
      for (const product of vendorProducts) {
        const favRef = doc(db, "favorite", `${user.uid}_${product.id}`);
        const favSnap = await getDoc(favRef);
        updatedFavorites[product.id] = favSnap.exists();
      }
      setFavorites(updatedFavorites);
    };

    fetchFavorites();
  }, [vendorProducts]);

  const handleFavoriteClick = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to manage favorites");
      return;
    }

    const favRef = doc(db, "favorite", `${user.uid}_${product.id}`);
    try {
      setFavorites(prev => ({ ...prev, [product.id]: !prev[product.id] }));
      if (favorites[product.id]) {
        await deleteDoc(favRef);
        toast.success("Removed from favorites!");
      } else {
        await setDoc(favRef, {
          userId: user.uid,
          productId: product.id,
          title: product.title,
          imgURL: product.imgURL,
          price: product.price,
        });
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Something went wrong.");
      setFavorites(prev => ({ ...prev, [product.id]: !prev[product.id] }));
    }
  };

  const handleAddToCart = async (id, productData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to add to cart");
      return;
    }

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

      const product = productSnap.data();
      if (product.stock === 0) {
        toast.error("Out of stock");
        return;
      }

      if (cartSnap.exists()) {
        await updateDoc(cartRef, {
          quantity: increment(1),
          updatedAt: serverTimestamp(),
        });
        await updateDoc(productRef, { stock: increment(-1) });
        toast.success("Quantity increased in cart");
      } else {
        await setDoc(cartRef, {
          userId: user.uid,
          productId: id,
          quantity: 1,
          title: product.title || productData?.title || "",
          price: product.price || productData?.price || 0,
          imgURL: product.imgURL || productData?.imgURL || "",
        });
        await updateDoc(productRef, { stock: increment(-1) });
        toast.success("Added to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <>
      <VendorNavbar />
      <Banner />
      <h2 className="text-4xl font-bold mt-10 mb-6 text-[#A78074] text-center">Top Products</h2>

      {loading ? (
        // ✅ Spinner shown while loading
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#A78074]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {vendorProducts.map((product, index) => {
              const handleViewDetails = () => navigate(`/userproducts/${product.id}`);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  className="bg-[#f5f5f1] w-full max-w-xs rounded-xl shadow-md p-4 transition hover:scale-102 duration-200 relative"
                >
                  <div className="relative">
                    <img
                      src={product.imgURL}
                      alt={product.title}
                      className="w-full h-56 object-cover rounded-xl"
                    />
                    <button onClick={() => handleFavoriteClick(product)} className="cursor-pointer absolute top-2 right-2 p-1">
                      {favorites[product.id] ? (
                        <FaHeart className="text-[#A78074] text-xl" />
                      ) : (
                        <FaRegHeart className="text-[#A78074] text-xl" />
                      )}
                    </button>

                    <div className="absolute top-2 left-2 group bg-[#A78074] p-2 rounded-xl">
                      <button onClick={handleViewDetails}>
                        <FaEye className="text-[#eee1dd] text-xl cursor-pointer" />
                      </button>
                      <div className="absolute top-full  left-1/2 -translate-x-1/2 bg-[#A78074] text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition duration-200 z-10">
                        View Details
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-xl font-semibold text-[#A78074]">{product.title}</h2>
                    <div className="flex justify-between items-center mt-2 text-base">
                      <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                        ⭐ {product.rating ?? 0} / 5
                      </div>
                      <div className="text-[#a27466] font-bold">
                        <span className="text-[#A78074] mr-1">Available:</span> {product.stock}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Category: {product.categoryName}</p>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-lg font-bold text-[#A78074]">{product.price} EGP</p>
                      <button
                        onClick={() => handleAddToCart(product.id, product)}
                        disabled={product.stock === 0}
                        className={`px-6 py-2 rounded-lg border transition text-white ${
                          product.stock === 0
                            ? 'bg-gray-400 border-gray-400 cursor-not-allowed'
                            : 'bg-[#A78074] border-[#A78074] hover:bg-white hover:text-[#A78074]'
                        }`}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Link to="/userproducts" className="bg-[#A78074] w-50 mx-auto flex justify-center mt-8 mb-8 text-white px-6 py-2 rounded-lg border border-[#A78074] hover:bg-white hover:text-[#A78074] transition">
            View More
          </Link>
        </>
      )}

      <SpecialOffers />
      <Testimonials />
      <UserComplaints />
    </>
  );
}
