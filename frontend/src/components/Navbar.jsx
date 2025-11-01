import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, wishlist } = useContext(CartContext);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear JWT
    navigate("/signin");               // redirect to signin page
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4 shadow sticky top-0 z-50">

      {/* Left: Logo */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/home")}
      >
        LensLogic
      </div>
      

      {/* Center: Navigation Links */}
      <ul className="hidden md:flex gap-6">
        <li>
          <Link to="/home" className="hover:text-blue-300">Home</Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-blue-300">About</Link>
        </li>
        <li>
          <Link to="/shop" className="hover:text-blue-300">Shop</Link>
        </li>
      </ul>

      {/* Right: Cart, Wishlist, Logout */}
      <div className="flex items-center gap-4">
        {/* Cart */}
        <div className="relative">
          <Link to="/cart" className="flex items-center gap-1 hover:text-blue-300">
            <ShoppingCart size={24} />Cart
          </Link>
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalCartItems} 
            </span>
          )}
        </div>

        {/* Wishlist */}
        <div className="relative">
          <Link to="/wishlist" className="flex items-center gap-1 hover:text-blue-300">
            <Heart size={24} />Wishlist
          </Link>
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
