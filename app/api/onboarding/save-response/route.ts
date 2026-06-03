import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'

const schema = z.object({
  sessionNum: z.number().int().min(1).max(5),
  questionId: z.string(),
  choiceValue: z.record(z.string(), z.unknown()),
  timingMs: z.number().int().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 })
  }

  const { sessionNum, questionId, choiceValue, timingMs } = parsed.data

  await prisma.behavioralEvent.create({
    data: {
      userId: session.user.id,
      eventType: 'onboarding_choice',
      sessionNum,
      questionId,
      choiceValue: choiceValue as Prisma.InputJsonValue,
      timingMs,
    },
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { onboardingStep: sessionNum },
  })

  return NextResponse.json({ ok: true })
}
