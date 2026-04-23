import { PrismaClient } from "../src/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // -- Categories --
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

  const frontend = await prisma.category.upsert({
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

  // Reference to suppress "unused" lint warning
  void [security, design, frontend];

  console.log("✅ Categories created.");

  // -- Guides --
  const guides = [
    {
      slug: "deploy-nextjs-coolify-nixpacks",
      categoryId: devops.id,
      title:
        "Deploy Next.js on Coolify with Nixpacks (Mac → Linux Platform Fix)",
      content: `## Problem

When developing on a Mac (Apple Silicon / arm64) and deploying to a Linux (x64) server via Coolify, \`npm ci\` fails with:

\`\`\`
npm error notsup Unsupported platform for @parcel/watcher-darwin-arm64
\`\`\`

This happens because \`package-lock.json\` locks platform-specific optional packages (darwin/arm64) that cannot be installed on Linux.

## Root Cause

- \`npm ci\` strictly enforces \`package-lock.json\`
- The lock file contains Mac-specific optional dependencies
- Nixpacks uses \`npm ci\` in production mode by default

## Solution — Coolify Configuration

### 1. Set Node.js Version
In the project's **Environment Variables** tab:
\`\`\`
NIXPACKS_NODE_VERSION = 20
\`\`\`

### 2. Change Install Command
In **Configuration → Build**:
\`\`\`bash
npm install --force --os=linux --cpu=x64
\`\`\`

The \`--force\` flag combined with \`--os\` and \`--cpu\` overrides tells npm to ignore the Mac-specific cached packages and install Linux-compatible versions instead.

### Why This Works
- \`--force\` skips lock file strictness
- \`--os=linux --cpu=x64\` instructs npm to resolve platform-specific optional packages for the server architecture
- The regular \`package.json\` is used without the platform-locked entries from \`package-lock.json\`

## Result
The install step completes successfully and build proceeds:
\`\`\`
added 605 packages, and audited 606 packages in 25s
\`\`\`

> **Note:** Do NOT remove \`package-lock.json\` from git. It ensures deterministic builds and is intentionally committed. The platform conflict is solved at install-time, not by removing the lock file.
`,
    },
    {
      slug: "nextjs-prisma-build-command-coolify",
      categoryId: devops.id,
      title: "Coolify Build Command for Next.js + Prisma (MySQL)",
      content: `## Standard Build Command

In Coolify **Configuration → Build Command**:

\`\`\`bash
npx prisma generate && npx prisma db push && npm run build
\`\`\`

This sequence:
1. **\`prisma generate\`** — Generates the Prisma client from schema
2. **\`prisma db push\`** — Pushes schema changes to the database (creates tables if they don't exist)
3. **\`npm run build\`** — Builds the Next.js application

## Why \`db push\` is Needed During Build

Next.js tries to pre-render pages during build. If any page fetches from the database and the tables don't exist yet, the build fails with:

\`\`\`
PrismaClientKnownRequestError: The table 'main.Product' does not exist
\`\`\`

Running \`prisma db push\` before the build ensures tables exist.

## ⚠️ The \`--accept-data-loss\` Flag

When initially migrating to a new database type (e.g., SQLite → MySQL):
\`\`\`bash
npx prisma generate && npx prisma db push --accept-data-loss && npm run build
\`\`\`

**Remove this flag after initial setup!** Leaving it in production means future schema changes could silently drop data.

## Required Environment Variables

\`\`\`
HOSTNAME = 0.0.0.0
AUTH_URL = https://your-domain.com
DATABASE_URL = mysql://user:pass@internal-host:3306/dbname
\`\`\`

## Port Configuration

Next.js listens on port \`3000\` by default. Set **Ports Exposes = 3000** in Coolify configuration.
`,
    },
    {
      slug: "sqlite-to-mysql-prisma-migration",
      categoryId: database.id,
      title: "Migrate Prisma from SQLite to MySQL (Auth.js Token Fix)",
      content: `## Migration Steps

### 1. Update \`prisma/schema.prisma\`

Change the datasource provider:
\`\`\`prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
\`\`\`

### 2. Delete the \`migrations\` Folder

The SQLite migration history is incompatible with MySQL. Delete \`prisma/migrations/\` entirely.

### 3. Fix the OAuth Token Length Error

When using Auth.js (NextAuth) with Google OAuth on MySQL, login fails with:

\`\`\`
The provided value for the column is too long for the column's type. Column: access_token
\`\`\`

**Cause:** MySQL maps Prisma's \`String\` to \`VARCHAR(191)\`, but OAuth tokens are much longer.

**Fix — Update the Account model in schema.prisma:**
\`\`\`prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
\`\`\`

Adding \`@db.Text\` instructs Prisma to use MySQL's \`TEXT\` type (unlimited length) instead of \`VARCHAR(191)\`.

### 4. Set DATABASE_URL in Coolify

Use the **Internal Database URL** from the Coolify MySQL resource:
\`\`\`
mysql://user:password@internal-hostname:3306/database_name
\`\`\`

### 5. Local Development Setup

For local Mac development, use a local MySQL instance (DBngin or Homebrew):
\`\`\`
DATABASE_URL="mysql://root:@127.0.0.1:3306/my_local_db"
\`\`\`

Install MySQL on Mac:
\`\`\`bash
brew install mysql
brew services start mysql
\`\`\`

Or use the free **DBngin** app (no system file pollution).

**Never connect local dev to the production database.**
`,
    },
    {
      slug: "coolify-mysql-internal-hostname",
      categoryId: database.id,
      title:
        "Finding the Correct Internal Hostname for MySQL in Coolify/Docker",
      content: `## The Problem

When two Docker containers need to communicate (e.g., a PHP app connecting to MySQL), you cannot use \`localhost\`. Docker containers are isolated.

Error you'll see:
\`\`\`
php_network_getaddresses: getaddrinfo for mysql-database-xyz failed: Temporary failure in name resolution
\`\`\`

## Finding the Internal Hostname

In Coolify, go to your **MySQL database resource** → Configuration tab.

Look for **"MySQL URL (internal)"** — it looks like:
\`\`\`
mysql://user:password@cijv3lwi1triqxwi71co7ad1:3306/dbname
\`\`\`

The part **after the \`@\` symbol and before \`:\`** is the internal hostname:
\`\`\`
cijv3lwi1triqxwi71co7ad1
\`\`\`

This is what you use as the \`DB_HOST\` in your application config.

## Key Rule: Same Project = Same Network

Containers can only resolve each other's hostnames if they are in the **same Coolify project and environment**.

If your PHP app is in project A and MySQL is in project B, they are in different Docker networks and cannot communicate by name.

## phpMyAdmin Setup

When setting up phpMyAdmin via Coolify, set:
\`\`\`
PMA_HOST = cijv3lwi1triqxwi71co7ad1
\`\`\`

For the login page:
- **Username:** \`mysql\` (the normal user, not \`root\` — root is locked for remote access in MySQL 8)
- **Password:** The Normal User Password from Coolify MySQL settings

## MySQL 8 Root Access Restriction

In MySQL 8, the \`root\` user is locked for remote connections by default. Use the **normal user** shown in Coolify's MySQL settings for all application connections.
`,
    },
    {
      slug: "docker-commands-reference",
      categoryId: devops.id,
      title: "Essential Docker Commands for Server Management",
      content: `## Container Management

\`\`\`bash
# List all running containers with status and ports
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop <container_id>

# Restart a container
docker restart <container_id>

# Remove a container
docker rm <container_id>
\`\`\`

## File Operations

\`\`\`bash
# Copy a file FROM your machine TO a container
docker cp /local/path/file.ext container_id:/path/inside/container/

# Copy a file FROM a container TO your machine
docker cp container_id:/path/inside/container/file.ext /local/destination/

# Example: copy database backup into container
docker cp /root/dev.db 73777670c2d3:/app/prisma/dev.db
\`\`\`

## Inspecting Containers

\`\`\`bash
# View real-time logs
docker logs -f <container_id>

# Execute a command inside a running container
docker exec -it <container_id> bash

# List files inside a container's /app directory
docker exec <container_id> ls -la /app
\`\`\`

## Disk and Resource Usage

\`\`\`bash
# Show disk usage by Docker (images, containers, volumes)
docker system df

# Check total disk usage on server
df -h /

# Clean up unused Docker resources
docker system prune -a
\`\`\`

## Important Notes

- **Container ID changes** every time you deploy. Never hardcode container IDs.
- When you \`docker cp\` a file into a container, it is **lost on next deploy** unless you use Persistent Storage (Bind Mounts).
- The container name format in Coolify: \`{resource-uuid}-{deployment-id}\`
`,
    },
    {
      slug: "coolify-persistent-storage-config-files",
      categoryId: devops.id,
      title:
        "Coolify Persistent Storage: Keeping Config Files Across Deploys",
      content: `## The Problem

When using Coolify's CI/CD (auto-deploy from GitHub), each deployment creates a **brand new container**, destroying any files you manually placed in the old container.

Files that WILL be lost on deploy:
- Manually created \`config.php\`
- Uploaded files not in Git
- Any changes made directly inside the container

## Solution: Bind Mount (Persistent Storage)

A Bind Mount links a file/directory on the **host server** to a path inside the container.

### Step 1: Create the File on the Server

SSH into server or use Coolify's Server Terminal:

\`\`\`bash
# Create config file in a safe location outside the app
nano /opt/karimi-config.php
\`\`\`

Paste config content, then save: \`Ctrl+X\` → \`Y\` → \`Enter\`

### Step 2: Add Storage Mount in Coolify

Application settings → **Storages** tab:

- **Source Path** (on host server): \`/opt/karimi-config.php\`
- **Destination Path** (inside container): \`/app/config.php\`

### Step 3: Redeploy

Click **Deploy** to apply the mount. From now on, every new container will have access to the config file.

### Nixpacks Default Code Location

Nixpacks places the application code in \`/app/\`.

Verify with:
\`\`\`bash
# In Coolify's application Terminal tab:
ls -la /app
\`\`\`

## Best Practices

- Store config files in \`/opt/appname-config/\` on the server
- Never commit sensitive files (\`config.php\`, \`.env\`) to Git
- Use Bind Mounts for: database config, SMTP credentials, API keys
`,
    },
    {
      slug: "swap-memory-linux-server",
      categoryId: devops.id,
      title: "Add Swap Memory to Prevent OOM Crashes During Builds",
      content: `## Why Builds Crash (OOM Error)

Building Next.js projects with Prisma is memory-intensive. If server RAM is full during a build, the Linux kernel kills the process. This results in a 502 Bad Gateway or exit code 255.

Signs of an OOM problem:
- Build exits with code 255
- 502 Bad Gateway after deployment
- Server becomes unresponsive during deploy

## Create a 4GB Swap File

Run these commands on your server (via SSH or Coolify's Server Terminal):

\`\`\`bash
# Create a 4GB swap file
fallocate -l 4G /swapfile

# Restrict permissions (security requirement)
chmod 600 /swapfile

# Format as swap space
mkswap /swapfile

# Activate the swap
swapon /swapfile

# Make swap permanent (survives reboots)
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
\`\`\`

## Verify Swap is Active

\`\`\`bash
swapon --show
free -h
\`\`\`

## Restart the Server After OOM

If the server is already unresponsive:

\`\`\`bash
# SSH in and reboot
ssh root@your-server-ip
reboot
\`\`\`

Or use Hetzner Cloud Console → Power → Restart.

After reboot (~2-3 minutes), Coolify and all containers restart automatically.

## Monitor Memory During Build

\`\`\`bash
# Watch memory usage live
watch -n 2 free -h
\`\`\`
`,
    },
    {
      slug: "coolify-auto-deploy-github",
      categoryId: devops.id,
      title: "Coolify Auto-Deploy from GitHub (CI/CD Setup)",
      content: `## Two Integration Methods

### Method 1: GitHub App (Recommended)

If Coolify is connected via a GitHub App, auto-deploy works automatically.

**To enable Auto Deploy:**
1. Application → **Advanced** tab
2. Enable the **Auto Deploy** toggle

Every \`git push\` to the configured branch triggers a deployment automatically.

### Method 2: Manual Webhook

1. Coolify → application → **Webhooks** tab, copy the Webhook URL
2. GitHub: repository → **Settings → Webhooks → Add webhook**
3. Paste the URL, Content-Type: \`application/json\`, select "push event"

## Granting Repository Access (GitHub App method)

If a repository doesn't appear in Coolify's dropdown:

1. GitHub → Profile → **Settings → Integrations → GitHub Apps**
2. Find your Coolify app → **Configure**
3. Under **Repository access**, add the specific repository
4. Save

## What Happens on Each Push

1. GitHub notifies Coolify via webhook
2. Coolify fetches latest code from the configured branch
3. Nixpacks/Docker builds a new image using the install + build commands
4. New container starts (rolling update — zero downtime)
5. Old container stops

Full logs are visible in Coolify → application → **Deployments** tab.
`,
    },
    {
      slug: "deploy-php-coolify-nixpacks",
      categoryId: devops.id,
      title: "Deploy a PHP Project on Coolify (Nixpacks)",
      content: `## Configuration Settings

When adding a PHP project from GitHub in Coolify:

| Setting        | Value     | Notes |
|----------------|-----------|-------|
| Build Pack     | Nixpacks  | Auto-detects PHP |
| Base Directory | \`/\`      | Root of the repository |
| Port           | **80**    | Web servers listen on port 80, NOT 3000 |
| Is static site | ❌ Off    | PHP projects are dynamic |

> **Important:** The default port in Coolify is 3000 (for Node.js). PHP web servers use port **80**. Change this or you'll get a 502 error.

## Subdomain Setup in Cloudflare

Before deploying, configure DNS:
1. Cloudflare → DNS → Add record
2. Type: A | Name: subdomain | Value: server-ip | Proxy: ON

## Debug: 403 Forbidden Error

If you get 403, check the container:

\`\`\`bash
# In Coolify Terminal tab for the application:
ls -la /app
\`\`\`

Common issues:
- **\`index.php\` is missing** — Bind Mount overwrote the directory
- **Wrong file name** — Linux is case-sensitive; must be \`index.php\` (lowercase)
- **Files in subdirectory** — Change Base Directory to \`/public\`

## Database Connection in PHP

Use the **internal Docker hostname** (not \`localhost\`):
\`\`\`php
<?php
define('DB_HOST', 'cijv3lwi1triqxwi71co7ad1'); // Coolify internal hostname
define('DB_NAME', 'mydb');
define('DB_USER', 'mysql');          // Normal user, not root
define('DB_PASS', 'your-password');
\`\`\`

## Project Isolation Best Practice

Create a **separate Coolify project** for each application.

Benefits:
- Independent environment variables and secrets
- Clean teardown without affecting other projects
- Clear visual separation in the dashboard
`,
    },
    {
      slug: "cloudflare-dns-coolify-setup",
      categoryId: devops.id,
      title: "Cloudflare DNS Records for Coolify Deployments",
      content: `## Main Domain Setup

| Type | Name | Value          | Proxy |
|------|------|----------------|-------|
| A    | @    | your.server.ip | ✅ On |
| A    | www  | your.server.ip | ✅ On |

## Subdomain Setup

For each subdomain (e.g., \`karimi.domain.com\`):

| Type | Name   | Value          | Proxy      |
|------|--------|----------------|------------|
| A    | karimi | your.server.ip | ✅ On      |
| A    | kuma   | your.server.ip | ❌ Off (DNS Only for monitoring tools) |

## Zoho Mail DNS Records

**MX Records (receive email):**
\`\`\`
MX | @ | mx.zoho.com  | Priority 10
MX | @ | mx2.zoho.com | Priority 20
MX | @ | mx3.zoho.com | Priority 50
\`\`\`

**SPF (prevent spam):**
\`\`\`
TXT | @ | v=spf1 include:zohomail.com ~all
\`\`\`

**DKIM (email signature):**
\`\`\`
TXT | zmail._domainkey | v=DKIM1; k=rsa; p=<key-from-zoho>
\`\`\`

## Important Notes

- Records to preserve: \`google-site-verification=...\` TXT records (for Search Console)
- Multiple TXT records on the same name coexist without conflict
- After changing files through Cloudflare, purge cache: **Caching → Configuration → Purge Everything**

## Coolify Domain Configuration

In application settings → **Domains**:
\`\`\`
https://yourdomain.com,https://www.yourdomain.com
\`\`\`

After changing domains, click **Redeploy** to apply (Traefik needs to reconfigure).
`,
    },
    {
      slug: "zoho-mail-free-setup",
      categoryId: tools.id,
      title: "Set Up Free Business Email with Zoho Mail (Custom Domain)",
      content: `## Zoho Mail Free Plan

The **Forever Free plan** allows:
- Up to **5 email accounts** on your domain
- 5 GB storage per account
- Full send/receive + mobile app access
- No credit card required

## Setup Steps

### 1. Sign Up

Go to [zoho.com/mail](https://www.zoho.com/mail/) → scroll to pricing → find **Forever Free Plan** → **Add an existing domain**

### 2. Domain Verification

Zoho gives you a TXT record:
\`\`\`
type: TXT | name: @ | content: zoho-verification=zb12345678.zm.zoho.com
\`\`\`

Add in Cloudflare → click **Verify TXT Record** in Zoho.

### 3. Configure DNS in Cloudflare

**MX Records:**
\`\`\`
MX | @ | mx.zoho.com  | 10
MX | @ | mx2.zoho.com | 20
MX | @ | mx3.zoho.com | 50
\`\`\`

**SPF:**
\`\`\`
TXT | @ | v=spf1 include:zohomail.com ~all
\`\`\`

**DKIM:**
\`\`\`
TXT | zmail._domainkey | v=DKIM1; k=rsa; p=<long-key-from-zoho>
\`\`\`

Click **Verify All Records** in Zoho — all should go green immediately (Cloudflare propagates instantly).

## Adding More Email Accounts

Admin panel: [mailadmin.zoho.com](https://mailadmin.zoho.com) → **Users → Add**
- Fill in name and Email ID (e.g., \`support\` → \`support@yourdomain.com\`)
- Up to 5 accounts on free plan

## SMTP Settings (for PHPMailer, etc.)

\`\`\`
SMTP Host: smtp.zoho.com
Port: 465 (SSL) or 587 (TLS)
Username: info@yourdomain.com
Password: your-zoho-email-password
\`\`\`

## Access Email

- Web: [mail.zoho.com](https://mail.zoho.com)
- Mobile: Zoho Mail app (iOS/Android)
`,
    },
    {
      slug: "uptime-kuma-monitoring-telegram",
      categoryId: tools.id,
      title: "Uptime Kuma: Server Monitoring with Telegram Alerts",
      content: `## What is Uptime Kuma?

A self-hosted monitoring tool that checks if websites, APIs, and databases are online. Sends instant notifications when something goes down.

## Installation via Coolify

### 1. Prepare Subdomain in Cloudflare
\`\`\`
Type: A | Name: kuma | Value: server-ip | Proxy: OFF (DNS Only)
\`\`\`

### 2. Deploy in Coolify

1. Project → **New Resource → Service (One-click)**
2. Search: **Uptime Kuma** (select SQLite version — not MariaDB/MySQL)
3. Set Domain: \`https://kuma.yourdomain.com:3001\`

> The port \`:3001\` must be included — Uptime Kuma runs internally on port 3001.

4. **Deploy**

### 3. First Login

Visit \`https://kuma.yourdomain.com\` → choose **SQLite** → create admin credentials.

## Setting Up Telegram Notifications

### Create a Telegram Bot

1. In Telegram, search [@BotFather](https://t.me/BotFather)
2. Send \`/newbot\` → set a name and username
3. Copy the **Bot Token** (e.g., \`123456:ABC-DEF...\`)

### Get Your Chat ID

1. Start chat with [@userinfobot](https://t.me/userinfobot)
2. It replies with your numeric **Chat ID**

### Configure in Uptime Kuma

1. Edit any monitor → **Notifications** section
2. **Setup Notification** → Type: **Telegram**
3. Paste **Bot Token** and **Chat ID**
4. Click **Test** — verify message received
5. **Save**

## Custom Message Template

\`\`\`liquid
{% if status == '0' %}
🚨 <b>CRITICAL ALERT: SERVICE DOWN</b> 🚨
{% elsif status == '1' %}
✅ <b>SYSTEM RECOVERY: SERVICE UP</b> ✅
{% else %}
⚠️ <b>SYSTEM NOTIFICATION</b> ⚠️
{% endif %}

📌 <b>Service Name:</b> <code>{{ name }}</code>
🔗 <b>Target URL:</b> <a href="{{ hostnameOrURL }}">{{ hostnameOrURL }}</a>

📝 <b>Status Detail:</b>
<pre>{{ msg }}</pre>
\`\`\`

> Do NOT use HTML comments (\`<!-- -->\`) — Telegram API rejects them.

## Monitoring Checklist

For each important service, add a monitor:
- Main website (\`https://yourdomain.com\`)
- API endpoints
- Admin panels
- Database connection (TCP port ping)
`,
    },
    {
      slug: "mysql-external-access-tableplus",
      categoryId: database.id,
      title: "Access MySQL Database Externally via TablePlus or phpMyAdmin",
      content: `## Temporary External Access (For Import/Export Only)

### 1. Enable Public Port in Coolify

MySQL database resource → **General** tab → **Proxy** section:
- Enable **"Make it publicly available"**
- Set Public Port: \`33060\` (non-standard port for security)
- **Save** → **Restart** the database

### 2. Connect with TablePlus (Mac)

| Setting  | Value               |
|----------|---------------------|
| Type     | MySQL               |
| Host     | your-server-ip      |
| Port     | 33060               |
| User     | root                |
| Password | MySQL root password |

### 3. Import SQL File

TablePlus: **File → Import → From SQL dump**
phpMyAdmin: **Database → Import → Choose SQL file**

### 4. Close the Port After Use ⚠️

**ALWAYS disable public access after you're done:**

Coolify → MySQL → Proxy → Disable **"Make it publicly available"** → Save → Restart

Leaving a database port open exposes it to brute-force attacks.

## Secure Access: SSH Tunnel (Recommended)

In TablePlus:
- Enable **SSH** tab
- SSH Host: \`your-server-ip\`
- SSH User: \`root\`
- The app tunnels MySQL traffic through encrypted SSH

No port needs to be opened publicly.

## phpMyAdmin Notes

- **PMA_HOST** = the internal Docker hostname (not \`localhost\`)
- Login with **normal user** (\`mysql\`), not \`root\`
- phpMyAdmin and MySQL must be in the **same Coolify project** to communicate
`,
    },
    {
      slug: "hetzner-server-ssh-management",
      categoryId: devops.id,
      title: "Hetzner Server Management: SSH, Reboot, and Panel Overview",
      content: `## Connecting via SSH

\`\`\`bash
# Connect to server
ssh root@your-server-ip

# Example (Hetzner Germany)
ssh root@178.104.66.83
\`\`\`

## Essential Server Commands

\`\`\`bash
# Safe reboot
reboot

# Check disk usage
df -h /

# Check memory usage
free -h

# List all Docker containers
docker ps -a

# View Coolify logs
docker logs coolify -f
\`\`\`

## Hetzner Cloud vs Robot

| Platform | Purpose | URL |
|----------|---------|-----|
| **Hetzner Cloud** | VPS/Cloud servers (what you have) | console.hetzner.cloud |
| **Hetzner Robot** | Dedicated physical servers | robot.hetzner.com |

The "Robot Mobile" app is for dedicated servers only. For cloud VPS, use the Hetzner Cloud Console web app.

## File Transfer from Mac to Server

Use \`scp\` on your **Mac** (not inside the SSH session!):

\`\`\`bash
# Run this ON YOUR MAC:
scp /local/path/to/file.ext root@server-ip:/remote/destination/

# Example: send database backup
scp ~/Desktop/dev.db root@178.104.66.83:/root/dev.db
\`\`\`

> **Common mistake:** Running \`scp\` inside an active SSH session copies files locally on the server.

## Coolify Infrastructure (Port Reference)

| Port | Service |
|------|---------|
| 22   | SSH |
| 80   | HTTP (Traefik) |
| 443  | HTTPS (Traefik) |
| 8000 | Coolify panel |
| 33060 | MySQL external (only open when needed) |

## Architecture Overview

\`\`\`
Browser → Cloudflare (CDN/WAF) → Server (Traefik Proxy)
                                        |
                              +---------+----------+
                              |                    |
                         isatis.pro         karimi.isatis.pro
                         (Next.js)          (PHP App)
                              |                    |
                         MySQL DB             MySQL DB
\`\`\`

All managed by Coolify, all running in isolated Docker containers.
`,
    },
    {
      slug: "docker-coolify-kubernetes-concepts",
      categoryId: devops.id,
      title:
        "Docker vs Kubernetes vs Coolify — Conceptual Comparison",
      content: `## Docker 🐳

Packages applications into isolated, portable "containers."

**Solves:** "It works on my machine" — Docker ensures identical runtime on any OS.

- **Image** = Recipe (app + all dependencies)
- **Container** = Running instance of that image

You've been using Docker when:
- Running \`docker ps\` to list containers
- Using \`docker cp\` to copy files
- Installing MySQL and phpMyAdmin as Coolify services

---

## Kubernetes ☸️ (K8s)

An orchestrator that manages thousands of Docker containers across many servers.

**Analogy:** If Docker containers are shipping crates, Kubernetes is the port authority managing thousands of crates across 100 ships.

**Used by:** Large companies (Netflix, Google) needing auto-scaling across 100+ servers.

❌ You are NOT using Kubernetes — it's overkill for individual/small-team projects.

---

## Coolify 🔷

A self-hosted platform that manages Docker containers for you — essentially simplified Kubernetes for individuals.

**Handles:**
- Building Docker images from GitHub code (via Nixpacks)
- Starting/stopping/restarting containers
- TLS certificates (Let's Encrypt + Traefik proxy)
- Routing traffic from domains to containers
- Environment variables, secrets, persistent storage

**You're using Coolify for:**
- Deploying Next.js and PHP projects
- Managing MySQL databases
- Running phpMyAdmin, Uptime Kuma
- Auto-deploying from GitHub on every push

---

## The Full Stack

\`\`\`
Browser 
  → Cloudflare (DNS + CDN + DDoS protection)
  → Hetzner Server (your VM in Germany)
  → Traefik (reverse proxy — routes traffic to right container)
  → Docker containers (managed by Coolify)
      ├── Next.js app
      ├── MySQL database
      ├── phpMyAdmin
      └── Uptime Kuma
\`\`\`
`,
    },
    {
      slug: "phpmailer-zoho-smtp-php",
      categoryId: backend.id,
      title: "PHPMailer Configuration with Zoho SMTP",
      content: `## Zoho SMTP Settings

| Setting      | SSL (Port 465) | TLS (Port 587) |
|--------------|----------------|----------------|
| SMTP Host    | smtp.zoho.com  | smtp.zoho.com  |
| Port         | 465            | 587            |
| Encryption   | SSL            | TLS/STARTTLS   |
| Username     | full email     | full email     |
| Password     | email password | email password |

## PHPMailer Code Example

\`\`\`php
<?php
use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\SMTP;
use PHPMailer\\PHPMailer\\Exception;

require 'lib/PHPMailer/PHPMailer.php';
require 'lib/PHPMailer/SMTP.php';
require 'lib/PHPMailer/Exception.php';

function sendTokenEmail(string $to, string $token): bool {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.zoho.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@yourdomain.com';
        $mail->Password   = 'your-zoho-password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        $mail->setFrom('info@yourdomain.com', 'Your App Name');
        $mail->addAddress($to);

        $mail->isHTML(false);
        $mail->Subject = 'Your Login Token';
        $mail->Body    = "Your one-time login token: $token";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email error: {$mail->ErrorInfo}");
        return false;
    }
}
\`\`\`

## File Structure

\`\`\`
your-project/
└── lib/
    └── PHPMailer/
        ├── PHPMailer.php
        ├── SMTP.php
        └── Exception.php
\`\`\`

Or install via Composer:
\`\`\`bash
composer require phpmailer/phpmailer
\`\`\`

## Important Notes

- For reliable delivery to Gmail, ensure your domain has SPF and DKIM records configured (Cloudflare + Zoho setup)
- Store SMTP credentials in \`config.php\` only (never commit to Git)
- Zoho free plan supports up to ~500 emails/day from the SMTP relay
`,
    },
    {
      slug: "cache-busting-cloudflare",
      categoryId: tools.id,
      title: "Cache Busting: Force Browsers & Cloudflare to Reload Assets",
      content: `## Why Assets Don't Update

When you replace a file with the same name, three caches may serve the old version:
1. **Browser cache** — Your local machine's stored copy
2. **Cloudflare CDN** — Copies on global Cloudflare servers
3. **Server cache** — Less common for static files

## Method 1: Hard Refresh (Browser Only)

- **Mac:** \`Cmd + Shift + R\`
- **Windows/Linux:** \`Ctrl + F5\`

Test in **Private/Incognito window** first — no cache is read.

## Method 2: Purge Cloudflare Cache

If the asset is new on the server but Cloudflare serves the old one:

1. Cloudflare dashboard → your domain
2. **Caching → Configuration**
3. **Purge Everything**

## Method 3: Cache Busting in Code

Add a version query parameter so browsers treat it as a new file:

\`\`\`html
<!-- Gets cached indefinitely -->
<img src="assets/images/banner.jpg">

<!-- Forces browser to download new version -->
<img src="assets/images/banner.jpg?v=2">
\`\`\`

In PHP, use the file modification time automatically:
\`\`\`php
$version = filemtime('assets/images/banner.jpg');
echo '<img src="assets/images/banner.jpg?v=' . $version . '">';
\`\`\`

## Method 4: Rename the File

The most reliable method ever:
\`\`\`
hero-bg.jpg → hero-bg-v2.jpg
\`\`\`

No cache issues possible. Update the reference in code and commit.

## Method 5: Verify Server Has Latest Code

If using Coolify auto-deploy:
1. Coolify → project → **Deployments** tab
2. Confirm latest deployment completed
3. If not, manually click **Deploy**
`,
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const guide of guides) {
    const existing = await prisma.guide.findUnique({
      where: { slug: guide.slug },
    });

    if (existing) {
      skipped++;
      continue;
    }

    const { categoryId, ...rest } = guide as any;
    await prisma.guide.create({ 
      data: {
        ...rest,
        categories: {
          connect: { id: categoryId }
        }
      } 
    });
    created++;
    console.log(`  ✅ Created: ${guide.title}`);
  }

  console.log(
    `\n🌱 Seed complete! ${created} guides created, ${skipped} already existed.`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
