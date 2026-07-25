"use client";
import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { RecoveryPipeline, RecoveryPipeline as PipelineBadge } from "@/components/dashboard/recovery-pipeline";
import { DispatchModal } from "@/components/dashboard/ngo-dispatch-modal";
import { getExpiryStatus } from "@/lib/utils";
import {
  Search, Plus, Truck, CheckCircle2, RefreshCw, Brain, Download,
  ArrowUpDown, ChevronLeft, ChevronRight, Package, MapPin, Tag,
  Calendar, IndianRupee, Building2, User,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  expiryDate: string;
  manufactureDate: string;
  branch: string;
  location: string;
  status: "Safe" | "Near Expiry" | "Critical";
  supplier: string;
  recoveryStage: string;
  isDispatched: boolean;
  dispatchedToNGO?: string;
  recoveryScore?: number;
}

type SortKey = "name" | "expiryDate" | "stock" | "price";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

const STATUS_VARIANT_MAP: Record<string, any> = {
  "Safe": "safe",
  "Near Expiry": "warning",
  "Critical": "critical",
};

const CATEGORIES = [
  "All", "Fresh Produce", "Dairy & Eggs", "Bakery & Deli",
  "Meat & Seafood", "Pantry & Canned", "Beverages", "Frozen Foods",
  "Pharmaceuticals", "Snacks",
];

