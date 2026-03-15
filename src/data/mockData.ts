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

export const mascots: Mascot[] = [
  { id: "1", name: "Captain Courage", description: "Our fearless superhero ready to save the party! Perfect for action-packed events.", image: mascotSuperhero, category: "Superheroes", isAvailable: true },
  { id: "2", name: "Princess Sparkle", description: "A magical royal who brings fairy tale dreams to life with grace and charm.", image: mascotPrincess, category: "Princesses", isAvailable: true },
  { id: "3", name: "Captain Blackbeard", description: "Ahoy! This friendly pirate brings treasure hunts and sea adventures to your event.", image: mascotPirate, category: "Adventure", isAvailable: true },
  { id: "4", name: "Rainbow Star", description: "A magical unicorn that spreads joy, sparkles, and rainbow magic everywhere!", image: mascotUnicorn, category: "Fantasy", isAvailable: true },
  { id: "5", name: "Rex the Dino", description: "A prehistoric pal who loves dancing, games, and making kids roar with laughter!", image: mascotDino, category: "Adventure", isAvailable: true },
  { id: "6", name: "Bolt the Robot", description: "A futuristic friend with cool moves and space-age entertainment skills.", image: mascotRobot, category: "Superheroes", isAvailable: true },
];

export const packages: Package[] = [
  {
    id: "1",
    name: "Mini Party",
    description: "Perfect for small gatherings. A taste of the magic!",
    basePrice: 149,
    features: ["1 Mascot Character", "1 Hour Entertainment", "Party Music", "Photo Opportunities"],
    maxMascots: 1,
    includesAddons: [],
  },
  {
    id: "2",
    name: "Super Party",
    description: "The most popular choice for unforgettable celebrations!",
    basePrice: 299,
    features: ["2 Mascot Characters", "2 Hours Entertainment", "Face Painting", "Party Music", "Party Games", "Photo Booth"],
    maxMascots: 2,
    includesAddons: ["face-painting"],
    isPopular: true,
  },
  {
    id: "3",
    name: "Mega Party",
    description: "The ultimate party experience with everything included!",
    basePrice: 499,
    features: ["3 Mascot Characters", "3 Hours Entertainment", "Face Painting", "Balloon Art", "Party Games", "Decorations", "Photo Booth", "Party Equipment"],
    maxMascots: 3,
    includesAddons: ["face-painting", "balloon-art", "decorations"],
  },
];

export const addOns: AddOn[] = [
  { id: "face-painting", name: "Face Painting", description: "Professional face painting for all guests", price: 50, category: "Activities", isActive: true },
  { id: "balloon-art", name: "Balloon Art", description: "Custom balloon sculptures and decorations", price: 40, category: "Activities", isActive: true },
  { id: "decorations", name: "Party Decorations", description: "Themed decorations for your venue", price: 75, category: "Equipment", isActive: true },
  { id: "photo-booth", name: "Photo Booth", description: "Fun photo booth with props and prints", price: 60, category: "Activities", isActive: true },
  { id: "extra-hour", name: "Extra Hour", description: "Extend the fun with an additional hour", price: 80, category: "Time", isActive: true },
  { id: "party-bags", name: "Party Bags", description: "Goodie bags for all little guests", price: 35, category: "Extras", isActive: true },
];

export const mascotCategories = ["All", "Superheroes", "Princesses", "Adventure", "Fantasy"];
