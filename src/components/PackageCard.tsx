import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import type { Package } from "@/data/mockData";
import { Link } from "react-router-dom";

interface PackageCardProps {
  pkg: Package;
}

const PackageCard = ({ pkg }: PackageCardProps) => {
  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 flex flex-col",
        pkg.isPopular && "ring-2 ring-accent scale-[1.02]"
      )}
    >
      {pkg.isPopular && (
        <div className="bg-gradient-accent text-accent-foreground text-center py-2 font-display font-bold text-sm flex items-center justify-center gap-1">
          <Star className="w-4 h-4" /> Most Popular <Star className="w-4 h-4" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-2xl font-bold text-foreground">{pkg.name}</h3>
        <p className="text-muted-foreground mt-2 text-sm">{pkg.description}</p>
        <div className="mt-4">
          <span className="font-display text-4xl font-bold text-gradient">${pkg.basePrice}</span>
          <span className="text-muted-foreground text-sm ml-1">starting</span>
        </div>
        <ul className="mt-6 space-y-2 flex-1">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Link to={`/booking?package=${pkg.id}`} className="mt-6 block">
          <Button variant={pkg.isPopular ? "accent" : "hero"} size="lg" className="w-full">
            Choose {pkg.name}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
