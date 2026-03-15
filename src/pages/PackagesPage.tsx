import { packages } from "@/data/mockData";
import PackageCard from "@/components/PackageCard";

const PackagesPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          Event <span className="text-gradient">Packages</span>
        </h1>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
          Choose the perfect package for your celebration and customize it with mascots and add-ons!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;
