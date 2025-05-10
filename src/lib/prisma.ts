import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prismaClientSingleton = () => {
  // Add connection parameters to the URL
  const connectionUrl = process.env.DATABASE_URL + '?pgbouncer=true&connection_limit=1&pool_timeout=0';

  return new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: connectionUrl
      }
    }
  });
};

// Ensure we don't create multiple instances in development
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
