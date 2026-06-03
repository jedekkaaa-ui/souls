'use client'

import { motion } from 'framer-motion'
import type { AttachmentScores } from '@/types'

interface AttachmentStyleCardProps {
  scores: AttachmentScores
}

const STYLES = [
  {
    key: 'secure' as const,
    label: 'Надёжная',
    description: 'Комфорт в близости и независимости. Доверие к себе и другим.',
    color: '#0F6E56',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    key: 'anxious' as const,
    label: 'Тревожная',
    description: 'Высокая потребность в близости, чувствительность к отдалению.',
    color: '#d97706',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    key: 'avoidant' as const,
    label: 'Избегающая',
    description: 'Ценит независимость, дискомфорт при слишком тесном сближении.',
    color: '#6366f1',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  {
    key: 'disorganized' as const,
    label: 'Дезорганизованная',
    description: 'Противоречивые паттерны — одновременно тянет к близости и пугает.',
    color: '#9f1239',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
]

export function AttachmentStyleCard({ scores }: AttachmentStyleCardProps) {
  const dominant = STYLES.reduce((a, b) => scores[a.key] >= scores[b.key] ? a : b)

  return (
    <div className="space-y-4">
      <div className={`rounded-xl border p-4 ${dominant.bgColor} ${dominant.borderColor}`}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Основной стиль</p>
        <p className="text-lg font-serif text-foreground">{dominant.label}</p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{dominant.description}</p>
      </div>

      <div className="space-y-2">
        {STYLES.map((style, i) => {
          const pct = Math.round(scores[style.key] * 100)
          return (
            <motion.div
              key={style.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="space-y-1"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-foreground">{style.label}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: style.color }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
