#!/bin/sh
set -e

echo "🚀 Starting application initialization..."

# 1. Run the custom migration script to save 1:N data before Prisma drops the column
echo "🛠️ Running custom relationship migration..."
npx tsx prisma/migrate-mn.ts

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
