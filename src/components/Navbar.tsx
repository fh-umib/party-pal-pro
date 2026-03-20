import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Decorations", path: "/decorations" },
  { label: "Mascots", path: "/mascots" },
  { label: "Activities", path: "/activities" },
  { label: "Photo Booth", path: "/photo-services" },
  { label: "Packages", path: "/packages" },
  { label: "Gallery", path: "/gallery" },
  { label: "Our Team", path: "/staff" },
  { label: "Reviews", path: "/reviews" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

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
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          <Link to="/booking">
            <Button variant="accent" size="sm">Book Now</Button>
          </Link>

          {/* Auth section */}
          <div className="ml-2 border-l border-border pl-2 flex items-center gap-1">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Shield className="w-4 h-4" /> Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
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
                variant={location.pathname === item.path ? "default" : "ghost"}
                className="w-full justify-start"
                size="sm"
              >
                {item.label}
              </Button>
            </Link>
          ))}
          <Link to="/booking" onClick={() => setMobileOpen(false)}>
            <Button variant="accent" className="w-full justify-start" size="sm">Book Now</Button>
          </Link>
          <div className="border-t border-border pt-2 mt-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => { signOut(); setMobileOpen(false); }}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start" size="sm">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start" size="sm">Create Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
