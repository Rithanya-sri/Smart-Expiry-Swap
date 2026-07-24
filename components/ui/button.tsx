import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants: Record<string, string> = {
      primary:   "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm",
      secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700",
      ghost:     "text-slate-400 hover:text-slate-200 hover:bg-slate-800",
      danger:    "bg-rose-600 text-white hover:bg-rose-500",
      outline:   "border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100",
    };
    const sizes: Record<string, string> = {
      sm:   "h-8 px-3 text-xs rounded-lg",
      md:   "h-9 px-4 text-sm rounded-lg",
      lg:   "h-11 px-6 text-sm rounded-xl",
      icon: "h-9 w-9 rounded-lg flex items-center justify-center",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          variants[variant], sizes[size], className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
