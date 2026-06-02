import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'Our Story' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm' : 'bg-cream'
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Leaf className="h-6 w-6 text-terracotta group-hover:text-sage transition-colors" />
          <span className="font-heading text-xl md:text-2xl text-brown font-semibold tracking-wide">
            Blossom Natural
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `font-body text-sm font-medium tracking-wide transition-colors duration-200 hover:text-terracotta relative pb-1 ${
                  isActive
                    ? 'text-terracotta after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-terracotta after:rounded-full'
                    : 'text-brown/70'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-sage/20 transition-colors"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingBag className="h-5 w-5 text-brown" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
              >
                {itemCount > 9 ? '9+' : itemCount}
              </motion.span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-full hover:bg-sage/20 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-cream border-t border-cream-dark"
          >
            <nav className="container-custom flex flex-col py-4 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl font-body font-medium text-sm transition-colors ${
                      isActive
                        ? 'bg-terracotta/10 text-terracotta'
                        : 'text-brown/70 hover:bg-sage/10 hover:text-brown'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/cart"
                className="px-4 py-3 rounded-xl font-body font-medium text-sm text-brown/70 hover:bg-sage/10 hover:text-brown flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Cart {itemCount > 0 && `(${itemCount})`}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
