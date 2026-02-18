"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applicationSchema, type ApplicationFormData } from "@/lib/recruitmentValidations";
import { Loader2, Upload, CheckCircle, FileText, X } from "lucide-react";
import { useLocale } from "next-intl";

interface ApplicationFormProps {
  jobId: string;
  jobTitle: any; // Relaxed type to handle localized object or string
  onSuccess?: () => void;
}

export default function ApplicationForm({ jobId, jobTitle, onSuccess }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId: jobId
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setValue("cvUrl", data.url, { shouldValidate: true });
        setUploadedFileName(file.name);
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setUploadError("Network error during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error("Invalid server response");
      }

      if (result.success) {
        setIsSuccess(true);
        reset();
        if (onSuccess) onSuccess();
      } else {
        setSubmitError(result.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 bg-card border border-border">
        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
        <h3 className="text-2xl font-black uppercase mb-4">Application Sent</h3>
        <p className="text-secondary mb-8 max-w-md mx-auto">
          Your application for the <strong>
            {typeof jobTitle === 'string' ? jobTitle : (jobTitle as any)?.[locale] || (jobTitle as any)?.['en'] || 'Position'}
          </strong> position has 
          been received. We will contact you after reviewing your profile.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="bg-primary text-primary-foreground px-10 py-3 font-bold uppercase hover:bg-accent transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-8 border-l-4 border-l-accent shadow-sm">
      <h3 className="text-2xl font-black uppercase mb-6">Apply Now</h3>
      
      {/* Explicitly register hidden fields */}
      <input type="hidden" {...register("cvUrl")} />
      <input type="hidden" {...register("jobId")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Full Name</label>
          <input {...register("fullName")} className="w-full bg-muted border border-border p-4 text-sm font-semibold focus:border-accent outline-none transition-colors" placeholder="John Doe" />
          {errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Email Address</label>
          <input {...register("email")} className="w-full bg-muted border border-border p-4 text-sm font-semibold focus:border-accent outline-none transition-colors" placeholder="john@example.com" />
          {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Phone Number</label>
        <input {...register("phone")} className="w-full bg-muted border border-border p-4 text-sm font-semibold focus:border-accent outline-none transition-colors" placeholder="+1 (555) 000-0000" />
        {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Message / Cover Letter</label>
        <textarea {...register("message")} className="w-full bg-muted border border-border p-4 text-sm font-semibold focus:border-accent outline-none min-h-[120px] transition-colors" placeholder="Tell us why you are a good fit..." />
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">CV / Resume (PDF Only)</label>
        <div className="relative">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={isUploading || !!uploadedFileName}
            className="hidden" 
            id="cv-upload"
          />
          <label 
            htmlFor="cv-upload" 
            className={`flex items-center justify-center w-full p-8 border-2 border-dashed transition-all cursor-pointer ${
              uploadedFileName 
                ? "border-accent bg-accent/5" 
                : "border-border bg-muted hover:border-foreground/50"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center text-secondary">
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                <span className="font-bold uppercase tracking-widest text-xs">Uploading...</span>
              </div>
            ) : uploadedFileName ? (
              <div className="flex items-center text-accent">
                <FileText className="w-6 h-6 mr-3" />
                <span className="font-bold uppercase tracking-widest text-xs">{uploadedFileName}</span>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setUploadedFileName(null);
                    setValue("cvUrl", "");
                  }}
                  className="ml-4 p-1 hover:bg-accent/20 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-secondary/60">
                <Upload className="w-8 h-8 mb-2" />
                <span className="font-bold uppercase tracking-widest text-xs">Click to Upload CV</span>
                <span className="text-[10px] mt-1">PDF, DOCX (Max 5MB)</span>
              </div>
            )}
          </label>
        </div>
        {uploadError && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase">{uploadError}</p>}
        {errors.cvUrl && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.cvUrl.message}</p>}
      </div>

      {submitError && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-sm font-bold uppercase text-center">
            {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="w-full bg-primary text-primary-foreground py-5 font-black uppercase tracking-widest flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-50 shadow-lg"
      >
        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Application"}
      </button>
    </form>
  );
}
