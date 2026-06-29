import React from 'react';
import { LayoutDashboard, Package, ClipboardList, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'orders', label: 'Orders', icon: ClipboardList },
];

const AdminSidebar = ({ active, setActive }) => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-ink-950 text-white px-5 py-6">
      <div className="flex items-center gap-2 px-2 mb-10">
        <ShoppingBag size={22} className="text-gold-400" strokeWidth={1.8} />
        <span className="font-display text-lg font-bold">Shakeel's Collect</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gold-500 text-ink-950 shadow-glow'
                  : 'text-ink-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-3 mb-2 rounded-xl bg-white/5">
        <p className="text-xs text-ink-400">Signed in as</p>
        <p className="text-sm font-medium text-white truncate">{admin?.email}</p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
