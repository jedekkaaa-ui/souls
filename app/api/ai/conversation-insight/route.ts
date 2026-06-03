import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiService } from '@/lib/ai'
import { z } from 'zod'
import type { PersonalityProfile, LayerScores, TensionPoint, ResonancePoint } from '@/types'
import type { Profile } from '@prisma/client'

const schema = z.object({
  matchId: z.string(),
  requestType: z.enum(['starter', 'deepen', 'insight', 'repair']),
})

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

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { matchId, requestType } = parsed.data
  const userId = session.user.id

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })

  if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (match.userAId !== userId && match.userBId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!match.userA.profile || !match.userB.profile) {
    return NextResponse.json({ error: 'Profiles incomplete' }, { status: 422 })
  }

  const result = await aiService.getConversationSuggestion({
    matchId,
    profileA: profileToPersonality(match.userA.profile),
    profileB: profileToPersonality(match.userB.profile),
    compatibilityData: {
      layerScores: match.layerScores as unknown as LayerScores,
      overallScore: match.overallScore,
      chemistryScore: match.chemistryScore,
      stabilityScore: match.stabilityScore,
      tensionPoints: (match.tensionPoints as unknown as TensionPoint[]) ?? [],
      resonancePoints: (match.resonancePoints as unknown as ResonancePoint[]) ?? [],
      narrativeSummary: '',
      warningFlags: [],
      confidenceScore: match.confidenceScore,
    },
    conversationHistory: match.messages.reverse().map((m) => ({
      id: m.id,
      senderId: m.senderId,
      content: m.content,
      messageType: m.messageType,
      createdAt: m.createdAt,
    })),
    requestType,
  })

  return NextResponse.json(result)
}
