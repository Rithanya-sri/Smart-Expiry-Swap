"use client";
import * as React from "react";
import { AIRecommendation } from "@/lib/gemini";
import {
  Brain,
  Zap,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  IndianRupee,
  ShieldAlert,
  Tag,
  Truck,
  Package2,
  Bell,
  HeartHandshake,
  Recycle,
  ShoppingCart,
} from "lucide-react";

// ── Action Icons ────────────────────────────────────────────────────────────
const ACTION_ICONS: Record<string, React.ReactNode> = {
  "Continue Normal Sale":       <ShoppingCart className="h-4 w-4" />,
  "Apply Discount":             <Tag className="h-4 w-4" />,
  "Bundle With Another Product":<Package2 className="h-4 w-4" />,
  "Transfer To Another Branch": <Truck className="h-4 w-4" />,
  "Notify Nearby Customers":    <Bell className="h-4 w-4" />,
  "Donate To NGO":              <HeartHandshake className="h-4 w-4" />,
  "Recycle / Compost":          <Recycle className="h-4 w-4" />,
};

// ── Color helpers ────────────────────────────────────────────────────────────
function getScoreColor(score: number) {
  if (score >= 70) return { bar: "bg-emerald-500", text: "text-emerald-400", glow: "shadow-emerald-500/30" };
  if (score >= 40) return { bar: "bg-amber-500",   text: "text-amber-400",   glow: "shadow-amber-500/30" };
  return             { bar: "bg-rose-500",          text: "text-rose-400",    glow: "shadow-rose-500/30" };
}

function getRiskLevel(score: number): { label: string; cls: string } {
  if (score >= 70) return { label: "Safe",     cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" };
  if (score >= 40) return { label: "Warning",  cls: "bg-amber-500/15   text-amber-400   border border-amber-500/30" };
  return             { label: "Critical", cls: "bg-rose-500/15    text-rose-400    border border-rose-500/30" };
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Urgent": return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
    case "High":   return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
    case "Medium": return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    default:       return "bg-slate-700/50 text-slate-400 border border-slate-600/30";
  }
}

// ── Loading Skeleton ─────────────────────────────────────────────────────────
function RecommendationSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800" />
        <div className="h-4 w-48 rounded bg-slate-800" />
        <div className="ml-auto h-5 w-20 rounded-full bg-slate-800" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-28 rounded bg-slate-800" />
          <div className="h-3 w-10 rounded bg-slate-800" />
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-800" />
      </div>
      <div className="h-10 w-full rounded-lg bg-slate-800" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-800" />
        <div className="h-3 w-3/4 rounded bg-slate-800" />
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
interface RecommendationCardProps {
  productName: string;
  recommendation?: AIRecommendation | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function RecommendationCard({
  productName,
  recommendation,
  isLoading = false,
  error = null,
  onRetry,
}: RecommendationCardProps) {
  if (isLoading) return <RecommendationSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-rose-300">AI Engine Error</p>
            <p className="text-xs text-rose-400/70 mt-1">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors border border-rose-900/40 rounded-lg px-3 py-1.5 hover:bg-rose-900/20 shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  const scoreColor = getScoreColor(recommendation.recoveryScore);
  const risk = getRiskLevel(recommendation.recoveryScore);
  const priorityStyle = getPriorityStyle(recommendation.priority);
  const actionIcon = ACTION_ICONS[recommendation.recommendedAction] ?? <Zap className="h-4 w-4" />;

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm overflow-hidden shadow-lg ${scoreColor.glow}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/40">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/40">
          <Brain className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-200 truncate">AI Recovery Engine</p>
          <p className="text-[10px] text-slate-500 truncate">{productName}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${risk.cls}`}>
          {risk.label}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Recovery Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recovery Score</span>
            <span className={`text-lg font-bold ${scoreColor.text}`}>
              {recommendation.recoveryScore}
              <span className="text-xs font-normal text-slate-500">/100</span>
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scoreColor.bar}`}
              style={{ width: `${recommendation.recoveryScore}%` }}
            />
          </div>
        </div>

        {/* Recommended Action */}
        <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 border border-slate-700/40 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-violet-400 shrink-0">
            {actionIcon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Recommended Action</p>
            <p className="text-sm font-semibold text-slate-100">{recommendation.recommendedAction}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />
        </div>

        {/* Reason */}
        <div className="rounded-lg bg-slate-800/30 border border-slate-800 px-4 py-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">AI Analysis</p>
          <p className="text-xs text-slate-300 leading-relaxed">{recommendation.reason}</p>
        </div>

        {/* Revenue + Priority Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-emerald-950/30 border border-emerald-900/40 px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <p className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">Revenue Recovery</p>
            </div>
            <p className="text-sm font-bold text-emerald-300">{recommendation.estimatedRevenueRecovered}</p>
          </div>
          <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Priority</p>
            </div>
            <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${priorityStyle}`}>
              {recommendation.priority}
            </span>
          </div>
        </div>

        {/* Powered by footer */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-[10px] text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="h-2.5 w-2.5" /> Powered by Gemini Flash
          </span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
