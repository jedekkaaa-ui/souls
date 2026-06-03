import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const jwtDone = (session.user as { onboardingDone?: boolean }).onboardingDone
  if (!jwtDone) {
    // JWT may be stale after onboarding completes — check DB as source of truth
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboardingDone: true },
    })
    if (!dbUser?.onboardingDone) redirect('/onboarding/welcome')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg text-foreground">
            Souls
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/dashboard" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
              Главная
            </Link>
            <Link href="/matches" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
              Матчи
            </Link>
            <Link href="/profile" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary">
              Профиль
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  )
}
