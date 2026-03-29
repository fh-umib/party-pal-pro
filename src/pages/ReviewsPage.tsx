import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, MessageSquare, Quote, TrendingUp, Users, Award } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px] -translate-x-1/2" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">Client Testimonials</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Client <span className="text-gradient">Reviews</span>
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Hear from our clients about their experiences with MD Creative event services.
            </p>
          </div>

          {/* Stats */}
          {reviews && reviews.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-14 animate-fade-in">
              {[
                { icon: Star, label: "Average", value: averageRating },
                { icon: Users, label: "Total Reviews", value: reviews.length },
                { icon: Award, label: "5-Star", value: reviews.filter((r) => r.rating === 5).length },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm">
                  <s.icon className="w-4 h-4 text-accent" />
                  <span className="font-display text-xl font-bold text-primary-foreground">{s.value}</span>
                  <span className="text-xs text-primary-foreground/40 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        {/* Rating Distribution */}
        {reviews && reviews.length > 0 && (
          <div className="bg-card rounded-2xl shadow-card border border-border p-8 md:p-10 max-w-3xl mx-auto mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="text-center">
                <p className="font-display text-7xl font-bold text-foreground">{averageRating}</p>
                <div className="flex items-center justify-center gap-1 mt-3 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-6 h-6 ${s <= Math.round(Number(averageRating)) ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on <span className="font-bold text-foreground">{reviews.length}</span> review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="space-y-3">
                {ratingDistribution.map((dist) => (
                  <div key={dist.star} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-foreground w-6">{dist.star}</span>
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-accent rounded-full transition-all duration-1000" style={{ width: `${dist.percentage}%` }} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground w-8 text-right">{dist.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews — Masonry */}
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`bg-muted rounded-2xl animate-pulse mb-6 ${i % 3 === 0 ? "h-48" : "h-36"}`} />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-2xl p-7 shadow-card border border-border hover:shadow-card-hover hover:border-accent/15 transition-all duration-500 mb-6 break-inside-avoid group">
                <Quote className="w-6 h-6 text-accent/20 mb-4 group-hover:text-accent/40 transition-colors" />
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
                {review.comment ? (
                  <p className="text-foreground text-sm leading-relaxed">"{review.comment}"</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">Rated {review.rating} stars</p>
                )}
                <div className="mt-5 pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">No Reviews Yet</h2>
            <p className="text-muted-foreground mt-3 max-w-sm mx-auto">Client reviews will appear here after events are completed.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
