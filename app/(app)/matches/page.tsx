import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { MatchCard } from '@/components/matches/MatchCard'
import type { LayerScores } from '@/types'

export default async function MatchesPage() {
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
  })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-serif text-foreground">Матчи</h1>
        <p className="text-sm text-muted-foreground">
          {matches.length > 0 ? `${matches.length} совместимых людей` : 'Поиск ещё идёт...'}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">Матчи появятся после завершения анализа профиля</p>
        </div>
      ) : (
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
      )}
    </div>
  )
}
