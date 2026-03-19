import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Camera } from "lucide-react";

const GalleryPage = () => {
  const { data: images, isLoading } = useQuery({
    queryKey: ["event-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("event_gallery").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Our Work</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Event Gallery</h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">
            Browse photos from our past events — best decorations, mascot appearances, and celebrations.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 border border-border">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={img.image_url} alt={img.title || "Event photo"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                {(img.title || img.description) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      {img.title && <h3 className="font-display text-lg font-bold text-primary-foreground">{img.title}</h3>}
                      {img.description && <p className="text-primary-foreground/70 text-sm mt-1">{img.description}</p>}
                    </div>
                  </div>
                )}
                {img.is_featured && (
                  <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-md">Featured</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-foreground">Gallery Coming Soon</h2>
            <p className="text-muted-foreground mt-2">Photos from our past events will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GalleryPage;
