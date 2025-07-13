import React, { useState, useEffect } from "react";
import UserNavbar from "../UserNavbar/UserNavbar";
import ProductList from "../ProductList/ProductList";
import Search from "../Search/Search";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function HomeUser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productSnapshot, categorySnapshot] = await Promise.all([
          getDocs(collection(db, "Products")),
          getDocs(collection(db, "category")),
        ]);

        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const categoryMap = {};
        categorySnapshot.forEach((doc) => {
          categoryMap[doc.id] = doc.data().name;
        });

        setProducts(productList);
        setCategories(categoryMap);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery)
  );

  const enrichedProducts = filteredProducts.map((product) => ({
    ...product,
    name: categories[product.categoryId] || "Unknown",
  }));

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen flex flex-col items-center p-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <Search search={searchQuery} onSearchChange={handleSearchChange} />
            <ProductList products={enrichedProducts} />
          </>
        )}
      </div>
    </>
  );
}
