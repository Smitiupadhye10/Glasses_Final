import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useContext(CartContext);

  const isWishlisted = wishlist.some((item) => item._id === product._id);

  const toggleWishlist = () => {
    if (isWishlisted) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const discountedPrice = (
    product.price * (1 - (product.discount || 0) / 100)
  ).toFixed(0);

  // Use first image from images array
  const imageSrc = product.images?.[0] || "/placeholder.jpg";

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = Math.round(rating || 0);
    return (
      <span className="text-yellow-500 font-semibold text-sm">
        {"★".repeat(stars) + "☆".repeat(5 - stars)} ({(rating || 0).toFixed(1)})
      </span>
    );
  };

  return (
    <div className="relative flex flex-col border rounded-2xl p-4 shadow hover:shadow-lg transition duration-300">
      {/* Heart icon overlay */}
      <div className="absolute top-3 right-3 z-10 cursor-pointer" onClick={toggleWishlist}>
        <Heart color={isWishlisted ? "red" : "gray"} fill={isWishlisted ? "red" : "none"} size={24} />
      </div>

      {/* Product Image */}
      <img
        src={imageSrc}
        alt={product.title}
        className="w-full h-48 object-contain rounded-2xl cursor-pointer mb-3"
        onClick={() => navigate(`/product/${product._id}`)}
      />

      {/* Title */}
      <h2 className="text-lg font-semibold">{product.title}</h2>

      {/* Ratings */}
      <div className="mb-1">{renderStars(product.ratings)}</div>

      {/* Price and Discount */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-indigo-600 font-bold text-lg">₹{discountedPrice}</span>
        {product.discount > 0 && (
          <>
            <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
            <span className="text-red-600 font-bold text-sm">{product.discount}% OFF</span>
          </>
        )}
      </div>

      {/* Category */}
      <p className="text-gray-400 text-sm mb-3 capitalize">{product.category}</p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-xl shadow hover:bg-indigo-700 transition"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-green-600 text-white py-2 rounded-xl shadow hover:bg-green-700 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
