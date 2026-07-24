"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import { Customer } from "@/types";
import { Users, Building2, TrendingUp, Search, Plus, Mail, Phone, Calendar } from "lucide-react";

export default function CustomersPage() {
  const [customers] = React.useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [selected, setSelected] = React.useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q)) &&
      (typeFilter === "All" || c.type === typeFilter)
    );
  });

  const tierVariant = (tier: Customer["tier"]) =>
    tier === "Platinum" ? "platinum" : "gold";

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        description="Enterprise donors and business partners contributing to food rescue."
        action={<Button variant="primary" size="sm"><Plus className="h-3.5 w-3.5" /> Add Customer</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Active Partners" value={`${customers.length}`} change="+2 this month"
          trend="up" subtitle="enterprises" icon={<Building2 className="h-4 w-4" />} color="emerald" />
        <StatCard title="Avg Impact Score" value="92.8" change="+4.2 pts" trend="up"
          subtitle="ESG rating" icon={<TrendingUp className="h-4 w-4" />} color="violet" />
        <StatCard title="Total Value Saved" value="₹121,650" change="+31.5%" trend="up"
          subtitle="this year" icon={<TrendingUp className="h-4 w-4" />} color="amber" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by name or contact..." value={search}
          onChange={(e) => setSearch(e.target.value)} icon={<Search className="h-3.5 w-3.5" />} className="max-w-xs" />
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="max-w-xs"
          options={[
            { label: "All Business Types", value: "All" },
            { label: "Supermarket Chain", value: "Supermarket Chain" },
            { label: "Wholesale Distributor", value: "Wholesale Distributor" },
            { label: "Local Organic Market", value: "Local Organic Market" },
          ]}
        />
      </div>

      {/* Customer table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/50">
              <tr className="text-slate-500 uppercase tracking-wide text-[10px]">
                <th className="text-left py-3 px-5">Customer</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Tier</th>
                <th className="text-left py-3 px-4">Items Donated</th>
                <th className="text-left py-3 px-4">Value Saved</th>
                <th className="text-left py-3 px-4">Impact Score</th>
                <th className="text-right py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => setSelected(c)}>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{c.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{c.contactName} · {c.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{c.type}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={tierVariant(c.tier)}>{c.tier}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">{c.totalItemsDonated.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">₹{c.totalValueSaved.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 max-w-[60px]">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${c.impactScore}%` }} />
                      </div>
                      <span className="text-slate-300 font-medium">{c.impactScore}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Badge variant={c.status === "Active" ? "safe" : "neutral"}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Customer detail modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)}
          title={selected.name} description={selected.type} maxWidth="md">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Impact Score", value: `${selected.impactScore}/100`, color: "text-emerald-400" },
                { label: "Items Donated", value: selected.totalItemsDonated.toLocaleString(), color: "text-slate-100" },
                { label: "Value Saved", value: `₹${selected.totalValueSaved.toLocaleString()}`, color: "text-blue-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-[10px] text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400"><Mail className="h-3.5 w-3.5 text-slate-600" />{selected.email}</div>
              <div className="flex items-center gap-2 text-slate-400"><Phone className="h-3.5 w-3.5 text-slate-600" />{selected.phone}</div>
              <div className="flex items-center gap-2 text-slate-400"><Calendar className="h-3.5 w-3.5 text-slate-600" />Member since {selected.joinDate}</div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
