import Header from "@/components/pyaterochka-story/Header";
import HeroSection from "@/components/pyaterochka-story/HeroSection";
import HistorySection from "@/components/pyaterochka-story/HistorySection";
import GallerySection from "@/components/pyaterochka-story/GallerySection";
import FactsSection from "@/components/pyaterochka-story/FactsSection";
import Footer from "@/components/pyaterochka-story/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пятёрочка — Крупнейшая сеть магазинов России",
  description: "Более 20 лет мы делаем качественные продукты доступными для миллионов российских семей. Более 20 000 магазинов в 66 регионах России.",
  keywords: "Пятёрочка, X5 Group, ритейл, магазины, продукты, история Пятёрочки",
};

export default function X5StoryPage() {
  return (
    <div className="min-h-screen bg-background" style={{
      // Переопределяем primary цвет для страницы Пятёрочки (красный)
      '--primary': '0 79% 50%',
      '--primary-foreground': '0 0% 100%',
      '--gradient-hero': 'linear-gradient(135deg, hsl(0 79% 50%) 0%, hsl(0 79% 40%) 100%)',
    } as React.CSSProperties}>
      <Header />
      <main>
        <HeroSection />
        <HistorySection />
        <GallerySection />
        <FactsSection />
      </main>
      <Footer />
    </div>
  );
}

