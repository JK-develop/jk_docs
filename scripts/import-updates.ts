import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting Unified Bilingual System Documentation Import...");

  // 1. Create a unified category with both names
  const category = await prisma.category.upsert({
    where: { slug: "system-admin" },
    update: { 
      name: "System Admin",
      nameFa: "مدیریت سیستم",
      icon: "Shield" 
    },
    create: { 
      slug: "system-admin", 
      name: "System Admin",
      nameFa: "مدیریت سیستم",
      icon: "Shield"
    },
  });

  const updates = [
    {
      slug: "unified-bilingual-content",
      title: "Unified Bilingual Content Model",
      content: `## System Update: Unified Knowledge Base

We have transitioned from a language-segregated model to a **Unified Content Model**.

### What this means:
- **One Pool**: All guides are now in a single pool. You no longer need to switch UI language to see specific content.
- **Bilingual Categories**: Categories now hold both an English and a Persian name. The UI automatically displays the correct version based on your selection.
- **UI Localization**: Switching languages now only affects the platform's labels, menus, and navigation, while keeping all your technical documentation accessible at all times.

### Managing Content
In the Admin Panel, when you create a Category, you can now provide both its English and Persian titles simultaneously.`
    },
    {
      slug: "unified-bilingual-content-fa",
      title: "مدل محتوای یکپارچه دو زبانه",
      content: `## بروزرسانی سیستم: پایگاه دانش یکپارچه

ما از مدل تفکیک زبان به یک **مدل محتوای یکپارچه** تغییر وضعیت داده‌ایم.

### این به چه معناست:
- **یک منبع واحد**: همه راهنماها اکنون در یک منبع واحد هستند. دیگر نیازی نیست برای دیدن محتوای خاص، زبان رابط کاربری را تغییر دهید.
- **دسته‌بندی‌های دو زبانه**: دسته‌بندی‌ها اکنون دارای هر دو نام انگلیسی و فارسی هستند. رابط کاربری به طور خودکار نسخه صحیح را بر اساس انتخاب شما نمایش می‌دهد.
- **بومی‌سازی رابط کاربری**: تغییر زبان اکنون فقط بر برچسب‌ها، منوها و ناوبری پلتفرم تأثیر می‌گذارد، در حالی که تمام مستندات فنی شما را همیشه در دسترس نگه می‌دارد.

### مدیریت محتوا
در پنل مدیریت، هنگام ایجاد یک دسته‌بندی، اکنون می‌توانید هر دو عنوان انگلیسی و فارسی آن را به طور همزمان وارد کنید.`
    }
  ];

  for (const update of updates) {
    await prisma.guide.upsert({
      where: { slug: update.slug },
      update: {
        ...update,
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

  console.log("✨ Unified system documentation updated.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
