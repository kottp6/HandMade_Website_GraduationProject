import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaRegHeart } from "react-icons/fa";

export default function CardDetails({ onCategoryFetched, onProductIdFetched }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          onCategoryFetched(productData.categoryName);
          onProductIdFetched(productData.id);
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id, onCategoryFetched, onProductIdFetched]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className=" bg-white text-[#A78074] ">
      {/* Cover Section */}
      <div className="relative w-full  px-6 sm:px-12 lg:px-10 py-10">
        <div
          className="relative flex flex-col sm:flex-row items-center
         sm:items-start gap-10 shadow-lg bg-[#f5f5f1] p-6 rounded-3xl "
        >
          <button className="absolute top-4 right-4 p-2 rounded-full   ">
            <FaRegHeart className="text-[#A78074] text-2xl sm:text-3xl" />
          </button>
          <div className="w-full sm:w-[300px] lg:w-[400px] aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={product.imgURL}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#A78074] mb-6">
              {product.title}
            </h1>
            <div className="text-lg text-[#7A5C50] leading-relaxed font-medium mb-6">
              {product.description}
            </div>
            <div className="text-2xl font-bold mt-6">{product.price} EGP</div>

            <div className="text-xl font-semibold text-[#a58d83] mt-6 mb-6">
              <span className="text-[#A78074]">Available:</span>{" "}
              <span className="text-xl text-[#a58d83] font-bold">
                {product.stock}
              </span>
            </div>

            <div className="text-xl font-medium text-[#A78074] mt-6 mb-7">
              <span className="text-[#A78074] font-semibold">Vendor:</span>{" "}
              Hedra
            </div>

            {product.stock > 0 ? (
              <button
                className="bg-[#A78074] text-white mt-1 px-8 py-3 rounded-lg border
            border-[#A78074] hover:bg-white hover:text-[#A78074] transition
            text-lg"
              >
                Add To Cart
              </button>
            ) : (
              <p className="text-red-500 font-semibold">Out of Stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
