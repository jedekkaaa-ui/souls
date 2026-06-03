import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiService } from '@/lib/ai'
import { matchingEngine } from '@/lib/matching/engine'
import type { OnboardingResponse, BehavioralEventData } from '@/types'
import type { Prisma } from '@prisma/client'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const events = await prisma.behavioralEvent.findMany({
    where: { userId, eventType: 'onboarding_choice' },
    orderBy: { createdAt: 'asc' },
  })

  const onboardingResponses: OnboardingResponse[] = events.map((e) => ({
    sessionNum: e.sessionNum ?? 0,
    questionId: e.questionId ?? '',
    choiceValue: e.choiceValue as Record<string, unknown>,
    timingMs: e.timingMs ?? undefined,
  }))

  const behavioralEvents: BehavioralEventData[] = events.map((e) => ({
    eventType: e.eventType,
    sessionNum: e.sessionNum ?? undefined,
    questionId: e.questionId ?? undefined,
    choiceValue: e.choiceValue as Record<string, unknown>,
    timingMs: e.timingMs ?? undefined,
  }))

  const inferenceResult = await aiService.inferPersonality({
    userId,
    onboardingResponses,
    behavioralEvents,
    freeTextResponses: [],
  })

  // Save to Profile
  await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      personalityVector: inferenceResult.personalityVector as unknown as Prisma.InputJsonValue,
      attachmentSecure: inferenceResult.attachmentScores.secure,
      attachmentAnxious: inferenceResult.attachmentScores.anxious,
      attachmentAvoidant: inferenceResult.attachmentScores.avoidant,
      attachmentDisorganized: inferenceResult.attachmentScores.disorganized,
      valuesAutonomy: inferenceResult.valuesMap.autonomy,
      valuesSecurity: inferenceResult.valuesMap.security,
      valuesAchievement: inferenceResult.valuesMap.achievement,
      valuesBenevolence: inferenceResult.valuesMap.benevolence,
      valuesConformity: inferenceResult.valuesMap.conformity,
      valuesTradition: inferenceResult.valuesMap.tradition,
      valuesPower: inferenceResult.valuesMap.power,
      valuesStimulation: inferenceResult.valuesMap.stimulation,
      valuesHedonism: inferenceResult.valuesMap.hedonism,
      valuesUniversalism: inferenceResult.valuesMap.universalism,
      valuesSelfDirection: inferenceResult.valuesMap.selfDirection,
      valuesSpirit: inferenceResult.valuesMap.spirit,
      conflictCompete: inferenceResult.conflictStyle.compete,
      conflictAvoid: inferenceResult.conflictStyle.avoid,
      conflictAccommodate: inferenceResult.conflictStyle.accommodate,
      conflictCollaborate: inferenceResult.conflictStyle.collaborate,
      nervousActivation: inferenceResult.nervousSystem.activation,
      nervousDeactivation: inferenceResult.nervousSystem.deactivation,
      nervousWindowTolerance: inferenceResult.nervousSystem.windowTolerance,
      emotionFlooding: inferenceResult.emotionalRegulation.flooding,
      emotionRumination: inferenceResult.emotionalRegulation.rumination,
      emotionRepair: inferenceResult.emotionalRegulation.repair,
      emotionSuppression: inferenceResult.emotionalRegulation.suppression,
      emotionExpression: inferenceResult.emotionalRegulation.expression,
      growthFixed: inferenceResult.growthOrientation.fixed,
      growthOriented: inferenceResult.growthOrientation.oriented,
      commDirect: inferenceResult.communication.direct,
      commIndirect: inferenceResult.communication.indirect,
      commAssertive: inferenceResult.communication.assertive,
      commPassive: inferenceResult.communication.passive,
      confidenceScores: inferenceResult.confidenceScores,
      personalityInsights: { narrativeInsight: inferenceResult.narrativeInsight, uncertaintyFlags: inferenceResult.uncertaintyFlags },
      rawOnboardingData: { responses: onboardingResponses } as unknown as Prisma.InputJsonValue,
      lastInferredAt: new Date(),
    },
    update: {
      personalityVector: inferenceResult.personalityVector as unknown as Prisma.InputJsonValue,
      attachmentSecure: inferenceResult.attachmentScores.secure,
      attachmentAnxious: inferenceResult.attachmentScores.anxious,
      attachmentAvoidant: inferenceResult.attachmentScores.avoidant,
      attachmentDisorganized: inferenceResult.attachmentScores.disorganized,
      valuesAutonomy: inferenceResult.valuesMap.autonomy,
      valuesSecurity: inferenceResult.valuesMap.security,
      valuesAchievement: inferenceResult.valuesMap.achievement,
      valuesBenevolence: inferenceResult.valuesMap.benevolence,
      valuesConformity: inferenceResult.valuesMap.conformity,
      valuesTradition: inferenceResult.valuesMap.tradition,
      valuesPower: inferenceResult.valuesMap.power,
      valuesStimulation: inferenceResult.valuesMap.stimulation,
      valuesHedonism: inferenceResult.valuesMap.hedonism,
      valuesUniversalism: inferenceResult.valuesMap.universalism,
      valuesSelfDirection: inferenceResult.valuesMap.selfDirection,
      valuesSpirit: inferenceResult.valuesMap.spirit,
      conflictCompete: inferenceResult.conflictStyle.compete,
      conflictAvoid: inferenceResult.conflictStyle.avoid,
      conflictAccommodate: inferenceResult.conflictStyle.accommodate,
      conflictCollaborate: inferenceResult.conflictStyle.collaborate,
      nervousActivation: inferenceResult.nervousSystem.activation,
      nervousDeactivation: inferenceResult.nervousSystem.deactivation,
      nervousWindowTolerance: inferenceResult.nervousSystem.windowTolerance,
      emotionFlooding: inferenceResult.emotionalRegulation.flooding,
      emotionRumination: inferenceResult.emotionalRegulation.rumination,
      emotionRepair: inferenceResult.emotionalRegulation.repair,
      emotionSuppression: inferenceResult.emotionalRegulation.suppression,
      emotionExpression: inferenceResult.emotionalRegulation.expression,
      growthFixed: inferenceResult.growthOrientation.fixed,
      growthOriented: inferenceResult.growthOrientation.oriented,
      commDirect: inferenceResult.communication.direct,
      commIndirect: inferenceResult.communication.indirect,
      commAssertive: inferenceResult.communication.assertive,
      commPassive: inferenceResult.communication.passive,
      confidenceScores: inferenceResult.confidenceScores,
      personalityInsights: { narrativeInsight: inferenceResult.narrativeInsight, uncertaintyFlags: inferenceResult.uncertaintyFlags },
      rawOnboardingData: { responses: onboardingResponses } as unknown as Prisma.InputJsonValue,
      lastInferredAt: new Date(),
    },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { onboardingDone: true, onboardingStep: 5 },
  })

  // Kick off initial matching in background (fire and forget)
  matchingEngine.findMatches(userId).catch(console.error)

  return NextResponse.json({
    ok: true,
    insight: inferenceResult.narrativeInsight,
    uncertaintyFlags: inferenceResult.uncertaintyFlags,
  })
}
