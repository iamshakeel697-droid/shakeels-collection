import React from 'react';
import { formatPrice } from '../utils/format';
import { ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, onSelect }) => {
  const isOnSale =
    product.salePrice !== null && product.salePrice !== undefined && product.salePrice < product.originalPrice;
  const discount = isOnSale
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-ink-100 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/600x750?text=Shakeel%27s+Collect';
          }}
        />

        {isOnSale && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-card">
            Sale · {discount}% Off
          </span>
        )}

        <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 px-5 py-2.5 rounded-full bg-white/95 text-ink-900 text-sm font-semibold flex items-center gap-2 shadow-card">
            <ShoppingBag size={15} />
            Quick Order
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-medium text-ink-900 text-sm sm:text-base leading-snug line-clamp-1">
          {product.title}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          {isOnSale ? (
            <>
              <span className="text-base sm:text-lg font-bold text-ink-900">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-sm text-ink-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </>
          ) : (
            <span className="text-base sm:text-lg font-bold text-ink-900">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
