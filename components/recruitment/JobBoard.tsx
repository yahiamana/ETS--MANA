"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/lib/recruitmentValidations";
import { Briefcase, MapPin, Clock, ArrowRight, X, Loader2, CheckCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

import ApplicationForm from "./ApplicationForm";
import Link from "next/link";

// ... (imports remain matching existing file, verify previous step content)

export default function JobBoard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const locale = useLocale() as "en" | "fr" | "ar";
  const t = useTranslations("Common");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data.filter((j: any) => j.status === "PUBLISHED" || j.active) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openApply = (job: any) => {
    setSelectedJob(job);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
        <p className="font-black uppercase tracking-widest text-secondary/40 text-sm">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Job List */}
      <div className="grid grid-cols-1 gap-6">
        {jobs.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border p-20 text-center transition-colors opacity-70 hover:opacity-100">
            <Briefcase className="w-16 h-16 text-secondary/30 mx-auto mb-6" />
            <h3 className="text-xl font-black uppercase text-foreground tracking-widest mb-2">No Current Openings</h3>
            <p className="text-secondary max-w-md mx-auto">
              There are no active vacancies at the moment. Please check back later or send us a spontaneous application.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-card border border-border p-8 hover:border-accent transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Briefcase className="w-24 h-24 -rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="ltr:text-left rtl:text-right flex-1">
                  <Link href={`/${locale}/recruitment/${job.id}`} className="block w-fit">
                    <h3 className="text-2xl font-black uppercase text-foreground mb-2 group-hover:text-accent transition-colors hover:underline decoration-2 underline-offset-4 decoration-accent">
                      {job.title[locale] || job.title['en']}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-secondary/80">
                    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-sm">
                      <Briefcase className="w-3 h-3" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-sm">
                      <Clock className="w-3 h-3" />
                      <span>{job.jobType.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link 
                    href={`/${locale}/recruitment/${job.id}`}
                    className="bg-muted text-foreground border border-border px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => openApply(job)}
                    className="bg-primary text-primary-foreground border-2 border-primary px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-transparent hover:text-primary transition-all shadow-lg hover:shadow-accent/20"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
              <p className="relative z-10 mt-6 text-secondary text-sm leading-relaxed max-w-3xl ltr:text-left rtl:text-right border-l-2 border-accent/20 pl-4 line-clamp-2">
                {job.description[locale] || job.description['en']}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-card w-full max-w-2xl relative border-t-8 border-accent transition-colors my-auto shadow-2xl">
            <button 
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-foreground hover:text-accent p-2 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-black uppercase mb-2">Apply for Position</h3>
              <p className="text-secondary text-sm mb-8 font-bold">{selectedJob.title[locale] || selectedJob.title['en']} — {selectedJob.department}</p>
              
              <ApplicationForm 
                jobId={selectedJob.id} 
                jobTitle={selectedJob.title[locale] || selectedJob.title['en']}
                onSuccess={() => setTimeout(() => setSelectedJob(null), 3000)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
