import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";

const MascotsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mascots, isLoading } = useQuery({
    queryKey: ["mascots-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mascots").select("*").eq("is_available", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const categories = ["All", ...new Set(mascots?.map((m) => m.category).filter(Boolean) || [])];
  
  const filtered = mascots?.filter((m) => {
    const matchesCategory = activeCategory === "All" || m.category === activeCategory;
    const matchesSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">MD Creative</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Mascot Characters
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Over 50 unique characters available to bring magic and excitement to your celebration.
          </p>
          <div className="mt-8 flex items-center justify-center animate-fade-in">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-card/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:bg-card/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat as string)}
                className="whitespace-nowrap"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold text-foreground">{filtered?.length || 0}</span> characters
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered?.map((mascot, index) => (
              <div
                key={mascot.id}
                className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="relative overflow-hidden bg-muted aspect-square">
                  {mascot.image_url ? (
                    <img
                      src={mascot.image_url}
                      alt={mascot.name}
                      className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-display text-6xl font-bold text-muted-foreground/20">
                        {mascot.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {mascot.category && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                      {mascot.category}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <Link to={`/booking`} className="w-full">
                      <Button variant="accent" size="sm" className="w-full shadow-accent">
                        Add to Booking
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground">{mascot.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{mascot.description}</p>
                  {mascot.price > 0 && (
                    <p className="font-display text-xl font-bold text-foreground mt-3">${mascot.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered?.length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-xl font-bold text-foreground">No characters found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Found Your Favorites?
          </h2>
          <p className="text-primary-foreground/60 max-w-md mx-auto mb-8">
            Add mascot characters to your booking and create an unforgettable experience.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent">
              Book Characters <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MascotsPage;
