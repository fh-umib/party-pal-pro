import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap, Trophy } from "lucide-react";
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">MD Creative</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Activities & Entertainment
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Unique entertainment services and attractions that make every event extraordinary and unforgettable.
          </p>
        </div>
      </section>

      {/* Exclusive Badge */}
      {exclusiveActivities && exclusiveActivities.length > 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Trophy className="w-4 h-4" /> Exclusive in Kosovo
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Exclusive Attractions</h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              We are the only provider in Kosovo offering these entertainment options.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {exclusiveActivities.map((activity) => (
              <div key={activity.id} className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border-2 border-accent/20 relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-accent">
                    <Star className="w-3 h-3" /> Exclusive
                  </span>
                </div>
                {activity.image_url ? (
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                    <Zap className="w-16 h-16 text-accent/20" />
                  </div>
                )}
                <div className="p-8">
                  <h3 className="font-display text-2xl font-bold text-foreground">{activity.name}</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{activity.description}</p>
                  <div className="flex items-center justify-between mt-6">
                    <p className="font-display text-2xl font-bold text-foreground">${activity.price}</p>
                    <Link to="/booking">
                      <Button variant="accent" size="sm">Add to Event</Button>
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
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Entertainment</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">More Activities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {regularActivities.map((activity) => (
                <div key={activity.id} className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border">
                  {activity.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                      <Zap className="w-10 h-10 text-muted-foreground/20" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-foreground">{activity.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{activity.description}</p>
                    <p className="font-display text-xl font-bold text-foreground mt-4">${activity.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoading && (
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-72 animate-pulse" />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Add Entertainment to Your Event
          </h2>
          <p className="text-primary-foreground/60 max-w-md mx-auto mb-8">
            Combine activities with our mascots, decorations, and photo services for the ultimate experience.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent">
              Book Activities <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
