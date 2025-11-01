import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

const Shop = ({ addToCart, addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const search = searchParams.get("search");

  useEffect(() => {
    let url = "http://localhost:4000/api/products?";
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [category, search]);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Products</h2>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={() => addToCart(product)}
              addToWishlist={() => addToWishlist(product)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found
          </p>
        )}
      </div>
    </section>
  );
};

export default Shop;
