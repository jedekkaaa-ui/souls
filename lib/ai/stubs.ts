import type {
  AIPersonalityInferenceInput,
  AIPersonalityInferenceOutput,
  AICompatibilityInput,
  AICompatibilityOutput,
  AIConversationInput,
  AIConversationOutput,
  AISafetyInput,
  AISafetyOutput,
} from './interfaces'

// TODO: Replace with real LLM call

async function simulateLatency(): Promise<void> {
  const ms = 800 + Math.random() * 700
  await new Promise((resolve) => setTimeout(resolve, ms))
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function seededFloat(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000
  return Math.abs(x - Math.floor(x))
}

function generateDeterministicVector(userId: string, dims: number): number[] {
  const seed = hashString(userId)
  const vec: number[] = []
  for (let i = 0; i < dims; i++) {
    vec.push(seededFloat(seed, i))
  }
  return vec
}

export async function inferPersonality(
  input: AIPersonalityInferenceInput
): Promise<AIPersonalityInferenceOutput> {
  console.log(`AI STUB: inferPersonality called for user ${input.userId}`)
  await simulateLatency()
  // TODO: Replace with real LLM call using PERSONALITY_INFERENCE_PROMPT
  const seed = hashString(input.userId)
  const s = (i: number) => seededFloat(seed, i)

  return {
    personalityVector: generateDeterministicVector(input.userId, 128),
    attachmentScores: {
      secure: 0.3 + s(1) * 0.4,
      anxious: s(2) * 0.35,
      avoidant: s(3) * 0.25,
      disorganized: s(4) * 0.1,
    },
    valuesMap: {
      autonomy: s(5),
      security: s(6),
      achievement: s(7),
      benevolence: s(8),
      conformity: s(9),
      tradition: s(10),
      power: s(11),
      stimulation: s(12),
      hedonism: s(13),
      universalism: s(14),
      selfDirection: s(15),
      spirit: s(16),
    },
    conflictStyle: {
      compete: s(17) * 0.3,
      avoid: s(18) * 0.4,
      accommodate: s(19) * 0.3,
      collaborate: 0.4 + s(20) * 0.4,
    },
    nervousSystem: {
      activation: s(21),
      deactivation: s(22),
      windowTolerance: 0.4 + s(23) * 0.4,
    },
    emotionalRegulation: {
      flooding: s(24) * 0.4,
      rumination: s(25) * 0.5,
      repair: 0.4 + s(26) * 0.4,
      suppression: s(27) * 0.4,
      expression: 0.3 + s(28) * 0.5,
    },
    growthOrientation: {
      fixed: s(29) * 0.4,
      oriented: 0.4 + s(30) * 0.5,
    },
    communication: {
      direct: 0.3 + s(31) * 0.5,
      indirect: s(32) * 0.4,
      assertive: 0.3 + s(33) * 0.4,
      passive: s(34) * 0.3,
    },
    confidenceScores: {
      attachment: 0.5 + s(35) * 0.4,
      values: 0.6 + s(36) * 0.3,
      conflict: 0.4 + s(37) * 0.4,
      nervous: 0.5 + s(38) * 0.4,
      emotion: 0.5 + s(39) * 0.4,
      growth: 0.6 + s(40) * 0.3,
      communication: 0.5 + s(41) * 0.4,
    },
    narrativeInsight:
      s(42) > 0.5
        ? 'Прослеживается тенденция к глубокой рефлексии и осознанности в отношениях. Важна автономия при сохранении близости.'
        : 'Заметна ориентация на стабильность и безопасность в связях. Ценность долгосрочного доверия выражена сильно.',
    uncertaintyFlags:
      input.onboardingResponses.length < 10
        ? ['attachment_style needs more data', 'conflict_style insufficient samples']
        : ['nervous_system baseline unclear'],
  }
}

export async function computeCompatibility(
  input: AICompatibilityInput
): Promise<AICompatibilityOutput> {
  console.log(
    `AI STUB: computeCompatibility called for ${input.profileA.userId} x ${input.profileB.userId}`
  )
  await simulateLatency()
  // TODO: Replace with real LLM call using COMPATIBILITY_ANALYSIS_PROMPT
  const seedA = hashString(input.profileA.userId)
  const seedB = hashString(input.profileB.userId)
  const combined = (seedA + seedB) % 100000
  const s = (i: number) => seededFloat(combined, i)

  const layerScores = {
    nervous: 0.4 + s(1) * 0.5,
    attachment: 0.3 + s(2) * 0.6,
    values: 0.4 + s(3) * 0.5,
    emotionalRegulation: 0.35 + s(4) * 0.5,
    lifestyle: 0.4 + s(5) * 0.5,
    growth: 0.45 + s(6) * 0.45,
  }

  const overallScore =
    Object.values(layerScores).reduce((a, b) => a + b, 0) / Object.keys(layerScores).length

  return {
    layerScores,
    overallScore,
    chemistryScore: 0.3 + s(7) * 0.6,
    stabilityScore: 0.4 + s(8) * 0.5,
    tensionPoints: [
      {
        dimension: 'attachment',
        severity: s(9) > 0.6 ? 'medium' : 'low',
        description:
          'Разные темпы сближения могут создавать периодическое напряжение. Один партнёр может воспринимать дистанцию как отвержение.',
        patternName: 'proximity-regulation mismatch',
      },
      {
        dimension: 'values',
        severity: s(10) > 0.7 ? 'medium' : 'low',
        description:
          'Различия в приоритизации стабильности vs новизны проявятся при планировании совместного будущего.',
        patternName: 'security-stimulation tension',
      },
    ],
    resonancePoints: [
      {
        dimension: 'growth',
        strength: s(11) > 0.5 ? 'strong' : 'moderate',
        description:
          'Схожая ориентация на развитие создаёт основу для совместного роста и взаимного вдохновения.',
      },
      {
        dimension: 'values',
        strength: s(12) > 0.6 ? 'deep' : 'moderate',
        description: 'Общий акцент на аутентичности и честности формирует доверие.',
      },
    ],
    narrativeSummary:
      'Эта пара имеет потенциал для глубокой связи при условии осознанной работы с различиями в темпе. Зоны резонанса в ценностях создают прочную основу.',
    warningFlags: s(13) > 0.85 ? ['significant attachment style mismatch detected'] : [],
    confidenceScore: 0.5 + s(14) * 0.4,
  }
}

export async function getConversationSuggestion(
  input: AIConversationInput
): Promise<AIConversationOutput> {
  console.log(`AI STUB: getConversationSuggestion called for match ${input.matchId}`)
  await simulateLatency()
  // TODO: Replace with real LLM call using CONVERSATION_ASSISTANT_PROMPT

  const suggestions: Record<string, AIConversationOutput> = {
    starter: {
      suggestion:
        'Расскажи о моменте, когда ты почувствовал(а) себя наиболее собой — не тем, кем нужно быть, а именно собой.',
      suggestionType: 'question',
      depthLevel: 2,
      reasoning: 'Открывает разговор через личный опыт, минуя светские темы',
    },
    deepen: {
      suggestion:
        'Ты упомянул(а) это вскользь — что для тебя важно в том, как ты справляешься с неопределённостью?',
      suggestionType: 'question',
      depthLevel: 2,
      reasoning: 'Углубляет уже начатую тему через уточняющий вопрос',
    },
    insight: {
      suggestion:
        'Я замечаю, что вы оба цените прямость, но выражаете это по-разному. Это интересный момент для исследования.',
      suggestionType: 'observation',
      depthLevel: 2,
      reasoning: 'Использует зону резонанса для рефлексивного наблюдения',
    },
    repair: {
      suggestion: 'Что тебя сейчас занимает больше всего — не обязательно здесь, вообще в жизни?',
      suggestionType: 'question',
      depthLevel: 1,
      reasoning: 'Деэскалация через нейтральный, но личный вопрос',
    },
  }

  return suggestions[input.requestType] ?? suggestions.starter
}

export async function moderateContent(input: AISafetyInput): Promise<AISafetyOutput> {
  console.log(`AI STUB: moderateContent called for user ${input.userId}`)
  await simulateLatency()
  // TODO: Replace with real LLM call using SAFETY_MODERATION_PROMPT

  return {
    isSafe: true,
    flags: [],
    distressSignals: false,
    requiresHumanReview: false,
  }
}
