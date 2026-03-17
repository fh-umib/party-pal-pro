import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { decorationCategories, eventFurniture } from "@/data/mockData";

const DecorationsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Decorations
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">
            Elegant and professional decoration services for every occasion.
          </p>
        </div>
      </section>

      {/* Decoration Categories */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Event Decorations</h2>
          <p className="mt-2 text-muted-foreground">Choose from our range of tailored decoration services.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {decorationCategories.map((cat) => (
            <div key={cat.id} className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
              <h3 className="font-display text-lg font-bold text-foreground">{cat.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Furniture */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Event Furniture & Setup</h2>
            <p className="mt-2 text-muted-foreground">Premium chairs, tables, and covers for a polished presentation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {eventFurniture.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-6 shadow-card border border-border">
                <h3 className="font-display text-lg font-bold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Include Decorations in Your Event</h2>
        <Link to="/booking">
          <Button variant="accent" size="lg">
            Book Now <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default DecorationsPage;
