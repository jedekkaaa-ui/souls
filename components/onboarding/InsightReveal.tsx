'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface InsightRevealProps {
  insight: string
  onResonate: () => void
  onNotQuite: () => void
}

export function InsightReveal({ insight, onResonate, onNotQuite }: InsightRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center space-y-8 py-8"
    >
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Наблюдение</p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg font-serif leading-relaxed text-foreground max-w-md mx-auto"
        >
          {insight}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-3 justify-center"
      >
        <Button variant="default" onClick={onResonate}>
          Это резонирует
        </Button>
        <Button variant="outline" onClick={onNotQuite}>
          Не совсем точно
        </Button>
      </motion.div>
    </motion.div>
  )
}
