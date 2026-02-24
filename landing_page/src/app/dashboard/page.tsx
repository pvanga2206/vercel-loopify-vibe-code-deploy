'use client'

import { useAppStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { STATUS_CONFIG, formatRelativeDate, isOverdue, isDueToday } from '@/lib/utils'
import { CHANNEL_CONFIG } from '@/lib/utils'
import Link from 'next/link'

export default function DashboardPage() {
  const contacts = useAppStore((s) => s.contacts)
  const interactions = useAppStore((s) => s.interactions)
  const reminders = useAppStore((s) => s.reminders)

  const activeContacts = contacts.filter((c) => c.status !== 'CLOSED' && c.status !== 'ARCHIVED')
  const dueToday = contacts.filter((c) => c.nextFollowUpDate && isDueToday(c.nextFollowUpDate))
  const overdue = contacts.filter((c) => c.nextFollowUpDate && isOverdue(c.nextFollowUpDate))
  const interviewing = contacts.filter((c) => c.status === 'INTERVIEWING')
  const pendingReminders = reminders.filter((r) => r.status === 'PENDING')

  const recentInteractions = [...interactions]
    .sort((a, b) => new Date(b.interactedAt).getTime() - new Date(a.interactedAt).getTime())
    .slice(0, 5)

  const todayReminders = pendingReminders
    .filter((r) => isDueToday(r.dueDate) || isOverdue(r.dueDate))
    .map((r) => ({ ...r, contact: contacts.find((c) => c.id === r.contactId) }))

  const stats = [
    { label: 'Active Contacts', value: activeContacts.length, trend: `${contacts.length} total`, icon: '👥' },
    { label: 'Due Today', value: dueToday.length, trend: 'Follow up now', icon: '📅' },
    { label: 'Overdue', value: overdue.length, trend: overdue.length > 0 ? 'Action needed' : 'All clear!', icon: '⚠️' },
    { label: 'Interviewing', value: interviewing.length, trend: 'In progress', icon: '🎯' },
  ]

  return (
    <div>
      <Header title="Dashboard" subtitle="Your follow-up command center" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-100">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.label === 'Overdue' && stat.value > 0 ? 'text-red-400' : 'text-brand-400'}`}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Reminders */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-100">Today&apos;s Follow-Ups</h2>
            <Link href="/dashboard/reminders" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </Link>
          </div>
          {todayReminders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-sm text-gray-400">No follow-ups due today. You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-3 p-3 rounded-lg bg-dark-surface border border-dark-border">
                  <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 text-sm font-medium shrink-0">
                    {reminder.contact?.name.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {reminder.contact?.name || 'Unknown Contact'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{reminder.message}</p>
                  </div>
                  <span className={`text-xs shrink-0 ${isOverdue(reminder.dueDate) ? 'text-red-400' : 'text-amber-400'}`}>
                    {isOverdue(reminder.dueDate) ? 'Overdue' : 'Today'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-100">Recent Activity</h2>
            <Link href="/dashboard/contacts" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View contacts →
            </Link>
          </div>
          {recentInteractions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm text-gray-400">No interactions logged yet. Start tracking!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInteractions.map((interaction) => {
                const contact = contacts.find((c) => c.id === interaction.contactId)
                const channel = CHANNEL_CONFIG[interaction.channel]
                return (
                  <div key={interaction.id} className="flex items-start gap-3 p-3 rounded-lg bg-dark-surface border border-dark-border">
                    <span className="text-lg shrink-0 mt-0.5">{channel.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-200">{contact?.name || 'Unknown'}</p>
                        <span className="text-xs text-gray-600">·</span>
                        <span className="text-xs text-gray-500">{channel.label}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{interaction.notes}</p>
                      <p className="text-xs text-gray-600 mt-1">{formatRelativeDate(interaction.interactedAt)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Contacts by Status */}
      <div className="glass-card p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-100">Pipeline Overview</h2>
          <Link href="/dashboard/contacts" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            Manage contacts →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(Object.entries(STATUS_CONFIG) as [string, { label: string; color: string; bg: string }][]).map(([status, config]) => {
            const count = contacts.filter((c) => c.status === status).length
            return (
              <div key={status} className={`p-3 rounded-lg border ${config.bg} text-center`}>
                <p className={`text-xl font-bold ${config.color}`}>{count}</p>
                <p className="text-xs text-gray-400 mt-0.5">{config.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
