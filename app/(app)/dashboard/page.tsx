import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { MatchCard } from '@/components/matches/MatchCard'
import type { LayerScores } from '@/types'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ userAId: session.user.id }, { userBId: session.user.id }],
    },
    include: {
      userA: { select: { id: true, name: true, avatarUrl: true } },
      userB: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { overallScore: 'desc' },
    take: 3,
  })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: { select: { personalityInsights: true } } },
  })

  const insight = (user?.profile?.personalityInsights as { narrativeInsight?: string } | null)?.narrativeInsight

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif text-foreground">
          Привет, {session.user.name?.split(' ')[0] ?? 'друг'}
        </h1>
        {insight && (
          <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground">Ищем совместимых людей...</p>
          <p className="text-xs text-muted-foreground">Обычно это занимает несколько минут</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground uppercase tracking-widest text-muted-foreground">
              Твои матчи
            </h2>
            <Link href="/matches" className="text-xs text-primary hover:underline">
              Все →
            </Link>
          </div>

          <div className="space-y-3">
            {matches.map((m, i) => {
              const isA = m.userAId === session.user!.id
              const partner = isA ? m.userB : m.userA
              return (
                <MatchCard
                  key={m.id}
                  id={m.id}
                  partner={partner}
                  overallScore={m.overallScore}
                  chemistryScore={m.chemistryScore}
                  stabilityScore={m.stabilityScore}
                  layerScores={m.layerScores as unknown as LayerScores}
                  index={i}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
