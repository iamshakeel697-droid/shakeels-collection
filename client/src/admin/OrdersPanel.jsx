import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, RefreshCw, Trash2, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderApi } from '../../api';
import { formatPrice, formatDateTime } from '../../utils/format';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const OrdersPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const pollRef = useRef(null);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await orderApi.getAll(filter || undefined);
      setOrders(data.orders || []);
    } catch (err) {
      if (!silent) toast.error('Could not load orders');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
    pollRef.current = setInterval(() => fetchOrders(true), 15000);
    return () => clearInterval(pollRef.current);
  }, [fetchOrders]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await orderApi.updateStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order record?')) return;
    try {
      await orderApi.remove(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      toast.success('Order deleted');
    } catch (err) {
      toast.error(err.message || 'Could not delete order');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Live Orders</h2>
          <p className="text-sm text-ink-500 mt-1">Real-time order tracking — auto-refreshes every 15s</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-ink-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchOrders()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink-900 text-white text-sm font-semibold hover:bg-gold-600 transition-all duration-300"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-gold-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-ink-400">No orders yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-ink-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-50 text-left text-xs font-semibold text-ink-500 uppercase tracking-wide">
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Address</th>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Placed On</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-ink-50/60 transition-colors">
                    <td className="px-5 py-4 font-medium text-ink-900 whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-5 py-4 text-ink-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} />
                        {order.phone}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-500 max-w-[220px]">
                      <div className="flex items-start gap-1.5">
                        <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{order.address}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-700 max-w-[160px]">
                      <span className="line-clamp-1">{order.productTitle}</span>
                      <span className="text-xs text-ink-400">Qty: {order.quantity}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-ink-900 whitespace-nowrap">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-gold-400 ${statusStyles[order.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-ink-400 text-xs whitespace-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPanel;
