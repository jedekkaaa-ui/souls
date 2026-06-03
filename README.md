# Souls — Deep Compatibility Platform

Психологическая AI-платформа для поиска глубокой человеческой совместимости. Не dating app на основе свайпов — система анализирует attachment style, эмоциональную регуляцию, жизненные ценности и коммуникационные паттерны.

Матчинг происходит через 6-слойный compatibility framework, а не через внешность или поверхностные интересы.

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Настроить переменные окружения
cp .env.example .env
# Заполни DATABASE_URL и NEXTAUTH_SECRET

# 3. Создать БД и схему
npm run db:push

# 4. Заполнить тестовыми данными
npm run db:seed

# 5. Запустить
npm run dev
```

Открой http://localhost:3000. Демо-логин: `demo@demo.com` / `demo123`

## Структура проекта

```
app/
  (auth)/          — login, register
  (onboarding)/    — 4-сессионный онбординг
  (app)/           — основное приложение (dashboard, matches, chat, insights)
  api/             — API routes

lib/
  ai/              — AI слой (интерфейсы, заглушки, промпты, сервис)
  matching/        — matching engine, scorer, conflict detector
  db/              — Prisma client singleton
  auth.ts          — NextAuth конфигурация

config/
  onboarding-content.ts  — весь контент онбординга с психологическими весами

components/
  onboarding/      — ScenarioCard, InsightReveal, ProgressBar
  matches/         — MatchCard, CompatibilityRadar, LayerBreakdown
  chat/            — MessageBubble, AISuggestion

prisma/
  schema.prisma    — схема БД
  seed.ts          — 20 тестовых пользователей + демо аккаунт
```

## AI слой и заглушки

Все AI функции реализованы как детерминированные заглушки. Подключение реального LLM требует изменения одной переменной:

```env
AI_USE_STUBS="false"
AI_API_KEY="your-key-here"
```

Подробнее: см. `docs/AI_INTEGRATION.md`
