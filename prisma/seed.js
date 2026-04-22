// @ts-check
const { PrismaClient } = require("../src/generated/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  const devops = await prisma.category.upsert({
    where: { slug: "devops" },
    update: {},
    create: { slug: "devops", name: "DevOps" },
  });

  const backend = await prisma.category.upsert({
    where: { slug: "backend" },
    update: {},
    create: { slug: "backend", name: "Backend" },
  });

  await prisma.category.upsert({
    where: { slug: "frontend" },
    update: {},
    create: { slug: "frontend", name: "Frontend" },
  });

  const database = await prisma.category.upsert({
    where: { slug: "database" },
    update: {},
    create: { slug: "database", name: "Database" },
  });

  const tools = await prisma.category.upsert({
    where: { slug: "tools" },
    update: {},
    create: { slug: "tools", name: "Tools" },
  });

  const security = await prisma.category.upsert({
    where: { slug: "security" },
    update: {},
    create: { slug: "security", name: "Security" },
  });

  const design = await prisma.category.upsert({
    where: { slug: "design" },
    update: {},
    create: { slug: "design", name: "Design" },
  });

  console.log("✅ Categories ready.");

  const guides = [
    {
      slug: "deploy-nextjs-coolify-nixpacks",
      categoryId: devops.id,
      title: "Deploy Next.js on Coolify — Mac to Linux Platform Fix",
      tags: "coolify,nextjs,docker,nixpacks,linux",
      content: `## Problem
When developing on a Mac (Apple Silicon / arm64) and deploying to a Linux (x64) server via Coolify, npm ci fails because of platform-specific optional packages.

## Solution
1. Set Node.js Version: \`NIXPACKS_NODE_VERSION = 20\`
2. Change Install Command: \`npm install --force --os=linux --cpu=x64\`

This tells npm to install Linux-compatible packages even if the lockfile was generated on a Mac.`,
    },
    {
      slug: "nextjs-prisma-build-command-coolify",
      categoryId: devops.id,
      title: "Coolify Build Command for Next.js + Prisma (MySQL)",
      tags: "coolify,nextjs,prisma,mysql,build",
      content: `## Standard Build Command
\`\`\`bash
npx prisma generate && npx prisma db push && npm run build
\`\`\`

1. **prisma generate** — Generates the Prisma client.
2. **prisma db push** — Syncs schema with DB (crucial for build-time rendering).
3. **npm run build** — Builds the app.

Note: Use \`--accept-data-loss\` only during initial setup.`,
    },
    {
      slug: "sqlite-to-mysql-prisma-migration",
      categoryId: database.id,
      title: "Migrate Prisma from SQLite to MySQL — Auth.js Token Fix",
      tags: "prisma,mysql,sqlite,authjs,migration",
      content: `## Key Fixes
1. Change provider to "mysql" in schema.
2. Delete previous migrations.
3. Fix Auth.js Token Length: Use \`@db.Text\` for \`access_token\` and \`id_token\` fields.
4. Update DATABASE_URL to internal MySQL host in Coolify.`,
    },
    {
      slug: "coolify-mysql-internal-hostname",
      categoryId: database.id,
      title: "Finding the MySQL Internal Hostname in Coolify/Docker",
      tags: "coolify,mysql,docker,networking",
      content: `## Internal Connectivity
Docker containers in the same Coolify project communicate via internal hostnames, not localhost.

Find it in MySQL Resource → Configuration → **MySQL URL (internal)**.
Example: \`mysql://user:pass@cijv3lwi1triqxwi71co7ad1:3306/db\`
Hostname: \`cijv3lwi1triqxwi71co7ad1\``,
    },
    {
      slug: "docker-commands-reference",
      categoryId: devops.id,
      title: "Essential Docker Commands for Server Management",
      tags: "docker,cli,devops,server",
      content: `## Management
- \`docker ps\`: List running containers.
- \`docker stop <id>\`: Stop a container.
- \`docker exec -it <id> bash\`: Open terminal in container.
- \`docker system prune -a\`: Clean up unused resources.
- \`docker cp\`: Copy files between host and container.`,
    },
    {
      slug: "install-cloudpanel-v2-mariadb",
      categoryId: devops.id,
      title: "How to Install CloudPanel v2 with MariaDB on Ubuntu",
      tags: "cloudpanel,linux,mariadb,server,hetzner",
      content: `## Installation
For a fresh Ubuntu server, run the following command as root:

\`\`\`bash
curl -sS https://installer.cloudpanel.io/ce/v2/install.sh -o install.sh && \\
sudo DB_ENGINE=MARIADB_10.11 bash install.sh
\`\`\`

## What gets installed?
- Nginx (Web Server)
- MariaDB 10.11 (Database)
- ProFTPD
- PHP (Multiple versions)
- Node.js & NPM
- Redis & Varnish`,
    },
    {
      slug: "cloudpanel-ssl-certificate-fix",
      categoryId: security.id,
      title: "Fixing SSL Certificate Warnings for CloudPanel Admin",
      tags: "cloudpanel,ssl,security,cloudflare",
      content: `## Problem
By default, CloudPanel uses a self-signed certificate for the admin area (port 8443), causing browser warnings.

## Solution
1. In Cloudflare, map \`panel.yourdomain.com\` to your server IP.
2. In CloudPanel → Settings → **CloudPanel URL**, enter \`https://panel.yourdomain.com\`.
3. CloudPanel will automatically issue a Let's Encrypt certificate for itself.`,
    },
    {
      slug: "pm2-process-manager-nextjs",
      categoryId: tools.id,
      title: "Keep Next.js Running in Background with PM2",
      tags: "pm2,nextjs,nodejs,deployment",
      content: `## Background Execution
To ensure your site stays up after closing the terminal:

1. Install PM2: \`npm install -g pm2\`
2. Start app: \`pm2 start npm --name "my-app" -- run start\`
3. Save list: \`pm2 save\`
4. Startup script: \`pm2 startup\`

PM2 will automatically restart your app if it crashes or the server reboots.`,
    },
    {
      slug: "hetzner-dns-config-guide",
      categoryId: devops.id,
      title: "Configuring Hetzner DNS for DDomains and Subdomains",
      tags: "hetzner,dns,cloudflare,networking",
      content: `## DNS Setup
1. **A Record**: Point \`@\` and \`www\` to your server IP.
2. **Wildcard Record**: Point \`*\` to server IP (useful for dynamic subdomains in CloudPanel/Coolify).
3. **CNAME**: Use for services like Cloudflare CDN.

Always wait 5-30 minutes for propagation after changes.`,
    },
    {
      slug: "cloudpanel-architecture-overview",
      categoryId: devops.id,
      title: "CloudPanel Architecture: Classic vs Modern Containerization",
      tags: "cloudpanel,coolify,architecture,server",
      content: `## Classic Approach
CloudPanel installs services (Nginx, PHP, MySQL) directly on the OS.
- **Pros**: Fast, low overhead, perfect for PHP.
- **Cons**: Managing multiple Node.js versions is harder, less isolation.

## Comparison with Coolify
Coolify uses Docker for everything. It's more isolated and better for modern JS apps, whereas CloudPanel is the king of PHP hosting simplicity.`,
    },
    {
      slug: "coolify-persistent-storage-bind-mount",
      categoryId: devops.id,
      title: "Coolify Persistent Storage: Keep Config Files Across Deploys",
      tags: "coolify,docker,storage,devops",
      content: `## Bind Mounts
Files in containers are lost on deploy. Use Bind Mounts to persist them.
1. Create file on host: \`/opt/config.php\`
2. In Coolify → Storages tab: 
   Source: \`/opt/config.php\`
   Destination: \`/app/config.php\``,
    },
    {
      slug: "swap-memory-linux-oom-fix",
      categoryId: devops.id,
      title: "Add Swap Memory to Prevent OOM Crashes During Builds",
      tags: "linux,server,memory,swap,build",
      content: `## Prevent Build Crashes
1. Create 4GB file: \`fallocate -l 4G /swapfile\`
2. Set permissions: \`chmod 600 /swapfile\`
3. Setup swap: \`mkswap /swapfile && swapon /swapfile\`
4. Make persistent: Add to \`/etc/fstab\`.`,
    },
    {
      slug: "coolify-auto-deploy-github-cicd",
      categoryId: devops.id,
      title: "Coolify Auto-Deploy from GitHub (CI/CD Setup)",
      tags: "coolify,github,cicd,automation",
      content: `## CI/CD Workflow
1. Connect GitHub App in Coolify.
2. Enable "Auto Deploy" in Application settings.
3. Every \`git push\` triggers a Nixpacks build and zero-downtime rolling update.`,
    },
    {
      slug: "cloudflare-dns-records-coolify",
      categoryId: devops.id,
      title: "Cloudflare DNS Records for Coolify Deployments",
      tags: "cloudflare,dns,coolify,networking",
      content: `## Standard Records
- **A @**: Server IP (Proxy: ON)
- **A www**: Server IP (Proxy: ON)
- **CNAME cdn**: Cloudflare CDN endpoint
- **MX**: Point to Zoho/Google Mail servers.`,
    },
    {
      slug: "zoho-mail-free-setup-domain",
      categoryId: tools.id,
      title: "Business Email with Zoho Mail — Free Plan Setup",
      tags: "zoho,email,domain,tools",
      content: `## Setup
1. Verify domain via TXT record.
2. Set MX records: \`mx.zoho.com\`, \`mx2.zoho.com\`.
3. Setup SPF and DKIM for high deliverability.`,
    },
    {
      slug: "uptime-kuma-setup-alerts",
      categoryId: tools.id,
      title: "Uptime Kuma — Self-Hosted Monitoring with Telegram Alerts",
      tags: "monitoring,uptime-kuma,telegram,tools",
      content: `## Monitoring
1. Deploy Uptime Kuma via Coolify.
2. Add monitors for your URLs.
3. Connect Telegram Bot via Token and Chat ID for instant downtime alerts.`,
    },
    {
      slug: "mysql-external-access-tableplus",
      categoryId: database.id,
      title: "Access MySQL Externally via TablePlus",
      tags: "mysql,database,security,tableplus",
      content: `## Secure Connection
1. Best: Use **SSH Tunnel** in TablePlus/DBeaver.
2. Alternative: Enable "Public Access" in Coolify MySQL settings (Proxy port 33060) temporarily.
3. Always close public ports when done.`,
    },
    {
      slug: "hetzner-server-ssh-management",
      categoryId: devops.id,
      title: "Hetzner Server Management: SSH, Reboot, and Panel",
      tags: "hetzner,ssh,linux,server",
      content: `## Basic Ops
- SSH: \`ssh root@ip\`
- Reboot: \`reboot\`
- Disk: \`df -h\`
- Transfer files: \`scp local-file root@ip:/remote/path\``,
    },
    {
      slug: "docker-coolify-kubernetes-comparison",
      categoryId: devops.id,
      title: "Docker vs Kubernetes vs Coolify — Concepts Explained",
      tags: "docker,kubernetes,coolify,devops,concepts",
      content: `## Orchestration
- **Docker**: Single container management.
- **Kubernetes**: Complex multi-server cluster orchestration.
- **Coolify**: Simple UI managed Docker, "Heroku but on your own VPS".`,
    }
  ];

  for (const guide of guides) {
    await prisma.guide.upsert({
      where: { slug: guide.slug },
      update: {
        title: guide.title,
        content: guide.content,
        tags: guide.tags,
        categoryId: guide.categoryId,
      },
      create: {
        slug: guide.slug,
        title: guide.title,
        content: guide.content,
        tags: guide.tags,
        categoryId: guide.categoryId,
      },
    });
  }

  console.log(`✅ Seeded ${guides.length} guides.`);
  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
