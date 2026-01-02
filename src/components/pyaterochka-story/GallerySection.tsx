import Image from "next/image";

const galleryImages = [
  {
    src: "/pyaterochka-assets/store-exterior.jpg",
    alt: "Фасад магазина Пятёрочка",
    title: "Современные магазины",
    description: "Узнаваемый дизайн в красно-белых тонах",
  },
  {
    src: "/pyaterochka-assets/store-interior.jpg",
    alt: "Внутри магазина Пятёрочка",
    title: "Удобная навигация",
    description: "Просторные залы и понятное расположение товаров",
  },
  {
    src: "/pyaterochka-assets/fresh-produce.jpg",
    alt: "Свежие продукты в Пятёрочке",
    title: "Свежие продукты",
    description: "Ежедневные поставки фруктов и овощей",
  },
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 md:py-32 bg-background">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Наши <span className="text-primary">магазины</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Современные торговые залы с широким ассортиментом и доступными ценами
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <Image 
                  src={image.src} 
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                  <h3 className="font-heading text-xl font-bold mb-1">
                    {image.title}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm">
                    {image.description}
                  </p>
                </div>
              </div>
              
              {/* Always visible label */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full shadow-lg">
                  {image.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

