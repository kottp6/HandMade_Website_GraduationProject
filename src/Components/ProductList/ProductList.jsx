import ProductCard from "../ProductCard/ProductCard";
export default function ProductList({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard
            id={product.id}
            key={index}
            title={product.title}
            price={product.price}
            image={product.imgURL}
            rating={product.rating}
            stock={product.stock}
            categoryName={product.categoryName} // Assuming categoryName is part of the product object
        />
      ))}
    </div>
  );
}
