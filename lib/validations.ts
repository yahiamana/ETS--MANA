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
