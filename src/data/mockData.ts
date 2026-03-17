import mascotSuperhero from "@/assets/mascot-superhero.png";
import mascotPrincess from "@/assets/mascot-princess.png";
import mascotPirate from "@/assets/mascot-pirate.png";
import mascotUnicorn from "@/assets/mascot-unicorn.png";
import mascotDino from "@/assets/mascot-dino.png";
import mascotRobot from "@/assets/mascot-robot.png";

export interface Mascot {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  isAvailable: boolean;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  maxMascots: number;
  includesAddons: string[];
  isPopular?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

export interface DecorationCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  image?: string;
  isExclusive?: boolean;
}

export interface PhotoService {
  id: string;
  name: string;
  description: string;
  image?: string;
}

export const mascots: Mascot[] = [
  { id: "1", name: "Captain Courage", description: "Our fearless superhero ready to save the party! Perfect for action-packed events.", image: mascotSuperhero, category: "Superheroes", isAvailable: true },
  { id: "2", name: "Princess Sparkle", description: "A magical royal who brings fairy tale dreams to life with grace and charm.", image: mascotPrincess, category: "Princesses", isAvailable: true },
  { id: "3", name: "Captain Blackbeard", description: "Ahoy! This friendly pirate brings treasure hunts and sea adventures to your event.", image: mascotPirate, category: "Adventure", isAvailable: true },
  { id: "4", name: "Rainbow Star", description: "A magical unicorn that spreads joy, sparkles, and rainbow magic everywhere!", image: mascotUnicorn, category: "Fantasy", isAvailable: true },
  { id: "5", name: "Rex the Dino", description: "A prehistoric pal who loves dancing, games, and making kids roar with laughter!", image: mascotDino, category: "Adventure", isAvailable: true },
  { id: "6", name: "Bolt the Robot", description: "A futuristic friend with cool moves and space-age entertainment skills.", image: mascotRobot, category: "Superheroes", isAvailable: true },
];

export const mascotCategories = ["All", "Superheroes", "Princesses", "Adventure", "Fantasy"];

export const packages: Package[] = [
  {
    id: "1",
    name: "Essential",
    description: "A refined package for intimate celebrations.",
    basePrice: 149,
    features: ["1 Mascot Character", "1 Hour Entertainment", "Party Music", "Photo Opportunities"],
    maxMascots: 1,
    includesAddons: [],
  },
  {
    id: "2",
    name: "Premium",
    description: "Our most popular package for unforgettable celebrations.",
    basePrice: 299,
    features: ["2 Mascot Characters", "2 Hours Entertainment", "Face Painting", "Party Music", "Party Games", "Photo Booth"],
    maxMascots: 2,
    includesAddons: ["face-painting"],
    isPopular: true,
  },
  {
    id: "3",
    name: "Grand",
    description: "The ultimate luxury experience with everything included.",
    basePrice: 499,
    features: ["3 Mascot Characters", "3 Hours Entertainment", "Face Painting", "Balloon Art", "Decorations", "Photo Booth", "Bounce House"],
    maxMascots: 3,
    includesAddons: ["face-painting", "balloon-art", "decorations"],
  },
];

export const addOns: AddOn[] = [
  { id: "face-painting", name: "Face Painting", description: "Professional face painting with premium equipment", price: 50, category: "Activities", isActive: true },
  { id: "balloon-art", name: "Balloon Art", description: "Custom balloon sculptures and decorations", price: 40, category: "Activities", isActive: true },
  { id: "decorations", name: "Event Decorations", description: "Themed decorations for your venue", price: 75, category: "Equipment", isActive: true },
  { id: "photo-booth", name: "360° Photo Booth", description: "Interactive 360-degree photo experience", price: 80, category: "Photo", isActive: true },
  { id: "bounce-house", name: "Bounce House", description: "Exclusive bouncy castle entertainment", price: 100, category: "Activities", isActive: true },
  { id: "ball-house", name: "Ball House", description: "Colorful ball pit experience for children", price: 70, category: "Activities", isActive: true },
  { id: "extra-hour", name: "Extra Hour", description: "Extend the event with an additional hour", price: 80, category: "Time", isActive: true },
  { id: "party-bags", name: "Party Bags", description: "Goodie bags for all young guests", price: 35, category: "Extras", isActive: true },
];

export const decorationCategories: DecorationCategory[] = [
  { id: "birthday", name: "Birthday Decorations", description: "Elegant and themed birthday setups for all ages." },
  { id: "wedding", name: "Wedding Decorations", description: "Sophisticated floral and décor arrangements for your special day." },
  { id: "engagement", name: "Engagement Party", description: "Beautiful setups to celebrate your love story." },
  { id: "anniversary", name: "Anniversary Decorations", description: "Elegant designs marking milestone celebrations." },
  { id: "grand-opening", name: "Grand Opening", description: "Professional setups for business launches and inaugurations." },
];

export const eventFurniture = [
  { id: "chairs", name: "Premium Event Chairs", description: "Elegant chairs with professional setup for any occasion." },
  { id: "tables-white", name: "Tables — White Cover", description: "Classic white tablecloth setup for a clean, refined look." },
  { id: "tables-black", name: "Tables — Black Cover", description: "Sophisticated black tablecloth setup for formal events." },
  { id: "tables-cream", name: "Tables — Cream Cover", description: "Warm cream tablecloth setup for an inviting atmosphere." },
];

export const activities: Activity[] = [
  { id: "face-painting", name: "Professional Face Painting", description: "Expert face painting with professional-grade equipment and hypoallergenic paints.", isExclusive: false },
  { id: "music", name: "Music & Party Entertainment", description: "Professional DJ and music entertainment to keep the energy high." },
  { id: "bounce-house", name: "Bounce House / Bouncy Castle", description: "Premium inflatable bounce houses for endless fun.", isExclusive: true },
  { id: "ball-house", name: "Ball House", description: "A colorful ball pit experience that children love.", isExclusive: true },
];

export const photoServices: PhotoService[] = [
  { id: "360-booth", name: "360° Photo Booth", description: "A cutting-edge 360-degree rotating photo and video experience that captures every angle." },
  { id: "photo-box", name: "Photo Box / Photo Booth Station", description: "A classic photo booth station with props, instant prints, and digital copies." },
];
