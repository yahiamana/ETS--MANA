"use client";

import { useState, useEffect, use } from "react";
import { Loader2, Trash2, Mail, MessageSquare, Calendar, User } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminMessages({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">Contact <span className="text-accent text-2xl font-bold">Messages</span></h1>
        <p className="text-secondary mt-2">View and manage customer inquiries from the contact form.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-secondary">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
          <span className="font-black uppercase tracking-[0.2em] text-xs">Loading Messages...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border p-20 text-center transition-colors">
          <MessageSquare className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
          <p className="text-secondary font-bold uppercase tracking-widest text-sm">No messages received yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-card border border-border transition-colors group">
              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase text-foreground flex items-center gap-2">
                       {msg.subject}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-secondary">
                      <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-accent" /> {msg.name}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-accent" /> {new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="p-3 text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                    title="Delete Message"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-muted p-6 border-l-4 border-accent mb-6">
                  <p className="text-secondary text-sm leading-relaxed font-medium">
                    {msg.message}
                  </p>
                </div>

                <div className="pt-6 border-t border-border">
                   <a 
                    href={`mailto:${msg.email}`} 
                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground hover:text-accent transition-colors py-2 px-4 bg-muted border border-border group"
                   >
                    <Mail className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                    Reply to {msg.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
