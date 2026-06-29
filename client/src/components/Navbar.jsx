import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/#shop' },
  { label: 'About', to: '/#about' },
  { label: 'Contact', to: '/#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-soft border-b border-ink-100' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <ShoppingBag size={22} className="text-gold-600 transition-transform group-hover:-rotate-6" strokeWidth={1.8} />
          <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Shakeel's <span className="text-gold-600">Collect</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-ink-600 hover:text-ink-900 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-gold-500 after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#shop"
            className="px-5 py-2.5 rounded-full bg-ink-900 text-white text-sm font-semibold hover:bg-ink-800 transition-all duration-300 shadow-soft hover:shadow-card"
          >
            Shop Now
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg hover:bg-ink-100 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-72 border-t border-ink-100' : 'max-h-0'
        } bg-white/95 backdrop-blur-md`}
      >
        <div className="flex flex-col px-6 py-4 gap-3">
          {navLinks.map((link) => (
            <a key={link.label} href={link.to} className="text-sm font-medium text-ink-700 py-2">
              {link.label}
            </a>
          ))}
          <a
            href="#shop"
            className="mt-1 px-5 py-2.5 rounded-full bg-ink-900 text-white text-sm font-semibold text-center"
          >
            Shop Now
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
