"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DispatchModal } from "@/components/dashboard/ngo-dispatch-modal";
import { MOCK_INVENTORY } from "@/lib/mock-data";
import { InventoryItem } from "@/types";
import { getExpiryStatus } from "@/lib/utils";
import { Search, Plus, Truck, CheckCircle2, RefreshCw } from "lucide-react";

export default function InventoryPage() {
  const [items, setItems] = React.useState<InventoryItem[]>(MOCK_INVENTORY);
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [activeTab, setActiveTab] = React.useState("all");
  const [dispatchTarget, setDispatchTarget] = React.useState<InventoryItem | null>(null);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    const matchCat = category === "All" || item.category === category;
    if (activeTab === "critical") return matchSearch && matchCat && item.status === "critical" && !item.isDispatched;
    if (activeTab === "dispatched") return matchSearch && matchCat && item.isDispatched;
    if (activeTab === "safe") return matchSearch && matchCat && item.status === "safe";
    return matchSearch && matchCat;
  });

  const handleDispatch = (itemId: string, ngoName: string) => {
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, isDispatched: true, rescuedByNGO: ngoName } : i));
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Track stock nearing expiry and manage NGO rescue dispatches."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setItems(MOCK_INVENTORY)}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "all",        label: "All Stock",       count: items.length },
          { id: "critical",   label: "Critical (<3d)",  count: items.filter(i => i.status === "critical" && !i.isDispatched).length },
          { id: "dispatched", label: "Dispatched",      count: items.filter(i => i.isDispatched).length },
          { id: "safe",       label: "Safe (>14d)",     count: items.filter(i => i.status === "safe").length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by name, SKU, or supplier..." value={search}
          onChange={(e) => setSearch(e.target.value)} icon={<Search className="h-3.5 w-3.5" />} className="max-w-xs" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-xs"
          options={[
            { label: "All Categories", value: "All" },
            { label: "Dairy & Eggs", value: "Dairy & Eggs" },
            { label: "Fresh Produce", value: "Fresh Produce" },
            { label: "Bakery & Deli", value: "Bakery & Deli" },
            { label: "Meat & Seafood", value: "Meat & Seafood" },
            { label: "Pantry & Canned", value: "Pantry & Canned" },
          ]}
        />
        <span className="text-xs text-slate-500 self-center ml-auto">
          {filtered.length} of {items.length} records
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/50">
                <tr className="text-slate-500 uppercase tracking-wide text-[10px]">
                  <th className="text-left py-3 px-5">Item</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Value</th>
                  <th className="text-left py-3 px-4">Expiry Status</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-right py-3 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-slate-600">No matching items found.</td></tr>
                ) : filtered.map((item) => {
                  const status = getExpiryStatus(item.expiryDate);
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="py-3.5 px-5">
                        <p className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{item.name}</p>
                        <p className="text-[10px] text-slate-600 font-mono mt-0.5">{item.sku} · {item.supplier}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-300">{item.quantity} {item.unit}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-emerald-400">₹{item.totalValue.toFixed(0)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{item.location}</td>
                      <td className="py-3.5 px-5 text-right">
                        {item.isDispatched ? (
                          <span className="flex items-center justify-end gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Dispatched
                          </span>
                        ) : (
                          <Button variant="primary" size="sm" onClick={() => setDispatchTarget(item)}>
                            <Truck className="h-3.5 w-3.5" /> Dispatch
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <DispatchModal item={dispatchTarget} isOpen={!!dispatchTarget}
        onClose={() => setDispatchTarget(null)} onSuccess={handleDispatch} />
    </div>
  );
}
