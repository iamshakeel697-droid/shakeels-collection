import React, { useState, useEffect } from 'react';
import { X, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/format';
import { orderApi } from '../api';

const initialForm = { customerName: '', phone: '', address: '' };

const CheckoutSlideOver = ({ product, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm(initialForm);
    setErrors({});
    setSuccess(false);
  }, [product]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!product) return null;

  const isOnSale =
    product.salePrice !== null && product.salePrice !== undefined && product.salePrice < product.originalPrice;
  const finalPrice = isOnSale ? product.salePrice : product.originalPrice;

  const validate = () => {
    const next = {};
    if (form.customerName.trim().length < 2) next.customerName = 'Enter your full name';
    if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    if (form.address.trim().length < 10) next.address = 'Enter a complete delivery address';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await orderApi.create({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        productId: product._id,
        quantity: 1,
      });
      setSuccess(true);
      toast.success('Order Placed Successfully!');
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      toast.error(err.message || 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative w-full max-w-md h-full glass shadow-2xl border-l border-white/40 animate-slide-in-right flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-100/60">
          <h2 className="font-display text-lg font-bold text-ink-900">Quick Checkout</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ink-900/5 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="font-display text-xl font-bold text-ink-900">
                Order Placed Successfully!
              </h3>
              <p className="text-sm text-ink-500 max-w-xs">
                Thank you, {form.customerName.split(' ')[0]}! Your order for{' '}
                <span className="font-semibold text-ink-700">{product.title}</span> will be
                delivered soon. Pay cash on delivery.
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 p-4 rounded-2xl bg-white/70 border border-ink-100/60 shadow-soft mb-7">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-20 h-24 object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/200x250?text=Product';
                  }}
                />
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-medium text-sm text-ink-900 line-clamp-2">{product.title}</h3>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-bold text-ink-900">{formatPrice(finalPrice)}</span>
                    {isOnSale && (
                      <span className="text-xs text-ink-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-500">
                    <Truck size={13} />
                    Cash on Delivery
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Ali Ahmed"
                    maxLength={100}
                    className={`w-full px-4 py-3 rounded-xl bg-white/80 border ${
                      errors.customerName ? 'border-red-400' : 'border-ink-200'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all`}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. 0300 1234567"
                    maxLength={20}
                    className={`w-full px-4 py-3 rounded-xl bg-white/80 border ${
                      errors.phone ? 'border-red-400' : 'border-ink-200'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-600 mb-1.5 uppercase tracking-wide">
                    Full Address
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="House #, Street, Area, City"
                    maxLength={500}
                    className={`w-full px-4 py-3 rounded-xl bg-white/80 border ${
                      errors.address ? 'border-red-400' : 'border-ink-200'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all resize-none`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-3.5 rounded-xl bg-ink-900 text-white text-sm font-semibold hover:bg-gold-600 transition-all duration-300 shadow-card disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order — ${formatPrice(finalPrice)}`
                  )}
                </button>

                <p className="text-center text-[11px] text-ink-400">
                  Pay in cash when your order arrives at your doorstep.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSlideOver;
