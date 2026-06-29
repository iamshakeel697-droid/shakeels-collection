import React, { useState } from 'react';
import AdminSidebar from '../admin/AdminSidebar';
import AdminMobileNav from '../admin/AdminMobileNav';
import OverviewPanel from '../admin/OverviewPanel';
import ProductsPanel from '../admin/ProductsPanel';
import OrdersPanel from '../admin/OrdersPanel';

const AdminDashboard = () => {
  const [active, setActive] = useState('overview');

  return (
    <div className="flex min-h-screen bg-ink-50">
      <AdminSidebar active={active} setActive={setActive} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileNav active={active} setActive={setActive} />

        <main className="flex-1 px-5 sm:px-8 py-8 max-w-7xl w-full mx-auto">
          {active === 'overview' && <OverviewPanel setActive={setActive} />}
          {active === 'products' && <ProductsPanel />}
          {active === 'orders' && <OrdersPanel />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
