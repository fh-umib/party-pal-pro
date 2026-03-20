import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Aperture, Image, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

const PhotoServicesPage = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["photo-services-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("photo_services").select("*").eq("is_active", true).order("price");
      if (error) throw error;
      return data;
    },
  });

  const features = [
    "Professional equipment and setup",
    "Instant prints and digital copies",
    "Custom props and backdrops",
    "On-site technician included",
    "Unlimited sessions during event",
    "Social media sharing station",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-1/3 w-80 h-80 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">MD Creative</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Photo Experiences
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Capture every unforgettable moment with our professional photo booth services and cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Our Stations</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Photo Booth Services</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="bg-muted rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services?.map((service, index) => {
              const icons = [Aperture, Camera];
              const Icon = icons[index % icons.length];
              return (
                <div key={service.id} className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 border border-border">
                  {service.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                          <Icon className="w-10 h-10 text-accent" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="font-display text-2xl font-bold text-foreground">{service.name}</h3>
                    <p className="text-muted-foreground mt-3 leading-relaxed">{service.description}</p>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                      <p className="font-display text-3xl font-bold text-foreground">${service.price}</p>
                      <Link to="/booking">
                        <Button variant="accent" size="sm">Add to Event</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">What's Included</p>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">Every Photo Service Includes</h2>
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-card border border-border text-center">
              <Image className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground">Instant Memories</h3>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                Your guests receive physical prints and digital copies within seconds — ready to share on social media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Add a Photo Experience to Your Event
          </h2>
          <p className="text-primary-foreground/60 max-w-md mx-auto mb-8">
            Create lasting memories with our professional photo booth stations.
          </p>
          <Link to="/booking">
            <Button variant="accent" size="xl" className="shadow-accent">
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
