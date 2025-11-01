import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { Heart } from "lucide-react";

const mapGender = (val) => {
  if (!val) return "";
  if (val.toLowerCase() === "male") return "Men";
  if (val.toLowerCase() === "female") return "Women";
  return val;
};

// Helper to show stars
const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <span className="text-yellow-500 font-semibold">
      {"★".repeat(stars) + "☆".repeat(5 - stars)} ({rating.toFixed(1)})
    </span>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("/placeholder.jpg");
  const { addToCart, addToWishlist, wishlist, removeFromWishlist } =
    useContext(CartContext);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data.images && data.images.length > 0) setSelectedImage(data.images[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return <div className="text-center text-gray-500 py-12">Loading...</div>;

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const toggleWishlist = () => {
    if (isWishlisted) removeFromWishlist(product._id);
    else addToWishlist(product);
  };
  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  const images = product.images || []; // now an array

  const discountedPrice = (
    product.price * (1 - (product.discount || 0) / 100)
  ).toFixed(0);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-10">
      {/* Left: Image Gallery */}
      <div className="flex-1 flex flex-col items-center">
        <div className="relative w-full max-w-xs">
          <img
            src={selectedImage}
            alt={product.title}
            className="h-72 w-full object-contain rounded-xl shadow border mb-3 bg-gray-50 transition-all duration-300"
          />
          <button
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white shadow hover:bg-red-50 focus:outline-none"
            onClick={toggleWishlist}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart
              color={isWishlisted ? "#e53e3e" : "#94a3b8"}
              fill={isWishlisted ? "#e53e3e" : "none"}
              size={28}
            />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 mt-3">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} ${index + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-16 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === img
                    ? "border-indigo-500"
                    : "border-gray-300"
                } transition-all duration-200`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Info */}
      <div className="flex-1 flex flex-col gap-5 justify-center">
        <h1 className="text-3xl font-bold mb-1 text-gray-900">
          {product.title}
        </h1>

        {/* Ratings and Discount */}
        <div className="flex items-center gap-4 mb-2">
          {product.discount > 0 && (
            <span className="text-red-600 font-bold text-lg">
              {product.discount}% OFF
            </span>
          )}
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-indigo-600">
              ₹{discountedPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
          <StarRating rating={product.ratings || 0} />
        </div>

        <div className="text-xs text-gray-500 mb-2 space-x-1">
          {product.category && (
            <span className="uppercase tracking-wide font-semibold">
              {product.category}
            </span>
          )}
          {product.subCategory && <span>· {product.subCategory}</span>}
          {product.subSubCategory && <span>· {product.subSubCategory}</span>}
        </div>

        <p className="text-gray-700 text-base mb-2 min-h-10">
          {product.description}
        </p>

        {/* Product Info Table */}
        <div className="bg-gray-50 rounded p-4 border">
          <h2 className="font-semibold mb-2 text-lg">Product Info</h2>
          <table className="w-full text-sm text-left">
            <tbody>
              {product.product_info?.brand && (
                <tr>
                  <td className="pr-4 font-medium">Brand:</td>
                  <td>{product.product_info.brand}</td>
                </tr>
              )}
              {product.product_info?.gender && (
                <tr>
                  <td className="pr-4 font-medium">Gender:</td>
                  <td>{mapGender(product.product_info.gender)}</td>
                </tr>
              )}
              {product.product_info?.Size && (
                <tr>
                  <td className="pr-4 font-medium">Size:</td>
                  <td>{product.product_info.Size}</td>
                </tr>
              )}
              {product.product_info?.frameShape && (
                <tr>
                  <td className="pr-4 font-medium">Frame Shape:</td>
                  <td>{product.product_info.frameShape}</td>
                </tr>
              )}
              {product.product_info?.frameMaterial && (
                <tr>
                  <td className="pr-4 font-medium">Material:</td>
                  <td>{product.product_info.frameMaterial}</td>
                </tr>
              )}
              {product.product_info?.frameColor && (
                <tr>
                  <td className="pr-4 font-medium">Color:</td>
                  <td>{product.product_info.frameColor}</td>
                </tr>
              )}
              {product.product_info?.rimDetails && (
                <tr>
                  <td className="pr-4 font-medium">Style:</td>
                  <td>{product.product_info.rimDetails}</td>
                </tr>
              )}
              {product.product_info?.warranty && (
                <tr>
                  <td className="pr-4 font-medium">Warranty:</td>
                  <td>{product.product_info.warranty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-3">
          <button
            onClick={() => addToCart(product)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-indigo-700 transition"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold shadow hover:bg-green-700 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
