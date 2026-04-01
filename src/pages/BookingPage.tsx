import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check, ChevronLeft, ChevronRight, Calendar, MapPin, Phone,
  FileText, CheckCircle, User, Mail, Heart, Package, Users,
  Puzzle, ClipboardList, Sparkles, Star, Clock, ArrowRight
} from "lucide-react";
import Footer from "@/components/Footer";

const steps = [
  { label: "Package", icon: Package, desc: "Choose your plan" },
  { label: "Mascots", icon: Users, desc: "Pick characters" },
  { label: "Add-ons", icon: Puzzle, desc: "Extra services" },
  { label: "Details", icon: ClipboardList, desc: "Your info" },
];
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

      if (selectedMascots.length > 0) {
        const { error } = await supabase.from("booking_mascots").insert(
          selectedMascots.map((mascotId) => ({ booking_id: booking.id, mascot_id: mascotId }))
        );
        if (error) console.error("Mascot insert error:", error);
      }

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

  /* ─── Success Screen ─── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-lg mx-auto animate-scale-in">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-accent-foreground" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">You're All Set!</h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              Thank you for choosing our company. We appreciate your trust and look forward to making your event unforgettable.
            </p>
            <div className="mt-8 bg-card rounded-2xl border border-border p-6 shadow-card inline-block">
              <p className="text-sm text-muted-foreground">Estimated Total</p>
              <p className="font-display text-4xl font-bold text-foreground">${totalPrice}</p>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              We'll reach out to <span className="font-semibold text-foreground">{formData.phone}</span> to confirm details.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Link to="/">
                <Button variant="outline" size="lg">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Hero Header ─── */}
      <section className="relative overflow-hidden bg-primary py-16 md:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-accent blur-[100px]" />
          <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-secondary blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent tracking-wide uppercase">
              {currentStep === 0 ? "Step 1 of 4" : `Step ${currentStep + 1} of 4`}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            {currentStep === 0 && "Choose Your Package"}
            {currentStep === 1 && "Select Your Characters"}
            {currentStep === 2 && "Customize Your Experience"}
            {currentStep === 3 && "Complete Your Booking"}
          </h1>
          <p className="mt-4 text-primary-foreground/60 text-lg max-w-xl mx-auto">
            {currentStep === 0 && "Start by picking the perfect package for your celebration."}
            {currentStep === 1 && `Pick up to ${pkg?.max_mascots || 1} amazing mascot characters.`}
            {currentStep === 2 && "Add extra entertainment and services to your event."}
            {currentStep === 3 && "Fill in your details and we'll handle the rest."}
          </p>
          {!user && currentStep === 3 && (
            <p className="mt-4 text-xs text-accent">
              <Heart className="w-3 h-3 inline mr-1" />
              Booking as guest — <Link to="/login" className="underline hover:text-accent/80">sign in</Link> to track bookings & earn loyalty points.
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* ─── Step Progress ─── */}
        <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={step.label} className="flex items-center gap-0 flex-1 last:flex-initial">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30 scale-95"
                      : isCurrent
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-semibold transition-colors ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">{step.desc}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 mx-2 mt-[-24px]">
                    <div className={`h-1 rounded-full transition-all duration-500 ${isCompleted ? "bg-accent" : "bg-border"}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Step Content ─── */}
        <div className="animate-fade-in">
          {/* Step 0: Package */}
          {currentStep === 0 && (
            <div>
              {packages && packages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packages.map((p, idx) => {
                    const isSelected = selectedPackage === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => { setSelectedPackage(p.id); setSelectedMascots([]); }}
                        className={`group relative bg-card rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 hover:-translate-y-1 ${
                          isSelected
                            ? "border-accent shadow-lg shadow-accent/20"
                            : "border-border hover:border-accent/40 shadow-card hover:shadow-card-hover"
                        }`}
                      >
                        {p.is_popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <span className="bg-gradient-to-r from-accent to-secondary text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                              <Star className="w-3 h-3" /> Most Popular
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
                            <Check className="w-4 h-4 text-accent-foreground" />
                          </div>
                        )}
                        <div className="mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                            idx === 0 ? "bg-muted" : idx === 1 ? "bg-accent/10" : "bg-primary/10"
                          }`}>
                            <Package className={`w-6 h-6 ${idx === 0 ? "text-muted-foreground" : idx === 1 ? "text-accent" : "text-primary"}`} />
                          </div>
                          <h3 className="font-display text-xl font-bold text-foreground">{p.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                        </div>
                        <div className="mb-4">
                          <span className="font-display text-4xl font-bold text-foreground">${p.base_price}</span>
                          <span className="text-sm text-muted-foreground ml-1">/ event</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <Users className="w-4 h-4 text-accent" />
                          Up to {p.max_mascots} mascot{p.max_mascots !== 1 ? "s" : ""}
                        </div>
                        {p.features && (
                          <ul className="space-y-2 border-t border-border pt-4">
                            {(p.features as string[]).slice(0, 5).map((f) => (
                              <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground">No Packages Available</h3>
                  <p className="text-sm text-muted-foreground mt-2">Check back soon — we're preparing amazing offers!</p>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Mascots */}
          {currentStep === 1 && pkg && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3 shadow-card">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    {selectedMascots.length} / {pkg.max_mascots} selected
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: pkg.max_mascots }).map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i < selectedMascots.length ? "bg-accent scale-110" : "bg-border"}`} />
                    ))}
                  </div>
                </div>
              </div>
              {mascots && mascots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mascots.map((m) => {
                    const isSelected = selectedMascots.includes(m.id);
                    const isFull = selectedMascots.length >= pkg.max_mascots && !isSelected;
                    return (
                      <div
                        key={m.id}
                        onClick={() => !isFull && toggleMascot(m.id)}
                        className={`group relative bg-card rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                          isFull ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1"
                        } ${isSelected
                          ? "border-accent shadow-lg shadow-accent/20"
                          : "border-border hover:border-accent/40 shadow-card hover:shadow-card-hover"
                        }`}
                      >
                        <div className="relative bg-muted aspect-[4/3] overflow-hidden">
                          {m.image_url ? (
                            <img src={m.image_url} alt={m.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-display text-6xl font-bold text-muted-foreground/20">{m.name.charAt(0)}</span>
                            </div>
                          )}
                          {m.category && (
                            <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1 rounded-lg">{m.category}</span>
                          )}
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-xl flex items-center justify-center shadow-lg">
                              <Check className="w-4 h-4 text-accent-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-display text-lg font-bold text-foreground">{m.name}</h3>
                          {m.character && <p className="text-xs font-medium text-accent mt-0.5">{m.character}</p>}
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{m.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground">No Mascots Available</h3>
                  <p className="text-sm text-muted-foreground mt-2">Our characters are being prepped — check back soon!</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Add-ons */}
          {currentStep === 2 && (
            <div>
              {extras && extras.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {extras.map((addon) => {
                    const isIncluded = pkg?.includes_addons?.includes(addon.id);
                    const isSelected = !!selectedAddOns[addon.id];
                    return (
                      <div
                        key={addon.id}
                        onClick={() => !isIncluded && toggleAddOn(addon.id)}
                        className={`group relative bg-card rounded-2xl p-6 transition-all duration-300 border-2 ${
                          isIncluded ? "opacity-60 border-border cursor-default" : "cursor-pointer hover:-translate-y-0.5"
                        } ${isSelected
                          ? "border-accent shadow-lg shadow-accent/20"
                          : "border-border hover:border-accent/40 shadow-card hover:shadow-card-hover"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-display text-lg font-bold text-foreground">{addon.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{addon.description}</p>
                            {addon.category && (
                              <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                                {addon.category}
                              </span>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            {isIncluded ? (
                              <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1.5 rounded-lg">Included</span>
                            ) : isSelected ? (
                              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center">
                                <Check className="w-4 h-4 text-accent-foreground" />
                              </div>
                            ) : (
                              <span className="font-display text-2xl font-bold text-foreground">+${addon.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                  <Puzzle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground">No Add-ons Yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">You can skip this step and proceed.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="max-w-xl mx-auto">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <User className="w-4 h-4 text-accent" /> Full Name
                    </Label>
                    <Input
                      placeholder="Your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <Mail className="w-4 h-4 text-accent" /> Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <Phone className="w-4 h-4 text-accent" /> Phone
                    </Label>
                    <Input
                      type="tel"
                      placeholder="+383..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">Event Type</Label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value as typeof eventTypes[number] })}
                      className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none"
                    >
                      {eventTypes.map((t) => (
                        <option key={t} value={t}>{t.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <Calendar className="w-4 h-4 text-accent" /> Date
                    </Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <Clock className="w-4 h-4 text-accent" /> Time
                    </Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <MapPin className="w-4 h-4 text-accent" /> Location
                    </Label>
                    <Input
                      placeholder="Event venue address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="flex items-center gap-2 mb-2 text-sm font-semibold">
                      <FileText className="w-4 h-4 text-accent" /> Special Requests
                    </Label>
                    <textarea
                      placeholder="Anything else we should know?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="mt-10 bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {pkg && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Summary</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    <span className="bg-muted px-2 py-0.5 rounded-md font-medium text-foreground">{pkg.name}</span>
                    <span>·</span>
                    <span>{selectedMascots.length} mascot{selectedMascots.length !== 1 ? "s" : ""}</span>
                    <span>·</span>
                    <span>{Object.keys(selectedAddOns).length} add-on{Object.keys(selectedAddOns).length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              )}
              <div className="border-l border-border pl-6 hidden sm:block">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total</p>
                <p className="font-display text-3xl font-bold text-foreground">${totalPrice}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <Button variant="outline" size="lg" onClick={() => setCurrentStep((s) => s - 1)} className="rounded-xl">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button variant="default" size="lg" onClick={() => setCurrentStep((s) => s + 1)} disabled={!canProceed()} className="rounded-xl">
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="accent" size="lg" onClick={handleSubmit} disabled={!canProceed() || submitting} className="rounded-xl px-8">
                  {submitting ? "Submitting…" : "Confirm Booking"} {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
