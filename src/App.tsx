import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ── Public pages ──────────────────────────────────────────────────────────────
const HomePage             = lazy(() => import('@/pages/HomePage'));
const ShopPage             = lazy(() => import('@/pages/ShopPage'));
const ProductDetailPage    = lazy(() => import('@/pages/ProductDetailPage'));
const AboutPage            = lazy(() => import('@/pages/AboutPage'));
const CartPage             = lazy(() => import('@/pages/CartPage'));
const CheckoutPage         = lazy(() => import('@/pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'));
const NotFoundPage         = lazy(() => import('@/pages/NotFoundPage'));

// ── Admin pages ───────────────────────────────────────────────────────────────
const AdminLoginPage  = lazy(() => import('@/pages/admin/AdminLoginPage'));
const DashboardPage   = lazy(() => import('@/pages/admin/DashboardPage'));
const ProductsPage    = lazy(() => import('@/pages/admin/ProductsPage'));
const OrdersPage      = lazy(() => import('@/pages/admin/OrdersPage'));
const CategoriesPage  = lazy(() => import('@/pages/admin/CategoriesPage'));
const ReviewsPage     = lazy(() => import('@/pages/admin/ReviewsPage'));
const SettingsPage    = lazy(() => import('@/pages/admin/SettingsPage'));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* ── Public storefront ─────────────────────────────────────────── */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="shop/:slug" element={<ProductDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Admin panel ───────────────────────────────────────────────── */}
        <Route path="admin">
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard"  element={<DashboardPage />}  />
              <Route path="products"   element={<ProductsPage />}   />
              <Route path="orders"     element={<OrdersPage />}     />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="reviews"    element={<ReviewsPage />}    />
              <Route path="settings"   element={<SettingsPage />}   />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
