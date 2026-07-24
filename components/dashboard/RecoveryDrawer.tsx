"use client";
import * as React from "react";
import {
  AIRecommendation,
  RECOVERY_PIPELINE,
} from "@/lib/recovery-engine";
import {
  X,
  Brain,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Tag,
  Package2,
  Truck,
  Bell,
  HeartHandshake,
  Recycle,
  ShoppingCart,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────

const ACTION_ICONS: Record<string, React.ReactNode> = {
  "Continue Normal Sale":        <ShoppingCart className="h-3.5 w-3.5" />,
  "Apply Discount":              <Tag className="h-3.5 w-3.5" />,
  "Bundle With Another Product": <Package2 className="h-3.5 w-3.5" />,
  "Transfer To Another Branch":  <Truck className="h-3.5 w-3.5" />,
  "Notify Nearby Customers":     <Bell className="h-3.5 w-3.5" />,
  "Donate To NGO":               <HeartHandshake className="h-3.5 w-3.5" />,
  "Recycle / Compost":           <Recycle className="h-3.5 w-3.5" />,
};

function getScoreColors(score: number) {
  if (score >= 75) return { bar: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-900/40" };
  if (score >= 50) return { bar: "bg-amber-500",   text: "text-amber-400",   glow: "shadow-amber-900/40" };
  return              { bar: "bg-rose-500",          text: "text-rose-400",    glow: "shadow-rose-900/40" };
}

function getRiskBadge(score: number) {
  if (score >= 75) return { label: "Safe",     cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" };
  if (score >= 50) return { label: "Warning",  cls: "bg-amber-500/15   text-amber-400   border border-amber-500/30" };
  return              { label: "Critical", cls: "bg-rose-500/15    text-rose-400    border border-rose-500/30" };
}

function getPriorityBadge(priority: string) {
  const map: Record<string, string> = {
    Urgent: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    High:   "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    Medium: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    Low:    "bg-slate-700/50 text-slate-400 border border-slate-600",
  };
  return map[priority] ?? map.Low;
}

// ── Pipeline ──────────────────────────────────────────────────────────────

function RecoveryPipeline({ active }: { active: string }) {
  return (
    <div className="space-y-0">
      {RECOVERY_PIPELINE.map((step, i) => {
        const isActive = step === active;
        const isPast = RECOVERY_PIPELINE.indexOf(active as typeof RECOVERY_PIPELINE[number]) > i;
        const icon = ACTION_ICONS[step];
        return (
          <div key={step} className="flex flex-col items-start">
            <div
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 transition-all ${
                isActive
                  ? "bg-violet-600/20 border border-violet-600/40 shadow-md shadow-violet-900/30"
                  : isPast
                  ? "opacity-40"
                  : "opacity-50"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : isPast
                    ? "bg-slate-700 text-slate-500"
                    : "bg-slate-800 text-slate-600"
                }`}
              >
                {icon}
              </div>
              <span
                className={`text-xs font-medium flex-1 ${
                  isActive ? "text-violet-200" : "text-slate-500"
                }`}
              >
                {step}
              </span>
              {isActive && (
                <span className="text-[10px] font-semibold text-violet-400 bg-violet-900/40 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
            </div>
            {i < RECOVERY_PIPELINE.length - 1 && (
              <div className="ml-[22px] h-3 flex items-center">
                <ArrowDown className="h-2.5 w-2.5 text-slate-700" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Loading Skeleton ──────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-3/4 rounded bg-slate-800" />
      <div className="h-2.5 w-full rounded-full bg-slate-800" />
      <div className="h-20 rounded-xl bg-slate-800" />
      <div className="h-16 rounded-xl bg-slate-800" />
      <div className="space-y-2">
        {[...Array(7)].map((_, i) => <div key={i} className="h-9 rounded-lg bg-slate-800" />)}
      </div>
    </div>
  );
}

// ── Main Drawer ────────────────────────────────────────────────────────────

export interface RecoveryDrawerProps {
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  recommendation: AIRecommendation | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function RecoveryDrawer({
  productName,
  isOpen,
  onClose,
  recommendation,
  isLoading = false,
  error = null,
  onRetry,
}: RecoveryDrawerProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/60 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shrink-0">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-100">AI Recovery Engine</p>
            <p className="text-[11px] text-slate-500 truncate">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {isLoading ? (
            <Skeleton />
          ) : error ? (
            <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-rose-300">Error</p>
                  <p className="text-xs text-rose-400/70 mt-1">{error}</p>
                </div>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-3 flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/40 rounded-lg px-3 py-1.5 hover:bg-rose-900/20 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Retry
                </button>
              )}
            </div>
          ) : recommendation ? (
            <>
              {/* Score Section */}
              {(() => {
                const colors = getScoreColors(recommendation.recoveryScore);
                const risk = getRiskBadge(recommendation.recoveryScore);
                return (
                  <div className={`rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg ${colors.glow}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recovery Score</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${risk.cls}`}>{risk.label}</span>
                        <span className={`text-xl font-bold ${colors.text}`}>
                          {recommendation.recoveryScore}
                          <span className="text-xs font-normal text-slate-500">/100</span>
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                        style={{ width: `${recommendation.recoveryScore}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Recommended Action */}
              <div className="flex items-center gap-3 rounded-xl bg-violet-600/10 border border-violet-600/30 px-4 py-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-violet-400 shrink-0">
                  {ACTION_ICONS[recommendation.recommendedAction]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-0.5">Recommended Action</p>
                  <p className="text-sm font-bold text-violet-100">{recommendation.recommendedAction}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-violet-600 shrink-0" />
              </div>

              {/* AI Reason */}
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-3.5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Analysis</p>
                <p className="text-xs text-slate-300 leading-relaxed">{recommendation.reason}</p>
              </div>

              {/* Revenue + Priority Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-950/30 border border-emerald-900/40 px-4 py-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">Revenue Recovery</p>
                  </div>
                  <p className="text-xs font-bold text-emerald-300 leading-snug">{recommendation.estimatedRevenueRecovered}</p>
                </div>
                <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 px-4 py-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Priority</p>
                  </div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${getPriorityBadge(recommendation.priority)}`}>
                    {recommendation.priority}
                  </span>
                </div>
              </div>

              {/* Recovery Pipeline */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-slate-800" />
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Product Recovery Pipeline</p>
                  <div className="h-px flex-1 bg-slate-800" />
                </div>
                <RecoveryPipeline active={recommendation.recommendedAction} />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <CheckCircle2 className="h-3 w-3 text-slate-600" />
                <span className="text-[10px] text-slate-600">Rule-based engine · Gemini AI ready</span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
