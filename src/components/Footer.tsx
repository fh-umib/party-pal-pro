import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-xl font-bold">
              MD <span className="text-accent">Creative</span>
            </h3>
            <p className="text-primary-foreground/60 text-sm mt-3 leading-relaxed">
              Premium event services in Kosovo. Creating extraordinary celebrations since 2018.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-md bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-md bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-primary-foreground/80">Services</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/60">
              <li><Link to="/decorations" className="hover:text-accent transition-colors">Decorations</Link></li>
              <li><Link to="/mascots" className="hover:text-accent transition-colors">Mascot Characters</Link></li>
              <li><Link to="/activities" className="hover:text-accent transition-colors">Activities</Link></li>
              <li><Link to="/photo-services" className="hover:text-accent transition-colors">Photo Experiences</Link></li>
              <li><Link to="/packages" className="hover:text-accent transition-colors">Event Packages</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-primary-foreground/80">Company</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/60">
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Event Gallery</Link></li>
              <li><Link to="/staff" className="hover:text-accent transition-colors">Our Team</Link></li>
              <li><Link to="/reviews" className="hover:text-accent transition-colors">Client Reviews</Link></li>
              <li><Link to="/booking" className="hover:text-accent transition-colors">Book an Event</Link></li>
              <li><Link to="/login" className="hover:text-accent transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-primary-foreground/80">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> +383 4X XXX XXX</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> info@mdcreative.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Prishtina, Kosovo</li>
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
          <p className="text-xs text-primary-foreground/50">© 2026 MD Creative — Magic.Event. All rights reserved.</p>
          <p className="text-xs text-primary-foreground/50">Premium event services in Kosovo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
