import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Crown, Sparkles, Star } from "lucide-react";
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

  const tierIcons = [Sparkles, Crown, Star];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">MD Creative</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Event Packages
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Choose a package and customize it with mascots, decorations, activities, and more to create your perfect event.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Choose Your Package</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Flexible Pricing for Every Event</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">All packages are fully customizable. Add mascots, activities, and extras during booking.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-muted rounded-lg h-[500px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {packages?.map((pkg, index) => {
              const Icon = tierIcons[index % tierIcons.length];
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border flex flex-col ${
                    pkg.is_popular ? "border-accent ring-2 ring-accent/20 scale-[1.02]" : "border-border"
                  }`}
                >
                  {pkg.is_popular && (
                    <div className="bg-accent text-accent-foreground text-center py-2 text-xs font-bold tracking-wider uppercase">
                      Most Popular
                    </div>
                  )}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">{pkg.name}</h3>
                    <p className="text-muted-foreground mt-2">{pkg.description}</p>
                    <div className="mt-6 mb-6">
                      <span className="font-display text-4xl font-bold text-foreground">${pkg.base_price}</span>
                      <span className="text-muted-foreground text-sm ml-1">base price</span>
                    </div>
                    <div className="border-t border-border pt-6 flex-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Includes</p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2.5 text-sm">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">Up to <strong>{pkg.max_mascots}</strong> mascot characters</span>
                        </li>
                        {(pkg.features as string[] | null)?.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm">
                            <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link to={`/booking?package=${pkg.id}`} className="mt-8 block">
                      <Button
                        variant={pkg.is_popular ? "accent" : "default"}
                        size="lg"
                        className="w-full"
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

      {/* Comparison note */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">Need Something Custom?</h3>
          <p className="text-muted-foreground leading-relaxed">
            All packages can be customized during the booking process. Add extra mascots, decorations, activities, photo services, and more to create your perfect event.
          </p>
          <Link to="/booking" className="mt-6 inline-block">
            <Button variant="outline" size="lg">
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
