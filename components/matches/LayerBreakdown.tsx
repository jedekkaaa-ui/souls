'use client'

import { motion } from 'framer-motion'
import type { LayerScores, TensionPoint, ResonancePoint } from '@/types'
import { TensionAlert } from './TensionAlert'
import { formatScore } from '@/lib/utils'

const LAYER_INFO: Record<
  keyof LayerScores,
  { label: string; description: string }
> = {
  nervous: {
    label: 'Нервная система',
    description: 'Совместимость темпов активации и восстановления',
  },
  attachment: {
    label: 'Привязанность',
    description: 'Паттерны близости, дистанции и доверия',
  },
  values: {
    label: 'Ценности',
    description: 'Общие приоритеты и жизненные ориентиры',
  },
  emotionalRegulation: {
    label: 'Эмоциональная регуляция',
    description: 'Как вы справляетесь с трудными чувствами вместе',
  },
  lifestyle: {
    label: 'Образ жизни',
    description: 'Практические предпочтения и ритмы жизни',
  },
  growth: {
    label: 'Рост',
    description: 'Совместимость ориентаций на развитие',
  },
}

interface LayerBreakdownProps {
  layerScores: LayerScores
  tensionPoints?: TensionPoint[]
  resonancePoints?: ResonancePoint[]
}

export function LayerBreakdown({ layerScores, tensionPoints = [], resonancePoints = [] }: LayerBreakdownProps) {
  return (
    <div className="space-y-4">
      {Object.entries(layerScores).map(([key, score], i) => {
        const info = LAYER_INFO[key as keyof LayerScores]
        const pct = Math.round(score * 100)
        const tensions = tensionPoints.filter((t) => t.dimension === key)

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-foreground">{info.label}</span>
              <span className="text-sm font-medium tabular-nums" style={{ color: pct >= 70 ? '#0F6E56' : pct >= 50 ? '#92400e' : '#991b1b' }}>
                {pct}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: pct >= 70 ? '#0F6E56' : pct >= 50 ? '#d97706' : '#dc2626' }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{info.description}</p>
            {tensions.map((t, j) => (
              <TensionAlert key={j} tension={t} />
            ))}
          </motion.div>
        )
      })}
    </div>
  )
}
