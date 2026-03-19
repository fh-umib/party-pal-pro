import { CalendarClock, X } from "lucide-react";
import { useState } from "react";

const SeasonalBanner = () => {
  const [visible, setVisible] = useState(true);
  const month = new Date().getMonth(); // 0-indexed
  const isPeakSeason = month >= 5 && month <= 8; // June–September

  if (!visible || !isPeakSeason) return null;

  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium relative">
        <CalendarClock className="w-4 h-4 flex-shrink-0" />
        <span>Peak season is here! Book at least 1 week in advance for June–September events.</span>
        <button onClick={() => setVisible(false)} className="absolute right-4 hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SeasonalBanner;
