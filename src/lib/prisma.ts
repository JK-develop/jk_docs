import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });

// We explicitly create a new client to ensure it picks up the latest schema changes
// particularly after the many-to-many and icon additions.
export const prisma = new PrismaClient({ adapter });
