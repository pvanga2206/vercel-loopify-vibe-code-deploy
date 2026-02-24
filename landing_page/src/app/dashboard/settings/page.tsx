'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { cn } from '@/lib/utils'

function SettingsContent() {
  const user = useAppStore((s) => s.user)
  const contacts = useAppStore((s) => s.contacts)
  const templates = useAppStore((s) => s.templates)
  const downgradePlan = useAppStore((s) => s.downgradePlan)
  const upgradePlan = useAppStore((s) => s.upgradePlan)

  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showTestEmail, setShowTestEmail] = useState(false)
  const [testEmailSending, setTestEmailSending] = useState(false)
  const [testEmailResult, setTestEmailResult] = useState<string | null>(null)

  const userTemplates = templates.filter((t) => t.userId !== null)

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      upgradePlan()
      setShowSuccess(true)
    }
  }, [searchParams, upgradePlan])

  async function handleUpgrade() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Failed to create checkout session')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendTestReminder() {
    setTestEmailSending(true)
    setTestEmailResult(null)
    try {
      const res = await fetch('/api/send-test-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name.split(' ')[0],
          reminders: contacts.slice(0, 3).map((c) => ({
            contact: { name: c.name, company: c.company, role: c.role },
            message: 'Follow up on next steps',
            dueDate: new Date().toISOString(),
          })),
        }),
      })
      const data = await res.json()
      setTestEmailResult(data.ok ? 'success' : data.error || 'Error')
    } catch {
      setTestEmailResult('Network error')
    } finally {
      setTestEmailSending(false)
    }
  }

  return (
    <div>
      <Header title="Settings" subtitle="Manage your account and subscription" />

      {/* Upgrade success toast */}
      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
          <span className="text-xl">🎉</span>
          <div>
            <p className="text-sm font-semibold text-emerald-400">You&apos;re now on Pro!</p>
            <p className="text-xs text-gray-400">Unlimited contacts, templates, and AI suggestions unlocked.</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="ml-auto text-gray-500 hover:text-gray-300 text-lg">×</button>
        </div>
      )}

      {/* Profile */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-100 mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-100">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-100 mb-4">Subscription</h2>
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-400">{error}</div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Free Plan */}
          <div className={cn(
            'p-5 rounded-xl border transition-all',
            user.plan === 'FREE' ? 'border-brand-600/40 bg-brand-600/5' : 'border-dark-border bg-dark-surface'
          )}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-100">Free</h3>
              {user.plan === 'FREE' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-600/10 text-brand-400 border border-brand-600/20">
                  Current Plan
                </span>
              )}
            </div>
            <p className="text-3xl font-extrabold text-gray-100 mb-4">
              $0<span className="text-sm font-normal text-gray-500"> /forever</span>
            </p>
            <ul className="space-y-2 mb-4">
              {['Up to 15 contacts', '3 custom templates', 'Daily digest reminders'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-brand-400">✓</span> {f}
                </li>
              ))}
            </ul>
            {user.plan === 'PRO' && (
              <Button variant="secondary" className="w-full" onClick={downgradePlan}>
                Downgrade to Free
              </Button>
            )}
          </div>

          {/* Pro Plan */}
          <div className={cn(
            'p-5 rounded-xl border transition-all relative',
            user.plan === 'PRO' ? 'border-amber-500/40 bg-amber-500/5' : 'border-brand-600/30 bg-dark-surface'
          )}>
            {user.plan === 'FREE' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                Recommended
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-100">Pro</h3>
              {user.plan === 'PRO' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  Current Plan
                </span>
              )}
            </div>
            <p className="text-3xl font-extrabold text-gray-100 mb-4">
              $9<span className="text-sm font-normal text-gray-500"> /month</span>
            </p>
            <ul className="space-y-2 mb-4">
              {['Unlimited contacts', 'Unlimited templates', 'AI-generated suggestions', 'Priority reminders'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-amber-400">✓</span> {f}
                </li>
              ))}
            </ul>
            {user.plan === 'FREE' ? (
              <Button className="w-full" onClick={handleUpgrade} disabled={loading}>
                {loading ? 'Redirecting to Stripe...' : '⚡ Upgrade to Pro — $9/mo'}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Email Reminders */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-100">📧 Email Reminders</h2>
          <span className="text-xs text-gray-500">via Resend</span>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Every morning, Loopify sends a daily digest email listing all contacts overdue or due for follow-up. Send yourself a preview now.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setShowTestEmail(true)}>
            📬 Send Test Reminder Email
          </Button>
          {testEmailResult === 'success' && (
            <span className="text-xs text-emerald-400">✓ Email sent to {user.email}</span>
          )}
          {testEmailResult && testEmailResult !== 'success' && (
            <span className="text-xs text-red-400">✗ {testEmailResult}</span>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-100 mb-4">Usage</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-gray-400">Contacts</span>
              <span className="text-sm text-gray-300">
                {contacts.length}{user.plan === 'FREE' ? ' / 15' : ' (unlimited)'}
              </span>
            </div>
            {user.plan === 'FREE' && (
              <div className="w-full h-2 rounded-full bg-dark-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (contacts.length / 15) * 100)}%` }}
                />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-gray-400">Custom Templates</span>
              <span className="text-sm text-gray-300">
                {userTemplates.length}{user.plan === 'FREE' ? ' / 3' : ' (unlimited)'}
              </span>
            </div>
            {user.plan === 'FREE' && (
              <div className="w-full h-2 rounded-full bg-dark-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (userTemplates.length / 3) * 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-500/20">
        <h2 className="text-base font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-400 mb-4">These actions are irreversible. Proceed with caution.</p>
        <Button variant="danger" size="sm" disabled>Delete Account (Coming Soon)</Button>
      </div>

      {/* Test Email Confirm Modal */}
      <Modal isOpen={showTestEmail} onClose={() => setShowTestEmail(false)} title="Send Test Reminder Email">
        <p className="text-sm text-gray-400 mb-4">
          This will send a sample daily digest email to <strong className="text-gray-200">{user.email}</strong> with your current pending reminders.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowTestEmail(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowTestEmail(false)
              handleSendTestReminder()
            }}
            disabled={testEmailSending}
          >
            {testEmailSending ? 'Sending...' : '📬 Send Now'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400 text-sm">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  )
}

