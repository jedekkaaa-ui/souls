'use client'

import { motion } from 'framer-motion'

interface MessageBubbleProps {
  content: string
  isOwn: boolean
  senderName: string
  createdAt: Date | string
  messageType: string
}

export function MessageBubble({ content, isOwn, senderName, createdAt, messageType }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })

  if (messageType === 'system') {
    return (
      <div className="flex justify-center">
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
          {content}
        </span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[75%] space-y-1 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <span className="text-xs text-muted-foreground px-1">{senderName}</span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-card border border-border text-foreground rounded-bl-sm'
          }`}
        >
          {content}
        </div>
        <span className="text-xs text-muted-foreground px-1">{time}</span>
      </div>
    </motion.div>
  )
}
