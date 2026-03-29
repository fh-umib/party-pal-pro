import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Crown, Sparkles, Star, Gift, ArrowDown } from "lucide-react";
import Footer from "@/components/Footer";

const PackagesPage = () => {
  const { data: packages, isLoading } = useQuery({
    queryKey: ["packages-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").eq("is_active", true).order("base_price");
      if (error) throw error;
      return data;
    },
  });

  const tierConfig = [
    { icon: Sparkles, color: "accent", accentBg: "bg-accent/10" },
    { icon: Crown, color: "accent", accentBg: "bg-accent/10" },
    { icon: Star, color: "accent", accentBg: "bg-accent/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] -translate-y-1/3" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <Gift className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">Flexible Pricing</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Event <span className="text-gradient">Packages</span>
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Choose a package, customize it with mascots, decorations, and more to create your perfect event.
            </p>
            <div className="mt-10 animate-fade-in">
              <ArrowDown className="w-5 h-5 text-accent mx-auto animate-float" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Packages */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Choose Your Package</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Transparent, All-Inclusive Pricing</h2>
          <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">All packages are fully customizable. Add mascots, activities, and extras during booking.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => <div key={i} className="bg-muted rounded-2xl h-[550px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {packages?.map((pkg, index) => {
              const tier = tierConfig[index % tierConfig.length];
              const Icon = tier.icon;
              const isPopular = pkg.is_popular;
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-card rounded-2xl overflow-hidden transition-all duration-500 flex flex-col group ${
                    isPopular
                      ? "border-2 border-accent shadow-dramatic scale-[1.03] z-10"
                      : "border border-border shadow-card hover:shadow-card-hover hover:border-accent/20"
                  }`}
                >
                  {isPopular && (
                    <div className="bg-gradient-accent text-accent-foreground text-center py-2.5 text-xs font-bold tracking-[0.2em] uppercase">
                      ★ Most Popular
                    </div>
                  )}
                  <div className="p-8 md:p-10 flex-1 flex flex-col">
                    <div className={`w-14 h-14 rounded-2xl ${tier.accentBg} flex items-center justify-center mb-5`}>
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">{pkg.name}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{pkg.description}</p>
                    <div className="mt-8 mb-8">
                      <span className="font-display text-5xl font-bold text-foreground">${pkg.base_price}</span>
                      <span className="text-muted-foreground text-sm ml-2">base price</span>
                    </div>
                    <div className="border-t border-border pt-6 flex-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-5">What's included</p>
                      <ul className="space-y-3.5">
                        <li className="flex items-start gap-3 text-sm">
                          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-accent" />
                          </div>
                          <span className="text-foreground">Up to <strong>{pkg.max_mascots}</strong> mascot characters</span>
                        </li>
                        {(pkg.features as string[] | null)?.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-accent" />
                            </div>
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link to={`/booking?package=${pkg.id}`} className="mt-8 block">
                      <Button
                        variant={isPopular ? "accent" : "default"}
                        size="lg"
                        className="w-full rounded-full"
                      >
                        Select Package <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Custom CTA */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }} />
        <div className="container mx-auto px-4 text-center relative">
          <Gift className="w-10 h-10 text-accent mx-auto mb-6 animate-float" />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Need Something Custom?
          </h2>
          <p className="text-primary-foreground/50 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
            All packages can be customized during booking. Add extra mascots, decorations, activities, photo services, and more.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent rounded-full px-12">
              Start Custom Booking <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PackagesPage;
