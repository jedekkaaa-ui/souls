import { prisma } from '@/lib/db'

interface ProfileWithUser {
  id: string
  userId: string
  personalityVector: number[]
}

export async function findSimilarProfiles(
  userId: string,
  personalityVector: number[],
  limit = 200
): Promise<ProfileWithUser[]> {
  // pgvector cosine distance search
  // When pgvector is available: use $queryRaw with <=> operator
  // For stub/development without pgvector: fallback to fetching all and computing in-memory
  try {
    const vectorStr = `[${personalityVector.join(',')}]`
    const results = await prisma.$queryRaw<ProfileWithUser[]>`
      SELECT id, "userId", "personalityVector"
      FROM "Profile"
      WHERE "userId" != ${userId}
      ORDER BY "personalityVector"::vector <=> ${vectorStr}::vector
      LIMIT ${limit}
    `
    return results
  } catch {
    // Fallback: in-memory cosine similarity (for development without pgvector)
    const profiles = await prisma.profile.findMany({
      where: { userId: { not: userId } },
      select: { id: true, userId: true, personalityVector: true },
    })

    return profiles
      .map((p) => ({
        ...p,
        personalityVector: p.personalityVector as number[],
        similarity: cosineSimilarity(personalityVector, p.personalityVector as number[]),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}
