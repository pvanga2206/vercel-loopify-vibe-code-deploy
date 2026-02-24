import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as unknown as { metadata?: Record<string, string>; customer?: string | null }
      const userId = session.metadata?.userId
      const customerId = session.customer as string

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'PRO', stripeCustomerId: customerId },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customer = await stripe.customers.retrieve(subscription.customer as string)

      if (customer.deleted) break

      const email = (customer as Stripe.Customer).email
      if (email) {
        await prisma.user.update({
          where: { email },
          data: { plan: 'FREE' },
        })
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
