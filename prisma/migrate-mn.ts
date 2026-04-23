import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');

try {
  const db = new Database(dbPath);
  console.log("🔍 Checking for database migration from 1:N to M:N...");

  // Check if Guide table exists and has categoryId column
  const tableInfo: any = db.prepare("PRAGMA table_info(Guide)").all();
  const hasCategoryId = tableInfo.some((c: any) => c.name === 'categoryId');

  if (hasCategoryId) {
    console.log("📦 Found old categoryId column. Migrating relationships...");

    // 1. Create the join table manually (Prisma implicit naming convention)
    db.exec(`
      CREATE TABLE IF NOT EXISTS "_CategoryToGuide" (
        "A" INTEGER NOT NULL,
        "B" INTEGER NOT NULL,
        CONSTRAINT "_CategoryToGuide_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "_CategoryToGuide_B_fkey" FOREIGN KEY ("B") REFERENCES "Guide" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "_CategoryToGuide_AB_unique" ON "_CategoryToGuide"("A", "B");
      CREATE INDEX IF NOT EXISTS "_CategoryToGuide_B_index" ON "_CategoryToGuide"("B");
    `);

    // 2. Copy data from Guide.categoryId to join table
    const result = db.prepare(`
      INSERT OR IGNORE INTO "_CategoryToGuide" ("A", "B")
      SELECT categoryId, id FROM Guide WHERE categoryId IS NOT NULL
    `).run();

    console.log(`✅ Successfully migrated ${result.changes} relationships to the join table.`);
  } else {
    console.log("✨ Migration not needed: categoryId column already removed.");
  }
  
  db.close();
} catch (error) {
  console.log("⚠️ Migration script finished (it may fail if the database file is not yet created, which is normal on first deploy).");
  console.error("Details:", error);
}
