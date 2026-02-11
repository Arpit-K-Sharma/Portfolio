# Portfolio Website

A modern, production-ready portfolio website built with Next.js 15, featuring a secure admin panel, dynamic content management, and a robust backup system.

![Portfolio Preview](public/og-image.jpg)

## Features

- 🎨 **Modern UI/UX** - Premium dark mode with glassmorphism, animations, and responsive design.
- 🔐 **Secure Admin Panel** - Google OAuth authentication with whitelist for admin access.
- 📁 **Dynamic Content** - Manage projects, skills, categories, and profile details via the admin dashboard.
- 💬 **Contact System** - Integrated message system with email reply capability.
- 💾 **Backup System** - JSON export/import for data safety and migration.
- 🚀 **SEO Optimized** - Semantic HTML, metadata management, and OpenGraph support.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Variables
- **Database**: PostgreSQL (Prisma Postgres / Vercel Postgres)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v5 (Google OAuth)
- **Deployment**: Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (Local or Cloud)
- Google Cloud Console account (for OAuth)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# NextAuth Secret (Generate with: npx auth secret)
AUTH_SECRET="your-secure-random-string"

# Google OAuth Credentials
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Admin Configuration
ADMIN_GOOGLE_SUB="your-google-sub-id" # Found in Google OAuth Playground or after first login
```

### 3. Database Setup

Push the schema to your database:

```bash
npm run db:push
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`. The admin panel is at `/shadow/admin`.

---

## Deployment Guide (Vercel)

This project is optimized for deployment on **Vercel**.

### Step 1: Push to GitHub
Ensure your code is pushed to a GitHub repository.

### Step 2: Import to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your repository.
4. Keep the default build settings.

### Step 3: Configure Database (Prisma Postgres)
1. Go to the Vercel Marketplace or Storage tab.
2. Select **Prisma Postgres** (recommended) or **Vercel Postgres (Neon)**.
3. Link the database to your project.
4. Vercel will automatically add `POSTGRES_URL` and related variables to your environment.

### Step 4: Configure OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create/Edit your OAuth 2.0 Client ID.
3. Add your Vercel deployment URL to **Authorized redirect URIs**:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```
   *(Also add your custom domain if you have one)*

### Step 5: Add Missing Environment Variables
Go to **Settings** -> **Environment Variables** in Vercel and add:

- `AUTH_SECRET`: Generate a strong secret.
- `AUTH_GOOGLE_ID`: Your Google Client ID.
- `AUTH_GOOGLE_SECRET`: Your Google Client Secret.
- `ADMIN_GOOGLE_SUB`: Your unique Google User ID (to grant yourself admin access).

### Step 6: Push Schema to Production
From your local machine, run:

```bash
# Pull Vercel env vars to a file (optional safety step) or just use the connection string directly if you have it.
# Easiest way if you have the Vercel CLI linked:
vercel env pull .env.production.local

# Push schema to the production DB
npm run db:push -- --config=drizzle.config.ts
```

*Note: Ensure your local `.env` or the pulled env file points `POSTGRES_URL` to the production database before running `db:push`.*

### Step 7: Redeploy
If your initial deploy failed due to missing DB/Env vars, go to **Deployments** in Vercel and click **Redeploy**.

---

## Admin Configuration

To access the admin panel, you must be the "Shadow Admin".
1. Log in with Google.
2. If your `sub` ID matches `ADMIN_GOOGLE_SUB`, you will be redirected to `/shadow/admin`.
3. If not, check "My Profile" or database/logs to find your `sub` ID and update the environment variable.

## License

MIT License. Feel free to clone and customize for your own portfolio!
