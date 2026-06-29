import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi } from '../api';
import { formatPrice } from '../utils/format';
import ProductFormModal from './ProductFormModal';

const ProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productApi.getAllAdmin();
      setProducts(data.products || []);
    } catch (err) {
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    setDeletingId(id);
    try {
      await productApi.remove(id);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.message || 'Could not delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Products</h2>
          <p className="text-sm text-ink-500 mt-1">Manage your store catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-900 text-white text-sm font-semibold hover:bg-gold-600 transition-all duration-300 shadow-soft"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-gold-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-ink-400">No products yet. Add your first one!</div>
      ) : (
        <div className="bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 text-left text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Original Price</th>
                  <th className="px-5 py-3.5">Sale Price</th>
                  <th className="px-5 py-3.5">Stock</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-ink-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-11 h-11 rounded-lg object-cover border border-ink-100"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-ink-100 flex items-center justify-center">
                            <ImageOff size={16} className="text-ink-400" />
                          </div>
                        )}
                        <span className="font-medium text-ink-900 line-clamp-1 max-w-[180px]">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-500">{product.category}</td>
                    <td className="px-5 py-4 text-ink-700">{formatPrice(product.originalPrice)}</td>
                    <td className="px-5 py-4">
                      {product.salePrice ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gold-50 text-gold-700 text-xs font-semibold">
                          {formatPrice(product.salePrice)}
                        </span>
                      ) : (
                        <span className="text-ink-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-ink-500">{product.stock}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg hover:bg-ink-100 text-ink-600 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deletingId === product._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default ProductsPanel;
