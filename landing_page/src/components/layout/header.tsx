'use client'

import { useAppStore } from '@/lib/store'

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const user = useAppStore((s) => s.user)

  return (
    <header className="flex items-center justify-between pb-6 border-b border-dark-border mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-200">{user.name}</p>
          <p className="text-xs text-gray-500">{user.plan} Plan</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 font-medium text-sm">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  )
}
