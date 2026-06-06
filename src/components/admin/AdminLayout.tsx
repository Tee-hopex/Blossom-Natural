import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Star,
  Settings, LogOut, Menu, ChevronRight,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import icon from '@/assets/icon.png';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products',  icon: Package,         label: 'Products'  },
  { to: '/admin/orders',    icon: ShoppingBag,     label: 'Orders'    },
  { to: '/admin/categories',icon: Tag,             label: 'Categories'},
  { to: '/admin/reviews',   icon: Star,            label: 'Reviews'   },
  { to: '/admin/settings',  icon: Settings,        label: 'Settings'  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-brown text-cream">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-cream/10">
        <img src={icon} alt="BN" className="h-8 w-8 object-contain brightness-0 invert opacity-90 shrink-0" />
        <div>
          <p className="font-heading text-cream text-base font-semibold leading-tight">Blossom Natural</p>
          <p className="text-[10px] text-cream/40 uppercase tracking-widest">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-terracotta text-white'
                  : 'text-cream/60 hover:bg-cream/10 hover:text-cream'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-cream/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-sage/30 flex items-center justify-center text-xs font-bold text-cream uppercase">
            {admin?.username?.[0] ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-cream truncate">{admin?.username ?? 'Admin'}</p>
            <p className="text-[10px] text-cream/40">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/60 hover:bg-red-900/40 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-cream overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-56 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-56 shrink-0 flex flex-col">
            <Sidebar />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex-1 bg-black/40"
            aria-label="Close sidebar"
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-cream-dark flex items-center px-4 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg hover:bg-cream transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-brown" />
          </button>
          <ChevronRight className="h-4 w-4 text-brown/30 hidden md:block" />
          <span className="text-sm text-brown/50 hidden md:block">Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
