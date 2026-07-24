"use client";
import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { InventoryItem } from "@/types";
import { MOCK_NGOS } from "@/lib/mock-data";
import { Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

interface DispatchModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (itemId: string, ngoName: string) => void;
}

export function DispatchModal({ item, isOpen, onClose, onSuccess }: DispatchModalProps) {
  const [selectedNgoId, setSelectedNgoId] = React.useState(MOCK_NGOS[0]?.id || "");
  const [pickup, setPickup] = React.useState("express");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const ngo = MOCK_NGOS.find((n) => n.id === selectedNgoId) || MOCK_NGOS[0];

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setTimeout(() => {
        onSuccess(item.id, ngo.name);
        setDone(false);
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch to NGO"
      description={`Rescue ${item.name} before expiry by assigning to a partner NGO.`} maxWidth="md">
      {done ? (
        <div className="flex flex-col items-center py-8 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-slate-100">Dispatch confirmed!</p>
          <p className="text-xs text-slate-500">{item.name} → {ngo.name}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item summary */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">{item.name}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{item.quantity} {item.unit} · ₹{item.totalValue}</p>
            </div>
            <Badge variant={item.status}>{item.expiryDate}</Badge>
          </div>

          {/* NGO select */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Select NGO Partner</label>
            <Select
              value={selectedNgoId}
              onChange={(e) => setSelectedNgoId(e.target.value)}
              options={MOCK_NGOS.map((n) => ({ label: `${n.name} (${n.category})`, value: n.id }))}
            />
          </div>

          {/* NGO info */}
          {ngo && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-200 font-medium">
                {ngo.name}
                {ngo.verified && <span className="flex items-center gap-0.5 text-[10px] text-emerald-400"><ShieldCheck className="h-3 w-3" />Verified</span>}
              </div>
              <p className="text-slate-500">{ngo.location} · {ngo.phone}</p>
              <p className="text-slate-500">Cold storage: <span className={ngo.hasColdStorage ? "text-sky-400" : "text-slate-600"}>{ngo.hasColdStorage ? "Available" : "N/A"}</span></p>
            </div>
          )}

          {/* Pickup window */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Pickup Window</label>
            <Select
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              options={[
                { label: "Express — Within 2 Hours", value: "express" },
                { label: "Today, 3:00 PM – 5:00 PM", value: "today-pm" },
                { label: "Tomorrow, 8:00 AM – 11:00 AM", value: "tomorrow-am" },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              <Truck className="h-3.5 w-3.5" />
              {loading ? "Dispatching..." : "Confirm Dispatch"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
