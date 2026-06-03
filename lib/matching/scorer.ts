import type { LayerScores } from '@/types'

const BASE_WEIGHTS = {
  nervous: 0.20,
  attachment: 0.25,
  values: 0.20,
  emotionalRegulation: 0.15,
  lifestyle: 0.10,
  growth: 0.10,
}

export class WeightedScorer {
  computeOverallScore(layerScores: LayerScores, profileCompleteness: number): number {
    const weights = this.adjustWeights(profileCompleteness)

    let total = 0
    for (const [key, weight] of Object.entries(weights)) {
      total += layerScores[key as keyof LayerScores] * weight
    }

    // Uncertainty dampening for incomplete profiles
    const dampening = 0.7 + profileCompleteness * 0.3
    return total * dampening
  }

  // Dynamic weights based on how complete the user's profile is
  private adjustWeights(completeness: number): typeof BASE_WEIGHTS {
    if (completeness >= 0.9) return BASE_WEIGHTS

    // With incomplete data, reduce weight of nuanced dimensions
    const scale = completeness
    return {
      nervous: BASE_WEIGHTS.nervous * (0.8 + scale * 0.2),
      attachment: BASE_WEIGHTS.attachment,
      values: BASE_WEIGHTS.values * (0.9 + scale * 0.1),
      emotionalRegulation: BASE_WEIGHTS.emotionalRegulation * scale,
      lifestyle: BASE_WEIGHTS.lifestyle * scale,
      growth: BASE_WEIGHTS.growth * scale,
    }
  }

  // Chemistry boost for complementary patterns (not just similarity)
  applyChemistryBoost(
    baseScore: number,
    hasComplementaryAttachment: boolean,
    hasResonantValues: boolean
  ): number {
    let boost = 0
    if (hasComplementaryAttachment) boost += 0.05
    if (hasResonantValues) boost += 0.03
    return Math.min(1.0, baseScore + boost)
  }

  computeProfileCompleteness(onboardingStep: number): number {
    const maxStep = 5
    return Math.min(1.0, onboardingStep / maxStep)
  }
}

export const weightedScorer = new WeightedScorer()
