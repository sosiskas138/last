import { fetchApiData } from "@/lib/server-api";
import IndexClient from "@/components/IndexClient";
import { StructuredData } from "@/components/StructuredData";
import type { Metadata } from "next";

// Generate dynamic metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiData = await fetchApiData();
    const eventsCount = apiData.events.length;
    const companiesCount = apiData.companies.length;
    
    return {
      title: "Дорожная карта российского ритейла — История развития розничных сетей России",
      description: `Интерактивная карта развития крупнейших розничных сетей России: Магнит, X5 Group (Пятёрочка, Перекрёсток), Лента, О'КЕЙ. ${eventsCount} событий из истории ${companiesCount} компаний. История IPO, финансовые показатели, M&A сделки с 1994 года.`,
      keywords: "российский ритейл, розничная торговля, Магнит, X5 Group, Пятёрочка, Перекрёсток, Лента, О'КЕЙ, IPO, история ритейла, дорожная карта ритейла, ретеил.рф",
      openGraph: {
        title: "Дорожная карта российского ритейла",
        description: `Интерактивная карта развития крупнейших розничных сетей России. ${eventsCount} событий из истории ${companiesCount} компаний.`,
        type: "website",
        url: "https://xn--e1afkmcbg4e.xn--p1ai",
        siteName: "Дорожная карта российского ритейла",
      },
      twitter: {
        card: "summary_large_image",
        title: "Дорожная карта российского ритейла",
        description: `Интерактивная карта развития крупнейших розничных сетей России. ${eventsCount} событий из истории ${companiesCount} компаний.`,
      },
      alternates: {
        canonical: "https://xn--e1afkmcbg4e.xn--p1ai",
      },
    };
  } catch (error) {
    // Fallback metadata if data fetch fails
    return {
      title: "Дорожная карта российского ритейла — История развития розничных сетей России",
      description: "Интерактивная карта развития крупнейших розничных сетей России: Магнит, X5 Group (Пятёрочка, Перекрёсток), Лента, О'КЕЙ. История IPO, финансовые показатели, M&A сделки с 1994 года.",
    };
  }
}

// Server Component - fetches data on the server
export default async function HomePage() {
  try {
    // Fetch data on the server during SSR
    // This ensures data is available in the initial HTML for SEO
    const apiData = await fetchApiData();

    // Pass data to client component
    // The data will be serialized and included in the HTML
    // Next.js automatically serializes props from Server Components to Client Components
    return (
      <>
        {/* Structured Data for SEO */}
        <StructuredData 
          companies={apiData.companies} 
          eventsCount={apiData.events.length}
        />
        <IndexClient initialData={apiData} />
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    // Fallback to empty data if fetch fails
    const fallbackData = {
      companies: [],
      events: [],
      founders: [],
      ipoData: [],
      financials: [],
      isApiConfigured: false,
    };
    return (
      <>
        <StructuredData companies={[]} eventsCount={0} />
        <IndexClient initialData={fallbackData} />
      </>
    );
  }
}
