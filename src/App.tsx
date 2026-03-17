import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index.tsx";
import MascotsPage from "./pages/MascotsPage.tsx";
import PackagesPage from "./pages/PackagesPage.tsx";
import BookingPage from "./pages/BookingPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import DecorationsPage from "./pages/DecorationsPage.tsx";
import ActivitiesPage from "./pages/ActivitiesPage.tsx";
import PhotoServicesPage from "./pages/PhotoServicesPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/decorations" element={<DecorationsPage />} />
          <Route path="/mascots" element={<MascotsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/photo-services" element={<PhotoServicesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
