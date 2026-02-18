"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // In a real app, this would hit an API route
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSuccess(true);
    reset();
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="bg-card p-12 text-center border border-border transition-colors">
        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
        <h3 className="text-2xl font-black uppercase mb-4">Message Sent</h3>
        <p className="text-secondary mb-8">
          Thank you for contacting MANA. We will get back to you shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-primary text-primary-foreground px-8 py-3 font-bold uppercase tracking-widest"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 md:p-12 border border-border shadow-sm transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Your Name</label>
          <input
            {...register("name")}
            className={cn(
              "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors",
              errors.name ? "border-red-500" : "border-border"
            )}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Email Address</label>
          <input
            {...register("email")}
            className={cn(
              "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors",
              errors.email ? "border-red-500" : "border-border"
            )}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Subject</label>
        <input
          {...register("subject")}
          className={cn(
            "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors",
            errors.subject ? "border-red-500" : "border-border"
          )}
          placeholder="Technical Inquiry / Service Question"
        />
        {errors.subject && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-foreground mb-2">Message</label>
        <textarea
          {...register("message")}
          rows={6}
          className={cn(
            "w-full bg-muted border p-4 text-sm font-semibold focus:outline-none focus:border-accent transition-colors resize-none",
            errors.message ? "border-red-500" : "border-border"
          )}
          placeholder="How can we help you today?"
        />
        {errors.message && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground py-5 font-black uppercase tracking-widest flex items-center justify-center hover:bg-accent transition-all disabled:opacity-50 group"
      >
        {isSubmitting ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            Send Message
            <Send className="ml-3 w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
