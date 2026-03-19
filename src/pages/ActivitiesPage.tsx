import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Footer from "@/components/Footer";

const ActivitiesPage = () => {
  const { data: activities } = useQuery({
    queryKey: ["activities-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activities").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Activities & Entertainment</h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">Unique entertainment services to make every event extraordinary.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {activities?.map((activity) => (
            <div key={activity.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border relative">
              {activity.image_url && (
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-6">
                {activity.is_exclusive && (
                  <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    <Star className="w-3 h-3" /> Exclusive in Kosovo
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-foreground">{activity.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                <p className="font-display text-lg font-bold text-foreground mt-3">${activity.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 bg-muted rounded-lg p-8 max-w-2xl mx-auto">
          <Star className="w-6 h-6 text-accent mx-auto mb-3" />
          <p className="font-display text-lg font-bold text-foreground">
            We are the only provider in Kosovo offering Bounce House and Ball House attractions.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Our exclusive entertainment options set us apart.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Add Activities to Your Event</h2>
        <Link to="/booking"><Button variant="accent" size="lg">Book Now <ArrowRight className="w-4 h-4" /></Button></Link>
      </section>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
