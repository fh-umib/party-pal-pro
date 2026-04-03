import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded options */}
      <div
        className={`flex flex-col gap-2 transition-all duration-300 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <a
          href="https://wa.me/38349000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-card rounded-full pl-4 pr-5 py-3 shadow-dramatic border border-border hover:border-accent/30 transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">WhatsApp</span>
        </a>
        <a
          href="tel:+38349000000"
          className="flex items-center gap-3 bg-card rounded-full pl-4 pr-5 py-3 shadow-dramatic border border-border hover:border-accent/30 transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
            <Phone className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">Call Us</span>
        </a>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-dramatic flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
          open
            ? "bg-foreground text-background rotate-0"
            : "bg-accent text-accent-foreground animate-float"
        }`}
        aria-label="Contact us"
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default FloatingContact;
