import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "critical" | "warning" | "safe" | "expired" | "info" | "neutral" | "gold" | "platinum";

const variantStyles: Record<BadgeVariant, string> = {
  critical:  "bg-rose-950 text-rose-400 border-rose-900",
  warning:   "bg-amber-950 text-amber-400 border-amber-900",
  safe:      "bg-emerald-950 text-emerald-400 border-emerald-900",
  expired:   "bg-slate-800 text-slate-500 border-slate-700",
  info:      "bg-sky-950 text-sky-400 border-sky-900",
  neutral:   "bg-slate-800 text-slate-400 border-slate-700",
  gold:      "bg-amber-950 text-amber-300 border-amber-800",
  platinum:  "bg-violet-950 text-violet-300 border-violet-800",
};

export function Badge({ variant = "neutral", className, ...props }: { variant?: BadgeVariant } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        variantStyles[variant], className
      )}
      {...props}
    />
  );
}
