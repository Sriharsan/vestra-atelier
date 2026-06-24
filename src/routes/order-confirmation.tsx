import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";
import { formatPrice } from "@/data/garments";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [{ title: "Order Confirmed — Vestra" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: (search.orderId as string) ?? "",
    total: (search.total as string) ?? "0",
  }),
  component: OrderConfirmationPage,
});

function OrderConfirmationPage() {
  const { orderId, total } = Route.useSearch();
  const totalNum = parseFloat(total) || 0;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <div className="mx-auto max-w-[640px] px-6 pt-16 pb-24 text-center md:pt-24 md:pb-36">
          <CheckCircle className="mx-auto h-14 w-14 text-saffron-deep" />
          <Eyebrow>Order confirmed</Eyebrow>
          <h1
            className="mt-4 font-display text-ink"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Thank you for your order
          </h1>

          {orderId && (
            <div className="mt-8 rounded-sm border border-line bg-canvas-raised px-6 py-5">
              <p className="text-xs text-ink-soft">Order number</p>
              <p className="mt-1 font-display text-lg tracking-wide text-ink">{orderId}</p>
              {totalNum > 0 && (
                <p className="mt-2 text-sm text-ink-soft">Total: {formatPrice(totalNum)}</p>
              )}
            </div>
          )}

          <div className="mt-8 rounded-sm border border-line bg-canvas-raised px-6 py-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-soft">
              Sandbox demo
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              This is a demonstration checkout. No real payment was processed and no order will be
              shipped. In production, this page would show tracking details and delivery estimates.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link to="/shop" className="btn-saffron inline-flex">
              <ShoppingBag aria-hidden className="h-4 w-4" />
              Continue shopping
            </Link>
            <Link to="/" className="text-xs text-ink-soft underline hover:text-ink">
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
