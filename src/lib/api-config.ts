/**
 * API Configuration
 * 
 * Настройка URL для API бэкенда.
 * 
 * Приоритет настройки:
 * 1. Переменная окружения NEXT_PUBLIC_API_URL (для клиента и сервера)
 * 2. Переменная окружения API_URL (только для сервера)
 * 3. Значение по умолчанию из этого файла
 * 
 * Для изменения URL создайте файл .env.local в корне проекта:
 * NEXT_PUBLIC_API_URL=https://xn--e1aajmvn.xn--p1ai/api
 */

// URL API по умолчанию
export const DEFAULT_API_URL = 'https://xn--e1aajmvn.xn--p1ai/api';

/**
 * Получить URL API для серверных компонентов
 */
export function getServerApiUrl(): string {
  // Приоритет: NEXT_PUBLIC_API_URL > API_URL > DEFAULT_API_URL
  const apiUrl = 
    process.env.NEXT_PUBLIC_API_URL || 
    process.env.API_URL || 
    DEFAULT_API_URL;
  
  return normalizeUrl(apiUrl);
}

/**
 * Получить URL API для клиентских компонентов
 */
export function getClientApiUrl(): string {
  // В браузере используем переменную окружения или значение по умолчанию
  if (typeof window !== 'undefined') {
    // Проверяем localStorage для пользовательской настройки (для админки)
    const storedUrl = localStorage.getItem('api_url');
    if (storedUrl) {
      return normalizeUrl(storedUrl);
    }
    
    // Используем переменную окружения или значение по умолчанию
    const envUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
    return normalizeUrl(envUrl);
  }
  
  // На сервере используем серверную функцию
  return getServerApiUrl();
}

/**
 * Нормализовать URL (убрать trailing slash)
 */
function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/**
 * Получить публичный URL API (для неавторизованных запросов)
 * Использует текущий origin, если не задан явный URL
 */
export function getPublicApiUrl(): string {
  if (typeof window !== 'undefined') {
    // В браузере используем текущий origin
    return `${window.location.origin}/api`;
  }
  
  // На сервере используем переменную окружения или значение по умолчанию
  return getServerApiUrl();
}

