/**
 * Seed data extracted from AI conversation logs.
 * Topics: Coolify deployment, Docker, MySQL, Prisma, DNS, Email (Zoho), Monitoring.
 * Run this once in the browser console or import into a setup page to populate localStorage.
 */

import type { LocalGuide } from "./localGuides";

export const SEED_GUIDES: LocalGuide[] = [
  // ─── DevOps ──────────────────────────────────────────────────────────────────

  {
    id: "seed-1",
    slug: "deploy-nextjs-coolify-nixpacks",
    title: "Deploy Next.js on Coolify with Nixpacks (Mac → Linux Platform Fix)",
    description:
      "Fix the classic EBADPLATFORM error when deploying a Mac-built Next.js project to a Linux server via Coolify. Covers the correct install command and Node.js version settings.",
    categories: [{ name: "DevOps" }],
    tags: ["coolify", "nextjs", "docker", "nixpacks", "deployment"],
    createdAt: new Date("2026-03-22").toISOString(),
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
    id: "seed-2",
    slug: "nextjs-prisma-build-command-coolify",
    title: "Coolify Build Command for Next.js + Prisma (MySQL)",
    description:
      "The correct build command for Coolify when using Next.js with Prisma and MySQL. Includes database migration and the danger of --accept-data-loss flag.",
    categories: [{ name: "DevOps" }, { name: "Database" }],
    tags: ["coolify", "prisma", "mysql", "nextjs", "build"],
    createdAt: new Date("2026-03-22").toISOString(),
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

Next.js tries to pre-render pages during build. If any page fetches from the database (e.g., \`sitemap.xml\`) and the tables don't exist yet, the build fails with:

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

## Hosting Environment Variable

Set this in Coolify for production URL resolution:
\`\`\`
HOSTNAME = 0.0.0.0
AUTH_URL = https://your-domain.com
\`\`\`

## Port Configuration

Next.js listens on port \`3000\` by default. Set **Ports Exposes = 3000** in Coolify configuration.
`,
  },

  {
    id: "seed-3",
    slug: "sqlite-to-mysql-prisma-migration",
    title: "Migrate Prisma from SQLite to MySQL (Auth.js Token Fix)",
    description:
      "Complete guide to migrating a Prisma schema from SQLite to MySQL, including the @db.Text fix for OAuth access tokens that exceed VARCHAR(191) limit.",
    categories: [{ name: "Backend" }, { name: "Database" }],
    tags: ["prisma", "mysql", "sqlite", "migration", "authjs", "oauth"],
    createdAt: new Date("2026-03-22").toISOString(),
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

**Fix — Update the Account model:**
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

### 5. Local Development

For local Mac development, use a local MySQL instance (DBngin or Homebrew):
\`\`\`
DATABASE_URL="mysql://root:@127.0.0.1:3306/my_local_db"
\`\`\`

**Never connect local dev to the production database.**

### 6. Install MySQL on Mac (Homebrew)
\`\`\`bash
brew install mysql
brew services start mysql
\`\`\`

Or use the free **DBngin** app (no system file pollution).
`,
  },

  {
    id: "seed-4",
    slug: "coolify-mysql-internal-hostname",
    title: "Finding the Correct Internal Hostname for MySQL in Coolify/Docker",
    description:
      "How to find and use the correct Docker internal hostname to connect services (e.g., PHP, Next.js) to a MySQL container inside Coolify.",
    categories: [{ name: "DevOps" }, { name: "Database" }],
    tags: ["coolify", "docker", "mysql", "networking", "hostname"],
    createdAt: new Date("2026-03-22").toISOString(),
    content: `## The Problem

When two Docker containers need to communicate (e.g., a PHP app connecting to MySQL), you cannot use \`localhost\`. Docker containers are isolated and each has its own network identity.

Error you'll see:
\`\`\`
php_network_getaddresses: getaddrinfo for mysql-database-xyz failed: Temporary failure in name resolution
\`\`\`

## Finding the Internal Hostname

In Coolify, go to your **MySQL database resource** → the General/Configuration tab.

Look for **"MySQL URL (internal)"** — it looks like:
\`\`\`
mysql://user:password@cijv3lwi1triqxwi71co7ad1:3306/dbname
\`\`\`

The part **after the \`@\` symbol and before \`:\`** is the internal hostname:
\`\`\`
cijv3lwi1triqxwi71co7ad1
\`\`\`

This is what you use as the \`DB_HOST\` or \`PMA_HOST\`.

## Key Rule: Same Project = Same Network

Containers can only resolve each other's hostnames if they are in the **same Coolify project and environment**. 

If your PHP app is in project A and MySQL is in project B, they are in different Docker networks and cannot communicate by name. You would need to move both into the same project.

## phpMyAdmin Setup

When setting up phpMyAdmin via Coolify, set:
\`\`\`
PMA_HOST = cijv3lwi1triqxwi71co7ad1
\`\`\`

For the login page:
- **Server:** leave empty (PMA_HOST handles it) or enter the internal hostname
- **Username:** \`mysql\` (the normal user, not \`root\` — root is locked for remote access in MySQL 8)
- **Password:** The Normal User Password from Coolify MySQL settings

## MySQL 8 Root Access Restriction

In MySQL 8, the \`root\` user is locked for remote connections by default (only accessible from inside the MySQL container). Use the **normal user** (shown as "Normal User" in Coolify's MySQL settings) for phpMyAdmin and application connections.
`,
  },

  {
    id: "seed-5",
    slug: "docker-commands-reference",
    title: "Essential Docker Commands for Server Management",
    description:
      "Key Docker commands used for managing containers, copying files, checking status, and monitoring disk usage on a Coolify-managed server.",
    categories: [{ name: "DevOps" }],
    tags: ["docker", "commands", "linux", "server-management"],
    createdAt: new Date("2026-03-22").toISOString(),
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

# Clean up unused Docker resources (images, networks, build cache)
docker system prune -a
\`\`\`

## Finding Container Name/ID in Coolify

In Coolify, when you deploy a project, the container ID is shown in the deployment logs. Alternatively:

\`\`\`bash
# SSH into server, then list all containers
docker ps

# The container name typically matches the Coolify resource UUID
# e.g.: zjgsstjw8bcq4gjenmpf6p64-215923956702
\`\`\`

## Important Notes

- **Container ID changes** every time you deploy. Never hardcode container IDs.
- When you \`docker cp\` a file into a container, it is **lost on next deploy** unless you use Persistent Storage (Bind Mounts).
- The container name format in Coolify: \`{resource-uuid}-{deployment-id}\`
`,
  },

  {
    id: "seed-6",
    slug: "coolify-persistent-storage-config-files",
    title: "Coolify Persistent Storage: Keeping Config Files Across Deploys",
    description:
      "How to use Bind Mounts in Coolify to keep sensitive config files (like PHP config.php) persistent across deployments without committing secrets to Git.",
    categories: [{ name: "DevOps" }],
    tags: ["coolify", "docker", "bind-mount", "persistent-storage", "php"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## The Problem

When using Coolify's CI/CD (auto-deploy from GitHub), each deployment creates a **brand new container**, destroying any files you manually placed in the old container.

Files that WILL be lost on deploy:
- Manually created \`config.php\` 
- Uploaded files not in Git
- Any changes made directly inside the container

## Solution: Bind Mount (Persistent Storage)

A Bind Mount links a file/directory on the **host server** to a path inside the container. The file lives on the server's filesystem and is "mounted" into every new container.

### Step 1: Create the File on the Server

SSH into your server or use Coolify's Server Terminal:

\`\`\`bash
# Create config file in a safe location outside the app
nano /opt/karimi-config.php
\`\`\`

Paste your config content, then save: \`Ctrl+X\` → \`Y\` → \`Enter\`

### Step 2: Add Storage Mount in Coolify

In your application's settings → **Storages** tab:

- Click **Add Storage** (or Add Bind Mount)
- **Source Path** (on host server): \`/opt/karimi-config.php\`
- **Destination Path** (inside container): \`/app/config.php\`
- Save

### Step 3: Redeploy

Click **Deploy** to apply the mount. From now on, every new container will automatically have access to the config file.

### Updating the Config File

To change the config:
\`\`\`bash
# SSH into server
ssh root@your-server-ip
nano /opt/karimi-config.php
# Edit and save — changes take effect immediately (no redeploy needed)
\`\`\`

## Where Nixpacks Places Your Code

By default, Nixpacks (Coolify's build system) places the application code in \`/app/\`.

Verify with:
\`\`\`bash
# In Coolify's application Terminal tab:
ls -la /app
\`\`\`

## Best Practices

- Store config files in \`/opt/appname-config/\` on the server
- Never commit sensitive files (\`config.php\`, \`.env\`) to Git
- Use Bind Mounts for: database config, SMTP credentials, API keys
- Use Git/Environment Variables for: non-sensitive configuration
`,
  },

  {
    id: "seed-7",
    slug: "swap-memory-linux-server",
    title: "Add Swap Memory to Prevent OOM Crashes During Builds",
    description:
      "How to create a 4GB swap file on a Linux server to prevent Out-of-Memory kills during Next.js or Docker build processes.",
    categories: [{ name: "DevOps" }],
    tags: ["linux", "swap", "memory", "server", "oom"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## Why Builds Crash (OOM Error)

Building Next.js projects with Prisma is memory-intensive. If your server's RAM is full during a build, the Linux kernel kills the process (exit code 255 / 502 Bad Gateway error).

Signs you have an OOM problem:
- Build exits with code 255
- 502 Bad Gateway after deployment
- Server becomes unresponsive during deploy
- Build fails at "npm install" or "next build" step

## Solution: Create a 4GB Swap File

Swap space extends RAM by using disk storage as virtual memory. Run these commands on your server (via SSH or Coolify Terminal):

\`\`\`bash
# Create a 4GB swap file
fallocate -l 4G /swapfile

# Restrict permissions (security)
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
# Check swap status
swapon --show

# Check memory usage including swap
free -h
\`\`\`

## Restart the Server After OOM

If the server is already unresponsive:

\`\`\`bash
# SSH in and reboot
ssh root@your-server-ip
reboot
\`\`\`

Or use your hosting provider's panel (Hetzner Cloud Console → Power Cycle).

After reboot (~2-3 minutes), Coolify and all containers restart automatically.

## Coolify Auto-Cleanup

Coolify has a built-in Docker cleanup mechanism. In **Servers → localhost → Advanced**, enable **Automated Docker Cleanup** to automatically remove old images and build caches when disk usage exceeds a threshold.

## Monitoring Memory

Check live memory usage:
\`\`\`bash
# Current memory/swap usage
free -h

# Detailed process memory usage
htop  # (if installed)

# Or watch it during build
watch -n 2 free -h
\`\`\`
`,
  },

  {
    id: "seed-8",
    slug: "coolify-auto-deploy-github-webhooks",
    title: "Coolify Auto-Deploy from GitHub (CI/CD Setup)",
    description:
      "How to configure automatic deployments in Coolify whenever you push to GitHub. Covers GitHub App integration and the Auto Deploy toggle.",
    categories: [{ name: "DevOps" }],
    tags: ["coolify", "github", "ci-cd", "auto-deploy", "webhooks"],
    createdAt: new Date("2026-03-22").toISOString(),
    content: `## Two Integration Methods

### Method 1: GitHub App (Recommended)

If Coolify is connected to GitHub via a GitHub App, auto-deploy works automatically. No webhook configuration needed.

You'll see this message in the Webhooks section:
> "You are using an official Git App. You do not need manual webhooks."

**To enable Auto Deploy:**
1. In Coolify, go to your application → **Advanced** tab
2. Enable the **Auto Deploy** toggle

From this point, every \`git push\` to the configured branch (e.g., \`main\`) triggers a deployment automatically.

### Method 2: Manual Webhook

If connected via SSH/URL (not GitHub App):
1. In Coolify → application → **Webhooks** tab, copy the Webhook URL
2. In GitHub: repository → **Settings → Webhooks → Add webhook**
3. Paste the URL, set Content-Type to \`application/json\`
4. Select "Just the push event"
5. Save

## Granting Repository Access

If a repository doesn't appear in Coolify's dropdown, you need to grant access:

1. GitHub → Profile → **Settings**
2. **Integrations → GitHub Apps**
3. Find your Coolify app → **Configure**
4. Under **Repository access**, add the specific repository
5. Save

Then return to Coolify and refresh the repository list.

## Branch Configuration

By default, Coolify deploys from the \`main\` branch. You can change this in:
**Application → Configuration → Branch**

## What Happens on Push

1. GitHub notifies Coolify via webhook
2. Coolify fetches latest code
3. Nixpacks/Docker builds a new image
4. New container starts (rolling update — zero downtime)
5. Old container stops

The full logs are visible in Coolify under the **Deployments** tab.
`,
  },

  {
    id: "seed-9",
    slug: "coolify-deploy-php-project",
    title: "Deploy a PHP Project on Coolify (Nixpacks)",
    description:
      "Step-by-step guide to deploying a plain PHP project (no framework) on Coolify using Nixpacks, with correct port and directory settings.",
    categories: [{ name: "DevOps" }, { name: "Backend" }],
    tags: ["coolify", "php", "deployment", "nixpacks", "docker"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## Configuration Settings

When adding a PHP project from GitHub in Coolify:

| Setting        | Value     | Notes |
|----------------|-----------|-------|
| Build Pack     | Nixpacks  | Nixpacks auto-detects PHP |
| Base Directory | \`/\`      | Root of the repository |
| Port           | **80**    | Web servers (Apache/Nginx) listen on port 80, NOT 3000 |
| Is static site | ❌ Off    | PHP projects are dynamic |

> **Important:** The default port in Coolify is 3000 (for Node.js). PHP web servers use port **80**. Change this or you'll get a 502 error.

## Subdomain Setup in Cloudflare

Before deploying, configure DNS:

1. Cloudflare → DNS → Add record
2. **Type:** A
3. **Name:** \`subdomain\` (e.g., \`karimi\` for \`karimi.domain.com\`)
4. **IPv4 address:** Your server IP
5. **Proxy status:** Orange cloud (Proxied) — ON

## Setting the Domain in Coolify

In the application's Configuration → **Domains** field:
\`\`\`
https://subdomain.yourdomain.com
\`\`\`

## Debug: Files Not Found (403 Error)

If you get a 403 Forbidden, check what's inside the container:

\`\`\`bash
# In Coolify Terminal tab for the application:
ls -la /app
\`\`\`

Common issues:
- **\`index.php\` is missing** → the Bind Mount overwrote the directory (check Storage config)
- **The main file has a different name** → rename to \`index.php\` in Git
- **Files are in a subdirectory** → change Base Directory in Coolify to \`/public\`

## Database Connection in PHP

Use the **internal hostname** (not \`localhost\`):
\`\`\`php
<?php
define('DB_HOST', 'cijv3lwi1triqxwi71co7ad1'); // Coolify internal hostname
define('DB_NAME', 'mydb');
define('DB_USER', 'mysql');          // Normal user, not root
define('DB_PASS', 'your-password');
\`\`\`

## Isolate Projects

**Best practice:** Create a **separate Coolify project** for each application (not multiple resources under one project).

Benefits:
- Independent environment variables
- Clean teardown (delete one project without affecting others)
- Clear visual separation in the dashboard
`,
  },

  {
    id: "seed-10",
    slug: "cloudflare-dns-setup-coolify",
    title: "Cloudflare DNS Records for Coolify Deployments",
    description:
      "How to configure Cloudflare DNS for main domain and subdomains pointing to a Coolify-managed server, including proxy settings and SSL.",
    categories: [{ name: "DevOps" }],
    tags: ["cloudflare", "dns", "ssl", "coolify", "subdomain"],
    createdAt: new Date("2026-03-22").toISOString(),
    content: `## Main Domain Setup

Point your root domain to the server:

| Type | Name | Value          | Proxy |
|------|------|----------------|-------|
| A    | @    | your.server.ip | ✅ On |
| A    | www  | your.server.ip | ✅ On |

## Subdomain Setup

For each subdomain (e.g., \`karimi.domain.com\`):

| Type | Name   | Value          | Proxy |
|------|--------|----------------|-------|
| A    | karimi | your.server.ip | ✅ On |

**Proxy ON (orange cloud):** Traffic routes through Cloudflare → enables SSL, DDoS protection, caching.

**Proxy OFF (grey cloud / DNS Only):** When Coolify's Traefik needs to issue SSL certificates directly. Use this for some Coolify services if you have SSL handshake issues.

## Uptime Kuma Subdomain (Special Case)

For monitoring tools like Uptime Kuma, the proxy should be **OFF** (DNS Only):

| Type | Name  | Value          | Proxy |
|------|-------|----------------|-------|
| A    | kuma  | your.server.ip | ❌ Off |

## Zoho Mail DNS Records

To receive emails at your domain, add these:

**MX Records (receive email):**
\`\`\`
Type: MX | Name: @ | Value: mx.zoho.com  | Priority: 10
Type: MX | Name: @ | Value: mx2.zoho.com | Priority: 20
Type: MX | Name: @ | Value: mx3.zoho.com | Priority: 50
\`\`\`

**SPF Record (prevent spam):**
\`\`\`
Type: TXT | Name: @ | Content: v=spf1 include:zohomail.com ~all
\`\`\`

**DKIM Record (email signing):**
\`\`\`
Type: TXT | Name: zmail._domainkey | Content: v=DKIM1; k=rsa; p=...
\`\`\`

## Cache Management

After changing files deployed through Cloudflare, purge the cache:
**Cloudflare → Caching → Configuration → Purge Everything**

## Existing Records to Preserve

- Any \`google-site-verification=...\` TXT records → **keep them** (they're for Google Search Console)
- Multiple TXT records on the same name are fine (they coexist without conflict)

## Coolify Domain Configuration

In your Coolify application settings → **Domains**:
\`\`\`
https://yourdomain.com,https://www.yourdomain.com
\`\`\`

After changing domains, click **Redeploy** to apply (Traefik needs to reconfigure routing).
`,
  },

  {
    id: "seed-11",
    slug: "zoho-mail-free-setup",
    title: "Set Up Free Business Email with Zoho Mail (Custom Domain)",
    description:
      "Complete walkthrough for setting up a free business email on your own domain using Zoho Mail's Forever Free plan. Includes DNS configuration for Cloudflare.",
    categories: [{ name: "DevOps" }, { name: "Tools" }],
    tags: ["zoho", "email", "dns", "cloudflare", "smtp"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## Zoho Mail Free Plan

The **Forever Free plan** allows:
- Up to **5 email accounts** on your domain
- 5 GB storage per account
- Full send/receive functionality
- No credit card required

## Step 1: Sign Up

1. Go to [zoho.com/mail](https://www.zoho.com/mail/)
2. Scroll to pricing → find **Forever Free Plan** at the bottom
3. Select **"Add an existing domain"**
4. Enter your domain name

> **Tip:** If you're already logged into Zoho, go directly to [mail.zoho.com/biz/domain.do](https://mail.zoho.com/biz/domain.do)

## Step 2: Domain Verification

Zoho gives you a TXT record to prove domain ownership:
\`\`\`
zoho-verification=zb12345678.zm.zoho.com
\`\`\`

Add in Cloudflare:
| Type | Name | Content                              |
|------|------|--------------------------------------|
| TXT  | @    | zoho-verification=zb12345678...      |

Click **Verify TXT Record** in Zoho. Cloudflare propagates nearly instantly.

## Step 3: Create Email Account

During setup wizard, enter:
- **Email ID:** \`info\` (for \`info@yourdomain.com\`)
- **Password:** Choose a strong password

## Step 4: Configure DNS (CRITICAL — receive email)

Add these records in Cloudflare:

**MX Records:**
\`\`\`
MX | @ | mx.zoho.com  | Priority 10
MX | @ | mx2.zoho.com | Priority 20  
MX | @ | mx3.zoho.com | Priority 50
\`\`\`

**SPF (anti-spam):**
\`\`\`
TXT | @ | v=spf1 include:zohomail.com ~all
\`\`\`

**DKIM (email authentication):**
\`\`\`
TXT | zmail._domainkey | v=DKIM1; k=rsa; p=<long-key-from-zoho>
\`\`\`

Click **Verify All Records** in Zoho.

## Step 5: Skip Wizard Steps

- **Setup Groups** → Skip (for group emails like \`sales@\`)
- **Data Migration** → Skip (new domain, nothing to migrate)
- **Go Mobile** → Skip (app promo)

## Adding More Email Addresses

In the admin panel [mailadmin.zoho.com](https://mailadmin.zoho.com):
1. **Users** → **Add**
2. Fill in name and Email ID (e.g., \`support\` for \`support@yourdomain.com\`)
3. Set a password → **Save**

You can create up to 5 accounts on the free plan.

## SMTP Settings (for PHPMailer, etc.)

\`\`\`
SMTP Host: smtp.zoho.com
Port: 465 (SSL) or 587 (TLS/STARTTLS)
Username: info@yourdomain.com
Password: your-zoho-email-password
\`\`\`

## Access Email

- Web: [mail.zoho.com](https://mail.zoho.com)
- Mobile: Zoho Mail app (iOS/Android)
`,
  },

  {
    id: "seed-12",
    slug: "uptime-kuma-setup-telegram-alerts",
    title: "Uptime Kuma: Server Monitoring with Telegram Alerts",
    description:
      "Install Uptime Kuma via Coolify and configure Telegram bot notifications for instant alerts when your sites go down.",
    categories: [{ name: "DevOps" }, { name: "Tools" }],
    tags: [
      "uptime-kuma",
      "monitoring",
      "telegram",
      "coolify",
      "notifications",
    ],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## What is Uptime Kuma?

A self-hosted monitoring tool that checks if your websites, APIs, and databases are online. When something goes down, it instantly notifies you via Telegram, email, Slack, etc.

**Best for:** Detecting when a site/service goes DOWN or comes back UP.

## Installation via Coolify

### 1. Prepare Subdomain in Cloudflare
\`\`\`
Type: A | Name: kuma | Value: your-server-ip | Proxy: OFF (DNS Only)
\`\`\`

### 2. Deploy in Coolify

1. Project → **New Resource → Service (One-click)**
2. Search: **Uptime Kuma** (select the standard SQLite version, not MariaDB/MySQL)
3. Set Domain: \`https://kuma.yourdomain.com:3001\`
   > The port \`:3001\` is required — Uptime Kuma runs internally on port 3001
4. **Deploy**

### 3. First Login

Visit \`https://kuma.yourdomain.com\` and:
1. Choose **SQLite** as database
2. Create admin username and password

## Add a Monitor

1. Click **Add New Monitor**
2. Monitor Type: **HTTP(s)**
3. Friendly Name: e.g., \`My Website\`
4. URL: \`https://yourdomain.com\`
5. Heartbeat Interval: \`60\` seconds
6. **Save**

## Set Up Telegram Notifications

### Step 1: Create a Telegram Bot

1. Open Telegram → search **@BotFather**
2. Send \`/newbot\`
3. Set a name and username for your bot
4. Copy the **Bot Token** (e.g., \`123456:ABC-DEF...\`)

### Step 2: Get Your Chat ID

1. Start chat with **@userinfobot**
2. It replies with your **Chat ID** (a numeric ID like \`123456789\`)

### Step 3: Configure in Uptime Kuma

1. Edit any monitor → **Notifications** section
2. Click **Setup Notification**
3. Type: **Telegram**
4. Paste your **Bot Token** and **Chat ID**
5. Click **Test** — you should receive a message
6. **Save**

## Custom Message Template (HTML format)

In the notification settings, set **Message Template**:

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

> **Note:** Do NOT use HTML comments (\`<!-- -->\`) — Telegram's API rejects them.

## Uptime Kuma vs Netdata

| Feature | Uptime Kuma | Netdata |
|---------|-------------|---------|
| Site up/down alerts | ✅ Excellent | ⚠️ Limited |
| CPU/RAM monitoring | ❌ Basic | ✅ Excellent |
| Easy Telegram setup | ✅ GUI-based | ⚠️ Config file |
| Status page | ✅ Yes | ❌ No |
| Resource usage | Very low | Low |

Use both: Uptime Kuma for site availability, Netdata for hardware metrics.
`,
  },

  {
    id: "seed-13",
    slug: "docker-coolify-concepts",
    title: "Docker vs Kubernetes vs Coolify — Conceptual Guide",
    description:
      "Understand what Docker, Kubernetes, and Coolify are, how they relate to each other, and where you're already using them in your setup.",
    categories: [{ name: "DevOps" }],
    tags: ["docker", "kubernetes", "coolify", "concepts", "containers"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## Docker 🐳

A tool that packages applications into isolated, portable "containers."

**The problem it solves:** "It works on my machine" — Docker ensures that an app runs identically on any machine (Mac, Linux server, Windows).

**How it works:**
- A **Docker Image** is like a recipe (includes the app + all its dependencies)
- A **Docker Container** is a running instance of that image (the actual "box")

**You've been using Docker when you:**
- Ran \`docker ps\` to list running containers
- Used \`docker cp\` to copy the database into a container
- Installed MySQL and phpMyAdmin as Coolify services (each runs in its own container)
- Encountered sharding issues between phpMyAdmin and MySQL (Docker network isolation)

---

## Kubernetes ☸️ (K8s)

An "orchestrator" that manages thousands of Docker containers across many servers.

**Analogy:** If Docker containers are shipping crates, Kubernetes is the port authority that decides where each crate goes, auto-restarts fallen cranes, and scales up during peak hours.

**Used by:** Large companies (Netflix, Google) with millions of users needing auto-scaling across 100+ servers.

**You are NOT using Kubernetes.** It's massively complex, resource-heavy, and overkill for individual projects.

---

## Coolify 🔷

A self-hosted platform that manages Docker containers for you.

**Coolify = Simple Kubernetes for individuals/small teams.**

**It handles:**
- Building Docker images from your GitHub code (via Nixpacks)
- Starting/stopping/restarting containers
- TLS certificates (via Let's Encrypt + Traefik proxy)
- Routing traffic from domains to the right containers
- Environment variables and secrets
- Persistent storage mounts

**You've been using Coolify for:**
- Deploying Next.js (Isatis) and PHP (Karimi system)
- Managing MySQL databases
- Running phpMyAdmin and Uptime Kuma as services
- Auto-deploying from GitHub on every push

---

## The Stack Summary

\`\`\`
Browser → Cloudflare (DNS/CDN) → Hetzner Server → Traefik (Proxy) → Docker Containers
                                                          ↑
                                                     Coolify manages all of this
\`\`\`

**Your server has:**
- **Traefik** — routes \`isatis.pro\` traffic to the right container
- **Coolify** — manages all deployments via GUI
- **Docker** — runs all containers (Next.js, MySQL, phpMyAdmin, Uptime Kuma, etc.)
- Each container is **isolated** — issues in one don't affect others
`,
  },

  {
    id: "seed-14",
    slug: "coolify-subdomain-seo-considerations",
    title: "Subdomains and SEO: What You Need to Know",
    description:
      "How subdomains affect SEO of the main domain, and best practices for organizing multiple projects under a single domain in Coolify.",
    categories: [{ name: "DevOps" }, { name: "Frontend" }],
    tags: ["seo", "subdomain", "cloudflare", "coolify", "google"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## How Google Treats Subdomains

Google treats subdomains as **entirely separate websites** from the root domain.

Example:
- \`isatis.pro\` → Website A (its own authority, ranking, content)
- \`karimi.isatis.pro\` → Website B (independent of A's SEO)
- \`shop.isatis.pro\` → Website C (independent of A's SEO)

## Impact on Main Domain SEO

Since subdomains are isolated entities:

✅ **No negative impact** — Content on \`karimi.isatis.pro\` does NOT hurt the ranking of \`isatis.pro\`

❌ **No positive impact transfer** — Links to \`karimi.isatis.pro\` don't boost \`isatis.pro\`'s domain authority

This is ideal when you have **unrelated projects** on the same server.

## Google Search Console

Register each subdomain **separately** in Google Search Console:
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → **URL prefix** → enter \`https://karimi.isatis.pro\`
3. Verify ownership (add TXT record in Cloudflare)

Without this, analytics from the subdomain would mix with the main domain.

## Docker Isolation in Coolify

Each subdomain/project runs in its own Docker container:

- **No shared processes** — A crash in \`karimi.isatis.pro\` doesn't affect \`isatis.pro\`
- **Independent PHP versions** — One project can use PHP 7.4, another PHP 8.2
- **Clean teardown** — Delete a project from Coolify and all its containers/files disappear completely
- **No "shared hosting" hell** — Each project has its own web server (Nginx/Apache)

## Best Practice: One Coolify Project per Application

\`\`\`
Coolify Projects:
├── Isatis-Web          → isatis.pro (Next.js)
├── Karimi-System       → karimi.isatis.pro (PHP)
├── Monitoring          → kuma.isatis.pro (Uptime Kuma)
└── DB-Admin            → db.isatis.pro (phpMyAdmin)
\`\`\`

Benefits of separate projects:
- Environment variables don't mix between projects
- Separate deployment histories
- Can delete one project without touching others
- Easier to hand off individual sites to team members
`,
  },

  {
    id: "seed-15",
    slug: "phpmailer-zoho-smtp-config",
    title: "PHPMailer Configuration with Zoho SMTP",
    description:
      "How to configure PHPMailer to send emails through Zoho Mail SMTP server for PHP applications.",
    categories: [{ name: "Backend" }],
    tags: ["phpmailer", "zoho", "smtp", "php", "email"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## Zoho SMTP Settings

| Setting      | SSL (Port 465) | TLS (Port 587)       |
|-------------|----------------|----------------------|
| SMTP Host   | smtp.zoho.com  | smtp.zoho.com        |
| Port        | 465            | 587                  |
| Encryption  | SSL            | TLS / STARTTLS       |
| Auth        | Required       | Required             |
| Username    | full email     | full email           |
| Password    | email password | email password       |

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
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.zoho.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@yourdomain.com';
        $mail->Password   = 'your-zoho-password';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Port 465
        $mail->Port       = 465;

        // Sender and recipient
        $mail->setFrom('info@yourdomain.com', 'Your App Name');
        $mail->addAddress($to);

        // Content
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

## Installation

Download PHPMailer from GitHub and place the \`src\` folder:
\`\`\`
your-project/
└── lib/
    └── PHPMailer/
        ├── PHPMailer.php
        ├── SMTP.php
        └── Exception.php
\`\`\`

Or via Composer:
\`\`\`bash
composer require phpmailer/phpmailer
\`\`\`

## Important Notes

- For Gmail delivery, ensure your domain has SPF and DKIM records set up in Cloudflare (see Zoho Mail setup guide)
- Zoho free plan can send up to ~10,000 emails/day
- Store SMTP credentials in \`config.php\` (not in Git!)
`,
  },

  {
    id: "seed-16",
    slug: "mysql-phpmyadmin-coolify-public-port",
    title: "Access MySQL Database Externally via TablePlus or phpMyAdmin",
    description:
      "How to temporarily expose a MySQL port in Coolify for database management, and how to securely close it afterward.",
    categories: [{ name: "Database" }, { name: "DevOps" }],
    tags: ["mysql", "phpmyadmin", "tableplus", "coolify", "database-admin"],
    createdAt: new Date("2026-03-22").toISOString(),
    content: `## Temporary External Access (For Import/Export Only)

To connect tools like TablePlus, DBeaver, or phpMyAdmin to your MySQL database:

### 1. Enable Public Port in Coolify

1. Coolify → MySQL database resource → **General/Configuration** tab
2. Scroll to **Proxy** section
3. Enable **"Make it publicly available"**
4. Set Public Port: \`33060\` (use non-standard port for security)
5. **Save** → **Restart** the database

### 2. Connect with TablePlus (Mac)

| Setting  | Value                |
|----------|----------------------|
| Type     | MySQL                |
| Host     | your-server-ip       |
| Port     | 33060                |
| User     | root                 |
| Password | MySQL root password  |

### 3. Import SQL File

In TablePlus: **File → Import → From SQL dump**
Or in phpMyAdmin: **Database → Import → Choose SQL file**

### 4. Close the Port After Use ⚠️

**ALWAYS disable public access after you're done:**
1. Coolify → MySQL → Proxy
2. Disable **"Make it publicly available"**
3. Save → Restart

Leaving a database port open on the internet exposes it to brute-force attacks.

## Secure Access: SSH Tunnel (Recommended Long-Term)

Instead of opening the port, use an SSH tunnel:

In TablePlus:
- Enable **SSH** tab
- SSH Host: \`your-server-ip\`
- SSH User: \`root\`
- SSH Key or password
- The app tunnels MySQL traffic through the encrypted SSH connection

No port needs to be opened publicly.

## phpMyAdmin Notes

When using phpMyAdmin in Coolify:
- **PMA_HOST** should be the **internal Docker hostname** (e.g., \`cijv3lwi1triqxwi71co7ad1\`)
- **NOT** \`localhost\`, \`127.0.0.1\`, or the full container name with \`mysql-database-\` prefix
- Login with the **normal user** (\`mysql\`), not \`root\` (MySQL 8 restricts root remote access)
- If phpMyAdmin and MySQL are in different Coolify projects, they're in different Docker networks and can't communicate
`,
  },

  {
    id: "seed-17",
    slug: "cache-busting-cloudflare-images",
    title: "Cache Busting: Force Browsers & Cloudflare to Load New Images",
    description:
      "When you update an image with the same filename, browsers and Cloudflare cache the old version. Here are all the methods to force a cache refresh.",
    categories: [{ name: "Frontend" }, { name: "DevOps" }],
    tags: ["cache", "cloudflare", "images", "performance", "cdn"],
    createdAt: new Date("2026-03-29").toISOString(),
    content: `## Why Images Don't Update

When you replace an image file with the same name, three caches may serve the old version:
1. **Browser cache** — Your local machine's stored copy
2. **Cloudflare CDN** — Copies across global Cloudflare servers
3. **Server cache** — Less common for static files

## Method 1: Hard Refresh (Browser Only)

Force your browser to reload everything:
- **Mac:** \`Cmd + Shift + R\`
- **Windows/Linux:** \`Ctrl + F5\`

Or open in a **Private/Incognito window** — no cache is used.

Test in incognito first to confirm the server has the new image before troubleshooting elsewhere.

## Method 2: Purge Cloudflare Cache

If the image is new on the server but Cloudflare still serves the old one:

1. Cloudflare dashboard → your domain
2. **Caching → Configuration**
3. **Purge Everything** (red button)

This forces Cloudflare to re-fetch assets from your origin server.

## Method 3: Cache Busting in Code (Permanent Solution)

Add a version query parameter to image URLs so browsers treat each version as a new file:

\`\`\`html
<!-- Old way (gets cached forever) -->
<img src="assets/images/banner.jpg">

<!-- Versioned (forces browser to download new version) -->
<img src="assets/images/banner.jpg?v=2">
\`\`\`

In PHP, you can use the file modification time:
\`\`\`php
$version = filemtime('assets/images/banner.jpg');
echo '<img src="assets/images/banner.jpg?v=' . $version . '">';
\`\`\`

## Method 4: Rename the File

The most reliable method: give the new image a different filename:
- Old: \`hero-bg.jpg\`
- New: \`hero-bg-v2.jpg\`

Update the reference in the code and commit. No cache issues possible.

## Method 5: Verify Server Has Latest Code

If using Coolify auto-deploy, confirm the new code/image was deployed:
1. Check Coolify → project → **Deployments** tab
2. Verify the latest deployment completed successfully
3. If not, manually click **Deploy**
`,
  },

  {
    id: "seed-18",
    slug: "nextjs-middleware-deprecated-proxy",
    title: "Next.js: Middleware Deprecated → Use Proxy Instead",
    description:
      "In Next.js 16+, the `middleware` file convention is deprecated. Learn how to migrate to the new `proxy` convention to avoid build warnings.",
    categories: [{ name: "Frontend" }, { name: "Backend" }],
    tags: ["nextjs", "middleware", "proxy", "deprecation"],
    createdAt: new Date("2026-03-22").toISOString(),
    content: `## Deprecation Warning

During build, you may see:

\`\`\`
⚠ The "middleware" file convention is deprecated. 
  Please use "proxy" instead. 
  Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
\`\`\`

This was introduced in **Next.js 16+ (Turbopack)**.

## What Changed

| Old Convention | New Convention |
|----------------|----------------|
| \`src/middleware.ts\` | \`src/proxy.ts\` |
| \`middleware.ts\` (root) | \`proxy.ts\` (root) |

## Migration

1. Rename \`middleware.ts\` to \`proxy.ts\`
2. The API and exports remain the same
3. The \`matcher\` configuration still works identically

### Before (deprecated):
\`\`\`typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  // ...
}

export const config = {
  matcher: ['/api/:path*'],
}
\`\`\`

### After:
\`\`\`typescript
// src/proxy.ts
export function middleware(request: NextRequest) {
  // Same code — no changes needed inside
}

export const config = {
  matcher: ['/api/:path*'],
}
\`\`\`

## Check the Docs

Always check the Next.js docs in \`node_modules/next/dist/docs/\` for the currently installed version — APIs and conventions change frequently between versions.

\`\`\`bash
ls node_modules/next/dist/docs/
\`\`\`
`,
  },

  // ─── Hetzner Server ──────────────────────────────────────────────────────────

  {
    id: "seed-19",
    slug: "hetzner-server-management",
    title: "Hetzner Server Management: SSH, Reboot, and Panel Overview",
    description:
      "Essential commands for managing a Hetzner Cloud (VPS) server via SSH, plus an overview of the Hetzner Cloud Console vs Robot distinction.",
    categories: [{ name: "DevOps" }],
    tags: ["hetzner", "ssh", "linux", "server", "vps"],
    createdAt: new Date("2026-03-22").toISOString(),
    content: `## Connecting via SSH

\`\`\`bash
# Connect to server
ssh root@your-server-ip

# Example (Hetzner Germany server)
ssh root@178.104.66.83

# Disconnect
exit
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

## Hetzner Cloud vs Robot (Important Distinction)

Hetzner has **two completely separate platforms**:

| Platform | Purpose | Login |
|----------|---------|-------|
| **Hetzner Cloud** | VPS/Cloud servers | console.hetzner.cloud |
| **Hetzner Robot** | Dedicated physical servers | robot.hetzner.com |

If you created a VPS, you're on **Hetzner Cloud**. The "Robot Mobile" app is for dedicated servers only and won't work with Cloud accounts.

## Hetzner Cloud Console

Access at: [console.hetzner.cloud](https://console.hetzner.cloud)

From the Cloud Console you can:
- View CPU/Network metrics (from hypervisor level)
- Restart or shut down the server
- Access the rescue system if SSH is locked out
- Manage firewall rules, snapshots, volumes

## Firewall Rules (Default Open Ports)

Coolify requires these ports to be open:
| Port | Service |
|------|---------|
| 22   | SSH |
| 80   | HTTP |
| 443  | HTTPS |
| 8000 | Coolify panel |
| 6001-6002 | Coolify realtime |

Additional ports (open only when needed):
| Port | Service |
|------|---------|
| 33060 | MySQL external access (close when not in use) |
| 3001  | Uptime Kuma (behind reverse proxy, no direct open needed) |

## File Transfer (SCP)

Transfer files **from your Mac to the server**:
\`\`\`bash
# Run this ON YOUR MAC (not inside the server SSH session!)
scp /local/path/to/file.ext root@your-server-ip:/remote/destination/

# Example: send database backup
scp ~/Desktop/dev.db root@178.104.66.83:/root/dev.db
\`\`\`

**Common mistake:** Running \`scp\` inside an active SSH session copies files locally on the server, not from your Mac.
`,
  },
];
