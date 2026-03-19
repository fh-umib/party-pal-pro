import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, MessageSquare } from "lucide-react";

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

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Testimonials</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Client Reviews</h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">
            See what our clients say about their experiences with MD Creative.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {/* Stats */}
        {reviews && reviews.length > 0 && (
          <div className="bg-card rounded-lg shadow-card border border-border p-8 max-w-md mx-auto mb-12 text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-6 h-6 ${s <= Math.round(Number(averageRating)) ? "text-accent fill-accent" : "text-border"}`} />
              ))}
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{averageRating}</p>
            <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-40 animate-pulse" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-lg p-6 shadow-card border border-border hover:shadow-card-hover transition-all duration-300">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-foreground text-sm leading-relaxed">"{review.comment}"</p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground">No Reviews Yet</h2>
            <p className="text-muted-foreground mt-2">Client reviews will appear here after events are completed.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReviewsPage;
