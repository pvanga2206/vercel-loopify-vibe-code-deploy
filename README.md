# Loopify 🔁

> A follow-up and networking reminder engine for job seekers.

**Never lose an opportunity because you forgot to follow up.**

---

## What is Loopify?

Loopify is your personal memory and timing system for professional relationships. It tracks every contact, logs every interaction, and nudges you at exactly the right moment to reach back out — before the opportunity goes cold.

Built for the **48-Hour Vibe Coding Hackathon** · February 21–23, 2026

---

## ✨ Features

- **GitHub OAuth** — One-click sign-in, no passwords
- **Contact Tracker** — Organize every recruiter, referral, and networking contact with status tracking (Networking → Applied → Interviewing → Offer)
- **Interaction History** — Log every touchpoint: email, LinkedIn, phone, in-person
- **Reminder Engine** — Due today, overdue, and upcoming follow-up detection
- **Daily Digest Email** — Automated morning emails listing all contacts due for follow-up (via Resend)
- **Message Templates** — 4 built-in templates + create your own with `{{name}}`, `{{company}}`, `{{role}}` auto-fill
- **Stripe Subscriptions** — Free and Pro tiers with Stripe Checkout
- **Milky Way Galaxy Hero** — CSS-only animated galaxy on the landing page
- **Fully Responsive** — Works on mobile and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom CSS animations |
| State | Zustand (optimistic updates) |
| Auth | Supabase (GitHub OAuth) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Email | Resend API |
| Payments | Stripe |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- A [Resend](https://resend.com) account

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/pvanga2206/vercel-loopify-vibe-code-deploy.git
cd vercel-loopify-vibe-code-deploy/landing_page

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env .env.local
# Edit .env.local with your own keys (see below)

# 4. Generate Prisma client
npx prisma generate

# 5. Push schema to your Supabase DB
npx prisma db push

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Resend (Email)
RESEND_API_KEY=re_...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📁 Project Structure

```
landing_page/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # GitHub OAuth login
│   │   ├── dashboard/         # All dashboard pages
│   │   │   ├── contacts/      # Contact list + detail pages
│   │   │   ├── reminders/     # Reminder management
│   │   │   ├── templates/     # Message templates
│   │   │   └── settings/      # Subscription + account
│   │   ├── api/
│   │   │   ├── send-reminders/     # Scheduled digest emails
│   │   │   ├── send-test-reminder/ # On-demand test email
│   │   │   └── stripe/             # Checkout + webhook
│   │   └── auth/callback/     # Supabase OAuth callback
│   ├── components/
│   │   ├── Galaxy.tsx         # Milky Way animation
│   │   ├── auth/              # DataProvider, UserProvider
│   │   ├── layout/            # Sidebar, Header, MobileNav
│   │   └── ui/                # Button, Input, Modal, etc.
│   └── lib/
│       ├── store.ts           # Zustand state store
│       ├── supabase/          # Client, server, actions
│       └── utils.ts           # Helpers, formatters
```

---

## 🔒 Security

- Row-Level Security (RLS) enforced at the database level — users can only access their own data
- All secret keys are server-side only — never exposed to the client
- GitHub OAuth only — no passwords stored
- Stripe webhooks validated with signature verification
- Idempotent reminder dispatch — prevents duplicate emails

---

## 💰 Subscription Tiers

| Feature | Free | Pro ($9/mo) |
|---|---|---|
| Contacts | Up to 15 | Unlimited |
| Custom templates | Up to 3 | Unlimited |
| Daily digest reminders | ✅ | ✅ |
| Interaction history | ✅ | ✅ |
| AI follow-up suggestions | ❌ | ✅ |
| Priority email reminders | ❌ | ✅ |

---

## 📄 License

MIT — built for the 48-Hour Vibe Coding Hackathon · February 2026

---

*Built by [Prasanthi Vanga](mailto:pvanga2206@gmail.com)*
