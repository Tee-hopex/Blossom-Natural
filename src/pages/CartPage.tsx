import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const FREE_DELIVERY_THRESHOLD = 15000;
const DELIVERY_FEE = 1500;

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const navigate = useNavigate();
  const sub = subtotal();
  const delivery = sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = sub + delivery;

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Cart — Blossom Natural</title></Helmet>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4">
          <div className="p-6 bg-sage/10 rounded-full">
            <ShoppingBag className="h-12 w-12 text-sage" />
          </div>
          <h2 className="font-heading text-2xl text-brown">Your cart is empty</h2>
          <p className="text-brown/50 text-sm text-center max-w-xs">
            Discover our premium natural hair care products and start your Blossom journey.
          </p>
          <Link to="/shop" className="btn-primary">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>{`Cart (${items.length}) — Blossom Natural`}</title></Helmet>

      <section className="section bg-cream">
        <div className="container-custom">
          <h1 className="font-heading text-3xl md:text-4xl text-brown mb-10">My Cart</h1>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(({ product, quantity }) => {
                  const price = product.salePrice ?? product.price;
                  return (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="card flex gap-4 p-4"
                    >
                      <Link to={`/shop/${product.slug}`} className="shrink-0">
                        <img
                          src={product.images[0] ?? 'https://placehold.co/100x100/A8CABA/3F2A1E?text=🌿'}
                          alt={product.name}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/shop/${product.slug}`}>
                            <h3 className="font-heading text-base text-brown font-semibold hover:text-terracotta transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <button
                            onClick={() => removeItem(product._id)}
                            className="p-1.5 text-brown/30 hover:text-terracotta transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-brown/50 mb-3">₦{price.toLocaleString()} each</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-cream-dark rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(product._id, quantity - 1)}
                              className="px-2.5 py-1.5 hover:bg-sage/10 transition-colors"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-sm font-semibold">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product._id, quantity + 1)}
                              disabled={quantity >= product.stock}
                              className="px-2.5 py-1.5 hover:bg-sage/10 transition-colors disabled:opacity-40"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="font-semibold text-brown">
                            ₦{(price * quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-heading text-lg text-brown mb-5">Order Summary</h2>
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-brown/70">
                    <span>Subtotal</span>
                    <span>₦{sub.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brown/70">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-sage-dark font-medium' : ''}>
                      {delivery === 0 ? 'FREE' : `₦${delivery.toLocaleString()}`}
                    </span>
                  </div>
                  {sub < FREE_DELIVERY_THRESHOLD && (
                    <p className="text-xs text-sage-dark bg-sage/10 px-3 py-2 rounded-xl">
                      Add ₦{(FREE_DELIVERY_THRESHOLD - sub).toLocaleString()} more for free delivery!
                    </p>
                  )}
                  <div className="border-t border-cream-dark pt-3 flex justify-between font-semibold text-brown text-base">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full text-sm"
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/shop"
                  className="block text-center text-xs text-brown/40 hover:text-brown mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
