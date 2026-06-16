import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

function createClient() {
  const url = process.env.DATABASE_URL ?? ''
  if (url.startsWith('postgres')) {
    // Seed script only — disable cert verification for Supabase pooler self-signed chain
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const { PrismaPg } = require('@prisma/adapter-pg')
    const { Pool } = require('pg')
    const cleanUrl = url.replace(/[?&]sslmode=[^&]*/g, '').replace(/[?&]$/, '')
    const pool = new Pool({ connectionString: cleanUrl, ssl: { rejectUnauthorized: false } })
    return new PrismaClient({ adapter: new PrismaPg(pool) })
  }
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: 'dev.db' }) })
}

const prisma = createClient()

function seededFloat(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000
  return Math.abs(x - Math.floor(x))
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function generateVector(seed: number, dims = 128): number[] {
  return Array.from({ length: dims }, (_, i) => seededFloat(seed, i))
}

function makeProfile(userId: string, seed: number) {
  const s = (i: number) => seededFloat(seed, i)

  // Distribute attachment styles realistically
  const attachmentType = seed % 10
  let secure, anxious, avoidant, disorganized
  if (attachmentType < 5) {
    // 50% secure
    secure = 0.55 + s(1) * 0.3
    anxious = s(2) * 0.2
    avoidant = s(3) * 0.15
    disorganized = s(4) * 0.05
  } else if (attachmentType < 7) {
    // 20% anxious
    secure = 0.2 + s(1) * 0.25
    anxious = 0.45 + s(2) * 0.35
    avoidant = s(3) * 0.15
    disorganized = s(4) * 0.05
  } else if (attachmentType < 9) {
    // 20% avoidant
    secure = 0.2 + s(1) * 0.25
    anxious = s(2) * 0.15
    avoidant = 0.45 + s(3) * 0.35
    disorganized = s(4) * 0.05
  } else {
    // 10% mixed/disorganized
    secure = 0.2 + s(1) * 0.2
    anxious = 0.25 + s(2) * 0.2
    avoidant = 0.2 + s(3) * 0.2
    disorganized = 0.1 + s(4) * 0.2
  }

  return {
    userId,
    personalityVector: generateVector(seed),
    attachmentSecure: secure,
    attachmentAnxious: anxious,
    attachmentAvoidant: avoidant,
    attachmentDisorganized: disorganized,
    valuesAutonomy: s(5),
    valuesSecurity: s(6),
    valuesAchievement: s(7),
    valuesBenevolence: s(8),
    valuesConformity: s(9),
    valuesTradition: s(10),
    valuesPower: s(11),
    valuesStimulation: s(12),
    valuesHedonism: s(13),
    valuesUniversalism: s(14),
    valuesSelfDirection: s(15),
    valuesSpirit: s(16),
    conflictCompete: s(17) * 0.4,
    conflictAvoid: s(18) * 0.5,
    conflictAccommodate: s(19) * 0.4,
    conflictCollaborate: 0.3 + s(20) * 0.5,
    nervousActivation: s(21),
    nervousDeactivation: s(22),
    nervousWindowTolerance: 0.3 + s(23) * 0.5,
    emotionFlooding: s(24) * 0.5,
    emotionRumination: s(25) * 0.5,
    emotionRepair: 0.3 + s(26) * 0.5,
    emotionSuppression: s(27) * 0.4,
    emotionExpression: 0.3 + s(28) * 0.5,
    growthFixed: s(29) * 0.4,
    growthOriented: 0.4 + s(30) * 0.5,
    commDirect: 0.3 + s(31) * 0.5,
    commIndirect: s(32) * 0.4,
    commAssertive: 0.3 + s(33) * 0.4,
    commPassive: s(34) * 0.3,
    confidenceScores: {
      attachment: 0.7,
      values: 0.8,
      conflict: 0.65,
      nervous: 0.7,
      emotion: 0.75,
      growth: 0.8,
      communication: 0.7,
    },
    personalityInsights: {
      narrativeInsight: seed % 2 === 0
        ? 'Прослеживается тенденция к рефлексии и осознанному подходу в отношениях.'
        : 'Заметна ориентация на стабильность и глубину связей.',
      uncertaintyFlags: ['nervous_system baseline needs more data'],
    },
    rawOnboardingData: { seeded: true },
    lastInferredAt: new Date(),
  }
}

const NAMES = [
  'Алина', 'Михаил', 'Дарья', 'Артём', 'Полина',
  'Илья', 'Екатерина', 'Денис', 'Мария', 'Никита',
  'Анна', 'Роман', 'Виктория', 'Сергей', 'Юлия',
  'Максим', 'Ольга', 'Дмитрий', 'Наталья', 'Андрей',
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up
  await prisma.message.deleteMany()
  await prisma.match.deleteMany()
  await prisma.behavioralEvent.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('demo123', 12)

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@demo.com',
      name: 'Демо Пользователь',
      onboardingDone: true,
      onboardingStep: 5,
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'demo@demo.com',
          access_token: password,
        },
      },
    },
  })

  const demoSeed = hashString(demoUser.id)
  await prisma.profile.create({ data: makeProfile(demoUser.id, demoSeed) })

  // Create 20 seed users
  const seedUsers = []
  for (let i = 0; i < 20; i++) {
    const email = `user${i + 1}@souls-seed.dev`
    const existingPw = await bcrypt.hash(`password${i}`, 10)
    const user = await prisma.user.create({
      data: {
        email,
        name: NAMES[i],
        onboardingDone: true,
        onboardingStep: 5,
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: email,
            access_token: existingPw,
          },
        },
      },
    })
    const seed = hashString(user.id)
    await prisma.profile.create({ data: makeProfile(user.id, seed) })
    seedUsers.push(user)
    console.log(`  Created user: ${user.name}`)
  }

  // Create 3 matches for demo user
  const matchPartners = seedUsers.slice(0, 3)
  const matchScores = [0.82, 0.74, 0.68]

  for (let i = 0; i < matchPartners.length; i++) {
    const partner = matchPartners[i]
    const [aId, bId] = [demoUser.id, partner.id].sort()
    const score = matchScores[i]

    const match = await prisma.match.create({
      data: {
        userAId: aId,
        userBId: bId,
        layerScores: {
          nervous: score - 0.05 + Math.random() * 0.1,
          attachment: score - 0.1 + Math.random() * 0.15,
          values: score + Math.random() * 0.1,
          emotionalRegulation: score - 0.08 + Math.random() * 0.1,
          lifestyle: score - 0.05 + Math.random() * 0.1,
          growth: score + Math.random() * 0.08,
        },
        overallScore: score,
        chemistryScore: score - 0.05 + Math.random() * 0.1,
        stabilityScore: score + Math.random() * 0.08,
        tensionPoints: [
          {
            dimension: 'attachment',
            severity: 'low',
            description: 'Возможны небольшие различия в темпе сближения.',
            patternName: 'proximity-regulation mismatch',
          },
        ],
        resonancePoints: [
          {
            dimension: 'values',
            strength: 'strong',
            description: 'Общий акцент на аутентичности формирует прочную основу доверия.',
          },
        ],
        confidenceScore: 0.72,
        shownToA: true,
        shownToB: true,
        shownAt: new Date(),
      },
    })

    // Add seed messages for first 2 matches
    if (i < 2) {
      const messages = [
        { senderId: demoUser.id, content: 'Привет! Рада(рад) познакомиться.' },
        { senderId: partner.id, content: 'Привет! Взаимно. Видел(а) наш compatibility breakdown — очень интересно.' },
        { senderId: demoUser.id, content: 'Да, особенно zone of resonance по ценностям. Расскажи о себе?' },
      ]

      for (const msg of messages) {
        await prisma.message.create({
          data: {
            matchId: match.id,
            senderId: msg.senderId,
            content: msg.content,
            messageType: 'user',
          },
        })
      }
    }
  }

  console.log('\n✅ Seed complete!')
  console.log('   Demo login: demo@demo.com / demo123')
  console.log(`   ${seedUsers.length} seed users created`)
  console.log('   3 matches with conversations seeded for demo user')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
