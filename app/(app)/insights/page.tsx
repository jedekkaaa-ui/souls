import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function InsightsPage() {
  const session = await auth()
  if (!session?.user?.id) return null

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
        Профиль ещё не сформирован
      </div>
    )
  }

  const sections = [
    {
      title: 'Привязанность',
      items: [
        { label: 'Надёжная', value: profile.attachmentSecure },
        { label: 'Тревожная', value: profile.attachmentAnxious },
        { label: 'Избегающая', value: profile.attachmentAvoidant },
      ],
    },
    {
      title: 'Стиль конфликта',
      items: [
        { label: 'Сотрудничество', value: profile.conflictCollaborate },
        { label: 'Уступание', value: profile.conflictAccommodate },
        { label: 'Избегание', value: profile.conflictAvoid },
        { label: 'Конкуренция', value: profile.conflictCompete },
      ],
    },
    {
      title: 'Эмоциональная регуляция',
      items: [
        { label: 'Восстановление', value: profile.emotionRepair },
        { label: 'Выражение', value: profile.emotionExpression },
        { label: 'Подавление', value: profile.emotionSuppression },
        { label: 'Руминация', value: profile.emotionRumination },
      ],
    },
    {
      title: 'Коммуникация',
      items: [
        { label: 'Прямая', value: profile.commDirect },
        { label: 'Ассертивная', value: profile.commAssertive },
        { label: 'Косвенная', value: profile.commIndirect },
        { label: 'Пассивная', value: profile.commPassive },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-serif text-foreground">Твой профиль</h1>
        {insights?.narrativeInsight && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {insights.narrativeInsight}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-card rounded-2xl border border-border p-4 space-y-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{section.title}</p>
            {section.items.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-muted-foreground tabular-nums">{Math.round(item.value * 100)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.round(item.value * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {insights?.uncertaintyFlags && insights.uncertaintyFlags.length > 0 && (
        <div className="bg-muted rounded-xl p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">Что ещё неясно</p>
          {insights.uncertaintyFlags.map((flag, i) => (
            <p key={i} className="text-xs text-muted-foreground">• {flag}</p>
          ))}
        </div>
      )}
    </div>
  )
}
