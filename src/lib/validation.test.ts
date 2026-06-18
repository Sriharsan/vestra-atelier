import { describe, it, expect } from "vitest";
import { contactFormSchema, tryOnRequestSchema } from "./validation";

describe("contactFormSchema", () => {
  it("accepts a valid payload", () => {
    const result = contactFormSchema.safeParse({
      name: "Hélène Marceau",
      email: "helene@maison-aurelle.com",
      house: "Maison Aurelle",
      role: "Head of Ecommerce",
      message: "Interested in the Atelier tier.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal payload (name + email only)", () => {
    const result = contactFormSchema.safeParse({
      name: "Test",
      email: "test@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = contactFormSchema.safeParse({
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactFormSchema.safeParse({
      name: "Test",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding max length", () => {
    const result = contactFormSchema.safeParse({
      name: "x".repeat(201),
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message exceeding max length", () => {
    const result = contactFormSchema.safeParse({
      name: "Test",
      email: "test@example.com",
      message: "x".repeat(5001),
    });
    expect(result.success).toBe(false);
  });
});

describe("tryOnRequestSchema", () => {
  it("accepts valid string image with garment IDs", () => {
    const result = tryOnRequestSchema.safeParse({
      shopperImage: "data:image/jpeg;base64,abc123",
      garmentIds: ["gmt-001", "gmt-002"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty garment IDs array", () => {
    const result = tryOnRequestSchema.safeParse({
      shopperImage: "data:image/jpeg;base64,abc123",
      garmentIds: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 garment IDs", () => {
    const result = tryOnRequestSchema.safeParse({
      shopperImage: "data:image/jpeg;base64,abc123",
      garmentIds: Array.from({ length: 11 }, (_, i) => `gmt-${i}`),
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing shopper image", () => {
    const result = tryOnRequestSchema.safeParse({
      garmentIds: ["gmt-001"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty string as shopper image", () => {
    const result = tryOnRequestSchema.safeParse({
      shopperImage: "",
      garmentIds: ["gmt-001"],
    });
    expect(result.success).toBe(false);
  });
});
