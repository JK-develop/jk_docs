# JK Wiki 🧠

A premium, high-performance personal knowledge base and developer documentation system built with Next.js 16, Prisma, and SQLite.

![Header Image](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070)

## ✨ Features

- **🚀 Ultra-Fast Navigation**: Built with Next.js 16 and Turbopack for near-instant page transitions.
- **🔍 Command Palette**: Powerful `Cmd+K` search interface to find any guide or category instantly.
- **📝 Markdown Editor**: Full-featured admin editor with live preview for creating and editing guides.
- **💎 Premium UI/UX**: Modern dark-themed design with glassmorphism, smooth animations, and responsive layout.
- **🗂️ Categorized Knowledge**: Organized hierarchy for DevOps, Backend, Frontend, and Toolset guides.
- **🤖 AI-Powered Content**: Pre-seeded with professional-grade guides for modern infrastructure setup (Coolify, Hetzner, Docker, etc.).

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [SQLite](https://www.sqlite.org/) via [Prisma](https://www.prisma.io/)
- **State Management**: React Hooks & Context API
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
│   ├── components/       # Reusable React components (UI/Layout)
│   ├── lib/              # Shared utilities, actions, and prisma client
│   └── generated/        # Generated Prisma client
├── public/               # Static assets
└── tailwind.config.js    # Styling configuration
```

## 🔒 Admin Access

The admin portal is available at `/admin`. It allows you to:
- Create new categories
- Add, Edit, or Delete guides
- Preview Markdown content before publishing

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---
Developed with ❤️ by [JK](https://github.com/JK-develop)
