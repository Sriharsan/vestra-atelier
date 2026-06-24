import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";
import { ProductImage } from "@/components/ProductImage";
import { useCart, removeFromCart, updateQuantity, clearCart } from "@/lib/cartStore";
import { garments, formatPrice } from "@/data/garments";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart — Vestra" }],
  }),
  component: CartPage,
});

function CartPage() {
  const cartItems = useCart();

  const itemsWithData = cartItems
    .map((ci) => {
      const garment = garments.find((g) => g.id === ci.garmentId);
      if (!garment) return null;
      return { ...ci, garment };
    })
    .filter(Boolean) as { garmentId: string; quantity: number; garment: (typeof garments)[0] }[];

  const subtotal = itemsWithData.reduce((s, i) => s + i.garment.price * i.quantity, 0);
  const isEmpty = itemsWithData.length === 0;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <div className="mx-auto max-w-[1000px] px-6 pt-12 pb-24 md:px-10 md:pt-20 md:pb-36">
          <Eyebrow>Your Cart</Eyebrow>
          <h1
            className="mt-4 font-display text-ink"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {isEmpty
              ? "Nothing here yet"
              : `${itemsWithData.length} ${itemsWithData.length === 1 ? "piece" : "pieces"}`}
          </h1>

          {isEmpty ? (
            <div className="mt-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-ink/15" />
              <p className="mt-4 text-ink-soft">Your cart is empty.</p>
              <Link to="/shop" className="btn-saffron mt-6 inline-flex">
                Browse the collection
              </Link>
            </div>
          ) : (
            <div className="mt-10 space-y-0 divide-y divide-line">
              {itemsWithData.map(({ garmentId, quantity, garment }) => (
                <CartRow
                  key={garmentId}
                  garment={garment}
                  quantity={quantity}
                  onUpdate={(q) => updateQuantity(garmentId, q)}
                  onRemove={() => removeFromCart(garmentId)}
                />
              ))}

              <div className="pt-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => clearCart()}
                    className="text-xs text-ink-soft underline hover:text-ink"
                  >
                    Clear cart
                  </button>
                  <div className="text-right">
                    <span className="text-sm text-ink-soft">Subtotal</span>
                    <p className="font-display text-2xl text-ink">{formatPrice(subtotal)}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-end gap-3">
                  <Link to="/checkout" className="btn-saffron inline-flex">
                    Proceed to checkout
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                  <Link to="/shop" className="text-xs text-ink-soft underline hover:text-ink">
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CartRow({
  garment,
  quantity,
  onUpdate,
  onRemove,
}: {
  garment: (typeof garments)[0];
  quantity: number;
  onUpdate: (q: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 py-5">
      <div className="h-24 w-18 shrink-0 overflow-hidden rounded-sm bg-canvas-raised">
        <ProductImage garment={garment} variant="flat" className="h-full w-full object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="text-[11px] text-ink-soft">{garment.brand}</p>
          <h3 className="truncate text-sm font-medium text-ink">{garment.name}</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1 rounded-full border border-line">
            <button
              type="button"
              onClick={() => onUpdate(quantity - 1)}
              className="px-2 py-1 text-ink-soft hover:text-ink"
              aria-label="Decrease quantity"
            >
              <Minus aria-hidden className="h-3 w-3" />
            </button>
            <span className="min-w-[1.5rem] text-center text-xs">{quantity}</span>
            <button
              type="button"
              onClick={() => onUpdate(quantity + 1)}
              className="px-2 py-1 text-ink-soft hover:text-ink"
              aria-label="Increase quantity"
            >
              <Plus aria-hidden className="h-3 w-3" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-ink-soft hover:text-ink"
            aria-label={`Remove ${garment.name}`}
          >
            <Trash2 aria-hidden className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="shrink-0 font-display text-sm text-ink">
        {formatPrice(garment.price * quantity)}
      </p>
    </div>
  );
}
