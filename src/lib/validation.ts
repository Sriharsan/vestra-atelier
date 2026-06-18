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
  shopperImage: z.string().min(1, "Shopper image is required"),
  garmentImage: z.string().min(1, "Garment image is required"),
  garmentIds: z.array(z.string()).min(1).max(10).optional(),
  category: z.enum(["tops", "bottoms", "one-pieces", "auto"]).optional(),
});

export type TryOnRequestData = z.infer<typeof tryOnRequestSchema>;
