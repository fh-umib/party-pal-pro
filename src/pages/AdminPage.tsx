import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mascots, packages, addOns, decorationCategories, activities, photoServices } from "@/data/mockData";
import { LayoutDashboard, Users, Package, Puzzle, CalendarCheck, Plus, Pencil, Trash2, Palette, Camera, Sparkles } from "lucide-react";

type Tab = "overview" | "mascots" | "packages" | "addons" | "decorations" | "activities" | "photos" | "bookings";

const mockBookings = [
  { id: "B001", customer: "Sarah Johnson", package: "Premium", date: "2026-04-15", status: "Confirmed" as const, total: 349 },
  { id: "B002", customer: "Mike Chen", package: "Grand", date: "2026-04-20", status: "Pending" as const, total: 574 },
  { id: "B003", customer: "Emma Wilson", package: "Essential", date: "2026-03-28", status: "Completed" as const, total: 149 },
  { id: "B004", customer: "James Davis", package: "Premium", date: "2026-05-01", status: "Cancelled" as const, total: 299 },
];

const statusColors: Record<string, string> = {
  Confirmed: "bg-green-50 text-green-700 border border-green-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Completed: "bg-blue-50 text-blue-700 border border-blue-200",
  Cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "mascots" as Tab, label: "Mascots", icon: Users },
    { id: "packages" as Tab, label: "Packages", icon: Package },
    { id: "addons" as Tab, label: "Add-ons", icon: Puzzle },
    { id: "decorations" as Tab, label: "Decorations", icon: Palette },
    { id: "activities" as Tab, label: "Activities", icon: Sparkles },
    { id: "photos" as Tab, label: "Photo Services", icon: Camera },
    { id: "bookings" as Tab, label: "Bookings", icon: CalendarCheck },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 bg-primary border-r border-border p-4 hidden md:block">
        <h2 className="font-display text-sm font-bold text-primary-foreground/60 uppercase tracking-widest mb-6 px-2">Admin</h2>
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
              <tab.icon className="w-4 h-4" />
              {tab.label}
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
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium min-w-0 ${
              activeTab === tab.id ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4 mb-0.5" />
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 pb-20 md:pb-6 bg-background">
        {activeTab === "overview" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Bookings", value: mockBookings.length },
                { label: "Mascots", value: mascots.length },
                { label: "Packages", value: packages.length },
                { label: "Add-ons", value: addOns.length },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-lg p-5 shadow-card border border-border">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Bookings</h2>
            <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold text-foreground">ID</th>
                    <th className="text-left p-3 font-semibold text-foreground">Customer</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Package</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Date</th>
                    <th className="text-left p-3 font-semibold text-foreground">Status</th>
                    <th className="text-right p-3 font-semibold text-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{b.id}</td>
                      <td className="p-3">{b.customer}</td>
                      <td className="p-3 hidden sm:table-cell">{b.package}</td>
                      <td className="p-3 hidden md:table-cell">{b.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">${b.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "mascots" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Mascots</h1>
              <Button variant="default" size="sm"><Plus className="w-4 h-4" /> Add Mascot</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mascots.map((m) => (
                <div key={m.id} className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
                  <div className="aspect-square bg-muted">
                    <img src={m.image} alt={m.name} className="w-full h-full object-contain p-4" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground">{m.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.category}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm"><Pencil className="w-3 h-3" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "packages" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Packages</h1>
              <Button variant="default" size="sm"><Plus className="w-4 h-4" /> Add Package</Button>
            </div>
            <div className="space-y-4">
              {packages.map((p) => (
                <div key={p.id} className="bg-card rounded-lg shadow-card border border-border p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <p className="font-display text-xl font-bold text-foreground mt-1">${p.basePrice}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Pencil className="w-3 h-3" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "addons" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Add-ons</h1>
              <Button variant="default" size="sm"><Plus className="w-4 h-4" /> Add Add-on</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map((a) => (
                <div key={a.id} className="bg-card rounded-lg shadow-card border border-border p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-bold text-foreground">{a.name}</h3>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                      <p className="font-display text-lg font-bold text-foreground mt-2">${a.price}</p>
                    </div>
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">{a.category}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm"><Pencil className="w-3 h-3" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "decorations" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Decorations</h1>
              <Button variant="default" size="sm"><Plus className="w-4 h-4" /> Add Category</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {decorationCategories.map((cat) => (
                <div key={cat.id} className="bg-card rounded-lg shadow-card border border-border p-5">
                  <h3 className="font-display font-bold text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm"><Pencil className="w-3 h-3" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Activities</h1>
              <Button variant="default" size="sm"><Plus className="w-4 h-4" /> Add Activity</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activities.map((act) => (
                <div key={act.id} className="bg-card rounded-lg shadow-card border border-border p-5">
                  <h3 className="font-display font-bold text-foreground">{act.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{act.description}</p>
                  {act.isExclusive && (
                    <span className="inline-block mt-2 text-xs font-medium bg-accent/10 text-accent px-2 py-0.5 rounded-md">Exclusive</span>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm"><Pencil className="w-3 h-3" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">Photo Services</h1>
              <Button variant="default" size="sm"><Plus className="w-4 h-4" /> Add Service</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photoServices.map((ps) => (
                <div key={ps.id} className="bg-card rounded-lg shadow-card border border-border p-5">
                  <h3 className="font-display font-bold text-foreground">{ps.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{ps.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm"><Pencil className="w-3 h-3" /> Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              ))}
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
                    <th className="text-left p-3 font-semibold text-foreground">ID</th>
                    <th className="text-left p-3 font-semibold text-foreground">Customer</th>
                    <th className="text-left p-3 font-semibold text-foreground">Package</th>
                    <th className="text-left p-3 font-semibold text-foreground">Date</th>
                    <th className="text-left p-3 font-semibold text-foreground">Status</th>
                    <th className="text-right p-3 font-semibold text-foreground">Total</th>
                    <th className="text-right p-3 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{b.id}</td>
                      <td className="p-3">{b.customer}</td>
                      <td className="p-3">{b.package}</td>
                      <td className="p-3">{b.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">${b.total}</td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="sm"><Pencil className="w-3 h-3" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
