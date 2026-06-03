'use client'

import type { TensionPoint } from '@/types'

interface TensionAlertProps {
  tension: TensionPoint
}

const SEVERITY_STYLES = {
  high: 'bg-red-50 border-red-200 text-red-700',
  medium: 'bg-amber-50 border-amber-200 text-amber-700',
  low: 'bg-yellow-50 border-yellow-200 text-yellow-700',
}

const SEVERITY_ICONS = {
  high: '●',
  medium: '◐',
  low: '○',
}

export function TensionAlert({ tension }: TensionAlertProps) {
  return (
    <div className={`text-xs px-3 py-2 rounded-lg border ${SEVERITY_STYLES[tension.severity]}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">{SEVERITY_ICONS[tension.severity]}</span>
        <span className="font-medium">{tension.patternName}</span>
      </div>
      <p className="mt-0.5 opacity-90">{tension.description}</p>
    </div>
  )
}
