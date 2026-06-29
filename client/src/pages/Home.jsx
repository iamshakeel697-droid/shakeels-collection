import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import CheckoutSlideOver from '../components/CheckoutSlideOver';
import { productApi } from '../api';
import { PackageSearch } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productApi.getAll();
        setProducts(data.products || []);
      } catch (err) {
        toast.error('Could not load products right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-ink-50">
      <Navbar />
      <Hero />

      <section id="shop" className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-gold-600 uppercase tracking-widest">
            The Collection
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 mt-2">
            Shop Our Best Picks
          </h2>
          <p className="text-ink-500 text-sm sm:text-base mt-3 max-w-md mx-auto">
            Every piece chosen with care — quality, design, and value in one place.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageSearch size={48} className="text-ink-300 mb-4" />
            <p className="text-ink-500">No products available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onSelect={setSelectedProduct} />
            ))}
          </div>
        )}
      </section>

      <Footer />

      {selectedProduct && (
        <CheckoutSlideOver product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default Home;
