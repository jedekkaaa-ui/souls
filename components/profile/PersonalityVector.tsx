'use client'

import { motion } from 'framer-motion'
import type { ValuesMap, ConflictStyle, EmotionalRegulation, CommunicationStyle } from '@/types'

interface PersonalityVectorProps {
  valuesMap: ValuesMap
  conflictStyle: ConflictStyle
  emotionalRegulation: EmotionalRegulation
  communication: CommunicationStyle
}

function DimensionGroup({
  title,
  items,
  delay,
}: {
  title: string
  items: { label: string; value: number }[]
  delay: number
}) {
  const top = [...items].sort((a, b) => b.value - a.value).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-border bg-card p-4 space-y-3"
    >
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="space-y-2">
        {top.map((item, i) => {
          const pct = Math.round(item.value * 100)
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: delay + i * 0.05, ease: 'easeOut' }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

const VALUES_LABELS: Record<keyof ValuesMap, string> = {
  autonomy: 'Автономия',
  security: 'Безопасность',
  achievement: 'Достижение',
  benevolence: 'Доброта',
  conformity: 'Конформизм',
  tradition: 'Традиции',
  power: 'Власть',
  stimulation: 'Стимуляция',
  hedonism: 'Гедонизм',
  universalism: 'Универсализм',
  selfDirection: 'Саморазвитие',
  spirit: 'Духовность',
}

const CONFLICT_LABELS: Record<keyof ConflictStyle, string> = {
  compete: 'Конкуренция',
  avoid: 'Избегание',
  accommodate: 'Уступание',
  collaborate: 'Сотрудничество',
}

const EMOTION_LABELS: Record<keyof EmotionalRegulation, string> = {
  flooding: 'Захлёст',
  rumination: 'Руминация',
  repair: 'Восстановление',
  suppression: 'Подавление',
  expression: 'Выражение',
}

const COMM_LABELS: Record<keyof CommunicationStyle, string> = {
  direct: 'Прямая',
  indirect: 'Косвенная',
  assertive: 'Ассертивная',
  passive: 'Пассивная',
}

export function PersonalityVector({ valuesMap, conflictStyle, emotionalRegulation, communication }: PersonalityVectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <DimensionGroup
        title="Ценности"
        items={Object.entries(valuesMap).map(([k, v]) => ({ label: VALUES_LABELS[k as keyof ValuesMap], value: v }))}
        delay={0}
      />
      <DimensionGroup
        title="Стиль конфликта"
        items={Object.entries(conflictStyle).map(([k, v]) => ({ label: CONFLICT_LABELS[k as keyof ConflictStyle], value: v }))}
        delay={0.05}
      />
      <DimensionGroup
        title="Эмоциональная регуляция"
        items={Object.entries(emotionalRegulation).map(([k, v]) => ({ label: EMOTION_LABELS[k as keyof EmotionalRegulation], value: v }))}
        delay={0.1}
      />
      <DimensionGroup
        title="Коммуникация"
        items={Object.entries(communication).map(([k, v]) => ({ label: COMM_LABELS[k as keyof CommunicationStyle], value: v }))}
        delay={0.15}
      />
    </div>
  )
}
