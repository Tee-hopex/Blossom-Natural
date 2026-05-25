import { useState } from 'react';
import { MessageCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus, useMarkOrderPaid } from '@/hooks/admin/useAdminOrders';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Order } from '@/types';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',        label: 'All'        },
  { value: 'pending',    label: 'Pending'    },
  { value: 'confirmed',  label: 'Confirmed'  },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped'    },
  { value: 'delivered',  label: 'Delivered'  },
  { value: 'cancelled',  label: 'Cancelled'  },
];

const NEXT_STATUSES: Record<string, string[]> = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered'],
  delivered:  [],
  cancelled:  [],
};

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

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const { mutate: markPaid, isPending: isMarking } = useMarkOrderPaid();

  const nextStatuses = NEXT_STATUSES[order.status] ?? [];
  const phone = order.customerPhone.replace(/\D/g, '');
  const waMessage = encodeURIComponent(
    `Hi ${order.customerName}, this is Blossom Natural regarding your order #${order.orderNumber}. `,
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${waMessage}`;

  return (
    <>
      <tr className="hover:bg-cream/30 transition-colors">
        {/* Order # */}
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-semibold text-brown hover:text-terracotta transition-colors text-left"
          >
            {order.orderNumber}
          </button>
          <p className="text-xs text-brown/40">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
        </td>

        {/* Customer */}
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-brown">{order.customerName}</p>
          <p className="text-xs text-brown/40">{order.customerPhone}</p>
        </td>

        {/* Location */}
        <td className="px-4 py-3 text-sm text-brown/70 hidden sm:table-cell">
          {order.city}, {order.state}
        </td>

        {/* Items */}
        <td className="px-4 py-3 text-sm text-brown/70 hidden md:table-cell text-center">
          {order.items.reduce((s, i) => s + i.quantity, 0)}
        </td>

        {/* Total */}
        <td className="px-4 py-3 text-sm font-semibold text-brown shrink-0">
          ₦{order.total.toLocaleString()}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <StatusBadge status={order.status} />
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {nextStatuses.length > 0 && (
              <div className="relative">
                <select
                  disabled={isUpdating}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) updateStatus({ id: order._id, status: e.target.value });
                  }}
                  className="appearance-none text-xs border border-cream-dark rounded-lg pl-2.5 pr-6 py-1.5 bg-white text-brown focus:outline-none focus:ring-1 focus:ring-terracotta disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Move to…</option>
                  {nextStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3 w-3 text-brown/40 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            {order.status === 'pending' && (
              <button
                type="button"
                disabled={isMarking}
                onClick={() => markPaid({ id: order._id })}
                className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Paid
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Message customer on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </td>
      </tr>

      {/* Expanded: order items */}
      {expanded && (
        <tr>
          <td colSpan={7} className="px-4 pb-4 bg-cream/20">
            <div className="rounded-xl border border-cream-dark p-4 mt-1 space-y-3">
              <div className="flex gap-6 flex-wrap text-xs text-brown/50 mb-1">
                <span>Email: <span className="text-brown">{order.customerEmail}</span></span>
                <span>Address: <span className="text-brown">{order.address}, {order.city}, {order.state}</span></span>
                <span>Payment: <span className="text-brown capitalize">{order.paymentMethod}</span></span>
              </div>

              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/36x36/A8CABA/3F2A1E'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brown font-medium truncate">{item.name}</p>
                    <p className="text-xs text-brown/40">Qty {item.quantity} × ₦{item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-brown shrink-0">
                    ₦{(item.quantity * item.price).toLocaleString()}
                  </p>
                </div>
              ))}

              <div className="flex justify-end gap-6 text-xs pt-2 border-t border-cream-dark text-brown/50">
                <span>Delivery: <span className="text-brown font-medium">₦{order.deliveryFee.toLocaleString()}</span></span>
                <span>Total: <span className="text-brown font-semibold">₦{order.total.toLocaleString()}</span></span>
              </div>

              {order.notes && (
                <p className="text-xs text-brown/50 pt-2 border-t border-cream-dark">
                  Note: <span className="text-brown">{order.notes}</span>
                </p>
              )}
              {order.consultationRequest && (
                <p className="text-xs text-terracotta font-semibold">Hair consultation requested</p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const { data, isLoading } = useAdminOrders({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: 50,
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-brown font-semibold">Orders</h1>
        <p className="text-brown/40 text-sm mt-1">
          {data?.pagination.total ?? 0} total orders
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        {STATUS_TABS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatusFilter(value)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === value
                ? 'bg-brown text-cream'
                : 'bg-white text-brown/60 hover:text-brown border border-cream-dark'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.data.length ? (
          <p className="text-center py-16 text-brown/30 text-sm">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-cream-dark bg-cream/30">
                  {['Order', 'Customer', 'Location', 'Items', 'Total', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold text-brown/50 uppercase tracking-wider ${
                        h === 'Location' ? 'hidden sm:table-cell' : ''
                      } ${h === 'Items' ? 'hidden md:table-cell text-center' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {data.data.map((order) => (
                  <OrderRow key={order._id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
