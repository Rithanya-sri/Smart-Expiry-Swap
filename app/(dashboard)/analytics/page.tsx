"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendAreaChart, CategoryPieChart, ValueSavingsBarChart } from "@/components/dashboard/expiry-charts";
import { Leaf, IndianRupee, TrendingUp, Award, Download } from "lucide-react";

const ESG_HIGHLIGHTS = [
  { label: "CO₂ Emissions Avoided", value: "42.8 t", desc: "Equivalent to 1,940 trees planted", color: "text-emerald-400" },
  { label: "Water Saved", value: "3.2M L", desc: "Indirect lifecycle preservation", color: "text-sky-400" },
  { label: "Meals Served", value: "67,100", desc: "Via 14 verified NGO partners", color: "text-violet-400" },
  { label: "ESG Rating", value: "AAA", desc: "Certified — federal tax eligible", color: "text-amber-400" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        description="Waste prevention impact, financial ROI, and ESG compliance metrics."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("Exporting CSV...")}>
              <Download className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button variant="primary" size="sm" onClick={() => alert("Generating ESG PDF...")}>
              <Download className="h-3.5 w-3.5" /> ESG Report
            </Button>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CO₂ Avoided" value="42.8 t" change="-38% carbon" trend="up"
          subtitle="this year" icon={<Leaf className="h-4 w-4" />} color="emerald" />
        <StatCard title="Meals Served" value="67,100" change="+15,400 Q2" trend="up"
          subtitle="families fed" icon={<Award className="h-4 w-4" />} color="violet" />
        <StatCard title="Loss Prevented" value="₹184,200" change="ROI +34.2%" trend="up"
          subtitle="stock recovered" icon={<IndianRupee className="h-4 w-4" />} color="blue" />
        <StatCard title="Prevention Rate" value="96.4%" change="Top 5%" trend="up"
          subtitle="rescued vs disposed" icon={<TrendingUp className="h-4 w-4" />} color="amber" />
      </div>

      {/* Chart row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="border-b border-slate-800">
            <CardTitle>Rescue vs Waste (6 months)</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">kg rescued compared to disposed waste over time.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <TrendAreaChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b border-slate-800">
            <CardTitle>Financial Value Saved (₹)</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Monthly dollar value of stock rescued from write-off.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <ValueSavingsBarChart />
          </CardContent>
        </Card>
      </div>

      {/* Chart row 2 + ESG highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="border-b border-slate-800">
            <CardTitle>Category Share</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Product type breakdown of near-expiry volume.</p>
          </CardHeader>
          <CardContent className="pt-3">
            <CategoryPieChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-800">
            <CardTitle>
              <Leaf className="h-4 w-4 text-emerald-400" />
              ESG Impact Highlights
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Certified metrics eligible for corporate sustainability reporting.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {ESG_HIGHLIGHTS.map((h) => (
                <div key={h.label} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{h.label}</p>
                  <p className={`text-2xl font-bold mb-1 ${h.color}`}>{h.value}</p>
                  <p className="text-xs text-slate-500">{h.desc}</p>
                </div>
              ))}
            </div>

            {/* Cert banner */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-900 bg-emerald-950/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  ESG Compliance: <span className="text-emerald-400">AAA Certified</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Eligible for 30% tax deduction under Food Recovery Act.</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => alert("Downloading certificate...")}>
                Download Cert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
