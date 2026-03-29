import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Aperture, CheckCircle, Image, Sparkles, Zap } from "lucide-react";
import Footer from "@/components/Footer";

const features = [
  { icon: Camera, title: "Professional Equipment", desc: "State-of-the-art cameras and lighting for flawless results." },
  { icon: Zap, title: "Instant Prints", desc: "Physical prints ready within seconds for your guests." },
  { icon: Image, title: "Digital Copies", desc: "All photos delivered digitally for easy sharing on social media." },
  { icon: Sparkles, title: "Custom Backdrops", desc: "Branded or themed props and backdrops to match your event." },
];

const PhotoServicesPage = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["photo-services-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("photo_services").select("*").eq("is_active", true).order("price");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <Aperture className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">Capture Every Moment</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Photo <span className="text-gradient">Experiences</span>
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Professional photo booth services and cutting-edge technology to capture every unforgettable moment.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Services — Large featured cards */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Our Stations</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Photo Booth Services</h2>
          <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2].map((i) => <div key={i} className="bg-muted rounded-2xl h-[500px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services?.map((service, index) => {
              const icons = [Aperture, Camera];
              const Icon = icons[index % icons.length];
              return (
                <div key={service.id} className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-dramatic transition-all duration-700 border border-border hover:border-accent/20">
                  <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/5 to-secondary/5 flex items-center justify-center">
                        <Icon className="w-20 h-20 text-accent/15" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-8 md:p-10">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">{service.name}</h3>
                    <p className="text-muted-foreground mt-3 leading-relaxed text-base">{service.description}</p>
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                      <div>
                        <span className="font-display text-4xl font-bold text-foreground">${service.price}</span>
                        <span className="text-muted-foreground text-sm ml-2">per event</span>
                      </div>
                      <Link to="/booking">
                        <Button variant="accent" className="rounded-full">
                          Add to Event <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Features — Icon grid */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">What's Included</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Every Service Includes</h2>
            <div className="w-16 h-1 bg-gradient-accent mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="bg-primary-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/10 hover:border-accent/30 transition-all duration-500 text-center group">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary-foreground mb-2">{f.title}</h3>
                <p className="text-primary-foreground/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Additional perks */}
          <div className="mt-14 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {["On-site technician", "Unlimited sessions", "Social sharing station", "Custom props"].map((perk) => (
              <div key={perk} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/5 border border-primary-foreground/10">
                <CheckCircle className="w-3.5 h-3.5 text-accent" />
                <span className="text-primary-foreground/70 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <Aperture className="w-10 h-10 text-accent mx-auto mb-6 animate-float" />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Create Lasting Memories
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
            Add a professional photo experience to your next event.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent rounded-full px-12">
              Book a Photo Booth <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PhotoServicesPage;
