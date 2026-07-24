"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-slate-800", className)}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors",
              active
                ? "text-emerald-400 border-b-2 border-emerald-500 -mb-px"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                active ? "bg-emerald-900 text-emerald-300" : "bg-slate-800 text-slate-500"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
