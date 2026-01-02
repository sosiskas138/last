# Деплой проекта через Docker

## Быстрый старт

1. Создайте файл `.env` в корне проекта:
```bash
cat > .env << EOF
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_PASSWORD=your_mysql_password
ADMIN_USER=admin
ADMIN_PASS=your_admin_password
SITE_URL=http://yourdomain.com
EOF
```

2. Запустите проект:
```bash
docker compose up -d
```

3. Дождитесь запуска MySQL (около 30 секунд) и инициализируйте базу данных:
```bash
docker compose exec php-api php install.php
```

## Подробная инструкция

### Подготовка

1. Убедитесь, что Docker и Docker Compose установлены на сервере:
```bash
docker --version
docker compose version
```

2. Создайте файл `.env` в корне проекта с необходимыми переменными:
- `MYSQL_ROOT_PASSWORD` - пароль root для MySQL
- `MYSQL_PASSWORD` - пароль для пользователя retail_user
- `ADMIN_USER` - логин администратора (по умолчанию: admin)
- `ADMIN_PASS` - пароль администратора
- `SITE_URL` - URL вашего сайта (например: https://yourdomain.com)

### Запуск проекта

1. Соберите и запустите контейнеры:
```bash
docker compose build
docker compose up -d
```

2. Дождитесь готовности MySQL (около 30 секунд), затем инициализируйте базу данных:
```bash
# Создание таблиц
docker compose exec php-api php install.php

# Импорт данных (опционально)
docker compose exec -T mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} retail_db < php-api/full-data-import.sql
```

### Проверка работы

1. Проверьте статус контейнеров:
```bash
docker compose ps
```

2. Проверьте логи:
```bash
# Все логи
docker compose logs -f

# Логи конкретного сервиса
docker compose logs -f nextjs
docker compose logs -f php-api
docker compose logs -f mysql
```

3. Откройте в браузере:
- Без Nginx: `http://your-server-ip:3000`
- С Nginx: `http://your-server-ip` или `http://yourdomain.com`

### Настройка домена

1. Настройте DNS A-запись, указывающую на IP вашего сервера

2. Обновите `nginx.conf`, заменив `_` на ваш домен:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

3. Перезапустите Nginx:
```bash
docker compose restart nginx
```

### Настройка SSL (HTTPS)

#### Вариант 1: Certbot в контейнере (рекомендуется)

Добавьте в `docker-compose.yml`:
```yaml
certbot:
  image: certbot/certbot
  volumes:
    - ./nginx/ssl:/etc/letsencrypt
  command: certonly --standalone --email your@email.com --agree-tos --no-eff-email -d yourdomain.com -d www.yourdomain.com
```

#### Вариант 2: Вручную

1. Установите сертификаты в `nginx/ssl/`
2. Раскомментируйте HTTPS секцию в `nginx.conf`
3. Обновите пути к сертификатам
4. Перезапустите Nginx

## Полезные команды

```bash
# Остановка контейнеров
docker compose down

# Остановка с удалением volumes (⚠️ удалит данные БД)
docker compose down -v

# Перезапуск сервисов
docker compose restart

# Перезапуск конкретного сервиса
docker compose restart nextjs

# Просмотр логов
docker compose logs -f [service_name]

# Выполнение команд в контейнере
docker compose exec php-api php install.php
docker compose exec mysql mysql -uroot -p retail_db

# Обновление после изменений в коде
docker compose build
docker compose up -d
```

## Обновление проекта

```bash
# Остановить контейнеры
docker compose down

# Получить последние изменения из Git
git pull

# Пересобрать и запустить
docker compose build
docker compose up -d
```

## Резервное копирование базы данных

```bash
# Экспорт
docker compose exec mysql mysqldump -uroot -p${MYSQL_ROOT_PASSWORD} retail_db > backup_$(date +%Y%m%d).sql

# Импорт
docker compose exec -T mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} retail_db < backup_20250102.sql
```

## Решение проблем

### Контейнеры не запускаются
```bash
# Проверьте логи
docker compose logs

# Проверьте статус
docker compose ps
```

### Ошибка подключения к БД
- Убедитесь, что MySQL контейнер запущен и здоров
- Проверьте переменные окружения в `.env`
- Проверьте логи: `docker compose logs mysql`

### Next.js не подключается к API
- Проверьте переменную `NEXT_PUBLIC_API_URL` в `docker-compose.yml` (должна быть `/api` для работы через Nginx)
- Убедитесь, что PHP API контейнер запущен
- Проверьте сеть Docker: `docker network ls`
- Проверьте логи: `docker compose logs php-api`

### Проблемы с правами доступа
```bash
# Исправьте права для PHP
docker compose exec php-api chown -R www-data:www-data /var/www/html
```

## Структура сервисов

- **mysql**: База данных MySQL 8.0
- **php-api**: PHP API бэкенд (встроенный PHP сервер на порту 8000)
- **nextjs**: Next.js фронтенд (порт 3000)
- **nginx**: Nginx веб-сервер (порты 80/443) - проксирует запросы к Next.js и PHP API

## Примечания

- По умолчанию Nginx запущен, но можно отключить, если используете только Next.js на порту 3000
- PHP API доступен через `/api/*` путь в Nginx
- Переменные окружения читаются из `.env` файла
- Данные MySQL хранятся в Docker volume `mysql_data`
