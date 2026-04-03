import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap, Trophy, Flame, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

const ActivitiesPage = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activities").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const exclusiveActivities = activities?.filter((a) => a.is_exclusive);
  const regularActivities = activities?.filter((a) => !a.is_exclusive);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <Flame className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">Unforgettable Entertainment</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Activities & <span className="text-gradient">Entertainment</span>
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Unique entertainment services and attractions that make every event extraordinary.
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-4 mt-14 animate-fade-in">
            {[
              { icon: Trophy, label: "Exclusive", value: exclusiveActivities?.length || 0 },
              { icon: Zap, label: "Total Activities", value: activities?.length || 0 },
              { icon: Star, label: "Only in Kosovo", value: "✓" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm">
                <s.icon className="w-4 h-4 text-accent" />
                <span className="font-display text-xl font-bold text-primary-foreground">{s.value}</span>
                <span className="text-xs text-primary-foreground/40 uppercase tracking-wider">{s.label}</span>
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

      {/* Exclusive — Featured cards */}
      {exclusiveActivities && exclusiveActivities.length > 0 && (
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-5 py-2 rounded-full text-sm font-bold mb-6">
              <Trophy className="w-4 h-4" /> Exclusive in Kosovo
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Signature Attractions</h2>
            <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
          </div>
          <div className="space-y-8 max-w-5xl mx-auto">
            {exclusiveActivities.map((activity, idx) => (
              <div
                key={activity.id}
                className={`group flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-dramatic transition-all duration-700 border-2 border-accent/10 hover:border-accent/30`}
              >
                <div className="md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden bg-muted relative min-h-[300px]">
                  {activity.image_url ? (
                    <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/10 to-secondary/10 flex items-center justify-center">
                      <Zap className="w-20 h-20 text-accent/15" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-accent">
                      <Star className="w-3 h-3" /> Exclusive
                    </span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="font-display text-3xl font-bold text-foreground">{activity.name}</h3>
                  <p className="text-muted-foreground mt-4 leading-relaxed text-base">{activity.description}</p>
                  <div className="flex items-center gap-6 mt-8">
                    <span className="font-display text-3xl font-bold text-accent">${activity.price}</span>
                    <Link to="/booking">
                      <Button variant="accent" className="rounded-full">
                        Add to Event <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Regular Activities */}
      {regularActivities && regularActivities.length > 0 && (
        <section className="bg-primary py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }} />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-14">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">More Entertainment</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Additional Activities</h2>
              <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {regularActivities.map((activity) => (
                <div key={activity.id} className="group bg-primary-foreground/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary-foreground/10 hover:border-accent/30 transition-all duration-500">
                  <div className="aspect-[16/10] overflow-hidden bg-primary-foreground/5 relative">
                    {activity.image_url ? (
                      <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Zap className="w-12 h-12 text-accent/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-primary-foreground">{activity.name}</h3>
                    <p className="text-primary-foreground/50 text-sm mt-2 leading-relaxed line-clamp-2">{activity.description}</p>
                    <div className="flex items-center justify-between mt-5 pt-5 border-t border-primary-foreground/10">
                      <span className="font-display text-2xl font-bold text-accent">${activity.price}</span>
                      <Link to="/booking">
                        <Button variant="outline" size="sm" className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                          Book
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoading && (
        <section className="container mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-10 h-10 text-accent mx-auto mb-6 animate-float" />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Make Your Event Unforgettable
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
            Combine activities with mascots, decorations, and photo booths for the ultimate experience.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent rounded-full px-12">
              Start Planning <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
