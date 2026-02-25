# Loopify — Project Write-Up
### Follow-Up & Networking Reminder Engine for Job Seekers

**Author:** Prasanthi Vanga · pvanga2206@gmail.com
**Hackathon:** 48-Hour Vibe Coding Hackathon · February 21–23, 2026
**Submission Deadline:** Tuesday, February 24, 2026 · 11:59 PM PT
**Live URL:** [https://vercel-loopify-vibe-code-deploy.vercel.app](https://vercel-loopify-vibe-code-deploy.vercel.app/)
**GitHub:** https://github.com/pvanga2206/vercel-loopify-vibe-code-deploy
**DEMO Video ** Watch Revolutionizing Networking for Job Seekers with Loopify! 🤝.mp4 

---

## TL;DR

Loopify is a full-stack SaaS productivity tool that solves a real problem faced by job seekers: forgetting to follow up. It tracks every professional contact, logs every interaction, and sends automated email reminders so no opportunity goes cold. Built in 48 hours using Next.js 14, Supabase, Prisma, Stripe, and Resend — with a visually stunning Milky Way galaxy hero animation on the landing page.

---

## 1. Problem Statement

Job seekers lose opportunities not because they were rejected — but because they forgot to follow up.

Managing recruiters, referrals, interviews, and networking contacts across scattered emails, LinkedIn messages, and spreadsheets is mentally exhausting and unreliable. There is no tool designed specifically for the rhythm of a job search: *reach out → wait → follow up → repeat*.

**Loopify** solves this by acting as a personal memory and timing system for professional relationships. It tracks every contact, logs every interaction, and nudges the user at exactly the right moment to reach back out — before the opportunity goes cold.

---

## 2. What Was Built

### Core Features Delivered

| Feature | Status |
|---|---|
| GitHub OAuth login (Supabase) | ✅ |
| Contact CRUD with status tracking | ✅ |
| Interaction history timeline | ✅ |
| Reminder engine with due/overdue detection | ✅ |
| Daily digest email (Resend API) | ✅ |
| Message template library (4 built-in + custom) | ✅ |
| Stripe subscription (Free / Pro tiers) | ✅ |
| Milky Way galaxy hero animation | ✅ |
| Fully responsive dashboard (mobile + desktop) | ✅ |
| Row-Level Security (Supabase RLS) | ✅ |

### Pages & Routes

- `/` — Landing page with galaxy animation, features, pricing, footer
- `/login` — GitHub OAuth sign-in
- `/dashboard` — Overview with stats, due/overdue contacts, activity feed
- `/dashboard/contacts` — Contact list with search, filter, add modal
- `/dashboard/contacts/[id]` — Individual contact detail with interaction log, reminders, AI template suggestions
- `/dashboard/reminders` — Reminder management with filter tabs (Overdue / Today / Upcoming / Dismissed)
- `/dashboard/templates` — Built-in + custom message template library
- `/dashboard/settings` — Subscription management, usage stats, test email trigger
- `/api/send-reminders` — Scheduled daily digest email endpoint
- `/api/send-test-reminder` — On-demand test email trigger
- `/api/stripe/create-checkout` — Stripe checkout session creation
- `/api/stripe/webhook` — Stripe payment event processing
- `/auth/callback` — Supabase OAuth callback handler

---

## 3. Architecture

```
┌─────────────────────────────────────────────┐
│               Next.js 14 App Router          │
│                                             │
│  Landing Page  →  /login  →  /dashboard/*  │
│      ↓               ↓            ↓         │
│   Static CSS    GitHub OAuth    DataProvider │
│   Galaxy Anim   (Supabase)      (Zustand)   │
└──────────────────────┬──────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    ┌─────▼──────┐          ┌───────▼──────┐
    │  Supabase   │          │  API Routes  │
    │  (Auth +    │          │  (Stripe,    │
    │  PostgreSQL)│          │  Resend,     │
    │  + RLS      │          │  Reminders)  │
    └─────────────┘          └──────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS animations |
| State Management | Zustand (optimistic updates) |
| Authentication | Supabase Auth (GitHub OAuth) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Email | Resend API |
| Payments | Stripe (Checkout + Webhooks) |
| Deployment | Vercel |

---

## 4. Database Schema

Five core tables managed via Prisma:

### `User`
Stores all authenticated users and their subscription state.
- `id` · `email` · `name` · `plan (FREE|PRO)` · `stripeCustomerId` · `createdAt` · `updatedAt`

### `Contact`
Every person the user is networking with or applied through.
- `id` · `userId` · `name` · `email` · `company` · `role` · `linkedinUrl`
- `status (NETWORKING|APPLIED|INTERVIEWING|OFFER|CLOSED|ARCHIVED)`
- `nextFollowUpDate` · `createdAt` · `updatedAt`

### `Interaction`
Logs every touchpoint per contact.
- `id` · `contactId` · `userId` · `channel (EMAIL|LINKEDIN|PHONE|IN_PERSON|OTHER)`
- `notes` · `interactedAt` · `createdAt`

### `Reminder`
Tracks the lifecycle of every scheduled follow-up.
- `id` · `contactId` · `userId` · `dueDate` · `message`
- `status (PENDING|SENT|DISMISSED)` · `sentAt` · `createdAt` · `updatedAt`

### `Template`
System-default and user-created message templates.
- `id` · `userId (null = system default)` · `title`
- `scenario (THANK_YOU|RECONNECT|REFERRAL_REQUEST|APPLICATION_FOLLOWUP|CUSTOM)`
- `body (supports {{name}}, {{company}}, {{role}} variables)` · `createdAt` · `updatedAt`

---

## 5. Security Design

- **Row-Level Security (RLS):** Enforced at the database level via Supabase — users can only ever read or write their own data.
- **Server-side secrets:** All API keys (Stripe, Resend, Supabase service key) live exclusively in server-side environment variables, never exposed to the client.
- **OAuth only:** No passwords stored — authentication is delegated entirely to GitHub via Supabase OAuth.
- **Stripe webhook validation:** Webhook payloads are verified with Stripe's signature before any payment event is processed.
- **Idempotent reminders:** A guard prevents duplicate digest emails from being sent more than once per user per day.
- **Middleware auth guard:** Next.js middleware enforces session checks on all `/dashboard/*` routes before any page renders.

---

## 6. Key Engineering Decisions

### Optimistic UI with Zustand
Rather than waiting for Supabase round-trips on every user action, the Zustand store applies changes immediately to local state, then syncs to the DB asynchronously. On failure, it rolls back. This makes the dashboard feel instant.

### Client-side Supabase with Server-side Auth Guard
The app uses Supabase's browser client for all data operations (with the user's session automatically included via cookies), while the Next.js middleware handles the auth gate server-side. This avoids the complexity of server actions for every CRUD operation while keeping security enforced at the edge.

### Prisma + Supabase Direct Client
Prisma is used for schema management and migrations only. All runtime data operations go through Supabase's PostgREST client for better compatibility with Vercel's serverless environment and Supabase's built-in RLS.

### CSS-only Galaxy Animation
The Milky Way hero animation is built entirely in CSS — no canvas, no WebGL, no JavaScript. Three layers of twinkling stars, rotating orbit rings with glowing particles, nebula clouds, and an infinity loop — all driven by `@keyframes` animations. Zero runtime JS overhead.

---

## 7. Subscription Tiers

| Feature | Free | Pro ($9/mo) |
|---|---|---|
| Contacts | Up to 15 | Unlimited |
| Custom templates | Up to 3 | Unlimited |
| Daily digest reminders | ✅ | ✅ |
| Interaction history | ✅ | ✅ |
| AI follow-up suggestions | ❌ | ✅ |
| Priority email reminders | ❌ | ✅ |

---

## 8. How to Run Locally

```bash
# 1. Navigate to the app directory
cd landing_page

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env .env.local
# Fill in your own Supabase, Stripe, and Resend keys

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to Supabase
npx prisma db push

# 6. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 9. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=
DIRECT_URL=

# Resend (Email)
RESEND_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## 10. What I Learned

1. **Relational data modeling** for a multi-entity productivity SaaS — users, contacts, interactions, reminders, and templates all linked together cleanly.
2. **Idempotent scheduled jobs** — building a reminder dispatch system that safely avoids duplicate emails regardless of how many times the scheduler fires.
3. **Template variable interpolation** — server-side string substitution for `{{name}}`, `{{company}}`, `{{role}}` from contact profiles.
4. **Stripe subscriptions and feature gating** — integrating checkout sessions, webhooks, and plan-based access control.
5. **Supabase RLS** — multi-tenant data isolation enforced at the database layer, not the application layer.
6. **Optimistic UI patterns** — updating local state immediately and rolling back on DB errors for a fast, native-app feel.
7. **CSS-only complex animations** — building a performant Milky Way galaxy with nothing but keyframes and radial gradients.

---

*Built by Prasanthi Vanga for the 48-Hour Vibe Coding Hackathon · February 2026*
