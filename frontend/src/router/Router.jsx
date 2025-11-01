import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import OutletLayout from "../components/OutletLayout.jsx";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Shop from "../pages/Shop.jsx";
import Cart from "../pages/Cart.jsx";
import Wishlist from "../pages/Wishlist.jsx";
import ProductDetail from "../pages/ProductDetails.jsx";
import Signup from "../pages/Signup.jsx";
import Signin from "../pages/Signin.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx"; 
import CategoryPage from "../pages/CategoryPage.jsx";

const router = (addToCart, cart, addToWishlist, wishlist) =>
  createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Default route → Redirect to Signin */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* Public routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes — visible only after login */}
        <Route
          element={
            <ProtectedRoute>
              <OutletLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home addToCart={addToCart} addToWishlist={addToWishlist} />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart cart={cart} />} />
          <Route path="/wishlist" element={<Wishlist wishlist={wishlist} />} />
          <Route
            path="/product/:id"
            element={<ProductDetail addToCart={addToCart} addToWishlist={addToWishlist} />}
          />
          <Route
            path="/category/:category"
            element={<CategoryPage addToCart={addToCart} addToWishlist={addToWishlist} />}
          />
        </Route>
      </>
    )
  );

export default router;
