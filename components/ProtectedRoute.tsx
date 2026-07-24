"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Leaf } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !currentUser && pathname !== "/login") {
      router.replace("/login");
    }
  }, [currentUser, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 text-slate-100 gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/20">
          <Leaf className="h-6 w-6 text-white animate-spin [animation-duration:3s]" />
        </div>
        <p className="text-sm font-medium text-slate-500 tracking-wide">Securing session...</p>
      </div>
    );
  }

  if (!currentUser && pathname !== "/login") {
    return null; // Prevents flashing of content during redirection
  }

  return <>{children}</>;
}
