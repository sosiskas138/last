-- =====================================================
-- ПОЛНЫЙ ИМПОРТ БАЗЫ ДАННЫХ РОССИЙСКОГО ПРОДУКТОВОГО РИТЕЙЛА
-- =====================================================
-- Версия: 1.0
-- Дата: 2025-12-16
-- Описание: Содержит все данные компаний, событий, основателей, финансов, IPO и M&A
-- =====================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Отключаем проверку внешних ключей для TRUNCATE
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- ТАБЛИЦА: companies (Компании)
-- =====================================================
CREATE TABLE IF NOT EXISTS `companies` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `parent_company` VARCHAR(50) NULL,
  `color` VARCHAR(20) DEFAULT '#666666',
  `status` ENUM('active', 'inactive', 'acquired') DEFAULT 'active',
  `acquired_by` VARCHAR(50) NULL,
  `acquired_year` INT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Данные компаний (UPSERT, без TRUNCATE из-за внешних ключей)
INSERT INTO `companies` (`id`, `name`, `parent_company`, `color`, `status`, `acquired_by`, `acquired_year`) VALUES
('tander', 'АО "Тандер"', NULL, '#E31E24', 'active', NULL, NULL),
('magnit', 'Магнит', 'tander', '#E31E24', 'active', NULL, NULL),
('x5', 'X5 Group', NULL, '#00A650', 'active', NULL, NULL),
('pyaterochka', 'Пятёрочка', 'x5', '#00A650', 'active', NULL, NULL),
('perekrestok', 'Перекрёсток', 'x5', '#00A650', 'active', NULL, NULL),
('lenta', 'Лента', NULL, '#FFB81C', 'active', NULL, NULL),
('okey', 'О''КЕЙ', NULL, '#E85B00', 'active', NULL, NULL),
('magnolia', 'Магнолия', NULL, '#9C27B0', 'active', NULL, NULL),
('kopeyka', 'Копейка', 'x5', '#2196F3', 'inactive', NULL, NULL),
('dixy', 'ДИКСИ', 'magnit', '#FF6B00', 'acquired', 'magnit', 2021)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `parent_company` = VALUES(`parent_company`),
  `color` = VALUES(`color`),
  `status` = VALUES(`status`),
  `acquired_by` = VALUES(`acquired_by`),
  `acquired_year` = VALUES(`acquired_year`),
  `updated_at` = CURRENT_TIMESTAMP;

