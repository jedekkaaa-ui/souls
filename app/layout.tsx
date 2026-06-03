import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { SessionProvider } from '@/components/SessionProvider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
  title: 'Souls — Глубокая совместимость',
  description: 'Психологическая платформа для поиска настоящей совместимости',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
          <SessionProvider>{children}</SessionProvider>
        </body>
    </html>
  )
}
