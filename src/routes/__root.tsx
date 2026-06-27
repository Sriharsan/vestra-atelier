import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportBoundaryError } from "../lib/error-reporting";
import { CookieConsent } from "../components/CookieConsent";
import { FloatingCTA } from "@/components/FloatingCTA";
import { OrganizationSchema, WebSiteSchema } from "../components/StructuredData";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl text-ink" style={{ letterSpacing: "-0.02em" }}>
          Off the rack.
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          The page you're looking for isn't on the floor today.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-primary">
            Return to the atelier
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportBoundaryError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Something snagged</p>
        <h1 className="mt-4 font-display text-3xl text-ink">This page didn't load</h1>
        <p className="mt-2 text-sm text-ink-soft">A loose thread on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <Link to="/" className="btn-ghost">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vestra — See Every Look Before You Buy." },
      {
        name: "description",
        content:
          "Vestra is the virtual fitting room for fashion. Shoppers see exactly how a full outfit looks on them — before they buy, before they return.",
      },
      { name: "author", content: "Vestra" },
      { name: "theme-color", content: "#F5F0E6" },
      { property: "og:title", content: "Vestra — See Every Look Before You Buy." },
      {
        property: "og:description",
        content:
          "The virtual fitting room for luxury fashion. Couture-grade rendering, on the shopper, in their light.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@vestra" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..700,30&family=Inter+Tight:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <OrganizationSchema />
      <WebSiteSchema />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
      >
        Skip to content
      </a>
      <Outlet />
      <FloatingCTA />
      <CookieConsent />
    </QueryClientProvider>
  );
}
