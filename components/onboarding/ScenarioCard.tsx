'use client'

import { motion } from 'framer-motion'
import type { OnboardingQuestion, OnboardingOption } from '@/config/onboarding-content'

interface ScenarioCardProps {
  question: OnboardingQuestion
  selectedId: string | null
  onSelect: (option: OnboardingOption) => void
}

export function ScenarioCard({ question, selectedId, onSelect }: ScenarioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <p className="text-xl font-serif leading-relaxed text-foreground">{question.prompt}</p>
        {question.subtext && (
          <p className="text-sm text-muted-foreground italic">{question.subtext}</p>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(option)}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
              selectedId === option.id
                ? 'border-primary bg-primary/5 text-foreground'
                : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/30'
            }`}
          >
            <span className="text-sm leading-relaxed">{option.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
