# AI Integration Guide

Вся AI логика изолирована в `lib/ai/`. Подключение реального LLM требует изменений **только в одном месте**.

## Как подключить реальный LLM

### 1. Обновить `.env`

```env
AI_USE_STUBS="false"
AI_PROVIDER="anthropic"          # anthropic | openai
AI_MODEL="claude-opus-4-5"
AI_API_KEY="sk-..."
```

### 2. Обновить `lib/ai/index.ts`

Каждый метод `AIService` имеет ветку `if (this.useStubs)`. Заменить реализацию в ветке `else`:

```ts
async inferPersonality(input: AIPersonalityInferenceInput) {
  if (this.useStubs) return stubInferPersonality(input)
  
  // Anthropic implementation:
  const client = new Anthropic({ apiKey: process.env.AI_API_KEY })
  const prompt = PERSONALITY_INFERENCE_PROMPT.replace(
    '{{ONBOARDING_DATA}}',
    JSON.stringify(input)
  )
  const response = await client.messages.create({
    model: process.env.AI_MODEL ?? 'claude-opus-4-5',
    max_tokens: Number(process.env.AI_MAX_TOKENS ?? 2000),
    messages: [{ role: 'user', content: prompt }]
  })
  return JSON.parse(response.content[0].text) as AIPersonalityInferenceOutput
}
```

### Пример для OpenAI

```ts
const openai = new OpenAI({ apiKey: process.env.AI_API_KEY })
const completion = await openai.chat.completions.create({
  model: process.env.AI_MODEL ?? 'gpt-4o',
  messages: [{ role: 'user', content: prompt }],
  response_format: { type: 'json_object' },
})
return JSON.parse(completion.choices[0].message.content!) as AIPersonalityInferenceOutput
```

## Промпты

Все промпты находятся в `lib/ai/prompts/`:

| Файл | Функция |
|------|---------|
| `personality-inference.ts` | Анализ онбординг-ответов → personality vector |
| `compatibility-analysis.ts` | Сравнение двух профилей → 6-слойный score |
| `conversation-assistant.ts` | Генерация вопросов для глубокого разговора |
| `safety-moderation.ts` | Модерация контента + distress signals |

## Заглушки

Заглушки в `lib/ai/stubs.ts` возвращают детерминированные данные (через hash от userId), что позволяет тестировать UI без LLM.
