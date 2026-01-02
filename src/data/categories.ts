import { EventCategory } from "@/types/retail";

export interface CategoryGroup {
  id: string;
  name: string;
  categories: {
    id: EventCategory;
    name: string;
  }[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: "format",
    name: "Формат, ассортимент, бренд",
    categories: [
      {
        id: "format_and_refits",
        name: "Формат и рефиты",
      },
      {
        id: "assortment_development",
        name: "Развитие ассортимента и гастрономов",
      },
      {
        id: "brand_and_loyalty",
        name: "Бренд и лояльность",
      },
    ],
  },
  {
    id: "online",
    name: "Онлайн, IT, логистика",
    categories: [
      {
        id: "online_and_delivery",
        name: "Онлайн и экспресс-доставка",
      },
      {
        id: "digital_technologies",
        name: "Цифровые технологии и IT",
      },
      {
        id: "warehouse_logistics",
        name: "Складская и логистическая инфраструктура",
      },
      {
        id: "expansion",
        name: "Расширение торговых площадей",
      },
      {
        id: "new_regions",
        name: "Выход в новые регионы",
      },
    ],
  },
  {
    id: "market",
    name: "Рынок, конкуренты, финансы, управление",
    categories: [
      {
        id: "competition",
        name: "Конкуренция и доля рынка",
      },
      {
        id: "consolidation",
        name: "Консолидация (M&A)",
      },
      {
        id: "debt_financing",
        name: "Долговое финансирование и облигации",
      },
      {
        id: "equity_ipo",
        name: "Акционерный капитал, IPO, листинг",
      },
      {
        id: "strategy",
        name: "Стратегия и управление",
      },
      {
        id: "macroeconomics",
        name: "Макроэкономика и кризисы",
      },
    ],
  },
];

export const getCategoryName = (categoryId: EventCategory): string => {
  for (const group of categoryGroups) {
    const category = group.categories.find((c) => c.id === categoryId);
    if (category) return category.name;
  }
  return categoryId;
};

// Плоский список всех категорий для админки
export const CATEGORIES = categoryGroups.flatMap(group => group.categories);
