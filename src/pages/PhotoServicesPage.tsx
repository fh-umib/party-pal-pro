import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";
import { photoServices } from "@/data/mockData";

const PhotoServicesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Photo Experiences
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">
            Capture every moment with our professional photo booth services.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {photoServices.map((service) => (
            <div key={service.id} className="bg-card rounded-lg p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border text-center">
              <Camera className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="font-display text-2xl font-bold text-foreground">{service.name}</h3>
              <p className="text-muted-foreground mt-3">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Add a Photo Booth to Your Event</h2>
        <Link to="/booking">
          <Button variant="accent" size="lg">
            Book Now <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default PhotoServicesPage;
