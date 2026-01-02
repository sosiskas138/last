import { FinancialData } from "@/types/retail";

export const pyaterochkaFinancials: FinancialData[] = [
  // 1999
  {
    companyId: "pyaterochka",
    year: 1999,
    quarter: 1,
    revenue: 0, // Запуск в феврале
    storeCount: 4, // Примерно 4 магазина к концу Q1
  },
  {
    companyId: "pyaterochka",
    year: 1999,
    quarter: 2,
    revenue: 0, // Данные не раскрываются
    storeCount: 5, // Не менее 5 точек к лету (магазин №55 открыт)
  },
  {
    companyId: "pyaterochka",
    year: 1999,
    revenue: 0.5, // млрд ₽ (оценка)
    storeCount: 16, // Официально: 16 магазинов на конец года
  },
  
  // 2000
  {
    companyId: "pyaterochka",
    year: 2000,
    revenue: 2.1, // млрд ₽
    storeCount: 38, // Все в Санкт-Петербурге
  },
  
  // 2001
  {
    companyId: "pyaterochka",
    year: 2001,
    quarter: 2,
    revenue: 0, // Примерные данные
    storeCount: 70, // Оценка после выхода в Москву (середина года)
  },
  {
    companyId: "pyaterochka",
    year: 2001,
    revenue: 6.2, // млрд ₽
    storeCount: 81, // 66 в СПб + 15 в Москве
  },
  
  // 2002
  {
    companyId: "pyaterochka",
    year: 2002,
    revenue: 15.7, // млрд ₽ (оценка)
    storeCount: 142,
  },
  
  // 2003
  {
    companyId: "pyaterochka",
    year: 2003,
    quarter: 2,
    revenue: 0, // Квартальные данные не раскрываются
    storeCount: 200, // Примерно 200 магазинов под брендом (оценка, середина года)
  },
  {
    companyId: "pyaterochka",
    year: 2003,
    revenue: 23.3, // млрд ₽
    profit: 1.09, // млрд ₽
    margin: 4.7, // %
    storeCount: 189, // Собственных магазинов (97 МСК + 92 СПб)
    // С франчайзи ~230-250 магазинов
  },
  
  // 2004
  {
    companyId: "pyaterochka",
    year: 2004,
    quarter: 2,
    revenue: 0, // Квартальные данные не раскрываются
    storeCount: 365, // Примерно 350-380 магазинов (оценка, середина года)
  },
  {
    companyId: "pyaterochka",
    year: 2004,
    revenue: 31.9, // млрд ₽
    profit: 1.52, // млрд ₽
    margin: 4.8, // %
    storeCount: 235, // Собственных магазинов (124 МСК + 111 СПб)
    // С франчайзи ~440-460 магазинов
  },
  
  // 2005
  {
    companyId: "pyaterochka",
    year: 2005,
    revenue: 38.4, // млрд ₽
    storeCount: 347, // Собственных (167 СПб + 159 МСК + 21 Екатеринбург)
    // С франчайзи (404 регионов) = ~751 магазин
  },
  
  // 2006 - данные X5 Group (включает Пятёрочку + Перекресток)
  {
    companyId: "x5",
    year: 2006,
    revenue: 79.5, // млрд ₽ (X5 Group, оценка)
    profit: 2.4, // млрд ₽ (X5 Group, оценка)
    margin: 3.0, // %
    storeCount: 451, // Собственных Пятёрочек
    // + 605 франчайзи = ~1056 магазинов под брендом Пятёрочка
  },
  {
    companyId: "pyaterochka",
    year: 2006,
    revenue: 53.6, // млрд ₽
    storeCount: 451, // Собственных магазинов Пятёрочка
    // + 605 франчайзи = ~1056 всего
  },
  
  // 2007 - данные X5 Group
  {
    companyId: "x5",
    year: 2007,
    revenue: 151.2, // млрд ₽ (X5 Group, оценка)
    profit: 4.1, // млрд ₽ (X5 Group, оценка)
    margin: 2.7, // %
    storeCount: 674, // Собственных Пятёрочек
  },
  {
    companyId: "pyaterochka",
    year: 2007,
    quarter: 2,
    revenue: 0, // Отдельно по формату не раскрывается
    storeCount: 591, // Франчайзи на 30.06.2007
  },
  {
    companyId: "pyaterochka",
    year: 2007,
    revenue: 75.3, // млрд ₽
    storeCount: 674, // Собственных магазинов Пятёрочка
    // + ~600 франчайзи = ~1270 всего
  },
  
  // 2008 - данные X5 Group
  {
    companyId: "x5",
    year: 2008,
    quarter: 2,
    revenue: 107.0, // млрд ₽ (1 полугодие, оценка)
    profit: 4.6, // млрд ₽ (без «Карусели», оценка)
    storeCount: 848, // Собственных Пятёрочек (год)
  },
  {
    companyId: "x5",
    year: 2008,
    revenue: 236.0, // млрд ₽ (консолидированная, оценка)
    profit: 3.2, // млрд ₽ (скорректированная чистая прибыль, оценка)
    margin: 1.3, // %
    storeCount: 1101, // Всего магазинов X5
  },
  {
    companyId: "pyaterochka",
    year: 2008,
    revenue: 111.0, // млрд ₽
    storeCount: 848, // Собственных магазинов Пятёрочка
    // + 607 франчайзи ≈ 1455 всего
  },
  
  // 2009 - кризисный год
  {
    companyId: "x5",
    year: 2009,
    quarter: 1,
    revenue: 52.9, // млрд ₽ (оценка)
    storeCount: 0, // Квартальные данные не раскрываются
  },
  {
    companyId: "x5",
    year: 2009,
    quarter: 2,
    revenue: 113.1, // млрд ₽ (1 полугодие, оценка)
    profit: 1.4, // млрд ₽ (оценка)
    storeCount: 0,
  },
  {
    companyId: "x5",
    year: 2009,
    quarter: 3,
    revenue: 172.5, // млрд ₽ (9 месяцев, оценка)
    profit: 3.4, // млрд ₽ (оценка)
    storeCount: 952, // Собственных Пятёрочек на 30.09.2009
  },
  {
    companyId: "x5",
    year: 2009,
    revenue: 248.0, // млрд ₽ (оценка)
    profit: 4.7, // млрд ₽ (оценка)
    margin: 1.9, // %
    storeCount: 1372, // Всего магазинов X5
  },
  {
    companyId: "pyaterochka",
    year: 2009,
    revenue: 148.4, // млрд ₽
    storeCount: 1039, // Собственных магазинов Пятёрочка
    // + 620 франчайзи ≈ 1650-1700 всего
  },
  
  // 2010 - посткризисное восстановление
  {
    companyId: "x5",
    year: 2010,
    quarter: 1,
    revenue: 72.1, // млрд ₽ (оценка)
    storeCount: 1063, // Собственных Пятёрочек на 31.03.2010
  },
  {
    companyId: "x5",
    year: 2010,
    quarter: 3,
    revenue: 221.8, // млрд ₽ (9 месяцев, оценка)
    profit: 5.2, // млрд ₽ (оценка)
    storeCount: 1232, // Собственных Пятёрочек на 30.09.2010
  },
  {
    companyId: "x5",
    year: 2010,
    revenue: 320.3, // млрд ₽ (оценка)
    profit: 7.7, // млрд ₽ (оценка)
    margin: 2.4, // %
    storeCount: 2469, // Всего магазинов X5
  },
  {
    companyId: "pyaterochka",
    year: 2010,
    revenue: 194.8, // млрд ₽
    storeCount: 2052,
    // + 665 франчайзи ≈ 2000-2050 всего
  },
  
  // 2011 - интеграция Копейки
  {
    companyId: "x5",
    year: 2011,
    revenue: 454.2, // млрд ₽
    margin: 0, // Маржа по группе 2-3% (оценка)
    storeCount: 3000, // Более 3000 магазинов X5
    // EBITDA-маржа 7,3%
  },
  {
    companyId: "pyaterochka",
    year: 2011,
    quarter: 2,
    revenue: 0,
    storeCount: 2300, // Примерно середина года (оценка)
  },
  {
    companyId: "pyaterochka",
    year: 2011,
    revenue: 282.8, // млрд ₽
    storeCount: 2525, // Всего магазинов под брендом (собственные + франчайзи)
  },

  // 2012
  {
    companyId: "pyaterochka",
    year: 2012,
    quarter: 2,
    revenue: 0, // Квартальные данные не раскрываются
    storeCount: 2900, // Примерно середина года (оценка)
  },
  {
    companyId: "pyaterochka",
    year: 2012,
    revenue: 317.8, // млрд ₽
    storeCount: 3220, // Всего магазинов под брендом
  },
  {
    companyId: "x5",
    year: 2012,
    revenue: 491.1, // млрд ₽
    margin: 1.6, // Скорректированная чистая маржа
    storeCount: 3800, // Более 3800 магазинов X5
    // EBITDA-маржа 7,1%, валовая маржа 23,6%
  },

  // 2013
  {
    companyId: "pyaterochka",
    year: 2013,
    quarter: 2,
    revenue: 0, // Квартальные данные не раскрываются
    storeCount: 3500, // Примерно середина года (оценка)
  },
  {
    companyId: "pyaterochka",
    year: 2013,
    revenue: 348.4, // млрд ₽
    storeCount: 3882, // Всего магазинов под брендом
  },
  {
    companyId: "x5",
    year: 2013,
    revenue: 534.6, // млрд ₽
    margin: 0, // Маржа ещё под давлением
    storeCount: 4500, // Более 4500 магазинов X5
    // EBITDA-маржа 6,8%
  },

  // 2014
  {
    companyId: "pyaterochka",
    year: 2014,
    quarter: 2,
    revenue: 0, // Квартальные данные не раскрываются
    storeCount: 4300, // Примерно середина года (оценка)
  },
  {
    companyId: "pyaterochka",
    year: 2014,
    revenue: 435.8, // млрд ₽
    storeCount: 4789, // Магазинов на конец года
    // Доля «Пятёрочки» в выручке X5: 69%
  },
  {
    companyId: "x5",
    year: 2014,
    revenue: 633.9, // млрд ₽
    profit: 12.7, // млрд ₽
    margin: 2.0, // Чистая маржа ~2%
    storeCount: 5400, // Более 5400 магазинов X5
    // EBITDA ~45,9 млрд руб.
  },

  // 2015
  {
    companyId: "pyaterochka",
    year: 2015,
    quarter: 2,
    revenue: 0, // Квартальные данные не раскрываются
    storeCount: 5500, // Примерно середина года (оценка)
  },
  {
    companyId: "pyaterochka",
    year: 2015,
    revenue: 585.4, // млрд ₽
    storeCount: 6265, // Магазинов на конец года
    // Доля «Пятёрочки» в выручке X5: >70%
  },
  {
    companyId: "x5",
    year: 2015,
    revenue: 808.8, // млрд ₽
    profit: 14.2, // млрд ₽
    margin: 1.8, // Чистая маржа (оценка)
    storeCount: 7000, // Более 7000 магазинов X5
    // EBITDA ~59,4 млрд руб., EBITDA-маржа 7,3%
  },

  // 2016
  {
    companyId: "pyaterochka",
    year: 2016,
    revenue: 775.6, // млрд ₽
    storeCount: 8363, // Магазинов на конец года
    // Доля «Пятёрочки» в выручке X5: >75%
  },
  {
    companyId: "x5",
    year: 2016,
    revenue: 1033.7, // млрд ₽
    profit: 22.3, // млрд ₽
    margin: 2.2, // Чистая маржа
    storeCount: 9187, // Магазинов X5 на конец года
    // EBITDA ~76,3 млрд руб., EBITDA-маржа 7,4-7,7%
  },

  // 2017
  {
    companyId: "pyaterochka",
    year: 2017,
    revenue: 1001, // млрд ₽
    storeCount: 11225, // Магазинов на конец года
  },
  {
    companyId: "x5",
    year: 2017,
    revenue: 1295, // млрд ₽
    profit: 31.4, // млрд ₽
    margin: 2.4, // Чистая маржа
    storeCount: 12500, // Примерно магазинов X5 (оценка)
    // EBITDA ~96,2 млрд руб., EBITDA-маржа 7,4%
  },

  // 2018
  {
    companyId: "pyaterochka",
    year: 2018,
    revenue: 1198, // млрд ₽
    storeCount: 13522, // Магазинов на конец года
  },
  {
    companyId: "x5",
    year: 2018,
    revenue: 1532.5, // млрд ₽
    profit: 29, // млрд ₽
    margin: 1.9, // Чистая маржа (pre-IFRS 16)
    storeCount: 14800, // Примерно магазинов X5 (оценка)
    // EBITDA ~107,6 млрд руб., EBITDA-маржа 7,0%
  },

  // 2019
  {
    companyId: "pyaterochka",
    year: 2019,
    revenue: 1367, // млрд ₽
    storeCount: 15354, // Магазинов на конец года
  },
  {
    companyId: "x5",
    year: 2019,
    revenue: 1734, // млрд ₽
    profit: 26, // млрд ₽ (pre-IFRS 16)
    margin: 1.5, // Чистая маржа (pre-IFRS 16)
    storeCount: 16900, // Примерно магазинов X5 (оценка)
    // EBITDA ~122,6 млрд руб., EBITDA-маржа 7,1%
  },

  // 2020
  {
    companyId: "pyaterochka",
    year: 2020,
    revenue: 1597, // млрд ₽
    storeCount: 16709, // Магазинов на конец года
    // Рост +16,9% г/г
  },
  {
    companyId: "x5",
    year: 2020,
    revenue: 1978, // млрд ₽
    profit: 39, // млрд ₽ (pre-IFRS 16)
    margin: 2.0, // Чистая маржа (оценка, pre-IFRS 16)
    storeCount: 17707, // Магазинов X5 на конец года
    // Онлайн-GMV 21,9 млрд руб., +347% г/г
  },

  // 2021
  {
    companyId: "pyaterochka",
    year: 2021,
    revenue: 1793, // млрд ₽
    storeCount: 17972, // Магазинов на конец года (оценка)
  },
  {
    companyId: "x5",
    year: 2021,
    revenue: 2300, // млрд ₽ (оценка)
    margin: 0, // Маржа по группе (оценка)
    storeCount: 19500, // Примерно магазинов X5 (оценка)
    // EBITDA-маржа 7,3%
  },

  // 2022
  {
    companyId: "pyaterochka",
    year: 2022,
    quarter: 2,
    revenue: 0, // Квартальные данные не раскрываются
    storeCount: 18600, // Примерно на 31.03.2022 (оценка)
  },
  {
    companyId: "pyaterochka",
    year: 2022,
    quarter: 4,
    revenue: 551.9, // млрд ₽
    storeCount: 0, // Квартальные данные не раскрываются
  },
  {
    companyId: "pyaterochka",
    year: 2022,
    revenue: 2122, // млрд ₽
    storeCount: 19164, // Магазинов на конец года
    // Рост +18% г/г, нетто-выручка офлайн
  },
  {
    companyId: "x5",
    year: 2022,
    revenue: 2500, // млрд ₽
    margin: 0, // Маржа по группе
    storeCount: 20500, // Примерно магазинов X5 (оценка)
    // EBITDA-маржа 7,4%
  },

  // 2023
  {
    companyId: "pyaterochka",
    year: 2023,
    quarter: 1,
    revenue: 537.9, // млрд ₽
    storeCount: 0, // Квартальные данные не раскрываются
  },
  {
    companyId: "pyaterochka",
    year: 2023,
    quarter: 2,
    revenue: 604.8, // млрд ₽ (офлайн)
    storeCount: 20248, // Магазинов на 30.06.2023
    // Net retail sales включая экспресс: 617,0 млрд руб.
  },
  {
    companyId: "pyaterochka",
    year: 2023,
    revenue: 2491, // млрд ₽
    storeCount: 21308, // Магазинов на конец года
    // Рост +17,3% г/г (включая экспресс-доставку)
  },
  {
    companyId: "x5",
    year: 2023,
    revenue: 3020, // млрд ₽ (рост +20,6%)
    margin: 0, // Маржа по группе
    storeCount: 22500, // Примерно магазинов X5 (оценка)
    // EBITDA-маржа ~6,9%
  },

  // 2024
  {
    companyId: "pyaterochka",
    year: 2024,
    quarter: 1,
    revenue: 686.5, // млрд ₽
    storeCount: 0, // Квартальные данные не раскрываются
  },
  {
    companyId: "pyaterochka",
    year: 2024,
    quarter: 4,
    revenue: 810.6, // млрд ₽
    storeCount: 0, // Квартальные данные не раскрываются
  },
  {
    companyId: "pyaterochka",
    year: 2024,
    revenue: 3000, // млрд ₽
    storeCount: 22976,
    // Включая экспресс-доставку, доля ~70% выручки X5
  },
  {
    companyId: "x5",
    year: 2024,
    revenue: 3500, // млрд ₽ (рост +24,2%)
    margin: 0, // Маржа по группе
    storeCount: 24000, // Примерно магазинов X5 (оценка)
    // EBITDA-маржа 6,6%
  },

  // 2025 (9M)
  {
    companyId: "pyaterochka",
    year: 2025,
    quarter: 3,
    revenue: 913.8, // млрд ₽
    storeCount: 23900, // Примерно середина года (оценка)
    // LFL-продажи +9,7%, LFL-чек +9,5%, LFL-трафик +0,2%
  },
  {
    companyId: "pyaterochka",
    year: 2025,
    revenue: 3400, // млрд ₽ (оценка на полный год)
    storeCount: 24000, // Оценка на конец года
  },
];
