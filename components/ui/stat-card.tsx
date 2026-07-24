import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color?: "emerald" | "amber" | "rose" | "blue" | "violet";
  className?: string;
}

const colorMap = {
  emerald: { icon: "text-emerald-400 bg-emerald-950 border-emerald-900", dot: "bg-emerald-400", change: "text-emerald-400" },
  amber:   { icon: "text-amber-400 bg-amber-950 border-amber-900",       dot: "bg-amber-400",   change: "text-amber-400" },
  rose:    { icon: "text-rose-400 bg-rose-950 border-rose-900",           dot: "bg-rose-400",    change: "text-rose-400" },
  blue:    { icon: "text-blue-400 bg-blue-950 border-blue-900",           dot: "bg-blue-400",    change: "text-blue-400" },
  violet:  { icon: "text-violet-400 bg-violet-950 border-violet-900",     dot: "bg-violet-400",  change: "text-violet-400" },
};

export function StatCard({ title, value, subtitle, change, trend = "up", icon, color = "emerald", className }: StatCardProps) {
  const c = colorMap[color];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <div className={cn("rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition-colors", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <div className={cn("w-9 h-9 rounded-lg border flex items-center justify-center", c.icon)}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-100 mb-1">{value}</div>
      {(change || subtitle) && (
        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span className={cn("flex items-center gap-1 text-xs font-medium", c.change)}>
              <TrendIcon className="h-3 w-3" />
              {change}
            </span>
          )}
          {subtitle && <span className="text-xs text-slate-600">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
