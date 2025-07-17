import VendorNavbar from '../VendorNavbar/VendorNavbar'
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';

export default function VendorHome() {
  const [vendorProducts, setVendorProducts] = useState([]);
  const [favorites, setFavorites] = useState({}); 
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;
  
      const productsRef = collection(db, "Products");
      const q = query(productsRef, where("status", "==", "approved"))
  
      const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
        const products = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(product => product.vendorId !== user.uid);
  
        setVendorProducts(products);
      });
  
      return () => unsubscribeSnapshot();
    });
  
    return () => unsubscribeAuth();
  }, []);


  // Fetch favorites for all products
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
      setFavorites(prev => ({
        ...prev,
        [product.id]: !prev[product.id],
      }));

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

      setFavorites(prev => ({
        ...prev,
        [product.id]: !prev[product.id],
      }));
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

      // Check stock availability
      if (product.stock === 0) {
        toast.error("Out of stock");
        return;
      }

      if (cartSnap.exists()) {

        await updateDoc(cartRef, {
          quantity: increment(1),
          updatedAt: serverTimestamp(),
        });
        
        // Update product stock
        await updateDoc(productRef, {
          stock: increment(-1)
        });
        
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

        // Update product stock
        await updateDoc(productRef, {
          stock: increment(-1)
        });

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {vendorProducts.map((product, index) => {
          const handleViewDetails = () => {
            navigate(`/userproducts/${product.id}`);
          };

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
                <button
                  onClick={() => handleFavoriteClick(product)}
                  className="absolute top-2 right-2 p-1"
                >
                  {favorites[product.id] ? (
                    <FaHeart className="text-red-500 text-xl cursor-pointer" />
                  ) : (
                    <FaRegHeart className="text-white text-xl cursor-pointer" />
                  )}
                </button>

                {/* View Icon */}
                <div className="absolute top-2 left-2 group">
                  <button onClick={handleViewDetails} className="p-1">
                    <FaEye className="text-[#eee1dd] text-xl cursor-pointer" />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#A78074] text-white text-xs px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 transition duration-200 whitespace-nowrap z-10">
                    View Details
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-semibold text-[#A78074] text-left">
                  {product.title}
                </h2>
                <div className="flex justify-between items-center mt-2 text-base">
                  <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                    ⭐ {product.rating ?? 0} / 5
                  </div>
                  <div className="flex items-center text-[#a27466] font-bold">
                    <span className="text-[#A78074] mr-1">Available:</span> {product.stock}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Category: {product.categoryName}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-lg font-bold text-[#A78074]">{product.price} EGP</p>
                  <button
                    onClick={() => handleAddToCart(product.id, product)}
                    disabled={product.stock === 0}
                    className={`cursor-pointer text-white mt-1 px-6 py-2 rounded-lg border transition ${
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
      
    </>
  );
}


/*********************************************************************************************** */
      // <div className='min-h-screen flex justify-center gap-8 items-center p-6'>
      //   {vendorProducts.length > 0 ? (
      //       vendorProducts.map(product => (
      //           <div key={product.id} 
      //               className='w-[280px] bg-[#F5F5F1] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:scale-[1.02]'
      //           >
      //               {/* Image Container */}
      //             <div className="relative overflow-hidden">
      //                 <img
      //                     src={product.imgURL}
      //                     alt={product.title}
      //                     className="w-full h-[180px] object-cover transition-transform duration-300 hover:scale-105"
      //                 />
      //                 {/* Status Badge */}
      //                 <div className="absolute top-3 right-3">
      //                     <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
      //                         product.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
      //                         product.status === "rejected" ? "bg-red-100 text-red-800 border-red-300" : 
      //                         "bg-green-100 text-green-800 border-green-300"
      //                     }`}>
      //                         {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
      //                     </span>
      //                 </div>
      //             </div>

      //             {/* Content */}
      //             <div className="p-4">
      //                 {/* Title */}
      //                 <h3 className="text-lg font-bold text-[#A78074] mb-2 line-clamp-2 leading-tight">
      //                     {product.title}
      //                 </h3>

      //                 {/* Price and Stock */}
      //                 <div className="flex items-center justify-between mb-3">
      //                     <span className="text-xl font-bold text-[#A78074]">
      //                         {product.price} EGP
      //                     </span>
      //                     <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
      //                       Avalible: {product.stock}
      //                     </span>
      //                 </div>

      //                 {/* Category */}
      //                 <div className="mb-3">
      //                     <span className="inline-block bg-[#A78074] text-white text-xs px-3 py-1 rounded-full">
      //                         {product.categoryName}
      //                     </span>
      //                 </div>

      //                 {/* Description */}
      //                 <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
      //                     {product.description}
      //                 </p>

      //                 {/* Action Buttons */}
      //                 <div className="flex gap-2 mt-4">
      //                     <button 
      //                     onClick={() => handleAddToCart(product.id, product)}
      //                     className="flex-1 bg-[#A78074] capitalize cursor-pointer text-white py-2 px-3 rounded-lg hover:bg-[#90675F] transition-colors duration-200 text-sm font-medium">
      //                       add to cart
      //                     </button>
      //                 </div>
                      
      //             </div>
      //         </div>
      //       ))
      //   ) : (
      //       <div className="col-span-full text-center py-12">
      //           <div className="bg-[#F5F5F1] rounded-xl p-8 max-w-md mx-auto">
      //               <div className="text-[#A78074] text-6xl mb-4">📦</div>
      //               <h3 className="text-xl font-semibold text-[#A78074] mb-2">No products found</h3>
      //               <p className="text-gray-600">Start by adding your first product using the form above!</p>
      //           </div>
      //       </div>
      //   )}

      // </div>