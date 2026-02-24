'use client'

import { create } from 'zustand'
import type { Contact, Interaction, Reminder, Template, User, ReminderStatus } from '@/types'
import {
  insertContact,
  updateContactInDB,
  deleteContactFromDB,
  insertInteraction,
  insertReminder,
  updateReminderInDB,
  insertTemplate,
  updateTemplateInDB,
  deleteTemplateFromDB,
} from './supabase/actions'

const DEFAULT_USER: User = {
  id: '',
  email: '',
  name: '',
  plan: 'FREE',
  stripeCustomerId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function uuid() {
  return crypto.randomUUID()
}

interface AppState {
  user: User
  contacts: Contact[]
  interactions: Interaction[]
  reminders: Reminder[]
  templates: Template[]
  loading: boolean

  setUser: (user: User) => void
  setContacts: (contacts: Contact[]) => void
  setInteractions: (interactions: Interaction[]) => void
  setReminders: (reminders: Reminder[]) => void
  setTemplates: (templates: Template[]) => void
  setLoading: (loading: boolean) => void

  addContact: (contact: Omit<Contact, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void

  addInteraction: (interaction: Omit<Interaction, 'id' | 'userId' | 'createdAt'>) => void

  addReminder: (reminder: Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'status' | 'sentAt'>) => void
  updateReminder: (id: string, updates: Partial<Reminder>) => void
  dismissReminder: (id: string) => void

  addTemplate: (template: Omit<Template, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  updateTemplate: (id: string, updates: Partial<Template>) => void
  deleteTemplate: (id: string) => void

  upgradePlan: () => void
  downgradePlan: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: DEFAULT_USER,
  contacts: [],
  interactions: [],
  reminders: [],
  templates: [],
  loading: true,

  setUser: (user) => set({ user }),
  setContacts: (contacts) => set({ contacts }),
  setInteractions: (interactions) => set({ interactions }),
  setReminders: (reminders) => set({ reminders }),
  setTemplates: (templates) => set({ templates }),
  setLoading: (loading) => set({ loading }),

  addContact: (contact) => {
    const state = get()
    if (state.user.plan === 'FREE' && state.contacts.length >= 15) return
    const now = new Date().toISOString()
    const newContact: Contact = {
      ...contact,
      id: uuid(),
      userId: state.user.id,
      createdAt: now,
      updatedAt: now,
    }
    set({ contacts: [...state.contacts, newContact] })
    insertContact(newContact).catch((err) => {
      console.error('Failed to save contact:', err)
      set((s) => ({ contacts: s.contacts.filter((c) => c.id !== newContact.id) }))
    })
  },

  updateContact: (id, updates) => {
    set((s) => ({
      contacts: s.contacts.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    }))
    updateContactInDB(id, updates).catch((err) => {
      console.error('Failed to update contact:', err)
    })
  },

  deleteContact: (id) => {
    const prev = get().contacts
    set((s) => ({
      contacts: s.contacts.filter((c) => c.id !== id),
      interactions: s.interactions.filter((i) => i.contactId !== id),
      reminders: s.reminders.filter((r) => r.contactId !== id),
    }))
    deleteContactFromDB(id).catch((err) => {
      console.error('Failed to delete contact:', err)
      set((s) => ({ contacts: [...s.contacts, ...prev.filter((c) => c.id === id)] }))
    })
  },

  addInteraction: (interaction) => {
    const now = new Date().toISOString()
    const newInteraction: Interaction = {
      ...interaction,
      id: uuid(),
      userId: get().user.id,
      createdAt: now,
    }
    set((s) => ({ interactions: [...s.interactions, newInteraction] }))
    insertInteraction(newInteraction).catch((err) => {
      console.error('Failed to save interaction:', err)
      set((s) => ({ interactions: s.interactions.filter((i) => i.id !== newInteraction.id) }))
    })
  },

  addReminder: (reminder) => {
    const now = new Date().toISOString()
    const newReminder: Reminder = {
      ...reminder,
      id: uuid(),
      userId: get().user.id,
      status: 'PENDING',
      sentAt: null,
      createdAt: now,
      updatedAt: now,
    }
    set((s) => ({ reminders: [...s.reminders, newReminder] }))
    insertReminder(newReminder).catch((err) => {
      console.error('Failed to save reminder:', err)
      set((s) => ({ reminders: s.reminders.filter((r) => r.id !== newReminder.id) }))
    })
  },

  updateReminder: (id, updates) => {
    set((s) => ({
      reminders: s.reminders.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      ),
    }))
    updateReminderInDB(id, updates).catch((err) => {
      console.error('Failed to update reminder:', err)
    })
  },

  dismissReminder: (id) => {
    const update = { status: 'DISMISSED' as ReminderStatus, updatedAt: new Date().toISOString() }
    set((s) => ({
      reminders: s.reminders.map((r) => (r.id === id ? { ...r, ...update } : r)),
    }))
    updateReminderInDB(id, { status: 'DISMISSED' }).catch((err) => {
      console.error('Failed to dismiss reminder:', err)
    })
  },

  addTemplate: (template) => {
    const state = get()
    const userTemplates = state.templates.filter((t) => t.userId !== null)
    if (state.user.plan === 'FREE' && userTemplates.length >= 3) return
    const now = new Date().toISOString()
    const newTemplate: Template = {
      ...template,
      id: uuid(),
      userId: state.user.id,
      createdAt: now,
      updatedAt: now,
    }
    set({ templates: [...state.templates, newTemplate] })
    insertTemplate(newTemplate).catch((err) => {
      console.error('Failed to save template:', err)
      set((s) => ({ templates: s.templates.filter((t) => t.id !== newTemplate.id) }))
    })
  },

  updateTemplate: (id, updates) => {
    set((s) => ({
      templates: s.templates.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }))
    updateTemplateInDB(id, updates).catch((err) => {
      console.error('Failed to update template:', err)
    })
  },

  deleteTemplate: (id) => {
    set((s) => ({ templates: s.templates.filter((t) => t.id !== id) }))
    deleteTemplateFromDB(id).catch((err) => {
      console.error('Failed to delete template:', err)
    })
  },

  upgradePlan: () =>
    set((s) => ({ user: { ...s.user, plan: 'PRO', updatedAt: new Date().toISOString() } })),

  downgradePlan: () =>
    set((s) => ({ user: { ...s.user, plan: 'FREE', updatedAt: new Date().toISOString() } })),
}))
