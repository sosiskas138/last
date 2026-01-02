import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image 
          src="/pyaterochka-assets/store-exterior.jpg" 
          alt="Магазин Пятёрочка" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 section-container text-center pt-20">
        <div className="max-w-4xl mx-auto">
          <Image 
            src="/pyaterochka-assets/pyaterochka-logo.png" 
            alt="Пятёрочка" 
            width={160}
            height={160}
            className="h-24 md:h-32 lg:h-40 w-auto mx-auto mb-8 animate-scale-in drop-shadow-lg"
            priority
          />
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Крупнейшая сеть магазинов{" "}
            <span className="text-primary">России</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Более 20 лет мы делаем качественные продукты доступными 
            для миллионов российских семей
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <a 
              href="#history" 
              className="inline-flex items-center px-8 py-4 bg-gradient-hero text-primary-foreground font-semibold rounded-full shadow-elevated hover:shadow-lg transition-all hover:scale-105"
            >
              Узнать историю
            </a>
            <a 
              href="#facts" 
              className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-full shadow-card hover:shadow-lg transition-all hover:scale-105"
            >
              Интересные факты
            </a>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 md:mt-24 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-card">
            <div className="text-3xl md:text-4xl font-heading font-bold text-primary">20 000+</div>
            <div className="text-muted-foreground mt-1">магазинов</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-card">
            <div className="text-3xl md:text-4xl font-heading font-bold text-primary">66</div>
            <div className="text-muted-foreground mt-1">регионов</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-card">
            <div className="text-3xl md:text-4xl font-heading font-bold text-primary">300 000+</div>
            <div className="text-muted-foreground mt-1">сотрудников</div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-card">
            <div className="text-3xl md:text-4xl font-heading font-bold text-primary">1999</div>
            <div className="text-muted-foreground mt-1">год основания</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

