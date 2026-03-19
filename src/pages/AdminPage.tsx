import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, Users, Package, Puzzle, CalendarCheck, Palette, Camera, Sparkles,
  Star, TrendingUp, BarChart3, Shield, ChevronDown
} from "lucide-react";

type Tab = "overview" | "bookings" | "mascots" | "packages" | "extras" | "decorations" | "activities" | "photos" | "reviews" | "gallery";

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  accepted: "bg-green-50 text-green-700 border border-green-200",
  completed: "bg-blue-50 text-blue-700 border border-blue-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("bookings").select("*, packages(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: mascots } = useQuery({
    queryKey: ["admin-mascots"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mascots").select("*").order("name");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: packages } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("packages").select("*").order("base_price");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: extras } = useQuery({
    queryKey: ["admin-extras"],
    queryFn: async () => {
      const { data, error } = await supabase.from("extras").select("*").order("name");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: reviews } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "pending" | "accepted" | "rejected" | "completed" }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Booking status updated" });
    },
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-pulse text-muted-foreground">Loading…</div></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Shield className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground mt-2 text-center">You need admin privileges to access this page.</p>
        <Button variant="default" className="mt-6" onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "bookings" as Tab, label: "Bookings", icon: CalendarCheck },
    { id: "mascots" as Tab, label: "Mascots", icon: Users },
    { id: "packages" as Tab, label: "Packages", icon: Package },
    { id: "extras" as Tab, label: "Extras", icon: Puzzle },
    { id: "decorations" as Tab, label: "Decorations", icon: Palette },
    { id: "activities" as Tab, label: "Activities", icon: Sparkles },
    { id: "photos" as Tab, label: "Photos", icon: Camera },
    { id: "reviews" as Tab, label: "Reviews", icon: Star },
  ];

  const totalRevenue = bookings?.filter((b) => b.status === "completed").reduce((s, b) => s + (b.total_price || 0), 0) || 0;
  const pendingCount = bookings?.filter((b) => b.status === "pending").length || 0;
  const avgRating = reviews?.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 bg-primary border-r border-border p-4 hidden md:block flex-shrink-0">
        <h2 className="font-display text-sm font-bold text-primary-foreground/60 uppercase tracking-widest mb-6 px-2">Admin Panel</h2>
        <nav className="space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50 overflow-x-auto">
        {tabs.slice(0, 5).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium ${
              activeTab === tab.id ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4 mb-0.5" />
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 pb-20 md:pb-6 bg-background overflow-auto">
        {activeTab === "overview" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Bookings", value: bookings?.length || 0, icon: CalendarCheck },
                { label: "Pending", value: pendingCount, icon: BarChart3 },
                { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp },
                { label: "Avg Rating", value: avgRating, icon: Star },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-lg p-5 shadow-card border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <stat.icon className="w-4 h-4 text-accent" />
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent bookings */}
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Bookings</h2>
            <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold text-foreground">Customer</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Package</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Date</th>
                    <th className="text-left p-3 font-semibold text-foreground">Status</th>
                    <th className="text-right p-3 font-semibold text-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.slice(0, 5).map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{b.full_name}</td>
                      <td className="p-3 hidden sm:table-cell">{(b.packages as any)?.name || "—"}</td>
                      <td className="p-3 hidden md:table-cell">{b.event_date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[b.status] || ""}`}>{b.status}</span>
                      </td>
                      <td className="p-3 text-right font-medium">${b.total_price || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">All Bookings</h1>
            <div className="bg-card rounded-lg shadow-card border border-border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold text-foreground">Customer</th>
                    <th className="text-left p-3 font-semibold text-foreground">Email</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Package</th>
                    <th className="text-left p-3 font-semibold text-foreground">Date</th>
                    <th className="text-left p-3 font-semibold text-foreground">Status</th>
                    <th className="text-right p-3 font-semibold text-foreground">Total</th>
                    <th className="text-right p-3 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{b.full_name}{b.is_guest && <span className="ml-1 text-xs text-muted-foreground">(guest)</span>}</td>
                      <td className="p-3 text-muted-foreground">{b.email}</td>
                      <td className="p-3 hidden sm:table-cell">{(b.packages as any)?.name || "—"}</td>
                      <td className="p-3">{b.event_date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[b.status] || ""}`}>{b.status}</span>
                      </td>
                      <td className="p-3 text-right font-medium">${b.total_price || 0}</td>
                      <td className="p-3 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus.mutate({ id: b.id, status: e.target.value })}
                          className="text-xs border border-input rounded-md px-2 py-1 bg-background"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!bookings || bookings.length === 0) && (
                <p className="text-center py-8 text-muted-foreground">No bookings yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "mascots" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Mascots ({mascots?.length || 0})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mascots?.map((m) => (
                <div key={m.id} className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="w-full h-full object-contain p-4" />
                    ) : (
                      <span className="text-4xl font-display font-bold text-muted-foreground">{m.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground">{m.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.category} · ${m.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${m.is_available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        {m.is_available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "packages" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Packages</h1>
            <div className="space-y-4">
              {packages?.map((p) => (
                <div key={p.id} className="bg-card rounded-lg shadow-card border border-border p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
                      {p.is_popular && <span className="text-xs font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-md">Popular</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <p className="font-display text-xl font-bold text-foreground mt-1">${p.base_price} · {p.max_mascots} mascots max</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${p.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "extras" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Extras / Add-ons</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {extras?.map((a) => (
                <div key={a.id} className="bg-card rounded-lg shadow-card border border-border p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-bold text-foreground">{a.name}</h3>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                      <p className="font-display text-lg font-bold text-foreground mt-2">${a.price}</p>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">{a.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Reviews ({reviews?.length || 0})</h1>
            <div className="space-y-4">
              {reviews?.map((r) => (
                <div key={r.id} className="bg-card rounded-lg shadow-card border border-border p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-accent fill-accent" : "text-border"}`} />
                      ))}
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${r.is_visible ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {r.is_visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-foreground">{r.comment}</p>}
                  <p className="text-xs text-muted-foreground mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              ))}
              {(!reviews || reviews.length === 0) && (
                <p className="text-center py-8 text-muted-foreground">No reviews yet.</p>
              )}
            </div>
          </div>
        )}

        {(activeTab === "decorations" || activeTab === "activities" || activeTab === "photos" || activeTab === "gallery") && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Manage {activeTab} through the database. Full CRUD coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
