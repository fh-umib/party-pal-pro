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
        "group bg-card rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1",
        selectable && "cursor-pointer",
        selected && "ring-4 ring-primary ring-offset-2 scale-[1.02]"
      )}
    >
      <div className="relative overflow-hidden bg-muted aspect-square">
        <img
          src={mascot.image}
          alt={mascot.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {!mascot.isAvailable && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="bg-card px-3 py-1 rounded-full font-semibold text-sm">Unavailable</span>
          </div>
        )}
        <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
          {mascot.category}
        </span>
        {selected && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-accent animate-bounce-in">
            <span className="text-accent-foreground font-bold">✓</span>
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
