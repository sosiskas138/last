/**
 * Structured Data (JSON-LD) для SEO
 * Добавляет структурированные данные в HTML для лучшей индексации поисковыми системами
 */

interface StructuredDataProps {
  companies: Array<{ id: string; name: string }>;
  eventsCount: number;
}

export function StructuredData({ companies, eventsCount }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Дорожная карта российского ритейла",
    "description": `Интерактивная карта развития крупнейших розничных сетей России. ${eventsCount} событий из истории ${companies.length} компаний. История IPO, финансовые показатели, M&A сделки с 1994 года.`,
    "url": "https://xn--e1afkmcbg4e.xn--p1ai",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "inLanguage": "ru",
    "author": {
      "@type": "Organization",
      "name": "Russian Retail Roadmap"
    },
    "about": {
      "@type": "Thing",
      "name": "Российский продуктовый ритейл",
      "description": "История развития крупнейших розничных сетей России"
    },
    "mentions": companies.slice(0, 10).map(company => ({
      "@type": "Organization",
      "name": company.name,
      "identifier": company.id
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

