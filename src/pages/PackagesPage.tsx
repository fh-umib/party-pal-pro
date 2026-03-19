import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PackageCard from "@/components/PackageCard";
import Footer from "@/components/Footer";

const PackagesPage = () => {
  const { data: packages, isLoading } = useQuery({
    queryKey: ["packages-page"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").eq("is_active", true).order("base_price");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Magic.Event</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Event Packages</h1>
          <p className="mt-4 text-primary-foreground/60 max-w-lg mx-auto">Choose a package and customize it with mascots, activities, and more.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages?.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PackagesPage;
