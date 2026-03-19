import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Award, CheckCircle, CalendarClock, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import serviceDecorations from "@/assets/service-decorations.jpg";
import serviceMascots from "@/assets/service-mascots.jpg";
import serviceActivities from "@/assets/service-activities.jpg";
import servicePhoto from "@/assets/service-photo.jpg";
import Footer from "@/components/Footer";

const services = [
  { title: "Decorations", description: "Elegant setups for weddings, birthdays, engagements, anniversaries, and grand openings.", image: serviceDecorations, link: "/decorations" },
  { title: "Mascot Characters", description: "Over 50 unique mascot characters to bring joy and excitement to every celebration.", image: serviceMascots, link: "/mascots" },
  { title: "Activities & Entertainment", description: "Face painting, bounce houses, ball houses, and music — exclusive attractions in Kosovo.", image: serviceActivities, link: "/activities" },
  { title: "Photo Experiences", description: "360° Photo Booth and Photo Box stations to capture every unforgettable moment.", image: servicePhoto, link: "/photo-services" },
];

const stats = [
  { icon: Users, label: "Happy Clients", value: "5,000+" },
  { icon: Star, label: "5-Star Reviews", value: "200+" },
  { icon: Award, label: "Events Delivered", value: "800+" },
];

const Index = () => {
  const { data: reviews } = useQuery({
    queryKey: ["featured-reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("is_visible", true)
        .gte("rating", 4)
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Premium event background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
        </div>
        <div className="relative container mx-auto px-4 pt-24 pb-32 text-center">
          <p className="text-primary-foreground/80 text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in">
            Premium Event Services in Kosovo
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto animate-fade-in">
            Creating Extraordinary Events & Celebrations
          </h1>
          <p className="mt-6 text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto animate-fade-in">
            From elegant decorations to captivating entertainment — we craft bespoke experiences that make every occasion truly memorable.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center animate-fade-in">
            <Link to="/packages">
              <Button variant="accent" size="xl">
                Explore Our Packages <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/booking">
              <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Book an Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-card rounded-lg shadow-card-hover p-8 grid grid-cols-3 max-w-2xl mx-auto gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">What We Offer</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Services</h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Select a category to explore our full range of professional event services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <Link key={service.title} to={service.link} className="group relative overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl md:text-2xl font-bold text-primary-foreground">{service.title}</h3>
                <p className="text-primary-foreground/70 text-sm mt-1 line-clamp-2">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-accent text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Why Choose Us</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">The MD Creative Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Premium Quality", desc: "Every detail is meticulously planned with the highest quality materials and execution." },
              { title: "Exclusive Attractions", desc: "We are the only provider in Kosovo offering select entertainment attractions." },
              { title: "Custom Packages", desc: "Build your perfect event by combining services, mascots, and activities your way." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <CheckCircle className="w-8 h-8 text-accent mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-primary-foreground mb-2">{item.title}</h3>
                <p className="text-primary-foreground/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Testimonials</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-lg p-6 shadow-card border border-border">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
                {review.comment && <p className="text-foreground text-sm leading-relaxed">"{review.comment}"</p>}
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/reviews">
              <Button variant="outline">View All Reviews <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </section>
      )}

      {/* Seasonal Notice */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <CalendarClock className="w-8 h-8 text-accent mx-auto mb-4" />
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Peak Season Notice</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            June, July, August, and September are peak season months. Please book at least 1 week in advance to secure your preferred date.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Ready to Create Something Extraordinary?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Let us bring your vision to life. Choose a package, customize your services, and leave the rest to us.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Link to="/booking">
              <Button variant="accent" size="xl">
                Start Planning Your Event <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="tel:+38349000000">
              <Button variant="outline" size="xl">
                <Phone className="w-4 h-4" /> Call Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
