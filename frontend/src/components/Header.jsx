import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBar from "./CategoryBar";
import { CartContext } from "../context/CartContext";

const Header = () => {
  const { cart, wishlist } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/home");
    }
    setSearchTerm("");
  };

  return (
    <header className=" w-full z-50 bg-white shadow-md">
      {/* Navbar shows cart/wishlist counts */}
      <Navbar cartCount={cart.length} wishlistCount={wishlist.length} />

      {/* CategoryBar for categories */}
      <div className="border-t border-b flex justify-between p-2 bg-gray-50">
      <CategoryBar />

      {/* Search Bar below categories */}
      <div className="bg-gray-100   p-4">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>
      </div>
    </header>
  );
};

export default Header;
