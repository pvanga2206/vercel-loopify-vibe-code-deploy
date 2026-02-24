import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, userEmail } = body

    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'Missing userId or userEmail' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Loopify Pro',
              description: 'Unlimited contacts, unlimited templates, AI suggestions, priority reminders',
              images: [],
            },
            unit_amount: 900,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      metadata: { userId },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin}/dashboard/settings?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin}/dashboard/settings`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
