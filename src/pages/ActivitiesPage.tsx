import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { activities } from "@/data/mockData";

const ActivitiesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Activities & Entertainment
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">
            Unique entertainment services to make every event extraordinary.
          </p>
        </div>
      </section>

      {/* Activities */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border relative">
              {activity.isExclusive && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">
                  <Star className="w-3 h-3" /> Exclusive in Kosovo
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-foreground">{activity.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 bg-muted rounded-lg p-8 max-w-2xl mx-auto">
          <Star className="w-6 h-6 text-accent mx-auto mb-3" />
          <p className="font-display text-lg font-bold text-foreground">
            We are the only provider in Kosovo offering Bounce House and Ball House attractions.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Our exclusive entertainment options set us apart and make every event truly special.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Add Activities to Your Event</h2>
        <Link to="/booking">
          <Button variant="accent" size="lg">
            Book Now <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default ActivitiesPage;
