"use client";
import * as React from "react";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const PIPELINE_STAGES = [
  "Normal Sale",
  "Discount",
  "Bundle Offer",
  "Transfer To Branch",
  "Notify Customers",
  "NGO Donation",
  "Recycle / Compost",
] as const;

export type PipelineStage = typeof PIPELINE_STAGES[number];

interface RecoveryPipelineProps {
  currentStage: PipelineStage | string;
  compact?: boolean;
}

const STAGE_COLORS: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  "Normal Sale":       { dot: "bg-emerald-500", bg: "bg-emerald-950/40", border: "border-emerald-700", text: "text-emerald-400" },
  "Discount":          { dot: "bg-amber-500",   bg: "bg-amber-950/40",   border: "border-amber-700",   text: "text-amber-400" },
  "Bundle Offer":      { dot: "bg-blue-500",    bg: "bg-blue-950/40",    border: "border-blue-700",    text: "text-blue-400" },
  "Transfer To Branch":{ dot: "bg-violet-500",  bg: "bg-violet-950/40",  border: "border-violet-700",  text: "text-violet-400" },
  "Notify Customers":  { dot: "bg-cyan-500",    bg: "bg-cyan-950/40",    border: "border-cyan-700",    text: "text-cyan-400" },
  "NGO Donation":      { dot: "bg-rose-400",    bg: "bg-rose-950/40",    border: "border-rose-700",    text: "text-rose-400" },
  "Recycle / Compost": { dot: "bg-slate-500",   bg: "bg-slate-800/60",   border: "border-slate-600",   text: "text-slate-400" },
};

export function RecoveryPipeline({ currentStage, compact = false }: RecoveryPipelineProps) {
  const currentIdx = PIPELINE_STAGES.indexOf(currentStage as PipelineStage);

  if (compact) {
    const colors = STAGE_COLORS[currentStage] || STAGE_COLORS["Normal Sale"];
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border",
        colors.bg, colors.border, colors.text
      )}>
        <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
        {currentStage}
      </span>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Recovery Pipeline</p>
      {PIPELINE_STAGES.map((stage, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isFuture = idx > currentIdx;
        const colors = STAGE_COLORS[stage];

        return (
          <div key={stage} className="flex items-center gap-3">
            {/* Connector line */}
            <div className="flex flex-col items-center shrink-0">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                isPast ? "bg-slate-800 border-slate-700" :
                isCurrent ? cn(colors.bg, colors.border, "scale-110 shadow-lg") :
                "bg-slate-950 border-slate-800"
              )}>
                {isPast ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                ) : isCurrent ? (
                  <span className={cn("w-2 h-2 rounded-full", colors.dot)} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </div>
              {idx < PIPELINE_STAGES.length - 1 && (
                <div className={cn("w-0.5 h-5 mt-0.5", isPast ? "bg-slate-700" : "bg-slate-800")} />
              )}
            </div>

            {/* Stage label */}
            <div className={cn(
              "flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              isCurrent ? cn(colors.bg, "border", colors.border, colors.text, "shadow-sm") :
              isPast ? "text-slate-600" :
              "text-slate-600"
            )}>
              {stage}
              {isCurrent && (
                <span className={cn(
                  "ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                  colors.bg, colors.text
                )}>
                  Current
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
