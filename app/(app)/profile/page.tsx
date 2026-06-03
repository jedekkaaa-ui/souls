import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { AttachmentStyleCard } from '@/components/profile/AttachmentStyleCard'
import { PersonalityVector } from '@/components/profile/PersonalityVector'
import type { AttachmentScores, ValuesMap, ConflictStyle, EmotionalRegulation, CommunicationStyle } from '@/types'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  })

  const profile = user?.profile
  const insights = profile?.personalityInsights as {
    narrativeInsight?: string
    uncertaintyFlags?: string[]
  } | null

  if (!profile) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        Профиль ещё не сформирован. Пройдите онбординг.
      </div>
    )
  }

  const attachmentScores: AttachmentScores = {
    secure: profile.attachmentSecure,
    anxious: profile.attachmentAnxious,
    avoidant: profile.attachmentAvoidant,
    disorganized: profile.attachmentDisorganized,
  }

  const valuesMap: ValuesMap = {
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
  }

  const conflictStyle: ConflictStyle = {
    compete: profile.conflictCompete,
    avoid: profile.conflictAvoid,
    accommodate: profile.conflictAccommodate,
    collaborate: profile.conflictCollaborate,
  }

  const emotionalRegulation: EmotionalRegulation = {
    flooding: profile.emotionFlooding,
    rumination: profile.emotionRumination,
    repair: profile.emotionRepair,
    suppression: profile.emotionSuppression,
    expression: profile.emotionExpression,
  }

  const communication: CommunicationStyle = {
    direct: profile.commDirect,
    indirect: profile.commIndirect,
    assertive: profile.commAssertive,
    passive: profile.commPassive,
  }

  const confidenceScores = profile.confidenceScores as Record<string, number>
  const avgConfidence = Object.values(confidenceScores).length > 0
    ? Math.round(Object.values(confidenceScores).reduce((a, b) => a + b, 0) / Object.values(confidenceScores).length * 100)
    : null

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif text-foreground">Твой профиль</h1>
        {insights?.narrativeInsight && (
          <p className="text-sm text-muted-foreground leading-relaxed">{insights.narrativeInsight}</p>
        )}
        {avgConfidence !== null && (
          <p className="text-xs text-muted-foreground">
            Точность профиля: <span className="text-foreground font-medium">{avgConfidence}%</span>
            {avgConfidence < 60 && ' — ответь на больше вопросов для уточнения'}
          </p>
        )}
      </div>

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Стиль привязанности</h2>
        <AttachmentStyleCard scores={attachmentScores} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Психологический вектор</h2>
        <PersonalityVector
          valuesMap={valuesMap}
          conflictStyle={conflictStyle}
          emotionalRegulation={emotionalRegulation}
          communication={communication}
        />
      </section>

      {insights?.uncertaintyFlags && insights.uncertaintyFlags.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Что ещё неясно</h2>
          <div className="rounded-xl border border-border bg-card/50 p-4 space-y-1">
            {insights.uncertaintyFlags.map((flag, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {flag}</p>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
