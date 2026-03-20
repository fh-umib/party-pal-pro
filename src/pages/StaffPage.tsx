import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Star, Users, Award, Heart, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const StaffPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ratingStaff, setRatingStaff] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");

  // Get staff members (users with staff role + their profiles)
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["staff", "admin"]);
      if (error) throw error;

      if (!data || data.length === 0) return [];

      const userIds = data.map((r) => r.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);
      if (profileError) throw profileError;

      return profiles || [];
    },
  });

  // Get reviews for staff
  const { data: staffReviews } = useQuery({
    queryKey: ["staff-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .not("staff_user_id", "is", null)
        .eq("is_visible", true);
      if (error) throw error;
      return data;
    },
  });

  // Get user's completed bookings for review eligibility
  const { data: userBookings } = useQuery({
    queryKey: ["user-completed-bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("bookings")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "completed");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitReview = useMutation({
    mutationFn: async ({ staffUserId }: { staffUserId: string }) => {
      if (!user || !userBookings || userBookings.length === 0) throw new Error("No completed bookings found");
      const { error } = await supabase.from("reviews").insert({
        booking_id: userBookings[0].id,
        user_id: user.id,
        staff_user_id: staffUserId,
        rating: selectedRating,
        comment: comment || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-reviews"] });
      toast({ title: "Review submitted!", description: "Thank you for your feedback." });
      setRatingStaff(null);
      setSelectedRating(0);
      setComment("");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const getStaffStats = (userId: string) => {
    const reviews = staffReviews?.filter((r) => r.staff_user_id === userId) || [];
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    return { count, avg };
  };

  const canReview = user && userBookings && userBookings.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">MD Creative</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Our Team
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Meet the talented professionals behind every successful event. Rate and review our team after your experience.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-card rounded-lg shadow-card-hover p-8 grid grid-cols-3 max-w-2xl mx-auto gap-8 border border-border">
          <div className="text-center">
            <Users className="w-5 h-5 text-accent mx-auto mb-2" />
            <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{staffMembers?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Team Members</div>
          </div>
          <div className="text-center">
            <Star className="w-5 h-5 text-accent mx-auto mb-2" />
            <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
              {staffReviews && staffReviews.length > 0
                ? (staffReviews.reduce((s, r) => s + r.rating, 0) / staffReviews.length).toFixed(1)
                : "—"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Average Rating</div>
          </div>
          <div className="text-center">
            <Award className="w-5 h-5 text-accent mx-auto mb-2" />
            <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{staffReviews?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Reviews</div>
          </div>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Meet The Team</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Professionals</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Each member brings expertise and passion to make your event exceptional.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : staffMembers && staffMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {staffMembers.map((staff) => {
              const stats = getStaffStats(staff.user_id);
              const isRating = ratingStaff === staff.user_id;

              return (
                <div key={staff.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border group">
                  {/* Avatar */}
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center relative overflow-hidden">
                    {staff.avatar_url ? (
                      <img src={staff.avatar_url} alt={staff.full_name || "Staff"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="font-display text-4xl font-bold text-accent">
                          {(staff.full_name || "S").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {staff.full_name || "Team Member"}
                    </h3>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= Math.round(stats.avg) ? "text-accent fill-accent" : "text-border"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stats.avg > 0 ? stats.avg.toFixed(1) : "—"} ({stats.count})
                      </span>
                    </div>

                    {/* Rate Button or Form */}
                    {canReview && !isRating && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        onClick={() => { setRatingStaff(staff.user_id); setSelectedRating(0); setComment(""); }}
                      >
                        <Heart className="w-4 h-4" /> Rate This Member
                      </Button>
                    )}

                    {isRating && (
                      <div className="mt-4 space-y-3 border-t border-border pt-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Rating</p>
                        <div className="flex gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              onMouseEnter={() => setHoverRating(s)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setSelectedRating(s)}
                              className="p-1 transition-transform hover:scale-110 active:scale-95"
                            >
                              <Star
                                className={`w-7 h-7 transition-colors ${
                                  s <= (hoverRating || selectedRating) ? "text-accent fill-accent" : "text-border"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Leave a comment (optional)..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="accent"
                            size="sm"
                            className="flex-1"
                            disabled={selectedRating === 0 || submitReview.isPending}
                            onClick={() => submitReview.mutate({ staffUserId: staff.user_id })}
                          >
                            <Send className="w-3 h-3" />
                            {submitReview.isPending ? "Sending..." : "Submit"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setRatingStaff(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-foreground">Team Coming Soon</h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Our team profiles will appear here shortly.
            </p>
          </div>
        )}
      </section>

      {/* Recent Staff Reviews */}
      {staffReviews && staffReviews.length > 0 && (
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Testimonials</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Clients Say About Us</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {staffReviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-card rounded-lg p-6 shadow-card border border-border">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent fill-accent" : "text-border"}`} />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-foreground text-sm leading-relaxed italic">"{review.comment}"</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-3">
              Want to rate our team?
            </h3>
            <p className="text-primary-foreground/60 mb-6">Sign in and complete a booking to leave a review for our staff.</p>
            <a href="/login">
              <Button variant="accent" size="lg">Sign In to Review</Button>
            </a>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default StaffPage;
