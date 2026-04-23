# JK Wiki 🧠

A premium, high-performance personal knowledge base and developer documentation system built with Next.js 16, Prisma, and SQLite. Fully localized for **English** and **Persian** (Bilingual) with a unified content model.

![Header Image](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070)

## ✨ Features

- **🌐 Full Bilingual Support**: Seamlessly switch between **English** and **Persian** (RTL/LTR) with a compact UI switcher.
- **📚 Unified Content Pool**: One unified knowledge base for all languages. Content is shared across localized versions of the site.
- **🚀 Ultra-Fast Navigation**: Built with Next.js 15 and Turbopack for near-instant page transitions.
- **🛡️ Secure Admin Panel**: Password-protected dashboard for full content management with localized UI.
- **🔍 Command Palette**: Powerful `Cmd+K` search interface to find any guide or category instantly.
- **📝 Markdown Editor**: Premium admin editor with live preview, tags, and bilingual category support.
- **💎 Premium UI/UX**: Modern dark-themed design with glassmorphism, smooth animations, and responsive layout.
- **🗂️ Multi-Category Support**: Guides can belong to multiple categories (e.g., DevOps + Backend).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [SQLite](https://www.sqlite.org/) via [Prisma](https://www.prisma.io/)
- **i18n**: Custom Bilingual Context with Cookie persistence
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: Framer Motion for smooth animations

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation
```bash
git clone git@github.com:JK-develop/jk_docs.git
cd jk_docs
npm install
```

### 3. Database Setup
```bash
# Push schema to local SQLite database
npx prisma db push

# Set your admin password in .env
# ADMIN_PASSWORD=your_secure_password

# Seed the database with initial guides
npx tsx prisma/seed.ts
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your wiki.

## 📁 Project Structure

```text
├── prisma/               # Database schema and seed scripts
├── src/
│   ├── app/              # Next.js App Router (pages and layouts)
│   ├── components/       # Reusable React components (UI/Layout/i18n)
│   ├── lib/              # Shared utilities, actions, i18n logic, and prisma client
│   └── lib/i18n          # Translation dictionaries and server-side helpers
├── scripts/              # Migration and backup scripts
└── public/               # Static assets
```

## 🔒 Admin Access

The admin portal is available at `/admin`. It allows you to:
- Create new categories with **bilingual names** (EN/FA)
- Add, Edit, or Delete guides
- Preview Markdown content before publishing
- Manage content in a unified multilingual dashboard

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
Developed with ❤️ by [JK](https://github.com/JK-develop)
