import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-primary text-primary-foreground relative">
      {/* Back to top */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-accent hover:scale-110 active:scale-95 transition-transform"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <span className="font-display text-sm font-bold text-accent-foreground">MD</span>
              </div>
              <span className="font-display text-xl font-bold">
                <span className="text-accent">Creative</span>
              </span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Premium event services in Kosovo. Creating extraordinary celebrations since 2018.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-5 text-primary-foreground/80">Services</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              {[
                { to: "/decorations", label: "Decorations" },
                { to: "/mascots", label: "Mascot Characters" },
                { to: "/activities", label: "Activities" },
                { to: "/photo-services", label: "Photo Experiences" },
                { to: "/packages", label: "Event Packages" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-accent transition-colors inline-flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-5 text-primary-foreground/80">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              {[
                { to: "/gallery", label: "Event Gallery" },
                { to: "/staff", label: "Our Team" },
                { to: "/reviews", label: "Client Reviews" },
                { to: "/booking", label: "Book an Event" },
                { to: "/login", label: "My Account" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-accent transition-colors inline-flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-5 text-primary-foreground/80">Contact</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/60">
              <li>
                <a href="tel:+38349000000" className="flex items-center gap-3 hover:text-accent transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-accent" />
                  </div>
                  +383 4X XXX XXX
                </a>
              </li>
              <li>
                <a href="mailto:info@mdcreative.com" className="flex items-center gap-3 hover:text-accent transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                  </div>
                  info@mdcreative.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                </div>
                Prishtina, Kosovo
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Seasonal notice */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-xs text-accent font-medium">
            📅 June, July, August, and September are peak season months. Please book at least 1 week in advance.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-5 flex flex-wrap justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">© 2026 MD Creative — Magic.Event. All rights reserved.</p>
          <p className="text-xs text-primary-foreground/40">Premium event services in Kosovo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
