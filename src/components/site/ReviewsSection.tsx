"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Send, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Review {
  id: string; name: string; rating: number; comment: string; source: string; createdAt: string;
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!form.name.trim() || !form.comment.trim()) { toast.error("Name and comment are required"); return; }
    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Review submitted! It will appear after approval.");
      setShowForm(false);
      setForm({ name: "", email: "", rating: 5, comment: "" });
    } else {
      toast.error("Failed to submit");
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;
  const displayReviews = reviews.slice(index, index + 3);

  if (loading) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="px-4 md:px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-btl-red/40" />
          <MessageSquare className="h-5 w-5 text-btl-red" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">What Viewers Say</h2>
          <div className="h-px w-12 bg-btl-red/40" />
        </div>

        {reviews.length > 0 && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-5 w-5 ${s <= Math.round(avgRating) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{avgRating.toFixed(1)} avg · {reviews.length} reviews</p>
          </div>
        )}

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayReviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-btl-card/80 border-btl-card-border h-full">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-4">&ldquo;{r.comment}&rdquo;</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{r.name}</span>
                      <span className="text-[10px] text-gray-500">{r.source === "google" ? "Google" : new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" disabled={index + 3 >= reviews.length} onClick={() => setIndex(Math.min(index + 1, reviews.length - 3))}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="bg-btl-red hover:bg-btl-red-dark text-white font-semibold min-h-[44px]">
              <Star className="h-4 w-4 mr-2 fill-current" /> Write a Review
            </Button>
          ) : (
            <Card className="w-full max-w-lg bg-btl-card/80 border-btl-card-border">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Share Your Experience</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="col-span-2 sm:col-span-1 bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
                  <input placeholder="Email (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="col-span-2 sm:col-span-1 bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 h-10 focus:outline-none focus:border-btl-red/50" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setForm({ ...form, rating: s })}>
                      <Star className={`h-5 w-5 cursor-pointer ${s <= form.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600 hover:text-gray-400"}`} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Write your review..." value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full bg-black/50 border border-white/[0.08] text-white text-sm rounded-lg px-3 py-2 h-24 focus:outline-none focus:border-btl-red/50 resize-none" />
                <div className="flex gap-2">
                  <Button onClick={submit} disabled={submitting} className="bg-btl-red hover:bg-btl-red-dark text-white text-xs font-semibold min-h-[40px]">
                    <Send className="h-3.5 w-3.5 mr-1.5" /> {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="text-xs text-muted-foreground min-h-[40px]">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <a href="https://search.google.com/local/writereview?placeid=PLACE_ID" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-white/20 text-muted-foreground hover:text-foreground min-h-[44px]">
              <ExternalLink className="h-4 w-4 mr-2" /> Review on Google
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
