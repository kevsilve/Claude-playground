import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
  // Local file: keep as-is. Turso cloud URL: libsql://... needs no file: prefix
  const url = dbUrl.startsWith('file:') || dbUrl.startsWith('libsql:')
    ? dbUrl
    : `file:${dbUrl}`
  const authToken = process.env.TURSO_AUTH_TOKEN
  const adapter = new PrismaLibSql({ url, authToken })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any)
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof createPrismaClient>
} & typeof global

const prisma = globalThis.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export default prisma
