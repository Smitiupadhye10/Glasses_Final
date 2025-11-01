import Slider from "react-slick";
import poster1 from "../assets/images/Poster1.jpeg";
import poster2 from "../assets/images/poster2.jpeg";
import poster3 from "../assets/images/poster3.jpeg";
import fit1 from "../assets/images/sunglasses.jpeg"; 
import fit2 from "../assets/images/eyeglass.jpeg";
import fit3 from "../assets/images/computer.jpeg";
import lens1 from "../assets/images/contact.png";
import lens2 from "../assets/images/solution.jpeg";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

const Home = ({ addToCart, addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  useEffect(() => {
    let url = "http://localhost:4000/api/products?";
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, [category, search]);

  // Sample poster images
  const posters = [poster1, poster2, poster3];

  const perfectFitImages = [fit1, fit2, fit3];

  const contactLensImages = [lens1, lens2];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="space-y-10">
      {/* --- Carousel Posters --- */}
      <Slider {...carouselSettings} className="w-full mx-auto mb-10">
        {posters.map((poster, index) => (
          <div key={index}>
            <img src={poster} alt={`Poster ${index + 1}`} className="w-full h-[500px] object-cover" />
          </div>
        ))}
      </Slider>

      {/* --- Find the perfect fit --- */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Find the Perfect Fit</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {perfectFitImages.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-lg">
              <img src={img} alt={`Fit ${i + 1}`} className="w-full h-50 object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div> 
      </section>

      {/* --- Contact Lenses Section --- */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Contact Lenses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contactLensImages.map((img, i) => (
            <div key={i} className="overflow-hidden rounded-lg">
              <img src={img} alt={`Lens ${i + 1}`} className="w-full h-60 object-cover hover:scale-105 transition-transform" />
            </div>
          ))}
        </div>
      </section>

      {/* --- Products Section --- */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Products</h2>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={() => addToCart(product)}          // Pass down cart callback
                addToWishlist={() => addToWishlist(product)}  // Pass down wishlist callback
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products found
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
