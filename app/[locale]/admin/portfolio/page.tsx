"use client";

import { useState, useEffect, use } from "react";
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon, ExternalLink, Upload } from "lucide-react";

interface Project {
  id: string;
  title: any; // { en: string, fr: string, ar: string }
  description: any;
  category: string;
  imageUrl: string;
}

export default function AdminPortfolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: { en: "", fr: "", ar: "" },
    category: "Machining",
    imageUrl: "",
    description: { en: "", fr: "", ar: "" }
  });

  const [activeTab, setActiveTab] = useState<"en" | "fr" | "ar">("en");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({ 
        title: { en: "", fr: "", ar: "" }, 
        category: "Machining", 
        imageUrl: "", 
        description: { en: "", fr: "", ar: "" } 
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch("/api/admin/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-primary">Project <span className="text-secondary text-2xl font-bold">Manager</span></h1>
          <p className="text-secondary mt-2">Manage the industrial works displayed in the public portfolio.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-accent text-primary-foreground px-8 py-3 font-black uppercase tracking-widest flex items-center hover:bg-primary transition-all shadow-lg"
        >
          <Plus className="w-5 h-5 mr-3" />
          Add New Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-secondary">
          <Loader2 className="w-10 h-10 animate-spin mr-4" />
          <span className="font-bold uppercase tracking-widest">Loading Projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border p-20 text-center transition-colors">
          <ImageIcon className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
          <p className="text-secondary font-bold uppercase tracking-widest">No projects in database.</p>
        </div>
      ) : (
        <div className="bg-card border border-border overflow-hidden shadow-sm transition-colors">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Preview</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Project Details (EN/FR/AR)</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="w-16 h-16 bg-primary overflow-hidden border border-border">
                      <img src={project.imageUrl} alt="" className="w-full h-full object-cover grayscale opacity-60" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-primary uppercase line-clamp-1">{project.title?.en || "Untitled"}</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">
                       {project.title?.fr || "-"} | {project.title?.ar || "-"}
                    </div>
                    <div className="text-[10px] font-bold text-accent uppercase tracking-widest mt-1">{project.category}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-3 bg-muted text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="p-3 bg-muted text-red-500 hover:bg-red-500 hover:text-primary-foreground transition-colors"
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
      )}

      {/* Multilingual Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl border-t-8 border-accent shadow-2xl overflow-y-auto max-h-[90vh] transition-colors">
            <div className="p-10">
              <h3 className="text-2xl font-black uppercase mb-8">Add New Project</h3>
              
              <div className="flex mb-8 border-b border-border">
                {(["en", "fr", "ar"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === lang 
                        ? "border-b-2 border-accent text-accent" 
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {lang === "en" ? "English" : lang === "fr" ? "French" : "Arabic"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                      Project Title ({activeTab.toUpperCase()})
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

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">
                      Description ({activeTab.toUpperCase()})
                    </label>
                    <textarea 
                      className={`w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent min-h-[100px] ${activeTab === 'ar' ? 'text-right' : 'text-left'}`}
                      value={formData.description[activeTab]}
                      onChange={(e) => setFormData({
                        ...formData, 
                        description: { ...formData.description, [activeTab]: e.target.value }
                      })}
                      placeholder={`Description in ${activeTab}`}
                      dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Category</label>
                    <select 
                      className="w-full bg-muted border border-border p-4 text-sm font-bold uppercase tracking-wider outline-none focus:border-accent"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Machining</option>
                      <option>Repair</option>
                      <option>Fabrication</option>
                      <option>Modification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-primary mb-2">Image URL</label>
                    <div className="space-y-3">
                      <input 
                        className="w-full bg-muted border border-border p-4 text-sm font-semibold outline-none focus:border-accent"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        required
                      />
                      <div className="relative">
                         <input 
                           type="file" 
                           id="portfolio-upload" 
                           className="hidden" 
                           accept="image/*"
                           onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if (!file) return;
                             setIsUploading(true);
                             const data = new FormData();
                             data.append("file", file);
                             try {
                               const res = await fetch("/api/upload", { method: "POST", body: data });
                               const result = await res.json();
                               if (result.success) {
                                 setFormData(prev => ({ ...prev, imageUrl: result.url }));
                               } else {
                                 alert("Upload failed");
                               }
                             } catch (err) {
                               console.error(err);
                               alert("Upload error");
                             } finally {
                               setIsUploading(false);
                             }
                           }}
                           disabled={isUploading}
                         />
                         <label 
                           htmlFor="portfolio-upload"
                           className="inline-flex items-center px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
                         >
                           {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                           {isUploading ? "Uploading..." : "Upload Image"}
                         </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-grow bg-muted text-primary py-4 font-black uppercase tracking-widest hover:bg-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-grow bg-accent text-primary-foreground py-4 font-black uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Project"}
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
