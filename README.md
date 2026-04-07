# SmartBoard

Self-hosted Trello-style dashboard with Google Gmail + Calendar integration.
Built to run on a Raspberry Pi.

## Stack

- Next.js 14 (App Router) + TypeScript
- Prisma + SQLite (file-based, perfect for a Pi)
- NextAuth (Google OAuth) — Gmail + Calendar read-only scopes
- googleapis client for Gmail / Calendar widgets

## Project layout

```
app/                 Next.js project (run everything from here)
  prisma/schema.prisma
  src/app/           App Router pages + API routes
  src/components/    Client components
  src/lib/           Prisma client, auth helpers
```

## Setup

```bash
cd app
cp .env.example .env       # then fill in the values
npm install
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000 and sign in with Google.

### Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   (and your Pi's URL when deploying)
4. Enable APIs: **Gmail API** and **Google Calendar API**
5. Paste the client id/secret into `app/.env`
6. Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`

## Deploying on a Raspberry Pi

```bash
cd app
npm ci
npx prisma migrate deploy
npm run build
npm run start          # listens on :3000
```

Run it under `systemd` or `pm2` and put nginx/Caddy in front for HTTPS.
SQLite DB lives at `app/prisma/dev.db` — back this file up.

## Features

- Boards / lists / cards (CRUD)
- Google sign-in
- Recent Gmail inbox widget
- Upcoming Calendar events widget

More features will be added incrementally.
