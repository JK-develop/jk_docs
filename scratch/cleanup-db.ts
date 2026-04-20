import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  
  // Order matters for relational integrity if not using cascade
  await prisma.article.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Database cleared successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
