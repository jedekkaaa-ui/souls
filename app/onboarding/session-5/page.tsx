'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

const OPENING_MESSAGE: Message = {
  role: 'assistant',
  content: 'Привет. Мы уже немного узнали тебя через твои выборы. Хочу задать один вопрос, на который нет правильного ответа.\n\nКогда тебе по-настоящему хорошо — что именно происходит? Как это ощущается?',
}

const AI_FOLLOW_UPS = [
  'Интересно. А если попробовать это описать — что именно делает этот момент таким? Что в нём есть, чего обычно нет?',
  'Мне кажется, я начинаю понимать. Это состояние — оно связано с людьми рядом, или скорее с чем-то внутри тебя?',
  'Спасибо. Последний вопрос: есть что-то, что ты ищешь в другом человеке, о чём обычно не говоришь вслух?',
]

export default function Session5Page() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiIndex, setAiIndex] = useState(0)
  const [canFinish, setCanFinish] = useState(false)
  const [completing, setCompleting] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isTyping) return

    setInput('')

    const userMsg: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])

    await fetch('/api/onboarding/save-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionNum: 5,
        questionId: `s5_freetext_${aiIndex}`,
        choiceValue: { text },
      }),
    })

    const nextIndex = aiIndex + 1

    if (nextIndex > AI_FOLLOW_UPS.length) {
      setCanFinish(true)
      return
    }

    setIsTyping(true)
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800))
    setIsTyping(false)

    const aiReply: Message = {
      role: 'assistant',
      content: AI_FOLLOW_UPS[aiIndex] ?? '',
    }

    if (aiReply.content) {
      setMessages((prev) => [...prev, aiReply])
    }

    setAiIndex(nextIndex)
    if (nextIndex >= AI_FOLLOW_UPS.length) {
      setCanFinish(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    await fetch('/api/onboarding/complete', { method: 'POST' })
    router.push('/onboarding/complete')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="space-y-2 pb-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Свободный разговор</p>
        <p className="text-sm text-muted-foreground">Последняя часть. Просто отвечай как думаешь.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-card border border-border text-foreground rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="space-y-2 pt-2 border-t border-border">
        {canFinish && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button onClick={handleComplete} disabled={completing} className="w-full">
              {completing ? 'Завершаем...' : 'Завершить онбординг →'}
            </Button>
          </motion.div>
        )}
        {!canFinish && (
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напиши что думаешь..."
              rows={2}
              className="flex-1 resize-none px-3 py-2 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isTyping} size="icon" className="self-end h-10 w-10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
