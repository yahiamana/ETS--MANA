import { z } from "zod";

export const quoteSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  phone: z.string().min(5, "Valid phone number required"),
  description: z.string().min(20, "Please provide more detail about your project"),
  serviceType: z.enum(["Machining", "Repair", "Fabrication", "Modification", "Other"]),
  urgency: z.enum(["Low", "Medium", "High", "Critical"]),
  fileUrl: z.string().url().optional().or(z.literal("")),
});

export type QuoteFormData = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
