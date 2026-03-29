import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Camera, X, ChevronLeft, ChevronRight, Star, Grid3X3, Rows3 } from "lucide-react";
import Footer from "@/components/Footer";

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const { data: images, isLoading } = useQuery({
    queryKey: ["event-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_gallery").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const eventTypes = [...new Set(images?.map((img) => img.event_type).filter(Boolean) || [])];
  const filtered = filterType ? images?.filter((img) => img.event_type === filterType) : images;

  const navigateImage = (direction: number) => {
    if (selectedImage === null || !filtered) return;
    const newIndex = selectedImage + direction;
    if (newIndex >= 0 && newIndex < filtered.length) setSelectedImage(newIndex);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="container mx-auto px-4 pt-28 pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-8 animate-fade-in">
              <Camera className="w-3.5 h-3.5 text-accent" />
              <span className="text-accent text-xs font-semibold tracking-widest uppercase">Our Portfolio</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] animate-fade-in">
              Event <span className="text-gradient">Gallery</span>
            </h1>
            <p className="mt-6 text-primary-foreground/50 text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
              Browse photos from our past events — decorations, mascot appearances, and celebrations we've brought to life.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-auto">
            <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="container mx-auto px-4 py-16">
        {eventTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setFilterType(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filterType === null ? "bg-primary text-primary-foreground shadow-card-hover" : "bg-card text-muted-foreground border border-border hover:border-accent/30 hover:text-foreground"
              }`}
            >
              All Events
            </button>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as string)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                  filterType === type ? "bg-primary text-primary-foreground shadow-card-hover" : "bg-card text-muted-foreground border border-border hover:border-accent/30 hover:text-foreground"
                }`}
              >
                {(type as string).replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`bg-muted rounded-2xl animate-pulse mb-4 ${i % 3 === 0 ? "h-80" : i % 3 === 1 ? "h-64" : "h-72"}`} />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
            {filtered.map((img, index) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(index)}
                className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-dramatic transition-all duration-500 border border-border hover:border-accent/20 cursor-pointer mb-4 break-inside-avoid"
              >
                <div className="overflow-hidden bg-muted">
                  <img
                    src={img.image_url}
                    alt={img.title || "Event photo"}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div>
                    {img.title && <h3 className="font-display text-lg font-bold text-primary-foreground">{img.title}</h3>}
                    {img.description && <p className="text-primary-foreground/70 text-sm mt-1">{img.description}</p>}
                  </div>
                </div>
                {img.is_featured && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-accent text-accent-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Gallery Coming Soon</h2>
            <p className="text-muted-foreground mt-3 max-w-sm mx-auto">
              Photos from our past events will appear here. Stay tuned for our latest work.
            </p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selectedImage !== null && filtered && filtered[selectedImage] && (
        <div className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10">
            <X className="w-8 h-8" />
          </button>
          {selectedImage > 0 && (
            <button onClick={(e) => { e.stopPropagation(); navigateImage(-1); }} className="absolute left-4 md:left-8 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10">
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}
          {selectedImage < filtered.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); navigateImage(1); }} className="absolute right-4 md:right-8 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10">
              <ChevronRight className="w-10 h-10" />
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full animate-scale-in">
            <img src={filtered[selectedImage].image_url} alt={filtered[selectedImage].title || "Event photo"} className="w-full max-h-[80vh] object-contain rounded-lg" />
            {(filtered[selectedImage].title || filtered[selectedImage].description) && (
              <div className="text-center mt-6">
                {filtered[selectedImage].title && <h3 className="font-display text-xl font-bold text-primary-foreground">{filtered[selectedImage].title}</h3>}
                {filtered[selectedImage].description && <p className="text-primary-foreground/50 text-sm mt-1">{filtered[selectedImage].description}</p>}
              </div>
            )}
            <div className="text-center mt-3">
              <span className="text-primary-foreground/30 text-xs">{selectedImage + 1} / {filtered.length}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
