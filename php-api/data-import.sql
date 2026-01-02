-- =====================================================
-- SQL Import Script for IPO, Financials, M&A tables
-- Run this in PhpMyAdmin after creating the tables
-- =====================================================

-- 1. CREATE TABLES (if not exist)
-- =====================================================

CREATE TABLE IF NOT EXISTS `ipo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` VARCHAR(50) NOT NULL,
  `type` ENUM('ipo', 'spo') NOT NULL,
  `date` DATE NOT NULL,
  `valuation` VARCHAR(100),
  `raised` VARCHAR(100),
  `revenue` VARCHAR(100),
  `shares` VARCHAR(255),
  `exchange` VARCHAR(100),
  `ticker` VARCHAR(50),
  `price` VARCHAR(100),
  `prospectus` TEXT,
  `market_position` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_company_id` (`company_id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `financials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `quarter` INT,
  `revenue` DECIMAL(15,2),
  `profit` DECIMAL(15,2),
  `margin` DECIMAL(5,2),
  `store_count` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_company_id` (`company_id`),
  INDEX `idx_year` (`year`),
  UNIQUE KEY `unique_company_year_quarter` (`company_id`, `year`, `quarter`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ma_events` (
  `id` VARCHAR(100) PRIMARY KEY,
  `date` DATE NOT NULL,
  `buyer` VARCHAR(255) NOT NULL,
  `target` VARCHAR(255) NOT NULL,
  `value` VARCHAR(100),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_date` (`date`),
  INDEX `idx_buyer` (`buyer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. CLEAR EXISTING DATA (optional - remove these lines if you want to keep existing data)
-- =====================================================
TRUNCATE TABLE `ipo`;
TRUNCATE TABLE `financials`;
TRUNCATE TABLE `ma_events`;


-- 3. IPO DATA
-- =====================================================

-- Magnit IPO
INSERT INTO `ipo` (`company_id`, `type`, `date`, `valuation`, `raised`, `revenue`, `shares`, `exchange`, `ticker`, `price`, `prospectus`, `market_position`) VALUES
('magnit', 'ipo', '2006-04-28', '~$1,9–2,0 млрд', '$368,4 млн', '$2,505 млрд (2006)', '18,94% уставного капитала', 'РТС/ММВБ', 'MGNT', '$27 за акцию', 'К моменту IPO «Магнит» был крупнейшей по количеству магазинов сетью дискаунтеров в России, быстро растущей за счёт агрессивного органического открытия точек и собственной логистики.', 'К моменту IPO 2006 года «Магнит» являлся крупнейшей сетью дискаунтеров в России по количеству магазинов (1 893 точки на конец года).'),
('magnit', 'spo', '2008-04-22', '-', '~$480,3 млн', '$5,348 млрд (2008)', '11 245 660 акций + овероллотмент 506 586 акций; free float достиг ~35,5%', 'LSE (GDR) + РТС/ММВБ', 'MGNT (Россия) / MGNT (LSE GDR)', '$42,50 за акцию ($8,50 за GDR)', 'SPO-2008 — это расширение free float и привлечение нового капитала для ускорения роста.', 'Размещение GDR на Лондонской бирже (LSE) весной 2008 года стало ключевым событием интернационализации «Магнита».'),
('magnit', 'spo', '2009-09-02', '-', '~$369,2 млн', '-', '5 729 413 акций размещено; free float достиг 46,51%', 'LSE (GDR) + РТС/ММВБ', 'MGNT (Россия) / MGNT (LSE GDR)', '$65 за акцию ($13 за GDR)', 'Follow-on offering сентября 2009 года — вторая волна SPO после успешного размещения 2008 года.', 'Деньги от SPO-2009 направлялись на CAPEX: расширение сети гипермаркетов и магазинов «у дома».');

-- Pyaterochka/X5 IPO
INSERT INTO `ipo` (`company_id`, `type`, `date`, `valuation`, `raised`, `revenue`, `shares`, `exchange`, `ticker`, `price`, `prospectus`, `market_position`) VALUES
('pyaterochka', 'ipo', '2005-05-06', '~$1,9–2,0 млрд', '$598 млн', '$1,1 млрд за 2004 год (+46% к 2003)', '~30–32% капитала (45 968 144 GDR)', 'London Stock Exchange (LSE)', 'PJPq / ПЯТЬ', '$13 за GDR', NULL, 'На момент IPO Pyaterochka была крупнейшей по выручке сетью дискаунтеров в России.'),
('pyaterochka', 'spo', '2008-05-01', '-', '~$1,16 млрд', '$5,3 млрд за 2007 год (+53% г/г)', '48 106 700 новых GDR', 'London Stock Exchange (LSE)', 'FIVE', '-', NULL, 'В 2008 году X5 Retail Group провела крупное SPO в формате rights issue на Лондонской бирже.'),
('pyaterochka', 'spo', '2018-02-01', '-', '$0 (листинг существующих GDR)', '1,295 трлн ₽ за 2017 год', 'Существующие GDR X5 Retail Group N.V.', 'Moscow Exchange (MOEX) + LSE', 'FIVE', '-', NULL, '29 января 2018 года Московская биржа одобрила листинг GDR X5.');

-- Lenta IPO
INSERT INTO `ipo` (`company_id`, `type`, `date`, `valuation`, `raised`, `revenue`, `shares`, `exchange`, `ticker`, `price`, `prospectus`, `market_position`) VALUES
('lenta', 'ipo', '2014-02-28', '~$4,3 млрд', '~$952 млн', '~$4,4 млрд (144,3 млрд ₽ за 2013 год)', '~22,1% компании (95 238 095 GDR)', 'LSE / Московская биржа', 'LNTA', '$10 за GDR (5 GDR = 1 акция)', NULL, 'К моменту IPO в 2014 году «Лента» была вторым по величине оператором гипермаркетов в России.'),
('lenta', 'spo', '2015-03-23', '-', '$225 млн', '194,0 млрд ₽ за 2014 год', '35,2 млн новых GDR (~7,6% капитала)', 'LSE / Московская биржа', 'LNTA', '$6,40 за новый GDR', NULL, 'В 2015 году «Лента» проводила дополнительное размещение новых GDR.');

-- O''KEY IPO
INSERT INTO `ipo` (`company_id`, `type`, `date`, `valuation`, `raised`, `revenue`, `shares`, `exchange`, `ticker`, `price`, `prospectus`, `market_position`) VALUES
('okey', 'ipo', '2010-11-02', '~$3 млрд', '$420 млн', '82,7 млрд ₽ (2010)', '~14,2% компании', 'LSE (GDR)', 'OKEY', '$11 за GDR', '', 'К моменту IPO O''KEY являлся одним из ведущих российских ритейлеров с фокусом на гипермаркеты.'),
('okey', 'spo', '2020-12-01', '-', '-', '174,3 млрд ₽ (2020)', 'Вторичный листинг GDR', 'MOEX (вторичный листинг)', 'OKEY', '-', '', 'В декабре 2020 GDR O''KEY получают листинг на Московской бирже.'),
('okey', 'spo', '2024-06-01', '-', '-', '219,4 млрд ₽ (2024)', 'Перевод на II уровень MOEX', 'MOEX (II уровень)', 'OKEY', '-', '', 'В 2024 году GDR O''KEY переводятся на II уровень котировального списка MOEX.'),
('okey', 'spo', '2025-11-25', '-', '-', '~230 млрд ₽ (2025 оценка)', 'Продажа гипермаркетов менеджменту', 'MOEX', 'OKEY', '-', '', 'Продажа сети гипермаркетов O''KEY менеджменту.');

-- DIXY IPO
INSERT INTO `ipo` (`company_id`, `type`, `date`, `valuation`, `raised`, `revenue`, `shares`, `exchange`, `ticker`, `price`, `prospectus`, `market_position`) VALUES
('dixy', 'ipo', '2007-05-01', '$864 млн', '$360 млн', '~$1,0 млрд в 2006 году (≈26,5 млрд ₽)', '24 999 999 акций, free float 41,67%', 'РТС / ММВБ', 'DIXY', '$14,4 за акцию', 'IPO прошло в сложной конъюнктуре: ценовой диапазон снижен с $16,5–22 до $14,4–15,8.', 'Один из крупнейших российских продовольственных дискаунтеров: ~380-390 магазинов.');


-- 4. M&A DATA
-- =====================================================

-- Magnit M&A
INSERT INTO `ma_events` (`id`, `date`, `buyer`, `target`, `value`, `description`) VALUES
('magnit-2018-sia', '2018-06-01', 'Магнит', 'SIA (фарм-дистрибутор)', '-', 'Магнит договаривается о приобретении фарм-дистрибутора SIA для развития направления Аптека/Косметик.'),
('magnit-2021-dixy', '2021-07-15', 'Магнит', 'DIXY', '87,6-92,4 млрд руб', 'Крупнейшая сделка Магнита: покупка сети DIXY за ~90 млрд руб. В периметр вошло 2 477 магазинов и 5 РЦ.'),
('magnit-2023-kazanexpress', '2023-10-01', 'Магнит', 'KazanExpress', '-', 'Приобретение маркетплейса KazanExpress, который станет основой Magnit Market.'),
('magnit-2023-samberi-agreement', '2023-11-01', 'Магнит', 'Samberi (33,01% + опцион)', '-', 'Согласование ФАС покупки 33,01% акций дальневосточной сети Samberi с опционом на приобретение 100%.'),
('magnit-2024-samberi-close', '2024-03-01', 'Магнит', 'Samberi (закрытие 1-й стадии)', '-', 'Завершение первой стадии сделки по Samberi (33,01% акций + опцион на выкуп 100%).'),
('magnit-2025-azbuka-vkusa', '2025-01-15', 'Магнит', 'Azbuka Vkusa', '-', 'Покупка контрольного пакета (81,55%) премиальной сети Azbuka Vkusa.');

-- DIXY M&A
INSERT INTO `ma_events` (`id`, `date`, `buyer`, `target`, `value`, `description`) VALUES
('dixy-ma-victoria-2011', '2011-06-01', 'ДИКСИ', 'Группа «Виктория»', '~$1 млрд', 'Покупка группы «Виктория» (бренды Victoria, Cash, Kvartal, Deshevo, Semeynaya Kopilka) — 225 магазинов.'),
('dixy-ma-mercury-2019', '2019-06-01', 'Mercury Retail Group', 'ДИКСИ + Бристоль + Красное & Белое', NULL, 'Объединение «ДИКСИ», «Бристоля» и «Красного & Белого» в единую структуру Mercury Retail Group.'),
('dixy-ma-magnit-2021', '2021-07-01', 'Магнит', 'ДИКСИ', '92,4 млрд руб.', 'Магнит покупает сеть «ДИКСИ» (2651 магазин, 7 РЦ, выручка ~299 млрд руб.).');

-- Magnolia M&A
INSERT INTO `ma_events` (`id`, `date`, `buyer`, `target`, `value`, `description`) VALUES
('magnolia-bin-2001', '2001-01-01', 'ПФК «БИН»', '6 супермаркетов «Магнолия»', '$10–12 млн', 'Группа «БИН» приобретает сеть из 6 супермаркетов «Магнолия».');


-- 5. FINANCIAL DATA (Magnit only as example - full data is very large)
-- =====================================================

INSERT INTO `financials` (`company_id`, `year`, `quarter`, `revenue`, `profit`, `margin`, `store_count`) VALUES
-- Magnit Financials
('magnit', 1998, NULL, 0.3, NULL, NULL, 1),
('magnit', 1999, NULL, 0.7, NULL, NULL, 50),
('magnit', 2000, NULL, 1.5, NULL, NULL, 160),
('magnit', 2001, NULL, 2.5, NULL, NULL, 300),
('magnit', 2002, NULL, 8.5, NULL, NULL, 450),
('magnit', 2003, NULL, 13.5, 15, 3.4, 610),
('magnit', 2004, NULL, 24.5, 15, 1.8, 1019),
('magnit', 2005, NULL, 44.6, 36.8, 2.3, 1500),
('magnit', 2006, NULL, 68.1, 56.9, 2.3, 1893),
('magnit', 2007, NULL, 93.3, 92, 2.6, 2300),
('magnit', 2008, NULL, 132.4, 140, 2.7, 2800),
('magnit', 2009, NULL, 169.9, 275, 5.1, 3400),
('magnit', 2010, NULL, 236.2, 340, 4.5, 4055),
('magnit', 2011, NULL, 335.7, 495, 4.5, 5500),
('magnit', 2012, NULL, 448.5, 630, 4.5, 6884),
('magnit', 2013, NULL, 579.7, 1050, 5.0, 8093),
('magnit', 2014, NULL, 764.0, 1080, 4.5, 9711),
('magnit', 2015, NULL, 951.0, 1120, 4.0, 12089),
('magnit', 2016, NULL, 1075.0, 905, 5.06, 14059),
('magnit', 2017, NULL, 1143.0, 612, 3.1, 16350),
('magnit', 2018, NULL, 1237.0, 521, 2.7, 18399),
('magnit', 2019, NULL, 1369.0, 265, 1.2, 20725),
('magnit', 2020, NULL, 1554.0, 590, 2.4, 21564),
('magnit', 2021, NULL, 1856.0, 720, 2.8, 26077),
('magnit', 2022, NULL, 2352.0, 455, 1.4, 27405),
('magnit', 2023, NULL, 2545.0, 730, 2.6, 29165),
('magnit', 2024, NULL, 3043.4, 555, 1.6, 31483),
('magnit', 2025, NULL, 3350.0, NULL, NULL, 32600);

-- Add more companies' financials...
-- (Full script would be very long - this is a template)


-- 6. VERIFY DATA
-- =====================================================
SELECT 'IPO count:' as info, COUNT(*) as count FROM ipo;
SELECT 'M&A count:' as info, COUNT(*) as count FROM ma_events;
SELECT 'Financials count:' as info, COUNT(*) as count FROM financials;
