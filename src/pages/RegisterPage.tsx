import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Eye, EyeOff, ArrowRight, Gift, CalendarCheck, Star } from "lucide-react";
import Footer from "@/components/Footer";

const perks = [
  { icon: CalendarCheck, text: "Track all your bookings in one place" },
  { icon: Gift, text: "Earn loyalty points on every event" },
  { icon: Star, text: "Leave reviews and rate our services" },
];

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to verify your account before signing in." });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-accent mx-auto flex items-center justify-center mb-4 shadow-accent">
              <UserPlus className="w-6 h-6 text-accent-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join us and start booking amazing events</p>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {perks.map((perk) => (
              <div key={perk.text} className="flex items-center gap-2 bg-muted/60 rounded-lg px-4 py-2.5">
                <perk.icon className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-xs font-medium text-foreground">{perk.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleRegister} className="bg-card rounded-lg p-8 shadow-card-hover border border-border space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+383 4X XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="accent" size="lg" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"} {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
