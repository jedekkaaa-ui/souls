import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  return Math.round(score * 100).toString()
}

export function scoreToLabel(score: number): string {
  if (score >= 0.8) return 'Высокая'
  if (score >= 0.6) return 'Хорошая'
  if (score >= 0.4) return 'Умеренная'
  return 'Низкая'
}
