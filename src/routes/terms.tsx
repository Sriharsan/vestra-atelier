import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Vestra" },
      {
        name: "description",
        content: "Terms governing the use of the Vestra virtual fitting-room service.",
      },
      { property: "og:title", content: "Terms of Service — Vestra" },
      {
        property: "og:description",
        content: "Terms governing the use of the Vestra virtual fitting-room service.",
      },
    ],
  }),
  component: TermsPage,
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

function TermsPage() {
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
            Terms of service.
          </h1>
          <p className="mt-6 text-sm text-ink-soft">Last updated: 18 June 2026</p>
        </section>

        <section className="mx-auto max-w-[780px] px-6 pb-24 md:px-10 md:pb-36">
          <div className="prose-vestra text-ink-soft md:text-lg md:leading-[1.7]">
            <p>
              These terms govern your use of the Vestra virtual fitting-room service ("Service")
              operated by Vestra Atelier Ltd. ("Vestra," "we," "our"), a company registered in
              England and Wales. By accessing or using the Service, you agree to be bound by these
              terms. If you do not agree, please do not use the Service.
            </p>

            <SectionHeading>Service description</SectionHeading>
            <p className="mt-4">
              Vestra provides a virtual fitting-room demonstration that allows users to visualise
              how selected garments may appear on them. The Service generates rendered images based
              on photographs you provide and garment data from participating fashion houses. Results
              are indicative and may not perfectly represent the fit, colour, or drape of a physical
              garment.
            </p>

            <SectionHeading>User responsibilities</SectionHeading>
            <p className="mt-4">When using the Service, you agree to the following:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                You will only upload photographs for which you have the right to use and share.
              </li>
              <li>
                You will not attempt to reverse-engineer, disassemble, or derive the source code or
                underlying algorithms of the Service.
              </li>
              <li>
                You will not use the Service for any unlawful purpose or in a manner that could
                damage, disable, or impair the Service.
              </li>
              <li>
                You will not use automated scripts, bots, or similar tools to access the Service
                without our prior written consent.
              </li>
            </ul>

            <SectionHeading>Intellectual property</SectionHeading>
            <p className="mt-4">
              All content, design, code, and technology comprising the Service are the property of
              Vestra Atelier Ltd. or its licensors and are protected by applicable
              intellectual-property laws. Garment imagery and brand assets displayed within the
              Service remain the property of their respective owners. You retain all rights to the
              photographs you upload. We do not claim ownership of your images.
            </p>

            <SectionHeading>Limitation of liability</SectionHeading>
            <p className="mt-4">
              The Service is provided on an "as is" and "as available" basis. To the fullest extent
              permitted by law, Vestra disclaims all warranties, express or implied, including
              implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement. Vestra shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising out of or related to your use of the
              Service, even if we have been advised of the possibility of such damages.
            </p>

            <SectionHeading>Modifications</SectionHeading>
            <p className="mt-4">
              We may update these terms from time to time. When we do, we will revise the "last
              updated" date at the top of this page. Continued use of the Service after changes are
              posted constitutes acceptance of the revised terms.
            </p>

            <SectionHeading>Governing law</SectionHeading>
            <p className="mt-4">
              These terms shall be governed by and construed in accordance with the laws of England
              and Wales. Any disputes arising under or in connection with these terms shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>

            <SectionHeading>Contact</SectionHeading>
            <p className="mt-4">
              Questions about these terms may be directed to{" "}
              <a href="mailto:atelier@vestra.ai" className="link-underline text-ink">
                atelier@vestra.ai
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
