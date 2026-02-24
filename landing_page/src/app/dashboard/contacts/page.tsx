'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { STATUS_CONFIG, formatRelativeDate, isOverdue } from '@/lib/utils'
import type { ContactStatus } from '@/types'
import Link from 'next/link'

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEWING', label: 'Interviewing' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'ARCHIVED', label: 'Archived' },
]

const STATUS_FORM_OPTIONS = STATUS_OPTIONS.filter((o) => o.value !== 'ALL')

export default function ContactsPage() {
  const contacts = useAppStore((s) => s.contacts)
  const user = useAppStore((s) => s.user)
  const addContact = useAppStore((s) => s.addContact)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formLinkedin, setFormLinkedin] = useState('')
  const [formStatus, setFormStatus] = useState<ContactStatus>('NETWORKING')

  const filtered = contacts
    .filter((c) => filter === 'ALL' || c.status === filter)
    .filter((c) => {
      const q = search.toLowerCase()
      return !q || c.name.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.role?.toLowerCase().includes(q)
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const canAdd = user.plan === 'PRO' || contacts.length < 15

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formName.trim()) return
    addContact({
      name: formName.trim(),
      email: formEmail.trim() || null,
      company: formCompany.trim() || null,
      role: formRole.trim() || null,
      linkedinUrl: formLinkedin.trim() || null,
      status: formStatus,
      nextFollowUpDate: null,
    })
    setShowForm(false)
    setFormName('')
    setFormEmail('')
    setFormCompany('')
    setFormRole('')
    setFormLinkedin('')
    setFormStatus('NETWORKING')
  }

  return (
    <div>
      <Header title="Contacts" subtitle={`${contacts.length} contacts · ${user.plan === 'FREE' ? `${15 - contacts.length} remaining on Free` : 'Unlimited'}`} />

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select
          options={STATUS_OPTIONS}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-44"
        />
        <div className="sm:ml-auto">
          <Button onClick={() => setShowForm(true)} disabled={!canAdd}>
            + Add Contact
          </Button>
        </div>
      </div>

      {/* Contact List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-3xl mb-3">👥</p>
          <p className="text-gray-400">
            {contacts.length === 0 ? 'No contacts yet. Add your first one!' : 'No contacts match your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((contact) => {
            const statusConfig = STATUS_CONFIG[contact.status]
            return (
              <Link
                key={contact.id}
                href={`/dashboard/contacts/${contact.id}`}
                className="glass-card p-4 flex items-center gap-4 hover:border-dark-border-hover transition-all duration-200 group block"
              >
                <div className="w-10 h-10 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 font-medium shrink-0">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-200 group-hover:text-brand-400 transition-colors">
                      {contact.name}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                    {contact.company && <span>{contact.company}</span>}
                    {contact.company && contact.role && <span>·</span>}
                    {contact.role && <span>{contact.role}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  {contact.nextFollowUpDate ? (
                    <p className={`text-xs ${isOverdue(contact.nextFollowUpDate) ? 'text-red-400' : 'text-gray-500'}`}>
                      {isOverdue(contact.nextFollowUpDate) ? '⚠️ ' : ''}
                      {formatRelativeDate(contact.nextFollowUpDate)}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600">No follow-up set</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Add Contact Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Contact">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Name *"
            placeholder="e.g. Sarah Chen"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="sarah@company.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
            <Input
              id="company"
              label="Company"
              placeholder="TechCorp"
              value={formCompany}
              onChange={(e) => setFormCompany(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="role"
              label="Role"
              placeholder="Engineering Manager"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value)}
            />
            <Select
              id="status"
              label="Status"
              options={STATUS_FORM_OPTIONS}
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as ContactStatus)}
            />
          </div>
          <Input
            id="linkedin"
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/..."
            value={formLinkedin}
            onChange={(e) => setFormLinkedin(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Add Contact</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
