FROM php:8.2-cli-bookworm

# Установка только необходимых PHP расширений (без gd - не используется)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Установка рабочей директории
WORKDIR /var/www/html

# Копирование файлов PHP API
COPY php-api/ /var/www/html/

# Настройка прав
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

EXPOSE 8000

# Запуск встроенного PHP сервера
CMD ["php", "-S", "0.0.0.0:8000"]

