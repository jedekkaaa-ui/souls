import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiService } from '@/lib/ai'
import { z } from 'zod'
import type { PersonalityProfile } from '@/types'
import type { Profile } from '@prisma/client'

const schema = z.object({
  userAId: z.string(),
  userBId: z.string(),
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

  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Development only' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { userAId, userBId } = parsed.data

  const [userA, userB] = await Promise.all([
    prisma.user.findUnique({ where: { id: userAId }, include: { profile: true } }),
    prisma.user.findUnique({ where: { id: userBId }, include: { profile: true } }),
  ])

  if (!userA?.profile || !userB?.profile) {
    return NextResponse.json({ error: 'Profiles not found' }, { status: 404 })
  }

  const result = await aiService.computeCompatibility({
    profileA: profileToPersonality(userA.profile),
    profileB: profileToPersonality(userB.profile),
  })

  return NextResponse.json(result)
}
