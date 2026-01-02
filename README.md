# Retail Compass Explorer

Дорожная карта российского ритейла — интерактивная карта развития крупнейших розничных сетей России.

## Технологии

Этот проект построен с использованием:

- **Next.js 14** (App Router)
- **TypeScript**
- **React 18**
- **shadcn-ui**
- **Tailwind CSS**
- **React Query** (TanStack Query)
- **Recharts** для графиков

## Установка и запуск

### Требования

- Node.js 18+ и npm (или yarn/pnpm)

### Шаги для запуска

```sh
# 1. Установите зависимости
npm install

# 2. (Опционально) Настройте API URL
# Создайте файл .env.local в корне проекта:
# NEXT_PUBLIC_API_URL=https://xn--e1aajmvn.xn--p1ai/api

# 3. Запустите dev сервер
npm run dev

# 4. Откройте браузер на http://localhost:3000
```

### Настройка API URL

Приложение подключается к API бэкенду. URL можно настроить несколькими способами:

1. **Через переменные окружения (рекомендуется)**:
   - Создайте файл `.env.local` в корне проекта
   - Добавьте строку: `NEXT_PUBLIC_API_URL=https://xn--e1aajmvn.xn--p1ai/api`
   - По умолчанию используется: `https://xn--e1aajmvn.xn--p1ai/api`

2. **Через код**:
   - Откройте `src/lib/api-config.ts`
   - Измените значение `DEFAULT_API_URL`

3. **Через админ-панель** (для клиентских запросов):
   - Войдите в админ-панель
   - Настройте URL API в интерфейсе (сохраняется в localStorage)

**Приоритет настройки:**
1. localStorage (настройка через админ-панель) - только для клиента
2. Переменная окружения `NEXT_PUBLIC_API_URL`
3. Значение по умолчанию из `api-config.ts`

### Сборка для продакшена

```sh
# Создать production build
npm run build

# Запустить production сервер
npm start
```

## Структура проекта

```
src/
├── app/              # Next.js App Router страницы
│   ├── layout.tsx    # Корневой layout
│   ├── page.tsx      # Главная страница
│   ├── admin/        # Админ-панель
│   └── not-found.tsx # 404 страница
├── components/       # React компоненты
│   ├── ui/          # shadcn-ui компоненты
│   ├── roadmap/     # Компоненты дорожной карты
│   └── admin/       # Компоненты админ-панели
├── hooks/           # React хуки
├── services/        # API сервисы
├── types/           # TypeScript типы
└── data/            # Статические данные (fallback)
```

## API

Приложение использует PHP API для получения данных. Настройте URL API в админ-панели (`/admin/login`).

## Развертывание

Проект готов к развертыванию на платформах, поддерживающих Next.js:

- **Vercel** (рекомендуется)
- **Netlify**
- **Railway**
- Любой хостинг с поддержкой Node.js

### Развертывание на Vercel

```sh
# Установите Vercel CLI
npm i -g vercel

# Разверните проект
vercel
```

## Миграция с Vite

Этот проект был мигрирован с Vite на Next.js. Основные изменения:

- React Router заменен на Next.js App Router
- `react-helmet-async` заменен на Next.js Metadata API
- Все страницы теперь используют `"use client"` директиву где необходимо
- Роутинг теперь основан на файловой структуре в `src/app/`

## Лицензия

MIT
