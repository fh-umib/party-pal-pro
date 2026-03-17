import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Decorations", path: "/decorations" },
  { label: "Mascots", path: "/mascots" },
  { label: "Activities", path: "/activities" },
  { label: "Photo Booth", path: "/photo-services" },
  { label: "Packages", path: "/packages" },
  { label: "Book Now", path: "/booking", isAccent: true },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="font-display text-xl font-bold text-foreground tracking-tight">
            MD <span className="text-gradient">Creative</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            item.isAccent ? (
              <Link key={item.path} to={item.path}>
                <Button variant="accent" size="sm">{item.label}</Button>
              </Link>
            ) : (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                >
                  {item.label}
                </Button>
              </Link>
            )
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card p-4 flex flex-col gap-1 animate-slide-up">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
              <Button
                variant={item.isAccent ? "accent" : location.pathname === item.path ? "default" : "ghost"}
                className="w-full justify-start"
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
