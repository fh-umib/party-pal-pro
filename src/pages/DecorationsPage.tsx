import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Crown, Heart, PartyPopper, Building2, Gem, Palette } from "lucide-react";
import Footer from "@/components/Footer";

const eventTypeConfig: Record<string, { icon: any; gradient: string }> = {
  wedding: { icon: Crown, gradient: "from-accent/20 to-secondary/10" },
  engagement: { icon: Heart, gradient: "from-accent/15 to-accent/5" },
  birthday: { icon: PartyPopper, gradient: "from-secondary/20 to-accent/10" },
  anniversary: { icon: Sparkles, gradient: "from-accent/10 to-secondary/15" },
  grand_opening: { icon: Building2, gradient: "from-secondary/15 to-accent/5" },
};

const DecorationsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCats } = useQuery({
    queryKey: ["decoration-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("decoration_categories").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: themes } = useQuery({
    queryKey: ["decoration-themes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("decoration_themes").select("*, decoration_categories(name, event_type)").eq("is_available", true).order("name");
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

  const eventTypes = [...new Set(categories?.map((c) => c.event_type).filter(Boolean) || [])];
  const filteredThemes = selectedEvent
    ? themes?.filter((t: any) => t.decoration_categories?.event_type === selectedEvent)
    : themes;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — Cinematic split */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] -translate-y-1/4 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[80px] translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <Palette className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">Bespoke Event Design</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Decorations & <span className="text-gradient">Styling</span>
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Transform any venue into a breathtaking experience with our bespoke decoration services, tailored to your event style.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Event Type Selector — Interactive cards */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Step 1</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Choose Your Occasion</h2>
          <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto mb-16">
          <button
            onClick={() => setSelectedEvent(null)}
            className={`group relative p-5 rounded-xl border-2 transition-all duration-300 text-center ${
              selectedEvent === null
                ? "border-accent bg-accent/5 shadow-accent"
                : "border-border bg-card hover:border-accent/30 hover:shadow-card-hover"
            }`}
          >
            <Sparkles className={`w-7 h-7 mx-auto mb-3 transition-colors ${selectedEvent === null ? "text-accent" : "text-muted-foreground group-hover:text-accent"}`} />
            <span className={`font-display text-sm font-bold ${selectedEvent === null ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>All Events</span>
          </button>
          {eventTypes.map((type) => {
            const config = eventTypeConfig[type as string] || { icon: Sparkles, gradient: "from-accent/10 to-transparent" };
            const Icon = config.icon;
            const isActive = selectedEvent === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedEvent(type as string)}
                className={`group relative p-5 rounded-xl border-2 transition-all duration-300 text-center ${
                  isActive
                    ? "border-accent bg-accent/5 shadow-accent"
                    : "border-border bg-card hover:border-accent/30 hover:shadow-card-hover"
                }`}
              >
                <Icon className={`w-7 h-7 mx-auto mb-3 transition-colors ${isActive ? "text-accent" : "text-muted-foreground group-hover:text-accent"}`} />
                <span className={`font-display text-sm font-bold capitalize ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {(type as string).replace("_", " ")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Categories — Magazine layout */}
        {loadingCats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {(selectedEvent ? categories?.filter((c) => c.event_type === selectedEvent) : categories)?.map((cat, idx) => (
              <div
                key={cat.id}
                className={`group flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-0 bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-dramatic transition-all duration-700 border border-border mb-8`}
              >
                <div className="md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden bg-muted relative">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${eventTypeConfig[cat.event_type as string]?.gradient || "from-muted to-muted"} flex items-center justify-center`}>
                      <Gem className="w-16 h-16 text-accent/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  {cat.event_type && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent/10 text-accent px-3 py-1.5 rounded-full w-fit mb-4 capitalize">
                      {(cat.event_type as string).replace("_", " ")}
                    </span>
                  )}
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">{cat.name}</h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{cat.description}</p>
                  <Link to="/booking" className="mt-6 inline-flex">
                    <Button variant="accent" size="sm" className="rounded-full">
                      Book This Style <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Themes — Masonry-style grid */}
      {filteredThemes && filteredThemes.length > 0 && (
        <section className="bg-primary py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-14">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Step 2</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Available Themes</h2>
              <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filteredThemes.map((theme: any, idx: number) => (
                <div
                  key={theme.id}
                  className={`group bg-primary-foreground/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary-foreground/10 hover:border-accent/30 transition-all duration-500 ${idx === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}
                >
                  <div className={`${idx === 0 ? "aspect-[16/12]" : "aspect-[4/3]"} overflow-hidden bg-primary-foreground/5 relative`}>
                    {theme.image_url ? (
                      <img src={theme.image_url} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-accent/20" />
                      </div>
                    )}
                    {theme.theme && (
                      <span className="absolute top-4 left-4 text-xs font-bold bg-foreground/60 backdrop-blur-md text-background px-3 py-1.5 rounded-full capitalize">{theme.theme}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-lg font-bold text-primary-foreground">{theme.name}</h3>
                        <p className="text-primary-foreground/50 text-sm mt-1 line-clamp-2">{theme.description}</p>
                      </div>
                      <span className="font-display text-2xl font-bold text-accent ml-4 whitespace-nowrap">${theme.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Furniture — Horizontal scroll feel */}
      {furniture && furniture.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Premium Setup</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Event Furniture & Covers</h2>
              <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {furniture.map((item) => (
                <div key={item.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-accent/20">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/5 to-secondary/5 flex items-center justify-center">
                        <Gem className="w-8 h-8 text-accent/30" />
                      </div>
                    )}
                    {item.cover_color && (
                      <span className="absolute bottom-3 left-3 text-xs font-medium bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full capitalize text-foreground">{item.cover_color}</span>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-display text-sm font-bold text-foreground">{item.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="font-display text-lg font-bold text-foreground">${item.price}</span>
                      {item.quantity_available !== null && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{item.quantity_available} left</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="container mx-auto px-4 text-center relative">
          <Gem className="w-10 h-10 text-accent mx-auto mb-6 animate-float" />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Venue?
          </h2>
          <p className="text-primary-foreground/50 max-w-md mx-auto mb-10 text-lg">
            Combine decorations with our mascots, activities, and photo services for a complete experience.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent rounded-full px-12">
              Book Decorations <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DecorationsPage;
