"use client";

import { useState, useEffect, use } from "react";
import { Plus, Trash2, Edit, Loader2, Briefcase, MapPin, CheckCircle, XCircle, Users, FileText, X } from "lucide-react";

interface Job {
  id: string;
  title: any;
  department: string;
  location: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  active?: boolean;
  jobType: string;
  salaryRange?: string;
  description: any;
  requirements: any;
  // _count might be needed for authorized counts, but we can fetch separately
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  message?: string;
  status: string;
  notes?: string;
  createdAt: string;
  jobId: string;
}

export default function AdminRecruitment({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "fr" | "ar">("en");

  const [formData, setFormData] = useState({
    title: { en: "", fr: "", ar: "" },
    department: "Machining Division",
    location: "Main Workshop",
    status: "PUBLISHED",
    jobType: "FULL_TIME",
    salaryRange: "",
    description: { en: "", fr: "", ar: "" },
    requirements: { en: "", fr: "", ar: "" }
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          active: formData.status === "PUBLISHED"
        }),
      });
      setShowModal(false);
      resetForm();
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: "", fr: "", ar: "" },
      department: "Machining Division",
      location: "Main Workshop",
      status: "PUBLISHED",
      jobType: "FULL_TIME",
      salaryRange: "",
      description: { en: "", fr: "", ar: "" },
      requirements: { en: "", fr: "", ar: "" }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vacancy?")) return;
    try {
      await fetch("/api/admin/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await fetch("/api/admin/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: job.id, 
          active: newStatus === "PUBLISHED" 
        }),
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status }),
      });
      if (res.ok) {
        setApplications(apps => apps.map(a => a.id === appId ? { ...a, status } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const filteredApplications = applications.filter(a => a.jobId === selectedJobId);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">Vacancy <span className="text-secondary text-2xl font-bold">Manager</span></h1>
          <p className="text-secondary mt-2">Manage open positions and recruitment for MANA Workshop.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-accent text-primary-foreground px-8 py-3 font-black uppercase tracking-widest flex items-center hover:bg-primary transition-all shadow-lg"
        >
          <Plus className="w-5 h-5 mr-3" />
          Add New Vacancy
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-secondary">
          <Loader2 className="w-10 h-10 animate-spin mr-4" />
          <span className="font-bold uppercase tracking-widest">Loading Vacancies...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border p-20 text-center transition-colors">
          <Briefcase className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
          <p className="text-secondary font-bold uppercase tracking-widest">No active vacancies.</p>
        </div>
      ) : (
        <div className="bg-card border border-border overflow-hidden shadow-sm transition-colors">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Position</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Applicants</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const appCount = applications.filter(a => a.jobId === job.id).length;
                return (
                  <tr key={job.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-black text-foreground uppercase line-clamp-1">{job.title?.en || "Untitled"}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="text-[10px] font-bold text-accent uppercase tracking-widest">{job.department}</div>
                        <div className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest border border-border px-2 py-0.5 rounded-full">
                           {job.jobType.replace("_", " ")}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleStatus(job)}
                        className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border transition-colors ${
                          job.status === "PUBLISHED" || job.active
                            ? "bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20" 
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20"
                        }`}
                      >
                        {job.status === "PUBLISHED" || job.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {job.status === "PUBLISHED" || job.active ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                       <button
                         onClick={() => { setSelectedJobId(job.id); setShowApplicantsModal(true); }}
                         className="flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-border bg-card hover:bg-muted transition-colors"
                       >
                         <div className="relative">
                            <Users className="w-4 h-4 text-secondary" />
                            {appCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />}
                         </div>
                         {appCount} Applicants
                       </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="p-3 bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="p-3 bg-muted text-red-500 hover:bg-red-500 hover:text-primary-foreground transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Applicants Modal */}
      {showApplicantsModal && selectedJob && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
           <div className="bg-card w-full max-w-5xl border-t-8 border-accent shadow-2xl h-[85vh] flex flex-col">
              <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
                 <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Applicants</h3>
                    <p className="text-secondary font-bold text-sm uppercase tracking-widest mt-1">
                      {selectedJob.title?.en} — {filteredApplications.length} Candidates
                    </p>
                 </div>
                 <button onClick={() => setShowApplicantsModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                {filteredApplications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-secondary opacity-50">
                    <Users className="w-16 h-16 mb-4" />
                    <p className="font-black uppercase tracking-widest">No applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredApplications.map(app => (
                      <div key={app.id} className="bg-card border border-border p-6 hover:border-accent transition-all group">
                         <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1">
                               <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-lg font-black uppercase text-foreground">{app.fullName}</h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-full border ${
                                     app.status === 'NEW' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                     app.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                     app.status === 'HIRED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                     'bg-secondary/10 text-secondary border-secondary/20'
                                  }`}>
                                     {app.status}
                                  </span>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-secondary mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold opacity-50 uppercase text-[10px] tracking-widest w-12">Email</span>
                                    {app.email}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold opacity-50 uppercase text-[10px] tracking-widest w-12">Phone</span>
                                    {app.phone}
                                  </div>
                                  <div className="flex items-center gap-2 col-span-2">
                                    <span className="font-bold opacity-50 uppercase text-[10px] tracking-widest w-12">Date</span>
                                    {new Date(app.createdAt).toLocaleDateString()}
                                  </div>
                               </div>
                               
                               {app.message && (
                                 <div className="bg-muted/50 p-4 rounded-sm text-sm italic text-secondary/80 border-l-2 border-accent mb-4">
                                    "{app.message}"
                                 </div>
                               )}
                               
                               <div className="flex gap-3">
                                  <a 
                                    href={app.cvUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-foreground hover:text-background transition-colors text-xs font-black uppercase tracking-widest border border-border"
                                  >
                                    <FileText className="w-3 h-3" /> View CV
                                  </a>
                               </div>
                            </div>
                            
                            <div className="w-full md:w-48 flex flex-col gap-2 border-l border-border pl-6">
                               <label className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Update Status</label>
                               <select 
                                 className="w-full bg-muted border border-border p-2 text-xs font-bold uppercase outline-none focus:border-accent"
                                 value={app.status || "NEW"}
                                 onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                               >
                                 <option value="NEW">New</option>
                                 <option value="REVIEWING">Reviewing</option>
                                 <option value="INTERVIEW">Interview</option>
                                 <option value="OFFER">Offer</option>
                                 <option value="HIRED">Hired</option>
                                 <option value="REJECTED">Rejected</option>
                               </select>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* Multilingual Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
          <div className="bg-card w-full max-w-3xl border-t-8 border-accent shadow-2xl overflow-y-auto max-h-[90vh] transition-colors">
            <div className="p-10">
              <h3 className="text-2xl font-black uppercase mb-8">Post New Vacancy</h3>
              
              <div className="flex mb-8 border-b border-border">
                {(["en", "fr", "ar"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === lang 
                        ? "border-b-2 border-accent text-accent" 
                        : "text-secondary hover:text-foreground"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "fr" ? "French" : "Arabic"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">
                      Job Title ({activeTab.toUpperCase()})
                    </label>
                    <input 
                      className={`w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent ${activeTab === 'ar' ? 'text-right' : 'text-left'}`}
                      value={formData.title[activeTab]}
                      onChange={(e) => setFormData({
                        ...formData, 
                        title: { ...formData.title, [activeTab]: e.target.value }
                      })}
                      placeholder={`Title in ${activeTab}`}
                      dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Department</label>
                    <input 
                      className="w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="e.g. Machining Division"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Location</label>
                    <input 
                      className="w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Workshop & Field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Job Type</label>
                    <select 
                      className="w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent"
                      value={formData.jobType}
                      onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Salary Range</label>
                    <input 
                      className="w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent"
                      value={formData.salaryRange}
                      onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                      placeholder="e.g. Competitive / Negotiable"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">
                      Description ({activeTab.toUpperCase()})
                    </label>
                    <textarea 
                      className={`w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent min-h-[120px] ${activeTab === 'ar' ? 'text-right' : 'text-left'}`}
                      value={formData.description[activeTab]}
                      onChange={(e) => setFormData({
                        ...formData, 
                        description: { ...formData.description, [activeTab]: e.target.value }
                      })}
                      placeholder={`Job description in ${activeTab}`}
                      dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">
                      Requirements ({activeTab.toUpperCase()})
                    </label>
                    <textarea 
                      className={`w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent min-h-[120px] ${activeTab === 'ar' ? 'text-right' : 'text-left'}`}
                      value={formData.requirements[activeTab]}
                      onChange={(e) => setFormData({
                        ...formData, 
                        requirements: { ...formData.requirements, [activeTab]: e.target.value }
                      })}
                      placeholder={`Key requirements in ${activeTab}`}
                      dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-grow bg-muted text-foreground py-4 font-black uppercase tracking-widest hover:bg-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-grow bg-accent text-primary-foreground py-4 font-black uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Post Vacancy"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
