import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Camera, X, ChevronLeft, ChevronRight, Star } from "lucide-react";
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">Our Work</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground animate-fade-in">
            Event Gallery
          </h1>
          <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto animate-fade-in">
            Browse photos from our past events — best decorations, mascot appearances, and celebrations we've brought to life.
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="container mx-auto px-4 py-12">
        {eventTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setFilterType(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === null ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as string)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  filterType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {(type as string).replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((img, index) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(index)}
                className="group relative overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-all duration-500 border border-border cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={img.image_url}
                    alt={img.title || "Event photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                  <div>
                    {img.title && <h3 className="font-display text-lg font-bold text-primary-foreground">{img.title}</h3>}
                    {img.description && <p className="text-primary-foreground/70 text-sm mt-1">{img.description}</p>}
                  </div>
                </div>
                {img.is_featured && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-foreground">Gallery Coming Soon</h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Photos from our past events will appear here. Stay tuned for our latest work.
            </p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selectedImage !== null && filtered && filtered[selectedImage] && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <X className="w-8 h-8" />
          </button>
          {selectedImage > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
              className="absolute left-6 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
          )}
          {selectedImage < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
              className="absolute right-6 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full">
            <img
              src={filtered[selectedImage].image_url}
              alt={filtered[selectedImage].title || "Event photo"}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            {(filtered[selectedImage].title || filtered[selectedImage].description) && (
              <div className="text-center mt-4">
                {filtered[selectedImage].title && (
                  <h3 className="font-display text-xl font-bold text-primary-foreground">{filtered[selectedImage].title}</h3>
                )}
                {filtered[selectedImage].description && (
                  <p className="text-primary-foreground/60 text-sm mt-1">{filtered[selectedImage].description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GalleryPage;
