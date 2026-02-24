import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildDailyDigestEmail } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, reminders } = body

    const html = buildDailyDigestEmail(name || 'there', reminders || [])

    const result = await resend.emails.send({
      from: 'Loopify <onboarding@resend.dev>',
      to: email,
      reply_to: email,
      subject: `🔔 Your Loopify Daily Follow-Up Digest`,
      html,
    })

    return NextResponse.json({ ok: true, id: result.data?.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email send failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
