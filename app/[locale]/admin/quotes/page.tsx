"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Loader2, Trash2, Mail, Phone, ExternalLink, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Quote {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string | null;
  phone: string | null;
  description: string;
  status: string;
  createdAt: string;
}

export default function AdminQuotes({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/admin/quotes");
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchQuotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch("/api/admin/quotes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchQuotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">Quote <span className="text-secondary text-2xl font-bold">Requests</span></h1>
        <p className="text-secondary mt-2">Manage incoming industrial project inquiries and technical requests.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-secondary">
          <Loader2 className="w-10 h-10 animate-spin mr-4" />
          <span className="font-bold uppercase tracking-widest">Loading Inquiries...</span>
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border p-20 text-center transition-colors">
          <MessageCircle className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
          <p className="text-secondary font-bold uppercase tracking-widest">No quote requests yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-card border border-border overflow-hidden flex flex-col md:flex-row transition-colors">
              <div className={cn(
                "w-2 shrink-0",
                quote.status === "PENDING" ? "bg-accent" : 
                quote.status === "REVIEWED" ? "bg-blue-500" : "bg-green-500"
              )} />
              
              <div className="p-8 flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  <div>
                    <Link href={`/admin/quotes/${quote.id}`} className="group">
                      <h3 className="text-xl font-black uppercase text-foreground mb-1 group-hover:text-accent transition-colors flex items-center gap-2">
                        {quote.firstName} {quote.lastName}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                    </Link>
                    <div className="text-[10px] font-black uppercase tracking-widest text-secondary flex flex-wrap gap-4">
                      <span>{quote.company || "Individual Client"}</span>
                      <span className="text-accent">{new Date(quote.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select 
                      value={quote.status}
                      onChange={(e) => handleUpdateStatus(quote.id, e.target.value)}
                      className="bg-muted border border-border p-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(quote.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-secondary text-sm leading-relaxed italic bg-muted p-4 border-l-4 border-border">
                    "{quote.description}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 pt-6 border-t border-border">
                  <a href={`mailto:${quote.email}`} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors">
                    <Mail className="w-4 h-4" />
                    <span>{quote.email}</span>
                  </a>
                  {quote.phone && (
                    <a href={`tel:${quote.phone}`} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors">
                      <Phone className="w-4 h-4" />
                      <span>{quote.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
