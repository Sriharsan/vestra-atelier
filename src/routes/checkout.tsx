import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Shield, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";
import { ProductImage } from "@/components/ProductImage";
import { useCart, clearCart, getCartItems } from "@/lib/cartStore";
import { garments, formatPrice } from "@/data/garments";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Vestra" }],
  }),
  component: CheckoutPage,
});

type Step = "address" | "review" | "payment";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Chandigarh",
  "Puducherry",
];

interface Address {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

function CheckoutPage() {
  const cartItems = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});

  const itemsWithData = cartItems
    .map((ci) => {
      const garment = garments.find((g) => g.id === ci.garmentId);
      if (!garment) return null;
      return { ...ci, garment };
    })
    .filter(Boolean) as { garmentId: string; quantity: number; garment: (typeof garments)[0] }[];

  const subtotal = itemsWithData.reduce((s, i) => s + i.garment.price * i.quantity, 0);
  const totalItems = itemsWithData.reduce((s, i) => s + i.quantity, 0);

  if (itemsWithData.length === 0) {
    return (
      <div className="min-h-screen bg-canvas text-ink">
        <Header />
        <main id="main" className="flex flex-col items-center justify-center px-6 py-32">
          <p className="text-ink-soft">Your cart is empty.</p>
          <Link to="/shop" className="btn-saffron mt-6">
            Browse the collection
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  function validateAddress(): boolean {
    const e: Partial<Record<keyof Address, string>> = {};
    if (!address.fullName.trim()) e.fullName = "Name is required";
    if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\s/g, "")))
      e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!address.line1.trim()) e.line1 = "Address is required";
    if (!address.city.trim()) e.city = "City is required";
    if (!address.state) e.state = "Select a state";
    if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goToReview() {
    if (validateAddress()) setStep("review");
  }

  async function handlePay() {
    setProcessing(true);

    const orderPayload = {
      items: itemsWithData.map((i) => ({
        garmentId: i.garmentId,
        name: i.garment.name,
        price: i.garment.price,
        quantity: i.quantity,
      })),
      address,
      paymentMethod,
      subtotal,
      currency: "INR",
    };

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
    } catch {
      // graceful — order confirmation still shows
    }

    const orderId = `VA-${Date.now().toString(36).toUpperCase()}`;
    clearCart();
    navigate({
      to: "/order-confirmation",
      search: { orderId, total: subtotal.toString() },
    });
  }

  const stepIndex = step === "address" ? 0 : step === "review" ? 1 : 2;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <div className="mx-auto max-w-[900px] px-6 pt-12 pb-24 md:px-10 md:pt-20 md:pb-36">
          <Eyebrow>Checkout</Eyebrow>
          <h1
            className="mt-4 font-display text-ink"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {step === "address" && "Shipping address"}
            {step === "review" && "Review your order"}
            {step === "payment" && "Payment"}
          </h1>

          {/* Stepper */}
          <div className="mt-8 flex items-center gap-2">
            {["Address", "Review", "Payment"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                    i <= stepIndex ? "bg-ink text-canvas" : "border border-line text-ink-soft"
                  }`}
                >
                  {i < stepIndex ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={`text-xs ${i <= stepIndex ? "text-ink" : "text-ink-soft"}`}>
                  {label}
                </span>
                {i < 2 && <span className="mx-1 h-px w-6 bg-line" />}
              </div>
            ))}
          </div>

          {/* Address step */}
          {step === "address" && (
            <div className="mt-10 space-y-5">
              <Field
                label="Full name"
                value={address.fullName}
                error={errors.fullName}
                onChange={(v) => setAddress({ ...address, fullName: v })}
              />
              <Field
                label="Mobile number"
                value={address.phone}
                error={errors.phone}
                onChange={(v) => setAddress({ ...address, phone: v })}
                placeholder="9876543210"
                prefix="+91"
              />
              <Field
                label="Address line 1"
                value={address.line1}
                error={errors.line1}
                onChange={(v) => setAddress({ ...address, line1: v })}
                placeholder="House no., building, street"
              />
              <Field
                label="Address line 2 (optional)"
                value={address.line2}
                onChange={(v) => setAddress({ ...address, line2: v })}
                placeholder="Landmark, area"
              />
              <div className="grid gap-5 sm:grid-cols-3">
                <Field
                  label="City"
                  value={address.city}
                  error={errors.city}
                  onChange={(v) => setAddress({ ...address, city: v })}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-soft">State</label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className={`rounded-sm border px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-saffron-deep ${
                      errors.state ? "border-red-400 bg-red-50/30" : "border-line bg-canvas-raised"
                    }`}
                  >
                    <option value="">Select</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && <span className="text-[11px] text-red-500">{errors.state}</span>}
                </div>
                <Field
                  label="Pincode"
                  value={address.pincode}
                  error={errors.pincode}
                  onChange={(v) => setAddress({ ...address, pincode: v })}
                  placeholder="110001"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <Link to="/cart" className="btn-ghost text-sm">
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  Back to cart
                </Link>
                <button type="button" onClick={goToReview} className="btn-saffron">
                  Review order
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Review step */}
          {step === "review" && (
            <div className="mt-10 space-y-8">
              <div className="rounded-sm border border-line p-5">
                <h3 className="eyebrow mb-3">Shipping to</h3>
                <p className="text-sm text-ink">{address.fullName}</p>
                <p className="text-sm text-ink-soft">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                </p>
                <p className="text-sm text-ink-soft">
                  {address.city}, {address.state} — {address.pincode}
                </p>
                <p className="text-sm text-ink-soft">+91 {address.phone}</p>
                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="mt-2 text-xs text-saffron-deep underline"
                >
                  Edit address
                </button>
              </div>

              <div className="space-y-0 divide-y divide-line rounded-sm border border-line">
                {itemsWithData.map(({ garmentId, quantity, garment }) => (
                  <div key={garmentId} className="flex items-center gap-4 p-4">
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-canvas-raised">
                      <ProductImage
                        garment={garment}
                        variant="flat"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{garment.name}</p>
                      <p className="text-xs text-ink-soft">Qty: {quantity}</p>
                    </div>
                    <p className="shrink-0 text-sm text-ink">
                      {formatPrice(garment.price * quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-line pt-5">
                <div>
                  <span className="text-sm text-ink-soft">{totalItems} items</span>
                  <p className="font-display text-xl text-ink">{formatPrice(subtotal)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="btn-ghost text-sm"
                >
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  Edit address
                </button>
                <button type="button" onClick={() => setStep("payment")} className="btn-saffron">
                  Continue to payment
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Payment step */}
          {step === "payment" && (
            <div className="mt-10 space-y-8">
              <div className="rounded-sm border border-line bg-canvas-raised p-5">
                <div className="flex items-center gap-2 text-xs text-ink-soft">
                  <Shield aria-hidden className="h-4 w-4 text-saffron-deep" />
                  <span className="font-medium uppercase tracking-wide">Sandbox mode</span>— no real
                  payment will be processed
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="eyebrow">Payment method</h3>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition ${
                    paymentMethod === "card"
                      ? "border-ink bg-canvas-raised"
                      : "border-line hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="accent-saffron-deep"
                  />
                  <CreditCard aria-hidden className="h-5 w-5 text-ink-soft" />
                  <div>
                    <p className="text-sm font-medium text-ink">Credit / Debit Card</p>
                    <p className="text-xs text-ink-soft">Visa, Mastercard, RuPay</p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition ${
                    paymentMethod === "upi"
                      ? "border-ink bg-canvas-raised"
                      : "border-line hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="accent-saffron-deep"
                  />
                  <Smartphone aria-hidden className="h-5 w-5 text-ink-soft" />
                  <div>
                    <p className="text-sm font-medium text-ink">UPI</p>
                    <p className="text-xs text-ink-soft">Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4 rounded-sm border border-line p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                    Demo card form — no real data captured
                  </p>
                  <Field
                    label="Card number"
                    value="4242 4242 4242 4242"
                    onChange={() => {}}
                    disabled
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Expiry" value="12/30" onChange={() => {}} disabled />
                    <Field label="CVV" value="123" onChange={() => {}} disabled />
                  </div>
                  <p className="text-[10px] text-ink/30">
                    Pre-filled test card. No real card number is collected.
                  </p>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-4 rounded-sm border border-line p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-ink-soft">
                    Demo UPI — no real transaction
                  </p>
                  <Field label="UPI ID" value="demo@upi" onChange={() => {}} disabled />
                  <p className="text-[10px] text-ink/30">
                    Pre-filled test UPI ID. No real payment is initiated.
                  </p>
                </div>
              )}

              <div className="border-t border-line pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-soft">Total</span>
                  <span className="font-display text-xl text-ink">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep("review")}
                  className="btn-ghost text-sm"
                >
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={processing}
                  className="btn-saffron"
                >
                  {processing ? "Processing…" : `Pay ${formatPrice(subtotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  error,
  onChange,
  placeholder,
  prefix,
  disabled,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-soft">{label}</label>
      <div className="flex">
        {prefix && (
          <span className="flex items-center rounded-l-sm border border-r-0 border-line bg-canvas-raised px-2.5 text-xs text-ink-soft">
            {prefix}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full border px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-saffron-deep disabled:opacity-50 ${
            prefix ? "rounded-r-sm" : "rounded-sm"
          } ${error ? "border-red-400 bg-red-50/30" : "border-line bg-canvas-raised"}`}
        />
      </div>
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}
