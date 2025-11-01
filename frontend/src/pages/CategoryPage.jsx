import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function CategoryPage({ addToCart, addToWishlist }) {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    setLoading(true);
    setError(null);

    // Build server-side query URL: include category + all current query params
    const params = new URLSearchParams(searchParams);
    if (category) params.set("category", category);
    const url = `http://localhost:4000/api/products?${params.toString()}`;

    const fadeTimeout = setTimeout(() => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setProducts(Array.isArray(data) ? data : []);
          setTimeout(() => setVisible(true), 80);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 80);

    return () => clearTimeout(fadeTimeout);
  }, [category, searchParams]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-600 text-center py-6">Error loading products: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800 text-center">{category}</h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transition-all duration-300 ease-in-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addToCart?.(product)}
              addToWishlist={() => addToWishlist?.(product)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found for {category}
          </p>
        )}
      </div>
    </div>
  );
}
