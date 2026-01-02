import { Company } from "@/types/retail";

export const companies: Company[] = [
  {
    id: "tander",
    name: 'АО "Тандер"',
    color: "#E31E24",
    status: "active",
  },
  {
    id: "magnit",
    name: "Магнит",
    parentCompany: "tander",
    color: "#E31E24",
    status: "active",
  },
  {
    id: "x5",
    name: "X5 Group",
    color: "#00A650",
    status: "active",
  },
  {
    id: "pyaterochka",
    name: "Пятёрочка",
    parentCompany: "x5",
    color: "#00A650",
    status: "active",
  },
  {
    id: "perekrestok",
    name: "Перекрёсток",
    parentCompany: "x5",
    color: "#00A650",
    status: "active",
  },
  {
    id: "lenta",
    name: "Лента",
    color: "#FFB81C",
    status: "active",
  },
  {
    id: "okey",
    name: "О'КЕЙ",
    color: "#E85B00",
    status: "active",
  },
  {
    id: "magnolia",
    name: "Магнолия",
    color: "#9C27B0",
    status: "active",
  },
  {
    id: "kopeyka",
    name: "Копейка",
    parentCompany: "x5",
    color: "#2196F3",
    status: "inactive",
  },
  {
    id: "dixy",
    name: "ДИКСИ",
    parentCompany: "magnit",
    color: "#FF6B00",
    status: "acquired",
    acquiredBy: "magnit",
    acquiredYear: 2021,
  },
];

export const getCompanyById = (id: string): Company | undefined => {
  return companies.find((c) => c.id === id);
};

export const getCompanyColor = (id: string): string => {
  const company = getCompanyById(id);
  return company?.color || "#666";
};
