import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { accounts: true },
        })

        if (!user) return null

        // Find the credentials account
        const credAccount = user.accounts.find((a) => a.provider === 'credentials')
        if (!credAccount?.access_token) return null

        const valid = await bcrypt.compare(parsed.data.password, credAccount.access_token)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          onboardingDone: user.onboardingDone,
          onboardingStep: user.onboardingStep,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.onboardingDone = (user as { onboardingDone?: boolean }).onboardingDone
        token.onboardingStep = (user as { onboardingStep?: number }).onboardingStep
      }
      if (trigger === 'update' && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { onboardingDone: true, onboardingStep: true },
        })
        if (dbUser) {
          token.onboardingDone = dbUser.onboardingDone
          token.onboardingStep = dbUser.onboardingStep
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as { onboardingDone?: boolean }).onboardingDone = token.onboardingDone as boolean
        ;(session.user as { onboardingStep?: number }).onboardingStep = token.onboardingStep as number
      }
      return session
    },
  },
})
