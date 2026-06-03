# Matching Algorithm

## Как работает matching engine

`lib/matching/engine.ts` — `MatchingEngine.findMatches(userId)`:

1. **Vector search** — pgvector cosine similarity поиск топ-200 похожих профилей по 128-мерному personality vector
2. **Hard conflict filter** — `ConflictDetector` отфильтровывает полностью несовместимые пары
3. **AI compatibility scoring** — для топ-50 запускает `aiService.computeCompatibility()`
4. **Chemistry boost** — бонус для комплементарных паттернов (не только схожих)
5. **Uncertainty dampening** — снижает скор для неполных профилей
6. **Возврат топ-7** с полным breakdown

## 6 слоёв совместимости

| Слой | Вес | Что измеряет |
|------|-----|-------------|
| `attachment` | 25% | Паттерны привязанности и их взаимодействие |
| `nervous` | 20% | Совместимость нервных систем (activation levels) |
| `values` | 20% | Общие ценностные приоритеты |
| `emotionalRegulation` | 15% | Как партнёры регулируют эмоции вместе |
| `lifestyle` | 10% | Практические предпочтения и ритмы |
| `growth` | 10% | Ориентации на развитие |

Веса динамически корректируются: чем полнее профиль, тем точнее веса.

## Интерпретация compatibility scores

- **80–100** — Высокая совместимость. Сильные резонансные точки, минимальные tensions
- **60–79** — Хорошая совместимость. Есть зоны роста, но прочная основа
- **40–59** — Умеренная. Значительные различия требуют осознанной работы
- **< 40** — Низкая. Могут быть hard conflicts

## Conflict detection

`lib/matching/conflict-detector.ts`:

**Hard conflicts** (фильтруются полностью):
- Оба с extreme avoidant > 0.8 → mutual-avoidance deadlock
- Polar opposite values на критических dimensions (diff > 0.85)

**Soft conflicts** (передаются как tension points):
- Anxious + avoidant pattern → цикл тревога-дистанция
- Compete + accommodate asymmetry → дисбаланс власти
- Разные growth orientations → дивергентное развитие
- Nervous system mismatch → разные темпы жизни
