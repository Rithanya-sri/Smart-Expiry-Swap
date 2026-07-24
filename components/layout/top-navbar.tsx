"use client";
import * as React from "react";
import { Bell, Plus, Search, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { MOCK_ACTIVITIES } from "@/lib/mock-data";

export function TopNavbar() {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <>
      <header className="flex h-14 items-center gap-4 px-6 border-b border-slate-800 bg-slate-950 sticky top-0 z-20">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search items, SKU, supplier..."
            icon={<Search className="h-3.5 w-3.5" />}
            className="text-xs"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Add Item */}
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> Log Item
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-200">Recent Activity</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900">3 new</span>
                </div>
                <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                  {MOCK_ACTIVITIES.map((a) => (
                    <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/40 transition-colors">
                      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${a.type === "alert" ? "bg-amber-950 text-amber-400" : "bg-emerald-950 text-emerald-400"}`}>
                        {a.type === "alert" ? <AlertTriangle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-200 leading-snug">{a.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{a.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-800">
                  <button className="text-xs text-emerald-400 hover:underline" onClick={() => setNotifOpen(false)}>
                    Dismiss all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Log New Item Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Log Expiring Item" description="Register a new inventory batch nearing expiry." maxWidth="lg">
        <form onSubmit={(e) => { e.preventDefault(); setAddOpen(false); }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Item Name</label>
              <Input placeholder="e.g. Organic Yogurt 500g" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">SKU</label>
              <Input placeholder="e.g. DY-9941" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Category</label>
              <Select options={[
                { label: "Dairy & Eggs", value: "Dairy & Eggs" },
                { label: "Fresh Produce", value: "Fresh Produce" },
                { label: "Bakery & Deli", value: "Bakery & Deli" },
                { label: "Meat & Seafood", value: "Meat & Seafood" },
                { label: "Pantry & Canned", value: "Pantry & Canned" },
              ]} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Expiry Date</label>
              <Input type="date" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Quantity</label>
              <Input type="number" placeholder="100" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Unit Price (₹)</label>
              <Input type="number" step="0.01" placeholder="4.50" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Storage Location</label>
            <Input placeholder="e.g. Cold Room B, Shelf 4" required />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Item</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
