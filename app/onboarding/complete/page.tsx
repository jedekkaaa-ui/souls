'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function OnboardingCompletePage() {
  const [loading, setLoading] = useState(false)

  const handleGoToDashboard = () => {
    setLoading(true)
    // Hard redirect so (app) layout runs a fresh DB check (not relying on stale JWT)
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center text-center space-y-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-serif text-foreground">Профиль создан</h1>
          <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Мы проанализировали твои ответы и начинаем поиск совместимых людей. Это займёт немного времени.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" onClick={handleGoToDashboard} disabled={loading}>
          {loading ? 'Загружаем...' : 'Перейти к матчам'}
        </Button>
      </motion.div>
    </div>
  )
}
