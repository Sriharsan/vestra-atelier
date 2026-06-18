import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Vestra" },
      {
        name: "description",
        content:
          "How Vestra handles your data, photographs, and privacy rights under GDPR and the India DPDP Act.",
      },
      { property: "og:title", content: "Privacy Policy — Vestra" },
      {
        property: "og:description",
        content: "Your data, your fitting room, your rights.",
      },
    ],
  }),
  component: PrivacyPage,
});

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-14 font-display text-ink"
      style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
    >
      {children}
    </h2>
  );
}

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 md:px-10 md:pt-24 md:pb-16">
          <Eyebrow>Legal</Eyebrow>
          <h1
            className="mt-4 max-w-[18ch] font-display text-ink"
            style={{
              fontSize: "clamp(2.5rem, 6.4vw, 5.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
            }}
          >
            Privacy policy.
          </h1>
          <p className="mt-6 text-sm text-ink-soft">Last updated: 18 June 2026</p>
        </section>

        <section className="mx-auto max-w-[780px] px-6 pb-24 md:px-10 md:pb-36">
          <div className="prose-vestra text-ink-soft md:text-lg md:leading-[1.7]">
            <p>
              Vestra Atelier Ltd. ("Vestra," "we," "our") builds virtual fitting-room technology for
              fashion. This policy explains what data we collect, why we collect it, and how you can
              exercise your rights over it. We believe privacy is a prerequisite to trust, not a
              feature to advertise.
            </p>

            <SectionHeading>What we collect</SectionHeading>
            <p className="mt-4">We collect three categories of information:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-ink">Shopper photographs.</strong> When you use the virtual
                try-on feature, you provide a photograph of yourself. This image is processed in
                real time to generate the fitting-room result.
              </li>
              <li>
                <strong className="text-ink">Contact-form data.</strong> If you reach out through
                our contact form, we collect your name, email address, company or house name, role,
                and any message you choose to include.
              </li>
              <li>
                <strong className="text-ink">Usage analytics.</strong> We use anonymised,
                cookie-based analytics to understand how visitors navigate the site. These analytics
                do not identify you personally.
              </li>
            </ul>

            <SectionHeading>How we process photographs</SectionHeading>
            <p className="mt-4">
              Your photograph is processed exclusively within your active session to render the
              virtual fitting result. We do not store photographs beyond the duration of the
              session. We do not use your photographs to train, fine-tune, or improve any
              machine-learning model. Once you close the fitting-room session or navigate away, the
              image data is discarded. If our infrastructure caches the image transiently for
              rendering purposes, that cache is cleared within 60 minutes at most.
            </p>

            <SectionHeading>Your rights under the GDPR</SectionHeading>
            <p className="mt-4">
              If you are located in the European Economic Area or the United Kingdom, you have the
              following rights under the General Data Protection Regulation:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-ink">Access.</strong> You may request a copy of the personal
                data we hold about you.
              </li>
              <li>
                <strong className="text-ink">Rectification.</strong> You may ask us to correct
                inaccurate or incomplete data.
              </li>
              <li>
                <strong className="text-ink">Erasure.</strong> You may request deletion of your
                personal data where there is no compelling reason for us to continue processing it.
              </li>
              <li>
                <strong className="text-ink">Portability.</strong> You may request that we transfer
                your data to another service provider in a structured, commonly used format.
              </li>
              <li>
                <strong className="text-ink">Objection.</strong> You may object to the processing of
                your personal data at any time.
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@vestra.ai" className="link-underline text-ink">
                privacy@vestra.ai
              </a>
              . We will respond within 30 days.
            </p>

            <SectionHeading>India DPDP Act compliance</SectionHeading>
            <p className="mt-4">
              For users located in India, we comply with the Digital Personal Data Protection Act,
              2023. We process your personal data only for the purposes stated in this policy, with
              your consent or as otherwise permitted by law. You have the right to access, correct,
              and request erasure of your personal data. You may also nominate another individual to
              exercise these rights on your behalf. Grievances may be directed to{" "}
              <a href="mailto:privacy@vestra.ai" className="link-underline text-ink">
                privacy@vestra.ai
              </a>
              .
            </p>

            <SectionHeading>Cookies</SectionHeading>
            <p className="mt-4">
              We use essential cookies that are strictly necessary for the site to function. With
              your consent, we also use analytics cookies to measure how visitors interact with the
              site. You can manage your cookie preferences at any time. We do not use cookies for
              advertising, remarketing, or cross-site tracking.
            </p>

            <SectionHeading>Data retention</SectionHeading>
            <p className="mt-4">
              Shopper photographs are retained only for the duration of the active session, never
              longer than 60 minutes. Contact-form submissions are retained for up to 24 months to
              facilitate ongoing business conversations. Analytics data is retained in anonymised,
              aggregated form for up to 36 months.
            </p>

            <SectionHeading>Contact</SectionHeading>
            <p className="mt-4">
              For any privacy-related questions, requests, or concerns, please write to{" "}
              <a href="mailto:privacy@vestra.ai" className="link-underline text-ink">
                privacy@vestra.ai
              </a>
              . We take every enquiry seriously and aim to respond within a reasonable timeframe.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
