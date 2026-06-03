import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const userId = session.user.id

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      userA: { select: { id: true, name: true, avatarUrl: true, profile: true } },
      userB: { select: { id: true, name: true, avatarUrl: true, profile: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
      },
    },
  })

  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 })
  }

  if (match.userAId !== userId && match.userBId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const isA = match.userAId === userId
  const partner = isA ? match.userB : match.userA
  const partnerProfile = partner.profile

  return NextResponse.json({
    id: match.id,
    partner: { id: partner.id, name: partner.name, avatarUrl: partner.avatarUrl },
    overallScore: match.overallScore,
    chemistryScore: match.chemistryScore,
    stabilityScore: match.stabilityScore,
    layerScores: match.layerScores,
    tensionPoints: match.tensionPoints,
    resonancePoints: match.resonancePoints,
    confidenceScore: match.confidenceScore,
    outcome: match.outcome,
    partnerInsights: partnerProfile
      ? {
          attachmentStyle: {
            secure: partnerProfile.attachmentSecure,
            anxious: partnerProfile.attachmentAnxious,
            avoidant: partnerProfile.attachmentAvoidant,
          },
          growthOriented: partnerProfile.growthOriented,
          narrativeInsight: (partnerProfile.personalityInsights as { narrativeInsight?: string } | null)?.narrativeInsight,
        }
      : null,
    messages: match.messages,
    computedAt: match.computedAt,
  })
}
