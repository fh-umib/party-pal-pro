import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PartyPopper, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Mascots", path: "/mascots" },
  { label: "Packages", path: "/packages" },
  { label: "Book Now", path: "/booking", isAccent: true },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center group-hover:scale-110 transition-transform">
            <PartyPopper className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            MD <span className="text-gradient">Creative</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            item.isAccent ? (
              <Link key={item.path} to={item.path}>
                <Button variant="accent" size="default">{item.label}</Button>
              </Link>
            ) : (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="default"
                >
                  {item.label}
                </Button>
              </Link>
            )
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 flex flex-col gap-2 animate-slide-up">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
              <Button
                variant={item.isAccent ? "accent" : location.pathname === item.path ? "default" : "ghost"}
                className="w-full justify-start"
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
