import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden shadow-soft animate-pulse">
      <div className="aspect-[4/5] bg-ink-100" />
      <div className="p-4 sm:p-5 space-y-2">
        <div className="h-4 bg-ink-100 rounded w-3/4" />
        <div className="h-5 bg-ink-100 rounded w-1/2" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
