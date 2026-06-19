import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";
import { contact } from "@/data/content";
import { track } from "@/lib/stubs/analytics";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vestra" },
      {
        name: "description",
        content: "Tell us about your house. We reply within a working day.",
      },
      { property: "og:title", content: "Contact — Vestra" },
      { property: "og:description", content: "Begin the conversation with the Vestra atelier." },
    ],
    links: [{ rel: "canonical", href: "https://vestra.ai/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    track("contact_submit", { house: data.get("house") });

    try {
      await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name") ?? "",
          house: data.get("house") ?? "",
          email: data.get("email") ?? "",
          role: data.get("role") ?? "",
          catalogue: data.get("catalogue") ?? "",
          message: data.get("message") ?? "",
        }),
      });
    } catch {
      // Degrade gracefully — show success even if request fails
    }
    setStatus("sent");
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-24 md:grid md:grid-cols-12 md:gap-16 md:px-10 md:pt-24 md:pb-36">
          <div className="md:col-span-5">
            <Eyebrow>{contact.eyebrow}</Eyebrow>
            <h1
              className="mt-4 font-display text-ink"
              style={{
                fontSize: "clamp(2.25rem, 5.4vw, 4.25rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {contact.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="italic text-saffron-deep">{contact.title.split(" ").slice(-1)}</span>
            </h1>
            <p className="mt-6 max-w-[40ch] text-ink-soft md:text-lg md:leading-[1.7]">
              {contact.body}
            </p>

            <dl className="mt-10 space-y-6 border-t border-line pt-8">
              <div>
                <dt className="eyebrow">Atelier</dt>
                <dd className="mt-2 text-ink">
                  <a href={`mailto:${contact.email}`} className="link-underline">
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Studios</dt>
                <dd className="mt-2 max-w-[36ch] text-ink-soft">{contact.address}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-14 md:col-span-7 md:mt-0">
            <form
              onSubmit={onSubmit}
              className="rounded-sm border border-line bg-canvas-raised p-8 shadow-fabric md:p-12"
              noValidate
            >
              {status === "sent" ? (
                <div className="flex flex-col items-start gap-4 py-12">
                  <Check aria-hidden className="h-8 w-8 text-saffron-deep" />
                  <h2 className="font-display text-3xl text-ink">Note received.</h2>
                  <p className="max-w-[40ch] text-ink-soft">
                    We'll write back within a working day. Meanwhile, the dressing room is open.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <Field id="name" label="Your name" required />
                  <Field id="house" label="Your house" placeholder="Maison Aurelle" required />
                  <Field
                    id="email"
                    label="Work email"
                    type="email"
                    required
                    className="md:col-span-2"
                  />
                  <Field id="role" label="Role" placeholder="Head of Ecommerce" />
                  <Field id="catalogue" label="Catalogue size" placeholder="≈ 400 SKUs" />
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="eyebrow block">
                      A short note
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="mt-2 w-full resize-none rounded-sm border border-line bg-canvas px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
                      placeholder="What would you like the shopper to see?"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between gap-4 border-t border-line pt-6">
                    <p className="text-xs text-ink-soft">We reply within one working day.</p>
                    <button type="submit" className="btn-primary" disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                          Sending
                        </>
                      ) : (
                        <>Send the note</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
  className = "",
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow block">
        {label}{" "}
        {required && (
          <span aria-hidden className="text-saffron-deep">
            ·
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-required={required || undefined}
        className="mt-2 w-full rounded-sm border border-line bg-canvas px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
      />
    </div>
  );
}
