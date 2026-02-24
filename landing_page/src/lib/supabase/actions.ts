import { createClient } from './client'
import type { Contact, Interaction, Reminder, Template, User, Plan } from '@/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'sys-t1',
    userId: null,
    title: 'Post-Interview Thank You',
    scenario: 'THANK_YOU',
    body: "Hi {{name}},\n\nThank you so much for taking the time to speak with me about the {{role}} position at {{company}}. I really enjoyed learning more about the team and the exciting work you're doing.\n\nOur conversation reinforced my enthusiasm for this opportunity, and I'm confident my experience would be a great fit. Please don't hesitate to reach out if you need any additional information from me.\n\nLooking forward to hearing from you!\n\nBest regards",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'sys-t2',
    userId: null,
    title: 'Reconnect After Silence',
    scenario: 'RECONNECT',
    body: "Hi {{name}},\n\nI hope you're doing well! It's been a little while since we last connected, and I wanted to reach out to see how things are going at {{company}}.\n\nI've been continuing my job search and would love to stay on your radar for any {{role}} opportunities that might come up. Would you have a few minutes to catch up sometime this week?\n\nThanks so much,",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'sys-t3',
    userId: null,
    title: 'Referral Request',
    scenario: 'REFERRAL_REQUEST',
    body: "Hi {{name}},\n\nI noticed that {{company}} has an opening for a {{role}} and I'm very interested in the position. Given your experience there, I was wondering if you'd be willing to refer me or put in a good word with the hiring team?\n\nI'd be happy to send over my resume and any other materials that would be helpful. I really appreciate any support you can offer!\n\nBest,",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'sys-t4',
    userId: null,
    title: 'Application Follow-Up',
    scenario: 'APPLICATION_FOLLOWUP',
    body: "Hi {{name}},\n\nI recently applied for the {{role}} position at {{company}} and wanted to follow up to express my continued interest. I'm very excited about the opportunity and believe my background would be a strong match for the role.\n\nWould it be possible to get an update on where things stand with the application process? I'm happy to provide any additional information.\n\nThank you for your time,",
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
]

function mapUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    plan: row.plan as Plan,
    stripeCustomerId: (row.stripeCustomerId as string) ?? null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

function mapContact(row: Record<string, unknown>): Contact {
  return {
    id: row.id as string,
    userId: row.userId as string,
    name: row.name as string,
    email: (row.email as string) ?? null,
    company: (row.company as string) ?? null,
    role: (row.role as string) ?? null,
    linkedinUrl: (row.linkedinUrl as string) ?? null,
    status: row.status as Contact['status'],
    nextFollowUpDate: (row.nextFollowUpDate as string) ?? null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

function mapInteraction(row: Record<string, unknown>): Interaction {
  return {
    id: row.id as string,
    contactId: row.contactId as string,
    userId: row.userId as string,
    channel: row.channel as Interaction['channel'],
    notes: row.notes as string,
    interactedAt: row.interactedAt as string,
    createdAt: row.createdAt as string,
  }
}

function mapReminder(row: Record<string, unknown>): Reminder {
  return {
    id: row.id as string,
    contactId: row.contactId as string,
    userId: row.userId as string,
    dueDate: row.dueDate as string,
    message: (row.message as string) ?? null,
    status: row.status as Reminder['status'],
    sentAt: (row.sentAt as string) ?? null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

function mapTemplate(row: Record<string, unknown>): Template {
  return {
    id: row.id as string,
    userId: (row.userId as string) ?? null,
    title: row.title as string,
    scenario: row.scenario as Template['scenario'],
    body: row.body as string,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

export async function upsertUserProfile(authUser: SupabaseUser): Promise<User> {
  const supabase = createClient()

  const { data: existing } = await supabase
    .from('User')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (existing) return mapUser(existing)

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('User')
    .insert({
      id: authUser.id,
      email: authUser.email!,
      name:
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email!.split('@')[0],
      plan: 'FREE',
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single()

  if (error) throw error
  return mapUser(data)
}

export async function fetchContacts(userId: string): Promise<Contact[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Contact')
    .select('*')
    .eq('userId', userId)
    .order('updatedAt', { ascending: false })

  if (error) throw error
  return (data || []).map(mapContact)
}

export async function insertContact(contact: Contact): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('Contact').insert({
    id: contact.id,
    userId: contact.userId,
    name: contact.name,
    email: contact.email,
    company: contact.company,
    role: contact.role,
    linkedinUrl: contact.linkedinUrl,
    status: contact.status,
    nextFollowUpDate: contact.nextFollowUpDate,
    createdAt: contact.createdAt,
    updatedAt: contact.updatedAt,
  })
  if (error) throw error
}

export async function updateContactInDB(id: string, updates: Partial<Contact>): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('Contact')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteContactFromDB(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('Contact').delete().eq('id', id)
  if (error) throw error
}

export async function fetchInteractions(userId: string): Promise<Interaction[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Interaction')
    .select('*')
    .eq('userId', userId)
    .order('interactedAt', { ascending: false })

  if (error) throw error
  return (data || []).map(mapInteraction)
}

export async function insertInteraction(interaction: Interaction): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('Interaction').insert({
    id: interaction.id,
    contactId: interaction.contactId,
    userId: interaction.userId,
    channel: interaction.channel,
    notes: interaction.notes,
    interactedAt: interaction.interactedAt,
    createdAt: interaction.createdAt,
  })
  if (error) throw error
}

export async function fetchReminders(userId: string): Promise<Reminder[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Reminder')
    .select('*')
    .eq('userId', userId)
    .order('dueDate', { ascending: true })

  if (error) throw error
  return (data || []).map(mapReminder)
}

export async function insertReminder(reminder: Reminder): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('Reminder').insert({
    id: reminder.id,
    contactId: reminder.contactId,
    userId: reminder.userId,
    dueDate: reminder.dueDate,
    message: reminder.message,
    status: reminder.status,
    sentAt: reminder.sentAt,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  })
  if (error) throw error
}

export async function updateReminderInDB(id: string, updates: Partial<Reminder>): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('Reminder')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function fetchUserTemplates(userId: string): Promise<Template[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Template')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: true })

  if (error) throw error
  return (data || []).map(mapTemplate)
}

export async function insertTemplate(template: Template): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('Template').insert({
    id: template.id,
    userId: template.userId,
    title: template.title,
    scenario: template.scenario,
    body: template.body,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  })
  if (error) throw error
}

export async function updateTemplateInDB(id: string, updates: Partial<Template>): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('Template')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteTemplateFromDB(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('Template').delete().eq('id', id)
  if (error) throw error
}
