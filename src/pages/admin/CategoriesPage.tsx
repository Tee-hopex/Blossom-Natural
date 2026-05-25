import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/admin/useAdminCategories';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ImageUploader from '@/components/admin/ImageUploader';
import { Category } from '@/types';

interface CategoryForm {
  name: string;
  description: string;
  image: string;
}

const emptyForm: CategoryForm = { name: '', description: '', image: '' };

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function CategoryModal({
  editTarget,
  form,
  setForm,
  onClose,
  onSave,
  isSaving,
}: {
  editTarget: Category | null;
  form: CategoryForm;
  setForm: React.Dispatch<React.SetStateAction<CategoryForm>>;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="font-heading text-lg font-semibold text-brown mb-5">
          {editTarget ? 'Edit Category' : 'New Category'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Hair Oils"
              className="input"
              autoFocus
            />
            {form.name && (
              <p className="text-xs text-brown/40 mt-1">Slug: /{slugify(form.name)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Short description of this category…"
              rows={3}
              className="input resize-none"
            />
          </div>

          <ImageUploader
            images={form.image ? [form.image] : []}
            onChange={(urls) => setForm((f) => ({ ...f, image: urls[0] ?? '' }))}
            folder="categories"
            maxImages={1}
            label="Category Image"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="btn flex-1">
            Cancel
          </button>
          <button
            type="button"
            disabled={!form.name.trim() || isSaving}
            onClick={onSave}
            className="btn-primary flex-1 disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({ name: cat.name, description: cat.description ?? '', image: cat.image ?? '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form, slug: slugify(form.name) };
    if (editTarget) {
      await updateCategory({ id: editTarget._id, ...payload });
    } else {
      await createCategory(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-brown font-semibold">Categories</h1>
          <p className="text-brown/40 text-sm mt-1">{categories.length} categories</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <Tag className="h-10 w-10 mx-auto text-brown/20 mb-3" />
          <p className="text-brown/30 text-sm">No categories yet. Create your first one.</p>
          <button type="button" onClick={openCreate} className="btn-primary mt-4">
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-start">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-sage/20 flex items-center justify-center shrink-0">
                  <Tag className="h-6 w-6 text-sage" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brown">{cat.name}</p>
                <p className="text-xs text-brown/40 mt-0.5 font-mono">/{cat.slug}</p>
                {cat.description && (
                  <p className="text-sm text-brown/50 mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="p-1.5 text-brown/40 hover:text-brown hover:bg-cream rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(cat)}
                  className="p-1.5 text-brown/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      {modalOpen && (
        <CategoryModal
          editTarget={editTarget}
          form={form}
          setForm={setForm}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          isSaving={isCreating || isUpdating}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-heading text-lg text-brown font-semibold mb-2">
              Delete "{deleteTarget.name}"?
            </h3>
            <p className="text-sm text-brown/50 mb-6">
              Products in this category won't be deleted, but their category reference will be removed.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="btn flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCategory(deleteTarget._id);
                  setDeleteTarget(null);
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
