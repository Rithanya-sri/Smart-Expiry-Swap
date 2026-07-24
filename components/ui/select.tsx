import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, options, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full h-9 rounded-lg border border-slate-800 bg-slate-950 px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-colors cursor-pointer",
      className
    )}
    {...props}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value} className="bg-slate-900 text-slate-100">{o.label}</option>
    ))}
  </select>
));
Select.displayName = "Select";
export { Select };
