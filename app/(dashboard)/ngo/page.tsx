"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MOCK_NGOS } from "@/lib/mock-data";
import { NGO } from "@/types";
import { HeartHandshake, ShieldCheck, Truck, Snowflake, Search, Plus, Star, MapPin, Phone } from "lucide-react";

export default function NgoPage() {
  const [ngos] = React.useState<NGO[]>(MOCK_NGOS);
  const [search, setSearch] = React.useState("");
  const [catFilter, setCatFilter] = React.useState("All");
  const [showAdd, setShowAdd] = React.useState(false);

  const filtered = ngos.filter((n) => {
    const q = search.toLowerCase();
    return (
      (n.name.toLowerCase().includes(q) || n.location.toLowerCase().includes(q)) &&
      (catFilter === "All" || n.category === catFilter)
    );
  });

  const capColor = (cap: NGO["capacityLevel"]) =>
    cap === "High" ? "safe" : cap === "Medium" ? "warning" : "rose" as any;

  return (
    <div className="space-y-5">
      <PageHeader
        title="NGO Partners"
        description="Verified rescue organizations for food and supply dispatches."
        action={<Button variant="primary" size="sm" onClick={() => setShowAdd(true)}><Plus className="h-3.5 w-3.5" /> Add NGO</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Verified Partners" value={`${ngos.length}`} change="All audited" trend="up"
          subtitle="active NGOs" icon={<ShieldCheck className="h-4 w-4" />} color="emerald" />
        <StatCard title="Active Dispatches" value="6" change="In transit" trend="up"
          subtitle="ongoing missions" icon={<Truck className="h-4 w-4" />} color="amber" />
        <StatCard title="Total Rescued" value="33,550 kg" change="+28.4%" trend="up"
          subtitle="food distributed" icon={<HeartHandshake className="h-4 w-4" />} color="violet" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by name or location..." value={search}
          onChange={(e) => setSearch(e.target.value)} icon={<Search className="h-3.5 w-3.5" />} className="max-w-xs" />
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="max-w-xs"
          options={[
            { label: "All Types", value: "All" },
            { label: "Food Bank", value: "Food Bank" },
            { label: "Community Kitchen", value: "Community Kitchen" },
            { label: "Shelter", value: "Shelter" },
            { label: "Medical Aid", value: "Medical Aid" },
          ]}
        />
      </div>

      {/* NGO Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ngo) => (
          <Card key={ngo.id} className="hover:border-slate-700 transition-colors">
            <CardContent className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-100">{ngo.name}</h3>
                    {ngo.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950 border border-emerald-900 px-1.5 py-0.5 rounded">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{ngo.category}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-300">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {ngo.rating}
                </div>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Rescued", value: `${ngo.totalRescuedKg.toLocaleString()} kg` },
                  { label: "Active", value: `${ngo.activeDispatches} missions` },
                  { label: "Capacity", value: ngo.capacityLevel },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-center">
                    <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                    <p className="text-xs font-semibold text-slate-200">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-1.5 mb-4 text-xs text-slate-400">
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-slate-600 shrink-0" />{ngo.location}</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-600 shrink-0" />{ngo.phone}</div>
                <div className="flex items-center gap-2">
                  <Snowflake className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                  Cold storage: <span className={ngo.hasColdStorage ? "text-sky-400" : "text-slate-600"}>
                    {ngo.hasColdStorage ? "Available" : "Not available"}
                  </span>
                </div>
              </div>

              {/* Action */}
              <Button
                variant="primary" size="sm" className="w-full"
                onClick={() => alert(`Initiating dispatch to ${ngo.name}`)}>
                <Truck className="h-3.5 w-3.5" /> Initiate Dispatch
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add NGO Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register NGO Partner"
        description="Add a new verified rescue organization to the network." maxWidth="lg">
        <form onSubmit={(e) => { e.preventDefault(); setShowAdd(false); }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Organization Name</label>
              <Input placeholder="e.g. City Harvest Alliance" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Category</label>
              <Select options={[
                { label: "Food Bank", value: "Food Bank" },
                { label: "Community Kitchen", value: "Community Kitchen" },
                { label: "Shelter", value: "Shelter" },
                { label: "Medical Aid", value: "Medical Aid" },
              ]} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Contact Person</label>
              <Input placeholder="Full name" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Email</label>
              <Input type="email" placeholder="contact@ngo.org" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Phone</label>
              <Input placeholder="+1 (555) 000-0000" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Cold Storage</label>
              <Select options={[
                { label: "Yes — Cold & Frozen", value: "yes" },
                { label: "No — Dry Goods Only", value: "no" },
              ]} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Address / Zone</label>
            <Input placeholder="e.g. 104 Central Park West, Zone 3" required />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Submit for Review</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
