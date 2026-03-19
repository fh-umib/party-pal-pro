import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

const DecorationsPage = () => {
  const { data: categories } = useQuery({
    queryKey: ["decoration-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("decoration_categories").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: furniture } = useQuery({
    queryKey: ["event-furniture"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_furniture").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Decorations</h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">Elegant and professional decoration services for every occasion.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Event Decorations</h2>
          <p className="mt-2 text-muted-foreground">Choose from our range of tailored decoration services.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {categories?.map((cat) => (
            <div key={cat.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
              {cat.image_url && (
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-foreground">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{cat.description}</p>
                {cat.event_type && (
                  <span className="inline-block mt-3 text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md">
                    {cat.event_type.replace("_", " ")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Event Furniture & Setup</h2>
            <p className="mt-2 text-muted-foreground">Premium chairs, tables, and covers for a polished presentation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {furniture?.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-6 shadow-card border border-border">
                <h3 className="font-display text-lg font-bold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                <p className="font-display text-lg font-bold text-foreground mt-2">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Include Decorations in Your Event</h2>
        <Link to="/booking">
          <Button variant="accent" size="lg">Book Now <ArrowRight className="w-4 h-4" /></Button>
        </Link>
      </section>
      <Footer />
    </div>
  );
};

export default DecorationsPage;
