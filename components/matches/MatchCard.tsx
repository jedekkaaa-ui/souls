'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatScore } from '@/lib/utils'
import type { LayerScores } from '@/types'

interface MatchCardProps {
  id: string
  partner: { id: string; name: string | null; avatarUrl: string | null }
  overallScore: number
  chemistryScore: number
  stabilityScore: number
  layerScores: LayerScores
  index: number
}

export function MatchCard({
  id,
  partner,
  overallScore,
  chemistryScore,
  stabilityScore,
  layerScores,
  index,
}: MatchCardProps) {
  const initials = partner.name
    ? partner.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/matches/${id}`}>
        <div className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm flex-shrink-0">
              {partner.avatarUrl ? (
                <img src={partner.avatarUrl} alt={partner.name ?? ''} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground truncate">{partner.name ?? 'Анонимно'}</h3>
                <span className="text-lg font-semibold text-primary ml-2 flex-shrink-0">
                  {formatScore(overallScore)}
                </span>
              </div>

              <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                <span>Химия: {formatScore(chemistryScore)}</span>
                <span>Устойчивость: {formatScore(stabilityScore)}</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-1">
                {Object.entries(layerScores).slice(0, 6).map(([key, score]) => (
                  <div
                    key={key}
                    className="h-1 rounded-full"
                    style={{
                      backgroundColor:
                        score >= 0.7
                          ? '#0F6E56'
                          : score >= 0.5
                          ? '#d97706'
                          : '#e5e7eb',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
