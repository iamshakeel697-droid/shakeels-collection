import React, { useState, useEffect } from 'react';
import { Package, ClipboardList, DollarSign, Clock, Loader2 } from 'lucide-react';
import { productApi, orderApi } from '../../api';
import { formatPrice, formatDateTime } from '../../utils/format';

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="bg-white rounded-2xl border border-ink-100 shadow-soft p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-ink-900 mt-0.5">{value}</p>
    </div>
  </div>
);

const OverviewPanel = ({ setActive }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          productApi.getAllAdmin(),
          orderApi.getAll(),
        ]);

        const products = productsRes.data.products || [];
        const orders = ordersRes.data.orders || [];

        const revenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalPrice, 0);
        const pending = orders.filter((o) => o.status === 'pending').length;

        setStats({ products: products.length, orders: orders.length, revenue, pending });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        // silent fail on overview
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={28} className="animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink-900 mb-1">Welcome back, Shakeel</h2>
      <p className="text-sm text-ink-500 mb-6">Here's what's happening with your store today.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Total Products" value={stats.products} accent="bg-blue-50 text-blue-600" />
        <StatCard icon={ClipboardList} label="Total Orders" value={stats.orders} accent="bg-purple-50 text-purple-600" />
        <StatCard icon={DollarSign} label="Revenue" value={formatPrice(stats.revenue)} accent="bg-green-50 text-green-600" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pending} accent="bg-amber-50 text-amber-600" />
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 shadow-soft p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink-900">Recent Orders</h3>
          <button
            onClick={() => setActive('orders')}
            className="text-xs font-semibold text-gold-600 hover:text-gold-700"
          >
            View All →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-ink-400 py-6 text-center">No orders yet.</p>
        ) : (
          <div className="divide-y divide-ink-100">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900">{order.customerName}</p>
                  <p className="text-xs text-ink-400">{order.productTitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-ink-900">{formatPrice(order.totalPrice)}</p>
                  <p className="text-xs text-ink-400">{formatDateTime(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewPanel;
