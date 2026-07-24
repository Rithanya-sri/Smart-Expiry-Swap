"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, PackageSearch, Users, HeartHandshake,
  BarChart3, Leaf, ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { name: "Dashboard",    href: "/",          icon: LayoutDashboard },
  { name: "Inventory",    href: "/inventory",  icon: PackageSearch },
  { name: "Customers",    href: "/customers",  icon: Users },
  { name: "NGO Partners", href: "/ngo",        icon: HeartHandshake },
  { name: "Analytics",    href: "/analytics",  icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col border-r border-slate-800 bg-slate-950 shrink-0">
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 px-5 border-b border-slate-800">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
          <Leaf className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-100 leading-none">SmartSwap</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Expiry Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Menu</p>
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-600/10 text-emerald-400 border border-emerald-600/20"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Impact Summary */}
      <div className="m-3 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-3.5">
        <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mb-1">This Quarter</p>
        <p className="text-lg font-bold text-slate-100">33,550 kg</p>
        <p className="text-xs text-slate-500 mb-2">food rescued from disposal</p>
        <Link href="/ngo" className="flex items-center gap-1 text-xs text-emerald-400 font-medium hover:underline">
          View dispatches <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* User Footer */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-800">
        <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-700 flex items-center justify-center text-xs font-bold text-emerald-300 shrink-0">
          AD
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">Admin</p>
          <p className="text-[10px] text-slate-500 truncate">admin@smartswap.org</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
      </div>
    </aside>
  );
}
