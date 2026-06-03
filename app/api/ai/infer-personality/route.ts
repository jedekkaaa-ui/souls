import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { aiService } from '@/lib/ai'
import type { OnboardingResponse, BehavioralEventData } from '@/types'

// Admin/debug endpoint — development only
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await req.json()
  const targetId = userId ?? session.user.id

  const events = await prisma.behavioralEvent.findMany({
    where: { userId: targetId },
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

  const result = await aiService.inferPersonality({
    userId: targetId,
    onboardingResponses,
    behavioralEvents,
    freeTextResponses: [],
  })

  return NextResponse.json(result)
}
