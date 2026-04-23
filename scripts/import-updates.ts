import { PrismaClient } from "../src/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting System Updates Documentation Import...");

  // 1. Create or get "System Admin" category
  const category = await prisma.category.upsert({
    where: { slug: "system-admin" },
    update: {},
    create: { 
      slug: "system-admin", 
      name: "System Admin" 
    },
  });

  const updates = [
    {
      slug: "multi-category-support",
      title: "Multi-Category Relationship Guide",
      content: `## System Update: Many-to-Many Relationships

The platform has been upgraded from a simple one-to-many relationship to a robust **Many-to-Many** system for Categories and Guides.

### Key Changes
- **Old System**: One guide could only belong to one category.
- **New System**: One guide can now be assigned to multiple categories (e.g., a guide can be both "DevOps" and "Security").

### Managing Categories
When editing a guide in the Admin Panel, you will now see a multi-select interface.
1. Click on category tags to toggle them.
2. Selected categories will be highlighted in green.
3. The changes are saved automatically when you submit the form.

### Technical Detail
This is implemented using a join table \`_CategoryToGuide\` which ensures data integrity across all relationships.`
    },
    {
      slug: "coolify-deployment-persistence",
      title: "Coolify Deployment & Data Persistence",
      content: `## Best Practices for SQLite & Persistent Volumes

When deploying this platform on Coolify using a persistent SQLite database, certain rules must be followed to avoid data loss or "Module Not Found" errors.

### 1. Persistent Volumes
The database is located at \`/app/prisma/dev.db\`. In Coolify, you must mount a persistent volume at \`/app/prisma\`.

### 2. The Volume Mount Pitfall
When you mount a volume at \`/app/prisma\`, it hides all files in that directory that were part of the Docker image (like \`schema.prisma\`).
- **Solution**: We moved the migration scripts to a separate \`/app/scripts\` directory.
- **Startup Logic**: Our \`start.sh\` automatically restores the schema file and runs migrations on the volume at every startup.

### 3. Build vs Runtime
- **Build Phase**: Prisma generate and a temporary DB push are run to allow Next.js page pre-rendering.
- **Runtime Phase**: The actual database migration happens when the container starts, ensuring your server's data is never overwritten by the build.`
    },
    {
      slug: "secure-admin-panel-setup",
      title: "Secure Admin Panel & Authentication",
      content: `## Managing Your Documentation Securely

The platform now includes a protected Admin Panel accessible via the sidebar (bottom-left button).

### Setup
1. Define the \`ADMIN_PASSWORD\` environment variable in your Coolify panel or \`.env\` file.
2. The system uses a secure cookie-based session with a 7-day expiration.

### Route Protection
- All routes under \`/admin/**\` are automatically protected by Next.js Middleware.
- Unauthorized attempts to access these pages will redirect to \`/admin/login\`.

### Editing Content
The Admin Panel allows you to:
- **CRUD Operations**: Create, Read, Update, and Delete both Guides and Categories.
- **Markdown Preview**: See how your documentation will look before publishing.
- **Live Search**: Quickly find existing guides to edit.`
    }
  ];

  for (const update of updates) {
    await prisma.guide.upsert({
      where: { slug: update.slug },
      update: {
        content: update.content,
        categories: {
          connect: { id: category.id }
        }
      },
      create: {
        ...update,
        categories: {
          connect: { id: category.id }
        }
      }
    });
    console.log(`✅ Imported: ${update.title}`);
  }

  console.log("✨ All system updates documented successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Adapter doesn't need explicit disconnect for SQLite
  });
