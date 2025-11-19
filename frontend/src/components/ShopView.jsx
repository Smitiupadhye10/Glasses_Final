import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard"; // Adjust the path if needed
import api from "../api/axios";

const categories = [
  "Eyeglasses",
  "Sunglasses",
  "Computer Glasses",
  "Contact Lenses",
];

export default function ShopView({ addToCart, addToWishlist }) {
  const [selectedCategory, setSelectedCategory] = useState("Eyeglasses");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/products')
      .then(({ data }) => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(
    (p) => p.category === selectedCategory
  );

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-red-600 text-center py-6">
        Error loading products: {error}
      </div>
    );

  return (
    <div>
      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded border font-semibold transition-colors duration-150 ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-black border-gray-300 hover:bg-blue-100"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addToCart?.(product)}
              addToWishlist={() => addToWishlist?.(product)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found for {selectedCategory}
          </p>
        )}
      </div>
    </div>
  );
}
