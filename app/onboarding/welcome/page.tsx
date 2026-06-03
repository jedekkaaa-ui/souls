'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function WelcomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <h1 className="text-4xl font-serif text-foreground">Souls</h1>
          <p className="text-xl font-serif text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Платформа для поиска глубокой человеческой совместимости
          </p>
        </div>

        <div className="w-16 h-px bg-border mx-auto" />

        <div className="space-y-4 text-sm text-muted-foreground max-w-sm mx-auto">
          <p>
            Мы не ищем похожих. Мы ищем совместимых — людей, с которыми ты сможешь строить что-то настоящее.
          </p>
          <p>
            Для этого нам нужно понять тебя. Не через анкету — через серию живых вопросов.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {['Образы', 'Дилеммы', 'Трейдоффы', 'Истории'].map((label, i) => (
            <div key={i} className="text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground mx-auto">
                {i + 1}
              </div>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">Около 15–20 минут</p>

        <Button asChild size="lg" className="w-full max-w-xs mx-auto flex">
          <Link href="/onboarding/session-1">Начать</Link>
        </Button>
      </motion.div>
    </div>
  )
}
