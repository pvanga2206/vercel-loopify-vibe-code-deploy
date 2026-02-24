import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type ContactStatus, type Channel, type TemplateScenario } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STATUS_CONFIG: Record<ContactStatus, { label: string; color: string; bg: string }> = {
  NETWORKING: { label: 'Networking', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  APPLIED: { label: 'Applied', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
  INTERVIEWING: { label: 'Interviewing', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  OFFER: { label: 'Offer', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  CLOSED: { label: 'Closed', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
  ARCHIVED: { label: 'Archived', color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
}

export const CHANNEL_CONFIG: Record<Channel, { label: string; icon: string }> = {
  EMAIL: { label: 'Email', icon: '📧' },
  LINKEDIN: { label: 'LinkedIn', icon: '💼' },
  PHONE: { label: 'Phone', icon: '📞' },
  IN_PERSON: { label: 'In Person', icon: '🤝' },
  OTHER: { label: 'Other', icon: '💬' },
}

export const SCENARIO_CONFIG: Record<TemplateScenario, { label: string; icon: string }> = {
  THANK_YOU: { label: 'Thank You', icon: '🙏' },
  RECONNECT: { label: 'Reconnect', icon: '🔄' },
  REFERRAL_REQUEST: { label: 'Referral Request', icon: '🤝' },
  APPLICATION_FOLLOWUP: { label: 'Application Follow-up', icon: '📋' },
  CUSTOM: { label: 'Custom', icon: '✏️' },
}

export function interpolateTemplate(body: string, contact: { name: string; company?: string | null; role?: string | null }): string {
  return body
    .replace(/\{\{name\}\}/g, contact.name)
    .replace(/\{\{company\}\}/g, contact.company || '[Company]')
    .replace(/\{\{role\}\}/g, contact.role || '[Role]')
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = target.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  return formatDate(date)
}

export function isOverdue(date: string | Date): boolean {
  return new Date(date) < new Date(new Date().toDateString())
}

export function isDueToday(date: string | Date): boolean {
  const today = new Date().toDateString()
  return new Date(date).toDateString() === today
}
