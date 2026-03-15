import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mascots, packages, addOns } from "@/data/mockData";
import { LayoutDashboard, Users, Package, Puzzle, CalendarCheck, Plus, Pencil, Trash2 } from "lucide-react";

type Tab = "overview" | "mascots" | "packages" | "addons" | "bookings";

const mockBookings = [
  { id: "B001", customer: "Sarah Johnson", package: "Super Party", date: "2026-04-15", status: "Confirmed" as const, total: 349 },
  { id: "B002", customer: "Mike Chen", package: "Mega Party", date: "2026-04-20", status: "Pending" as const, total: 574 },
  { id: "B003", customer: "Emma Wilson", package: "Mini Party", date: "2026-03-28", status: "Completed" as const, total: 149 },
  { id: "B004", customer: "James Davis", package: "Super Party", date: "2026-05-01", status: "Cancelled" as const, total: 299 },
];

const statusColors: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Completed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "mascots" as Tab, label: "Mascots", icon: Users },
    { id: "packages" as Tab, label: "Packages", icon: Package },
    { id: "addons" as Tab, label: "Add-ons", icon: Puzzle },
    { id: "bookings" as Tab, label: "Bookings", icon: CalendarCheck },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-4 hidden md:block">
        <h2 className="font-display text-lg font-bold text-foreground mb-6 px-2">Admin Panel</h2>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-semibold ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4 mb-0.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 pb-20 md:pb-6">
        {activeTab === "overview" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Bookings", value: mockBookings.length, color: "bg-primary/10 text-primary" },
                { label: "Mascots", value: mascots.length, color: "bg-secondary/20 text-secondary" },
                { label: "Packages", value: packages.length, color: "bg-accent/20 text-accent-foreground" },
                { label: "Add-ons", value: addOns.length, color: "bg-green-100 text-green-700" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-2xl p-5 shadow-card">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Bookings</h2>
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">ID</th>
                    <th className="text-left p-3 font-semibold">Customer</th>
                    <th className="text-left p-3 font-semibold hidden sm:table-cell">Package</th>
                    <th className="text-left p-3 font-semibold hidden md:table-cell">Date</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-right p-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-semibold">{b.id}</td>
                      <td className="p-3">{b.customer}</td>
                      <td className="p-3 hidden sm:table-cell">{b.package}</td>
                      <td className="p-3 hidden md:table-cell">{b.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold">${b.total}</td>
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
              <h1 className="font-display text-2xl font-bold text-foreground">Manage Mascots</h1>
              <Button variant="hero" size="sm"><Plus className="w-4 h-4" /> Add Mascot</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mascots.map((m) => (
                <div key={m.id} className="bg-card rounded-2xl shadow-card overflow-hidden">
                  <div className="aspect-square bg-muted">
                    <img src={m.image} alt={m.name} className="w-full h-full object-contain p-4" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold">{m.name}</h3>
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
              <h1 className="font-display text-2xl font-bold text-foreground">Manage Packages</h1>
              <Button variant="hero" size="sm"><Plus className="w-4 h-4" /> Add Package</Button>
            </div>
            <div className="space-y-4">
              {packages.map((p) => (
                <div key={p.id} className="bg-card rounded-2xl shadow-card p-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                    <p className="font-display text-xl font-bold text-gradient mt-1">${p.basePrice}</p>
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
              <h1 className="font-display text-2xl font-bold text-foreground">Manage Add-ons</h1>
              <Button variant="hero" size="sm"><Plus className="w-4 h-4" /> Add Add-on</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map((a) => (
                <div key={a.id} className="bg-card rounded-2xl shadow-card p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-display font-bold">{a.name}</h3>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                      <p className="font-display text-lg font-bold text-gradient mt-2">${a.price}</p>
                    </div>
                    <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-full">{a.category}</span>
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

        {activeTab === "bookings" && (
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-6">All Bookings</h1>
            <div className="bg-card rounded-2xl shadow-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">ID</th>
                    <th className="text-left p-3 font-semibold">Customer</th>
                    <th className="text-left p-3 font-semibold">Package</th>
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-right p-3 font-semibold">Total</th>
                    <th className="text-right p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-semibold">{b.id}</td>
                      <td className="p-3">{b.customer}</td>
                      <td className="p-3">{b.package}</td>
                      <td className="p-3">{b.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-semibold">${b.total}</td>
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
