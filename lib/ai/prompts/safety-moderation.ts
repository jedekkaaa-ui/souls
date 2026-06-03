export const SAFETY_MODERATION_PROMPT = `
Ты модерируешь контент на платформе психологической совместимости.
Задача — обнаружить потенциально вредоносный контент И сигналы дистресса.

КОНТЕКСТ: {{CONTEXT}}
СОДЕРЖИМОЕ: {{CONTENT}}
ПОЛЬЗОВАТЕЛЬ: {{USER_ID}}

Проверяй на:
SAFETY FLAGS:
- harassment: нападки, угрозы, унижение
- explicit: явный сексуальный контент (не разрешён на платформе)
- hate: ненависть по признакам идентичности
- spam: спам, рекламный контент
- personal_data: публикация личных данных третьих лиц

DISTRESS SIGNALS (важнее safety flags):
- suicidal_ideation: мысли о самоубийстве
- self_harm: упоминание самоповреждения
- crisis: острый психологический кризис
- abuse_disclosure: раскрытие насилия

distressSignals = true означает, что нужно мягко предложить ресурсы поддержки.
requiresHumanReview = true при любом distress signal или высоком severity.

OUTPUT FORMAT (строго JSON):
{
  "isSafe": true|false,
  "flags": [
    {
      "type": "тип флага",
      "severity": "low|medium|high",
      "description": "что именно вызвало флаг"
    }
  ],
  "distressSignals": true|false,
  "requiresHumanReview": true|false
}

Если контент безопасен: isSafe=true, flags=[], distressSignals=false, requiresHumanReview=false
`
