import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Дорожная карта российского ритейла — История развития розничных сетей России",
  description: "Интерактивная карта развития крупнейших розничных сетей России: Магнит, X5 Group (Пятёрочка, Перекрёсток), Лента, О'КЕЙ. История IPO, финансовые показатели, M&A сделки с 1994 года.",
  keywords: "российский ритейл, розничная торговля, Магнит, X5 Group, Пятёрочка, Перекрёсток, Лента, О'КЕЙ, IPO, история ритейла, дорожная карта ритейла, ретеил.рф",
  openGraph: {
    title: "Дорожная карта российского ритейла",
    description: "Интерактивная карта развития крупнейших розничных сетей России",
    type: "website",
    url: "https://xn--e1afkmcbg4e.xn--p1ai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


