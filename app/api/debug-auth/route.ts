import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'demo@demo.com' },
      select: {
        id: true,
        email: true,
        accounts: {
          select: {
            provider: true,
            access_token: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ found: false })
    }

    const credAccount = user.accounts.find((a) => a.provider === 'credentials')

    return NextResponse.json({
      found: true,
      accountsCount: user.accounts.length,
      hasCredentialsAccount: !!credAccount,
      hasAccessToken: !!credAccount?.access_token,
      accessTokenLength: credAccount?.access_token?.length ?? 0,
      accessTokenStart: credAccount?.access_token?.substring(0, 7) ?? null,
      looksLikeBcrypt: credAccount?.access_token?.startsWith('$2') ?? false,
    })
  } catch (err) {
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    )
  }
}
