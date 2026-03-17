import { useState } from "react";
import { mascots, mascotCategories } from "@/data/mockData";
import MascotCard from "@/components/MascotCard";
import { Button } from "@/components/ui/button";

const MascotsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? mascots
    : mascots.filter((m) => m.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
            Mascot Characters
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">
            Browse our collection of over 50 mascot characters available for your event.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {mascotCategories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filtered.map((mascot) => (
            <MascotCard key={mascot.id} mascot={mascot} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No characters found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default MascotsPage;
