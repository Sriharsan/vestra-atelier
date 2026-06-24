import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { brand, nav } from "@/data/content";
import { useCart } from "@/lib/cartStore";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartItems = useCart();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Link
          to="/"
          className="font-display text-2xl tracking-[0.18em] text-ink"
          aria-label={`${brand.name} — home`}
        >
          {brand.name}
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`link-underline text-sm tracking-wide transition-colors ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/cart"
            className="relative text-ink-soft transition-colors hover:text-ink"
            aria-label="Shopping cart"
          >
            <ShoppingBag aria-hidden className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-saffron-deep px-1 text-[10px] font-bold text-canvas">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <Link to="/try-on" className="btn-saffron">
            Try it on
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-canvas-raised px-6 py-6 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-ink"
            >
              Cart{cartCount > 0 && ` (${cartCount})`}
            </Link>
            <Link
              to="/try-on"
              onClick={() => setOpen(false)}
              className="btn-saffron mt-4 self-start"
            >
              Try it on
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
