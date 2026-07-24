"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { DispatchModal } from "@/components/dashboard/ngo-dispatch-modal";
import { TrendAreaChart, CategoryPieChart } from "@/components/dashboard/expiry-charts";
import { MOCK_INVENTORY, MOCK_ACTIVITIES } from "@/lib/mock-data";
import { InventoryItem } from "@/types";
import {
  PackageCheck, AlertOctagon, HeartHandshake, IndianRupee,
  Truck, Calendar, Activity, CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [items, setItems] = React.useState<InventoryItem[]>(MOCK_INVENTORY);
  const [dispatchItem, setDispatchItem] = React.useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = React.useState("urgent");

  const criticalItems = items.filter((i) => i.status === "critical" && !i.isDispatched);
  const dispatchedItems = items.filter((i) => i.isDispatched);

  const tableItems = activeTab === "urgent" ? criticalItems : dispatchedItems;

  const handleDispatch = (itemId: string, ngoName: string) => {
    setItems((prev) =>
      prev.map((i) => i.id === itemId ? { ...i, isDispatched: true, rescuedByNGO: ngoName } : i)
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of expiring stock, rescue operations, and key metrics."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Rescued This Month" value="4,850 kg" change="+18%" trend="up"
          subtitle="from last month" icon={<PackageCheck className="h-4 w-4" />} color="emerald" />
        <StatCard title="At-Risk Batches" value={`${criticalItems.length} Items`} change="Critical" trend="down"
          subtitle="need action now" icon={<AlertOctagon className="h-4 w-4" />} color="rose" />
        <StatCard title="NGO Partners" value="14 Active" change="+3 new" trend="up"
          subtitle="verified partners" icon={<HeartHandshake className="h-4 w-4" />} color="amber" />
        <StatCard title="Value Saved" value="₹51,800" change="+24%" trend="up"
          subtitle="prevented write-off" icon={<IndianRupee className="h-4 w-4" />} color="blue" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Rescue vs Waste Trend</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Monthly items rescued (kg) compared to disposed waste.</p>
          </CardHeader>
          <CardContent>
            <TrendAreaChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Volume by product type near expiry.</p>
          </CardHeader>
          <CardContent>
            <CategoryPieChart />
            <div className="mt-4 space-y-2">
              {[
                { name: "Fresh Produce", pct: "38%", color: "bg-emerald-500" },
                { name: "Dairy & Eggs",  pct: "24%", color: "bg-blue-500" },
                { name: "Bakery & Deli", pct: "18%", color: "bg-amber-500" },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${r.color}`} />
                    <span className="text-slate-400">{r.name}</span>
                  </div>
                  <span className="font-semibold text-slate-300">{r.pct}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Expiry Alert table */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>
                <AlertOctagon className="h-4 w-4 text-rose-400" />
                Expiry Alerts
              </CardTitle>
            </div>
            <Tabs
              tabs={[
                { id: "urgent", label: "Urgent (<3 days)", count: criticalItems.length },
                { id: "done", label: "Dispatched", count: dispatchedItems.length },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="mt-3"
            />
          </CardHeader>
          <CardContent className="p-0">
            {tableItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-600">
                <CheckCircle2 className="h-8 w-8 mb-2 text-emerald-700" />
                <p className="text-sm">All clear — no pending items.</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead className="border-b border-slate-800">
                  <tr className="text-slate-500 uppercase tracking-wide text-[10px]">
                    <th className="text-left py-2.5 px-5">Item</th>
                    <th className="text-left py-2.5 px-3">Qty</th>
                    <th className="text-left py-2.5 px-3">Expiry</th>
                    <th className="text-right py-2.5 px-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tableItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-5">
                        <p className="font-medium text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-600 font-mono">{item.sku}</p>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{item.quantity} {item.unit}</td>
                      <td className="py-3 px-3">
                        <Badge variant={item.status}>
                          <Calendar className="h-3 w-3" />
                          {item.expiryDate}
                        </Badge>
                      </td>
                      <td className="py-3 px-5 text-right">
                        {item.isDispatched ? (
                          <span className="text-[11px] text-emerald-400">✓ {item.rescuedByNGO}</span>
                        ) : (
                          <Button variant="primary" size="sm" onClick={() => setDispatchItem(item)}>
                            <Truck className="h-3.5 w-3.5" /> Dispatch
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <Activity className="h-4 w-4 text-emerald-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 space-y-3">
            {MOCK_ACTIVITIES.map((act) => (
              <div key={act.id} className="flex gap-3 pb-3 border-b border-slate-800/50 last:border-0 last:pb-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-200 leading-snug">{act.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.timestamp} · {act.actor}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <DispatchModal
        item={dispatchItem}
        isOpen={!!dispatchItem}
        onClose={() => setDispatchItem(null)}
        onSuccess={handleDispatch}
      />
    </div>
  );
}
