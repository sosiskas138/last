import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="flex items-center gap-3">
            <Image 
              src="/pyaterochka-assets/pyaterochka-logo.png" 
              alt="Пятёрочка" 
              width={120}
              height={48}
              className="h-10 md:h-12 w-auto"
            />
          </a>
          
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#history" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              История
            </a>
            <a 
              href="#gallery" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Галерея
            </a>
            <a 
              href="#facts" 
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Факты
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

