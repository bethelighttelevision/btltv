"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string; name: string; email: string | null; rating: number;
  comment: string; source: string; isApproved: boolean; createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    const res = await fetch("/api/admin/reviews");
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const approve = async (id: string) => {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: true }) });
    if (res.ok) { toast.success("Review approved"); fetchReviews(); } else toast.error("Failed");
  };

  const reject = async (id: string) => {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: false }) });
    if (res.ok) { toast.success("Review rejected"); fetchReviews(); } else toast.error("Failed");
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); fetchReviews(); } else toast.error("Failed");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-btl-red" /></div>;

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Reviews</h1>
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-yellow-400 mb-3">Pending Approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((r) => <ReviewCard key={r.id} review={r} onApprove={approve} onReject={reject} onDelete={deleteReview} />)}
          </div>
        </div>
      )}
      <div>
        <h2 className="text-sm font-semibold text-green-400 mb-3">Approved ({approved.length})</h2>
        <div className="space-y-3">
          {approved.map((r) => <ReviewCard key={r.id} review={r} onApprove={approve} onReject={reject} onDelete={deleteReview} />)}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review, onApprove, onReject, onDelete }: { review: Review; onApprove: (id: string) => void; onReject: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="bg-black/40 border border-white/[0.06] rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{review.name}</span>
            <span className="text-[10px] text-gray-500">{review.source === "google" ? "Google" : "Site"}</span>
            <span className="text-[10px] text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-3 w-3 ${s <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">{review.comment}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!review.isApproved && (
            <button onClick={() => onApprove(review.id)} className="h-8 w-8 rounded-lg bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center" title="Approve">
              <Check className="h-4 w-4 text-green-400" />
            </button>
          )}
          {review.isApproved && (
            <button onClick={() => onReject(review.id)} className="h-8 w-8 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 flex items-center justify-center" title="Reject">
              <X className="h-4 w-4 text-yellow-400" />
            </button>
          )}
          <button onClick={() => onDelete(review.id)} className="h-8 w-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center" title="Delete">
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
