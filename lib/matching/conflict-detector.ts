import type { PersonalityProfile, TensionPoint } from '@/types'

export interface ConflictResult {
  hasHardConflict: boolean
  conflicts: ConflictData[]
}

export interface ConflictData {
  type: 'hard' | 'soft'
  dimension: string
  description: string
  patternName: string
  severity: 'low' | 'medium' | 'high'
}

export class ConflictDetector {
  detect(profileA: PersonalityProfile, profileB: PersonalityProfile): ConflictResult {
    const conflicts: ConflictData[] = []
    let hasHardConflict = false

    // Hard conflict: both extreme avoidant
    if (profileA.attachmentScores.avoidant > 0.8 && profileB.attachmentScores.avoidant > 0.8) {
      hasHardConflict = true
      conflicts.push({
        type: 'hard',
        dimension: 'attachment',
        description: 'Оба партнёра имеют выраженную избегающую привязанность. Близость будет системно блокироваться с обеих сторон.',
        patternName: 'mutual-avoidance deadlock',
        severity: 'high',
      })
    }

    // Hard conflict: polar opposite values on critical dimensions
    const criticalValues: Array<keyof PersonalityProfile['valuesMap']> = [
      'autonomy', 'security', 'benevolence', 'universalism',
    ]
    for (const dim of criticalValues) {
      const diff = Math.abs(profileA.valuesMap[dim] - profileB.valuesMap[dim])
      if (diff > 0.85) {
        hasHardConflict = true
        conflicts.push({
          type: 'hard',
          dimension: `values.${dim}`,
          description: `Противоположные позиции по ценности "${dim}" создают фундаментальный конфликт мировоззрений.`,
          patternName: 'values-polarity',
          severity: 'high',
        })
      }
    }

    // Soft conflict: anxious + avoidant
    const isAnxiousAvoidant =
      (profileA.attachmentScores.anxious > 0.5 && profileB.attachmentScores.avoidant > 0.5) ||
      (profileB.attachmentScores.anxious > 0.5 && profileA.attachmentScores.avoidant > 0.5)

    if (isAnxiousAvoidant) {
      conflicts.push({
        type: 'soft',
        dimension: 'attachment',
        description: 'Классический тревожно-избегающий паттерн. Один ищет близости, другой отступает — цикл может стать изматывающим.',
        patternName: 'anxious-avoidant dynamic',
        severity: 'medium',
      })
    }

    // Soft conflict: opposite conflict styles
    const competeDiff = Math.abs(profileA.conflictStyle.compete - profileB.conflictStyle.compete)
    const accommodateDiff = Math.abs(
      profileA.conflictStyle.accommodate - profileB.conflictStyle.accommodate
    )
    if (competeDiff > 0.5 && accommodateDiff > 0.5) {
      conflicts.push({
        type: 'soft',
        dimension: 'conflict',
        description: 'Один партнёр склонен конкурировать в конфликте, другой — уступать. Это создаёт дисбаланс власти.',
        patternName: 'compete-accommodate asymmetry',
        severity: 'medium',
      })
    }

    // Soft conflict: different growth orientations
    const growthDiff = Math.abs(
      profileA.growthOrientation.oriented - profileB.growthOrientation.oriented
    )
    if (growthDiff > 0.5) {
      conflicts.push({
        type: 'soft',
        dimension: 'growth',
        description: 'Разные темпы и направления развития могут создавать ощущение, что партнёры "уходят" в разные стороны.',
        patternName: 'growth-orientation divergence',
        severity: 'low',
      })
    }

    // Soft conflict: nervous system activation mismatch
    const activationDiff = Math.abs(
      profileA.nervousSystem.activation - profileB.nervousSystem.activation
    )
    if (activationDiff > 0.6) {
      conflicts.push({
        type: 'soft',
        dimension: 'nervous',
        description: 'Один партнёр склонен к высокой возбудимости, другой — к деактивации. Это влияет на темп жизни и потребности в стимуляции.',
        patternName: 'nervous-system mismatch',
        severity: 'low',
      })
    }

    return { hasHardConflict, conflicts }
  }

  toTensionPoints(conflicts: ConflictData[]): TensionPoint[] {
    return conflicts
      .filter((c) => c.type === 'soft')
      .map((c) => ({
        dimension: c.dimension,
        severity: c.severity,
        description: c.description,
        patternName: c.patternName,
      }))
  }
}

export const conflictDetector = new ConflictDetector()
