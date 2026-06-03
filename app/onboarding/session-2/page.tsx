'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { DilemmaChoice } from '@/components/onboarding/DilemmaChoice'
import { InsightReveal } from '@/components/onboarding/InsightReveal'
import { ProgressBar } from '@/components/onboarding/ProgressBar'
import { ONBOARDING_SESSIONS } from '@/config/onboarding-content'
import type { OnboardingOption } from '@/config/onboarding-content'
import { Button } from '@/components/ui/button'

const SESSION = ONBOARDING_SESSIONS[1]

export default function Session2Page() {
  const router = useRouter()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showInsight, setShowInsight] = useState(false)
  const [saving, setSaving] = useState(false)

  const question = SESSION.questions[currentQ]
  const selectedId = answers[question?.id] ?? null
  const isLast = currentQ === SESSION.questions.length - 1

  const handleSelect = (option: OnboardingOption) => {
    setAnswers((prev) => ({ ...prev, [question.id]: option.id }))
  }

  const handleNext = async () => {
    if (!selectedId) return
    setSaving(true)

    await fetch('/api/onboarding/save-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionNum: 2,
        questionId: question.id,
        choiceValue: { optionId: selectedId, signals: question.options.find((o) => o.id === selectedId)?.signal },
      }),
    })

    setSaving(false)

    if (isLast) {
      setShowInsight(true)
    } else {
      setCurrentQ((q) => q + 1)
    }
  }

  if (showInsight) {
    return (
      <div className="space-y-8 pt-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{SESSION.title}</p>
        <InsightReveal
          insight={SESSION.insightHint}
          onResonate={() => router.push('/onboarding/session-3')}
          onNotQuite={() => router.push('/onboarding/session-3')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-4">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{SESSION.title}</p>
        <ProgressBar
          currentSession={2}
          totalSessions={4}
          currentQuestion={currentQ + 1}
          totalQuestions={SESSION.questions.length}
        />
      </div>

      <AnimatePresence mode="wait">
        <DilemmaChoice
          key={question.id}
          question={question}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </AnimatePresence>

      <Button onClick={handleNext} disabled={!selectedId || saving} className="w-full">
        {saving ? 'Сохраняем...' : isLast ? 'Завершить сессию' : 'Далее'}
      </Button>
    </div>
  )
}
