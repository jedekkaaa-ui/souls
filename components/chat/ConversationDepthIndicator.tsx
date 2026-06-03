'use client'

import { motion } from 'framer-motion'

interface ConversationDepthIndicatorProps {
  messageCount: number
}

function getDepth(count: number): { level: 1 | 2 | 3; label: string; description: string } {
  if (count < 6) return { level: 1, label: 'Знакомство', description: 'Начало разговора' }
  if (count < 20) return { level: 2, label: 'Контакт', description: 'Разговор углубляется' }
  return { level: 3, label: 'Глубина', description: 'Настоящий диалог' }
}

export function ConversationDepthIndicator({ messageCount }: ConversationDepthIndicatorProps) {
  const { level, label, description } = getDepth(messageCount)
  const progress = Math.min(messageCount / 20, 1)

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/30">
      <div className="flex gap-0.5">
        {[1, 2, 3].map((l) => (
          <motion.span
            key={l}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: l <= level ? '#0F6E56' : '#e2e8f0' }}
            animate={{ scale: l === level ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: l * 0.2 }}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-primary">{label}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
      <div className="flex-1 h-0.5 rounded-full bg-secondary overflow-hidden ml-1">
        <motion.div
          className="h-full rounded-full bg-primary/40"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
