import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Zap, ChevronLeft, Minus, Plus, CheckCircle2, MessageCircle } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const WHATSAPP_NUMBER = '2348000000000';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(slug ?? '');
  const addItem = useCartStore((s) => s.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'usage'>('description');

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (isError || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-heading text-2xl text-brown/40">Product not found</p>
        <Link to="/shop" className="btn-secondary">Back to Shop</Link>
      </div>
    );
  }

  const price = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in "${product.name}" and would love a consultation. Can you help?`
  );

  return (
    <>
      <Helmet>
        <title>{product.name} — Blossom Natural</title>
        <meta name="description" content={product.description.slice(0, 155)} />
      </Helmet>

      <section className="section bg-cream">
        <div className="container-custom">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-brown/40 mb-8">
            <Link to="/" className="hover:text-brown transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-brown transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-brown truncate max-w-xs">{product.name}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-brown/50 hover:text-brown transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Gallery */}
            <div>
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl overflow-hidden bg-sage/10 aspect-square mb-4"
              >
                <img
                  src={product.images[selectedImage] ?? 'https://placehold.co/600x600/A8CABA/3F2A1E?text=🌿'}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`View image ${i + 1}`}
                      onClick={() => setSelectedImage(i)}
                      className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-terracotta' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {product.isBestSeller && (
                  <span className="text-xs bg-terracotta text-white px-2.5 py-1 rounded-full font-semibold">
                    Best Seller
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="text-xs bg-sage text-brown px-2.5 py-1 rounded-full font-semibold">
                    New Arrival
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs bg-gold text-brown px-2.5 py-1 rounded-full font-semibold">
                    {discount}% Off
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl md:text-4xl text-brown leading-tight mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'fill-gold text-gold' : 'text-brown/20'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-brown/50">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-heading text-3xl text-brown font-semibold">
                  ₦{price.toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="text-lg text-brown/35 line-through">
                    ₦{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-brown/70">Quantity:</span>
                <div className="flex items-center border border-cream-dark rounded-xl overflow-hidden">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-sage/10 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold text-sm min-w-[2.5rem] text-center" aria-live="polite">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 hover:bg-sage/10 transition-colors disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-brown/40">{product.stock} in stock</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-secondary flex-1 gap-2 disabled:opacity-40"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn-primary flex-1 gap-2 disabled:opacity-40"
                >
                  <Zap className="h-4 w-4" />
                  Buy Now
                </button>
              </div>

              {/* WhatsApp Consult */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[#25D366] font-medium hover:underline mb-8"
              >
                <MessageCircle className="h-4 w-4" />
                Consult with founder on WhatsApp
              </a>

              {/* Benefits preview */}
              {product.benefits.length > 0 && (
                <div className="bg-sage/10 rounded-2xl p-5">
                  <p className="font-heading text-sm text-brown font-semibold mb-3">Key Benefits</p>
                  <ul className="space-y-2">
                    {product.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-brown/70">
                        <CheckCircle2 className="h-4 w-4 text-sage shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="flex gap-1 border-b border-cream-dark mb-8">
              {(['description', 'ingredients', 'usage'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-terracotta text-terracotta'
                      : 'border-transparent text-brown/50 hover:text-brown'
                  }`}
                >
                  {tab === 'usage' ? 'How to Use' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="max-w-2xl text-brown/70 leading-relaxed">
              {activeTab === 'description' && <p>{product.description}</p>}
              {activeTab === 'ingredients' && (
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span key={ing} className="bg-cream-dark text-brown text-sm px-3 py-1.5 rounded-full">
                      {ing}
                    </span>
                  ))}
                </div>
              )}
              {activeTab === 'usage' && (
                product.usage
                  ? <p>{product.usage}</p>
                  : <p className="text-brown/40 italic">Usage instructions coming soon.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
