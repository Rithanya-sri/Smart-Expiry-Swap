"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { StatCardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/ui/empty-state";
import {
  AlertOctagon, HeartHandshake, ArrowLeftRight, IndianRupee,
  ClipboardList, Clock, MapPin, Building2, CheckCircle2, RefreshCw,
  Zap, AlertTriangle, Package,
} from "lucide-react";
import { Tabs } from "@/components/ui/tabs";

interface ActionsData {
  immediateAction: any[];
  ngoPickup: any[];
  transferred: any[];
  recoveredRevenue: number;
  pendingTasks: any[];
}

const PRIORITY_STYLE: Record<string, string> = {
  Urgent: "text-rose-400 bg-rose-950/40 border-rose-800",
  High: "text-amber-400 bg-amber-950/40 border-amber-800",
  Medium: "text-blue-400 bg-blue-950/40 border-blue-800",
};

export default function ActionsPage() {
  const [data, setData] = React.useState<ActionsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState("immediate");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/manager-actions");
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  if (error) return (
    <div className="space-y-6">
      <PageHeader title="Manager Action Center" description="Products requiring your attention right now." />
      <ErrorState title="Failed to load actions" message={error} onRetry={fetchData} />
    </div>
  );

  const statCards = data ? [
    { title: "Immediate Action", value: data.immediateAction.length.toString(), change: "Critical items", trend: "down" as const, icon: <AlertOctagon className="h-4 w-4" />, color: "rose" as const },
    { title: "NGO Pickup Queue", value: data.ngoPickup.length.toString(), change: "Awaiting pickup", trend: "up" as const, icon: <HeartHandshake className="h-4 w-4" />, color: "violet" as const },
    { title: "Transferred", value: data.transferred.length.toString(), change: "Inter-branch", trend: "up" as const, icon: <ArrowLeftRight className="h-4 w-4" />, color: "blue" as const },
    { title: "Revenue Recovered", value: `₹${data.recoveredRevenue.toLocaleString("en-IN")}`, change: "This cycle", trend: "up" as const, icon: <IndianRupee className="h-4 w-4" />, color: "emerald" as const },
  ] : [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manager Action Center"
        description="Real-time action queue for products requiring immediate management decisions."
        action={
          <button
            onClick={fetchData}
            className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 border border-emerald-800/50 px-3 py-1.5 rounded-lg bg-emerald-950/20 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((s) => (
            <StatCard key={s.title} title={s.title} value={s.value} change={s.change}
              trend={s.trend} subtitle="" icon={s.icon} color={s.color} />
          ))
        }
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "immediate", label: "Immediate Action", count: data?.immediateAction.length || 0 },
          { id: "ngo", label: "NGO Pickup", count: data?.ngoPickup.length || 0 },
          { id: "transferred", label: "Transferred", count: data?.transferred.length || 0 },
          { id: "tasks", label: "Pending Tasks", count: data?.pendingTasks.length || 0 },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Content */}
      {activeTab === "immediate" && (
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <AlertOctagon className="h-4 w-4 text-rose-400" />
              Products Requiring Immediate Action
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Critical products expiring within 3 days that have not been dispatched.</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : data?.immediateAction.length === 0 ? (
              <EmptyState
                icon={<CheckCircle2 className="h-7 w-7 text-emerald-500" />}
                title="All clear!"
                description="No products require immediate action right now."
              />
            ) : (
              <div className="divide-y divide-slate-800/50">
                {data?.immediateAction.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/20 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                      p.daysLeft <= 1 ? "bg-rose-950 text-rose-400 border border-rose-900" : "bg-amber-950 text-amber-400 border border-amber-900"
                    }`}>
                      {Math.max(p.daysLeft, 0)}d
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500">{p.sku}</span>
                        <span className="text-slate-700">·</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500"><Building2 className="h-3 w-3" />{p.branch}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-200">{p.stock} {p.unit}</p>
                      <p className="text-[10px] text-emerald-400">₹{p.value.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="shrink-0">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${PRIORITY_STYLE["Urgent"]}`}>
                        Urgent
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "ngo" && (
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <HeartHandshake className="h-4 w-4 text-violet-400" />
              Products Waiting for NGO Pickup
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Dispatched items pending NGO collection.</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : data?.ngoPickup.length === 0 ? (
              <EmptyState title="No pending NGO pickups" description="All dispatched items have been collected." />
            ) : (
              <div className="divide-y divide-slate-800/50">
                {data?.ngoPickup.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/20 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-900 flex items-center justify-center shrink-0">
                      <HeartHandshake className="h-4 w-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-violet-400 mt-0.5">{p.ngo}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-200">{p.stock} units</p>
                      <p className="text-[10px] text-slate-500">{p.daysLeft}d remaining</p>
                    </div>
                    <Badge variant="safe">Dispatched</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "transferred" && (
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <ArrowLeftRight className="h-4 w-4 text-blue-400" />
              Products Transferred
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Items being moved to higher-demand branches.</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : data?.transferred.length === 0 ? (
              <EmptyState title="No active transfers" description="No products are currently being transferred between branches." />
            ) : (
              <div className="divide-y divide-slate-800/50">
                {data?.transferred.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/20 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-900 flex items-center justify-center shrink-0">
                      <ArrowLeftRight className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="h-3 w-3" /> From: {p.branch}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-slate-200">{p.stock} {p.unit}</p>
                      <p className="text-[10px] text-slate-500">{p.daysLeft}d left</p>
                    </div>
                    <Badge variant="warning">In Transit</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "tasks" && (
        <Card>
          <CardHeader className="border-b border-slate-800 pb-3">
            <CardTitle>
              <ClipboardList className="h-4 w-4 text-amber-400" />
              Pending Recovery Tasks
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Actionable recovery tasks ranked by urgency.</p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : data?.pendingTasks.length === 0 ? (
              <EmptyState title="No pending tasks" description="All recovery tasks are completed." />
            ) : (
              <div className="divide-y divide-slate-800/50">
                {data?.pendingTasks.map((task: any) => (
                  <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/20 transition-colors">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.priority === "Urgent" ? "bg-rose-500" : "bg-amber-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200">{task.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{task.branch} · {task.daysLeft}d left</p>
                    </div>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${PRIORITY_STYLE[task.priority] || "text-slate-400 bg-slate-800 border-slate-700"}`}>
                      {task.priority}
                    </span>
                    <button className="text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded hover:bg-emerald-950/30 transition-colors">
                      Resolve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
