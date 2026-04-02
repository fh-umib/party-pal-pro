import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="relative text-center max-w-md">
        <div className="font-display text-[8rem] md:text-[10rem] font-bold leading-none text-gradient select-none">
          404
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground -mt-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          The page <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono text-foreground">{location.pathname}</code> doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Link to="/">
            <Button variant="accent" size="lg">
              <Home className="w-4 h-4" /> Go Home
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </div>
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">Looking for something?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Packages", to: "/packages" },
              { label: "Booking", to: "/booking" },
              { label: "Gallery", to: "/gallery" },
              { label: "Contact", to: "/" },
            ].map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant="ghost" size="sm">{link.label}</Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
