'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/components/auth/user-provider'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/contacts', label: 'Contacts', icon: '👥' },
  { href: '/dashboard/reminders', label: 'Reminders', icon: '🔔' },
  { href: '/dashboard/templates', label: 'Templates', icon: '📝' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const storeUser = useAppStore((s) => s.user)
  const reminders = useAppStore((s) => s.reminders)
  const pendingCount = reminders.filter((r) => r.status === 'PENDING').length
  const { user: authUser, signOut } = useAuth()

  const displayName = authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || storeUser.name
  const displayEmail = authUser?.email || storeUser.email
  const displayInitial = displayName.charAt(0).toUpperCase()
  const plan = storeUser.plan

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r border-dark-border bg-dark-card min-h-screen">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
            L
          </div>
          <span className="text-xl font-bold text-gray-100">Loopify</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-brand-600/10 text-brand-400 border border-brand-600/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              )}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Reminders' && pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 m-3 rounded-lg border border-dark-border bg-dark-surface">
        <div className="flex items-center gap-3 mb-3">
          {authUser?.user_metadata?.avatar_url ? (
            <img
              src={authUser.user_metadata.avatar_url}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 text-sm font-medium">
              {displayInitial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            plan === 'PRO' ? 'bg-amber-400/10 text-amber-400' : 'bg-gray-400/10 text-gray-400'
          )}>
            {plan} Plan
          </span>
          {authUser && (
            <button
              onClick={signOut}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-1"
              title="Sign out"
            >
              Sign out →
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
