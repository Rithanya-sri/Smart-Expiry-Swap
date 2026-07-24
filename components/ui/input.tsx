import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, icon, ...props }, ref) => (
  <div className="relative flex items-center w-full">
    {icon && <span className="absolute left-3 text-slate-500 pointer-events-none">{icon}</span>}
    <input
      ref={ref}
      className={cn(
        "w-full h-9 rounded-lg border border-slate-800 bg-slate-950 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-colors",
        icon ? "pl-9 pr-3" : "px-3",
        className
      )}
      {...props}
    />
  </div>
));
Input.displayName = "Input";
export { Input };
