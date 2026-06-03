import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: { select: { id: true, name: true, avatarUrl: true } },
      userB: { select: { id: true, name: true, avatarUrl: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { overallScore: 'desc' },
  })

  const formatted = matches.map((m) => {
    const isA = m.userAId === userId
    const partner = isA ? m.userB : m.userA
    return {
      id: m.id,
      partner,
      overallScore: m.overallScore,
      chemistryScore: m.chemistryScore,
      stabilityScore: m.stabilityScore,
      layerScores: m.layerScores,
      tensionPoints: m.tensionPoints,
      resonancePoints: m.resonancePoints,
      confidenceScore: m.confidenceScore,
      outcome: m.outcome,
      lastMessage: m.messages[0] ?? null,
      computedAt: m.computedAt,
    }
  })

  return NextResponse.json(formatted)
}
