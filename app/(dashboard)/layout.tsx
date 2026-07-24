import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
