'use client'

import { motion } from 'framer-motion'
import type { OnboardingQuestion, OnboardingOption } from '@/config/onboarding-content'

interface DilemmaChoiceProps {
  question: OnboardingQuestion
  selectedId: string | null
  onSelect: (option: OnboardingOption) => void
}

export function DilemmaChoice({ question, selectedId, onSelect }: DilemmaChoiceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <p className="text-xl font-serif leading-relaxed text-foreground">{question.prompt}</p>
        {question.subtext && (
          <div className="flex items-start gap-2 px-4 py-2.5 rounded-lg bg-secondary/60 border border-border">
            <span className="text-muted-foreground mt-0.5 text-base">⚖</span>
            <p className="text-sm text-muted-foreground italic leading-relaxed">{question.subtext}</p>
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {question.options.map((option, i) => {
          const letters = ['А', 'Б', 'В', 'Г']
          const isSelected = selectedId === option.id
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(option)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex gap-3 items-start ${
                isSelected
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/20'
              }`}
            >
              <span className={`text-xs font-medium mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {letters[i]}
              </span>
              <span className="text-sm leading-relaxed">{option.text}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
