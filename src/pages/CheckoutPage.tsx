import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, Landmark, MessageSquare, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { usePlaceOrder, buildOrderPayload } from '@/hooks/useOrder';
import { CheckoutFormData } from '@/types';
import toast from 'react-hot-toast';

// Simple inline useForm without react-hook-form dependency — plain state
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  const [form, setForm] = useState<CheckoutFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    state: '',
    notes: '',
    consultationRequest: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const sub = subtotal();
  const delivery = sub >= 15000 ? 0 : 1500;
  const total = sub + delivery;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingBag className="h-12 w-12 text-sage" />
        <p className="font-heading text-xl text-brown">Your cart is empty</p>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!form.customerName.trim()) e.customerName = 'Full name is required';
    if (!form.customerEmail.trim() || !/\S+@\S+\.\S+/.test(form.customerEmail))
      e.customerEmail = 'Valid email is required';
    if (!form.customerPhone.trim() || form.customerPhone.trim().length < 10)
      e.customerPhone = 'Valid phone number is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload = buildOrderPayload(form, items);
      const confirmation = await placeOrder(payload);
      clearCart();
      navigate('/order-confirmation', { state: { confirmation } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    }
  };

  const field = (
    id: keyof CheckoutFormData,
    label: string,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brown mb-1.5">
        {label} {id !== 'notes' && <span className="text-terracotta">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={form[id] as string}
        onChange={(ev) => setForm((f) => ({ ...f, [id]: ev.target.value }))}
        placeholder={placeholder}
        className={`input ${errors[id] ? 'ring-2 ring-terracotta border-terracotta' : ''}`}
      />
      {errors[id] && <p className="text-xs text-terracotta mt-1">{errors[id]}</p>}
    </div>
  );

  const NIGERIAN_STATES = [
    'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
    'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe',
    'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
    'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto',
    'Taraba','Yobe','Zamfara',
  ];

  return (
    <>
      <Helmet><title>Checkout — Blossom Natural</title></Helmet>

      <section className="section bg-cream">
        <div className="container-custom">
          <h1 className="font-heading text-3xl md:text-4xl text-brown mb-10">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Left — Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Info */}
                <div className="card p-6">
                  <h2 className="font-heading text-lg text-brown mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 bg-terracotta text-white text-xs rounded-full flex items-center justify-center font-body font-bold">1</span>
                    Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">{field('customerName', 'Full Name', 'text', 'Adaeze Okonkwo')}</div>
                    {field('customerEmail', 'Email Address', 'email', 'adaeze@email.com')}
                    {field('customerPhone', 'Phone Number', 'tel', '+234 800 000 0000')}
                    <div className="sm:col-span-2">{field('address', 'Delivery Address', 'text', '12 Lekki Phase 1, Lagos Island')}</div>
                    {field('city', 'City', 'text', 'Lagos')}
                    <div>
                      <label className="block text-sm font-medium text-brown mb-1.5">
                        State <span className="text-terracotta">*</span>
                      </label>
                      <select
                        value={form.state}
                        onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                        className={`input ${errors.state ? 'ring-2 ring-terracotta' : ''}`}
                      >
                        <option value="">Select State</option>
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-xs text-terracotta mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="card p-6">
                  <h2 className="font-heading text-lg text-brown mb-5 flex items-center gap-2">
                    <span className="w-6 h-6 bg-terracotta text-white text-xs rounded-full flex items-center justify-center font-body font-bold">2</span>
                    Additional Notes
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-brown mb-1.5">
                      Order Notes (optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      placeholder="Any special instructions for your order..."
                      rows={3}
                      className="input resize-none"
                    />
                  </div>
                  <label className="flex items-start gap-3 mt-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consultationRequest}
                      onChange={(e) => setForm((f) => ({ ...f, consultationRequest: e.target.checked }))}
                      className="mt-0.5 w-4 h-4 accent-terracotta"
                    />
                    <span className="text-sm text-brown/70">
                      <MessageSquare className="h-4 w-4 inline mr-1 text-[#25D366]" />
                      I'd like a free hair consultation with the founder on WhatsApp
                    </span>
                  </label>
                </div>

                {/* Payment */}
                <div className="card p-6">
                  <h2 className="font-heading text-lg text-brown mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-terracotta text-white text-xs rounded-full flex items-center justify-center font-body font-bold">3</span>
                    Payment — Bank Transfer
                  </h2>
                  <div className="bg-sage/10 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Landmark className="h-5 w-5 text-sage-dark" />
                      <p className="font-heading text-base text-brown font-semibold">Bank Transfer Details</p>
                    </div>
                    {[
                      ['Bank', 'First Bank Nigeria'],
                      ['Account Name', 'Blossom Natural Ltd'],
                      ['Account Number', '0000000000'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-brown/50">{label}</span>
                        <span className="font-semibold text-brown">{value}</span>
                      </div>
                    ))}
                    <div className="border-t border-sage/30 pt-3 flex justify-between text-sm">
                      <span className="text-brown/50">Amount to Transfer</span>
                      <span className="font-bold text-terracotta text-base">₦{total.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-brown/50 mt-2">
                      Use your name as the transfer description. Your order will be confirmed once payment is verified (within 2–4 hours).
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — Summary */}
              <div className="lg:col-span-1">
                <div className="card p-6 sticky top-24">
                  <h2 className="font-heading text-lg text-brown mb-5">Order Summary</h2>
                  <div className="space-y-3 mb-5">
                    {items.map(({ product, quantity }) => {
                      const price = product.salePrice ?? product.price;
                      return (
                        <div key={product._id} className="flex gap-3">
                          <img
                            src={product.images[0] ?? 'https://placehold.co/60x60/A8CABA/3F2A1E'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-brown truncate">{product.name}</p>
                            <p className="text-xs text-brown/40">Qty: {quantity}</p>
                          </div>
                          <p className="text-xs font-semibold text-brown shrink-0">
                            ₦{(price * quantity).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-cream-dark pt-4 space-y-2 text-sm mb-5">
                    <div className="flex justify-between text-brown/60">
                      <span>Subtotal</span><span>₦{sub.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-brown/60">
                      <span>Delivery</span>
                      <span className={delivery === 0 ? 'text-sage-dark font-medium' : ''}>
                        {delivery === 0 ? 'FREE' : `₦${delivery.toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-brown text-base pt-1 border-t border-cream-dark">
                      <span>Total</span><span>₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full gap-2 disabled:opacity-60 disabled:cursor-wait"
                  >
                    {isPending ? 'Placing Order...' : (
                      <>Place Order <ChevronRight className="h-4 w-4" /></>
                    )}
                  </motion.button>
                  <p className="text-xs text-center text-brown/40 mt-3">
                    By placing your order you agree to our terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
