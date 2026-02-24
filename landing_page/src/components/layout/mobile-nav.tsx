'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '📊' },
  { href: '/dashboard/contacts', label: 'Contacts', icon: '👥' },
  { href: '/dashboard/reminders', label: 'Alerts', icon: '🔔' },
  { href: '/dashboard/templates', label: 'Templates', icon: '📝' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export function MobileNav() {
  const pathname = usePathname()
  const reminders = useAppStore((s) => s.reminders)
  const pendingCount = reminders.filter((r) => r.status === 'PENDING').length

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-dark-border bg-dark-card/95 backdrop-blur-md">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors relative',
                isActive ? 'text-brand-400' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.label === 'Alerts' && pendingCount > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
