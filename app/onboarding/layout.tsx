import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  console.log('[onboarding layout] session:', JSON.stringify(session?.user))
  if (!session?.user) redirect('/login')
  if ((session.user as { onboardingDone?: boolean }).onboardingDone) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
