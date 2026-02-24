'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'
import { DataProvider } from '@/components/auth/data-provider'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <div className="flex min-h-screen bg-dark-bg">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-auto">
          {children}
        </main>
        <MobileNav />
      </div>
    </DataProvider>
  )
}
