const timelineData = [
  {
    year: "1999",
    title: "Основание компании",
    description: "В Санкт-Петербурге открылся первый магазин «Пятёрочка». Концепция — доступные цены на качественные продукты для каждой семьи.",
  },
  {
    year: "2001",
    title: "Начало франчайзинга",
    description: "Запуск программы франчайзинга, что позволило быстро расширить сеть по всей России.",
  },
  {
    year: "2006",
    title: "Слияние с «Перекрёстком»",
    description: "Объединение с сетью «Перекрёсток» и создание X5 Retail Group — крупнейшего продовольственного ритейлера страны.",
  },
  {
    year: "2013",
    title: "10 000 магазинов",
    description: "Пятёрочка достигла отметки в 10 000 магазинов, став самой большой сетью магазинов у дома в России.",
  },
  {
    year: "2017",
    title: "Масштабный ребрендинг",
    description: "Обновление концепции: новый дизайн магазинов, улучшенная навигация и расширенный ассортимент свежих продуктов.",
  },
  {
    year: "2020",
    title: "Цифровая трансформация",
    description: "Запуск мобильного приложения и программы лояльности «Х5 Клуб» с персональными скидками.",
  },
  {
    year: "2024",
    title: "20 000+ магазинов",
    description: "Сегодня Пятёрочка — это более 20 000 магазинов в 66 регионах России и более 300 000 сотрудников.",
  },
];

const HistorySection = () => {
  return (
    <section id="history" className="py-20 md:py-32 bg-muted/50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            История <span className="text-primary">развития</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Путь от одного магазина до крупнейшей розничной сети России
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-primary/20" />
          
          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {timelineData.map((item, index) => (
              <div 
                key={item.year}
                className={`relative flex items-start gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10" />
                
                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <div 
                    className="bg-card rounded-2xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-shadow"
                  >
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary font-heading font-bold rounded-full text-sm mb-3">
                      {item.year}
                    </span>
                    <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;

