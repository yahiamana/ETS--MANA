"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

interface QuoteStatusUpdaterProps {
  id: string;
  initialStatus: string;
}

export default function QuoteStatusUpdater({ id, initialStatus }: QuoteStatusUpdaterProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (res.ok) {
        setStatus(newStatus);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-muted p-4 border border-border mt-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Current Status:</span>
      <select
        value={status}
        onChange={(e) => handleUpdate(e.target.value)}
        disabled={loading}
        className="bg-card border border-border p-2 text-sm font-bold uppercase tracking-wider outline-none focus:border-accent min-w-[140px]"
      >
        <option value="PENDING">Pending</option>
        <option value="REVIEWED">Reviewed</option>
        <option value="CONTACTED">Contacted</option>
        <option value="COMPLETED">Completed</option>
      </select>
      
      {loading && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
      {success && (
        <span className="flex items-center text-green-500 text-[10px] font-black uppercase tracking-widest">
          <CheckCircle className="w-4 h-4 mr-1" />
          Updated
        </span>
      )}
    </div>
  );
}
