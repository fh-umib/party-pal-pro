import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import SeasonalBanner from "@/components/SeasonalBanner";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import MascotsPage from "./pages/MascotsPage";
import PackagesPage from "./pages/PackagesPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";
import DecorationsPage from "./pages/DecorationsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import PhotoServicesPage from "./pages/PhotoServicesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GalleryPage from "./pages/GalleryPage";
import ReviewsPage from "./pages/ReviewsPage";
import StaffPage from "./pages/StaffPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingContact from "@/components/FloatingContact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <SeasonalBanner />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/decorations" element={<DecorationsPage />} />
            <Route path="/mascots" element={<MascotsPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/photo-services" element={<PhotoServicesPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
