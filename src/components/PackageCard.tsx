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
        "relative bg-card rounded-lg overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover flex flex-col border border-border",
        pkg.isPopular && "ring-2 ring-accent"
      )}
    >
      {pkg.isPopular && (
        <div className="bg-gradient-accent text-accent-foreground text-center py-2 font-body font-semibold text-sm flex items-center justify-center gap-1">
          <Star className="w-3.5 h-3.5" /> Most Popular
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-2xl font-bold text-foreground">{pkg.name}</h3>
        <p className="text-muted-foreground mt-2 text-sm">{pkg.description}</p>
        <div className="mt-4">
          <span className="font-display text-4xl font-bold text-foreground">${pkg.basePrice}</span>
          <span className="text-muted-foreground text-sm ml-1">starting</span>
        </div>
        <ul className="mt-6 space-y-2.5 flex-1">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Link to={`/booking?package=${pkg.id}`} className="mt-6 block">
          <Button variant={pkg.isPopular ? "accent" : "default"} size="lg" className="w-full">
            Choose {pkg.name}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PackageCard;
