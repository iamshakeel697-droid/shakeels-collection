import React from 'react';
import { ShoppingBag, Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-ink-900 text-ink-100 mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={20} className="text-gold-400" strokeWidth={1.8} />
            <span className="font-display text-lg font-bold">
              Shakeel's <span className="text-gold-400">Collect</span>
            </span>
          </div>
          <p className="text-sm text-ink-400 leading-relaxed max-w-xs">
            Premium, curated essentials for modern living. Quality you can trust, delivered to
            your door.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-ink-400">
            <li><a href="#shop" className="hover:text-gold-400 transition-colors">Shop</a></li>
            <li><a href="#about" className="hover:text-gold-400 transition-colors">About Us</a></li>
            <li><a href="/admin/login" className="hover:text-gold-400 transition-colors">Admin Login</a></li>
          </ul>
        </div>

        <div id="about">
          <h4 className="text-sm font-semibold text-white mb-4">About</h4>
          <p className="text-sm text-ink-400 leading-relaxed">
            Shakeel's Collect brings together carefully curated products with a focus on quality,
            simplicity, and timeless design.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Get in Touch</h4>
          <div className="flex items-center gap-2 text-sm text-ink-400 mb-3">
            <Mail size={15} />
            support@shakeelscollect.com
          </div>
          <div className="flex items-center gap-3 mt-3">
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-gold-500/20 transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-gold-500/20 transition-colors">
              <Facebook size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} Shakeel's Collect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
