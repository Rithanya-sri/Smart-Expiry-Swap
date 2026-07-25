"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  Bell, AlertTriangle, Brain, HeartHandshake, Package, ArrowLeftRight,
  CheckCircle2, X, Filter, RefreshCw,
} from "lucide-react";

interface Notification {
  id: string;
  type: "expiry" | "ai" | "ngo" | "inventory" | "transfer";
  title: string;
  message: string;
  severity: "critical" | "warning" | "info" | "success";
  timestamp: string;
  read: boolean;
}

const TYPE_CONFIG = {
  expiry:    { icon: <AlertTriangle className="h-4 w-4" />, bg: "bg-rose-950/40 border-rose-800", icon_text: "text-rose-400", label: "Near Expiry" },
  ai:        { icon: <Brain className="h-4 w-4" />,         bg: "bg-violet-950/40 border-violet-800", icon_text: "text-violet-400", label: "AI" },
  ngo:       { icon: <HeartHandshake className="h-4 w-4" />,bg: "bg-amber-950/40 border-amber-800", icon_text: "text-amber-400", label: "NGO" },
  inventory: { icon: <Package className="h-4 w-4" />,       bg: "bg-blue-950/40 border-blue-800", icon_text: "text-blue-400", label: "Inventory" },
  transfer:  { icon: <ArrowLeftRight className="h-4 w-4" />,bg: "bg-emerald-950/40 border-emerald-800", icon_text: "text-emerald-400", label: "Transfer" },
};

const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-rose-500",
  warning:  "bg-amber-500",
  info:     "bg-blue-500",
  success:  "bg-emerald-500",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>("all");

  const fetchNotifications = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success) setNotifications(json.data);
      else setError(json.error);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filterTypes = [
    { id: "all", label: "All" },
    { id: "expiry", label: "Near Expiry" },
    { id: "ai", label: "AI" },
    { id: "ngo", label: "NGO" },
    { id: "inventory", label: "Inventory" },
    { id: "transfer", label: "Transfer" },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notification Center"
        description="System-wide alerts and updates from your inventory operations."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 border border-emerald-800/50 px-3 py-1.5 rounded-lg bg-emerald-950/20 transition-all"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
        }
      />

      {/* Stats bar */}
      <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400">{notifications.length} total</span>
        </div>
        {unreadCount > 0 && (
          <span className="text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-900 px-2 py-0.5 rounded-full">
            {unreadCount} unread
          </span>
        )}
        <div className="h-4 w-px bg-slate-800 ml-1" />
        <div className="flex items-center gap-2 flex-wrap">
          {filterTypes.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
                filter === f.id
                  ? "bg-emerald-600/15 text-emerald-400 border border-emerald-700/40"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      {error ? (
        <ErrorState title="Failed to load notifications" message={error} onRetry={fetchNotifications} />
      ) : (
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-start gap-3">
                <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-7 w-7 text-slate-500" />}
              title="No notifications"
              description={filter === "all" ? "You're all caught up! No notifications at this time." : `No ${filter} notifications found.`}
            />
          ) : (
            filtered.map((notif) => {
              const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.inventory;
              return (
                <div
                  key={notif.id}
                  className={`relative flex items-start gap-3 rounded-xl border p-4 transition-all ${
                    notif.read
                      ? "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                      : "border-slate-700 bg-slate-900 hover:border-slate-600 shadow-sm"
                  }`}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <span className={`absolute top-4 left-4 w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[notif.severity]}`} />
                  )}

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${config.bg} ${config.icon_text}`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className={`text-xs font-semibold leading-tight ${notif.read ? "text-slate-400" : "text-slate-100"}`}>
                        {notif.title}
                      </p>
                      <span className={`text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border ${config.bg} ${config.icon_text} shrink-0`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{notif.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1.5">{timeAgo(notif.timestamp)}</p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => dismiss(notif.id)}
                    className="shrink-0 p-1 text-slate-600 hover:text-slate-400 hover:bg-slate-800 rounded transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
