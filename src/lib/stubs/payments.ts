// BACKEND STUB — conditional scope. Not implemented for the current marketing site.
// When a transactional flow is approved, wire to Stripe or Razorpay hosted checkout.

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
}

export async function createPaymentIntent(_amountPence: number): Promise<PaymentIntent> {
  throw new Error(
    "Payment processing is not implemented. This is a marketing site and virtual fitting room demo.",
  );
}
