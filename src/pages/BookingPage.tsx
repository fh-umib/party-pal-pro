import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronLeft, ChevronRight, Calendar, MapPin, Phone, FileText, CheckCircle, User, Mail, Heart } from "lucide-react";
import Footer from "@/components/Footer";

const steps = ["Package", "Mascots", "Add-ons", "Details"];
const eventTypes = ["birthday", "wedding", "engagement", "anniversary", "grand_opening", "corporate", "other"] as const;

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedPkg = searchParams.get("package");
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(preselectedPkg ? 1 : 0);
  const [selectedPackage, setSelectedPackage] = useState(preselectedPkg || "");
  const [selectedMascots, setSelectedMascots] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", date: "", time: "", location: "", notes: "",
    eventType: "birthday" as typeof eventTypes[number],
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").eq("is_active", true).order("base_price");
      if (error) throw error;
      return data;
    },
  });

  const { data: mascots } = useQuery({
    queryKey: ["mascots"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mascots").select("*").eq("is_available", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: extras } = useQuery({
    queryKey: ["extras"],
    queryFn: async () => {
      const { data, error } = await supabase.from("extras").select("*").eq("is_active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const pkg = packages?.find((p) => p.id === selectedPackage);

  const toggleMascot = (mascotId: string) => {
    if (!pkg) return;
    setSelectedMascots((prev) => {
      if (prev.includes(mascotId)) return prev.filter((id) => id !== mascotId);
      if (prev.length >= pkg.max_mascots) return prev;
      return [...prev, mascotId];
    });
  };

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns((prev) => {
      const copy = { ...prev };
      if (copy[addonId]) delete copy[addonId];
      else copy[addonId] = 1;
      return copy;
    });
  };

  const totalPrice = useMemo(() => {
    if (!pkg) return 0;
    const addOnTotal = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
      const addon = extras?.find((a) => a.id === id);
      return sum + (addon ? addon.price * qty : 0);
    }, 0);
    return pkg.base_price + addOnTotal;
  }, [pkg, selectedAddOns, extras]);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedPackage;
      case 1: return selectedMascots.length > 0;
      case 2: return true;
      case 3: return formData.date && formData.location && formData.phone && formData.fullName && formData.email;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data: booking, error: bookingError } = await supabase.from("bookings").insert({
        user_id: user?.id || null,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        event_date: formData.date,
        event_time: formData.time || null,
        location: formData.location,
        notes: formData.notes || null,
        event_type: formData.eventType,
        package_id: selectedPackage,
        total_price: totalPrice,
        is_guest: !user,
        status: "pending",
      }).select().single();

      if (bookingError) throw bookingError;

      // Insert mascots
      if (selectedMascots.length > 0) {
        const { error } = await supabase.from("booking_mascots").insert(
          selectedMascots.map((mascotId) => ({ booking_id: booking.id, mascot_id: mascotId }))
        );
        if (error) console.error("Mascot insert error:", error);
      }

      // Insert extras
      const addonEntries = Object.entries(selectedAddOns);
      if (addonEntries.length > 0) {
        const { error } = await supabase.from("booking_extras").insert(
          addonEntries.map(([extraId, qty]) => ({ booking_id: booking.id, extra_id: extraId, quantity: qty }))
        );
        if (error) console.error("Extra insert error:", error);
      }

      setSubmitted(true);
      toast({ title: "Booking submitted!", description: "Our team will contact you shortly." });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-lg mx-auto animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Booking Submitted!</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Thank you for choosing our company. We appreciate your trust and look forward to making your event unforgettable.
            </p>
            <p className="mt-4 font-semibold text-foreground font-display text-2xl">Total: ${totalPrice}</p>
            <p className="mt-2 text-sm text-muted-foreground">Our team will contact you at {formData.phone} to confirm the details.</p>
            <div className="flex gap-4 justify-center mt-8">
              <a href="/">
                <Button variant="default">Back to Home</Button>
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Book Your Event</h1>
          <p className="mt-2 text-primary-foreground/60">Customize your perfect celebration step by step.</p>
          {!user && (
            <p className="mt-3 text-xs text-accent">
              <Heart className="w-3 h-3 inline mr-1" />
              Booking as guest — <a href="/login" className="underline">sign in</a> to track bookings & earn loyalty points.
            </p>
          )}
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
              <span className={`text-xs font-medium hidden sm:inline ${i === currentStep ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < currentStep ? "bg-accent" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="animate-fade-in">
          {/* Step 0: Package */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {packages?.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { setSelectedPackage(p.id); setSelectedMascots([]); }}
                  className={`bg-card rounded-lg p-5 cursor-pointer shadow-card transition-all hover:shadow-card-hover border ${
                    selectedPackage === p.id ? "border-accent ring-2 ring-accent" : "border-border"
                  } ${p.is_popular ? "relative" : ""}`}
                >
                  {p.is_popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                  )}
                  <h3 className="font-display text-xl font-bold text-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-3">${p.base_price}</p>
                  <p className="text-xs text-muted-foreground mt-1">Up to {p.max_mascots} mascots</p>
                  {p.features && (
                    <ul className="mt-3 space-y-1">
                      {(p.features as string[]).slice(0, 4).map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-accent" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Mascots */}
          {currentStep === 1 && pkg && (
            <div>
              <p className="text-center text-muted-foreground mb-6">
                Select up to <span className="font-semibold text-foreground">{pkg.max_mascots}</span> mascots
                ({selectedMascots.length}/{pkg.max_mascots} selected)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mascots?.map((m) => {
                  const isSelected = selectedMascots.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleMascot(m.id)}
                      className={`bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border cursor-pointer ${
                        isSelected ? "border-accent ring-2 ring-accent" : "border-border"
                      }`}
                    >
                      <div className="relative bg-muted aspect-square">
                        {m.image_url ? (
                          <img src={m.image_url} alt={m.name} className="w-full h-full object-contain p-4" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-display text-4xl font-bold">
                            {m.name.charAt(0)}
                          </div>
                        )}
                        {m.category && (
                          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">{m.category}</span>
                        )}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-7 h-7 bg-accent rounded-md flex items-center justify-center">
                            <Check className="w-4 h-4 text-accent-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display text-lg font-bold text-foreground">{m.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Add-ons */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {extras?.map((addon) => {
                const isIncluded = pkg?.includes_addons?.includes(addon.id);
                const isSelected = !!selectedAddOns[addon.id];
                return (
                  <div
                    key={addon.id}
                    onClick={() => !isIncluded && toggleAddOn(addon.id)}
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
                    {!isIncluded && <p className="font-display text-xl font-bold text-foreground mt-3">+${addon.price}</p>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="flex items-center gap-2 mb-1.5"><User className="w-4 h-4 text-accent" /> Full Name *</Label>
                  <Input placeholder="Your full name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><Mail className="w-4 h-4 text-accent" /> Email *</Label>
                  <Input type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><Phone className="w-4 h-4 text-accent" /> Phone *</Label>
                  <Input type="tel" placeholder="+383..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1.5">Event Type</Label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value as typeof eventTypes[number] })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                >
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>{t.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><Calendar className="w-4 h-4 text-accent" /> Date *</Label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div>
                  <Label className="flex items-center gap-2 mb-1.5"><Calendar className="w-4 h-4 text-accent" /> Time</Label>
                  <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1.5"><MapPin className="w-4 h-4 text-accent" /> Location *</Label>
                <Input placeholder="Event venue address" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-1.5"><FileText className="w-4 h-4 text-accent" /> Notes</Label>
                <textarea
                  placeholder="Any special requests?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none resize-none"
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
              <Button variant="accent" size="lg" onClick={handleSubmit} disabled={!canProceed() || submitting}>
                {submitting ? "Submitting…" : "Submit Booking"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
