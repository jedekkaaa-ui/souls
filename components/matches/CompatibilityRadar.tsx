'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { LayerScores } from '@/types'

const LAYER_LABELS: Record<keyof LayerScores, string> = {
  nervous: 'Нервная система',
  attachment: 'Привязанность',
  values: 'Ценности',
  emotionalRegulation: 'Эмоции',
  lifestyle: 'Образ жизни',
  growth: 'Рост',
}

interface CompatibilityRadarProps {
  layerScores: LayerScores
  userName?: string
  partnerName?: string
}

export function CompatibilityRadar({
  layerScores,
  userName = 'Вы',
  partnerName = 'Партнёр',
}: CompatibilityRadarProps) {
  const data = Object.entries(layerScores).map(([key, value]) => ({
    subject: LAYER_LABELS[key as keyof LayerScores],
    score: Math.round(value * 100),
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: '#6b7280' }}
        />
        <Radar
          name="Совместимость"
          dataKey="score"
          stroke="#0F6E56"
          fill="#0F6E56"
          fillOpacity={0.15}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
