"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Leaf, Chrome, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { currentUser, login, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during Google Sign-in.");
      setLoading(false);
    }
  };

  const isBtnDisabled = loading || authLoading;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-905 p-8 shadow-2xl">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-4">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Smart Expiry Swap</h1>
          <p className="text-xs text-slate-500 mt-2 max-w-[280px]">
            AI-powered retail decision intelligence platform to maximize value and minimize waste.
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-rose-900/50 bg-rose-950/20 p-3.5 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-normal">{error}</p>
          </div>
        )}

        {/* Google Authentication Button */}
        <Button
          variant="secondary"
          size="lg"
          onClick={handleLogin}
          disabled={isBtnDisabled}
          className="w-full h-11 relative bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white"
        >
          {isBtnDisabled ? (
            <div className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-200" />
              <span>Connecting session...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Chrome className="h-4 w-4" />
              <span>Continue with Google</span>
            </div>
          )}
        </Button>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-600">
            Authorized admin portal access. Security guidelines apply.
          </p>
        </div>
      </div>
    </div>
  );
}
