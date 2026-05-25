import { useState } from 'react';
import { Check, X, Trash2, Star, MessageSquare } from 'lucide-react';
import {
  useAdminReviews,
  useUpdateReview,
  useDeleteReview,
  AdminReview,
} from '@/hooks/admin/useAdminReviews';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-gold text-gold' : 'text-brown/20'}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, tab }: { review: AdminReview; tab: 'pending' | 'approved' }) {
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  const busy = isUpdating || isDeleting;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex gap-4">
        {/* Product image */}
        <img
          src={review.product.images[0] ?? 'https://placehold.co/48x48/A8CABA/3F2A1E'}
          alt={review.product.name}
          className="w-12 h-12 rounded-xl object-cover shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/A8CABA/3F2A1E';
          }}
        />

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
            <div>
              <p className="text-[10px] font-semibold text-brown/40 uppercase tracking-wider">
                {review.product.name}
              </p>
              <p className="font-semibold text-brown mt-0.5">{review.author}</p>
              <p className="text-xs text-brown/40">{review.email}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StarRating rating={review.rating} />
              <span className="text-xs text-brown/40">
                {new Date(review.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Review content */}
          {review.title && (
            <p className="text-sm font-semibold text-brown mb-1">{review.title}</p>
          )}
          <p className="text-sm text-brown/70 leading-relaxed">{review.body}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-cream-dark">
        {tab === 'pending' ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => updateReview({ id: review._id, isApproved: true })}
              className="flex items-center gap-1.5 text-sm px-3.5 py-1.5 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Approve
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => deleteReview(review._id)}
              className="flex items-center gap-1.5 text-sm px-3.5 py-1.5 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Reject & Delete
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => updateReview({ id: review._id, isApproved: false })}
              className="flex items-center gap-1.5 text-sm px-3.5 py-1.5 bg-yellow-100 text-yellow-700 rounded-xl font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              Unapprove
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => deleteReview(review._id)}
              className="flex items-center gap-1.5 text-sm px-3.5 py-1.5 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const { data: reviews = [], isLoading } = useAdminReviews(tab === 'approved');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl text-brown font-semibold">Reviews</h1>
        <p className="text-brown/40 text-sm mt-1">
          Moderate customer reviews before they appear on product pages.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5">
        {(['pending', 'approved'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-brown text-cream'
                : 'bg-white text-brown/60 hover:text-brown border border-cream-dark'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
          <MessageSquare className="h-10 w-10 mx-auto text-brown/20 mb-3" />
          <p className="text-brown/30 text-sm">No {tab} reviews.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} tab={tab} />
          ))}
        </div>
      )}
    </div>
  );
}