export default function InventoryPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [branch, setBranch] = React.useState("All");
  const [activeTab, setActiveTab] = React.useState("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("expiryDate");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [page, setPage] = React.useState(1);

  const [drawerProduct, setDrawerProduct] = React.useState<Product | null>(null);
  const [dispatchTarget, setDispatchTarget] = React.useState<any>(null);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) setProducts(json.data);
      else setError(json.error);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Filter
  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q);
      const matchCat = category === "All" || p.category === category;
      const matchBranch = branch === "All" || p.branch === branch;
      if (activeTab === "critical") return matchSearch && matchCat && matchBranch && p.status === "Critical" && !p.isDispatched;
      if (activeTab === "near") return matchSearch && matchCat && matchBranch && p.status === "Near Expiry";
      if (activeTab === "dispatched") return matchSearch && matchCat && matchBranch && p.isDispatched;
      if (activeTab === "safe") return matchSearch && matchCat && matchBranch && p.status === "Safe";
      return matchSearch && matchCat && matchBranch;
    });
  }, [products, search, category, branch, activeTab]);

  // Sort
  const sorted = React.useMemo(() => {
    return [...filtered].sort((a, b) => {
      let va: any = a[sortKey as keyof Product];
      let vb: any = b[sortKey as keyof Product];
      if (sortKey === "expiryDate") { va = new Date(va).getTime(); vb = new Date(vb).getTime(); }
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      return sortDir === "asc" ? (va < vb ? -1 : 1) : (va > vb ? -1 : 1);
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search, category, branch, activeTab]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["SKU", "Name", "Category", "Stock", "Unit", "Price", "Expiry Date", "Branch", "Location", "Status", "Supplier", "Recovery Stage"];
    const rows = sorted.map((p) => [
      p.sku, p.name, p.category, p.stock, p.unit, p.price,
      new Date(p.expiryDate).toLocaleDateString("en-IN"),
      p.branch, p.location, p.status, p.supplier, p.recoveryStage,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const branches = ["All", ...Array.from(new Set(products.map((p) => p.branch)))];

  const SortTh = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="text-left py-3 px-4 cursor-pointer hover:text-slate-300 transition-colors"
      onClick={() => toggleSort(col)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === col ? "text-emerald-400" : "text-slate-700"}`} />
      </span>
    </th>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Live MongoDB stock tracking with recovery pipeline for every product."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchProducts}>
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="h-3.5 w-3.5" /> Add Item
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: "all", label: "All Stock", count: products.length },
          { id: "critical", label: "Critical (<3d)", count: products.filter((p) => p.status === "Critical" && !p.isDispatched).length },
          { id: "near", label: "Near Expiry", count: products.filter((p) => p.status === "Near Expiry").length },
          { id: "dispatched", label: "Dispatched", count: products.filter((p) => p.isDispatched).length },
          { id: "safe", label: "Safe", count: products.filter((p) => p.status === "Safe").length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name, SKU, or supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-3.5 w-3.5" />}
          className="max-w-xs"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-[180px]"
          options={CATEGORIES.map((c) => ({ label: c === "All" ? "All Categories" : c, value: c }))} />
        <Select value={branch} onChange={(e) => setBranch(e.target.value)} className="max-w-[180px]"
          options={branches.map((b) => ({ label: b === "All" ? "All Branches" : b, value: b }))} />
        <span className="text-xs text-slate-500 self-center ml-auto">
          {sorted.length} of {products.length} records
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {error ? (
              <ErrorState title="Failed to load inventory" message={error} onRetry={fetchProducts} />
            ) : (
              <table className="w-full text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/50">
                  <tr className="text-slate-500 uppercase tracking-wide text-[10px]">
                    <SortTh col="name" label="Item" />
                    <th className="text-left py-3 px-4">Category</th>
                    <SortTh col="stock" label="Stock" />
                    <SortTh col="price" label="Value" />
                    <SortTh col="expiryDate" label="Expiry" />
                    <th className="text-left py-3 px-4">Recovery Stage</th>
                    <th className="text-left py-3 px-4">Branch</th>
                    <th className="text-right py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
                    : paginated.length === 0
                      ? (
                        <tr>
                          <td colSpan={8}>
                            <EmptyState
                              icon={<Package className="h-7 w-7 text-slate-500" />}
                              title="No products found"
                              description="Try adjusting filters or search criteria."
                            />
                          </td>
                        </tr>
                      )
                      : paginated.map((product) => {
                        const expiryStatus = getExpiryStatus(new Date(product.expiryDate).toISOString().slice(0, 10));
                        const totalValue = (product.price * product.stock).toFixed(0);
                        return (
                          <tr
                            key={product._id}
                            className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                            onClick={() => setDrawerProduct(product)}
                          >
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{product.name}</p>
                              <p className="text-[10px] text-slate-600 font-mono mt-0.5">{product.sku} · {product.supplier}</p>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{product.category}</td>
                            <td className="py-3.5 px-4 font-medium text-slate-300">{product.stock} {product.unit}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-emerald-400">₹{Number(totalValue).toLocaleString("en-IN")}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <Badge variant={STATUS_VARIANT_MAP[product.status] || "neutral"}>
                                {new Date(product.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                              </Badge>
                            </td>
                            <td className="py-3.5 px-4">
                              <PipelineBadge currentStage={product.recoveryStage as any} compact />
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">{product.branch}</td>
                            <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                {product.isDispatched ? (
                                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Dispatched
                                  </span>
                                ) : (
                                  <Button variant="primary" size="sm" onClick={() => setDispatchTarget({
                                    id: product._id, sku: product.sku, name: product.name,
                                    quantity: product.stock, unit: product.unit,
                                    expiryDate: new Date(product.expiryDate).toISOString().slice(0, 10),
                                    status: product.status.toLowerCase(),
                                    category: product.category, unitPrice: product.price,
                                    totalValue: product.price * product.stock,
                                    location: product.location, supplier: product.supplier,
                                  })}>
                                    <Truck className="h-3.5 w-3.5" /> Dispatch
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  }
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Page {page} of {totalPages} · {sorted.length} products
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pg = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                        pg === page ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Details Drawer */}
      <Drawer
        isOpen={!!drawerProduct}
        onClose={() => setDrawerProduct(null)}
        title={drawerProduct?.name || ""}
        description={drawerProduct ? `${drawerProduct.sku} · ${drawerProduct.category}` : ""}
        width="md"
      >
        {drawerProduct && (
          <div className="space-y-5">
            {/* Status badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={STATUS_VARIANT_MAP[drawerProduct.status] || "neutral"}>{drawerProduct.status}</Badge>
              {drawerProduct.isDispatched && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Dispatched to {drawerProduct.dispatchedToNGO}
                </span>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Stock", value: `${drawerProduct.stock} ${drawerProduct.unit}` },
                { label: "Unit Price", value: `₹${drawerProduct.price.toFixed(2)}` },
                { label: "Total Value", value: `₹${(drawerProduct.price * drawerProduct.stock).toFixed(0)}` },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-center">
                  <p className="text-[10px] text-slate-500 mb-1">{m.label}</p>
                  <p className="text-sm font-bold text-slate-100">{m.value}</p>
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2.5">
              {[
                { icon: <Tag className="h-3.5 w-3.5" />, label: "SKU", value: drawerProduct.sku },
                { icon: <Package className="h-3.5 w-3.5" />, label: "Category", value: drawerProduct.category },
                { icon: <Calendar className="h-3.5 w-3.5" />, label: "Expiry Date", value: new Date(drawerProduct.expiryDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) },
                { icon: <Calendar className="h-3.5 w-3.5" />, label: "Manufactured", value: new Date(drawerProduct.manufactureDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) },
                { icon: <MapPin className="h-3.5 w-3.5" />, label: "Location", value: drawerProduct.location },
                { icon: <Building2 className="h-3.5 w-3.5" />, label: "Branch", value: drawerProduct.branch },
                { icon: <User className="h-3.5 w-3.5" />, label: "Supplier", value: drawerProduct.supplier },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-2.5 text-xs">
                  <span className="text-slate-600">{d.icon}</span>
                  <span className="text-slate-500 w-24 shrink-0">{d.label}</span>
                  <span className="text-slate-300 font-medium">{d.value}</span>
                </div>
              ))}
            </div>

            {/* Recovery Pipeline */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <RecoveryPipeline currentStage={drawerProduct.recoveryStage as any} />
            </div>

            {/* Actions */}
            {!drawerProduct.isDispatched && (
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setDispatchTarget({
                      id: drawerProduct._id, sku: drawerProduct.sku, name: drawerProduct.name,
                      quantity: drawerProduct.stock, unit: drawerProduct.unit,
                      expiryDate: new Date(drawerProduct.expiryDate).toISOString().slice(0, 10),
                      status: drawerProduct.status.toLowerCase(),
                      category: drawerProduct.category, unitPrice: drawerProduct.price,
                      totalValue: drawerProduct.price * drawerProduct.stock,
                      location: drawerProduct.location, supplier: drawerProduct.supplier,
                    });
                    setDrawerProduct(null);
                  }}
                >
                  <Truck className="h-3.5 w-3.5" /> Dispatch to NGO
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Dispatch Modal */}
      <DispatchModal
        item={dispatchTarget}
        isOpen={!!dispatchTarget}
        onClose={() => setDispatchTarget(null)}
        onSuccess={(itemId, ngoName) => {
          setProducts((prev) =>
            prev.map((p) => p._id === itemId ? { ...p, isDispatched: true, dispatchedToNGO: ngoName } : p)
          );
        }}
      />
    </div>
  );
}
