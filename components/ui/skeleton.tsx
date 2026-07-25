"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-800/60",
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-20" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-slate-800/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <Skeleton className="h-3.5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="w-full animate-pulse" style={{ height }}>
      <div className="flex items-end gap-2 h-full px-4 pb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-slate-800/60"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-3">
      <Skeleton className="h-4 w-40" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}
