import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-12 md:py-16">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start">
            <Image 
              src="/pyaterochka-assets/pyaterochka-logo.png" 
              alt="Пятёрочка" 
              width={120}
              height={48}
              className="h-12 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-primary-foreground/70 text-center md:text-left max-w-sm">
              Крупнейшая сеть магазинов «у дома» в России. 
              Качественные продукты по доступным ценам.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-6">
              <a href="#history" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                История
              </a>
              <a href="#gallery" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Галерея
              </a>
              <a href="#facts" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Факты
              </a>
            </div>
            
            <p className="text-primary-foreground/50 text-sm">
              © 2024 Пятёрочка. Информационный сайт.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

