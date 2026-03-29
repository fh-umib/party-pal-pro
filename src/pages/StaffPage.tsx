import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Star, Users, Award, Heart, Send, Quote, ChevronRight, Sparkles } from "lucide-react";
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

  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id").in("role", ["staff", "admin"]);
      if (error) throw error;
      if (!data || data.length === 0) return [];
      const { data: profiles, error: pErr } = await supabase.from("profiles").select("*").in("user_id", data.map((r) => r.user_id));
      if (pErr) throw pErr;
      return profiles || [];
    },
  });

  const { data: staffReviews } = useQuery({
    queryKey: ["staff-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").not("staff_user_id", "is", null).eq("is_visible", true);
      if (error) throw error;
      return data;
    },
  });

  const { data: userBookings } = useQuery({
    queryKey: ["user-completed-bookings", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("bookings").select("id").eq("user_id", user.id).eq("status", "completed");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const submitReview = useMutation({
    mutationFn: async ({ staffUserId }: { staffUserId: string }) => {
      if (!user || !userBookings || userBookings.length === 0) throw new Error("No completed bookings");
      const { error } = await supabase.from("reviews").insert({
        booking_id: userBookings[0].id, user_id: user.id, staff_user_id: staffUserId, rating: selectedRating, comment: comment || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-reviews"] });
      toast({ title: "Review submitted!", description: "Thank you for your feedback." });
      setRatingStaff(null); setSelectedRating(0); setComment("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const getStaffStats = (userId: string) => {
    const r = staffReviews?.filter((x) => x.staff_user_id === userId) || [];
    return { count: r.length, avg: r.length > 0 ? r.reduce((s, x) => s + x.rating, 0) / r.length : 0 };
  };

  const canReview = user && userBookings && userBookings.length > 0;
  const totalReviews = staffReviews?.length || 0;
  const avgRating = totalReviews > 0 ? (staffReviews!.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : null;
  const roles = ["Event Coordinator", "Lead Decorator", "Entertainment Director", "Photography Lead", "Mascot Performer", "Creative Director"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] translate-y-1/2 -translate-x-1/3" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">The People Behind The Magic</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Meet Our <span className="text-gradient">Talented</span> Team
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Every unforgettable event starts with exceptional people.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-14 animate-fade-in">
            {[
              { icon: Users, label: "Team Members", value: staffMembers?.length || 0 },
              { icon: Star, label: "Avg Rating", value: avgRating || "—" },
              { icon: Award, label: "Total Reviews", value: totalReviews },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm">
                <stat.icon className="w-4 h-4 text-accent" />
                <span className="font-display text-xl font-bold text-primary-foreground">{stat.value}</span>
                <span className="text-xs text-primary-foreground/40 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Our Professionals</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Experts In Every Detail</h2>
          <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"><div className="aspect-[3/4] bg-muted animate-pulse" /></div>
            ))}
          </div>
        ) : staffMembers && staffMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {staffMembers.map((staff, idx) => {
              const stats = getStaffStats(staff.user_id);
              const isRating = ratingStaff === staff.user_id;
              const role = roles[idx % roles.length];

              return (
                <div key={staff.id} className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-dramatic">
                  <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                    {staff.avatar_url ? (
                      <img src={staff.avatar_url} alt={staff.full_name || "Staff"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/90 to-primary flex items-center justify-center relative">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 30% 50%, hsl(var(--accent)) 0%, transparent 50%)` }} />
                        <span className="font-display text-7xl font-bold text-accent/80">{(staff.full_name || "S").charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      {canReview && !isRating && (
                        <Button variant="accent" size="sm" className="w-full rounded-full" onClick={(e) => { e.stopPropagation(); setRatingStaff(staff.user_id); setSelectedRating(0); setComment(""); }}>
                          <Heart className="w-4 h-4" /> Rate This Member
                        </Button>
                      )}
                    </div>
                    {stats.avg > 0 && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground/60 backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                        <span className="text-xs font-bold text-background">{stats.avg.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-accent text-[11px] font-semibold tracking-widest uppercase mb-1">{role}</p>
                    <h3 className="font-display text-xl font-bold text-foreground">{staff.full_name || "Team Member"}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(stats.avg) ? "text-accent fill-accent" : "text-border"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({stats.count})</span>
                    </div>
                    {isRating && (
                      <div className="mt-4 space-y-3 border-t border-border pt-4 animate-fade-in">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Rating</p>
                        <div className="flex gap-1 justify-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setSelectedRating(s)} className="p-1 transition-transform hover:scale-125 active:scale-95">
                              <Star className={`w-7 h-7 transition-colors ${s <= (hoverRating || selectedRating) ? "text-accent fill-accent" : "text-border"}`} />
                            </button>
                          ))}
                        </div>
                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none resize-none" />
                        <div className="flex gap-2">
                          <Button variant="accent" size="sm" className="flex-1 rounded-full" disabled={selectedRating === 0 || submitReview.isPending} onClick={() => submitReview.mutate({ staffUserId: staff.user_id })}>
                            <Send className="w-3 h-3" /> {submitReview.isPending ? "Sending..." : "Submit"}
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setRatingStaff(null)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Team Coming Soon</h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">Our team profiles are being prepared. Check back soon.</p>
          </div>
        )}
      </section>

      {/* Testimonials */}
      {staffReviews && staffReviews.length > 0 && (
        <section className="bg-primary py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-14">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Client Feedback</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">What People Say</h2>
              <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 max-w-5xl mx-auto">
              {staffReviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/10 hover:border-accent/30 transition-all duration-500 group mb-6 break-inside-avoid">
                  <Quote className="w-7 h-7 text-accent/20 mb-4 group-hover:text-accent/40 transition-colors" />
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent fill-accent" : "text-primary-foreground/20"}`} />
                    ))}
                  </div>
                  {review.comment ? (
                    <p className="text-primary-foreground/70 text-sm leading-relaxed">"{review.comment}"</p>
                  ) : (
                    <p className="text-primary-foreground/40 text-sm italic">No comment provided</p>
                  )}
                  <div className="mt-5 pt-4 border-t border-primary-foreground/10">
                    <p className="text-xs text-primary-foreground/30">{new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {!user && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-card rounded-2xl p-12 md:p-16 border border-border shadow-dramatic relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
              <div className="relative">
                <Sparkles className="w-10 h-10 text-accent mx-auto mb-6 animate-float" />
                <h3 className="font-display text-3xl font-bold text-foreground mb-3">Want to Rate Our Team?</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Sign in and complete a booking to share your experience.
                </p>
                <a href="/login">
                  <Button variant="accent" size="lg" className="rounded-full px-10">
                    Sign In to Review <ChevronRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default StaffPage;
