import type { Metadata } from 'next'
import { UserProvider } from '@/components/auth/user-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Loopify — Follow-Up & Networking Reminder Engine',
  description: 'Never miss a follow-up again. Loopify tracks your professional contacts, logs interactions, and nudges you at exactly the right moment.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark-bg text-gray-200 antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
