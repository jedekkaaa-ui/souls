import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    onboardingDone: user.onboardingDone,
    onboardingStep: user.onboardingStep,
    profile: user.profile
      ? {
          attachmentScores: {
            secure: user.profile.attachmentSecure,
            anxious: user.profile.attachmentAnxious,
            avoidant: user.profile.attachmentAvoidant,
            disorganized: user.profile.attachmentDisorganized,
          },
          valuesMap: {
            autonomy: user.profile.valuesAutonomy,
            security: user.profile.valuesSecurity,
            achievement: user.profile.valuesAchievement,
            benevolence: user.profile.valuesBenevolence,
            conformity: user.profile.valuesConformity,
            tradition: user.profile.valuesTradition,
            power: user.profile.valuesPower,
            stimulation: user.profile.valuesStimulation,
            hedonism: user.profile.valuesHedonism,
            universalism: user.profile.valuesUniversalism,
            selfDirection: user.profile.valuesSelfDirection,
            spirit: user.profile.valuesSpirit,
          },
          conflictStyle: {
            compete: user.profile.conflictCompete,
            avoid: user.profile.conflictAvoid,
            accommodate: user.profile.conflictAccommodate,
            collaborate: user.profile.conflictCollaborate,
          },
          nervousSystem: {
            activation: user.profile.nervousActivation,
            deactivation: user.profile.nervousDeactivation,
            windowTolerance: user.profile.nervousWindowTolerance,
          },
          emotionalRegulation: {
            flooding: user.profile.emotionFlooding,
            rumination: user.profile.emotionRumination,
            repair: user.profile.emotionRepair,
            suppression: user.profile.emotionSuppression,
            expression: user.profile.emotionExpression,
          },
          growthOrientation: {
            fixed: user.profile.growthFixed,
            oriented: user.profile.growthOriented,
          },
          communication: {
            direct: user.profile.commDirect,
            indirect: user.profile.commIndirect,
            assertive: user.profile.commAssertive,
            passive: user.profile.commPassive,
          },
          insights: user.profile.personalityInsights,
          lastInferredAt: user.profile.lastInferredAt,
        }
      : null,
  })
}
