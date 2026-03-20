import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Crown, Heart, PartyPopper, Building2 } from "lucide-react";
import Footer from "@/components/Footer";

const eventTypeIcons: Record<string, any> = {
  wedding: Crown,
  engagement: Heart,
  birthday: PartyPopper,
  anniversary: Sparkles,
  grand_opening: Building2,
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">MD Creative</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Decorations & Styling
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Transform any venue into a breathtaking experience with our bespoke decoration services, tailored to your event style.
          </p>
        </div>
      </section>

      {/* Event Type Selection */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Step 1</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Choose Your Event Type</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Each event type features unique decoration themes curated for the occasion.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedEvent === null ? "default" : "outline"}
            size="lg"
            onClick={() => setSelectedEvent(null)}
          >
            All Events
          </Button>
          {eventTypes.map((type) => {
            const Icon = eventTypeIcons[type as string] || Sparkles;
            return (
              <Button
                key={type}
                variant={selectedEvent === type ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedEvent(type as string)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {(type as string).replace("_", " ").replace(/^\w/, (c: string) => c.toUpperCase())}
              </Button>
            );
          })}
        </div>

        {/* Categories Grid */}
        {loadingCats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(selectedEvent
              ? categories?.filter((c) => c.event_type === selectedEvent)
              : categories
            )?.map((cat) => (
              <div
                key={cat.id}
                className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border"
              >
                {cat.image_url ? (
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{cat.description}</p>
                  {cat.event_type && (
                    <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold bg-accent/10 text-accent px-3 py-1.5 rounded-full">
                      {(cat.event_type as string).replace("_", " ").replace(/^\w/, (c: string) => c.toUpperCase())}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Themes */}
      {filteredThemes && filteredThemes.length > 0 && (
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Step 2</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Available Themes</h2>
              <p className="mt-3 text-muted-foreground">Select from our curated decoration themes.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {filteredThemes.map((theme: any) => (
                <div key={theme.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border group">
                  {theme.image_url ? (
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img src={theme.image_url} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-lg font-bold text-foreground">{theme.name}</h3>
                      {theme.theme && (
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md capitalize">{theme.theme}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{theme.description}</p>
                    <p className="font-display text-xl font-bold text-foreground mt-3">${theme.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Furniture */}
      {furniture && furniture.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Premium Setup</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Event Furniture & Covers</h2>
              <p className="mt-3 text-muted-foreground">Premium chairs, tables, and covers for a polished presentation.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {furniture.map((item) => (
                <div key={item.id} className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group">
                  {item.image_url ? (
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-5 text-center">
                    <h3 className="font-display text-base font-bold text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    {item.cover_color && (
                      <span className="inline-block mt-2 text-xs font-medium bg-muted px-2 py-1 rounded-md capitalize">{item.cover_color}</span>
                    )}
                    <p className="font-display text-lg font-bold text-foreground mt-2">${item.price}</p>
                    {item.quantity_available !== null && (
                      <p className="text-xs text-muted-foreground">{item.quantity_available} available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Venue?
          </h2>
          <p className="text-primary-foreground/60 max-w-md mx-auto mb-8">
            Combine decorations with our mascots, activities, and photo services for a complete experience.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent">
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
