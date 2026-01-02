'use client';

import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const defaultMeta = {
  title: 'Дорожная карта российского ритейла — История развития розничных сетей России',
  description: 'Интерактивная карта развития крупнейших розничных сетей России: Магнит, X5 Group (Пятёрочка, Перекрёсток), Лента, О\'КЕЙ. История IPO, финансовые показатели, M&A сделки с 1994 года.',
  keywords: 'российский ритейл, розничная торговля, Магнит, X5 Group, Пятёрочка, Перекрёсток, Лента, О\'КЕЙ, IPO, история ритейла, дорожная карта ритейла, ретеил.рф',
  ogImage: 'https://xn--e1afkmcbg4e.xn--p1ai/og-image.png',
  siteUrl: 'https://xn--e1afkmcbg4e.xn--p1ai',
};

export const SEOHead = ({
  title = defaultMeta.title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  canonicalUrl = defaultMeta.siteUrl,
  ogImage = defaultMeta.ogImage,
  ogType = 'website',
  noIndex = false,
}: SEOHeadProps) => {
  const fullTitle = title === defaultMeta.title 
    ? title 
    : `${title} | Дорожная карта российского ритейла`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};
