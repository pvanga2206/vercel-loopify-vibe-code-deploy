'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { formatDate, formatRelativeDate, isOverdue, isDueToday } from '@/lib/utils'
import Link from 'next/link'

type FilterType = 'ALL' | 'OVERDUE' | 'TODAY' | 'UPCOMING' | 'DISMISSED'

export default function RemindersPage() {
  const reminders = useAppStore((s) => s.reminders)
  const contacts = useAppStore((s) => s.contacts)
  const dismissReminder = useAppStore((s) => s.dismissReminder)
  const [filter, setFilter] = useState<FilterType>('ALL')

  const enriched = reminders.map((r) => ({
    ...r,
    contact: contacts.find((c) => c.id === r.contactId),
  }))

  const filtered = enriched
    .filter((r) => {
      switch (filter) {
        case 'OVERDUE': return r.status === 'PENDING' && isOverdue(r.dueDate)
        case 'TODAY': return r.status === 'PENDING' && isDueToday(r.dueDate)
        case 'UPCOMING': return r.status === 'PENDING' && !isOverdue(r.dueDate) && !isDueToday(r.dueDate)
        case 'DISMISSED': return r.status === 'DISMISSED'
        default: return true
      }
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const overdueCount = enriched.filter((r) => r.status === 'PENDING' && isOverdue(r.dueDate)).length
  const todayCount = enriched.filter((r) => r.status === 'PENDING' && isDueToday(r.dueDate)).length
  const upcomingCount = enriched.filter((r) => r.status === 'PENDING' && !isOverdue(r.dueDate) && !isDueToday(r.dueDate)).length

  const FILTER_TABS: { key: FilterType; label: string; count?: number }[] = [
    { key: 'ALL', label: 'All', count: enriched.length },
    { key: 'OVERDUE', label: 'Overdue', count: overdueCount },
    { key: 'TODAY', label: 'Today', count: todayCount },
    { key: 'UPCOMING', label: 'Upcoming', count: upcomingCount },
    { key: 'DISMISSED', label: 'Dismissed' },
  ]

  return (
    <div>
      <Header title="Reminders" subtitle="Stay on top of every follow-up" />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
          <p className="text-xs text-gray-500 mt-1">Overdue</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{todayCount}</p>
          <p className="text-xs text-gray-500 mt-1">Due Today</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-brand-400">{upcomingCount}</p>
          <p className="text-xs text-gray-500 mt-1">Upcoming</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === tab.key
                ? 'bg-brand-600/10 text-brand-400 border border-brand-600/20'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Reminder List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-3xl mb-3">🔔</p>
          <p className="text-gray-400">
            {filter === 'ALL' ? 'No reminders yet. Set one from a contact page!' : 'No reminders match this filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reminder) => {
            const overdue = reminder.status === 'PENDING' && isOverdue(reminder.dueDate)
            const today = reminder.status === 'PENDING' && isDueToday(reminder.dueDate)
            return (
              <div
                key={reminder.id}
                className={`glass-card p-4 flex items-center gap-4 ${
                  reminder.status === 'DISMISSED' ? 'opacity-50' :
                  overdue ? 'border-red-500/20' :
                  today ? 'border-amber-500/20' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                  reminder.status === 'DISMISSED' ? 'bg-gray-500' :
                  overdue ? 'bg-red-400 animate-pulse-soft' :
                  today ? 'bg-amber-400' : 'bg-brand-400'
                }`} />
                <Link
                  href={`/dashboard/contacts/${reminder.contactId}`}
                  className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 text-sm font-medium shrink-0 hover:bg-brand-600/30 transition-colors"
                >
                  {reminder.contact?.name.charAt(0) || '?'}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/contacts/${reminder.contactId}`}
                      className="text-sm font-medium text-gray-200 hover:text-brand-400 transition-colors"
                    >
                      {reminder.contact?.name || 'Unknown Contact'}
                    </Link>
                    {reminder.contact?.company && (
                      <span className="text-xs text-gray-500">at {reminder.contact.company}</span>
                    )}
                  </div>
                  {reminder.message && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{reminder.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs ${
                    reminder.status === 'DISMISSED' ? 'text-gray-500 line-through' :
                    overdue ? 'text-red-400' :
                    today ? 'text-amber-400' : 'text-gray-500'
                  }`}>
                    {formatRelativeDate(reminder.dueDate)}
                  </span>
                  {reminder.status === 'PENDING' && (
                    <Button size="sm" variant="ghost" onClick={() => dismissReminder(reminder.id)}>
                      ✓ Done
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
