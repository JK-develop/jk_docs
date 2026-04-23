#!/bin/sh
set -e

echo "🚀 Starting application initialization..."

# Ensure schema.prisma exists in the volume (it might be hidden by the mount)
cp scripts/schema.prisma.backup prisma/schema.prisma || true

# 1. Run the custom migration script to save 1:N data before Prisma drops the column
echo "🛠️ Running custom relationship migration..."
node scripts/migrate-mn.js

# 2. Push the new schema to the database (in the persistent volume)
# We use --accept-data-loss because we are dropping the categoryId column, 
# but our migrate-mn.ts script has already saved that data into the join table.
echo "🔄 Synchronizing database schema with Prisma..."
npx prisma db push --accept-data-loss

# 3. Regenerate client just to be sure it matches the runtime environment
npx prisma generate

# 4. Start the application
echo "✨ Starting the web server..."
npm run start
