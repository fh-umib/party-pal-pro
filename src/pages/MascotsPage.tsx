import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Wand2, Sparkles, Star } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <Wand2 className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">50+ Characters Available</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Mascot <span className="text-gradient">Characters</span>
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Bring magic and excitement to your celebration with our beloved character collection.
            </p>

            {/* Search */}
            <div className="mt-10 max-w-lg mx-auto animate-fade-in">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
                <Input
                  placeholder="Search characters by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-primary-foreground/5 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 focus:border-accent/40 rounded-full text-base"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="container mx-auto px-4 py-16">
        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as string)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-card-hover"
                  : "bg-card text-muted-foreground border border-border hover:border-accent/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground mb-8 text-center">
          Showing <span className="font-bold text-foreground">{filtered?.length || 0}</span> characters
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-[3/4] bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {filtered?.map((mascot) => (
              <div
                key={mascot.id}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-dramatic transition-all duration-500 border border-border hover:border-accent/20"
              >
                <div className="relative overflow-hidden bg-muted aspect-[3/4]">
                  {mascot.image_url ? (
                    <img
                      src={mascot.image_url}
                      alt={mascot.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/5 to-secondary/5 flex items-center justify-center">
                      <span className="font-display text-6xl font-bold text-accent/20">{mascot.name.charAt(0)}</span>
                    </div>
                  )}
                  {mascot.category && (
                    <span className="absolute top-3 left-3 bg-foreground/60 backdrop-blur-md text-background text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {mascot.category}
                    </span>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <Link to="/booking" className="w-full">
                      <Button variant="accent" size="sm" className="w-full rounded-full shadow-accent">
                        <Star className="w-3 h-3" /> Add to Event
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-foreground truncate">{mascot.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{mascot.description}</p>
                  {mascot.price > 0 && (
                    <p className="font-display text-lg font-bold text-accent mt-2">${mascot.price}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered?.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="font-display text-xl font-bold text-foreground">No characters found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="container mx-auto px-4 text-center relative">
          <Wand2 className="w-10 h-10 text-accent mx-auto mb-6 animate-float" />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Found Your Favorites?
          </h2>
          <p className="text-primary-foreground/50 max-w-md mx-auto mb-10 text-lg">
            Add mascot characters to your booking for an unforgettable celebration.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent rounded-full px-12">
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
