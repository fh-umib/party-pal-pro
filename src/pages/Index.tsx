import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PartyPopper, Sparkles, Star, Users, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { mascots, packages } from "@/data/mockData";
import MascotCard from "@/components/MascotCard";
import PackageCard from "@/components/PackageCard";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-4 pt-20 pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 mb-6 animate-bounce-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Making every party magical!</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
            Unforgettable <span className="text-gradient">Kids Parties</span> & Events
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your favorite mascot characters, customize your package, and create magical memories that last a lifetime!
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/packages">
              <Button variant="hero" size="xl">
                <PartyPopper className="w-5 h-5" /> Explore Packages
              </Button>
            </Link>
            <Link to="/mascots">
              <Button variant="outline" size="xl">
                Meet Our Characters <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 max-w-md mx-auto gap-6">
            {[
              { icon: Users, label: "Happy Kids", value: "5,000+" },
              { icon: Star, label: "5-Star Reviews", value: "200+" },
              { icon: PartyPopper, label: "Events Done", value: "800+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-accent mx-auto mb-1" />
                <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mascots */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Meet Our <span className="text-gradient">Characters</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Our beloved mascots bring joy and excitement to every event!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mascots.slice(0, 3).map((mascot) => (
            <MascotCard key={mascot.id} mascot={mascot} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/mascots">
            <Button variant="outline" size="lg">
              View All Characters <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Party <span className="text-gradient">Packages</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Choose the perfect package and customize it your way!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-hero rounded-3xl p-12 md:p-16 text-primary-foreground">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Plan Your Party?</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-lg mx-auto">
            Start building your dream event in just a few steps. Pick your package, choose characters, and let the magic begin!
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="mt-8">
              <PartyPopper className="w-5 h-5" /> Start Booking Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 MD Creative. All rights reserved. Making parties magical! ✨</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
