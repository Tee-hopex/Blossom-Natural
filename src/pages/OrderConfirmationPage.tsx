import { useLocation, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, MessageCircle, ShoppingBag } from 'lucide-react';
import { OrderConfirmation } from '@/types';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = '2348140728945';

export default function OrderConfirmationPage() {
  const location = useLocation();
  const confirmation = location.state?.confirmation as OrderConfirmation | undefined;

  if (!confirmation) return <Navigate to="/" replace />;

  const { orderNumber, subtotal, deliveryFee, total, paymentInstructions } = confirmation;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`));
  };

  const whatsappMsg = encodeURIComponent(
    `Hi! I just placed order #${orderNumber} on Blossom Natural for ₦${total.toLocaleString()}. I've made the transfer. Please confirm!`
  );

  return (
    <>
      <Helmet><title>Order Confirmed — Blossom Natural</title></Helmet>

      <section className="section bg-cream">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-sage/20 rounded-full mb-5">
              <CheckCircle2 className="h-10 w-10 text-sage-dark" />
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-brown mb-3">
              Order Placed! 🌸
            </h1>
            <p className="text-brown/60 text-sm leading-relaxed max-w-md mx-auto">
              Thank you for choosing Blossom Natural. Complete your bank transfer using the
              details below to confirm your order.
            </p>
          </motion.div>

          {/* Order Number */}
          <div className="card p-5 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-brown/40 uppercase tracking-wider mb-0.5">Order Number</p>
              <p className="font-heading text-xl text-brown font-semibold">{orderNumber}</p>
            </div>
            <button
              onClick={() => copyToClipboard(orderNumber, 'Order number')}
              className="p-2 rounded-xl hover:bg-sage/10 text-brown/40 hover:text-brown transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {/* Payment Instructions */}
          <div className="card p-6 mb-5">
            <h2 className="font-heading text-lg text-brown mb-5">Payment Instructions</h2>
            <p className="text-sm text-brown/60 mb-4">
              Transfer exactly <strong className="text-terracotta">₦{total.toLocaleString()}</strong> to:
            </p>
            <div className="bg-sage/10 rounded-2xl p-5 space-y-4">
              {[
                { label: 'Bank Name', value: paymentInstructions.bankName },
                { label: 'Account Name', value: paymentInstructions.accountName },
                { label: 'Account Number', value: paymentInstructions.accountNumber },
                { label: 'Amount', value: `₦${total.toLocaleString()}` },
                { label: 'Reference / Narration', value: orderNumber },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-brown/50">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brown text-sm">{value}</span>
                    <button
                      onClick={() => copyToClipboard(value, label)}
                      className="p-1 rounded-lg hover:bg-sage/20 text-brown/30 hover:text-brown transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-brown/40 mt-4 text-center">
              Use your order number as the transfer reference. Orders are confirmed within 2–4 hours after payment.
            </p>
          </div>

          {/* Order Totals */}
          <div className="card p-5 mb-8">
            <h3 className="font-heading text-base text-brown mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-brown/60">
                <span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-brown/60">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-sage-dark font-medium' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-brown pt-2 border-t border-cream-dark">
                <span>Total</span><span>₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn flex-1 bg-[#25D366] text-white hover:bg-[#1ebe5d] gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Confirm via WhatsApp
            </a>
            <Link to="/shop" className="btn-secondary flex-1 gap-2">
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
