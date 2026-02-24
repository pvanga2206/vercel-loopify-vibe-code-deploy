# Loopify — Project Proposal
### Follow-Up & Networking Reminder Engine for Job Seekers

**Author:** Prasanthi Vanga · pvanga2206@gmail.com
**Hackathon:** 48-Hour Vibe Coding Hackathon · February 21–23, 2026
**Submission Deadline:** Tuesday, February 24, 2026 · 11:59 PM PT

---

## 🎯 Problem Statement

Job seekers lose opportunities not because they were rejected — but because they forgot to follow up.

Managing recruiters, referrals, interviews, and networking contacts across scattered emails, LinkedIn messages, and spreadsheets is chaotic and mentally draining. There is no single tool designed specifically for the rhythm of a job search: reach out, wait, follow up, repeat.

**Loopify** solves this by acting as a personal memory and timing system for professional relationships. It tracks every contact, logs every interaction, and nudges the user at exactly the right moment to reach back out — before the opportunity goes cold.

---

## 🏗️ 1. Architecture Design

Loopify is built as a modern, full-stack SaaS entirely within Next.js 14 using the App Router pattern.

- **Frontend (Next.js 14 + Tailwind CSS + Shadcn/ui):** A polished, responsive dashboard for managing contacts, follow-ups, reminders, and message templates.
- **Backend (Next.js API Routes + Server Actions):** Handles all contact CRUD operations, reminder scheduling, template management, and Stripe webhook processing.
- **Database (PostgreSQL + Prisma via Supabase):** Stores the full relational data model — users, contacts, interaction logs, reminders, and templates.
- **Auth (Supabase OAuth — Google Login):** Authenticates all users. Each user's workspace is fully private and isolated.
- **Email Notifications (Resend API):** Sends daily digest emails listing contacts due for follow-up. Styled HTML emails with the Loopify brand.
- **Payments (Stripe):** Free and Pro subscription tiers. Users can upgrade, downgrade, or cancel from within the app.

---

## ✨ 2. Feature Design

### Dashboard
- A home view showing today's follow-up reminders, overdue contacts, and a recent activity feed.
- A full contacts list with filtering by job search status: Networking, Applied, Interviewing, Offer, Closed, or Archived.
- Individual contact detail pages showing complete interaction history and a timeline of follow-ups.

### Contact & Interaction Tracker
- Add contacts with name, company, role, LinkedIn URL, and email.
- Log every interaction per contact — including the date, channel (email, LinkedIn, phone, in-person), and personal notes.
- Assign a next follow-up date to any contact along with a custom reminder note.

### Reminder Engine
- Automated daily digest email (via Resend API) delivered each morning listing all contacts due for follow-up that day.
- In-app notification badge surfacing overdue and upcoming follow-ups at a glance.
- Idempotency guard ensures a reminder is never sent more than once per follow-up date, no matter how many times the scheduler runs.

### Message Template Library
- A curated set of pre-built templates covering the most common job search scenarios: thank-you after an interview, reconnecting with a recruiter, requesting a referral, and post-application check-ins.
- Users can create, edit, and save their own custom templates.
- Template variables — `{{name}}`, `{{company}}`, and `{{role}}` — are automatically filled in from the contact's saved profile when composing a message.

### AI Suggestion Component *(Pro Feature)*
- Analyzes the contact's current status and the time elapsed since the last interaction to recommend the most appropriate template.
- Generates a fully personalized follow-up draft using the contact's profile context, saving the user from staring at a blank page.

### Authentication
- Supabase OAuth with Google login — one click to get started.
- Row-Level Security (RLS) enforced at the database level — users can only ever read or write their own data.

### Subscription & Payments (Stripe)
- **Free Tier:** Up to 15 contacts, 3 custom templates, daily digest reminders.
- **Pro Tier:** Unlimited contacts, unlimited templates, AI-generated suggestions, and priority email reminders.
- Users can manage, upgrade, or cancel their subscription directly from the Settings page.

---

## 🗄️ 3. Database Design

The schema is managed via Prisma and purpose-built for job search relationship tracking.

### `User` Table
Stores all authenticated users and their subscription state.
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `name` (String)
- `plan` (Enum: `FREE`, `PRO`)
- `stripeCustomerId` (String, Nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### `Contact` Table
Stores every person the user is networking with or has applied through.
- `id` (UUID, Primary Key)
- `userId` (FOREIGN KEY → `User`)
- `name` (String)
- `email` (String, Nullable)
- `company` (String, Nullable)
- `role` (String, Nullable)
- `linkedinUrl` (String, Nullable)
- `status` (Enum: `NETWORKING`, `APPLIED`, `INTERVIEWING`, `OFFER`, `CLOSED`, `ARCHIVED`)
- `nextFollowUpDate` (DateTime, Nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### `Interaction` Table
Logs every touchpoint the user has had with a contact.
- `id` (UUID, Primary Key)
- `contactId` (FOREIGN KEY → `Contact`)
- `userId` (FOREIGN KEY → `User`)
- `channel` (Enum: `EMAIL`, `LINKEDIN`, `PHONE`, `IN_PERSON`, `OTHER`)
- `notes` (String)
- `interactedAt` (DateTime)
- `createdAt` (DateTime)

### `Reminder` Table
Tracks the lifecycle of every scheduled follow-up reminder.
- `id` (UUID, Primary Key)
- `contactId` (FOREIGN KEY → `Contact`)
- `userId` (FOREIGN KEY → `User`)
- `dueDate` (DateTime)
- `message` (String, Nullable)
- `status` (Enum: `PENDING`, `SENT`, `DISMISSED`)
- `sentAt` (DateTime, Nullable)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### `Template` Table
Stores both system-default templates and user-created custom templates.
- `id` (UUID, Primary Key)
- `userId` (UUID, Nullable — `null` indicates a system default template)
- `title` (String)
- `scenario` (Enum: `THANK_YOU`, `RECONNECT`, `REFERRAL_REQUEST`, `APPLICATION_FOLLOWUP`, `CUSTOM`)
- `body` (String — supports `{{name}}`, `{{company}}`, `{{role}}` variables)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## 🔒 4. Security Design

- All secret keys (Stripe, Resend, Supabase) are stored exclusively in server-side environment variables and never exposed to the client.
- Supabase Row-Level Security (RLS) is enforced at the database level — no user can access another user's data under any circumstance.
- The reminder dispatch API is rate-limited to a maximum of one digest email per user per day to prevent accidental or malicious spam.
- All user-submitted content (notes, template bodies) is sanitized server-side to prevent XSS injection before persistence.
- Stripe webhook payloads are verified using Stripe's signature validation before any payment events are processed.

---

## 🎓 5. Learning Outcomes

By the end of this project, the core engineering concepts covered include:

1. Modeling relational data for a multi-entity productivity SaaS (users, contacts, interactions, reminders, templates).
2. Building an idempotent reminder dispatch system that safely avoids duplicate emails.
3. Using template variables and server-side string interpolation to personalize messages at scale.
4. Integrating Stripe subscriptions and gating product features by plan tier.
5. Enforcing multi-tenant data isolation using Supabase Row-Level Security.
6. Sending transactional and scheduled digest emails using the Resend API.

---

## 🚀 Deployment

- **Framework:** Next.js 14 (App Router)
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Live URL:** *(Coming soon — deploying on Vercel)*
- **GitHub:** *(To be made public before submission deadline)*