/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Для Docker
  // Отключаем проверку типов во время сборки для ускорения Docker сборки
  // Типы все равно проверяются в IDE и при dev запуске
  typescript: {
    ignoreBuildErrors: true, // Ускоряет сборку, ошибки типов будут видны в dev режиме
  },
  // Отключаем ESLint во время сборки для ускорения
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [],
  },
  // Support for @ alias
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
};

module.exports = nextConfig;


