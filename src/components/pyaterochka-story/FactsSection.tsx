import { ShoppingCart, Users, MapPin, Clock, Leaf, Heart } from "lucide-react";

const facts = [
  {
    icon: ShoppingCart,
    title: "11 млн покупателей",
    description: "Ежедневно Пятёрочку посещают более 11 миллионов покупателей по всей России",
  },
  {
    icon: MapPin,
    title: "66 регионов",
    description: "Магазины сети расположены в 66 регионах Российской Федерации",
  },
  {
    icon: Users,
    title: "300 000 сотрудников",
    description: "Пятёрочка — один из крупнейших работодателей в стране",
  },
  {
    icon: Clock,
    title: "Магазин у дома",
    description: "Средняя площадь магазина — 350–500 м², что делает покупки быстрыми и удобными",
  },
  {
    icon: Leaf,
    title: "Собственные марки",
    description: "Более 2000 товаров под собственными торговыми марками по доступным ценам",
  },
  {
    icon: Heart,
    title: "Социальная ответственность",
    description: "Программы помощи нуждающимся и сотрудничество с благотворительными фондами",
  },
];

const FactsSection = () => {
  return (
    <section id="facts" className="py-20 md:py-32 bg-muted/50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Интересные <span className="text-primary">факты</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Цифры и достижения, которые делают Пятёрочку особенной
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {facts.map((fact, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <fact.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {fact.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {fact.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FactsSection;

