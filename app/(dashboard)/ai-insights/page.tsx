"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCardSkeleton, ChartSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import {
  Brain, TrendingUp, AlertTriangle, Leaf, Star, Zap,
  ArrowRight, BarChart3, Target, RefreshCw,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
} from "recharts";

const TOOLTIP_STYLE = {
  backgroundColor: "#0f172a", borderColor: "#334155",
  borderRadius: "0.75rem", color: "#f8fafc", fontSize: "12px",
};

const IMPACT_COLORS: Record<string, string> = {
  High: "text-amber-400 bg-amber-950/40 border-amber-800",
  Medium: "text-blue-400 bg-blue-950/40 border-blue-800",
  Urgent: "text-rose-400 bg-rose-950/40 border-rose-800",
};

const ACTION_COLORS: Record<string, string> = {
  "Apply Discount": "#f59e0b",
  "Bundle Offer": "#3b82f6",
  "NGO Donation": "#f43f5e",
  "Transfer To Branch": "#8b5cf6",
  "Notify Customers": "#06b6d4",
  "Normal Sale": "#10b981",
};

interface InsightsData {
  atRisk: any[];
  revenueOpportunities: any[];
  wasteProneCats: any[];
  weeklyRecs: any[];
  scoreDistribution: any[];
}

export default function AIInsightsPage() {
  const [data, setData] = React.useState<InsightsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-insights");
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  if (error) return (
    <div className="space-y-6">
      <PageHeader title="AI Insights" description="Smart recovery intelligence powered by your live inventory." />
      <ErrorState title="Failed to load AI insights" message={error} onRetry={fetchData} />
    </div>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="AI Insights"
        description="Smart recovery intelligence powered by live inventory analysis."
        action={
          <button
            onClick={fetchData}
            className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 border border-emerald-800/50 hover:border-emerald-700 px-3 py-1.5 rounded-lg bg-emerald-950/20 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : [
          { title: "At-Risk Products", value: data?.atRisk.length.toString() || "0", change: "Need action", trend: "down" as const, icon: <AlertTriangle className="h-4 w-4" />, color: "rose" as const },
          { title: "Revenue Opportunities", value: `₹${data?.revenueOpportunities.reduce((s: number, r: any) => s + r.recoverableValue, 0).toLocaleString("en-IN") || "0"}`, change: "Recoverable", trend: "up" as const, icon: <TrendingUp className="h-4 w-4" />, color: "emerald" as const },
          { title: "Waste-Prone Categories", value: data?.wasteProneCats.length.toString() || "0", change: "Tracked", trend: "up" as const, icon: <Leaf className="h-4 w-4" />, color: "amber" as const },
          { title: "AI Recommendations", value: data?.weeklyRecs.length.toString() || "0", change: "This week", trend: "up" as const, icon: <Brain className="h-4 w-4" />, color: "violet" as const },
        ].map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} change={s.change}
            trend={s.trend} subtitle="" icon={s.icon} color={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top 5 At-Risk Products */}
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              Top 5 At-Risk Products
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Products with highest urgency requiring immediate recovery action.</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : data?.atRisk.length === 0 ? (
              <EmptyState title="No at-risk products" description="All products are in safe status." />
            ) : (
              <div className="divide-y divide-slate-800/50">
                {data?.atRisk.map((p: any, i: number) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/20 transition-colors">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      i === 0 ? "bg-rose-950 text-rose-400" : "bg-slate-800 text-slate-400"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.category} · {p.branch}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-rose-400">{p.daysLeft}d left</p>
                      <p className="text-[10px] text-slate-500">₹{p.value.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{
                      background: `conic-gradient(#10b981 ${p.recoveryScore}%, #1e293b 0)`,
                    }}>
                      <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-emerald-400">{p.recoveryScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Recovery Opportunities */}
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Revenue Recovery Opportunities
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Highest-value products where recovery actions can save the most.</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {data?.revenueOpportunities.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/20 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{r.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded border text-[10px] font-medium"
                          style={{ color: ACTION_COLORS[r.action] || "#64748b", borderColor: `${ACTION_COLORS[r.action]}40` || "#334155", backgroundColor: `${ACTION_COLORS[r.action]}10` }}>
                          {r.action}
                        </span>
                        <span className="text-[10px] text-slate-500">{r.daysLeft}d left</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-emerald-400">₹{r.recoverableValue.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-slate-500">{r.recoveryPct}% of ₹{r.currentValue.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Most Waste-Prone Categories */}
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <Leaf className="h-4 w-4 text-amber-400" />
              Waste-Prone Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? <ChartSkeleton height={220} /> : (
              <>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data?.wasteProneCats || []} cx="50%" cy="50%" outerRadius={70} dataKey="estimatedWaste" paddingAngle={3}>
                        {data?.wasteProneCats.map((c: any, i: number) => (
                          <Cell key={i} fill={c.color} stroke="#0f172a" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Est. Waste"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-2">
                  {data?.wasteProneCats.slice(0, 4).map((c: any) => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-slate-400 truncate">{c.name}</span>
                      </div>
                      <span className="text-slate-500">{c.atRiskCount} items</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recovery Score Distribution */}
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
              Recovery Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? <ChartSkeleton height={220} /> : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.scoreDistribution || []} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" name="Products" radius={[4, 4, 0, 0]}>
                      {data?.scoreDistribution.map((b: any, i: number) => (
                        <Cell key={i} fill={b.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly AI Recommendations */}
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <Zap className="h-4 w-4 text-violet-400" />
              Weekly Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : data?.weeklyRecs.map((rec: any) => (
              <div key={rec.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{rec.title}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${IMPACT_COLORS[rec.impact] || "text-slate-400 bg-slate-800 border-slate-700"}`}>
                    {rec.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{rec.description}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-600">{rec.category}</span>
                  <span className="text-[10px] text-slate-700">·</span>
                  <span className="text-[10px] font-medium text-violet-400 flex items-center gap-1">
                    {rec.action} <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
