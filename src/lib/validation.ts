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

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        garmentId: z.string().min(1),
        name: z.string().min(1).max(200),
        price: z.number().min(0),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(100),
  address: z.object({
    fullName: z.string().min(1).max(200),
    phone: z.string().min(10).max(15),
    line1: z.string().min(1).max(500),
    line2: z.string().max(500).default(""),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  paymentMethod: z.enum(["card", "upi"]),
  subtotal: z.number().min(0),
  currency: z.literal("INR"),
});

export type OrderData = z.infer<typeof orderSchema>;
