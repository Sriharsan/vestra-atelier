// WIRE THIS WHEN BACKEND EXISTS — call .safeParse() in every server-side request handler.
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  house: z.string().max(200).default(""),
  email: z.string().email("A valid email address is required"),
  role: z.string().max(200).optional(),
  catalogue: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const tryOnRequestSchema = z.object({
  shopperImage: z.union([z.string().min(1), z.instanceof(File)]),
  garmentIds: z.array(z.string()).min(1).max(10),
});

export type TryOnRequestData = z.infer<typeof tryOnRequestSchema>;
