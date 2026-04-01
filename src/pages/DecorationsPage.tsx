import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Crown,
  Heart,
  PartyPopper,
  Building2,
  Gem,
  Palette,
  Star,
  CheckCircle2,
  ChevronRight,
  Layers,
  Armchair,
} from "lucide-react";
import Footer from "@/components/Footer";

const eventTypeConfig: Record<string, { icon: any; gradient: string; label: string; tagline: string }> = {
  wedding: { icon: Crown, gradient: "from-accent/20 to-secondary/10", label: "Weddings", tagline: "Timeless elegance for your special day" },
  engagement: { icon: Heart, gradient: "from-accent/15 to-accent/5", label: "Engagements", tagline: "Celebrate the beginning of forever" },
  birthday: { icon: PartyPopper, gradient: "from-secondary/20 to-accent/10", label: "Birthdays", tagline: "Make every year unforgettable" },
  anniversary: { icon: Sparkles, gradient: "from-accent/10 to-secondary/15", label: "Anniversaries", tagline: "Honor your journey together" },
  grand_opening: { icon: Building2, gradient: "from-secondary/15 to-accent/5", label: "Grand Openings", tagline: "Launch with style and impact" },
};

const processSteps = [
  { num: "01", title: "Choose Your Event", desc: "Select the type of celebration you're planning" },
  { num: "02", title: "Pick a Theme", desc: "Browse curated themes designed by our stylists" },
  { num: "03", title: "Add Furniture", desc: "Complete your setup with premium furniture & covers" },
  { num: "04", title: "Book & Relax", desc: "We handle everything — setup, styling, and teardown" },
];

const DecorationsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCats } = useQuery({
    queryKey: ["decoration-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("decoration_categories")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: themes } = useQuery({
    queryKey: ["decoration-themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("decoration_themes")
        .select("*, decoration_categories(name, event_type)")
        .eq("is_available", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: furniture } = useQuery({
    queryKey: ["event-furniture"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_furniture")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const eventTypes = [...new Set(categories?.map((c) => c.event_type).filter(Boolean) || [])];
  const filteredCategories = selectedEvent
    ? categories?.filter((c) => c.event_type === selectedEvent)
    : categories;
  const filteredThemes = selectedEvent
    ? themes?.filter((t: any) => t.decoration_categories?.event_type === selectedEvent)
    : themes;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="relative bg-primary overflow-hidden min-h-[85vh] flex items-center">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[15%] w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-[120px]" />
          <div className="absolute bottom-[5%] left-[10%] w-[500px] h-[500px] rounded-full bg-secondary/[0.03] blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
          {/* Decorative line accents */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
          <div className="absolute top-[30%] right-[8%] w-px h-40 bg-gradient-to-b from-transparent via-accent/15 to-transparent" />
          <div className="absolute bottom-[25%] left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-accent/10 to-transparent" />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-accent/20 bg-accent/[0.06] mb-10 animate-fade-in">
              <Palette className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">Bespoke Event Design</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[1.05] animate-fade-in">
              Decorations{" "}
              <span className="relative inline-block">
                <span className="text-gradient">&</span>
              </span>{" "}
              <br className="hidden md:block" />
              <span className="text-gradient">Styling</span>
            </h1>

            <p className="mt-8 text-primary-foreground/45 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in">
              From intimate gatherings to grand celebrations — we transform venues into breathtaking experiences, tailored entirely to your vision.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-in">
              <Link to="/booking">
                <Button variant="accent" size="xl" className="rounded-full px-10 shadow-accent">
                  Start Planning <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#occasions" className="text-primary-foreground/40 hover:text-accent transition-colors text-sm font-medium flex items-center gap-1.5">
                Explore Styles <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 md:gap-14 mt-16 animate-fade-in">
              {[
                { value: "500+", label: "Events Styled" },
                { value: "50+", label: "Theme Options" },
                { value: "4.9", label: "Client Rating", icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="font-display text-2xl md:text-3xl font-bold text-accent">{stat.value}</span>
                    {stat.icon && <stat.icon className="w-4 h-4 text-accent fill-accent" />}
                  </div>
                  <span className="text-primary-foreground/30 text-xs tracking-wider uppercase mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 80V40C360 0 720 60 1080 30C1260 15 1380 25 1440 40V80H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-3">How It Works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Four Simple Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={step.num}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/20 transition-all duration-500 hover:shadow-card-hover"
              >
                <span className="font-display text-5xl font-bold text-accent/10 group-hover:text-accent/20 transition-colors absolute top-4 right-5">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors">
                  {i === 0 && <Sparkles className="w-5 h-5 text-accent" />}
                  {i === 1 && <Palette className="w-5 h-5 text-accent" />}
                  {i === 2 && <Armchair className="w-5 h-5 text-accent" />}
                  {i === 3 && <CheckCircle2 className="w-5 h-5 text-accent" />}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OCCASION SELECTOR ─── */}
      <section id="occasions" className="bg-primary/[0.03] py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-3">Step 1</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Choose Your Occasion</h2>
            <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
          </div>

          {/* Event type pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto mb-16">
            <button
              onClick={() => setSelectedEvent(null)}
              className={`group relative px-6 py-3 rounded-full border-2 transition-all duration-300 flex items-center gap-2.5 ${
                selectedEvent === null
                  ? "border-accent bg-accent text-accent-foreground shadow-accent"
                  : "border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="font-display text-sm font-bold">All Events</span>
            </button>
            {eventTypes.map((type) => {
              const config = eventTypeConfig[type as string] || { icon: Sparkles, label: type, tagline: "" };
              const Icon = config.icon;
              const isActive = selectedEvent === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedEvent(type as string)}
                  className={`group relative px-6 py-3 rounded-full border-2 transition-all duration-300 flex items-center gap-2.5 ${
                    isActive
                      ? "border-accent bg-accent text-accent-foreground shadow-accent"
                      : "border-border bg-card text-muted-foreground hover:border-accent/30 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-display text-sm font-bold">{config.label || (type as string).replace("_", " ")}</span>
                </button>
              );
            })}
          </div>

          {/* Selected event tagline */}
          {selectedEvent && eventTypeConfig[selectedEvent] && (
            <p className="text-center text-muted-foreground mb-12 text-lg italic">
              "{eventTypeConfig[selectedEvent].tagline}"
            </p>
          )}

          {/* Categories — Editorial alternating layout */}
          {loadingCats ? (
            <div className="space-y-8 max-w-6xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredCategories && filteredCategories.length > 0 ? (
            <div className="max-w-6xl mx-auto space-y-10">
              {filteredCategories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className={`group relative flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-dramatic transition-all duration-700 border border-border`}
                >
                  {/* Image side */}
                  <div className="md:w-[55%] aspect-[16/10] md:aspect-auto overflow-hidden bg-muted relative min-h-[300px]">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${eventTypeConfig[cat.event_type as string]?.gradient || "from-muted to-muted"} flex items-center justify-center`}>
                        <Gem className="w-20 h-20 text-accent/15" />
                      </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    {/* Category number */}
                    <span className="absolute top-6 left-6 font-display text-7xl font-bold text-primary-foreground/10 select-none">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content side */}
                  <div className="md:w-[45%] p-8 md:p-12 flex flex-col justify-center">
                    {cat.event_type && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-accent/10 text-accent px-3.5 py-1.5 rounded-full w-fit mb-5 uppercase tracking-wider">
                        {(cat.event_type as string).replace("_", " ")}
                      </span>
                    )}
                    <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-muted-foreground mt-4 leading-relaxed text-base">{cat.description}</p>
                    <div className="flex items-center gap-4 mt-8">
                      <Link to="/booking">
                        <Button variant="accent" size="default" className="rounded-full shadow-accent">
                          Book This Style <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Gem className="w-12 h-12 text-accent/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No categories found for this event type.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── THEMES GALLERY ─── */}
      {filteredThemes && filteredThemes.length > 0 && (
        <section className="bg-primary py-28 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
                backgroundSize: "80px 80px",
              }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent/[0.03] blur-[150px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-3">Step 2</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">Curated Themes</h2>
              <p className="text-primary-foreground/35 mt-4 max-w-lg mx-auto">
                Each theme is crafted by our design team to create a cohesive, stunning atmosphere.
              </p>
              <div className="w-16 h-1 bg-gradient-accent mx-auto mt-6 rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {filteredThemes.map((theme: any, idx: number) => {
                const isFirst = idx === 0;
                const isHovered = hoveredTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onMouseEnter={() => setHoveredTheme(theme.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                      isFirst ? "sm:col-span-2 sm:row-span-2" : ""
                    } ${isHovered ? "shadow-dramatic ring-1 ring-accent/30" : ""}`}
                  >
                    <div className={`${isFirst ? "aspect-[16/11]" : "aspect-[4/3]"} overflow-hidden bg-primary-foreground/5 relative`}>
                      {theme.image_url ? (
                        <img
                          src={theme.image_url}
                          alt={theme.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/5 to-secondary/5 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-accent/15" />
                        </div>
                      )}

                      {/* Full overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Theme badge */}
                      {theme.theme && (
                        <span className="absolute top-4 left-4 text-[11px] font-bold bg-foreground/50 backdrop-blur-xl text-background px-3 py-1.5 rounded-full capitalize tracking-wide">
                          {theme.theme}
                        </span>
                      )}

                      {/* Category badge */}
                      {theme.decoration_categories?.name && (
                        <span className="absolute top-4 right-4 text-[10px] font-semibold bg-accent/80 text-accent-foreground px-2.5 py-1 rounded-full">
                          {theme.decoration_categories.name}
                        </span>
                      )}

                      {/* Hover content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <h3 className={`font-display ${isFirst ? "text-2xl" : "text-lg"} font-bold text-background`}>{theme.name}</h3>
                        {theme.description && (
                          <p className="text-background/70 text-sm mt-1.5 line-clamp-2">{theme.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <span className="font-display text-2xl font-bold text-accent">${theme.price}</span>
                          <Link to="/booking">
                            <Button size="sm" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
                              Select <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Static info below image */}
                    <div className="p-4 bg-primary-foreground/[0.04] border-t border-primary-foreground/5 group-hover:bg-primary-foreground/[0.06] transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-sm font-bold text-primary-foreground truncate">{theme.name}</h3>
                        <span className="font-display text-lg font-bold text-accent ml-3">${theme.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── FURNITURE ─── */}
      {furniture && furniture.length > 0 && (
        <section className="py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14">
                <div>
                  <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-3">Step 3</p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Event Furniture & Covers</h2>
                  <p className="text-muted-foreground mt-3 max-w-lg">
                    Complete your setup with our premium chairs, tables, and covers in multiple color options.
                  </p>
                </div>
                <Link to="/booking" className="mt-6 md:mt-0">
                  <Button variant="outline" className="rounded-full border-accent/30 text-accent hover:bg-accent/5">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {furniture.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border hover:border-accent/20 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-accent/5 to-secondary/5 flex items-center justify-center">
                          <Armchair className="w-10 h-10 text-accent/20" />
                        </div>
                      )}
                      {item.cover_color && (
                        <span className="absolute bottom-3 left-3 text-[10px] font-semibold bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full capitalize text-foreground flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-border"
                            style={{
                              backgroundColor:
                                item.cover_color === "white" ? "#fff" :
                                item.cover_color === "black" ? "#222" :
                                item.cover_color === "cream" ? "#f5e6c8" :
                                "hsl(var(--muted))",
                            }}
                          />
                          {item.cover_color}
                        </span>
                      )}
                      {item.quantity_available !== null && item.quantity_available <= 5 && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold bg-destructive/90 text-destructive-foreground px-2 py-0.5 rounded-full">
                          Only {item.quantity_available} left
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-bold text-foreground">{item.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-display text-xl font-bold text-foreground">${item.price}</span>
                        {item.quantity_available !== null && item.quantity_available > 5 && (
                          <span className="text-[10px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                            {item.quantity_available} available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="bg-primary py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/[0.04] blur-[150px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <Gem className="w-12 h-12 text-accent mx-auto mb-8 animate-float" />
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Ready to Transform <br className="hidden md:block" />
              Your Venue?
            </h2>
            <p className="text-primary-foreground/40 max-w-md mx-auto mt-6 text-lg leading-relaxed">
              Combine decorations with our mascots, activities, and photo services for an unforgettable celebration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link to="/booking">
                <Button variant="accent" size="xl" className="shadow-accent rounded-full px-12">
                  Book Decorations <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/packages">
                <Button variant="outline" size="lg" className="rounded-full border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/5">
                  View Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DecorationsPage;
