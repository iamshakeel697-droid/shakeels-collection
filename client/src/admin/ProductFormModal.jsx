import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { productApi } from '../../api';

const emptyForm = {
  title: '',
  description: '',
  imageUrl: '',
  originalPrice: '',
  salePrice: '',
  category: '',
  stock: '',
};

const ProductFormModal = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        originalPrice: product.originalPrice ?? '',
        salePrice: product.salePrice ?? '',
        category: product.category || '',
        stock: product.stock ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [product]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.title || form.title.trim().length < 2) next.title = 'Title is required';
    if (!form.imageUrl || form.imageUrl.trim().length < 3) next.imageUrl = 'Image URL is required';
    if (!form.originalPrice || isNaN(form.originalPrice) || Number(form.originalPrice) < 0)
      next.originalPrice = 'Enter a valid price';
    if (form.salePrice !== '' && (isNaN(form.salePrice) || Number(form.salePrice) < 0))
      next.salePrice = 'Enter a valid sale price';
    if (
      form.salePrice !== '' &&
      Number(form.salePrice) >= Number(form.originalPrice)
    )
      next.salePrice = 'Sale price must be less than original price';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      originalPrice: Number(form.originalPrice),
      salePrice: form.salePrice === '' ? null : Number(form.salePrice),
      category: form.category.trim() || 'General',
      stock: form.stock === '' ? 0 : Number(form.stock),
    };

    try {
      if (product) {
        await productApi.update(product._id, payload);
        toast.success('Product updated');
      } else {
        await productApi.create(payload);
        toast.success('Product added');
      }
      onSaved();
    } catch (err) {
      toast.error(err.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm animate-fade-in" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100 sticky top-0 bg-white">
          <h2 className="font-display text-lg font-bold text-ink-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-ink-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
              Product Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={150}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.title ? 'border-red-400' : 'border-ink-200'
              } text-sm focus:outline-none focus:ring-2 focus:ring-gold-400`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
              Image URL
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              maxLength={2000}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.imageUrl ? 'border-red-400' : 'border-ink-200'
              } text-sm focus:outline-none focus:ring-2 focus:ring-gold-400`}
            />
            {errors.imageUrl && <p className="mt-1 text-xs text-red-500">{errors.imageUrl}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
                Original Price
              </label>
              <input
                name="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.originalPrice ? 'border-red-400' : 'border-ink-200'
                } text-sm focus:outline-none focus:ring-2 focus:ring-gold-400`}
              />
              {errors.originalPrice && (
                <p className="mt-1 text-xs text-red-500">{errors.originalPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
                Sale Price (optional)
              </label>
              <input
                name="salePrice"
                type="number"
                min="0"
                step="0.01"
                value={form.salePrice}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.salePrice ? 'border-red-400' : 'border-ink-200'
                } text-sm focus:outline-none focus:ring-2 focus:ring-gold-400`}
              />
              {errors.salePrice && <p className="mt-1 text-xs text-red-500">{errors.salePrice}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
                Stock Qty
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 w-full py-3.5 rounded-xl bg-ink-900 text-white text-sm font-semibold hover:bg-gold-600 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : product ? (
              'Update Product'
            ) : (
              'Add Product'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
