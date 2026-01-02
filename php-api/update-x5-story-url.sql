-- Обновление записи компании X5 с добавлением ссылки на лендинг
-- Выполните этот SQL скрипт для добавления поля story_url к компании X5

-- Сначала добавим колонку (игнорируйте ошибку, если колонка уже существует)
-- Для MySQL версии 5.7+ можно использовать следующий подход:
SET @dbname = DATABASE();
SET @tablename = 'companies';
SET @columnname = 'story_url';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' VARCHAR(500) NULL')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Обновляем запись компании X5
UPDATE companies 
SET story_url = '/companies/x5' 
WHERE id = 'x5';

