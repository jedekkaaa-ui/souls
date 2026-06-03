'use client'

import { motion } from 'framer-motion'
import type { OnboardingQuestion, OnboardingOption } from '@/config/onboarding-content'

interface MiniStoryProps {
  question: OnboardingQuestion
  selectedId: string | null
  onSelect: (option: OnboardingOption) => void
}

export function MiniStory({ question, selectedId, onSelect }: MiniStoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">История</span>
          <span className="flex-1 h-px bg-border" />
        </div>
        <p className="text-base font-serif leading-relaxed text-foreground">{question.prompt}</p>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground px-1">Что дальше?</p>
        <div className="space-y-2.5">
          {question.options.map((option) => {
            const isSelected = selectedId === option.id
            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/20'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                  isSelected ? 'bg-primary' : 'bg-border'
                }`} />
                <span className="text-sm leading-relaxed">{option.text}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
