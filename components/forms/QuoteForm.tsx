"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema, type QuoteFormData } from "@/lib/validations";
import { Loader2, CheckCircle, AlertCircle, Upload, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      serviceType: "Machining",
      urgency: "Medium",
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
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
        setValue("fileUrl", data.url, { shouldValidate: true });
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

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        reset();
        setUploadedFileName(null);
      } else {
        setServerError(result.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setServerError("Connection error. Please check your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-card p-12 text-center border-t-8 border-accent shadow-xl transition-colors">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-accent" />
        </div>
        <h2 className="text-3xl font-black uppercase mb-4 text-foreground">Request Received</h2>
        <p className="text-secondary text-lg mb-8 max-w-md mx-auto">
          Thank you for reaching out to MANA. Our technical team is reviewing your request 
          and will contact you within 24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-primary text-primary-foreground px-8 py-3 font-bold uppercase tracking-widest hover:bg-accent transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 md:p-12 border border-border transition-colors">
      {serverError && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 flex items-center space-x-3 text-red-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold uppercase tracking-wide">{serverError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-primary mb-2">First Name</label>
            <input
              {...register("firstName")}
              className={cn(
                "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors",
                errors.firstName ? "border-red-500" : "border-border"
              )}
              placeholder="Enter first name"
            />
            {errors.firstName && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-foreground mb-2">Last Name</label>
            <input
              {...register("lastName")}
              className={cn(
                "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors",
                errors.lastName ? "border-red-500" : "border-border"
              )}
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-foreground mb-2">Email Address</label>
            <input
              {...register("email")}
              className={cn(
                "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors",
                errors.email ? "border-red-500" : "border-border"
              )}
              placeholder="email@company.com"
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-foreground mb-2">Phone Number</label>
            <input
              {...register("phone")}
              className={cn(
                "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors",
                errors.phone ? "border-red-500" : "border-border"
              )}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-foreground mb-2">Service Type</label>
          <select
            {...register("serviceType")}
            className="w-full bg-muted border border-border p-4 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-accent"
          >
            <option value="Machining">Precision Machining</option>
            <option value="Repair">Equipment Repair</option>
            <option value="Fabrication">Custom Fabrication</option>
            <option value="Modification">Mechanical Modification</option>
            <option value="Other">Other Technical Service</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-foreground mb-2">Project Urgency</label>
          <select
            {...register("urgency")}
            className="w-full bg-muted border border-border p-4 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-accent"
          >
            <option value="Low">Low - Within a month</option>
            <option value="Medium">Medium - 1-2 weeks</option>
            <option value="High">High - Within a few days</option>
            <option value="Critical">Critical - Production Stoppage</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-foreground mb-2">Project Description</label>
        <textarea
          {...register("description")}
          rows={5}
          className={cn(
            "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors resize-none",
            errors.description ? "border-red-500" : "border-border"
          )}
          placeholder="Describe the mechanical problem or the parts you need manufactured..."
        />
        {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase mt-1">{errors.description.message}</p>}
      </div>

      <input type="hidden" {...register("fileUrl")} />

      <div className="relative">
        <input 
          type="file" 
          id="quote-upload"
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        <label 
          htmlFor="quote-upload"
          className={cn(
            "flex flex-col items-center justify-center p-6 border-2 border-dashed transition-all cursor-pointer text-center",
            uploadedFileName ? "border-accent bg-accent/5" : "border-border hover:border-accent bg-background"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-secondary animate-spin mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Uploading...</span>
            </>
          ) : uploadedFileName ? (
            <div className="flex items-center text-accent">
               <CheckCircle className="w-6 h-6 mr-3" />
               <div className="text-left">
                 <span className="block text-[10px] font-black uppercase tracking-widest text-foreground">File Attached</span>
                 <span className="text-sm font-bold">{uploadedFileName}</span>
               </div>
               <button 
                 type="button" 
                 onClick={(e) => {
                   e.preventDefault();
                   setUploadedFileName(null);
                   setValue("fileUrl", "");
                 }}
                 className="ml-4 p-2 hover:bg-red-500/10 text-red-500 rounded-full transition-colors"
               >
                 Remove
               </button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-secondary/40 group-hover:text-accent mx-auto mb-2" />
              <span className="block text-[10px] font-black uppercase tracking-widest text-secondary group-hover:text-foreground transition-colors">Attach Blueprint / Image (Optional)</span>
              <span className="text-[10px] text-secondary/40 italic mt-1 block">Supported: PDF, JPG, PNG (Max 10MB)</span>
            </>
          )}
        </label>
        {uploadError && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 text-center">{uploadError}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground py-6 font-black uppercase tracking-[0.3em] flex items-center justify-center group hover:bg-accent transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            Submit Request
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-secondary font-bold uppercase tracking-widest opacity-60">
        By submitting, you agree to our privacy policy regarding industrial data handling.
      </p>
    </form>
  );
}
