'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState<'github' | null>(null)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function signIn(provider: 'github') {
    setLoading(provider)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <span className="text-2xl font-bold text-gray-100">Loopify</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-100">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to manage your contacts and follow-ups
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* GitHub */}
            <button
              onClick={() => signIn('github')}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-dark-border bg-dark-surface hover:bg-white/5 hover:border-dark-border-hover text-sm font-medium text-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'github' ? (
                <span className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              {loading === 'github' ? 'Redirecting...' : 'Continue with GitHub'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-border text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
              <br />
              New accounts are created automatically on first sign-in.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  )
}
