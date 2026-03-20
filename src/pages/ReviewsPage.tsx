import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, MessageSquare, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";

const ReviewsPage = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const averageRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews?.filter((r) => r.rating === star).length || 0,
    percentage: reviews?.length ? ((reviews.filter((r) => r.rating === star).length / reviews.length) * 100) : 0,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/2 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">Testimonials</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Client Reviews
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Hear from our clients about their experiences with MD Creative event services.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {/* Rating Summary */}
        {reviews && reviews.length > 0 && (
          <div className="bg-card rounded-lg shadow-card border border-border p-8 max-w-3xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center">
              <p className="font-display text-6xl font-bold text-foreground">{averageRating}</p>
              <div className="flex items-center justify-center gap-1 mt-3 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-6 h-6 ${s <= Math.round(Number(averageRating)) ? "text-accent fill-accent" : "text-border"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="space-y-2.5">
              {ratingDistribution.map((dist) => (
                <div key={dist.star} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-6">{dist.star}★</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-700"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{dist.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-44 animate-pulse" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent fill-accent" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-foreground text-sm leading-relaxed italic">"{review.comment}"</p>
                )}
                {!review.comment && (
                  <p className="text-muted-foreground text-sm italic">★ {review.rating}-star rating</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-foreground">No Reviews Yet</h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Client reviews will appear here after events are completed.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
