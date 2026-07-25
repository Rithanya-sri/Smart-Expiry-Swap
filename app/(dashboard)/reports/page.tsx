"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/empty-state";
import {
  Download, FileText, TrendingUp, IndianRupee, HeartHandshake,
  Tag, Recycle, Calendar, BarChart3, RefreshCw, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

type Period = "daily" | "weekly" | "monthly";

interface ReportData {
  period: Period;
  generatedAt: string;
  summary: {
    revenueSaved: number;
    foodRescued: number;
    productsDiscounted: number;
    productsDonated: number;
    productsRecycled: number;
    criticalProductsHandled: number;
    co2Avoided: number;
    mealsServed: number;
  };
  byCategory: { category: string; totalProducts: number; totalValue: number; rescued: number }[];
}

const TOOLTIP_STYLE = {
  backgroundColor: "#0f172a", borderColor: "#334155",
  borderRadius: "0.75rem", color: "#f8fafc", fontSize: "12px",
};

const CAT_COLORS = ["#10b981","#3b82f6","#f59e0b","#f43f5e","#8b5cf6","#06b6d4","#64748b","#fb923c"];

function downloadCSV(data: ReportData) {
  const { summary, byCategory, period, generatedAt } = data;
  const lines = [
    [`Smart Expiry Swap — ${period.charAt(0).toUpperCase() + period.slice(1)} Report`],
    [`Generated: ${new Date(generatedAt).toLocaleString("en-IN")}`],
    [],
    ["SUMMARY"],
    ["Metric", "Value"],
    ["Revenue Saved", `₹${summary.revenueSaved.toLocaleString("en-IN")}`],
    ["Food Rescued (units)", summary.foodRescued],
    ["Products Discounted", summary.productsDiscounted],
    ["Products Donated", summary.productsDonated],
    ["Products Recycled", summary.productsRecycled],
    ["CO₂ Avoided (kg)", summary.co2Avoided],
    ["Meals Served", summary.mealsServed],
    [],
    ["BY CATEGORY"],
    ["Category", "Total Products", "Total Value (₹)", "Rescued"],
    ...byCategory.map((c) => [c.category, c.totalProducts, c.totalValue, c.rescued]),
  ];

  const csv = lines.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `smart-expiry-swap-${period}-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [period, setPeriod] = React.useState<Period>("weekly");
  const [data, setData] = React.useState<ReportData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [downloading, setDownloading] = React.useState(false);

  const fetchReport = React.useCallback(async (p: Period) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports?period=${p}`);
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchReport(period); }, [period, fetchReport]);

  const handleDownload = () => {
    if (!data) return;
    setDownloading(true);
    setTimeout(() => {
      downloadCSV(data);
      setDownloading(false);
    }, 300);
  };

  const metricCards = data ? [
    { title: "Revenue Saved", value: `₹${data.summary.revenueSaved.toLocaleString("en-IN")}`, icon: <IndianRupee className="h-4 w-4" />, color: "text-emerald-400 bg-emerald-950/40 border-emerald-800" },
    { title: "Food Rescued", value: `${data.summary.foodRescued} units`, icon: <HeartHandshake className="h-4 w-4" />, color: "text-violet-400 bg-violet-950/40 border-violet-800" },
    { title: "Products Discounted", value: data.summary.productsDiscounted.toString(), icon: <Tag className="h-4 w-4" />, color: "text-amber-400 bg-amber-950/40 border-amber-800" },
    { title: "Products Donated", value: data.summary.productsDonated.toString(), icon: <CheckCircle2 className="h-4 w-4" />, color: "text-blue-400 bg-blue-950/40 border-blue-800" },
    { title: "Recycled / Composted", value: data.summary.productsRecycled.toString(), icon: <Recycle className="h-4 w-4" />, color: "text-slate-400 bg-slate-800/60 border-slate-700" },
    { title: "CO₂ Avoided", value: `${data.summary.co2Avoided} kg`, icon: <TrendingUp className="h-4 w-4" />, color: "text-emerald-400 bg-emerald-950/40 border-emerald-800" },
    { title: "Meals Served", value: data.summary.mealsServed.toLocaleString(), icon: <BarChart3 className="h-4 w-4" />, color: "text-amber-400 bg-amber-950/40 border-amber-800" },
    { title: "Critical Handled", value: data.summary.criticalProductsHandled.toString(), icon: <FileText className="h-4 w-4" />, color: "text-rose-400 bg-rose-950/40 border-rose-800" },
  ] : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Downloadable impact reports for daily, weekly, and monthly periods."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchReport(period)}
              className="flex items-center gap-2 text-xs text-slate-400 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <Button variant="primary" size="sm" onClick={handleDownload} disabled={!data || downloading}>
              <Download className="h-3.5 w-3.5" />
              {downloading ? "Preparing..." : "Download CSV"}
            </Button>
          </div>
        }
      />

      {/* Period selector */}
      <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1.5 w-fit">
        {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              period === p
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {error ? <ErrorState title="Failed to generate report" message={error} onRetry={() => fetchReport(period)} /> : (
        <>
          {/* Report header */}
          <div className="flex items-center gap-3 rounded-xl border border-emerald-900/50 bg-emerald-950/20 px-5 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-900 flex items-center justify-center">
              <FileText className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-100">
                {period.charAt(0).toUpperCase() + period.slice(1)} Impact Report
              </p>
              <p className="text-[11px] text-slate-500">
                {data ? `Generated ${new Date(data.generatedAt).toLocaleString("en-IN")}` : "Loading..."}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950 border border-emerald-900 px-2 py-1 rounded-lg">
              <CheckCircle2 className="h-3 w-3" /> Live Data
            </div>
          </div>

          {/* Metric grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
              : metricCards.map((m) => (
                <div key={m.title} className={`rounded-xl border p-4 ${m.color}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${m.color}`}>
                    {m.icon}
                  </div>
                  <p className="text-lg font-bold text-slate-100">{m.value}</p>
                  <p className="text-[11px] mt-0.5 opacity-70">{m.title}</p>
                </div>
              ))
            }
          </div>

          {/* Category breakdown chart */}
          <Card>
            <CardHeader className="border-b border-slate-800 pb-3">
              <CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Revenue by Category
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Total stock value by product category for this {period}.</p>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-[280px] flex items-end gap-2 pb-4 px-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex-1 rounded-t bg-slate-800/60 animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
                  ))}
                </div>
              ) : (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.byCategory || []} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false}
                        tickFormatter={(v: string) => v.split(" ")[0]} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false}
                        tickFormatter={(v: number) => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                      <Tooltip contentStyle={TOOLTIP_STYLE}
                        formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Total Value"]} />
                      <Bar dataKey="totalValue" name="Total Value" radius={[6, 6, 0, 0]}>
                        {data?.byCategory.map((_, i: number) => (
                          <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category detail table */}
          <Card>
            <CardHeader className="border-b border-slate-800 pb-3">
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/50">
                  <tr className="text-slate-500 uppercase tracking-wide text-[10px]">
                    <th className="text-left py-3 px-5">Category</th>
                    <th className="text-left py-3 px-4">Total Products</th>
                    <th className="text-left py-3 px-4">Total Value</th>
                    <th className="text-left py-3 px-4">Rescued</th>
                    <th className="text-left py-3 px-4">Recovery Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="py-3 px-4"><Skeleton className="h-3 w-full max-w-[100px]" /></td>
                        ))}
                      </tr>
                    ))
                    : data?.byCategory.map((c, i) => (
                      <tr key={c.category} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CAT_COLORS[i % CAT_COLORS.length] }} />
                            <span className="font-medium text-slate-200">{c.category}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{c.totalProducts}</td>
                        <td className="py-3.5 px-4 font-semibold text-emerald-400">₹{c.totalValue.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4 text-slate-300">{c.rescued}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-800 max-w-[80px]">
                              <div
                                className="h-1.5 rounded-full bg-emerald-500"
                                style={{ width: `${c.totalProducts ? Math.round(c.rescued / c.totalProducts * 100) : 0}%` }}
                              />
                            </div>
                            <span className="text-slate-400">{c.totalProducts ? Math.round(c.rescued / c.totalProducts * 100) : 0}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
