const { prisma } = require('./src/lib/prisma');

async function test() {
  try {
    const guide = await prisma.guide.findFirst();
    console.log('Guide found:', guide);
    console.log('Tags field test:', guide?.tags);
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
