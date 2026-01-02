# Обновление базы данных для добавления ссылки на лендинг X5

## Шаги для обновления базы данных

### Вариант 1: Ручное выполнение (рекомендуется)

1. **Добавьте колонку `story_url` в таблицу `companies`**:
   ```sql
   ALTER TABLE companies ADD COLUMN story_url VARCHAR(500) NULL;
   ```

2. **Обновите запись компании X5**:
   ```sql
   UPDATE companies 
   SET story_url = '/companies/x5' 
   WHERE id = 'x5';
   ```

### Вариант 2: Автоматический скрипт

Выполните скрипт с проверкой существования колонки:
```bash
mysql -u retail_user -p retail_db < update-x5-story-url.sql
```

### Вариант 3: Простой скрипт (если колонка уже добавлена)

Если колонка уже существует, используйте упрощённый скрипт:
```bash
mysql -u retail_user -p retail_db < update-x5-story-url-simple.sql
```

**Примечание:** Если колонка `story_url` уже существует (например, после выполнения `install.php`), можно сразу выполнить только UPDATE:
```sql
UPDATE companies SET story_url = '/companies/x5' WHERE id = 'x5';
```

## Альтернативный способ через API

Если у вас настроен API, вы можете обновить запись через PUT запрос:

```bash
curl -X PUT "http://localhost:8000/companies.php?id=x5" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'admin:admin123' | base64)" \
  -d '{
    "name": "X5 Group",
    "color": "#00A650",
    "status": "active",
    "story_url": "/companies/x5"
  }'
```

## Проверка

После обновления проверьте, что поле добавлено:

```sql
SELECT id, name, story_url FROM companies WHERE id = 'x5';
```

Должно вернуть:
```
id: x5
name: X5 Group
story_url: /companies/x5
```

