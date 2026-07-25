"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatCardSkeleton, ChartSkeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/empty-state";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { DispatchModal } from "@/components/dashboard/ngo-dispatch-modal";
import {
  PackageCheck, AlertOctagon, HeartHandshake, IndianRupee,
  Truck, Calendar, Activity, CheckCircle2, Leaf, Package, Archive, Users,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

interface Stats {
  totalProducts: number;
  safeProducts: number;
  nearExpiryProducts: number;
  criticalProducts: number;
  estimatedRevenueRecovered: number;
  productsDonated: number;
  wastePrevented: number;
  activeNGOPartners: number;
}

interface ChartData {
  categoryBreakdown: { name: string; value: number; color: string }[];
  inventoryStatus: { name: string; value: number; color: string }[];
  recoveryActions: { name: string; value: number }[];
  monthlyWasteReduction: { month: string; rescued: number; waste: number; valueSaved: number }[];
}

const TOOLTIP_STYLE = {
  backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem",
  color: "#f8fafc", fontSize: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
};

const RECOVERY_COLORS = ["#10b981","#f59e0b","#3b82f6","#8b5cf6","#06b6d4","#f43f5e","#64748b"];

export default function DashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [charts, setCharts] = React.useState<ChartData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("urgent");
  const [activities] = React.useState([
    { id: "1", title: "140 Milk Cartons dispatched to Metro Harvest", timestamp: "12 mins ago", actor: "Dispatch System", type: "dispatch" },
    { id: "2", title: "Critical Expiry Alert: Fresh Salmon", timestamp: "1 hour ago", actor: "Smart Tracker", type: "alert" },
    { id: "3", title: "AI Recovery Plan generated for 5 items", timestamp: "2 hours ago", actor: "AI Engine", type: "ai" },
    { id: "4", title: "60 Sourdough Loaves transferred to Eastside Hub", timestamp: "4 hours ago", actor: "Manager Portal", type: "transfer" },
    { id: "5", title: "NGO Hope Shelter confirmed pickup", timestamp: "5 hours ago", actor: "NGO System", type: "ngo" },
  ]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, chartsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/charts"),
      ]);
      const statsJson = await statsRes.json();
      const chartsJson = await chartsRes.json();
      if (statsJson.success) setStats(statsJson.data);
      if (chartsJson.success) setCharts(chartsJson.data);
    } catch (e: any) {
      setError(e.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const statCards = stats ? [
    { title: "Total Products", value: stats.totalProducts.toString(), change: "4 branches", trend: "up" as const, icon: <Package className="h-4 w-4" />, color: "blue" as const },
    { title: "Safe Products", value: stats.safeProducts.toString(), change: `${Math.round(stats.safeProducts / stats.totalProducts * 100)}% of stock`, trend: "up" as const, icon: <CheckCircle2 className="h-4 w-4" />, color: "emerald" as const },
    { title: "Near Expiry", value: stats.nearExpiryProducts.toString(), change: "≤ 7 days", trend: "down" as const, icon: <AlertOctagon className="h-4 w-4" />, color: "amber" as const },
    { title: "Critical Items", value: stats.criticalProducts.toString(), change: "Need action now", trend: "down" as const, icon: <AlertOctagon className="h-4 w-4" />, color: "rose" as const },
    { title: "Revenue Recovered", value: `₹${stats.estimatedRevenueRecovered.toLocaleString("en-IN")}`, change: "+18% this month", trend: "up" as const, icon: <IndianRupee className="h-4 w-4" />, color: "emerald" as const },
    { title: "Products Donated", value: stats.productsDonated.toString(), change: "To NGO partners", trend: "up" as const, icon: <HeartHandshake className="h-4 w-4" />, color: "violet" as const },
    { title: "Waste Prevented", value: `₹${stats.wastePrevented.toLocaleString("en-IN")}`, change: "Est. savings", trend: "up" as const, icon: <Leaf className="h-4 w-4" />, color: "emerald" as const },
    { title: "NGO Partners", value: stats.activeNGOPartners.toString(), change: "Active", trend: "up" as const, icon: <Users className="h-4 w-4" />, color: "amber" as const },
  ] : [];

  if (error) return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of expiring stock, rescue operations, and key metrics." />
      <ErrorState title="Failed to load dashboard" message={error} onRetry={fetchData} />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Live overview of expiring stock, rescue operations, and key metrics." />

      {/* Stats — 8 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} change={s.change}
              trend={s.trend} subtitle="" icon={s.icon} color={s.color} />
          ))
        }
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Waste Reduction */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Waste Reduction</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Items rescued (kg) vs disposed waste over 6 months.</p>
          </CardHeader>
          <CardContent>
            {loading || !charts ? <ChartSkeleton /> : (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.monthlyWasteReduction} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rescuedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area type="monotone" dataKey="rescued" name="Rescued (kg)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#rescuedGrad)" />
                    <Area type="monotone" dataKey="waste" name="Waste (kg)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#wasteGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Volume by product type.</p>
          </CardHeader>
          <CardContent>
            {loading || !charts ? <ChartSkeleton height={240} /> : (
              <>
                <div className="h-[200px] w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={charts.categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {charts.categoryBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <span className="text-lg font-extrabold text-slate-100">{stats?.totalProducts}</span>
                    <span className="text-[10px] text-slate-400">Items</span>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {charts.categoryBreakdown.slice(0, 4).map((c) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-slate-400 truncate max-w-[120px]">{c.name}</span>
                      </div>
                      <span className="font-semibold text-slate-300">{c.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recovery Actions Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recovery Actions Distribution</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">How products are being recovered across the pipeline.</p>
          </CardHeader>
          <CardContent>
            {loading || !charts ? <ChartSkeleton /> : (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.recoveryActions} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="value" name="Products" radius={[6, 6, 0, 0]}>
                      {charts.recoveryActions.map((_, i) => (
                        <Cell key={i} fill={RECOVERY_COLORS[i % RECOVERY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status breakdown.</p>
          </CardHeader>
          <CardContent>
            {loading || !charts ? <ChartSkeleton height={200} /> : (
              <>
                <div className="h-[200px] w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={charts.inventoryStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                        {charts.inventoryStatus.map((entry, i) => (
                          <Cell key={i} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-2">
                  {charts.inventoryStatus.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-slate-400">{s.name}</span>
                      </div>
                      <span className="font-semibold text-slate-300">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader className="border-b border-slate-800 pb-3">
          <CardTitle>
            <Activity className="h-4 w-4 text-emerald-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 space-y-0 divide-y divide-slate-800/40">
          {activities.map((act) => (
            <div key={act.id} className="flex gap-3 py-3">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                act.type === "alert" ? "bg-rose-500" :
                act.type === "ai" ? "bg-violet-500" :
                act.type === "ngo" ? "bg-amber-500" : "bg-emerald-500"
              }`} />
              <div>
                <p className="text-xs font-medium text-slate-200 leading-snug">{act.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{act.timestamp} · {act.actor}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
