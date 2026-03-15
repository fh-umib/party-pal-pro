import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { packages, mascots, addOns, type Mascot, type AddOn } from "@/data/mockData";
import MascotCard from "@/components/MascotCard";
import { Check, ChevronLeft, ChevronRight, PartyPopper, Calendar, MapPin, Phone, FileText } from "lucide-react";

const steps = ["Package", "Mascots", "Add-ons", "Details"];

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedPkg = searchParams.get("package");

  const [currentStep, setCurrentStep] = useState(preselectedPkg ? 1 : 0);
  const [selectedPackage, setSelectedPackage] = useState(preselectedPkg || "");
  const [selectedMascots, setSelectedMascots] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({ date: "", time: "", location: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const pkg = packages.find((p) => p.id === selectedPackage);

  const toggleMascot = (mascot: Mascot) => {
    if (!pkg) return;
    setSelectedMascots((prev) => {
      if (prev.includes(mascot.id)) return prev.filter((id) => id !== mascot.id);
      if (prev.length >= pkg.maxMascots) return prev;
      return [...prev, mascot.id];
    });
  };

  const toggleAddOn = (addon: AddOn) => {
    setSelectedAddOns((prev) => {
      const copy = { ...prev };
      if (copy[addon.id]) delete copy[addon.id];
      else copy[addon.id] = 1;
      return copy;
    });
  };

  const totalPrice = useMemo(() => {
    if (!pkg) return 0;
    const addOnTotal = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
      const addon = addOns.find((a) => a.id === id);
      return sum + (addon ? addon.price * qty : 0);
    }, 0);
    return pkg.basePrice + addOnTotal;
  }, [pkg, selectedAddOns]);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedPackage;
      case 1: return selectedMascots.length > 0;
      case 2: return true;
      case 3: return formData.date && formData.location && formData.phone;
      default: return false;
    }
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto animate-bounce-in">
          <div className="w-20 h-20 rounded-full bg-gradient-hero mx-auto flex items-center justify-center mb-6">
            <PartyPopper className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Booking Submitted! 🎉</h1>
          <p className="mt-4 text-muted-foreground">
            Thank you! We've received your booking request. Our team will contact you shortly to confirm the details.
          </p>
          <p className="mt-2 font-semibold text-foreground">Total: ${totalPrice}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
        Book Your <span className="text-gradient">Party</span>
      </h1>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-1 my-8">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i < currentStep ? "bg-primary text-primary-foreground" :
              i === currentStep ? "bg-gradient-hero text-primary-foreground scale-110" :
              "bg-muted text-muted-foreground"
            }`}>
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${
              i === currentStep ? "text-primary" : "text-muted-foreground"
            }`}>{step}</span>
            {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < currentStep ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="animate-slide-up">
        {currentStep === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPackage(p.id)}
                className={`bg-card rounded-2xl p-5 cursor-pointer shadow-card transition-all hover:shadow-card-hover ${
                  selectedPackage === p.id ? "ring-4 ring-primary scale-[1.02]" : ""
                }`}
              >
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                <p className="font-display text-2xl font-bold text-gradient mt-3">${p.basePrice}</p>
                <p className="text-xs text-muted-foreground mt-1">Up to {p.maxMascots} mascots</p>
              </div>
            ))}
          </div>
        )}

        {currentStep === 1 && pkg && (
          <div>
            <p className="text-center text-muted-foreground mb-6">
              Select up to <span className="font-bold text-foreground">{pkg.maxMascots}</span> mascots
              ({selectedMascots.length}/{pkg.maxMascots} selected)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mascots.map((m) => (
                <MascotCard
                  key={m.id}
                  mascot={m}
                  selectable
                  selected={selectedMascots.includes(m.id)}
                  onSelect={toggleMascot}
                />
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addOns.map((addon) => {
              const isIncluded = pkg?.includesAddons.includes(addon.id);
              const isSelected = !!selectedAddOns[addon.id];
              return (
                <div
                  key={addon.id}
                  onClick={() => !isIncluded && toggleAddOn(addon)}
                  className={`bg-card rounded-2xl p-5 transition-all shadow-card hover:shadow-card-hover ${
                    isIncluded ? "opacity-60" : "cursor-pointer"
                  } ${isSelected ? "ring-4 ring-primary" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display text-lg font-bold">{addon.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                    </div>
                    {isIncluded ? (
                      <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">Included</span>
                    ) : isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    ) : null}
                  </div>
                  {!isIncluded && (
                    <p className="font-display text-xl font-bold text-gradient mt-3">+${addon.price}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <Calendar className="w-4 h-4 text-primary" /> Event Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <Calendar className="w-4 h-4 text-primary" /> Event Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <MapPin className="w-4 h-4 text-primary" /> Event Location *
              </label>
              <input
                type="text"
                placeholder="Enter venue address"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <Phone className="w-4 h-4 text-primary" /> Contact Phone *
              </label>
              <input
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <FileText className="w-4 h-4 text-primary" /> Additional Notes
              </label>
              <textarea
                placeholder="Any special requests?"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Price summary bar */}
      <div className="mt-8 bg-card rounded-2xl p-4 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          {pkg && (
            <div className="text-sm text-muted-foreground">
              {pkg.name} · {selectedMascots.length} mascot{selectedMascots.length !== 1 ? "s" : ""} · {Object.keys(selectedAddOns).length} add-on{Object.keys(selectedAddOns).length !== 1 ? "s" : ""}
            </div>
          )}
          <div className="font-display text-2xl font-bold text-gradient">Total: ${totalPrice}</div>
        </div>
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button variant="hero" onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()}>
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="accent" size="lg" onClick={handleSubmit} disabled={!canProceed()}>
              <PartyPopper className="w-5 h-5" /> Submit Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
