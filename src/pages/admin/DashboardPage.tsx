import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Package,
  Clock, CheckCircle, Truck, Users, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, accent = 'terracotta', trend,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: 'terracotta' | 'sage' | 'gold' | 'brown';
  trend?: number;
}) {
  const accentMap = {
    terracotta: 'bg-terracotta/10 text-terracotta',
    sage: 'bg-sage/20 text-sage-dark',
    gold: 'bg-gold/30 text-brown',
    brown: 'bg-brown/10 text-brown',
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${accentMap[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0
              ? <TrendingUp className="h-3.5 w-3.5" />
              : <TrendingDown className="h-3.5 w-3.5" />
            }
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="font-heading text-2xl font-bold text-brown">{value}</p>
      <p className="text-sm text-brown/50 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-brown/30 mt-1">{sub}</p>}
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────
const statusStyles: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-600',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: stats, isLoading } = useAdminDashboard();

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  const { orders, revenue, lowStock, recentOrders, subscriberCount, totalProducts } = stats;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl text-brown font-semibold">Dashboard</h1>
        <p className="text-brown/40 text-sm mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Revenue Today"
          value={`₦${revenue.today.toLocaleString()}`}
          icon={TrendingUp}
          accent="terracotta"
        />
        <StatCard
          label="This Month"
          value={`₦${revenue.thisMonth.toLocaleString()}`}
          sub={`Last month: ₦${revenue.lastMonth.toLocaleString()}`}
          icon={TrendingUp}
          accent="sage"
          trend={revenue.monthGrowth}
        />
        <StatCard
          label="Total Revenue"
          value={`₦${revenue.total.toLocaleString()}`}
          icon={TrendingUp}
          accent="gold"
        />
        <StatCard
          label="Subscribers"
          value={subscriberCount.toString()}
          sub={`${totalProducts} products live`}
          icon={Users}
          accent="brown"
        />
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Pending',    value: orders.pending,    icon: Clock,        color: 'text-yellow-600' },
          { label: 'Confirmed',  value: orders.confirmed,  icon: CheckCircle,  color: 'text-blue-600'   },
          { label: 'Processing', value: orders.processing, icon: Package,      color: 'text-purple-600' },
          { label: 'Shipped',    value: orders.shipped,    icon: Truck,        color: 'text-indigo-600' },
          { label: 'Delivered',  value: orders.delivered,  icon: CheckCircle,  color: 'text-green-600'  },
          { label: 'Cancelled',  value: orders.cancelled,  icon: AlertTriangle,color: 'text-red-500'    },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
            <p className="font-bold text-brown text-lg">{value}</p>
            <p className="text-[10px] text-brown/40 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark">
            <h2 className="font-heading text-base font-semibold text-brown">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-terracotta flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-cream-dark">
            {recentOrders.length === 0 && (
              <p className="text-center py-10 text-brown/30 text-sm">No orders yet.</p>
            )}
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brown truncate">{order.orderNumber}</p>
                  <p className="text-xs text-brown/40 truncate">{order.customerName}</p>
                </div>
                <StatusBadge status={order.status} />
                <p className="text-sm font-semibold text-brown shrink-0">₦{order.total.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark">
            <h2 className="font-heading text-base font-semibold text-brown">Low Stock</h2>
            <Link to="/admin/products" className="text-xs text-terracotta flex items-center gap-1 hover:underline">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-center py-10 text-brown/30 text-sm">All products well stocked! ✓</p>
          ) : (
            <div className="divide-y divide-cream-dark">
              {lowStock.map((p) => (
                <div key={p._id} className="flex items-center gap-3 px-5 py-3">
                  <img
                    src={p.images[0] ?? 'https://placehold.co/40x40/A8CABA/3F2A1E'}
                    alt={p.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brown truncate">{p.name}</p>
                    <p className="text-[10px] text-red-500 font-semibold">{p.stock} left</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
