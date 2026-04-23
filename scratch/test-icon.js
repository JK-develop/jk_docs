const { PrismaClient } = require("./src/generated/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

async function test() {
  const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log("Testing category creation with icon...");
    const cat = await prisma.category.create({
      data: {
        name: "Test Icon Category",
        slug: "test-icon-" + Date.now(),
        icon: "Terminal"
      }
    });
    console.log("Success:", cat);
  } catch (err) {
    console.error("Failed to create category:", err);
  }
}

test();
