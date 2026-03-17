import { cn } from "@/lib/utils";
import type { Mascot } from "@/data/mockData";

interface MascotCardProps {
  mascot: Mascot;
  selected?: boolean;
  onSelect?: (mascot: Mascot) => void;
  selectable?: boolean;
}

const MascotCard = ({ mascot, selected, onSelect, selectable }: MascotCardProps) => {
  return (
    <div
      onClick={() => selectable && onSelect?.(mascot)}
      className={cn(
        "group bg-card rounded-lg overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover border border-border",
        selectable && "cursor-pointer",
        selected && "ring-2 ring-accent ring-offset-2"
      )}
    >
      <div className="relative overflow-hidden bg-muted aspect-square">
        <img
          src={mascot.image}
          alt={mascot.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!mascot.isAvailable && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="bg-card px-3 py-1 rounded-md font-medium text-sm">Unavailable</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-md">
          {mascot.category}
        </span>
        {selected && (
          <div className="absolute top-3 right-3 w-7 h-7 bg-accent rounded-md flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">✓</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-foreground">{mascot.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{mascot.description}</p>
      </div>
    </div>
  );
};

export default MascotCard;
