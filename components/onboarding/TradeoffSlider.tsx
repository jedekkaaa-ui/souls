'use client'

import { motion } from 'framer-motion'
import type { OnboardingQuestion, OnboardingOption } from '@/config/onboarding-content'

interface TradeoffSliderProps {
  question: OnboardingQuestion
  selectedId: string | null
  onSelect: (option: OnboardingOption) => void
}

const POSITION_LABELS = ['Однозначно', 'Скорее', 'Скорее', 'Однозначно']

export function TradeoffSlider({ question, selectedId, onSelect }: TradeoffSliderProps) {
  const selectedIndex = question.options.findIndex((o) => o.id === selectedId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      <p className="text-xl font-serif leading-relaxed text-foreground">{question.prompt}</p>

      <div className="flex justify-between text-sm font-medium text-foreground px-1">
        <span className="max-w-[40%] leading-snug">{question.leftLabel}</span>
        <span className="max-w-[40%] text-right leading-snug">{question.rightLabel}</span>
      </div>

      <div className="relative">
        <div className="h-1 bg-secondary rounded-full mx-4 relative">
          {selectedIndex >= 0 && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-md"
              animate={{ left: `${(selectedIndex / 3) * 100}%` }}
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ marginLeft: '-8px' }}
            />
          )}
        </div>

        <div className="flex justify-between mt-3 px-1">
          {question.options.map((option, i) => {
            const isSelected = selectedId === option.id
            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(option)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  isSelected ? 'border-primary bg-primary' : 'border-border bg-card group-hover:border-primary/60'
                }`} />
                <span className={`text-xs transition-colors leading-tight text-center max-w-[70px] ${
                  isSelected ? 'text-primary font-medium' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {POSITION_LABELS[i]}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {selectedId && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm text-center text-muted-foreground px-4 py-2 rounded-lg bg-secondary/50"
        >
          {question.options.find((o) => o.id === selectedId)?.text}
        </motion.div>
      )}
    </motion.div>
  )
}
