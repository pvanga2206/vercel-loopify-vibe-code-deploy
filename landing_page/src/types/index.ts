export type Plan = 'FREE' | 'PRO'

export type ContactStatus =
  | 'NETWORKING'
  | 'APPLIED'
  | 'INTERVIEWING'
  | 'OFFER'
  | 'CLOSED'
  | 'ARCHIVED'

export type Channel = 'EMAIL' | 'LINKEDIN' | 'PHONE' | 'IN_PERSON' | 'OTHER'

export type ReminderStatus = 'PENDING' | 'SENT' | 'DISMISSED'

export type TemplateScenario =
  | 'THANK_YOU'
  | 'RECONNECT'
  | 'REFERRAL_REQUEST'
  | 'APPLICATION_FOLLOWUP'
  | 'CUSTOM'

export interface User {
  id: string
  email: string
  name: string
  plan: Plan
  stripeCustomerId: string | null
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  userId: string
  name: string
  email: string | null
  company: string | null
  role: string | null
  linkedinUrl: string | null
  status: ContactStatus
  nextFollowUpDate: string | null
  createdAt: string
  updatedAt: string
  interactions?: Interaction[]
  reminders?: Reminder[]
}

export interface Interaction {
  id: string
  contactId: string
  userId: string
  channel: Channel
  notes: string
  interactedAt: string
  createdAt: string
}

export interface Reminder {
  id: string
  contactId: string
  userId: string
  dueDate: string
  message: string | null
  status: ReminderStatus
  sentAt: string | null
  createdAt: string
  updatedAt: string
  contact?: Contact
}

export interface Template {
  id: string
  userId: string | null
  title: string
  scenario: TemplateScenario
  body: string
  createdAt: string
  updatedAt: string
}
