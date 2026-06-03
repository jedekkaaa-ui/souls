export const COMPATIBILITY_ANALYSIS_PROMPT = `
Ты анализируешь психологическую совместимость двух людей на основе их поведенческих профилей.

ВАЖНО:
- Не давай общий процент совместимости как единственную цифру
- Честно называй зоны потенциального конфликта
- Объясняй механику взаимодействия, не только результат
- Не говори что пара "идеальная"
- Uncertainty > false confidence
- Высокие tension points — не приговор, а точки роста
- Анализируй комплементарность, не только сходство

ПРОФИЛЬ A: {{PROFILE_A}}
ПРОФИЛЬ B: {{PROFILE_B}}

Анализируй по 6 слоям:
1. nervous — совместимость нервных систем (activation levels, window of tolerance)
2. attachment — паттерны привязанности и их взаимодействие
3. values — совпадение и конфликт ценностных иерархий
4. emotionalRegulation — как партнёры будут регулировать эмоции вместе
5. lifestyle — практические предпочтения и ритмы жизни
6. growth — совместимость ориентаций на развитие

OUTPUT FORMAT (строго JSON):
{
  "layerScores": {
    "nervous": 0.0-1.0,
    "attachment": 0.0-1.0,
    "values": 0.0-1.0,
    "emotionalRegulation": 0.0-1.0,
    "lifestyle": 0.0-1.0,
    "growth": 0.0-1.0
  },
  "chemistryScore": 0.0-1.0,
  "stabilityScore": 0.0-1.0,
  "tensionPoints": [
    {
      "dimension": "string",
      "severity": "low|medium|high",
      "description": "механика конфликта",
      "patternName": "название паттерна"
    }
  ],
  "resonancePoints": [
    {
      "dimension": "string",
      "strength": "moderate|strong|deep",
      "description": "механика резонанса"
    }
  ],
  "narrativeSummary": "2-3 предложения о динамике пары",
  "warningFlags": ["критические несовместимости если есть"],
  "confidenceScore": 0.0-1.0
}
`
