"use client";

import { useState, useEffect, use } from "react";
import { Loader2, Trash2, Mail, Phone, FileText, User, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  message: string | null; // Renamed from coverLetter to match DB
  status: string;
  createdAt: string;
  job: {
    title: any;
    department: string;
  };
}

export default function AdminApplications({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchApplications();
      if (selectedApp?.id === id) {
        setSelectedApp(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await fetch("/api/admin/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchApplications();
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-600/10 text-blue-700 border-blue-600/30";
      case "IN_REVIEW": return "bg-amber-600/10 text-amber-700 border-amber-600/30";
      case "INTERVIEW": return "bg-purple-600/10 text-purple-700 border-purple-600/30";
      case "OFFER": return "bg-orange-600/10 text-orange-700 border-orange-600/30";
      case "HIRED": return "bg-emerald-600/10 text-emerald-700 border-emerald-600/30";
      case "REJECTED": return "bg-rose-600/10 text-rose-700 border-rose-600/30";
      default: return "bg-slate-500/10 text-slate-700 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Job <span className="text-accent text-2xl font-bold">Applications</span></h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium">Manage and review candidates for the industrial workshop.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-accent" />
          <span className="font-black uppercase tracking-[0.2em] text-xs">Synchronizing Records...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 p-24 text-center rounded-sm">
          <User className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
          <h3 className="text-xl font-black uppercase text-slate-900 dark:text-white mb-2">No Applications Found</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm font-medium">Candidate records will appear here once submitted via the main site.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden rounded-sm">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200/50 dark:border-slate-800/50">Candidate</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200/50 dark:border-slate-800/50">Position / Dept</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200/50 dark:border-slate-800/50">Current Status</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-500 border-r border-slate-200/50 dark:border-slate-800/50">Submission Date</th>
                  <th className="p-5 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="p-5 border-r border-slate-100 dark:border-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-slate-900 dark:bg-accent text-white flex items-center justify-center font-black text-sm rounded-sm">
                          {app.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{app.fullName}</div>
                          <div className="text-xs text-slate-500 font-bold">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 border-r border-slate-100 dark:border-slate-800/50">
                      <div className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                        {(app.job.title as any)[locale] || (app.job.title as any)['en'] || "Industrial Specialist"}
                      </div>
                      <div className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-sm border border-slate-200 dark:border-slate-700">
                        {app.job.department}
                      </div>
                    </td>
                    <td className="p-5 border-r border-slate-100 dark:border-slate-800/50">
                      <select 
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className={cn(
                          "text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded border outline-none cursor-pointer hover:brightness-95 transition-all text-center min-w-[120px] shadow-sm",
                          getStatusColor(app.status)
                        )}
                        style={{ WebkitAppearance: 'none' }}
                      >
                        <option value="NEW">New Listing</option>
                        <option value="IN_REVIEW">Under Review</option>
                        <option value="INTERVIEW">Scheduling Interview</option>
                        <option value="OFFER">Contract Offer</option>
                        <option value="HIRED">Direct Hire</option>
                        <option value="REJECTED">Closed / Rejected</option>
                      </select>
                    </td>
                    <td className="p-5 text-xs text-slate-900 dark:text-slate-300 font-black tracking-tighter border-r border-slate-100 dark:border-slate-800/50">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-sm"
                          title="Open Detailed View"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all rounded-sm"
                          title="Purge Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Compact List Layout */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {applications.map((app) => (
              <div key={app.id} className="p-6 bg-white dark:bg-slate-950">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 dark:bg-accent text-white flex items-center justify-center font-black rounded-sm">
                      {app.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{app.fullName}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {(app.job.title as any)[locale] || (app.job.title as any)['en']}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedApp(app)} className="p-2 text-accent bg-accent/5 rounded-sm"><ChevronRight className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(app.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-sm"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <select 
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className={cn(
                      "flex-1 p-2.5 text-[10px] font-black uppercase tracking-widest rounded border outline-none text-center shadow-sm",
                      getStatusColor(app.status)
                    )}
                  >
                        <option value="NEW">New Listing</option>
                        <option value="IN_REVIEW">Under Review</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Contract Offer</option>
                        <option value="HIRED">Direct Hire</option>
                        <option value="REJECTED">Closed / Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl border-t-8 border-accent shadow-2xl overflow-hidden rounded-sm relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setSelectedApp(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="overflow-y-auto p-8 md:p-12 space-y-10">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-20 h-20 bg-slate-900 dark:bg-accent text-white flex items-center justify-center text-3xl font-black rounded-sm shadow-lg">
                  {selectedApp.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase text-slate-900 dark:text-white tracking-tight mb-2 leading-none">
                    {selectedApp.fullName}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm border",
                      getStatusColor(selectedApp.status)
                    )}>
                      {selectedApp.status.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-sm border border-slate-200 dark:border-slate-800 text-slate-500">
                      ID: {selectedApp.id.slice(-8)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a 
                  href={selectedApp.cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-3 bg-slate-900 text-white py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-accent transition-all rounded-sm"
                >
                  <FileText className="w-5 h-5" />
                  View Resume / CV
                </a>
                <a 
                  href={`mailto:${selectedApp.email}`}
                  className="flex items-center justify-center gap-3 border-2 border-slate-200 dark:border-slate-800 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:bg-slate-50 transition-all rounded-sm"
                >
                  <Mail className="w-5 h-5" />
                  Contact
                </a>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Position Applied</span>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {(selectedApp.job.title as any)[locale] || (selectedApp.job.title as any)['en']}
                  </p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">{selectedApp.job.department}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Details</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{selectedApp.email}</span>
                    <span className="text-xs font-bold text-slate-500">{selectedApp.phone}</span>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message / Cover Letter</span>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-sm border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedApp.message || "No cover letter provided with this application."}
                  </p>
                </div>
              </div>

              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Submitted on {new Date(selectedApp.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ensure X icon is imported
import { X } from "lucide-react";
