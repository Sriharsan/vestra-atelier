export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vestra",
    url: "https://vestra.ai",
    logo: "https://vestra.ai/logo.svg",
    description:
      "Vestra is the virtual fitting room for fashion. Shoppers see exactly how a full outfit looks on them — before they buy, before they return.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "atelier@vestra.ai",
      contactType: "sales",
    },
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "12 rue de Sévigné",
        addressLocality: "Paris",
        postalCode: "75004",
        addressCountry: "FR",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "41 Great Eastern Street",
        addressLocality: "London",
        postalCode: "EC2A 3EY",
        addressCountry: "GB",
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vestra",
    url: "https://vestra.ai",
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function SoftwareApplicationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vestra Virtual Fitting Room",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "490",
      highPrice: "1490",
      priceCurrency: "GBP",
      offerCount: "3",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
