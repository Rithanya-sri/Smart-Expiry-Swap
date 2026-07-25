"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { PackageSearch, AlertCircle, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-5">
        {icon || <PackageSearch className="h-7 w-7 text-slate-500" />}
      </div>
      <p className="text-sm font-semibold text-slate-300 mb-1.5">{title}</p>
      {description && (
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-5">{description}</p>
      )}
      {action && action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = "Something went wrong", message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-900/50 flex items-center justify-center mb-5">
        <AlertCircle className="h-7 w-7 text-rose-400" />
      </div>
      <p className="text-sm font-semibold text-slate-300 mb-1.5">{title}</p>
      {message && (
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-5">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors border border-emerald-800/50 hover:border-emerald-700 px-3 py-1.5 rounded-lg bg-emerald-950/20"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}
