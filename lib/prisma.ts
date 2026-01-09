import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Supabase connection pooler için özel yapılandırma
// Connection pooler (pgbouncer) prepared statement'ları desteklemediği için
// connection string'e ?pgbouncer=true eklenmeli
// Prisma Client singleton pattern ile kullanılıyor, bu connection pooler ile uyumlu
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

// Always set to global in both development and production to prevent multiple instances
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown - connection'ları düzgün kapat
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}

export { prisma }


