import { FinancialData } from "@/types/retail";

export const okeyFinancials: FinancialData[] = [
  // 2001 - год основания, магазинов нет
  {
    companyId: "okey",
    year: 2001,
    revenue: 0, // нет открытых магазинов
    profit: undefined,
    margin: undefined,
    storeCount: 0,
  },
  // 2002 - первый гипермаркет
  {
    companyId: "okey",
    year: 2002,
    revenue: 1.2, // ~1,1–1,3 млрд ₽ (оценка)
    profit: undefined,
    margin: undefined,
    storeCount: 1,
  },
  // 2003 - расширение в Петербурге
  {
    companyId: "okey",
    year: 2003,
    revenue: 3.6, // ~3,5–3,7 млрд ₽ (оценка)
    profit: undefined,
    margin: undefined,
    storeCount: 4,
  },
  // 2004 - ускоренное расширение
  {
    companyId: "okey",
    year: 2004,
    revenue: 6.6, // ~6,5–6,7 млрд ₽ (оценка)
    profit: undefined,
    margin: undefined,
    storeCount: 7,
  },
  // 2005 - пик локального роста в Петербурге
  {
    companyId: "okey",
    year: 2005,
    revenue: 9.3, // ~9–9,5 млрд ₽ (оценка)
    profit: undefined,
    margin: undefined,
    storeCount: 10,
  },
  // 2006 - начало региональной экспансии
  {
    companyId: "okey",
    year: 2006,
    revenue: 16.5, // ~$614 млн ≈ 16–17 млрд ₽
    profit: undefined,
    margin: undefined,
    storeCount: 11,
  },
  // 2007 - региональная экспансия
  {
    companyId: "okey",
    year: 2007,
    revenue: 29.0, // ~28–30 млрд ₽ (оценка)
    profit: undefined,
    margin: undefined,
    storeCount: 15,
  },
  // 2008 - «большой скачок»
  {
    companyId: "okey",
    year: 2008,
    revenue: 40.0, // ~40 млрд ₽ (оценка)
    profit: undefined,
    margin: undefined,
    storeCount: 25,
  },
  // 2009 - кризис, замедление роста
  {
    companyId: "okey",
    year: 2009,
    revenue: 52.0, // ~52 млрд ₽ (оценка)
    profit: 0.7, // 0,7 млрд ₽ чистая прибыль
    margin: 8.7, // EBITDA-маржа ~8,7%
    storeCount: 35,
  },
  // 2010 - IPO на LSE, переломный год
  {
    companyId: "okey",
    year: 2010,
    revenue: 82.7, // 82,7 млрд ₽ (факт), +21,8%
    profit: 3.0, // 3,0 млрд ₽ чистая прибыль
    margin: 8.6, // EBITDA-маржа 8,6%
    storeCount: 57,
  },
  // 2011 - уверенный рост
  {
    companyId: "okey",
    year: 2011,
    revenue: 102.0, // ~100–105 млрд ₽ (оценка)
    profit: 3.2, // ~3,2 млрд ₽ чистая прибыль
    margin: 8.0, // EBITDA-маржа ~8%
    storeCount: 70,
  },
  // 2012 - ускорение роста
  {
    companyId: "okey",
    year: 2012,
    revenue: 120.0, // ~120 млрд ₽ (оценка)
    profit: 4.7, // ~4,7 млрд ₽ чистая прибыль (+44,4%)
    margin: 8.1, // EBITDA-маржа ~8,1%
    storeCount: 80,
  },
  // 2013 - продолжение экспансии
  {
    companyId: "okey",
    year: 2013,
    revenue: 135.0, // ~135 млрд ₽ (оценка)
    profit: 5.0, // ~5,0 млрд ₽ чистая прибыль
    margin: 7.9, // EBITDA-маржа ~7,9%
    storeCount: 95,
  },
  // 2014 - рост на фоне кризиса
  {
    companyId: "okey",
    year: 2014,
    revenue: 150.0, // ~150 млрд ₽ (оценка)
    profit: 5.2, // ~5,2 млрд ₽ чистая прибыль
    margin: 7.4, // EBITDA-маржа ~7,4%
    storeCount: 100,
  },
  // 2015 - запуск онлайна
  {
    companyId: "okey",
    year: 2015,
    revenue: 165.0, // ~165 млрд ₽ (оценка)
    profit: 2.7, // ~2,7 млрд ₽ чистая прибыль (падение)
    margin: 6.6, // EBITDA-маржа ~6,6%
    storeCount: 110,
  },
  // 2016 - первый небольшой убыток
  {
    companyId: "okey",
    year: 2016,
    revenue: 177.0, // ~175–180 млрд ₽ (оценка)
    profit: -0.1, // убыток ~0,1 млрд ₽
    margin: 5.3, // EBITDA-маржа ~5,3%
    storeCount: 128,
  },
  // 2017 - продажа супермаркетов X5, разворот к прибыли
  {
    companyId: "okey",
    year: 2017,
    revenue: 175.0, // ~175 млрд ₽ (факт)
    profit: 3.2, // ~3,2 млрд ₽ чистая прибыль
    margin: 5.2, // EBITDA-маржа ~5,2%
    storeCount: 145,
  },
  // 2018 - перестройка портфеля, убыток
  {
    companyId: "okey",
    year: 2018,
    revenue: 166.0, // ~166 млрд ₽ (оценка)
    profit: -0.6, // убыток ~0,6 млрд ₽
    margin: 5.4, // EBITDA-маржа ~5,4%
    storeCount: 164,
  },
  // 2019 - стабилизация, рост EBITDA
  {
    companyId: "okey",
    year: 2019,
    revenue: 174.0, // ~174 млрд ₽ (оценка)
    profit: 0.8, // ~0,8 млрд ₽ чистая прибыль
    margin: 8.5, // EBITDA-маржа ~8,5%
    storeCount: 180,
  },
  // 2020 - COVID, рост спроса, убыток из-за разовых эффектов
  {
    companyId: "okey",
    year: 2020,
    revenue: 174.3, // ~174,3 млрд ₽ (факт)
    profit: -1.8, // убыток ~1,8 млрд ₽
    margin: 8.5, // EBITDA-маржа ~8,5%
    storeCount: 195,
  },
  // 2021 - восстановление после COVID
  {
    companyId: "okey",
    year: 2021,
    revenue: 187.1, // ~187,1 млрд ₽ (факт)
    profit: 0.21, // ~0,21 млрд ₽ чистая прибыль
    margin: 8.3, // EBITDA-маржа ~8–8,5%
    storeCount: 230,
  },
  // 2022 - геополитический кризис, рост EBITDA
  {
    companyId: "okey",
    year: 2022,
    revenue: 202.2, // ~202,2 млрд ₽ (факт)
    profit: 0.24, // ~0,24 млрд ₽ чистая прибыль
    margin: 8.4, // EBITDA-маржа ~8,4%
    storeCount: 273,
  },
  // 2023 - оптимизация гиперов, убыток из-за процентов
  {
    companyId: "okey",
    year: 2023,
    revenue: 207.9, // ~207,9 млрд ₽ (факт)
    profit: -2.9, // убыток ~2,9 млрд ₽
    margin: 8.2, // EBITDA-маржа ~8,2%
    storeCount: 297,
  },
  // 2024 - разворот к прибыли, рост EBITDA
  {
    companyId: "okey",
    year: 2024,
    revenue: 219.4, // ~219,4 млрд ₽ (факт)
    profit: 2.0, // ~2,0 млрд ₽ чистая прибыль
    margin: 9.3, // EBITDA-маржа ~9,3%
    storeCount: 300,
  },
  // 2025 - продажа гипермаркетов, фокус на DA! (оценка)
  {
    companyId: "okey",
    year: 2025,
    revenue: 230.0, // оценка ~230 млрд ₽
    profit: 0.5, // оценка ~0,5 млрд ₽
    margin: 9.0, // оценка EBITDA-маржа ~9%
    storeCount: 227, // только DA! после продажи гиперов
  },
];
