"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6 industrial-grid">
      <div className="w-full max-w-md bg-card border-t-8 border-accent shadow-2xl p-10 transition-colors">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl font-black text-primary tracking-tighter">MANA</span>
            <div className="w-2 h-2 bg-accent rounded-full" />
          </div>
          <h1 className="text-xs font-black uppercase tracking-[0.4em] text-secondary">Workshop Admin Panel</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 text-xs font-bold uppercase mb-6 flex items-center border-l-4 border-red-500">
            <Lock className="w-4 h-4 mr-3 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-muted border border-border p-4 text-sm font-semibold focus:border-accent outline-none"
              placeholder="admin@manworkshop.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-muted border border-border p-4 text-sm font-semibold focus:border-accent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-5 font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <ShieldCheck className="w-5 h-5 mr-3" />
                Access Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-widest">
            Secure Industrial Access System v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
