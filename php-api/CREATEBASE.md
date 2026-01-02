# 1. Создание базы MySql

-- Создайте базу данных
CREATE DATABASE retail_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создайте пользователя (опционально, можно использовать root)
CREATE USER 'retail_user'@'localhost' IDENTIFIED BY 'your_password';

-- Дайте права пользователю
GRANT ALL PRIVILEGES ON retail_db.* TO 'retail_user'@'localhost';
FLUSH PRIVILEGES;

-- Выйдите
EXIT;

# 2. Указываешь config.php

define('DB_HOST', 'localhost');
define('DB_NAME', 'retail_db');
define('DB_USER', 'retail_user');
define('DB_PASS', 'your_password');

# 3. Далее

переходишь по адресу: http://localhost:8000/install.php

дамп данных в консоли директория /php-api
mysql -u retail_user -p retail_db < ./full-data-import.sql

# 4. Запуск фронта

Создаешь .env.local и в него
NEXT_PUBLIC_API_URL=http://localhost:8000

npm i
npm run dev