import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ink-50 px-5 text-center">
      <ShoppingBag size={40} className="text-gold-500 mb-5" strokeWidth={1.6} />
      <h1 className="font-display text-5xl font-bold text-ink-900">404</h1>
      <p className="text-ink-500 mt-3 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 rounded-full bg-ink-900 text-white text-sm font-semibold hover:bg-gold-600 transition-all duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
