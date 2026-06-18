export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vestra",
    url: "https://vestra.in",
    logo: "https://vestra.in/logo.svg",
    description:
      "Vestra is the virtual fitting room for fashion. Shoppers see exactly how a full outfit looks on them — before they buy, before they return.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "atelier@vestra.in",
      telephone: "+91-80-4567-8900",
      contactType: "sales",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "91 MG Road",
      addressLocality: "Bengaluru",
      postalCode: "560001",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
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
    url: "https://vestra.in",
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
      lowPrice: "39900",
      highPrice: "119900",
      priceCurrency: "INR",
      offerCount: "3",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
