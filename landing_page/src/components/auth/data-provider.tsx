'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store'
import {
  upsertUserProfile,
  fetchContacts,
  fetchInteractions,
  fetchReminders,
  fetchUserTemplates,
  DEFAULT_TEMPLATES,
} from '@/lib/supabase/actions'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const setUser = useAppStore((s) => s.setUser)
  const setContacts = useAppStore((s) => s.setContacts)
  const setInteractions = useAppStore((s) => s.setInteractions)
  const setReminders = useAppStore((s) => s.setReminders)
  const setTemplates = useAppStore((s) => s.setTemplates)
  const setLoading = useAppStore((s) => s.setLoading)
  const loading = useAppStore((s) => s.loading)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function loadData() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        setLoading(false)
        router.replace('/login')
        return
      }

      try {
        const [profile, contacts, interactions, reminders, userTemplates] = await Promise.all([
          upsertUserProfile(authUser),
          fetchContacts(authUser.id),
          fetchInteractions(authUser.id),
          fetchReminders(authUser.id),
          fetchUserTemplates(authUser.id),
        ])

        setUser(profile)
        setContacts(contacts)
        setInteractions(interactions)
        setReminders(reminders)
        setTemplates([...DEFAULT_TEMPLATES, ...userTemplates])
      } catch (err) {
        console.error('Failed to load data from Supabase:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setUser, setContacts, setInteractions, setReminders, setTemplates, setLoading])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading your data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
