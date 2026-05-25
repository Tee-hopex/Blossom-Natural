import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, X, GripVertical } from 'lucide-react';
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/admin/useAdminProducts';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { Product } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';

// ── Helpers ───────────────────────────────────────────────────────────────
function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Toggle Switch ─────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="shrink-0">
      {value
        ? <ToggleRight className="h-6 w-6 text-terracotta" />
        : <ToggleLeft className="h-6 w-6 text-brown/30" />
      }
    </button>
  );
}

// ── Dynamic List Field ────────────────────────────────────────────────────
function DynamicList({
  label, items, onChange, placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const add = () => onChange([...items, '']);
  const update = (i: number, v: string) => onChange(items.map((x, idx) => idx === i ? v : x));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-brown">{label}</label>
        <button type="button" onClick={add} className="text-xs text-terracotta hover:underline flex items-center gap-0.5">
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <GripVertical className="h-4 w-4 text-brown/20 mt-2.5 shrink-0" />
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder ?? `Item ${i + 1}`}
              className="input text-sm py-2"
            />
            <button type="button" onClick={() => remove(i)} className="p-2 text-brown/30 hover:text-terracotta">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <button type="button" onClick={add} className="w-full border-2 border-dashed border-cream-dark rounded-xl py-3 text-xs text-brown/30 hover:border-sage hover:text-sage-dark transition-colors">
            + Add {label}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Product Form ──────────────────────────────────────────────────────────
interface FormData {
  name: string; slug: string; price: string; salePrice: string; discountPercent: string;
  description: string; usage: string; stock: string; category: string;
  benefits: string[]; ingredients: string[]; images: string[];
  isFeatured: boolean; isNewArrival: boolean; isBestSeller: boolean;
}

const emptyForm = (): FormData => ({
  name: '', slug: '', price: '', salePrice: '', discountPercent: '',
  description: '', usage: '', stock: '0', category: '',
  benefits: [], ingredients: [], images: [],
  isFeatured: false, isNewArrival: true, isBestSeller: false,
});

function productToForm(p: Product): FormData {
  const cat = typeof p.category === 'object' ? p.category._id : p.category;
  const discount = p.salePrice
    ? String(Math.round(((p.price - p.salePrice) / p.price) * 100))
    : '';
  return {
    name: p.name, slug: p.slug, price: String(p.price),
    salePrice: p.salePrice ? String(p.salePrice) : '',
    discountPercent: discount,
    description: p.description, usage: p.usage ?? '', stock: String(p.stock),
    category: cat, benefits: [...p.benefits], ingredients: [...p.ingredients],
    images: [...p.images],
    isFeatured: p.isFeatured, isNewArrival: p.isNewArrival, isBestSeller: p.isBestSeller,
  };
}

function formToPayload(f: FormData) {
  return {
    name: f.name.trim(), slug: f.slug.trim(),
    price: parseFloat(f.price),
    salePrice: f.salePrice ? parseFloat(f.salePrice) : null,
    description: f.description.trim(), usage: f.usage.trim(),
    stock: parseInt(f.stock) || 0, category: f.category,
    benefits: f.benefits.filter(Boolean), ingredients: f.ingredients.filter(Boolean),
    images: f.images.filter(Boolean),
    isFeatured: f.isFeatured, isNewArrival: f.isNewArrival, isBestSeller: f.isBestSeller,
  };
}

// ── Product Modal ─────────────────────────────────────────────────────────
function ProductModal({
  product, onClose,
}: { product?: Product; onClose: () => void }) {
  const [form, setForm] = useState<FormData>(product ? productToForm(product) : emptyForm());
  const { data: catData } = useAdminCategories();
  const { mutateAsync: create, isPending: creating } = useCreateProduct();
  const { mutateAsync: update, isPending: updating } = useUpdateProduct();
  const isPending = creating || updating;

  const set = (field: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  // Auto-slug from name
  const handleNameChange = (v: string) => {
    set('name', v);
    if (!product) set('slug', slugify(v));
  };

  // Discount calculator — two-way: salePrice ↔ discountPercent
  const handlePriceChange = (v: string) => {
    set('price', v);
    const price = parseFloat(v);
    const disc = parseFloat(form.discountPercent);
    if (!isNaN(price) && !isNaN(disc)) {
      set('salePrice', String(Math.round(price * (1 - disc / 100))));
    }
  };

  const handleDiscountChange = (v: string) => {
    set('discountPercent', v);
    const price = parseFloat(form.price);
    const disc = parseFloat(v);
    if (!isNaN(price) && !isNaN(disc) && disc > 0 && disc < 100) {
      set('salePrice', String(Math.round(price * (1 - disc / 100))));
    } else if (!v || isNaN(disc)) {
      set('salePrice', '');
    }
  };

  const handleSalePriceChange = (v: string) => {
    set('salePrice', v);
    const price = parseFloat(form.price);
    const sale = parseFloat(v);
    if (!isNaN(price) && !isNaN(sale) && price > 0) {
      set('discountPercent', String(Math.round(((price - sale) / price) * 100)));
    } else {
      set('discountPercent', '');
    }
  };

  const handleImagesChange = (urls: string[]) => set('images', urls);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast.error('Name, price, and category are required.');
      return;
    }
    try {
      if (product) {
        await update({ id: product._id, ...formToPayload(form) });
      } else {
        await create(formToPayload(form) as never);
      }
      onClose();
    } catch { /* toast shown by hook */ }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark">
          <h2 className="font-heading text-lg font-semibold text-brown">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream">
            <X className="h-5 w-5 text-brown/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-brown mb-1.5">Product Name *</label>
              <input value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Blossom Growth Serum" className="input" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-brown mb-1.5">Slug *</label>
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
                placeholder="blossom-growth-serum" className="input font-mono text-sm" required />
            </div>
          </div>

          {/* Pricing & Discount */}
          <div>
            <p className="text-sm font-semibold text-brown mb-3">Pricing & Discount</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-brown/60 mb-1">Price (₦) *</label>
                <input type="number" value={form.price} onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="8500" min="0" className="input" required />
              </div>
              <div>
                <label className="block text-xs text-brown/60 mb-1">Discount %</label>
                <div className="relative">
                  <input type="number" value={form.discountPercent} onChange={(e) => handleDiscountChange(e.target.value)}
                    placeholder="20" min="0" max="99" className="input pr-6" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brown/40">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-brown/60 mb-1">Sale Price (₦)</label>
                <input type="number" value={form.salePrice} onChange={(e) => handleSalePriceChange(e.target.value)}
                  placeholder="Auto-calc" min="0" className="input" />
              </div>
            </div>
            {form.salePrice && form.price && (
              <p className="text-xs text-green-600 mt-1.5">
                ✓ Customer saves ₦{(parseFloat(form.price) - parseFloat(form.salePrice)).toLocaleString()}
                {form.discountPercent ? ` (${form.discountPercent}% off)` : ''}
              </p>
            )}
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">Category *</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="input" required>
                <option value="">Select category</option>
                {catData?.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">Stock Units</label>
              <input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)}
                min="0" className="input" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Description *</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={3} className="input resize-none" placeholder="Detailed product description…" required />
          </div>

          {/* Usage */}
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">How to Use</label>
            <textarea value={form.usage} onChange={(e) => set('usage', e.target.value)}
              rows={2} className="input resize-none" placeholder="Application instructions…" />
          </div>

          {/* Benefits */}
          <DynamicList label="Key Benefits" items={form.benefits}
            onChange={(v) => set('benefits', v)} placeholder="e.g. Stimulates hair growth" />

          {/* Ingredients */}
          <DynamicList label="Ingredients" items={form.ingredients}
            onChange={(v) => set('ingredients', v)} placeholder="e.g. Jamaican Black Castor Oil" />

          {/* Images */}
          <ImageUploader
            images={form.images.filter(Boolean)}
            onChange={handleImagesChange}
            folder="products"
            maxImages={6}
            label="Product Images"
          />

          {/* Visibility Toggles */}
          <div className="bg-cream rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-brown mb-2">Display Settings</p>
            {([
              ['isFeatured',   'Featured on Homepage'],
              ['isNewArrival', 'New Arrival badge'],
              ['isBestSeller', 'Best Seller badge'],
            ] as [keyof FormData, string][]).map(([field, label]) => (
              <div key={field} className="flex items-center justify-between">
                <span className="text-sm text-brown/70">{label}</span>
                <Toggle value={form[field] as boolean} onChange={(v) => set(field, v)} />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary flex-1 disabled:opacity-60">
              {isPending ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Products Page ─────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useAdminProducts({ page, limit: 15, search: search || undefined });
  const { mutateAsync: deleteProduct, isPending: deleting } = useDeleteProduct();

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  const openAdd = () => { setEditProduct(undefined); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditProduct(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditProduct(undefined); };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteProduct(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-brown font-semibold">Products</h1>
          <p className="text-brown/40 text-sm">{pagination?.total ?? 0} total products</p>
        </div>
        <button type="button" onClick={openAdd} className="btn-primary gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/40" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products…" className="input pl-10" />
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream">
                <tr>
                  {['Product', 'Category', 'Price', 'Sale Price', 'Stock', 'Flags', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brown/50 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {products.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-brown/30">No products found.</td></tr>
                )}
                {products.map((p) => {
                  const cat = typeof p.category === 'object' ? p.category : null;
                  return (
                    <tr key={p._id} className="hover:bg-cream/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0] ?? 'https://placehold.co/40x40/A8CABA/3F2A1E'}
                            alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <span className="font-medium text-brown">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-brown/60">{cat?.name ?? '—'}</td>
                      <td className="px-4 py-3 font-semibold text-brown">₦{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {p.salePrice ? (
                          <span className="text-green-600 font-semibold">
                            ₦{p.salePrice.toLocaleString()}
                            <span className="text-[10px] text-green-500 ml-1">
                              ({Math.round(((p.price - p.salePrice) / p.price) * 100)}% off)
                            </span>
                          </span>
                        ) : <span className="text-brown/30">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${p.stock <= 5 ? 'text-red-500' : 'text-brown'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {p.isFeatured && <span className="text-[9px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded-full font-semibold">Featured</span>}
                          {p.isNewArrival && <span className="text-[9px] bg-sage/20 text-sage-dark px-1.5 py-0.5 rounded-full font-semibold">New</span>}
                          {p.isBestSeller && <span className="text-[9px] bg-gold/30 text-brown px-1.5 py-0.5 rounded-full font-semibold">Best</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg hover:bg-sage/20 text-brown/40 hover:text-brown transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => setDeleteId(p._id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-brown/40 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 px-4 py-4 border-t border-cream-dark">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="btn-secondary py-1.5 px-4 text-xs disabled:opacity-40">Previous</button>
              <span className="flex items-center px-3 text-xs text-brown/50">{page} / {pagination.totalPages}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                className="btn-secondary py-1.5 px-4 text-xs disabled:opacity-40">Next</button>
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {modalOpen && <ProductModal product={editProduct} onClose={closeModal} />}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-heading text-lg text-brown mb-2">Delete Product?</h3>
            <p className="text-sm text-brown/60 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={confirmDelete} disabled={deleting}
                className="flex-1 btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
