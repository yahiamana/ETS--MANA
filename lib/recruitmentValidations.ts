import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Valid phone number required"),
  jobId: z.string().min(1, "Please select a position"),
  cvUrl: z.string().min(1, "CV upload is required"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
