import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CompatibilityRadar } from '@/components/matches/CompatibilityRadar'
import { LayerBreakdown } from '@/components/matches/LayerBreakdown'
import { Button } from '@/components/ui/button'
import { formatScore } from '@/lib/utils'
import type { LayerScores, TensionPoint, ResonancePoint } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function MatchDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return null

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      userA: { select: { id: true, name: true, avatarUrl: true, profile: { select: { personalityInsights: true } } } },
      userB: { select: { id: true, name: true, avatarUrl: true, profile: { select: { personalityInsights: true } } } },
    },
  })

  if (!match) notFound()

  const userId = session.user.id
  if (match.userAId !== userId && match.userBId !== userId) notFound()

  const isA = match.userAId === userId
  const partner = isA ? match.userB : match.userA
  const partnerInsight = (partner.profile?.personalityInsights as { narrativeInsight?: string } | null)?.narrativeInsight

  const layerScores = match.layerScores as unknown as LayerScores
  const tensionPoints = (match.tensionPoints as unknown as TensionPoint[] | null) ?? []
  const resonancePoints = (match.resonancePoints as unknown as ResonancePoint[] | null) ?? []

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium flex-shrink-0">
          {partner.name?.slice(0, 2).toUpperCase() ?? '??'}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-serif text-foreground">{partner.name ?? 'Анонимно'}</h1>
          {partnerInsight && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{partnerInsight}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-primary">{formatScore(match.overallScore)}</p>
          <p className="text-xs text-muted-foreground">Совместимость</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-foreground">{formatScore(match.chemistryScore)}</p>
          <p className="text-xs text-muted-foreground">Химия</p>
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-foreground">{formatScore(match.stabilityScore)}</p>
          <p className="text-xs text-muted-foreground">Устойчивость</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Радар совместимости</p>
        <CompatibilityRadar layerScores={layerScores} />
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 space-y-4">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">По слоям</p>
        <LayerBreakdown
          layerScores={layerScores}
          tensionPoints={tensionPoints}
          resonancePoints={resonancePoints}
        />
      </div>

      {resonancePoints.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Зоны резонанса</p>
          {resonancePoints.map((r, i) => (
            <div key={i} className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <p className="text-sm text-foreground">{r.description}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{r.strength}</p>
            </div>
          ))}
        </div>
      )}

      <Button asChild className="w-full">
        <Link href={`/chat/${match.id}`}>Написать</Link>
      </Button>
    </div>
  )
}
