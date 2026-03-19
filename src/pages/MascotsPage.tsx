import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const MascotsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: mascots, isLoading } = useQuery({
    queryKey: ["mascots-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mascots").select("*").eq("is_available", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const categories = ["All", ...new Set(mascots?.map((m) => m.category).filter(Boolean) || [])];
  const filtered = activeCategory === "All" ? mascots : mascots?.filter((m) => m.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Mascot Characters</h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">Browse our collection of mascot characters available for your event.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat as string)}>
              {cat}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg aspect-square animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filtered?.map((mascot) => (
              <div key={mascot.id} className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
                <div className="relative overflow-hidden bg-muted aspect-square">
                  {mascot.image_url ? (
                    <img src={mascot.image_url} alt={mascot.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-5xl font-bold text-muted-foreground">
                      {mascot.name.charAt(0)}
                    </div>
                  )}
                  {mascot.category && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-md">{mascot.category}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold text-foreground">{mascot.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{mascot.description}</p>
                  {mascot.price > 0 && <p className="font-display text-lg font-bold text-foreground mt-2">${mascot.price}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered?.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No characters found in this category.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MascotsPage;
