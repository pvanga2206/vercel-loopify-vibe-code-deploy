import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { buildDailyDigestEmail } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'loopify-cron'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const todayStart = new Date(now.toDateString())
  const todayEnd = new Date(todayStart.getTime() + 86400000)

  try {
    const users = await prisma.user.findMany({
      include: {
        reminders: {
          where: {
            status: 'PENDING',
            dueDate: { lte: todayEnd },
          },
          include: { contact: true },
        },
      },
    })

    const results: { email: string; sent: boolean; count: number }[] = []

    for (const user of users) {
      const reminders = user.reminders
      if (reminders.length === 0) continue

      const html = buildDailyDigestEmail(
        user.name,
        reminders.map((r) => ({
          contact: {
            name: r.contact.name,
            company: r.contact.company,
            role: r.contact.role,
          },
          message: r.message,
          dueDate: r.dueDate.toISOString(),
        }))
      )

      try {
        await resend.emails.send({
          from: 'Loopify <onboarding@resend.dev>',
          to: user.email,
          reply_to: user.email,
          subject: `🔔 You have ${reminders.length} follow-up${reminders.length !== 1 ? 's' : ''} due today — Loopify`,
          html,
        })

        await prisma.reminder.updateMany({
          where: {
            userId: user.id,
            status: 'PENDING',
            dueDate: { lte: todayEnd },
          },
          data: { status: 'SENT', sentAt: now },
        })

        results.push({ email: user.email, sent: true, count: reminders.length })
      } catch {
        results.push({ email: user.email, sent: false, count: reminders.length })
      }
    }

    return NextResponse.json({ ok: true, results })
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
