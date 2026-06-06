import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Leaf, Droplets, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?auto=format&fit=crop&w=900&q=90",
    tag: "Premium Natural Hair Care",
    headline: "Nourish. Grow.",
    highlight: "Blossom.",
    sub: "Handcrafted with organic ingredients specially formulated for textured, African, and curly hair. Your natural hair journey starts here.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1632765866070-3fadf25d3d5b?auto=format&fit=crop&w=900&q=90",
    tag: "100% Organic Ingredients",
    headline: "From Nature to",
    highlight: "Your Crown.",
    sub: "We source the finest African botanicals to create formulas that truly penetrate, hydrate, and heal your hair from the roots.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=90",
    tag: "Clinically Tested",
    headline: "Real Results,",
    highlight: "Real Confidence.",
    sub: "Join thousands of women who have transformed their edges, length, and scalp health with our proven regimens.",
  }
];

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
          <h3 className="font-heading text-base font-semibold text-brown mb-1 hover:text-terracotta transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          <span className="text-xs text-brown/60">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-brown/40">({product.reviewCount})</span>
        </div>
        <div className="flex flex-col gap-3 mt-3">
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
            className="w-full text-xs sm:text-sm btn-primary py-2 px-2 sm:px-3 disabled:opacity-40 whitespace-nowrap"
          >
            <span className="sm:hidden">{product.stock === 0 ? 'Sold Out' : '+ Cart'}</span>
            <span className="hidden sm:inline">{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
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
    text: 'Fast delivery, beautifully packaged, and the products smell heavenly. My scalp itching is completely gone after 2 weeks of Ayurvedic mist.',
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

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <>
      <Helmet>
        <title>Blossom Natural — Nourish. Grow. Blossom.</title>
        <meta
          name="description"
          content="Premium handcrafted natural hair care for textured, African & curly hair. Shop growth serums, deep conditioners, and scalp treatments."
        />
      </Helmet>

      {/* ── Hero Carousel ── */}
      <section className="bg-cream overflow-hidden group">

        {/* Mobile: image strip */}
        <div className="md:hidden relative h-72 sm:h-80 overflow-hidden">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt="Natural hair"
                className="w-full h-full object-cover object-[50%_15%]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
        </div>

        {/* Split layout: text left + image right */}
        <div className="flex md:min-h-[88vh]">

          {/* Text panel */}
          <div className="w-full md:w-[54%] flex items-center bg-cream py-10 md:py-20 relative z-10">
            <div className="w-full px-6 sm:px-10 md:pl-[7%] md:pr-8 lg:pl-[9%]">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl"
              >
                <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/20 text-terracotta font-body font-semibold text-[10px] sm:text-xs uppercase tracking-widest mb-5 sm:mb-6">
                  <Leaf className="h-3 w-3" />
                  {heroSlides[currentSlide].tag}
                </p>

                <h1 className="font-heading text-4xl sm:text-5xl md:text-5xl lg:text-6xl text-brown leading-[1.1] mb-4 md:mb-6">
                  {heroSlides[currentSlide].headline}
                  <br />
                  <em className="text-terracotta not-italic">{heroSlides[currentSlide].highlight}</em>
                </h1>

                <p className="font-body text-brown/70 text-base sm:text-lg leading-relaxed mb-8 md:mb-10 max-w-md">
                  {heroSlides[currentSlide].sub}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link to="/shop" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 text-center shadow-lg shadow-terracotta/20">
                    Shop Collection
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/about" className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 text-center">
                    Our Story
                  </Link>
                </div>
              </motion.div>

              {/* Slide indicators + mobile arrows */}
              <div className="flex items-center gap-3 mt-10">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentSlide
                        ? 'w-8 h-2 bg-terracotta'
                        : 'w-2 h-2 bg-brown/25 hover:bg-brown/40'
                    }`}
                  />
                ))}
                <div className="flex items-center gap-2 ml-4 md:hidden">
                  <button
                    onClick={prevSlide}
                    className="p-1.5 rounded-full bg-brown/10 text-brown hover:bg-brown/20 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-1.5 rounded-full bg-brown/10 text-brown hover:bg-brown/20 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image panel — desktop only */}
          <div className="hidden md:block w-[46%] relative overflow-hidden">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden={idx !== currentSlide}
              >
                <img
                  src={slide.image}
                  alt="Natural Hair"
                  className="w-full h-full object-cover object-[50%_15%]"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
            {/* Left-edge blend into cream */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cream to-transparent pointer-events-none z-10" />

            {/* Desktop nav arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/70 backdrop-blur-sm text-brown hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/70 backdrop-blur-sm text-brown hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
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
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-terracotta font-body font-medium text-xs uppercase tracking-widest mb-3">
                Our Story
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-brown leading-snug mb-6">
                Born from a personal{' '}
                <em className="text-terracotta not-italic">hair journey</em>
              </h2>
              <p className="font-body text-brown/70 leading-relaxed text-sm sm:text-base mb-6">
                Blossom Natural was born out of frustration and love. Our founder spent years
                struggling to find products that truly worked for her 4C hair — so she made
                her own. Today, those same handcrafted formulas are helping thousands of
                women across Africa embrace their natural texture.
              </p>
              <Link to="/about" className="btn-primary text-sm sm:text-base">
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
                  src={new URL('../assets/founder.jpg', import.meta.url).href}
                  alt="Natural hair care"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-3 sm:bottom-4 md:-bottom-6 left-3 sm:left-4 md:-left-6 bg-white rounded-2xl shadow-lg p-3 sm:p-4 flex items-center gap-3">
                <div className="bg-sage/20 rounded-xl p-2 sm:p-2.5">
                  <Leaf className="h-4 sm:h-5 w-4 sm:w-5 text-sage-dark" />
                </div>
                <div>
                  <p className="font-heading text-brown text-xs sm:text-sm font-semibold">100% Organic</p>
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
      <section className="bg-terracotta py-12 md:py-16">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-white mb-3">
            Join the Blossom Family
          </h2>
          <p className="font-body text-white/80 text-sm sm:text-base mb-6 md:mb-8 max-w-md mx-auto">
            Get exclusive hair care tips, new product launches, and special offers straight
            to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center max-w-md mx-auto">
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
