import React from 'react';
import { LayoutDashboard, Package, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const navItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'orders', label: 'Orders', icon: ClipboardList },
];

const AdminMobileNav = ({ active, setActive }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-ink-950 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive ? 'bg-gold-500 text-ink-950' : 'text-ink-300'
              }`}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>
      <button onClick={handleLogout} className="p-2 rounded-lg text-ink-300 hover:text-red-400">
        <LogOut size={17} />
      </button>
    </div>
  );
};

export default AdminMobileNav;
