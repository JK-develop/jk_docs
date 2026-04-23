"use client";

import React, { useState } from "react";
import { loginAdmin } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(password);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error || "Invalid password");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/20 mb-4">
            <Lock className="w-8 h-8 accent-green" />
          </div>
          <h1 className="text-3xl font-extrabold text-app tracking-tight mb-2">
            Admin <span className="accent-green">Access</span>
          </h1>
          <p className="text-muted text-sm">
            Please enter your secure password to manage the documentation.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted ml-1">
                Security Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-4 transition-all ring-accent-green bg-white/5 text-app border border-white/10 placeholder:text-slate-600 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:accent-green transition-colors" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gradient-to-r from-lime-500 to-lime-400 text-black hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none shadow-lg shadow-lime-500/10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-xs text-muted">
          This area is restricted. All attempts are logged.
        </p>
      </div>
    </div>
  );
}
