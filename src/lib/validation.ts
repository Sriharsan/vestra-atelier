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
  garmentImage: z.string().optional(),
  instruction: z.string().max(500).optional(),
  garmentIds: z.array(z.string()).min(1).max(10).optional(),
  category: z.enum(["tops", "bottoms", "one-pieces", "auto"]).optional(),
  mode: z.enum(["tryon", "edit"]).default("tryon"),
});

export type TryOnRequestData = z.infer<typeof tryOnRequestSchema>;

export const demoRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  house: z.string().max(200).optional(),
  email: z.string().email("A valid email address is required"),
  role: z.string().max(200).optional(),
  catalogue: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
});

export type DemoRequestData = z.infer<typeof demoRequestSchema>;

export const subscribeSchema = z.object({
  email: z.string().email("A valid email address is required"),
});

export type SubscribeData = z.infer<typeof subscribeSchema>;