-- =====================================================
-- ТАБЛИЦА: founders (Основатели)
-- =====================================================
CREATE TABLE IF NOT EXISTS `founders` (
  `id` VARCHAR(100) PRIMARY KEY,
  `company_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` TEXT,
  `period` VARCHAR(100),
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `ownership` TEXT,
  `background` TEXT,
  `key_contributions` JSON,
  `current_activity` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Очистка таблицы основателей
TRUNCATE TABLE `founders`;

-- Вставка основателей Магнита
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('galitsky', 'magnit', 'Сергей Галицкий (Арутюнян)', 'Основатель, главный идеолог и гендиректор сети до 2018 года', '1994–02.2018', 'inactive', 'До 2006: >70% через «Тандер»; 2006 (после IPO): ~58%; Февраль 2018: продал ВТБ 29,1%, остался ~3%', 'Родился в 1967 году в Сочи (Лазаревское). Окончил экономфак КубГУ. В конце 80-х — начале 90-х работал в коммерческом банке в Краснодаре. 1993–1994: создаёт бизнес по дистрибуции косметики и бытовой химии.', '["Агрессивное масштабирование «магазинов у дома» в регионах", "Построение вертикально интегрированной модели", "IPO 2006 года"]', 'Президент и владелец ФК «Краснодар». Развивает винодельню.'),
('bogachev', 'magnit', 'Алексей Богачёв', 'Ранний совладелец и миноритарный акционер', 'С середины 1990-х до середины 2010-х', 'inactive', 'Конец 90-х – начало 2000-х: ~25% компании «Тандер»', 'Родился в 1970 г., по образованию экономист. Владелец банка «Система», агробизнеса «Юг-Агро».', '["Финансовый инвестор, обеспечивал капитал для роста компании"]', 'В управлении Магнита не участвует.'),
('vtb-kostin', 'magnit', 'Банк ВТБ и Андрей Костин', 'Государственный банк, крупнейший акционер в 2018–2021 гг.', 'Февраль 2018 – Ноябрь 2021', 'inactive', 'Февраль 2018: купил 29,1%; Ноябрь 2021: полный выход', 'Государственный банк России.', '["Участие в формировании новой команды менеджмента после ухода Галицкого"]', 'Полный выход из капитала Магнита в ноябре 2021 года.'),
('vinokurov', 'magnit', 'Александр Винокуров (Marathon Group)', 'Сооснователь и президент Marathon Group, член совета директоров Магнита', 'С 2018 года', 'active', 'Ноябрь 2021: доля достигла ~29,2%', 'Родился в 1982 г. в Москве, окончил Кембриджский университет.', '["Активно вовлечён в стратегию M&A (покупка сети ДИКСИ)"]', 'Крупнейший бенефициарный владелец и член совета директоров Магнита.'),
('sluchevsky', 'magnit', 'Евгений Случевский', 'Генеральный директор ПАО «Магнит»', 'С мая 2024 года', 'active', NULL, 'До Магнита — в группе «Русагро», руководил мясным бизнесом.', '["Стратегия в условиях санкций, импортозамещения"]', 'Действующий гендиректор ПАО «Магнит» (на 2025 год).');

-- Вставка основателей Пятёрочки/X5
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('rogachev', 'pyaterochka', 'Андрей Владимирович Рогачёв', 'Ключевой основатель, один из крупнейших акционеров до 2011 года', '1999–2011', 'inactive', '2011: продал последний пакет 11,14% за ~$1,38 млрд', 'Российский предприниматель, долларовый миллиардер.', '["Создание формата продуктового дискаунтера", "IPO на LSE в 2005", "Слияние с Перекрёстком в 2006"]', 'Развивает сеть дискаунтеров «Верный».'),
('girda', 'pyaterochka', 'Александр Гирда', 'Сооснователь', '1999–2013', 'inactive', '2013: ~16,35%', 'Предприниматель из Петербурга.', '["Сооснователь концепции дискаунтера Пятёрочка"]', 'В операционном управлении не участвует.'),
('ctf-alfa', 'x5', 'CTF Holdings S.A. / Alfa Group', 'Контролирующий акционер X5 Group', 'С 2006 года', 'active', '~47,86% X5 Group', 'Alfa Group — один из крупнейших частных конгломератов России.', '["Создание Перекрёстка", "Слияние с Пятёрочкой", "Формирование X5"]', 'Пакет CTF 47,86% X5 сохраняется.'),
('shekhterman', 'x5', 'Игорь Шехтерман', 'CEO X5 Group', 'С 2015', 'active', NULL, 'Основатель RosExpert.', '["Определяет стратегию X5"]', 'Действующий CEO X5 Group.'),
('kurbatov', 'pyaterochka', 'Владислав Курбатов', 'Генеральный директор Пятёрочки', 'С 2022 года', 'active', NULL, 'До Пятёрочки — гендиректор Перекрёстка.', '["Расширение географии", "Интеграция онлайн-доставки"]', 'Действующий генеральный директор Пятёрочки.');

-- Вставка основателей Ленты
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('oleg-zherebtsov', 'lenta', 'Олег Жеребцов', 'Основатель, гендиректор (1993-2003)', '1993-2009', 'inactive', 'Основной собственник до середины 2000-х', 'Российский предприниматель, основатель Ленты.', '["Основал компанию в 1993 году", "Перевёл формат в гипермаркеты"]', 'Занимается Solopharm.'),
('severgroup-mordashov', 'lenta', 'Severgroup / Алексей Мордашов', 'Контролирующий акционер', '2019-настоящее время', 'active', '~78,73%', 'Severgroup — инвестиционная компания Алексея Мордашова.', '["Покупка контроля в 2019", "Стратегия M&A"]', 'Контролирующий акционер Ленты.'),
('vladimir-sorokin', 'lenta', 'Владимир Сорокин', 'Генеральный директор', '2020-настоящее время', 'active', NULL, 'Бывший гендиректор Перекрёстка.', '["Покупка Billa, Утконос, Монетка"]', 'Действующий CEO Ленты.');

-- Вставка основателей О'КЕЙ
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('okey-troitsky', 'okey', 'Дмитрий Троицкий', 'Сооснователь, акционер', '2001–н.в.', 'active', 'Один из ключевых акционеров', 'Предприниматель, ранее занимался автобизнесом и соками (Multon).', '["Создание концепции европейского гипермаркета"]', 'Акционер группы О''КЕЙ'),
('okey-korzhev', 'okey', 'Дмитрий Коржев', 'Сооснователь, акционер', '2001–н.в.', 'active', 'Один из ключевых акционеров', 'Предприниматель, партнёр по бизнесу Multon.', '["Формирование управленческой команды"]', 'Акционер группы О''КЕЙ');

-- Вставка основателей ДИКСИ
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('dixy-founder-leonov', 'dixy', 'Олег Леонов', 'Основатель, Президент ГК «Дикси»', '1993 — н.в.', 'active', NULL, 'Предприниматель, создал компанию «Юнилэнд».', '["Создание Юнилэнд", "Запуск ДИКСИ в 1999", "IPO в 2007"]', 'Президент ГК «Дикси», контролирующий акционер');

-- Вставка основателей Копейки
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('kopeyka-lomakin', 'kopeyka', 'Сергей Ломакин', 'Сооснователь, совладелец', '1998–2010', 'inactive', 'Совладелец через «Фелму»', 'Предприниматель, оптовая торговля.', '["Создание первого российского дискаунтера"]', 'После продажи Копейки вышел из ритейла'),
('kopeyka-khachatryan', 'kopeyka', 'Артём Хачатрян', 'Сооснователь, совладелец', '1998–2010', 'inactive', 'Совладелец через «Фелму»', 'Предприниматель, один из создателей концепции Копейки.', '["Разработка концепции дискаунтера"]', 'После продажи сети вышел из операционного управления');

-- Вставка основателей Магнолии
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('magnolia-taradin', 'magnolia', 'Василий Тарадин', 'Сооснователь, акционер', '1993 – н.в.', 'active', 'Акционер ООО «ТиК Продукты»', 'Один из ключевых основателей сети «Магнолия».', '["Сооснователь сети в 1993 году"]', NULL),
('magnolia-mitrokhin', 'magnolia', 'Дмитрий Митрохин', 'Генеральный директор, совладелец', '1996 – н.в.', 'active', 'Совладелец', 'Генеральный директор сети «Магнолия».', '["Развитие формата магазин у дома"]', 'Руководит развитием сети');

-- Вставка основателей Перекрёстка
INSERT INTO `founders` (`id`, `company_id`, `name`, `role`, `period`, `status`, `ownership`, `background`, `key_contributions`, `current_activity`) VALUES
('kosyanenko', 'perekrestok', 'Александр Косьяненко', 'Сооснователь и генеральный директор', '1994–2006', 'inactive', 'Миноритарная доля в структурах Альфа-Групп', 'Сооснователь сети Перекрёсток.', '["Создание первого современного супермаркета (1995)", "Привлечение кредита ЕБРР $42 млн"]', 'Покинул операционное управление после слияния.');

-- =====================================================
-- ТАБЛИЦА: events (События)
-- =====================================================
CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(100) PRIMARY KEY,
  `company_id` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(50),
  `subcategory` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Очистка таблицы событий
TRUNCATE TABLE `events`;

-- Ключевые события Магнита
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('magnit-1994-foundation', 'tander', '1994-01-01', 'Создание компании «Тандер»', 'Сергей Галицкий создаёт компанию «Тандер» как оптового дистрибьютора косметики и бытовой химии в Краснодаре.', 'strategy'),
('magnit-1998-brand', 'magnit', '1998-01-01', 'Запуск бренда «Магнит»', 'Появление бренда «Magnit» как расшифровка «магазин низких тарифов». Первый магазин в Краснодаре.', 'brand_and_loyalty'),
('magnit-2000-discounter', 'magnit', '2000-01-01', 'Переход в формат дискаунтера', 'Magnit официально переходит к модели дискаунтера: простые магазины «у дома».', 'format_and_refits'),
('magnit-2006-ipo', 'tander', '2006-02-01', 'IPO на российском рынке', 'Проведено IPO на российском рынке — привлечено ~368 млн USD.', 'equity_ipo'),
('magnit-2007-hypermarket', 'magnit', '2007-10-01', 'Открытие первого гипермаркета в Краснодаре', 'Запуск первого гипермаркета. Переход к мультиформатной модели.', 'format_and_refits'),
('magnit-2008-gdr-lse', 'tander', '2008-04-01', 'Размещение GDR на Лондонской бирже (LSE)', 'Размещение GDR на LSE весной 2008. Допэмиссия добавила ~$466,6 млн.', 'equity_ipo'),
('magnit-2018-vtb', 'magnit', '2018-02-16', 'Продажа доли Галицкого банку ВТБ', 'Сергей Галицкий продал 29,1% акций ВТБ за 138 млрд руб.', 'consolidation'),
('magnit-2021-dixy', 'magnit', '2021-07-15', 'Покупка сети ДИКСИ', 'Крупнейшая сделка Магнита: покупка сети DIXY за ~90 млрд руб.', 'consolidation'),
('magnit-2025-azbuka', 'magnit', '2025-01-15', 'Покупка Азбуки Вкуса', 'Покупка контрольного пакета (81,55%) премиальной сети Azbuka Vkusa.', 'consolidation');

-- Ключевые события Пятёрочки
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('pyaterochka-1999-foundation', 'pyaterochka', '1999-02-15', 'Запуск сети дискаунтеров «Пятёрочка»', 'Открытие первых четырёх магазинов сети «Пятёрочка» в Санкт-Петербурге.', 'strategy'),
('pyaterochka-2001-moscow', 'pyaterochka', '2001-07-01', 'Выход на рынок Москвы', 'Первый московский магазин открыт в июле 2001 г.', 'new_regions'),
('pyaterochka-2005-ipo', 'pyaterochka', '2005-05-06', 'IPO на Лондонской бирже', 'IPO Pyaterochka Holding N.V. на LSE. Привлечено $598 млн.', 'equity_ipo'),
('pyaterochka-2006-merger', 'pyaterochka', '2006-05-18', 'Слияние с Перекрёстком — создание X5', 'Слияние «Пятёрочки» и «Перекрёстка». Создание X5 Retail Group.', 'consolidation'),
('pyaterochka-2018-moex', 'x5', '2018-02-01', 'Листинг GDR X5 на Московской бирже', 'GDR X5 включены в котировальный список первого уровня MOEX.', 'equity_ipo');

-- Ключевые события Ленты
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('lenta-1993-foundation', 'lenta', '1993-10-01', 'Основание сети «Лента»', 'Олег Жеребцов открыл первый магазин-склад формата cash & carry в Санкт-Петербурге.', 'strategy'),
('lenta-1999-hypermarket', 'lenta', '1999-06-01', 'Открытие первого гипермаркета', 'Стратегический поворот: «Лента» открывает первый гипермаркет (2700 м²).', 'format_and_refits'),
('lenta-2014-ipo', 'lenta', '2014-02-28', 'IPO на LSE и Московской бирже', 'IPO «Ленты». Привлечено ~$952 млн. Оценка ~$4,3 млрд.', 'equity_ipo'),
('lenta-2019-severgroup', 'lenta', '2019-04-01', 'Покупка контроля Severgroup', 'Severgroup покупает 42% у TPG/VTB и ЕБРР.', 'consolidation'),
('lenta-2023-monetka', 'lenta', '2023-03-01', 'Покупка сети Монетка', 'Приобретение сети дискаунтеров «Монетка» (~2000 магазинов).', 'consolidation');

-- Ключевые события О'КЕЙ
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('okey-2001-foundation', 'okey', '2001-01-01', 'Основание группы компаний «О''КЕЙ»', 'Группа О''КЕЙ основана в Санкт-Петербурге.', 'strategy'),
('okey-2002-first-store', 'okey', '2002-01-01', 'Открытие первого гипермаркета', 'Открыт первый гипермаркет О''КЕЙ в Санкт-Петербурге.', 'expansion'),
('okey-2010-ipo', 'okey', '2010-11-02', 'IPO на LSE', 'IPO O''KEY на Лондонской бирже. Привлечено $420 млн.', 'equity_ipo'),
('okey-2025-sale', 'okey', '2025-11-25', 'Продажа гипермаркетов менеджменту', 'Продажа сети гипермаркетов O''KEY менеджменту. Группа превращается в дискаунтер DA!', 'consolidation');

-- Ключевые события ДИКСИ
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('dixy-1993-founding', 'dixy', '1993-01-01', 'Основание компании «Юнилэнд»', 'Олег Леонов создаёт компанию «Юнилэнд» — будущую ГК «Дикси».', 'strategy'),
('dixy-1999-first-store', 'dixy', '1999-01-01', 'Первый магазин «ДИКСИ» в Москве', 'Открывается первый розничный магазин «ДИКСИ» формата жёсткого дискаунтера.', 'format_and_refits'),
('dixy-2007-ipo', 'dixy', '2007-05-01', 'IPO на RTS и ММВБ', 'IPO ГК «Дикси». Привлечено ~$360 млн.', 'equity_ipo'),
('dixy-2011-victoria', 'dixy', '2011-06-01', 'Покупка группы «Виктория»', 'Покупка группы «Виктория» (~225 магазинов) за ~$1 млрд.', 'consolidation'),
('dixy-2021-magnit', 'dixy', '2021-07-01', 'Продажа сети «Магниту»', 'Магнит покупает сеть «ДИКСИ» за 92,4 млрд руб.', 'consolidation');

-- Ключевые события Копейки
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('kopeyka-1998-launch', 'kopeyka', '1998-05-07', 'Запуск сети дискаунтеров «Копейка»', 'Открыт первый универсам «Копейка» в Москве — один из первых российских дискаунтеров.', 'format_and_refits'),
('kopeyka-2002-yukos', 'kopeyka', '2002-01-15', 'Продажа контрольного пакета ЮКОСу', 'Сделка с ЮКОСом: контрольный пакет — 50,5%.', 'consolidation'),
('kopeyka-2007-uralsib', 'kopeyka', '2007-05-28', 'Покупка контроля «Уралсиб»', 'Корпорация «Уралсиб» покупает 50,55% «Копейки» за $940 млн.', 'consolidation'),
('kopeyka-2010-x5', 'kopeyka', '2010-12-01', 'Продажа сети X5 Retail Group', 'X5 Retail Group покупает «Копейку» за $1,65 млрд.', 'consolidation');

-- Ключевые события Магнолии
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('magnolia-1993-first-stall', 'magnolia', '1993-01-01', 'Первая продуктовая палатка', 'На улице Жукова открыта первая продуктовая палатка — начало сети «Магнолия».', 'expansion'),
('magnolia-1996-first-supermarket', 'magnolia', '1996-01-01', 'Первый супермаркет в Строгино', 'Приобретён первый супермаркет на ул. Катукова в Строгино.', 'expansion'),
('magnolia-2001-sale-bin', 'magnolia', '2001-01-01', 'Продажа супермаркетов группе «БИН»', 'Сеть из 6 супермаркетов продана группе «БИН» за ~$10 млн.', 'consolidation'),
('magnolia-2002-relaunch', 'magnolia', '2002-01-01', 'Перезапуск бренда — формат «магазин у дома»', 'Запуск новой сети мини-маркетов под брендом «Магнолия».', 'format_and_refits');

-- Ключевые события Перекрёстка
INSERT INTO `events` (`id`, `company_id`, `date`, `title`, `description`, `category`) VALUES
('perekrestok-1995-first-store', 'perekrestok', '1995-01-01', 'Открытие первого супермаркета в Митино', 'Запуск первого супермаркета «Перекрёсток» в Москве.', 'expansion'),
('perekrestok-1996-ebrd', 'perekrestok', '1996-01-01', 'Кредит ЕБРР $42 млн', '«Перекрёсток» получает кредит ЕБРР $42 млн под 9% годовых.', 'debt_financing'),
('perekrestok-1998-first-dc', 'perekrestok', '1998-03-01', 'Открытие первого в России РЦ', '«Перекрёсток» открывает первый в истории российской розницы распределительный центр.', 'warehouse_logistics'),
('perekrestok-2017-online', 'perekrestok', '2017-06-01', 'Запуск Perekrestok.ru', 'Запуск онлайн-супермаркета Perekrestok.ru.', 'digital_technologies');

-- =====================================================
-- ТАБЛИЦА: financials (Финансовые данные)
-- =====================================================
CREATE TABLE IF NOT EXISTS `financials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` VARCHAR(50) NOT NULL,
  `year` INT NOT NULL,
  `quarter` INT NULL,
  `revenue` DECIMAL(15,2),
  `profit` DECIMAL(15,2),
  `margin` DECIMAL(5,2),
  `store_count` INT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_company_year_quarter` (`company_id`, `year`, `quarter`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Очистка таблицы финансов
TRUNCATE TABLE `financials`;

-- Финансовые данные Магнита (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('magnit', 1998, 0.3, NULL, NULL, 1),
('magnit', 1999, 0.7, NULL, NULL, 50),
('magnit', 2000, 1.5, NULL, NULL, 160),
('magnit', 2001, 2.5, NULL, NULL, 300),
('magnit', 2002, 8.5, NULL, NULL, 450),
('magnit', 2003, 13.5, 15, 3.4, 610),
('magnit', 2004, 24.5, 15, 1.8, 1019),
('magnit', 2005, 44.6, 36.8, 2.3, 1500),
('magnit', 2006, 68.1, 56.9, 2.3, 1893),
('magnit', 2007, 93.3, 92, 2.6, 2300),
('magnit', 2008, 132.4, 140, 2.7, 2800),
('magnit', 2009, 169.9, 275, 5.1, 3400),
('magnit', 2010, 236.2, 340, 4.5, 4055),
('magnit', 2011, 335.7, 495, 4.5, 5500),
('magnit', 2012, 448.5, 630, 4.5, 6884),
('magnit', 2013, 579.7, 1050, 5.0, 8093),
('magnit', 2014, 764.0, 1080, 4.5, 9711),
('magnit', 2015, 951.0, 1120, 4.0, 12089),
('magnit', 2016, 1075.0, 905, 5.06, 14059),
('magnit', 2017, 1143.0, 612, 3.1, 16350),
('magnit', 2018, 1237.0, 521, 2.7, 18399),
('magnit', 2019, 1369.0, 265, 1.2, 20725),
('magnit', 2020, 1554.0, 590, 2.4, 21564),
('magnit', 2021, 1856.0, 720, 2.8, 26077),
('magnit', 2022, 2352.0, 455, 1.4, 27405),
('magnit', 2023, 2545.0, 730, 2.6, 29165),
('magnit', 2024, 3043.4, 555, 1.6, 31483),
('magnit', 2025, 3350.0, NULL, NULL, 32600);

-- Финансовые данные Пятёрочки (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('pyaterochka', 1999, 0.5, NULL, NULL, 16),
('pyaterochka', 2000, 2.1, NULL, NULL, 38),
('pyaterochka', 2001, 6.2, NULL, NULL, 81),
('pyaterochka', 2002, 15.7, NULL, NULL, 142),
('pyaterochka', 2003, 23.3, 1.09, 4.7, 189),
('pyaterochka', 2004, 31.9, 1.52, 4.8, 235),
('pyaterochka', 2005, 38.4, NULL, NULL, 347),
('pyaterochka', 2006, 53.6, NULL, NULL, 451),
('pyaterochka', 2007, 75.3, NULL, NULL, 674),
('pyaterochka', 2008, 111.0, NULL, NULL, 848),
('pyaterochka', 2009, 148.4, NULL, NULL, 1039),
('pyaterochka', 2010, 194.8, NULL, NULL, 2052),
('pyaterochka', 2011, 282.8, NULL, NULL, 2525),
('pyaterochka', 2012, 317.8, NULL, NULL, 3220),
('pyaterochka', 2013, 348.4, NULL, NULL, 3882),
('pyaterochka', 2014, 435.8, NULL, NULL, 4789),
('pyaterochka', 2015, 585.4, NULL, NULL, 6265),
('pyaterochka', 2016, 775.6, NULL, NULL, 8363),
('pyaterochka', 2017, 1001.0, NULL, NULL, 11225),
('pyaterochka', 2018, 1198.0, NULL, NULL, 13522),
('pyaterochka', 2019, 1367.0, NULL, NULL, 15354),
('pyaterochka', 2020, 1597.0, NULL, NULL, 16709),
('pyaterochka', 2021, 1793.0, NULL, NULL, 17972),
('pyaterochka', 2022, 2122.0, NULL, NULL, 19164),
('pyaterochka', 2023, 2364.0, NULL, NULL, 20152),
('pyaterochka', 2024, 2697.0, NULL, NULL, 21234),
('pyaterochka', 2025, 2980.0, NULL, NULL, 22000);

-- Финансовые данные X5 Group (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('x5', 2006, 79.5, 2.4, 3.0, 451),
('x5', 2007, 151.2, 4.1, 2.7, 674),
('x5', 2008, 236.0, 3.2, 1.3, 1101),
('x5', 2009, 248.0, 4.7, 1.9, 1372),
('x5', 2010, 320.3, 7.7, 2.4, 2469),
('x5', 2011, 454.2, NULL, NULL, 3000),
('x5', 2012, 491.1, NULL, 1.6, 3800),
('x5', 2013, 534.6, NULL, NULL, 4500),
('x5', 2014, 633.9, 12.7, 2.0, 5400),
('x5', 2015, 808.8, 14.2, 1.8, 7000),
('x5', 2016, 1033.7, 22.3, 2.2, 9187),
('x5', 2017, 1295.0, 31.4, 2.4, 12500),
('x5', 2018, 1532.5, 29.0, 1.9, 14800),
('x5', 2019, 1734.0, 26.0, 1.5, 16900),
('x5', 2020, 1978.0, 39.0, 2.0, 17707),
('x5', 2021, 2300.0, NULL, NULL, 19500),
('x5', 2022, 2500.0, NULL, NULL, 20500),
('x5', 2023, 3138.0, NULL, NULL, 24655),
('x5', 2024, 3647.0, NULL, NULL, 27265),
('x5', 2025, 4100.0, NULL, NULL, 29000);

-- Финансовые данные Ленты (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('lenta', 1993, 0.03, NULL, NULL, 1),
('lenta', 1999, 0.40, NULL, NULL, 1),
('lenta', 2000, 0.70, NULL, NULL, 2),
('lenta', 2001, 1.20, NULL, NULL, 3),
('lenta', 2002, 2.00, NULL, NULL, 5),
('lenta', 2003, 4.00, NULL, NULL, 7),
('lenta', 2004, 8.00, NULL, NULL, 9),
('lenta', 2005, 17.6, NULL, NULL, 12),
('lenta', 2006, 24.6, NULL, NULL, 14),
('lenta', 2007, 32.9, NULL, NULL, 26),
('lenta', 2008, 50.8, NULL, NULL, 34),
('lenta', 2009, 55.6, NULL, NULL, 36),
('lenta', 2010, 70.6, NULL, NULL, 39),
('lenta', 2011, 98.4, 3.8, 3.9, 42),
('lenta', 2012, 109.9, 5.2, 4.7, 56),
('lenta', 2013, 144.3, 7.1, 4.9, 87),
('lenta', 2014, 194.0, 9.1, 4.7, 132),
('lenta', 2015, 252.8, 10.3, 4.1, 172),
('lenta', 2016, 306.4, 11.2, 3.7, 240),
('lenta', 2017, 365.2, 13.3, 3.6, 328),
('lenta', 2018, 413.6, 11.7, 2.9, 379),
('lenta', 2019, 417.5, -1.0, -0.2, 380),
('lenta', 2020, 445.5, 17.4, 3.9, 393),
('lenta', 2021, 483.6, 13.6, 2.8, 757),
('lenta', 2022, 537.4, 4.9, 0.9, 820),
('lenta', 2023, 616.0, -1.8, -0.3, 2819),
('lenta', 2024, 888.3, 22.5, 2.5, 3300),
('lenta', 2025, 1110.0, 27.0, 2.7, 4000);

-- Финансовые данные О'КЕЙ (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('okey', 2001, 0.0, NULL, NULL, 0),
('okey', 2002, 1.2, NULL, NULL, 1),
('okey', 2003, 3.6, NULL, NULL, 4),
('okey', 2004, 6.6, NULL, NULL, 7),
('okey', 2005, 9.3, NULL, NULL, 10),
('okey', 2006, 16.5, NULL, NULL, 11),
('okey', 2007, 29.0, NULL, NULL, 15),
('okey', 2008, 40.0, NULL, NULL, 25),
('okey', 2009, 52.0, 0.7, 8.7, 35),
('okey', 2010, 82.7, 3.0, 8.6, 57),
('okey', 2011, 102.0, 3.2, 8.0, 70),
('okey', 2012, 120.0, 4.7, 8.1, 80),
('okey', 2013, 135.0, 5.0, 7.9, 95),
('okey', 2014, 150.0, 5.2, 7.4, 100),
('okey', 2015, 165.0, 2.7, 6.6, 110),
('okey', 2016, 177.0, -0.1, 5.3, 128),
('okey', 2017, 175.0, 3.2, 5.2, 145),
('okey', 2018, 166.0, -0.6, 5.4, 164),
('okey', 2019, 174.0, 0.8, 8.5, 180),
('okey', 2020, 174.3, -1.8, 8.5, 195),
('okey', 2021, 187.1, 0.21, 8.3, 230),
('okey', 2022, 202.2, 0.24, 8.4, 273),
('okey', 2023, 207.9, -2.9, 8.2, 297),
('okey', 2024, 219.4, 2.0, 9.3, 300),
('okey', 2025, 230.0, 0.5, 9.0, 227);

-- Финансовые данные ДИКСИ (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('dixy', 1999, 0.3, NULL, NULL, 1),
('dixy', 2000, 1.0, NULL, NULL, 5),
('dixy', 2001, 3.0, NULL, NULL, 15),
('dixy', 2002, 6.0, NULL, NULL, 40),
('dixy', 2003, 10.0, NULL, NULL, 80),
('dixy', 2004, 15.0, NULL, NULL, 130),
('dixy', 2005, 20.0, NULL, NULL, 200),
('dixy', 2006, 26.5, NULL, NULL, 260),
('dixy', 2007, 36.6, NULL, NULL, 330),
('dixy', 2008, 48.2, NULL, NULL, 430),
('dixy', 2009, 54.2, NULL, NULL, 550),
('dixy', 2010, 63.8, NULL, NULL, 646),
('dixy', 2011, 102.3, NULL, NULL, 1000),
('dixy', 2012, 147.0, NULL, NULL, 1350),
('dixy', 2013, 180.5, NULL, NULL, 1800),
('dixy', 2014, 215.0, NULL, NULL, 2195),
('dixy', 2015, 272.3, 0.59, 0.2, 2650),
('dixy', 2016, 311.2, 0.0, 0.0, 2802),
('dixy', 2017, 282.8, -6.0, -2.1, 2703),
('dixy', 2018, 299.0, 0.94, 0.3, 2707),
('dixy', 2019, 316.0, NULL, NULL, 2710),
('dixy', 2020, 298.8, NULL, NULL, 2651),
('dixy', 2021, 300.0, NULL, NULL, 2438),
('dixy', 2022, 293.0, NULL, NULL, 2350),
('dixy', 2023, 283.58, NULL, NULL, 2250),
('dixy', 2024, 280.0, NULL, NULL, 2363),
('dixy', 2025, 278.0, NULL, NULL, 2380);

-- Финансовые данные Копейки (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('kopeyka', 1998, 0.1, NULL, NULL, 1),
('kopeyka', 1999, 0.3, NULL, NULL, 5),
('kopeyka', 2000, 0.8, NULL, NULL, 15),
('kopeyka', 2001, 1.6, NULL, NULL, 25),
('kopeyka', 2002, 3.5, NULL, NULL, 23),
('kopeyka', 2003, 8.0, NULL, NULL, 45),
('kopeyka', 2004, 11.0, 0.456, 4.1, 80),
('kopeyka', 2005, 16.0, 0.261, 1.6, 140),
('kopeyka', 2006, 25.5, 0.5, 2.0, 300),
('kopeyka', 2007, 36.0, 1.4, 3.9, 438),
('kopeyka', 2008, 51.6, -1.64, -3.2, 502),
('kopeyka', 2009, 56.0, 1.63, 2.9, 525),
('kopeyka', 2010, 61.2, 2.0, 3.3, 660);

-- Финансовые данные Магнолии (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('magnolia', 1993, 0.01, NULL, NULL, 1),
('magnolia', 1999, 0.10, NULL, NULL, 10),
('magnolia', 2000, 0.15, NULL, NULL, 12),
('magnolia', 2001, 0.25, NULL, NULL, 20),
('magnolia', 2002, 0.40, NULL, NULL, 30),
('magnolia', 2003, 0.80, NULL, NULL, 40),
('magnolia', 2004, 1.50, NULL, NULL, 45),
('magnolia', 2005, 2.50, NULL, NULL, 50),
('magnolia', 2006, 3.50, 0.006, 6.5, 58),
('magnolia', 2007, 5.63, 0.005, 6.1, 100),
('magnolia', 2008, 8.86, NULL, 6.3, 115),
('magnolia', 2009, 8.96, NULL, 6.2, 125),
('magnolia', 2010, 10.5, NULL, 6.5, 135),
('magnolia', 2011, 11.0, NULL, 6.5, 145),
('magnolia', 2012, 14.8, NULL, 6.5, 155),
('magnolia', 2013, 18.0, 0.127, 0.7, 165),
('magnolia', 2014, 20.0, NULL, NULL, 170),
('magnolia', 2015, 22.6, NULL, NULL, 175),
('magnolia', 2016, 23.0, NULL, NULL, 180),
('magnolia', 2017, 21.5, NULL, NULL, 190),
('magnolia', 2018, 21.2, NULL, NULL, 195),
('magnolia', 2019, 21.0, NULL, NULL, 200),
('magnolia', 2020, 20.0, NULL, NULL, 205),
('magnolia', 2021, 22.0, 0.194, 0.9, 210),
('magnolia', 2022, 24.0, NULL, NULL, 215),
('magnolia', 2023, 25.9, 0.303, 1.17, 220),
('magnolia', 2024, 26.5, 0.742, 2.5, 225),
('magnolia', 2025, 27.0, NULL, NULL, 225);

-- Финансовые данные Перекрёстка (годовые)
INSERT INTO `financials` (`company_id`, `year`, `revenue`, `profit`, `margin`, `store_count`) VALUES
('perekrestok', 1994, 0.15, NULL, NULL, 0),
('perekrestok', 1995, 0.3, NULL, NULL, 1),
('perekrestok', 1996, 0.5, NULL, NULL, 2),
('perekrestok', 1997, 0.8, NULL, NULL, 4),
('perekrestok', 1998, 0.6, NULL, NULL, 5),
('perekrestok', 1999, 1.0, NULL, NULL, 7),
('perekrestok', 2000, 1.5, NULL, NULL, 10),
('perekrestok', 2001, 2.2, NULL, NULL, 15),
('perekrestok', 2002, 3.0, NULL, NULL, 25),
('perekrestok', 2003, 4.2, NULL, NULL, 40),
('perekrestok', 2004, 6.0, NULL, NULL, 60),
('perekrestok', 2005, 8.0, NULL, NULL, 90),
('perekrestok', 2006, 11.0, NULL, NULL, 110),
('perekrestok', 2007, 14.0, NULL, NULL, 150),
('perekrestok', 2008, 18.0, NULL, NULL, 200),
('perekrestok', 2009, 21.0, NULL, NULL, 240),
('perekrestok', 2010, 83.1, NULL, NULL, 301),
('perekrestok', 2011, 99.8, NULL, NULL, 330),
('perekrestok', 2012, 105.5, NULL, NULL, 370),
('perekrestok', 2013, 110.7, NULL, NULL, 390),
('perekrestok', 2014, 115.6, NULL, NULL, 403),
('perekrestok', 2015, 130.1, NULL, NULL, 478),
('perekrestok', 2016, 155.4, NULL, NULL, 539),
('perekrestok', 2017, 186.9, NULL, NULL, 638),
('perekrestok', 2018, 230.8, NULL, NULL, 760),
('perekrestok', 2019, 273.0, NULL, NULL, 852),
('perekrestok', 2020, 321.0, NULL, NULL, 933),
('perekrestok', 2021, 349.0, NULL, NULL, 990),
('perekrestok', 2022, 385.0, NULL, NULL, 971),
('perekrestok', 2023, 418.9, NULL, NULL, 972),
('perekrestok', 2024, 491.0, NULL, NULL, 986),
('perekrestok', 2025, 560.0, NULL, NULL, 1000);

-- =====================================================
-- ТАБЛИЦА: ipo (IPO и SPO)
-- =====================================================
CREATE TABLE IF NOT EXISTS `ipo` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_id` VARCHAR(50) NOT NULL,
  `type` ENUM('ipo', 'spo') DEFAULT 'ipo',
  `date` DATE NOT NULL,
  `valuation` VARCHAR(100),
  `raised` VARCHAR(100),
  `revenue` VARCHAR(100),
  `shares` TEXT,
  `exchange` VARCHAR(100),
  `ticker` VARCHAR(50),
  `price` VARCHAR(100),
  `prospectus` TEXT,
  `market_position` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Очистка таблицы IPO
TRUNCATE TABLE `ipo`;

-- IPO данные
INSERT INTO `ipo` (`company_id`, `type`, `date`, `valuation`, `raised`, `revenue`, `shares`, `exchange`, `ticker`, `price`, `market_position`) VALUES
-- Магнит
('magnit', 'ipo', '2006-04-28', '~$1,9–2,0 млрд', '$368,4 млн', '$2,505 млрд (2006)', '18,94% уставного капитала', 'РТС/ММВБ', 'MGNT', '$27 за акцию', 'К моменту IPO 2006 года «Магнит» являлся крупнейшей сетью дискаунтеров в России по количеству магазинов (1 893 точки на конец года).'),
('magnit', 'spo', '2008-04-22', '-', '~$480,3 млн', '$5,348 млрд (2008)', '11 245 660 акций; free float достиг ~35,5%', 'LSE (GDR) + РТС/ММВБ', 'MGNT', '$42,50 за акцию', 'Размещение GDR на Лондонской бирже весной 2008 года стало ключевым событием интернационализации «Магнита».'),
('magnit', 'spo', '2009-09-02', '-', '~$369,2 млн', '-', '5 729 413 акций; free float достиг 46,51%', 'LSE (GDR) + РТС/ММВБ', 'MGNT', '$65 за акцию', 'Деньги от SPO-2009 направлялись на CAPEX: расширение сети гипермаркетов и магазинов «у дома».'),
-- Пятёрочка / X5
('pyaterochka', 'ipo', '2005-05-06', '~$1,9–2,0 млрд', '$598 млн', '$1,1 млрд за 2004 год', '~30–32% капитала', 'London Stock Exchange (LSE)', 'PJPq', '$13 за GDR', 'На момент IPO Pyaterochka была крупнейшей по выручке сетью дискаунтеров в России.'),
('pyaterochka', 'spo', '2008-05-01', '-', '~$1,16 млрд', '$5,3 млрд за 2007 год', '48 106 700 новых GDR', 'London Stock Exchange (LSE)', 'FIVE', '-', 'В 2008 году X5 Retail Group провела крупное SPO в формате rights issue на Лондонской бирже.'),
('pyaterochka', 'spo', '2018-02-01', '-', '$0 (листинг существующих GDR)', '1,295 трлн ₽ за 2017 год', 'Существующие GDR', 'Moscow Exchange (MOEX) + LSE', 'FIVE', '-', '29 января 2018 года Московская биржа одобрила листинг GDR X5.'),
-- Лента
('lenta', 'ipo', '2014-02-28', '~$4,3 млрд', '~$952 млн', '~$4,4 млрд (144,3 млрд ₽ за 2013 год)', '~22,1% компании', 'LSE / Московская биржа', 'LNTA', '$10 за GDR', 'К моменту IPO в 2014 году «Лента» была вторым по величине оператором гипермаркетов в России.'),
('lenta', 'spo', '2015-03-23', '-', '$225 млн', '194,0 млрд ₽ за 2014 год', '35,2 млн новых GDR', 'LSE / Московская биржа', 'LNTA', '$6,40 за GDR', 'В 2015 году «Лента» проводила дополнительное размещение новых GDR.'),
-- О'КЕЙ
('okey', 'ipo', '2010-11-02', '~$3 млрд', '$420 млн', '82,7 млрд ₽ (2010)', '~14,2% компании', 'LSE (GDR)', 'OKEY', '$11 за GDR', 'К моменту IPO O''KEY являлся одним из ведущих российских ритейлеров с фокусом на гипермаркеты.'),
-- ДИКСИ
('dixy', 'ipo', '2007-05-01', '$864 млн', '$360 млн', '~$1,0 млрд в 2006 году', '24 999 999 акций, free float 41,67%', 'РТС / ММВБ', 'DIXY', '$14,4 за акцию', 'Один из крупнейших российских продовольственных дискаунтеров.');

-- =====================================================
-- ТАБЛИЦА: ma_events (M&A события)
-- =====================================================
CREATE TABLE IF NOT EXISTS `ma_events` (
  `id` VARCHAR(100) PRIMARY KEY,
  `date` DATE NOT NULL,
  `buyer` VARCHAR(255) NOT NULL,
  `target` VARCHAR(255) NOT NULL,
  `value` VARCHAR(100),
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Очистка таблицы M&A
TRUNCATE TABLE `ma_events`;

-- M&A данные
INSERT INTO `ma_events` (`id`, `date`, `buyer`, `target`, `value`, `description`) VALUES
-- Магнит
('magnit-2018-sia', '2018-06-01', 'Магнит', 'SIA (фарм-дистрибутор)', '-', 'Магнит договаривается о приобретении фарм-дистрибутора SIA для развития направления «Аптека/Косметик».'),
('magnit-2021-dixy', '2021-07-15', 'Магнит', 'DIXY', '87,6-92,4 млрд руб', 'Крупнейшая сделка Магнита: покупка сети DIXY за ~90 млрд руб. В периметр вошло 2 477 магазинов.'),
('magnit-2023-kazanexpress', '2023-10-01', 'Магнит', 'KazanExpress', '-', 'Приобретение маркетплейса KazanExpress, который станет основой Magnit Market.'),
('magnit-2023-samberi', '2023-11-01', 'Магнит', 'Samberi (33,01% + опцион)', '-', 'Согласование ФАС покупки 33,01% акций дальневосточной сети Samberi с опционом на 100%.'),
('magnit-2025-azbuka-vkusa', '2025-01-15', 'Магнит', 'Azbuka Vkusa', '-', 'Покупка контрольного пакета (81,55%) премиальной сети Azbuka Vkusa.'),
-- ДИКСИ
('dixy-ma-victoria-2011', '2011-06-01', 'ДИКСИ', 'Группа «Виктория»', '~$1 млрд', 'Покупка группы «Виктория» (225 магазинов). ДИКСИ становится мультиформатным холдингом.'),
('dixy-ma-mercury-2019', '2019-06-01', 'Mercury Retail Group', 'ДИКСИ + Бристоль + Красное & Белое', '-', 'Объединение «ДИКСИ», «Бристоля» и «Красного & Белого» в Mercury Retail Group.'),
('dixy-ma-magnit-2021', '2021-07-01', 'Магнит', 'ДИКСИ', '92,4 млрд руб.', 'Магнит покупает сеть «ДИКСИ» (2651 магазин) у Mercury Retail Group.'),
-- Магнолия
('magnolia-bin-2001', '2001-01-01', 'ПФК «БИН»', '6 супермаркетов «Магнолия»', '$10–12 млн', 'Группа «БИН» приобретает сеть из 6 супермаркетов «Магнолия».'),
-- X5 / Копейка
('x5-kopeyka-2010', '2010-12-01', 'X5 Retail Group', 'Копейка', '$1,65 млрд', 'X5 Retail Group покупает сеть «Копейка» (~660 магазинов).'),
-- Лента
('lenta-billa-2021', '2021-03-01', 'Лента', 'Billa Россия', '-', 'Покупка сети супермаркетов Billa Россия у REWE Group.'),
('lenta-utkonos-2021', '2021-09-01', 'Лента', 'Утконос Онлайн', '-', 'Приобретение онлайн-ритейлера «Утконос».'),
('lenta-monetka-2023', '2023-03-01', 'Лента', 'Монетка', '-', 'Покупка сети дискаунтеров «Монетка» (~2000 магазинов).'),
('lenta-ulybka-radugi-2024', '2024-06-01', 'Лента', 'Улыбка радуги', '-', 'Приобретение сети дрогери «Улыбка радуги».'),
('lenta-molniya-2025', '2025-01-01', 'Лента', 'Молния–Spar', '-', 'Покупка уральской сети «Молния–Spar».');

-- =====================================================
-- ИНДЕКСЫ для оптимизации запросов (опционально, можно пропустить при ошибках)
-- =====================================================
-- Примечание: индексы создаются автоматически для PRIMARY KEY и FOREIGN KEY
-- Дополнительные индексы можно добавить вручную через PhpMyAdmin если нужно

-- =====================================================
-- ПРОВЕРКА ИМПОРТА
-- =====================================================
SELECT 'companies' as `table`, COUNT(*) as `count` FROM companies
UNION ALL
SELECT 'founders', COUNT(*) FROM founders
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'financials', COUNT(*) FROM financials
UNION ALL
SELECT 'ipo', COUNT(*) FROM ipo
UNION ALL
SELECT 'ma_events', COUNT(*) FROM ma_events;

-- Включаем проверку внешних ключей обратно
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- КОНЕЦ СКРИПТА ИМПОРТА
-- =====================================================
