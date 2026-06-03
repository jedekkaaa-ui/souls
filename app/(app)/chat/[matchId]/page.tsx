'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { AISuggestion } from '@/components/chat/AISuggestion'
import { ConversationDepthIndicator } from '@/components/chat/ConversationDepthIndicator'
import { Button } from '@/components/ui/button'
import { use } from 'react'

interface Message {
  id: string
  content: string
  senderId: string
  messageType: string
  createdAt: string
  sender: { id: string; name: string | null; avatarUrl: string | null }
}

export default function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params)
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/chat/${matchId}/messages`)
      .then((r) => r.json())
      .then(setMessages)
  }, [matchId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    const text = input.trim()
    setInput('')

    const res = await fetch(`/api/chat/${matchId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    })

    if (res.ok) {
      const msg = await res.json()
      setMessages((prev) => [...prev, msg])
    }
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <ConversationDepthIndicator messageCount={messages.length} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Начните разговор
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            isOwn={msg.senderId === session?.user?.id}
            senderName={msg.sender.name ?? '?'}
            createdAt={msg.createdAt}
            messageType={msg.messageType}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border">
        <AISuggestion
          matchId={matchId}
          onUse={(text) => setInput(text)}
        />
        <div className="flex gap-2 p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Написать сообщение..."
            rows={1}
            className="flex-1 resize-none px-3 py-2 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
          <Button onClick={send} disabled={!input.trim() || sending} size="icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
