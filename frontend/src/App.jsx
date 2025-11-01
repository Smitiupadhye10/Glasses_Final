import React, { useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/Router.jsx";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Products from "./components/Products.jsx";


const App = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]); // increment count
  };

  const addToWishlist = (product) => {
    if (!wishlist.find((p) => p._id === product._id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const appRouter = router(addToCart, cart, addToWishlist, wishlist);

  return <> <RouterProvider router={appRouter} />  </>;
};

export default App;
