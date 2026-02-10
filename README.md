# Portfolio Website

A modern, production-ready portfolio website built with Next.js 15, featuring a secure admin panel and robust backup system.

## Features

- 🎨 **Dark Theme** - Premium dark mode with glassmorphism effects
- 🔐 **Secure Admin Panel** - Google OAuth with sub ID verification
- 📁 **Project Showcase** - Categories, skills, and filtering
- 💬 **Contact Form** - Requires Google sign-in for reply capability
- 💾 **Backup System** - JSON export/import for data safety

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: NextAuth v5 with Google OAuth
- **Hosting**: Vercel

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud Console access

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL

Create a database named `portfolio` in your local PostgreSQL instance.

### 3. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set Application type to **Web application**
6. Add Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy your **Client ID** and **Client Secret**

### 4. Get Your Google Sub ID (Required for Admin Access)

Your Google `sub` ID is a unique identifier that grants you admin access. Get it **before** starting the server:

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. In the left panel, find **Google OAuth2 API v2** and select:
   - `https://www.googleapis.com/auth/userinfo.profile`
3. Click **"Authorize APIs"** and sign in with your Google account
4. Click **"Exchange authorization code for tokens"**
5. Click **"List possible operations"** → **"userinfo.v2.me"** → **"Send the request"**
6. In the response, find the `id` field:
   ```json
   {
     "id": "123456789012345678901",  ← This is your sub ID
     "name": "Your Name",
     ...
   }
   ```
7. Copy this ID for the next step

### 5. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio

# Auth (generate with: npx auth secret)
AUTH_SECRET=your-generated-secret

# Google OAuth
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Admin Access (your Google sub ID from step 4)
ADMIN_GOOGLE_SUB=123456789012345678901
```

### 6. Run Database Migrations

```bash
npm run db:push
```

### 7. Start Development Server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/shadow/admin (secret path!)

---

## Admin Panel

Access the admin panel at `/shadow/admin` (only visible to the configured admin).

| Page | Description |
|------|-------------|
| Dashboard | Overview stats and quick actions |
| Profile | Edit your name, title, bio, social links |
| Projects | Create, edit, delete projects |
| Skills | Manage technical skills |
| Categories | Manage project categories |
| Messages | View and reply to contact messages |
| Settings | Export/import backup JSON |

---

## Backup System

### Export Data

1. Go to **Admin** → **Settings**
2. Click **"Export Portfolio JSON"**
3. Store the file in Google Drive or a private GitHub repo

### Import Data

1. Go to **Admin** → **Settings**
2. Click **"Import Portfolio JSON"**
3. Select your backup file

> ⚠️ **Warning**: Importing replaces ALL existing data!

### Monthly Backup Reminder

Set a monthly calendar reminder to export your backup. It takes 30 seconds and ensures your data is never lost.

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URI to your production domain

### Environment Variables for Production

```env
DATABASE_URL=your-production-database-url
AUTH_SECRET=your-production-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
ADMIN_GOOGLE_SUB=your-google-sub-id
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

---

## License

MIT
