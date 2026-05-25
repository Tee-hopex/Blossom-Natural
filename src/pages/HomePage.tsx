import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Leaf, Droplets, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const price = product.salePrice ?? product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="card group"
    >
      <Link to={`/shop/${product.slug}`} className="block relative overflow-hidden">
        <img
          src={product.images[0] ?? 'https://placehold.co/400x400/A8CABA/3F2A1E?text=🌿'}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-terracotta text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Best Seller
          </span>
        )}
        {product.isNewArrival && !product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-sage text-brown text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        {product.salePrice && (
          <span className="absolute top-3 right-3 bg-gold text-brown text-[10px] font-semibold px-2.5 py-1 rounded-full">
            Sale
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-heading text-base font-semibold text-brown mb-1 hover:text-terracotta transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs text-brown/60">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-brown/40">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-brown">₦{price.toLocaleString()}</span>
            {product.salePrice && (
              <span className="text-xs text-brown/40 line-through">
                ₦{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="text-xs btn-primary py-2 px-4 disabled:opacity-40"
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Testimonials data ─────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Adaeze O.',
    location: 'Lagos',
    text: 'The growth serum is EVERYTHING. My edges are back after just 6 weeks. I cry every time I do my hair because I\'m so happy!',
    rating: 5,
  },
  {
    name: 'Chidinma E.',
    location: 'Abuja',
    text: 'I\'ve tried so many deep conditioners but the Shea & Honey mask is the first one that actually penetrated my 4C hair without leaving residue.',
    rating: 5,
  },
  {
    name: 'Fatima B.',
    location: 'Kano',
    text: 'Fast delivery, beautifully packaged, and the products smell heavenly. My scalp itching is completely gone after 2 weeks of the scalp oil.',
    rating: 5,
  },
];

// ── Brand Features ────────────────────────────────────────────────────────
const features = [
  { icon: Leaf, title: '100% Organic', desc: 'Only pure, certified organic ingredients in every bottle.' },
  { icon: Droplets, title: 'Deep Hydration', desc: 'Formulated for maximum moisture retention in textured hair.' },
  { icon: Heart, title: 'Made with Love', desc: 'Handcrafted in small batches by our founder for real results.' },
];

// ── Home Page ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data, isLoading } = useFeaturedProducts();

  return (
    <>
      <Helmet>
        <title>Blossom Natural — Nourish. Grow. Blossom.</title>
        <meta
          name="description"
          content="Premium handcrafted natural hair care for textured, African & curly hair. Shop growth serums, deep conditioners, and scalp treatments."
        />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-hero-gradient min-h-[88vh] flex items-center">
        <div className="container-custom py-20">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-terracotta font-body font-medium text-sm uppercase tracking-widest mb-4"
            >
              Premium Natural Hair Care
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-5xl md:text-6xl lg:text-7xl text-brown leading-tight mb-6"
            >
              Nourish.
              <br />
              <em className="text-terracotta not-italic">Grow.</em>
              <br />
              Blossom.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-brown/70 text-lg leading-relaxed mb-10 max-w-xl"
            >
              Handcrafted with organic ingredients specially formulated for textured,
              African, and curly hair. Your natural hair journey starts here.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/shop" className="btn-primary text-base px-8 py-4">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="btn-secondary text-base px-8 py-4">
                Our Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sage/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-terracotta/10 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* ── Features strip ── */}
      <section className="bg-brown py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 text-cream/80">
                <div className="p-2.5 rounded-xl bg-cream/10 shrink-0">
                  <Icon className="h-5 w-5 text-sage" />
                </div>
                <div>
                  <p className="font-heading text-cream text-sm font-semibold mb-0.5">{title}</p>
                  <p className="text-xs leading-relaxed opacity-60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-terracotta font-body font-medium text-xs uppercase tracking-widest mb-2">
                Our Collection
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-brown">
                Best Sellers
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : !data?.length ? (
            <div className="text-center py-16 text-brown/40">
              <p className="font-heading text-2xl mb-2">No products yet</p>
              <p className="text-sm">Run the seed script to add sample products.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link to="/shop" className="btn-secondary">
              View All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Story Teaser ── */}
      <section className="section bg-sage/10">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-terracotta font-body font-medium text-xs uppercase tracking-widest mb-3">
                Our Story
              </p>
              <h2 className="font-heading text-3xl md:text-4xl text-brown leading-snug mb-6">
                Born from a personal{' '}
                <em className="text-terracotta not-italic">hair journey</em>
              </h2>
              <p className="font-body text-brown/70 leading-relaxed mb-6">
                Blossom Natural was born out of frustration and love. Our founder spent years
                struggling to find products that truly worked for her 4C hair — so she made
                her own. Today, those same handcrafted formulas are helping thousands of
                women across Africa embrace their natural texture.
              </p>
              <Link to="/about" className="btn-primary">
                Read Our Full Story <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl bg-sage/30 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80"
                  alt="Natural hair care"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="bg-sage/20 rounded-xl p-2.5">
                  <Leaf className="h-5 w-5 text-sage-dark" />
                </div>
                <div>
                  <p className="font-heading text-brown text-sm font-semibold">100% Organic</p>
                  <p className="text-xs text-brown/50">No harmful chemicals</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-terracotta font-body font-medium text-xs uppercase tracking-widest mb-2">
              Real Results
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-brown">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="font-body text-brown/70 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-sage/30 flex items-center justify-center font-heading text-sm text-brown font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-brown text-sm">{t.name}</p>
                    <p className="text-xs text-brown/40">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter Banner ── */}
      <section className="bg-terracotta py-16">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-3">
            Join the Blossom Family
          </h2>
          <p className="font-body text-white/80 mb-8 max-w-md mx-auto">
            Get exclusive hair care tips, new product launches, and special offers straight
            to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
            <button type="submit" className="btn bg-white text-terracotta hover:bg-cream font-semibold">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
