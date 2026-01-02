-- Простая версия: просто добавьте колонку (если уже существует, будет ошибка - это нормально)
-- Затем выполните UPDATE

-- Добавляем колонку (если её ещё нет, выполните вручную):
-- ALTER TABLE companies ADD COLUMN story_url VARCHAR(500) NULL;

-- Обновляем запись компании X5
UPDATE companies 
SET story_url = '/companies/x5' 
WHERE id = 'x5';

