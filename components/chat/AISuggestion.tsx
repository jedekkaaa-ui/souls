'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { RequestType, SuggestionType, DepthLevel } from '@/types'

interface AISuggestionData {
  suggestion: string
  suggestionType: SuggestionType
  depthLevel: DepthLevel
  reasoning: string
}

interface AISuggestionProps {
  matchId: string
  onUse: (text: string) => void
}

const DEPTH_LABELS: Record<DepthLevel, string> = {
  1: 'Лёгкое',
  2: 'Среднее',
  3: 'Глубокое',
}

const REQUEST_LABELS: Record<RequestType, string> = {
  starter: 'Начать разговор',
  deepen: 'Углубить',
  insight: 'Наблюдение',
  repair: 'Восстановить',
}

export function AISuggestion({ matchId, onUse }: AISuggestionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AISuggestionData | null>(null)
  const [requestType, setRequestType] = useState<RequestType>('deepen')

  const fetchSuggestion = async (type: RequestType) => {
    setLoading(true)
    setRequestType(type)
    try {
      const res = await fetch(`/api/chat/${matchId}/ai-suggestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: type }),
      })
      const result = await res.json()
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-2 border-t border-border bg-card/50">
      <button
        onClick={() => {
          setIsOpen((v) => !v)
          if (!isOpen && !data) fetchSuggestion('deepen')
        }}
        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        AI-подсказка
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              <div className="flex gap-2 flex-wrap">
                {(Object.keys(REQUEST_LABELS) as RequestType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => fetchSuggestion(type)}
                    className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                      requestType === type
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {REQUEST_LABELS[type]}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="animate-spin">◐</span>
                  Генерирую...
                </div>
              )}

              {!loading && data && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      Глубина: {DEPTH_LABELS[data.depthLevel]}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed bg-background/80 rounded-lg p-3 border border-border">
                    {data.suggestion}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { onUse(data.suggestion); setIsOpen(false) }}>
                      Использовать
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => fetchSuggestion(requestType)}>
                      Другое
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                      Скрыть
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
