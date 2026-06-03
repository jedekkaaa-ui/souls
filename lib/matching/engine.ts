import { prisma } from '@/lib/db'
import { aiService } from '@/lib/ai'
import { conflictDetector } from './conflict-detector'
import { weightedScorer } from './scorer'
import { findSimilarProfiles } from './vector-search'
import type { PersonalityProfile } from '@/types'
import type { Profile } from '@prisma/client'

function profileToPersonality(profile: Profile): PersonalityProfile {
  return {
    userId: profile.userId,
    personalityVector: profile.personalityVector as number[],
    attachmentScores: {
      secure: profile.attachmentSecure,
      anxious: profile.attachmentAnxious,
      avoidant: profile.attachmentAvoidant,
      disorganized: profile.attachmentDisorganized,
    },
    valuesMap: {
      autonomy: profile.valuesAutonomy,
      security: profile.valuesSecurity,
      achievement: profile.valuesAchievement,
      benevolence: profile.valuesBenevolence,
      conformity: profile.valuesConformity,
      tradition: profile.valuesTradition,
      power: profile.valuesPower,
      stimulation: profile.valuesStimulation,
      hedonism: profile.valuesHedonism,
      universalism: profile.valuesUniversalism,
      selfDirection: profile.valuesSelfDirection,
      spirit: profile.valuesSpirit,
    },
    conflictStyle: {
      compete: profile.conflictCompete,
      avoid: profile.conflictAvoid,
      accommodate: profile.conflictAccommodate,
      collaborate: profile.conflictCollaborate,
    },
    nervousSystem: {
      activation: profile.nervousActivation,
      deactivation: profile.nervousDeactivation,
      windowTolerance: profile.nervousWindowTolerance,
    },
    emotionalRegulation: {
      flooding: profile.emotionFlooding,
      rumination: profile.emotionRumination,
      repair: profile.emotionRepair,
      suppression: profile.emotionSuppression,
      expression: profile.emotionExpression,
    },
    growthOrientation: {
      fixed: profile.growthFixed,
      oriented: profile.growthOriented,
    },
    communication: {
      direct: profile.commDirect,
      indirect: profile.commIndirect,
      assertive: profile.commAssertive,
      passive: profile.commPassive,
    },
    confidenceScores: profile.confidenceScores as Record<string, number>,
  }
}

export class MatchingEngine {
  async findMatches(userId: string) {
    const userWithProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!userWithProfile?.profile) {
      return []
    }

    const userProfile = profileToPersonality(userWithProfile.profile)
    const completeness = weightedScorer.computeProfileCompleteness(userWithProfile.onboardingStep)

    // Step 1: vector similarity search (top 200)
    const candidates = await findSimilarProfiles(
      userId,
      userProfile.personalityVector,
      200
    )

    // Step 2: filter already-computed matches
    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: { userAId: true, userBId: true },
    })
    const matchedUserIds = new Set(
      existingMatches.map((m) => (m.userAId === userId ? m.userBId : m.userAId))
    )

    const filtered = candidates.filter((c) => !matchedUserIds.has(c.userId))

    // Step 3: load full profiles for top-50 and run conflict detection
    const top50Ids = filtered.slice(0, 50).map((c) => c.userId)
    const fullProfiles = await prisma.profile.findMany({
      where: { userId: { in: top50Ids } },
    })

    const scored: Array<{ userId: string; compatibilityData: Awaited<ReturnType<typeof aiService.computeCompatibility>>; overallScore: number }> = []

    for (const profile of fullProfiles) {
      const candidatePersonality = profileToPersonality(profile)
      const conflictResult = conflictDetector.detect(userProfile, candidatePersonality)

      if (conflictResult.hasHardConflict) continue

      const compatibilityData = await aiService.computeCompatibility({
        profileA: userProfile,
        profileB: candidatePersonality,
      })

      const tensionPoints = conflictDetector.toTensionPoints(conflictResult.conflicts)
      const allTensionPoints = [...tensionPoints, ...compatibilityData.tensionPoints]

      const hasComplementaryAttachment =
        compatibilityData.layerScores.attachment > 0.65
      const hasResonantValues = compatibilityData.layerScores.values > 0.7

      const boostedScore = weightedScorer.applyChemistryBoost(
        weightedScorer.computeOverallScore(compatibilityData.layerScores, completeness),
        hasComplementaryAttachment,
        hasResonantValues
      )

      scored.push({
        userId: profile.userId,
        compatibilityData: { ...compatibilityData, tensionPoints: allTensionPoints },
        overallScore: boostedScore,
      })
    }

    // Step 4: sort and take top 7
    scored.sort((a, b) => b.overallScore - a.overallScore)
    const top7 = scored.slice(0, 7)

    // Step 5: save matches to DB
    const createdMatches = []
    for (const item of top7) {
      const [aId, bId] = [userId, item.userId].sort()
      const match = await prisma.match.upsert({
        where: { userAId_userBId: { userAId: aId, userBId: bId } },
        create: {
          userAId: aId,
          userBId: bId,
          layerScores: item.compatibilityData.layerScores as unknown as import('@prisma/client').Prisma.InputJsonValue,
          overallScore: item.overallScore,
          chemistryScore: item.compatibilityData.chemistryScore,
          stabilityScore: item.compatibilityData.stabilityScore,
          tensionPoints: item.compatibilityData.tensionPoints as unknown as import('@prisma/client').Prisma.InputJsonValue,
          resonancePoints: item.compatibilityData.resonancePoints as unknown as import('@prisma/client').Prisma.InputJsonValue,
          confidenceScore: item.compatibilityData.confidenceScore,
        },
        update: {
          layerScores: item.compatibilityData.layerScores as unknown as import('@prisma/client').Prisma.InputJsonValue,
          overallScore: item.overallScore,
          chemistryScore: item.compatibilityData.chemistryScore,
          stabilityScore: item.compatibilityData.stabilityScore,
          tensionPoints: item.compatibilityData.tensionPoints as unknown as import('@prisma/client').Prisma.InputJsonValue,
          resonancePoints: item.compatibilityData.resonancePoints as unknown as import('@prisma/client').Prisma.InputJsonValue,
          confidenceScore: item.compatibilityData.confidenceScore,
        },
      })
      createdMatches.push(match)
    }

    return createdMatches
  }
}

export const matchingEngine = new MatchingEngine()
