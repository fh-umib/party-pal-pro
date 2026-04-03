import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-card/95 backdrop-blur-xl border-b border-border shadow-card"
          : "bg-card/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center shadow-sm group-hover:shadow-accent transition-shadow duration-300">
            <span className="font-display text-sm font-bold text-accent-foreground">MD</span>
          </div>
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            <span className="text-gradient">Creative</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <button
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full" />
                  )}
                </button>
              </Link>
            );
          })}
          <Link to="/booking" className="ml-2">
            <Button variant="accent" size="sm" className="rounded-full shadow-sm hover:shadow-accent transition-shadow">
              Book Now
            </Button>
          </Link>

          {/* Auth section */}
          <div className="ml-3 border-l border-border pl-3 flex items-center gap-1">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      <Shield className="w-4 h-4" /> Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={signOut}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-full">
                  <User className="w-4 h-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-5">
            <span className={`absolute left-0 w-5 h-0.5 bg-foreground rounded transition-all duration-300 ${mobileOpen ? "top-2.5 rotate-45" : "top-1"}`} />
            <span className={`absolute left-0 top-2.5 w-5 h-0.5 bg-foreground rounded transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : "opacity-100"}`} />
            <span className={`absolute left-0 w-5 h-0.5 bg-foreground rounded transition-all duration-300 ${mobileOpen ? "top-2.5 -rotate-45" : "top-4"}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border bg-card/98 backdrop-blur-xl px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </div>
              </Link>
            );
          })}
          <Link to="/booking" onClick={() => setMobileOpen(false)}>
            <div className="mt-2">
              <Button variant="accent" className="w-full rounded-full" size="sm">Book Now</Button>
            </div>
          </Link>
          <div className="border-t border-border pt-3 mt-3 space-y-1">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                      <Shield className="w-4 h-4" /> Admin Dashboard
                    </div>
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <User className="w-4 h-4" /> Sign In
                  </div>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-accent hover:bg-accent/10 transition-all">
                    Create Account
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
