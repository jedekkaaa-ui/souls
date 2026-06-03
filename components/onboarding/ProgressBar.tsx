'use client'

import { Progress } from '@/components/ui/progress'

interface ProgressBarProps {
  currentSession: number
  totalSessions: number
  currentQuestion: number
  totalQuestions: number
}

export function ProgressBar({
  currentSession,
  totalSessions,
  currentQuestion,
  totalQuestions,
}: ProgressBarProps) {
  const sessionProgress = ((currentSession - 1) / totalSessions) * 100
  const questionProgress = (currentQuestion / totalQuestions) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Сессия {currentSession} из {totalSessions}</span>
        <span>{currentQuestion} из {totalQuestions}</span>
      </div>
      <Progress value={questionProgress} className="h-1" />
      <div className="flex gap-1">
        {Array.from({ length: totalSessions }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i < currentSession - 1
                ? 'bg-primary'
                : i === currentSession - 1
                ? 'bg-primary/50'
                : 'bg-secondary'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
