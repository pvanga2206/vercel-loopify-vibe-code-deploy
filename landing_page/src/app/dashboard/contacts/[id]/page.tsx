'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/ui/modal'
import { Badge } from '@/components/ui/badge'
import { STATUS_CONFIG, CHANNEL_CONFIG, formatDate, formatRelativeDate, isOverdue, interpolateTemplate, SCENARIO_CONFIG } from '@/lib/utils'
import type { Channel, ContactStatus } from '@/types'

const CHANNEL_OPTIONS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'IN_PERSON', label: 'In Person' },
  { value: 'OTHER', label: 'Other' },
]

const STATUS_OPTIONS = [
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const contacts = useAppStore((s) => s.contacts)
  const interactions = useAppStore((s) => s.interactions)
  const reminders = useAppStore((s) => s.reminders)
  const templates = useAppStore((s) => s.templates)
  const updateContact = useAppStore((s) => s.updateContact)
  const deleteContact = useAppStore((s) => s.deleteContact)
  const addInteraction = useAppStore((s) => s.addInteraction)
  const addReminder = useAppStore((s) => s.addReminder)
  const dismissReminder = useAppStore((s) => s.dismissReminder)

  const contact = contacts.find((c) => c.id === id)
  const contactInteractions = interactions
    .filter((i) => i.contactId === id)
    .sort((a, b) => new Date(b.interactedAt).getTime() - new Date(a.interactedAt).getTime())
  const contactReminders = reminders
    .filter((r) => r.contactId === id)
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())

  const [showInteractionForm, setShowInteractionForm] = useState(false)
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [showTemplatePreview, setShowTemplatePreview] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [intChannel, setIntChannel] = useState<Channel>('EMAIL')
  const [intNotes, setIntNotes] = useState('')
  const [intDate, setIntDate] = useState(new Date().toISOString().split('T')[0])

  const [remDate, setRemDate] = useState('')
  const [remMessage, setRemMessage] = useState('')

  if (!contact) {
    return (
      <div className="text-center py-20">
        <p className="text-3xl mb-3">🔍</p>
        <p className="text-gray-400">Contact not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => router.push('/dashboard/contacts')}>
          Back to Contacts
        </Button>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[contact.status]

  function handleLogInteraction(e: React.FormEvent) {
    e.preventDefault()
    if (!intNotes.trim()) return
    addInteraction({
      contactId: id,
      channel: intChannel,
      notes: intNotes.trim(),
      interactedAt: new Date(intDate).toISOString(),
    })
    setShowInteractionForm(false)
    setIntNotes('')
    setIntChannel('EMAIL')
    setIntDate(new Date().toISOString().split('T')[0])
  }

  function handleAddReminder(e: React.FormEvent) {
    e.preventDefault()
    if (!remDate) return
    addReminder({
      contactId: id,
      dueDate: new Date(remDate).toISOString(),
      message: remMessage.trim() || null,
    })
    updateContact(id, { nextFollowUpDate: new Date(remDate).toISOString() })
    setShowReminderForm(false)
    setRemDate('')
    setRemMessage('')
  }

  function handleDelete() {
    deleteContact(id)
    router.push('/dashboard/contacts')
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)
  const previewBody = selectedTemplate
    ? interpolateTemplate(selectedTemplate.body, { name: contact.name, company: contact.company, role: contact.role })
    : ''

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.push('/dashboard/contacts')} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Contacts
        </button>
        <span className="text-gray-600">/</span>
        <span className="text-sm text-gray-300">{contact.name}</span>
      </div>

      {/* Contact Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 text-xl font-bold shrink-0">
            {contact.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl font-bold text-gray-100">{contact.name}</h1>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
              {contact.company && <span>🏢 {contact.company}</span>}
              {contact.role && <span>💼 {contact.role}</span>}
              {contact.email && <span>📧 {contact.email}</span>}
              {contact.linkedinUrl && (
                <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">
                  🔗 LinkedIn
                </a>
              )}
            </div>
            {contact.nextFollowUpDate && (
              <p className={`text-xs mt-2 ${isOverdue(contact.nextFollowUpDate) ? 'text-red-400' : 'text-gray-500'}`}>
                Next follow-up: {formatRelativeDate(contact.nextFollowUpDate)}
                {isOverdue(contact.nextFollowUpDate) && ' ⚠️ Overdue'}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Select
              options={STATUS_OPTIONS}
              value={contact.status}
              onChange={(e) => updateContact(id, { status: e.target.value as ContactStatus })}
              className="w-36 text-xs"
            />
            <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interaction Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-100">Interaction History</h2>
              <Button size="sm" onClick={() => setShowInteractionForm(true)}>+ Log Interaction</Button>
            </div>
            {contactInteractions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📝</p>
                <p className="text-sm text-gray-400">No interactions logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactInteractions.map((interaction) => {
                  const channel = CHANNEL_CONFIG[interaction.channel]
                  return (
                    <div key={interaction.id} className="flex gap-3 p-3 rounded-lg bg-dark-surface border border-dark-border">
                      <span className="text-lg shrink-0">{channel.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{channel.label}</Badge>
                          <span className="text-xs text-gray-500">{formatDate(interaction.interactedAt)}</span>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{interaction.notes}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reminders */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-100">Reminders</h2>
              <Button size="sm" variant="secondary" onClick={() => setShowReminderForm(true)}>+ Add</Button>
            </div>
            {contactReminders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No reminders set.</p>
            ) : (
              <div className="space-y-2">
                {contactReminders.map((reminder) => (
                  <div key={reminder.id} className={`p-3 rounded-lg border text-sm ${
                    reminder.status === 'DISMISSED' ? 'bg-dark-surface/50 border-dark-border opacity-50' :
                    isOverdue(reminder.dueDate) ? 'bg-red-500/5 border-red-500/20' :
                    'bg-dark-surface border-dark-border'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        reminder.status === 'DISMISSED' ? 'text-gray-500' :
                        isOverdue(reminder.dueDate) ? 'text-red-400' : 'text-gray-300'
                      }`}>
                        {formatRelativeDate(reminder.dueDate)}
                      </span>
                      {reminder.status === 'PENDING' && (
                        <button
                          onClick={() => dismissReminder(reminder.id)}
                          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                    {reminder.message && <p className="text-xs text-gray-400">{reminder.message}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Templates */}
          <div className="glass-card p-5">
            <h2 className="text-base font-semibold text-gray-100 mb-4">Quick Message</h2>
            <div className="space-y-2">
              {templates.slice(0, 4).map((template) => (
                <button
                  key={template.id}
                  onClick={() => { setSelectedTemplateId(template.id); setShowTemplatePreview(true) }}
                  className="w-full text-left p-3 rounded-lg bg-dark-surface border border-dark-border hover:border-dark-border-hover transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{SCENARIO_CONFIG[template.scenario].icon}</span>
                    <span className="text-xs font-medium text-gray-300">{template.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Log Interaction Modal */}
      <Modal isOpen={showInteractionForm} onClose={() => setShowInteractionForm(false)} title="Log Interaction">
        <form onSubmit={handleLogInteraction} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select
              id="channel"
              label="Channel"
              options={CHANNEL_OPTIONS}
              value={intChannel}
              onChange={(e) => setIntChannel(e.target.value as Channel)}
            />
            <Input
              id="date"
              label="Date"
              type="date"
              value={intDate}
              onChange={(e) => setIntDate(e.target.value)}
            />
          </div>
          <Textarea
            id="notes"
            label="Notes *"
            placeholder="What happened in this interaction?"
            rows={4}
            value={intNotes}
            onChange={(e) => setIntNotes(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowInteractionForm(false)}>Cancel</Button>
            <Button type="submit">Log Interaction</Button>
          </div>
        </form>
      </Modal>

      {/* Add Reminder Modal */}
      <Modal isOpen={showReminderForm} onClose={() => setShowReminderForm(false)} title="Set Reminder">
        <form onSubmit={handleAddReminder} className="space-y-4">
          <Input
            id="remDate"
            label="Follow-up Date *"
            type="date"
            value={remDate}
            onChange={(e) => setRemDate(e.target.value)}
            required
          />
          <Textarea
            id="remMessage"
            label="Reminder Note"
            placeholder="What should you remember?"
            rows={3}
            value={remMessage}
            onChange={(e) => setRemMessage(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowReminderForm(false)}>Cancel</Button>
            <Button type="submit">Set Reminder</Button>
          </div>
        </form>
      </Modal>

      {/* Template Preview Modal */}
      <Modal isOpen={showTemplatePreview} onClose={() => setShowTemplatePreview(false)} title={selectedTemplate?.title || 'Template Preview'} className="max-w-xl">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-dark-surface border border-dark-border">
            <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{previewBody}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Variables auto-filled from contact profile</p>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(previewBody)
                setShowTemplatePreview(false)
              }}
            >
              📋 Copy to Clipboard
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Contact">
        <p className="text-sm text-gray-400 mb-4">
          Are you sure you want to delete <strong className="text-gray-200">{contact.name}</strong>?
          This will also remove all their interactions and reminders. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Contact</Button>
        </div>
      </Modal>
    </div>
  )
}
