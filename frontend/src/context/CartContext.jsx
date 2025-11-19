import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from './UserContext';
import api from "../api/axios";

export const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user } = useUser();

  // Fetch cart and wishlist when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      // redirect to signin for unauthenticated users
      window.location.href = '/signin';
      return;
    }

    try {
      await api.post('/cart/add', { productId: product._id });
      await fetchCart();
      setToast({ type: 'success', message: 'Added to cart' });
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to add to cart';
      setToast({ type: 'error', message: msg });
      setTimeout(() => setToast(null), 2500);
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!user) return;

    try {
      await api.post('/cart/decrease', { productId });
      await fetchCart();
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      await api.delete(`/cart/remove/${productId}`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    try {
      await api.post('/wishlist/add', { productId: product._id });
      await fetchWishlist();
      setToast({ type: 'success', message: 'Added to wishlist' });
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to add to wishlist';
      setToast({ type: 'error', message: msg });
      setTimeout(() => setToast(null), 2500);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    try {
      await api.delete(`/wishlist/remove/${productId}`);
      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  // Save last ordered cart to localStorage after order
  const saveLastOrderedCart = (cartItems) => {
    localStorage.setItem('lastOrderedCart', JSON.stringify(cartItems));
  };

  // Call this after successful payment
  const clearCart = () => {
    saveLastOrderedCart(cart);
    setCart([]);
  };

  // Expose last ordered cart for Cart page
  const getLastOrderedCart = () => {
    try {
      return JSON.parse(localStorage.getItem('lastOrderedCart')) || [];
    } catch {
      return [];
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loading,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        getLastOrderedCart,
      }}
    >
      {children}
      {toast && (
        <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded shadow-lg text-sm md:text-base transition-opacity duration-300 
          ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
        >
          {toast.message}
        </div>
      )}
    </CartContext.Provider>
  );
};
