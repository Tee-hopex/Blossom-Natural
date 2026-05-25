import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating';

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const price = product.salePrice ?? product.price;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card group"
    >
      <Link to={`/shop/${product.slug}`} className="block relative overflow-hidden">
        <img
          src={product.images[0] ?? 'https://placehold.co/400x400/A8CABA/3F2A1E?text=🌿'}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isBestSeller && (
          <span className="absolute top-2 left-2 bg-terracotta text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Best Seller
          </span>
        )}
        {product.isNewArrival && !product.isBestSeller && (
          <span className="absolute top-2 left-2 bg-sage text-brown text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
      </Link>
      <div className="p-4">
        <p className="text-[10px] text-brown/40 uppercase tracking-wider mb-1">
          {typeof product.category === 'object' ? product.category.name : ''}
        </p>
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-heading text-sm font-semibold text-brown hover:text-terracotta transition-colors leading-snug mb-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3 w-3 fill-gold text-gold" />
          <span className="text-xs text-brown/50">{product.rating.toFixed(1)} ({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-brown text-sm">₦{price.toLocaleString()}</span>
            {product.salePrice && (
              <span className="ml-1.5 text-xs text-brown/35 line-through">₦{product.price.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="text-xs btn-primary py-1.5 px-3 disabled:opacity-40"
          >
            {product.stock === 0 ? 'Sold Out' : '+ Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: categoriesData } = useCategories();
  const { data, isLoading, isFetching } = useProducts({
    page,
    limit: 12,
    category: selectedCategory || undefined,
    search: search || undefined,
    sort,
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSort('newest');
    setPage(1);
  };

  const hasFilters = !!search || !!selectedCategory || sort !== 'newest';

  return (
    <>
      <Helmet>
        <title>Shop — Blossom Natural</title>
        <meta name="description" content="Browse our full collection of premium natural hair care products for textured, African & curly hair." />
      </Helmet>

      {/* Page header */}
      <div className="bg-sage/10 py-12 md:py-16">
        <div className="container-custom">
          <p className="text-terracotta text-xs font-medium uppercase tracking-widest mb-2">Our Collection</p>
          <h1 className="font-heading text-4xl md:text-5xl text-brown">Shop All Products</h1>
        </div>
      </div>

      <section className="section bg-cream">
        <div className="container-custom">
          {/* Search + Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search products..."
                className="input pl-10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="input w-full sm:w-48"
            >
              <option value="">All Categories</option>
              {categoriesData?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as SortOption); setPage(1); }}
              className="input w-full sm:w-44"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="btn-secondary sm:px-4 gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-brown/50">Active filters:</span>
              {search && (
                <span className="text-xs bg-sage/20 text-brown px-2.5 py-1 rounded-full flex items-center gap-1">
                  "{search}" <button onClick={() => setSearch('')}><X className="h-3 w-3" /></button>
                </span>
              )}
              {selectedCategory && (
                <span className="text-xs bg-sage/20 text-brown px-2.5 py-1 rounded-full flex items-center gap-1">
                  {categoriesData?.find((c) => c._id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('')}><X className="h-3 w-3" /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-terracotta underline ml-1">
                Clear all
              </button>
            </div>
          )}

          {/* Results count */}
          {pagination && (
            <p className="text-xs text-brown/40 mb-6">
              {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
            </p>
          )}

          {/* Product grid */}
          {isLoading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading text-2xl text-brown/30 mb-2">No products found</p>
              <p className="text-sm text-brown/40 mb-6">Try adjusting your search or filters</p>
              <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
            </div>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 ${isFetching ? 'opacity-70' : ''}`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary py-2 px-5 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-brown/50">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="btn-secondary py-2 px-5 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
