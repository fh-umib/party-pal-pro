import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { packages, mascots, addOns, type Mascot, type AddOn } from "@/data/mockData";
import MascotCard from "@/components/MascotCard";
import { Check, ChevronLeft, ChevronRight, Calendar, MapPin, Phone, FileText, CheckCircle } from "lucide-react";

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
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Booking Submitted</h1>
          <p className="mt-4 text-muted-foreground">
            Thank you! We've received your booking request. Our team will contact you shortly to confirm the details.
          </p>
          <p className="mt-2 font-semibold text-foreground font-display text-xl">Total: ${totalPrice}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            Book Your Event
          </h1>
          <p className="mt-2 text-primary-foreground/60">Customize your perfect celebration step by step.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-1 mb-10">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                i < currentStep ? "bg-accent text-accent-foreground" :
                i === currentStep ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${
                i === currentStep ? "text-foreground" : "text-muted-foreground"
              }`}>{step}</span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < currentStep ? "bg-accent" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="animate-fade-in">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPackage(p.id)}
                  className={`bg-card rounded-lg p-5 cursor-pointer shadow-card transition-all hover:shadow-card-hover border ${
                    selectedPackage === p.id ? "border-accent ring-2 ring-accent" : "border-border"
                  }`}
                >
                  <h3 className="font-display text-xl font-bold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-3">${p.basePrice}</p>
                  <p className="text-xs text-muted-foreground mt-1">Up to {p.maxMascots} mascots</p>
                </div>
              ))}
            </div>
          )}

          {currentStep === 1 && pkg && (
            <div>
              <p className="text-center text-muted-foreground mb-6">
                Select up to <span className="font-semibold text-foreground">{pkg.maxMascots}</span> mascots
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
                    className={`bg-card rounded-lg p-5 transition-all shadow-card hover:shadow-card-hover border ${
                      isIncluded ? "opacity-60 border-border" : "cursor-pointer"
                    } ${isSelected ? "border-accent ring-2 ring-accent" : "border-border"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">{addon.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{addon.description}</p>
                      </div>
                      {isIncluded ? (
                        <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-md">Included</span>
                      ) : isSelected ? (
                        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                          <Check className="w-4 h-4 text-accent-foreground" />
                        </div>
                      ) : null}
                    </div>
                    {!isIncluded && (
                      <p className="font-display text-xl font-bold text-foreground mt-3">+${addon.price}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <Calendar className="w-4 h-4 text-accent" /> Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-11 px-4 rounded-md border border-input bg-card text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <Calendar className="w-4 h-4 text-accent" /> Event Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full h-11 px-4 rounded-md border border-input bg-card text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <MapPin className="w-4 h-4 text-accent" /> Event Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter venue address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full h-11 px-4 rounded-md border border-input bg-card text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <Phone className="w-4 h-4 text-accent" /> Contact Phone *
                </label>
                <input
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-11 px-4 rounded-md border border-input bg-card text-foreground focus:ring-2 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <FileText className="w-4 h-4 text-accent" /> Additional Notes
                </label>
                <textarea
                  placeholder="Any special requests?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-md border border-input bg-card text-foreground focus:ring-2 focus:ring-accent outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Price summary bar */}
        <div className="mt-8 bg-card rounded-lg p-5 shadow-card border border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            {pkg && (
              <div className="text-sm text-muted-foreground">
                {pkg.name} · {selectedMascots.length} mascot{selectedMascots.length !== 1 ? "s" : ""} · {Object.keys(selectedAddOns).length} add-on{Object.keys(selectedAddOns).length !== 1 ? "s" : ""}
              </div>
            )}
            <div className="font-display text-2xl font-bold text-foreground">Total: ${totalPrice}</div>
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)}>
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button variant="default" onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="accent" size="lg" onClick={handleSubmit} disabled={!canProceed()}>
                Submit Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
